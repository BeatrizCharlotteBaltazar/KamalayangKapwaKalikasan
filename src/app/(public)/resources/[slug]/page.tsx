export const instant = false;

import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Share2, 
  BookOpen, 
  Leaf, 
  Sparkles 
} from "lucide-react";
import { fetchPublicResourceBySlugOrId, fetchRelatedResources } from "@/lib/supabase/publicStore";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    if (!slug) return { title: "Gabay at Edukasyon | Kamalayang Kapwa Kalikasan" };
    const resource = await fetchPublicResourceBySlugOrId(slug);
    if (!resource) return { title: "Artikulo Hindi Natagpuan | Kamalayang Kapwa Kalikasan" };

    return {
      title: `${resource.title} | Kamalayang Kapwa Kalikasan`,
      description: resource.summary,
    };
  } catch {
    return { title: "Gabay at Edukasyon | Kamalayang Kapwa Kalikasan" };
  }
}

export default async function ResourceDetailPage({ params }: Props) {
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

  let resource = null;
  try {
    resource = await fetchPublicResourceBySlugOrId(slug);
  } catch {
    notFound();
  }

  if (!resource) {
    notFound();
  }

  let related: any[] = [];
  try {
    related = await fetchRelatedResources(resource.category, resource.id);
  } catch {
    related = [];
  }

  return (
    <article className="py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Back Link */}
        <div>
          <Link
            href="/resources"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2E5E34] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Bumalik sa Lahat ng Gabay at Edukasyon</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="accent" className="font-bold">
              {resource.category}
            </Badge>
            <span className="text-xs text-[#5B655C]">•</span>
            <span className="text-xs text-[#5B655C] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#5A8F3E]" />
              {resource.read_time}
            </span>
            <span className="text-xs text-[#5B655C]">•</span>
            <span className="text-xs text-[#5B655C] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#8B5A2B]" />
              {formatDate(resource.published_at)}
            </span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1E2A1F] leading-tight">
            {resource.title}
          </h1>

          <p className="text-base sm:text-lg text-[#5B655C] leading-relaxed italic border-l-4 border-[#2E5E34] pl-4">
            {resource.summary}
          </p>
        </header>

        {/* Hero Image */}
        <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border-2 border-white shadow-lg bg-[#EAF1E4]">
          <Image
            src={resource.cover_image}
            alt={resource.title}
            fill
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover"
            priority
          />
        </div>

        {/* Article Body Content */}
        <div className="bg-white rounded-3xl border border-[#2E5E34]/15 p-8 sm:p-12 shadow-xs prose prose-green max-w-none text-[#1E2A1F] leading-relaxed space-y-4">
          <div className="whitespace-pre-line text-sm sm:text-base leading-relaxed text-[#1E2A1F]/90">
            {resource.content}
          </div>

          {/* Tags */}
          {resource.tags && resource.tags.length > 0 && (
            <div className="pt-8 border-t border-[#2E5E34]/10 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#8B5A2B]">Mga Paksa:</span>
              {resource.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs bg-[#F8F5EE] text-[#2E5E34] px-3 py-1 rounded-full border border-[#2E5E34]/10 font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Callout */}
        <div className="rounded-3xl bg-[#EAF1E4] border border-[#2E5E34]/20 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-heading font-bold text-lg text-[#1E2A1F]">
              Gusto mo bang maging bahagi ng aming mga workshop?
            </h3>
            <p className="text-xs text-[#5B655C]">
              Magpatala bilang boluntaryo o mag-imbita ng tagapagsalita sa inyong paaralan o barangay.
            </p>
          </div>
          <Link href="/get-involved">
            <Button variant="primary" size="sm" className="shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Magpatala Bilang Volunteer</span>
            </Button>
          </Link>
        </div>

        {/* Related Guides */}
        {related.length > 0 && (
          <div className="pt-8 space-y-6">
            <h3 className="font-heading text-2xl font-bold text-[#1E2A1F]">
              Iba Pang Gabay sa {resource.category}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/resources/${rel.slug}`}
                  className="p-5 rounded-2xl bg-white border border-[#2E5E34]/15 hover:border-[#2E5E34]/40 hover:shadow-md transition-all group"
                >
                  <h4 className="font-heading font-bold text-base text-[#1E2A1F] group-hover:text-[#2E5E34] leading-snug">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-[#5B655C] mt-2 line-clamp-2">
                    {rel.summary}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </article>
  );
}
