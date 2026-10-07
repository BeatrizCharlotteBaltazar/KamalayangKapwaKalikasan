"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Trees, 
  MapPin, 
  Calendar, 
  Users, 
  CheckCircle, 
  Sparkles,
  ChevronRight,
  Flame,
  Heart
} from "lucide-react";
import { programsData } from "@/lib/data";
import { Button } from "@/components/ui/button";

export default function ProgramsPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredPrograms = programsData.filter((p) => {
    if (selectedStatus === "all") return true;
    return p.status === selectedStatus;
  });

  return (
    <div className="py-12 md:py-20 relative overflow-hidden text-white bg-subpage-forest1 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page Title & Intro */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0E2616] border border-emerald-500/30 text-xs font-bold text-emerald-300 shadow-md">
            <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
            <span>Field Missions & Mobilizations</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
            Ecosystem Restoration. <br />
            <span className="text-[#22C55E]">Grassroots Mobilization.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            From the steep ridges of the Sierra Madre to the streets marching for climate justice, explore our active programs driven by indigenous stewards and youth volunteers.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { id: "all", label: `All Programs (${programsData.length})` },
            { id: "ongoing", label: "Active Field Work" },
            { id: "upcoming", label: "Upcoming Launches" },
            { id: "completed", label: "Completed Milestones" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedStatus === tab.id
                  ? "bg-emerald-600 text-slate-950 font-black shadow-md scale-102"
                  : "bg-white/5 text-slate-300 hover:text-white border border-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredPrograms.map((prog) => {
            const isExpanded = expandedId === prog.id;

            const statusConfig = 
              prog.status === "ongoing"
                ? { label: "Active Field Operations", bg: "bg-[#22C55E] text-slate-950 font-black" }
                : prog.status === "upcoming"
                ? { label: "Upcoming Project", bg: "bg-[#F59E0B] text-slate-950 font-bold" }
                : { label: "Completed Milestone", bg: "bg-[#B45309] text-white font-bold" };

            return (
              <div
                key={prog.id}
                className="flex flex-col rounded-3xl bg-[#08180E]/85 backdrop-blur-md border border-emerald-500/20 overflow-hidden shadow-2xl hover:border-emerald-500/40 transition-all"
              >
                {/* Image */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/60">
                  <Image
                    src={prog.cover_image}
                    alt={prog.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08180E] via-transparent to-transparent opacity-80" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase shadow-sm tracking-wide ${statusConfig.bg}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    {/* Pillars */}
                    {prog.pillars && (
                      <div className="flex flex-wrap gap-1.5">
                        {prog.pillars.map((pillar, idx) => (
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
                      {prog.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {prog.description}
                    </p>

                    {/* Metadata tags */}
                    <div className="space-y-2 pt-2 border-t border-white/10 text-xs text-slate-300">
                      {prog.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span><strong>Location:</strong> {prog.location}</span>
                        </div>
                      )}
                      {prog.beneficiaries && (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#60A5FA] shrink-0" />
                          <span><strong>Key Partners:</strong> {prog.beneficiaries}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#F59E0B] shrink-0" />
                        <span><strong>Timeline:</strong> Started {prog.start_date} {prog.end_date ? `until ${prog.end_date}` : "(Ongoing)"}</span>
                      </div>
                    </div>

                    {/* Expandable detailed content */}
                    {isExpanded && prog.detailed_content && (
                      <div className="pt-4 border-t border-white/10 bg-black/40 p-4 rounded-2xl text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed animate-in fade-in duration-300">
                        {prog.detailed_content}
                      </div>
                    )}
                  </div>

                  {/* Actions with Humanity colors */}
                  <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : prog.id)}
                      className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isExpanded ? "Collapse Overview" : "Read Full Field Details"}</span>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                    </button>

                    <div className="flex items-center gap-2">
                      <Link href="/get-involved">
                        <Button size="sm" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-xl">
                          <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                          <span>Volunteer</span>
                        </Button>
                      </Link>

                      <Link href="/donate">
                        <Button size="sm" className="bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold rounded-xl">
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
              <Button className="bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-extrabold text-xs px-6 py-2.5 rounded-xl">
                Contact Our Community Outreach Team &rarr;
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
