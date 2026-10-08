"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, Sparkles, Flame, Heart, Shield, Trees } from "lucide-react";
import { fetchPublicPrograms } from "@/lib/supabase/publicStore";
import { Button } from "@/components/ui/button";

export function FeaturedPrograms() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [programs, setPrograms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = () => {
    fetchPublicPrograms().then((items) => {
      if (items && items.length > 0) {
        setPrograms(
          items.slice(0, 3).map((p, idx) => ({
            id: p.id,
            title: p.title,
            tagline: p.description,
            location: p.location || "Sierra Madre Mountain Range",
            impact: "Community-driven reforestation & environmental stewardship",
            color: idx === 1 ? "#DC2626" : idx === 2 ? "#2563EB" : "#22C55E",
            themeBadge:
              idx === 1
                ? "bg-[#DC2626]/20 text-[#EF4444] border-[#DC2626]/40"
                : idx === 2
                ? "bg-[#2563EB]/20 text-[#60A5FA] border-[#2563EB]/40"
                : "bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/40",
            buttonColor:
              idx === 1
                ? "bg-[#DC2626] hover:bg-[#B91C1C] text-white font-extrabold"
                : idx === 2
                ? "bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold"
                : "bg-[#22C55E] hover:bg-[#16A34A] text-slate-950 font-black",
            image: p.cover_image || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
            category: "Ecosystem Restoration",
          }))
        );
      } else {
        setPrograms([]);
      }
      setIsLoading(false);
    });
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

  const displayedPrograms = programs;
  const current = displayedPrograms[selectedIndex] || displayedPrograms[0];

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
              <span>Explore All Programs</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Dynamic Editorial Split */}
        {displayedPrograms.length === 0 ? (
          <div className="rounded-3xl p-12 text-center bg-[#08180E]/85 border border-emerald-500/20 text-slate-300 shadow-2xl space-y-3">
            <Trees className="w-12 h-12 text-emerald-400 mx-auto opacity-70" />
            <h3 className="font-heading text-xl font-bold text-white">No active programs published yet</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Our grassroots campaigns and reforestation drives in the Sierra Madre are being scheduled. Check back soon or register as a volunteer to get involved.
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
          
          {/* LEFT: Interactive Program Selection Flow (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
            {displayedPrograms.map((prog, index) => {
              const isSelected = selectedIndex === index;
              return (
                <button
                  key={prog.id}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  className={`text-left p-5 rounded-2xl transition-all duration-300 cursor-pointer border ${
                    isSelected
                      ? "bg-[#0F2817] border-emerald-400 shadow-xl scale-[1.01]"
                      : "bg-[#07170E]/60 border-white/10 hover:bg-[#0B1E12] hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${prog.themeBadge}`}>
                      {prog.category}
                    </span>
                    {isSelected && (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        Active Feature
                      </span>
                    )}
                  </div>

                  <h3 className="font-heading font-bold text-base sm:text-lg text-white leading-snug">
                    {prog.title}
                  </h3>

                  <p className="text-xs text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                    {prog.tagline}
                  </p>
                </button>
              );
            })}
          </div>

          {/* RIGHT: Cinematic Live Visual Showcase (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-emerald-500/30 bg-[#08180E] shadow-2xl relative flex flex-col justify-end min-h-[420px] lg:min-h-[500px]">
            
            {/* Background Image with Cinematic Dark Gradient */}
            <Image
              src={current.image}
              alt={current.title}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover transition-opacity duration-700"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06140A] via-[#06140A]/60 to-black/30" />

            {/* Content Overlay */}
            <div className="relative z-10 p-6 sm:p-8 space-y-4">
              
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${current.themeBadge}`}>
                  {current.category}
                </span>

                <div className="flex items-center gap-1 text-xs text-slate-200 bg-black/60 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
                  <MapPin className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>{current.location}</span>
                </div>
              </div>

              <div>
                <h3 className="font-heading font-black text-2xl sm:text-3xl text-white leading-tight">
                  {current.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 mt-2 leading-relaxed max-w-xl">
                  {current.tagline}
                </p>
              </div>

              {/* Verified Impact Highlight */}
              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md text-xs text-emerald-300 font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F59E0B] shrink-0" />
                <span>{current.impact}</span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Link href="/get-involved">
                  <Button className={`${current.buttonColor} text-xs px-6 py-5 rounded-xl shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto`}>
                    <Sparkles className="w-4 h-4" />
                    <span>Join This Action / Rally</span>
                  </Button>
                </Link>

                <Link href="/programs">
                  <Button variant="outline" className="border-white/20 bg-black/40 hover:bg-black/60 text-white font-bold text-xs px-5 py-5 rounded-xl w-full sm:w-auto">
                    <span>Program Roadmap &rarr;</span>
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
