"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, Sparkles, Trees, Calendar, Megaphone } from "lucide-react";
import { fetchPublicPrograms, fetchPublicHomeUpcomingRallies } from "@/lib/supabase/publicStore";
import { Button } from "@/components/ui/button";

interface FeaturedActionItem {
  id: string;
  type: "program" | "event";
  title: string;
  tagline: string;
  location: string;
  status: "ongoing" | "upcoming" | "completed";
  impact?: string;
  color: string;
  themeBadge: string;
  buttonColor: string;
  image: string;
  category: string;
  href: string;
}

export function FeaturedPrograms() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [items, setItems] = useState<FeaturedActionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      const [programsList, ralliesList] = await Promise.all([
        fetchPublicPrograms(),
        fetchPublicHomeUpcomingRallies(),
      ]);

      const formattedPrograms: FeaturedActionItem[] = (programsList || []).map((p, idx) => {
        const rawStatus = (p.status || "ongoing").toLowerCase();
        const status: "ongoing" | "upcoming" | "completed" =
          rawStatus === "past" || rawStatus === "completed"
            ? "completed"
            : rawStatus === "upcoming"
            ? "upcoming"
            : "ongoing";

        return {
          id: p.id,
          type: "program",
          title: p.title,
          tagline: p.description,
          location: p.location || "",
          status,
          impact: p.beneficiaries || (p.pillars && p.pillars[0]) || "",
          color: idx === 1 ? "#DC2626" : idx === 2 ? "#2563EB" : "#22C55E",
          themeBadge:
            status === "ongoing"
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
              : status === "upcoming"
              ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
              : "bg-slate-700/40 text-slate-300 border-slate-600",
          buttonColor:
            status === "ongoing"
              ? "bg-[#22C55E] hover:bg-[#16A34A] text-slate-950 font-black shadow-emerald-500/20"
              : status === "upcoming"
              ? "bg-[#DC2626] hover:bg-[#B91C1C] text-white font-extrabold shadow-red-500/20"
              : "bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold shadow-blue-500/20",
          image: p.cover_image || "/images/bg2.jpg",
          category: "Conservation Program",
          href: "/programs",
        };
      });

      const formattedRallies: FeaturedActionItem[] = (ralliesList || []).map((r, idx) => {
        const rawStatus = (r.status || "upcoming").toLowerCase();
        const status: "ongoing" | "upcoming" | "completed" =
          rawStatus === "ongoing"
            ? "ongoing"
            : rawStatus === "completed" || rawStatus === "past"
            ? "completed"
            : "upcoming";

        return {
          id: r.id,
          type: "event",
          title: r.title,
          tagline: r.description,
          location: r.location || "",
          status,
          color: "#DC2626",
          themeBadge:
            status === "ongoing"
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
              : status === "upcoming"
              ? "bg-red-500/20 text-red-300 border-red-500/40"
              : "bg-slate-700/40 text-slate-300 border-slate-600",
          buttonColor:
            status === "ongoing"
              ? "bg-[#22C55E] hover:bg-[#16A34A] text-slate-950 font-black shadow-emerald-500/20"
              : "bg-[#DC2626] hover:bg-[#B91C1C] text-white font-extrabold shadow-red-500/20",
          image: r.image_url || "/images/bg2.jpg",
          category: "Field Action & Rally",
          href: `/news-events/${r.id}`,
        };
      });

      // Combine and prioritize ONGOING first, then UPCOMING, then COMPLETED
      const allCombined = [...formattedPrograms, ...formattedRallies].sort((a, b) => {
        const order = { ongoing: 1, upcoming: 2, completed: 3 };
        return order[a.status] - order[b.status];
      });

      setItems(allCombined.slice(0, 4));
    } catch (err) {
      console.error("Error loading featured actions:", err);
      setItems([]);
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

  const displayedItems = items;
  const current = displayedItems[selectedIndex] || displayedItems[0];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12281B] border border-emerald-500/30 text-xs font-bold text-emerald-300 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
              <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
              <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
              <span className="text-white">Field Actions & Rallies</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black font-heading tracking-tight uppercase text-white">
              Ground-Level <span className="text-[#22C55E]">Environmental</span> Action
            </h2>

            <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl leading-relaxed">
              We do not just talk about conservation—we take to the streets in peaceful rallies for humanity, and trek into the mountains to plant endemic rainforest canopies.
            </p>
          </div>

          <Link href="/programs">
            <Button variant="outline" className="border-emerald-500/40 bg-white/5 hover:bg-white/10 text-emerald-300 hover:text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer">
              <span>Explore All Programs & Events</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Dynamic Editorial Split */}
        {displayedItems.length === 0 ? (
          <div className="rounded-3xl p-12 text-center bg-[#08180E]/85 border border-emerald-500/20 text-slate-300 shadow-2xl space-y-3">
            <Trees className="w-12 h-12 text-emerald-400 mx-auto opacity-70" />
            <h3 className="font-heading text-xl font-bold text-white">No active actions published yet</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Our grassroots campaigns, rallies, and reforestation drives are being scheduled. Check back soon or register as a volunteer to get involved.
            </p>
            <div className="pt-2">
              <Link href="/get-involved">
                <Button className="bg-[#22C55E] hover:bg-[#16A34A] text-slate-950 font-black text-xs px-5 py-2 rounded-xl">
                  Magpatala Bilang Volunteer &rarr;
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT: Interactive Selection Flow (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
            {displayedItems.map((item, index) => {
              const isSelected = selectedIndex === index;
              const isOngoing = item.status === "ongoing";
              const isCompleted = item.status === "completed";

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  className={`text-left p-5 rounded-2xl transition-all duration-300 cursor-pointer border ${
                    isSelected
                      ? "bg-[#0F2817] border-emerald-400 shadow-xl scale-[1.01]"
                      : "bg-[#07170E]/60 border-white/10 hover:bg-[#0B1E12] hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${item.themeBadge}`}>
                        {item.category}
                      </span>

                      {/* Explicit Real-Time Status Pill */}
                      {isOngoing && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>● ONGOING</span>
                        </span>
                      )}
                      {!isOngoing && !isCompleted && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-500/40">
                          <span>UPCOMING</span>
                        </span>
                      )}
                      {isCompleted && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-600">
                          <span>✓ COMPLETED</span>
                        </span>
                      )}
                    </div>

                    {isSelected && (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        Active Feature
                      </span>
                    )}
                  </div>

                  <h3 className="font-heading font-bold text-base sm:text-lg text-white leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                    {item.tagline}
                  </p>
                </button>
              );
            })}
          </div>

          {/* RIGHT: Cinematic Visual Showcase (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-emerald-500/30 bg-[#08180E] shadow-2xl relative flex flex-col justify-end min-h-[420px] lg:min-h-[500px]">
            
            {/* Background Image with Cinematic Dark Gradient */}
            <Image
              src={current.image}
              alt={current.title}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover transition-opacity duration-700"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06140A] via-[#06140A]/60 to-black/30" />

            {/* Content Overlay */}
            <div className="relative z-10 p-6 sm:p-8 space-y-4">
              
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${current.themeBadge}`}>
                  {current.category}
                </span>

                {/* Prominent Status Indicator */}
                {current.status === "ongoing" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>● ONGOING ACTION</span>
                  </span>
                )}
                {current.status === "upcoming" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-950/90 text-amber-300 border border-amber-500/50 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>UPCOMING MOBILIZATION</span>
                  </span>
                )}
                {current.status === "completed" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-800/90 text-slate-200 border border-slate-600 shadow-md">
                    <span>✓ COMPLETED ACTION</span>
                  </span>
                )}

                {current.location && (
                  <div className="flex items-center gap-1 text-xs text-slate-200 bg-black/60 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
                    <MapPin className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>{current.location}</span>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-heading font-black text-2xl sm:text-3xl text-white leading-tight">
                  {current.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 mt-2 leading-relaxed max-w-xl">
                  {current.tagline}
                </p>
              </div>

              {/* Dynamic Impact Highlight (only if real data present) */}
              {current.impact && (
                <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md text-xs text-emerald-300 font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#F59E0B] shrink-0" />
                  <span>{current.impact}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Link href={current.status === "completed" ? current.href : "/get-involved"}>
                  <Button className={`${current.buttonColor} text-xs px-6 py-5 rounded-xl shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer`}>
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {current.status === "ongoing"
                        ? "Join Ongoing Action"
                        : current.status === "completed"
                        ? "View Documentation"
                        : "Register for This Action"}
                    </span>
                  </Button>
                </Link>

                <Link href="/programs">
                  <Button variant="outline" className="border-white/20 bg-black/40 hover:bg-black/60 text-white font-bold text-xs px-5 py-5 rounded-xl w-full sm:w-auto cursor-pointer">
                    <span>Explore Programs &amp; Events &rarr;</span>
                  </Button>
                </Link>
              </div>

            </div>

          </div>

        </div>
        )}

      </div>
    </section>
  );
}
