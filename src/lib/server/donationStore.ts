import fs from "fs";
import path from "path";

export interface StoredDonation {
  id: string;
  donorName: string;
  email: string;
  amount: number;
  trees: number;
  paymentMethod: string;
  referenceNo: string;
  proofUrl: string | null;
  status: "Pending" | "Verified" | "Rejected";
  createdAt: string;
}

// Memory cache fallback for fast response & serverless compatibility
let inMemoryDonations: StoredDonation[] = [];

function getStoreFilePath(): string {
  return path.join(process.cwd(), "src", "data", "donations_store.json");
}

function ensureDataDir(): string {
  const dir = path.join(process.cwd(), "src", "data");
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch {
      // ignore
    }
  }
  return dir;
}

export function getAllStoredDonations(): StoredDonation[] {
  try {
    const filePath = getStoreFilePath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const list = JSON.parse(raw);
      if (Array.isArray(list)) {
        inMemoryDonations = list;
        return list;
      }
    }
  } catch {
    // fall back to in-memory
  }
  return inMemoryDonations;
}

export function saveStoredDonation(don: Omit<StoredDonation, "id" | "createdAt" | "status" | "trees"> & { 
  id?: string; 
  trees?: number;
  createdAt?: string; 
  status?: StoredDonation["status"] 
}): StoredDonation {
  const all = getAllStoredDonations();
  const newRecord: StoredDonation = {
    id: don.id || `don-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    donorName: don.donorName || "Anonymous",
    email: don.email,
    amount: don.amount,
    trees: don.trees !== undefined ? don.trees : Math.max(1, Math.floor(don.amount / 250)),
    paymentMethod: don.paymentMethod || "GCash / Bank Transfer",
    referenceNo: don.referenceNo,
    proofUrl: don.proofUrl || null,
    status: don.status || "Pending",
    createdAt: don.createdAt || new Date().toISOString(),
  };

  const updated = [newRecord, ...all.filter((item) => item.id !== newRecord.id)];
  inMemoryDonations = updated;

  try {
    ensureDataDir();
    const filePath = getStoreFilePath();
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), "utf-8");
  } catch (err) {
    console.error("[donationStore write error]", err);
  }

  return newRecord;
}

export function updateStoredDonationStatus(id: string, status: StoredDonation["status"]): boolean {
  const all = getAllStoredDonations();
  let found = false;
  const updated = all.map((item) => {
    if (item.id === id) {
      found = true;
      return { ...item, status };
    }
    return item;
  });

  if (found) {
    inMemoryDonations = updated;
    try {
      ensureDataDir();
      const filePath = getStoreFilePath();
      fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), "utf-8");
    } catch (err) {
      console.error("[donationStore update error]", err);
    }
  }

  return found;
}

export function deleteStoredDonation(id: string): boolean {
  const all = getAllStoredDonations();
  const initialLen = all.length;
  const updated = all.filter((item) => item.id !== id);
  inMemoryDonations = updated;

  try {
    ensureDataDir();
    const filePath = getStoreFilePath();
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), "utf-8");
  } catch (err) {
    console.error("[donationStore delete error]", err);
  }

  return updated.length < initialLen;
}
