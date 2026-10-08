import fs from "fs";
import path from "path";

export interface StoredVolunteer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  interests: string[];
  availability: string;
  program: string;
  message: string;
  status: "Pending Review" | "Approved" | "Rejected";
  createdAt: string;
}

// Memory cache fallback for fast response & serverless compatibility
let inMemoryVolunteers: StoredVolunteer[] = [];

function getStoreFilePath(): string {
  return path.join(process.cwd(), "src", "data", "volunteers_store.json");
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

export function getAllStoredVolunteers(): StoredVolunteer[] {
  try {
    const filePath = getStoreFilePath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const list = JSON.parse(raw);
      if (Array.isArray(list)) {
        inMemoryVolunteers = list;
        return list;
      }
    }
  } catch {
    // fall back to in-memory
  }
  return inMemoryVolunteers;
}

export function saveStoredVolunteer(vol: Omit<StoredVolunteer, "id" | "createdAt" | "status"> & { id?: string; createdAt?: string; status?: StoredVolunteer["status"] }): StoredVolunteer {
  const all = getAllStoredVolunteers();
  const newRecord: StoredVolunteer = {
    id: vol.id || `vol-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    fullName: vol.fullName,
    email: vol.email,
    phone: vol.phone,
    location: vol.location,
    interests: vol.interests || [],
    availability: vol.availability || "Weekends",
    program: vol.program || "Sierra Madre Reforestation",
    message: vol.message || "",
    status: vol.status || "Pending Review",
    createdAt: vol.createdAt || new Date().toISOString(),
  };

  const updated = [newRecord, ...all.filter((item) => item.id !== newRecord.id)];
  inMemoryVolunteers = updated;

  try {
    ensureDataDir();
    const filePath = getStoreFilePath();
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), "utf-8");
  } catch (err) {
    console.error("[volunteerStore write error]", err);
  }

  return newRecord;
}

export function updateStoredVolunteerStatus(id: string, status: StoredVolunteer["status"]): boolean {
  const all = getAllStoredVolunteers();
  let found = false;
  const updated = all.map((item) => {
    if (item.id === id) {
      found = true;
      return { ...item, status };
    }
    return item;
  });

  if (found) {
    inMemoryVolunteers = updated;
    try {
      ensureDataDir();
      const filePath = getStoreFilePath();
      fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), "utf-8");
    } catch (err) {
      console.error("[volunteerStore update error]", err);
    }
  }

  return found;
}

export function deleteStoredVolunteer(id: string): boolean {
  const all = getAllStoredVolunteers();
  const updated = all.filter((item) => item.id !== id);
  inMemoryVolunteers = updated;

  try {
    ensureDataDir();
    const filePath = getStoreFilePath();
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), "utf-8");
  } catch (err) {
    console.error("[volunteerStore delete error]", err);
  }

  return true;
}
