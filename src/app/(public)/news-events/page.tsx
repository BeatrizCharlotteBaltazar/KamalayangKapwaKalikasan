"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Flame 
} from "lucide-react";
import { fetchPublicNewsEvents } from "@/lib/supabase/publicStore";
import { NewsEvent } from "@/types";
import { formatDate } from "@/lib/utils";

export default function NewsEventsPage() {
  const [filterType, setFilterType] = useState<"all" | "news" | "event">("all");
  const [newsEvents, setNewsEvents] = useState<NewsEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    fetchPublicNewsEvents().then((items) => {
      setNewsEvents(items || []);
      setLoading(false);
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

  const filteredItems = newsEvents.filter((item) => {
    if (filterType === "all") return true;
    return item.type === filterType;
  });

  return (
    <div className="py-12 md:py-20 relative overflow-hidden text-white bg-subpage-forest1 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#180E07]/90 border border-[#8B5A2B]/40 text-xs font-bold text-amber-300 shadow-md">
            <Flame className="w-3.5 h-3.5 text-[#DC2626]" />
            <span>Kaganapan & Mga Rally para sa Kalikasan</span>
          </div>

          <h1 
            className="font-alice text-4xl sm:text-6xl font-normal uppercase tracking-tight text-[#e1ffdd]"
            style={{ fontFamily: 'var(--font-alice), "Alice", Georgia, serif', color: '#e1ffdd' }}
          >
            Field Dispatches & <br />
            <span>Upcoming Rallies</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            Stay informed on our Sierra Madre reforestation progress, coastal mobilizations, climate justice rallies, and upcoming volunteer assemblies across Luzon.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { id: "all", label: `All Updates (${newsEvents.length})` },
            { id: "event", label: "Upcoming Mobilizations & Events" },
            { id: "news", label: "Field Reports & Stories" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as "all" | "event" | "news")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                filterType === tab.id
                  ? "bg-emerald-600 text-slate-950 font-black shadow-md scale-102"
                  : "bg-white/5 text-slate-300 hover:text-white border border-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* News & Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-black/40 border border-white/10 text-slate-400 space-y-2 col-span-full">
              <Flame className="w-8 h-8 mx-auto text-slate-500 opacity-60" />
              <h4 className="font-bold text-white text-base">No updates published yet</h4>
              <p className="text-xs">Field reports and upcoming mobilizations will appear here once published.</p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const isEvent = item.type === "event";

              return (
                <article
                  key={item.id}
                  className="flex flex-col rounded-3xl bg-[#08180E]/85 backdrop-blur-md border border-emerald-500/20 overflow-hidden shadow-xl hover:border-emerald-500/40 transition-all group"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-black/60">
                    <Image
                      src={item.cover_image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                    
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase shadow-sm ${
                        isEvent ? "bg-[#DC2626] text-white" : "bg-[#2563EB] text-white"
                      }`}>
                        {isEvent ? "Mobilization" : "Field Report"}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mb-2.5">
                        <span className="flex items-center gap-1 font-semibold text-slate-200">
                          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                          {formatDate(item.event_date)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-300 truncate">
                          <MapPin className="w-3.5 h-3.5 text-amber-400" />
                          {item.location}
                        </span>
                      </div>

                      <h2 className="font-heading font-bold text-lg sm:text-xl text-white group-hover:text-emerald-400 transition-colors leading-snug mb-2">
                        <Link href={`/news-events/${item.slug}`}>
                          {item.title}
                        </Link>
                      </h2>

                      <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed">
                        {item.excerpt || item.summary}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold">
                      <Link
                        href={`/news-events/${item.slug}`}
                        className="text-emerald-400 hover:underline inline-flex items-center gap-1"
                      >
                        <span>Read Story</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      {isEvent && (
                        <Link
                          href="/get-involved"
                          className="text-amber-400 hover:underline text-[11px]"
                        >
                          Register to Attend &rarr;
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
