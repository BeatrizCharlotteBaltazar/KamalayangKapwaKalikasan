"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Trees, 
  MapPin, 
  Calendar, 
  Users, 
  Sparkles, 
  ChevronRight, 
  Heart,
  ArrowRight
} from "lucide-react";
import { fetchPublicPrograms, fetchPublicHomeUpcomingRallies, PublicRallyEvent } from "@/lib/supabase/publicStore";
import { Program } from "@/types";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

type FilterTab = "all" | "programs" | "events" | "ongoing" | "upcoming" | "completed";

export default function ProgramsPage() {
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [events, setEvents] = useState<PublicRallyEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      const [progList, evList] = await Promise.all([
        fetchPublicPrograms(),
        fetchPublicHomeUpcomingRallies(),
      ]);
      setPrograms(progList || []);
      setEvents(evList || []);
    } catch (err) {
      console.error("Error loading programs and events:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      loadData();
    };
    window.addEventListener("kkk_content_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("kkk_content_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Map both into a unified list
  interface UnifiedItem {
    id: string;
    type: "program" | "event";
    title: string;
    description: string;
    detailedContent?: string;
    location: string;
    status: "ongoing" | "upcoming" | "completed";
    date?: string;
    image: string;
    beneficiaries?: string;
    pillars?: string[];
    startDate?: string;
    endDate?: string;
  }

  const unifiedItems: UnifiedItem[] = [
    ...programs.map((p) => {
      const rawStatus = (p.status || "ongoing").toLowerCase();
      const status: "ongoing" | "upcoming" | "completed" =
        rawStatus === "past" || rawStatus === "completed"
          ? "completed"
          : rawStatus === "upcoming"
          ? "upcoming"
          : "ongoing";

      return {
        id: p.id,
        type: "program" as const,
        title: p.title,
        description: p.description,
        detailedContent: p.detailed_content || p.description,
        location: p.location || "",
        status,
        image: p.cover_image || "/images/bg2.jpg",
        beneficiaries: p.beneficiaries || "",
        pillars: p.pillars || [],
        startDate: p.start_date,
        endDate: p.end_date,
      };
    }),
    ...events.map((e) => {
      const rawStatus = (e.status || "upcoming").toLowerCase();
      const status: "ongoing" | "upcoming" | "completed" =
        rawStatus === "ongoing"
          ? "ongoing"
          : rawStatus === "completed" || rawStatus === "past"
          ? "completed"
          : "upcoming";

      return {
        id: e.id,
        type: "event" as const,
        title: e.title,
        description: e.description,
        location: e.location || "",
        status,
        date: e.event_date,
        image: e.image_url || "/images/bg2.jpg",
      };
    }),
  ];

  const filteredItems = unifiedItems.filter((item) => {
    if (filterTab === "all") return true;
    if (filterTab === "programs") return item.type === "program";
    if (filterTab === "events") return item.type === "event";
    if (filterTab === "ongoing") return item.status === "ongoing";
    if (filterTab === "upcoming") return item.status === "upcoming";
    if (filterTab === "completed") return item.status === "completed";
    return true;
  });

  return (
    <div className="py-12 md:py-20 relative overflow-hidden text-white bg-subpage-forest1 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page Title & Intro */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0E2616] border border-emerald-500/30 text-xs font-bold text-emerald-300 shadow-md">
            <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
            <span>Field Missions, Programs &amp; Mobilizations</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
            Programs &amp; <span className="text-[#22C55E]">Events Hub</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            From long-term reforestation canopies in the Sierra Madre to youth-led environmental rallies and coastal cleanups across Luzon.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { id: "all", label: `All Initiatives (${unifiedItems.length})` },
            { id: "programs", label: `Programs (${programs.length})` },
            { id: "events", label: `Events & Rallies (${events.length})` },
            { id: "ongoing", label: "● Active / Ongoing" },
            { id: "upcoming", label: "Upcoming" },
            { id: "completed", label: "Completed" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as FilterTab)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                filterTab === tab.id
                  ? "bg-emerald-600 text-slate-950 font-black shadow-md scale-102"
                  : "bg-white/5 text-slate-300 hover:text-white border border-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Unified Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-[#08180E]/85 rounded-3xl border border-emerald-500/20 p-8 space-y-3 shadow-2xl">
            <Trees className="w-12 h-12 text-emerald-400 mx-auto opacity-60" />
            <h3 className="font-heading text-lg font-bold text-white">
              Walang rekord para sa napiling kategorya
            </h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Walang kasalukuyang programa o kaganapan na tugma sa napiling filter. Pumili ng ibang opsyon o tingnan ang lahat.
            </p>
            {filterTab !== "all" && (
              <button
                type="button"
                onClick={() => setFilterTab("all")}
                className="text-xs font-bold text-emerald-400 hover:underline cursor-pointer"
              >
                Ipakita ang Lahat ng Inisyatiba
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredItems.map((item) => {
              const isExpanded = expandedId === item.id;
              const isEvent = item.type === "event";

              const statusConfig =
                item.status === "ongoing"
                  ? { label: "● Active Field Operations", bg: "bg-[#22C55E] text-slate-950 font-black animate-pulse" }
                  : item.status === "upcoming"
                  ? { label: isEvent ? "Upcoming Mobilization" : "Upcoming Project", bg: "bg-[#F59E0B] text-slate-950 font-bold" }
                  : { label: "Completed / Finished", bg: "bg-slate-700 text-slate-200 font-bold" };

              return (
                <div
                  key={item.id}
                  className="flex flex-col rounded-3xl bg-[#08180E]/85 backdrop-blur-md border border-emerald-500/20 overflow-hidden shadow-2xl hover:border-emerald-500/40 transition-all"
                >
                  {/* Image */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/60">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#08180E] via-transparent to-transparent opacity-80" />
                    
                    <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                      <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase shadow-sm tracking-wide bg-black/60 text-white border border-white/20 backdrop-blur-md">
                        {isEvent ? "Field Action & Rally" : "Conservation Program"}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase shadow-sm tracking-wide ${statusConfig.bg}`}>
                        {statusConfig.label}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      {/* Pillars if program */}
                      {item.pillars && item.pillars.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {item.pillars.map((pillar, idx) => (
                            <span
                              key={idx}
                              className="text-xs font-semibold text-amber-300 bg-amber-950/60 border border-amber-600/30 px-2.5 py-0.5 rounded-lg"
                            >
                              {pillar}
                            </span>
                          ))}
                        </div>
                      )}

                      <h2 className="font-heading text-2xl font-bold text-white leading-snug">
                        {item.title}
                      </h2>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Metadata tags */}
                      <div className="space-y-2 pt-2 border-t border-white/10 text-xs text-slate-300">
                        {item.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span><strong>Location:</strong> {item.location}</span>
                          </div>
                        )}
                        {item.beneficiaries && (
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-[#60A5FA] shrink-0" />
                            <span><strong>Key Partners:</strong> {item.beneficiaries}</span>
                          </div>
                        )}
                        {isEvent && item.date && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#F59E0B] shrink-0" />
                            <span><strong>Event Date:</strong> {formatDate(item.date)}</span>
                          </div>
                        )}
                        {!isEvent && item.startDate && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#F59E0B] shrink-0" />
                            <span><strong>Timeline:</strong> Started {item.startDate} {item.endDate ? `until ${item.endDate}` : "(Ongoing)"}</span>
                          </div>
                        )}
                      </div>

                      {/* Expandable detailed content for programs */}
                      {isExpanded && item.detailedContent && (
                        <div className="pt-4 border-t border-white/10 bg-black/40 p-4 rounded-2xl text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed animate-in fade-in duration-300">
                          {item.detailedContent}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                      {item.detailedContent && item.detailedContent !== item.description ? (
                        <button
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : item.id)}
                          className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                        >
                          <span>{isExpanded ? "Collapse Overview" : "Read Full Field Details"}</span>
                          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                        </button>
                      ) : isEvent ? (
                        <Link
                          href={`/news-events/${item.id}`}
                          className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          <span>View Event Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      ) : (
                        <span />
                      )}

                      <div className="flex items-center gap-2">
                        <Link href={item.status === "completed" ? (isEvent ? `/news-events/${item.id}` : "#") : "/get-involved"}>
                          <Button size="sm" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-xl cursor-pointer">
                            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                            <span>{item.status === "completed" ? "Documentation" : "Volunteer"}</span>
                          </Button>
                        </Link>

                        <Link href="/donate">
                          <Button size="sm" className="bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold rounded-xl cursor-pointer">
                            <Heart className="w-3.5 h-3.5 fill-white" />
                            <span>Support</span>
                          </Button>
                        </Link>
                      </div>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Partnership Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-[#0E2817] via-[#08180E] to-[#040E07] border border-emerald-500/30 text-white p-8 sm:p-10 text-center space-y-4 shadow-2xl">
          <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
            Have a Project or Rally Proposal for Your Community?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Kamalayang Kapwa Kalikasan welcomes collaborations with local barangays, universities, and civil society groups for tree-growing, cleanups, eco-training, and climate rallies.
          </p>
          <div className="pt-2">
            <Link href="/contact">
              <Button className="bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-extrabold text-xs px-6 py-2.5 rounded-xl cursor-pointer">
                Contact Our Community Outreach Team &rarr;
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
