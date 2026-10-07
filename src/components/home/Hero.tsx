"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Calculator, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden text-center text-white px-4 sm:px-6 lg:px-8 bg-transparent">

      <div className="relative z-10 max-w-4xl mx-auto py-16 sm:py-24 space-y-8">

        <h1 
          style={{ fontFamily: 'var(--font-alice), "Alice", Georgia, serif', color: '#e1ffdd' }}
          className="font-alice text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal tracking-tight uppercase leading-[0.98] drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)] select-none"
        >
          KAMALAYANG <br />
          KAPWA <br />
          KALIKASAN
        </h1>

        {/* Subtitle (Matching screenshot wording and serif tone) */}
        <p className="text-sm sm:text-base md:text-lg text-white/95 max-w-2xl mx-auto leading-relaxed font-serif font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          Grounding environmental action in the Filipino virtue of pakikipagkapwa. We mobilize youth and rural communities for peaceful climate rallies, native tree-growing in the Sierra Madre, and watershed defense.
        </p>

        {/* Action Button: VOLUNTEER > (Matching the brown pill button in screenshot) */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/get-involved">
            <button
              type="button"
              className="px-8 py-3.5 rounded-full bg-[#B07D48] hover:bg-[#9E6E3C] text-[#1A1108] font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95 inline-flex items-center gap-2 cursor-pointer font-sans"
            >
              <span>VOLUNTEER</span>
              <ChevronRight className="w-4 h-4 text-[#1A1108] stroke-[3]" />
            </button>
          </Link>

          {/* Quick links */}
          <a
            href="#carbon-calculator"
            className="px-5 py-3 rounded-full bg-black/45 hover:bg-black/70 border border-white/20 text-xs sm:text-sm font-semibold text-[#e1ffdd] backdrop-blur-md transition-all hover:scale-105 flex items-center gap-1.5"
          >
            <Calculator className="w-4 h-4 text-[#22C55E]" />
            <span>Calculate Carbon Footprint</span>
          </a>
        </div>

      </div>

    </section>
  );
}
