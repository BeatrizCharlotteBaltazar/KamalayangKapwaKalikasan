"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Handshake, ChevronLeft, ChevronRight, ExternalLink, ShieldCheck } from "lucide-react";
import { partnersData } from "@/lib/data";

export function PartnersCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Group into pairs/items for responsive viewing
  const itemsPerView = 3;
  const maxIndex = Math.max(0, partnersData.length - itemsPerView);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3800);
    return () => clearInterval(interval);
  }, [isPaused, maxIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  return (
    <section 
      className="relative py-14 text-white overflow-hidden border-y border-emerald-500/15 bg-[#061209]/80 backdrop-blur-md"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Navigation Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F59E0B] mb-1">
              <Handshake className="w-4 h-4 text-[#F59E0B]" />
              <span>Institutional Alliances & Partners</span>
            </div>
            <h3 className="font-heading text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
              United for <span className="text-[#2563EB]">People</span> & <span className="text-[#22C55E]">Nature</span>
            </h3>
          </div>

          {/* Carousel Next / Prev Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="p-2.5 rounded-full bg-white/5 hover:bg-emerald-500/20 border border-white/10 text-white hover:text-emerald-300 transition-colors cursor-pointer"
              aria-label="Previous partners"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-2.5 rounded-full bg-white/5 hover:bg-emerald-500/20 border border-white/10 text-white hover:text-emerald-300 transition-colors cursor-pointer"
              aria-label="Next partners"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Viewport */}
        <div className="relative overflow-hidden" ref={containerRef}>
          <div
            className="flex gap-4 transition-transform duration-700 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            }}
          >
            {partnersData.map((partner) => (
              <div
                key={partner.id}
                className="w-full sm:w-1/2 lg:w-1/3 shrink-0"
              >
                <div className="h-full p-5 rounded-2xl bg-[#091C10]/80 border border-emerald-500/20 hover:border-emerald-500/50 backdrop-blur-md transition-all hover:scale-[1.01] flex flex-col justify-between group">
                  
                  <div>
                    {/* Header: Partner Type Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-600/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                        {partner.type}
                      </span>
                      {partner.website && (
                        <a
                          href={partner.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-white transition-colors"
                          title="Visit partner website"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    {/* Logo & Name */}
                    <div className="flex items-center gap-3.5">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/10 bg-black/60 shrink-0 group-hover:scale-105 transition-transform">
                        <Image
                          src={partner.logo_url}
                          alt={`${partner.name} logo`}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <h4 className="font-heading font-extrabold text-sm sm:text-base text-white leading-snug group-hover:text-emerald-300 transition-colors line-clamp-2">
                        {partner.name}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                      {partner.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified Partner</span>
                    </span>
                    <span className="text-slate-500">Active Accord</span>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Indicator dots */}
        <div className="flex justify-center items-center gap-1.5 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                currentIndex === idx
                  ? "w-6 bg-emerald-400"
                  : "w-2 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
