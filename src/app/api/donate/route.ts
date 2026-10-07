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
