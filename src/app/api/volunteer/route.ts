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

    const programName = typeof body?.program === "string" ? body.program : "Sierra Madre Reforestation";
    const { supabase } = await import("@/lib/supabase/client");
    const { error: dbError } = await supabase.from("volunteers").insert([{
      full_name: validated.data.full_name,
      email: validated.data.email,
      phone: validated.data.phone,
      location: validated.data.location || "",
      program: programName,
      skills: validated.data.interests || [],
      availability: validated.data.availability || "",
      message: validated.data.message || "",
      status: "Pending Review",
    }]);

    if (dbError) {
      console.error("Supabase volunteers insert error:", {
        message: dbError.message,
        code: dbError.code,
        details: dbError.details,
        hint: dbError.hint,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Matagumpay na naitala ang iyong volunteer sign-up!",
      data: validated.data,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      { error: "May naganap na aberya sa server." },
      { status: 500 }
    );
  }
}
