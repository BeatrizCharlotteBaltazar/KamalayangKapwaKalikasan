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
  Share2, 
  Sparkles, 
  Clock 
} from "lucide-react";
import { newsEventsData } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return newsEventsData.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = newsEventsData.find((n) => n.slug === slug);
  if (!item) return { title: "Balita Hindi Natagpuan" };

  return {
    title: `${item.title} | Kamalayang Kapwa Kalikasan`,
    description: item.excerpt,
  };
}

export default async function NewsEventDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = newsEventsData.find((n) => n.slug === slug);

  if (!item) {
    notFound();
  }

  return (
    <article className="py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Back Link */}
        <div>
          <Link
            href="/news-events"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2E5E34] hover:underline"
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
            <span className="text-xs text-[#5B655C]">•</span>
            <span className="text-xs text-[#5B655C] flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#2E5E34]" />
              {formatDate(item.event_date)}
            </span>
            <span className="text-xs text-[#5B655C]">•</span>
            <span className="text-xs text-[#5B655C] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#8B5A2B]" />
              {item.location}
            </span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1E2A1F] leading-tight">
            {item.title}
          </h1>

          {item.organizer && (
            <p className="text-xs text-[#5B655C] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#5A8F3E]" />
              <span>Inorganisa ng: <strong>{item.organizer}</strong></span>
            </p>
          )}

          <p className="text-base sm:text-lg text-[#5B655C] leading-relaxed italic border-l-4 border-[#2E5E34] pl-4">
            {item.excerpt}
          </p>
        </header>

        {/* Cover Image */}
        <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border-2 border-white shadow-lg bg-[#EAF1E4]">
          <Image
            src={item.cover_image}
            alt={item.title}
            fill
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover"
            priority
          />
        </div>

        {/* Body Content */}
        <div className="bg-white rounded-3xl border border-[#2E5E34]/15 p-8 sm:p-12 shadow-xs prose prose-green max-w-none text-[#1E2A1F] leading-relaxed">
          <div className="whitespace-pre-line text-sm sm:text-base leading-relaxed text-[#1E2A1F]/90">
            {item.body}
          </div>
        </div>

        {/* RSVP or Volunteer Callout */}
        <div className="rounded-3xl bg-[#EAF1E4] border border-[#2E5E34]/20 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-heading font-bold text-xl text-[#1E2A1F]">
              {item.type === "event" ? "Gusto Mo Bang Sumama sa Kaganapang Ito?" : "Maging Bahagi ng Aming Mga Aksyon"}
            </h3>
            <p className="text-xs sm:text-sm text-[#5B655C]">
              Magpatala sa pamamagitan ng volunteer sign-up upang makatanggap ng briefing kit at coordinating details.
            </p>
          </div>
          <Link href="/get-involved">
            <Button variant="primary" size="lg" className="shrink-0">
              <Sparkles className="w-4 h-4" />
              <span>Magpatala Bilang Volunteer</span>
            </Button>
          </Link>
        </div>

      </div>
    </article>
  );
}
