export const instant = false;

import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  User, 
  Sparkles 
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
  params: Promise<{ slug: string }>;
}

async function fetchItem(slug: string) {
  // 1. Try announcements table
  const { data: ann } = await supabase
    .from("announcements")
    .select("*")
    .eq("id", slug)
    .maybeSingle();

  if (ann) {
    return {
      id: ann.id,
      type: "news" as const,
      title: ann.title,
      excerpt: ann.summary || ann.body?.slice(0, 160) || "",
      body: ann.body || "",
      event_date: (ann.published_at || ann.created_at || "").split("T")[0],
      location: "National Headquarters / Sierra Madre",
      cover_image: ann.image_url || "/images/bg2.jpg",
      organizer: "Kamalayang Kapwa Kalikasan",
    };
  }

  // 2. Try events table
  const { data: ev } = await supabase
    .from("events")
    .select("*")
    .eq("id", slug)
    .maybeSingle();

  if (ev) {
    return {
      id: ev.id,
      type: "event" as const,
      title: ev.title,
      excerpt: ev.description || "",
      body: ev.description || "",
      event_date: (ev.event_date || ev.created_at || "").split("T")[0],
      location: ev.location || "Tanay, Rizal",
      cover_image: ev.image_url || "/images/bg2.jpg",
      organizer: "Kamalayang Kapwa Kalikasan",
    };
  }

  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    if (!slug) return { title: "Item Not Found | Kamalayang Kapwa Kalikasan" };
    const item = await fetchItem(slug);
    if (!item) return { title: "Item Not Found | Kamalayang Kapwa Kalikasan" };

    return {
      title: `${item.title} | Kamalayang Kapwa Kalikasan`,
      description: item.excerpt,
    };
  } catch {
    return { title: "Item Not Found | Kamalayang Kapwa Kalikasan" };
  }
}

export default async function NewsEventDetailPage({ params }: Props) {
  let slug = "";
  try {
    const resolved = await params;
    slug = resolved?.slug || "";
  } catch {
    notFound();
  }

  if (!slug) {
    notFound();
  }

  let item = null;
  try {
    item = await fetchItem(slug);
  } catch {
    notFound();
  }

  if (!item) {
    notFound();
  }

  return (
    <article className="py-12 md:py-16 text-white bg-subpage-forest1 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Back Link */}
        <div>
          <Link
            href="/news-events"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Bumalik sa Lahat ng Balita at Kaganapan</span>
          </Link>
        </div>

        {/* Post Header */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={item.type === "event" ? "brown" : "default"}>
              {item.type === "event" ? "Kaganapan / Event" : "Balita / News"}
            </Badge>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-300 flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              {formatDate(item.event_date)}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              {item.location}
            </span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
            {item.title}
          </h1>

          {item.organizer && (
            <p className="text-xs text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>Inorganisa ng: <strong className="text-white">{item.organizer}</strong></span>
            </p>
          )}

          {item.excerpt && (
            <p className="text-base sm:text-lg text-slate-200 leading-relaxed italic border-l-4 border-emerald-500 pl-4">
              {item.excerpt}
            </p>
          )}
        </header>

        {/* Cover Image */}
        {item.cover_image && (
          <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border border-white/10 shadow-lg bg-black">
            <Image
              src={item.cover_image}
              alt={item.title}
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
              priority
              unoptimized
            />
          </div>
        )}

        {/* Body Content */}
        <div className="bg-[#0A1B11]/85 backdrop-blur-md rounded-3xl border border-emerald-500/20 p-8 sm:p-12 shadow-xl prose prose-invert max-w-none text-slate-200 leading-relaxed">
          <div className="whitespace-pre-line text-sm sm:text-base leading-relaxed text-slate-200">
            {item.body}
          </div>
        </div>

        {/* Action Callout */}
        <div className="rounded-3xl bg-[#0F2618]/90 border border-emerald-500/30 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-heading font-bold text-xl text-white">
              {item.type === "event" ? "Gusto Mo Bang Sumama sa Kaganapang Ito?" : "Maging Bahagi ng Aming Mga Aksyon"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Magpatala sa pamamagitan ng volunteer sign-up upang makatanggap ng briefing kit at coordinating details.
            </p>
          </div>
          <Link href="/get-involved">
            <Button size="lg" className="shrink-0 bg-[#22C55E] hover:bg-[#16A34A] text-slate-950 font-bold rounded-xl text-xs">
              <Sparkles className="w-4 h-4 mr-1" />
              <span>Magpatala Bilang Volunteer</span>
            </Button>
          </Link>
        </div>

      </div>
    </article>
  );
}
