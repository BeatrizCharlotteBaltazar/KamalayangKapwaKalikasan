import { NextRequest, NextResponse } from "next/server";
import { donationSchema } from "@/lib/validators";
import { checkRateLimit } from "@/lib/rate-limit";
import { 
  getAllStoredDonations, 
  saveStoredDonation, 
  updateStoredDonationStatus, 
  deleteStoredDonation 
} from "@/lib/server/donationStore";

export async function GET() {
  const donations = getAllStoredDonations();
  return NextResponse.json({ success: true, donations });
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "anonymous-ip";
    const maxRequests = (ip === "anonymous-ip" || ip === "127.0.0.1" || ip.includes("::1")) ? 120 : 15;
    const rateCheck = checkRateLimit(`donate:${ip}`, maxRequests, 60000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Masyadong mabilis ang pagpapadala. Maghintay nang kaunti bago sumubok muli." },
        { status: 429 }
      );
    }

    const body = await req.json();

    // Bot trap check: only if non-empty string
    if (typeof body.honeypot === "string" && body.honeypot.trim().length > 0) {
      return NextResponse.json({ success: true, message: "Naitala ang donasyon." });
    }

    const donorName = (body.donor_name && String(body.donor_name).trim()) 
      ? String(body.donor_name).trim() 
      : "Anonymous";
    const email = (body.email && String(body.email).trim()) 
      ? String(body.email).trim() 
      : "donor@kkk-ngo.org";
    const amountNum = Number(body.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return NextResponse.json(
        { error: "Kailangang positibong numero ang halaga ng donasyon." },
        { status: 400 }
      );
    }
    const refNo = (body.reference_no && String(body.reference_no).trim()) 
      ? String(body.reference_no).trim() 
      : "";
    if (!refNo || refNo.length < 2) {
      return NextResponse.json(
        { error: "Kailangan ang Reference Number mula sa inyong GCash o bank receipt." },
        { status: 400 }
      );
    }
    const paymentMethod = typeof body?.payment_method === "string" && body.payment_method.trim() 
      ? body.payment_method.trim() 
      : "GCash";
    const proofUrl = body.proof_url || null;

    // 1. Store in server-side persistent store (guarantees admin visibility)
    const stored = saveStoredDonation({
      donorName,
      email,
      amount: amountNum,
      trees: Math.max(1, Math.floor(amountNum / 250)),
      paymentMethod,
      referenceNo: refNo,
      proofUrl,
      status: "Pending",
    });

    // 2. Also attempt insert to Supabase donations table
    try {
      const { supabase } = await import("@/lib/supabase/client");
      const { error: dbError } = await supabase.from("donations").insert([{
        donor_name: donorName,
        email,
        amount: amountNum,
        trees: Math.max(1, Math.floor(amountNum / 250)),
        payment_method: paymentMethod,
        reference_no: refNo,
        proof_url: proofUrl,
        status: "Pending",
      }]);

      if (dbError) {
        console.warn("Supabase donations insert note (persisted in server store):", dbError.message);
      }
    } catch (err: any) {
      console.warn("Supabase donations exception (persisted in server store):", err?.message);
    }

    return NextResponse.json({
      success: true,
      message: "Matagumpay na naitala ang donasyon! Susuriin ng aming koponan ang inyong reference number at makikipag-ugnayan sa inyo.",
      data: stored,
    });
  } catch (error: any) {
    console.error("[Donation POST Exception]", error);
    return NextResponse.json(
      { error: "May naganap na aberya sa server." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: "Missing id or status." }, { status: 400 });
    }
    const ok = updateStoredDonationStatus(id, status);
    return NextResponse.json({ success: ok });
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing id." }, { status: 400 });
    }
    const ok = deleteStoredDonation(id);
    return NextResponse.json({ success: ok });
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
