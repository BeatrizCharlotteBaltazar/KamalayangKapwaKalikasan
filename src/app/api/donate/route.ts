import { NextRequest, NextResponse } from "next/server";
import { donationSchema } from "@/lib/validators";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "anonymous-ip";
    const rateCheck = checkRateLimit(`donate:${ip}`, 5, 60000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Masyadong mabilis ang pagpapadala. Maghintay muna." },
        { status: 429 }
      );
    }

    const body = await req.json();

    if (body.honeypot) {
      return NextResponse.json({ success: true, message: "Naitala ang donasyon." });
    }

    const validated = donationSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.issues[0]?.message || "Hindi wastong detalye ng donasyon." },
        { status: 400 }
      );
    }

    const paymentMethod = typeof body?.payment_method === "string" ? body.payment_method : "GCash";
    const { supabase } = await import("@/lib/supabase/client");
    const { error: dbError } = await supabase.from("donations").insert([{
      donor_name: validated.data.donor_name,
      email: validated.data.email,
      amount: validated.data.amount,
      trees: Math.floor(Number(validated.data.amount) / 250),
      payment_method: paymentMethod,
      reference_no: validated.data.reference_no,
      proof_url: validated.data.proof_url || null,
      status: "Pending",
    }]);

    if (dbError) {
      console.error("Supabase donations insert error:", {
        message: dbError.message,
        code: dbError.code,
        details: dbError.details,
        hint: dbError.hint,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Matagumpay na naitala ang impormasyon ng inyong donasyon. Ito ay susuriin (Pending).",
      data: validated.data,
    });
  } catch {
    return NextResponse.json(
      { error: "May aberya sa server." },
      { status: 500 }
    );
  }
}
