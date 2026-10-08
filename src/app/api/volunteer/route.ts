import { NextRequest, NextResponse } from "next/server";
import { volunteerSchema } from "@/lib/validators";
import { checkRateLimit } from "@/lib/rate-limit";
import { 
  getAllStoredVolunteers, 
  saveStoredVolunteer, 
  updateStoredVolunteerStatus, 
  deleteStoredVolunteer 
} from "@/lib/server/volunteerStore";

export async function GET() {
  const volunteers = getAllStoredVolunteers();
  return NextResponse.json({ success: true, volunteers });
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "anonymous-ip";
    const rateCheck = checkRateLimit(`vol:${ip}`, 10, 60000);
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
    
    // 1. Store in server-side persistent store (guarantees admin visibility)
    const stored = saveStoredVolunteer({
      fullName: validated.data.full_name,
      email: validated.data.email,
      phone: validated.data.phone,
      location: validated.data.location || "",
      interests: validated.data.interests || [],
      availability: validated.data.availability || "Weekends",
      program: programName,
      message: validated.data.message || "",
      status: "Pending Review",
    });

    // 2. Also attempt insert to Supabase volunteers table with exact existing schema columns
    try {
      const { supabase } = await import("@/lib/supabase/client");
      const { error: dbError } = await supabase.from("volunteers").insert([{
        full_name: validated.data.full_name,
        email: validated.data.email,
        phone: validated.data.phone,
        location: validated.data.location || "",
        interests: validated.data.interests || [],
        availability: validated.data.availability || "Weekends",
        message: validated.data.message || "",
      }]);

      if (dbError) {
        console.warn("Supabase volunteers insert note (saved in server store):", dbError.message);
      }
    } catch (err: any) {
      console.warn("Supabase volunteers exception (saved in server store):", err?.message);
    }

    return NextResponse.json({
      success: true,
      message: "Matagumpay na naitala ang iyong volunteer sign-up!",
      data: stored,
    });
  } catch (_error: unknown) {
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
    const ok = updateStoredVolunteerStatus(id, status);
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
    const ok = deleteStoredVolunteer(id);
    return NextResponse.json({ success: ok });
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
