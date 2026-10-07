"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Heart, Flame, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTABanner() {
  return (
    <section className="py-20 md:py-28 text-white relative overflow-hidden bg-gradient-to-b from-[#07170E] via-[#0A2214] to-[#040E07] border-t border-emerald-500/20">
      
      {/* Decorative ambient glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-[#2563EB]/15 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-[#DC2626]/15 blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
        
        {/* Tricolor Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-300">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
            <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
          </span>
          <span className="font-bold text-white uppercase tracking-wider text-[11px]">Bayanihan Para sa Kalikasan</span>
        </div>

        <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-tight">
          Stand for Humanity. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22C55E] via-[#F59E0B] to-[#EF4444]">
            Defend Mother Earth.
          </span>
        </h2>

        <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Join our peaceful rallies for climate justice, plant endemic Narra saplings in the Sierra Madre, or support our indigenous forest guardians.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/get-involved" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold px-8 py-6 rounded-2xl shadow-xl flex items-center justify-center gap-2 cursor-pointer">
              <Sparkles className="w-4 h-4 text-[#F59E0B]" />
              <span>Join as a Volunteer / Mobilizer</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>

          <Link href="/donate" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto bg-[#DC2626] hover:bg-[#B91C1C] text-white font-extrabold px-8 py-6 rounded-2xl shadow-xl flex items-center justify-center gap-2 cursor-pointer">
              <Heart className="w-4 h-4 fill-white" />
              <span>Donate via GCash / BPI</span>
            </Button>
          </Link>
        </div>

        <div className="pt-6 text-xs text-slate-400 flex flex-wrap items-center justify-center gap-4">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F59E0B]" />
            100% Grassroots & Volunteer-Led
          </span>
          <span>•</span>
          <span>Dasmariñas, Cavite National HQ</span>
          <span>•</span>
          <span>Protected under RA 10173</span>
        </div>

      </div>
    </section>
  );
}
