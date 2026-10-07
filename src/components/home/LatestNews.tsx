"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, ArrowRight, Flame, Sparkles } from "lucide-react";
import { newsEventsData } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export function LatestNews() {
  const items = newsEventsData.slice(0, 3);

  return (
    <section className="py-16 md:py-24 relative overflow-hidden text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#EF4444] mb-2">
              <Flame className="w-4 h-4 text-[#EF4444]" />
              <span>Dispatches & Mobilizations</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-heading tracking-tight text-white uppercase">
              Field Dispatches & <span className="text-[#DC2626]">Upcoming Rallies</span>
            </h2>
          </div>

          <Link
            href="/news-events"
            className="inline-flex items-center text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:underline"
          >
            <span>View All News & Events</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </div>

        {/* Modern Editorial Rows (Not boxy cards) */}
        <div className="divide-y divide-white/10 space-y-2">
          {items.map((item) => {
            const isEvent = item.type === "event";
            return (
              <article
                key={item.id}
                className="pt-6 pb-6 first:pt-0 group hover:bg-white/[0.02] p-4 rounded-2xl transition-all"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  
                  {/* Visual Preview */}
                  <div className="md:col-span-3">
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 bg-black/60">
                      <Image
                        src={item.cover_image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        isEvent ? "bg-[#DC2626] text-white" : "bg-[#2563EB] text-white"
                      }`}>
                        {isEvent ? "Mobilization" : "Field Report"}
                      </span>
                    </div>
                  </div>

                  {/* Narrative details */}
                  <div className="md:col-span-7 space-y-2">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1 text-slate-300 font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                        {formatDate(item.event_date)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        {item.location}
                      </span>
                    </div>

                    <h3 className="font-heading font-extrabold text-lg sm:text-xl text-white group-hover:text-emerald-400 transition-colors leading-snug">
                      <Link href={`/news-events/${item.slug}`}>
                        {item.title}
                      </Link>
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                      {item.excerpt || item.summary}
                    </p>
                  </div>

                  {/* Quick Action */}
                  <div className="md:col-span-2 flex md:justify-end">
                    <Link
                      href={isEvent ? "/get-involved" : `/news-events/${item.slug}`}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 ${
                        isEvent
                          ? "bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-md"
                          : "bg-white/10 hover:bg-white/20 text-white"
                      }`}
                    >
                      <span>{isEvent ? "Register" : "Read Story"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
