import { NextRequest, NextResponse } from "next/server";
import { volunteerSchema } from "@/lib/validators";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "anonymous-ip";
    const rateCheck = checkRateLimit(`vol:${ip}`, 5, 60000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Masyadong mabilis ang pagpapadala. Maghintay nang kaunti bago sumubok muli." },
        { status: 429 }
      );
    }

    const body = await req.json();

    // Bot trap check
    if (body.honeypot) {
      return NextResponse.json({ success: true, message: "Registered." });
    }

    const validated = volunteerSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.issues[0]?.message || "Maling datos." },
        { status: 400 }
      );
    }

    // In step 1-2, acknowledge successfully. In step 3-4, writes to Supabase volunteers table.
    return NextResponse.json({
      success: true,
      message: "Matagumpay na naitala ang iyong volunteer sign-up!",
      data: validated.data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "May naganap na aberya sa server." },
      { status: 500 }
    );
  }
}
