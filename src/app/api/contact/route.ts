import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validators";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "anonymous-ip";
    const rateCheck = checkRateLimit(`contact:${ip}`, 5, 60000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Masyadong mabilis ang pagpapadala ng mensahe. Maghintay muna." },
        { status: 429 }
      );
    }

    const body = await req.json();

    if (body.honeypot) {
      return NextResponse.json({ success: true, message: "Mensahe natanggap." });
    }

    const validated = contactSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.issues[0]?.message || "Hindi wastong impormasyon." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Matagumpay na naipadala ang mensahe!",
    });
  } catch {
    return NextResponse.json(
      { error: "May aberya sa server." },
      { status: 500 }
    );
  }
}
