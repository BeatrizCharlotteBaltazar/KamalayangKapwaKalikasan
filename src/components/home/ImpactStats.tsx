"use client";

import React from "react";
import { Trees, Users, ShieldCheck, Flame } from "lucide-react";
import { useSiteSettings } from "@/lib/siteSettings";

export function ImpactStats() {
  const siteSettings = useSiteSettings();

  const showTrees = Boolean(siteSettings.stat_trees_planted?.trim());
  const showVolunteers = Boolean(siteSettings.stat_volunteers?.trim());
  const showWaste = Boolean(siteSettings.stat_waste_diverted?.trim());
  const showHectares = Boolean(siteSettings.stat_hectares?.trim());

  const hasAnyStats = showTrees || showVolunteers || showWaste || showHectares;
  if (!hasAnyStats) {
    return null;
  }

  return (
    <section className="relative py-12 md:py-16 text-white border-y border-white/10 bg-[#061208]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F59E0B] mb-2">
              <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
              <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
              <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
              <span>Measurable Bayanihan in Numbers</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-heading tracking-tight text-white uppercase">
              Proven Ecological &amp; <span className="text-[#2563EB]">Civic Impact</span>
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-md md:text-right">
            {siteSettings.stat_gps_tracked?.trim()
              ? `Verified, ${siteSettings.stat_gps_tracked.trim()} reforestation and grassroots climate mobilization across the Sierra Madre and Philippine watersheds.`
              : "Community-driven reforestation and grassroots climate mobilization across the Sierra Madre and Philippine watersheds."}
          </p>
        </div>

        {/* Minimalist Stat Array: Only renders blocks with non-empty values */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Stat 1: Trees - Green */}
          {showTrees && (
            <div className="group border-l-2 border-[#22C55E] pl-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#22C55E] uppercase tracking-wider">
                <Trees className="w-4 h-4" />
                <span>Sierra Madre Canopy</span>
              </div>
              <div className="text-4xl lg:text-5xl font-black text-white group-hover:text-[#22C55E] transition-colors">
                {siteSettings.stat_trees_planted}
              </div>
              <h3 className="text-sm font-bold text-white">
                Native Trees Planted
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {siteSettings.stat_survival_rate?.trim()
                  ? `Endemic Narra, Dao, and Molave saplings with verified ${siteSettings.stat_survival_rate.trim()} survival rate in ancestral domains.`
                  : "Endemic Narra, Dao, and Molave saplings planted in ancestral domains."}
              </p>
            </div>
          )}

          {/* Stat 2: Volunteers - Royal Blue */}
          {showVolunteers && (
            <div className="group border-l-2 border-[#2563EB] pl-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#2563EB] uppercase tracking-wider">
                <Users className="w-4 h-4" />
                <span>Bayanihan Network</span>
              </div>
              <div className="text-4xl lg:text-5xl font-black text-white group-hover:text-[#2563EB] transition-colors">
                {siteSettings.stat_volunteers}
              </div>
              <h3 className="text-sm font-bold text-white">
                Volunteers &amp; Activists
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Youth leaders and community partners active in hands-on conservation and peaceful rallies.
              </p>
            </div>
          )}

          {/* Stat 3: Rallies & Cleanups - Scarlet Red */}
          {showWaste && (
            <div className="group border-l-2 border-[#DC2626] pl-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#DC2626] uppercase tracking-wider">
                <Flame className="w-4 h-4" />
                <span>Action on the Frontlines</span>
              </div>
              <div className="text-4xl lg:text-5xl font-black text-white group-hover:text-[#DC2626] transition-colors">
                {siteSettings.stat_waste_diverted}
              </div>
              <h3 className="text-sm font-bold text-white">
                Coastal Waste Diverted
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Marine plastic and river debris prevented from polluting Philippine coastal sanctuaries.
              </p>
            </div>
          )}

          {/* Stat 4: Protected Watershed - Golden Sun */}
          {showHectares && (
            <div className="group border-l-2 border-[#F59E0B] pl-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#F59E0B] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Watershed Co-Stewardship</span>
              </div>
              <div className="text-4xl lg:text-5xl font-black text-white group-hover:text-[#F59E0B] transition-colors">
                {siteSettings.stat_hectares}
              </div>
              <h3 className="text-sm font-bold text-white">
                Ancestral Land Defended
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Critical water catchment zones guarded alongside indigenous Dumagat-Remontado partners.
              </p>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
