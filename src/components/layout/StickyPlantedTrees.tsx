"use client";

import React from "react";
import { Trees, ArrowUpRight } from "lucide-react";
import { useSiteSettings } from "@/lib/siteSettings";

export function StickyPlantedTrees() {
  const siteSettings = useSiteSettings();
  const treesCount = siteSettings.stat_trees_planted?.trim();

  const scrollToCalculator = () => {
    if (typeof window !== "undefined") {
      if (window.location.pathname === "/") {
        const el = document.getElementById("carbon-calculator");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          return;
        }
      }
      window.location.href = "/#carbon-calculator";
    }
  };

  if (!treesCount) {
    return null;
  }

  const displayText = treesCount.toLowerCase().includes("tree")
    ? treesCount
    : `${treesCount} Trees Planted`;

  return (
    <aside 
      aria-label="Planted Trees Carbon Offset Tracker"
      className="fixed bottom-5 right-5 z-40 select-none animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <button
        type="button"
        onClick={scrollToCalculator}
        className="group relative flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#1A1008]/92 hover:bg-[#2A190D] border border-[#8B5A2B]/40 hover:border-emerald-500/50 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer text-left"
        title={`${displayText} - Click to Calculate Your Offset`}
      >
        {/* Pulsing Tree Symbol */}
        <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[#22C55E] shrink-0 group-hover:scale-110 transition-transform">
          <Trees className="w-5 h-5 text-emerald-400" />
          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
        </div>

        {/* Counter & Impact Label */}
        <div className="flex flex-col pr-1">
          <div className="flex items-center gap-1.5">
            <span className="font-heading font-black text-xs sm:text-sm text-white tracking-tight">
              {displayText}
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>
          <span className="text-[10px] font-semibold text-[#D4C3A3] tracking-wide">
            Donated to Lessen Carbon Footprint
          </span>
        </div>
      </button>
    </aside>
  );
}
