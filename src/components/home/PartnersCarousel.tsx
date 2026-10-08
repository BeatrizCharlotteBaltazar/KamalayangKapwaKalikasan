"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Handshake, ExternalLink, ShieldCheck } from "lucide-react";
import { fetchPublicPartners } from "@/lib/supabase/publicStore";
import { defaultPartners } from "@/lib/data";
import { Partner } from "@/types";

export function PartnersCarousel() {
  const [isPaused, setIsPaused] = useState(false);
  const [partners, setPartners] = useState<Partner[]>(defaultPartners);

  const loadData = () => {
    fetchPublicPartners().then((live) => {
      setPartners(live && live.length > 0 ? live : defaultPartners);
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

  const displayPartners = partners.length > 0 ? partners : defaultPartners;

  // Duplicate items 3 times for a seamless continuous looping marquee across any monitor width
  const loopedPartners = [...displayPartners, ...displayPartners, ...displayPartners];

  return (
    <section
      className="relative py-14 text-white overflow-hidden border-y border-emerald-500/15 bg-[#061209]/80 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">

        {/* Section Header with Live Continuous Motion Status */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F59E0B] mb-1">
              <Handshake className="w-4 h-4 text-[#F59E0B]" />
              <span>Institutional Alliances & Partners</span>
            </div>
            <h3 className="font-heading text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
              United for <span className="text-[#2563EB]">People</span> & <span className="text-[#22C55E]">Nature</span>
            </h3>
          </div>




        </div>
      </div>

      {/* Carousel Viewport with Continuous Seamless Marquee */}
      <div className="relative w-full overflow-hidden">
        {/* Gradient edge fades for seamless entry/exit */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#061209] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#061209] to-transparent z-10 pointer-events-none" />

        <div
          className="animate-continuous-marquee flex gap-5 py-2 px-4"
          style={{
            animationPlayState: isPaused ? "paused" : "running",
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {loopedPartners.map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              className="w-72 sm:w-80 md:w-96 shrink-0"
            >
              <div className="h-full p-5 rounded-2xl bg-[#091C10]/85 border border-emerald-500/20 hover:border-emerald-500/50 backdrop-blur-md transition-all hover:scale-[1.02] flex flex-col justify-between group shadow-xl">

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
    </section>
  );
}

