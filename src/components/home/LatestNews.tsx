"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, ArrowRight, Flame, Megaphone, User, Heart } from "lucide-react";
import { 
  fetchPublicHomeDispatches, 
  fetchPublicHomeUpcomingRallies, 
  PublicDispatch, 
  PublicRallyEvent 
} from "@/lib/supabase/publicStore";
import { formatDate } from "@/lib/utils";

export function LatestNews() {
  const [activeTab, setActiveTab] = useState<"dispatches" | "rallies">("dispatches");
  const [dispatches, setDispatches] = useState<PublicDispatch[]>([]);
  const [rallies, setRallies] = useState<PublicRallyEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;
    const loadContent = async () => {
      const [dList, rList] = await Promise.all([
        fetchPublicHomeDispatches(),
        fetchPublicHomeUpcomingRallies(),
      ]);
      if (isMounted) {
        setDispatches(dList);
        setRallies(rList);
        setLoading(false);
      }
    };

    loadContent();

    const handleUpdate = () => {
      loadContent();
    };

    const syncLikes = () => {
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("kkk_liked_announcements");
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) setLikedPosts(parsed);
          }
        } catch {
          // ignore
        }
      }
    };
    syncLikes();

    window.addEventListener("kkk_content_updated", handleUpdate);
    window.addEventListener("kkk_likes_updated", syncLikes);
    window.addEventListener("storage", syncLikes);

    return () => {
      isMounted = false;
      window.removeEventListener("kkk_content_updated", handleUpdate);
      window.removeEventListener("kkk_likes_updated", syncLikes);
      window.removeEventListener("storage", syncLikes);
    };
  }, []);

  const handleToggleLike = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedPosts((prev) => {
      const isAlready = prev.includes(id);
      const next = isAlready ? prev.filter((p) => p !== id) : [...prev, id];
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("kkk_liked_announcements", JSON.stringify(next));
          window.dispatchEvent(new CustomEvent("kkk_likes_updated", { detail: { id, liked: !isAlready } }));
        } catch {
          // ignore
        }
      }
      return next;
    });
  };

  const getLikesCount = (postId: string) => {
    let hash = 0;
    for (let i = 0; i < postId.length; i++) {
      hash = (hash << 5) - hash + postId.charCodeAt(i);
      hash |= 0;
    }
    const base = Math.abs(hash % 16) + 5;
    return base + (likedPosts.includes(postId) ? 1 : 0);
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#EF4444] mb-2">
              <Flame className="w-4 h-4 text-[#EF4444]" />
              <span>Dispatches & Mobilizations</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-heading tracking-tight text-white uppercase">
              Field Dispatches & <span className="text-[#DC2626]">Upcoming Rallies</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/news-events"
              className="inline-flex items-center text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:underline"
            >
              <span>View All Updates</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>
        </div>

        {/* Section Sub-Tabs: Field Dispatches vs Upcoming Rallies */}
        <div className="flex items-center gap-2 mb-8">
          <button
            type="button"
            onClick={() => setActiveTab("dispatches")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "dispatches"
                ? "bg-[#2563EB] text-white shadow-md scale-102"
                : "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10 hover:text-white"
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>Field Dispatches ({dispatches.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("rallies")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "rallies"
                ? "bg-[#DC2626] text-white shadow-md scale-102"
                : "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10 hover:text-white"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Upcoming Rallies ({rallies.length})</span>
          </button>
        </div>

        {/* TAB 1: FIELD DISPATCHES (Announcements: status='published' AND show_on_main=true, limit 3) */}
        {activeTab === "dispatches" && (
          <div className="divide-y divide-white/10 space-y-2 animate-in fade-in duration-200">
            {dispatches.length === 0 ? (
              <div className="py-14 text-center rounded-3xl bg-black/40 border border-white/10 space-y-2">
                <Megaphone className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-sm font-bold text-white">No field dispatches published yet.</p>
                <p className="text-xs text-slate-400">Official stories and mobilization calls will appear here once posted.</p>
              </div>
            ) : (
              dispatches.map((item) => (
                <article
                  key={item.id}
                  className="pt-6 pb-6 first:pt-0 group hover:bg-white/[0.02] p-4 rounded-2xl transition-all"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    
                    {/* Visual Preview */}
                    <div className="md:col-span-3">
                      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 bg-black/60">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-emerald-950/60 text-emerald-400">
                            <Megaphone className="w-8 h-8" />
                          </div>
                        )}
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#2563EB] text-white">
                          {item.category || "Field Report"}
                        </span>
                      </div>
                    </div>

                    {/* Narrative details */}
                    <div className="md:col-span-7 space-y-2">
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1 text-slate-300 font-semibold">
                          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                          {formatDate(item.published_at || item.created_at)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-emerald-300 font-semibold">
                          <User className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{item.author || "Kamalayang Kapwa Kalikasan"}</span>
                        </span>
                      </div>

                      <h3 className="font-heading font-extrabold text-lg sm:text-xl text-white group-hover:text-emerald-400 transition-colors leading-snug">
                        <Link href={`/news-events/${item.id}`}>
                          {item.title}
                        </Link>
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                        {item.summary || item.body}
                      </p>
                    </div>

                    {/* Quick Action */}
                    <div className="md:col-span-2 flex items-center md:justify-end gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={(e) => handleToggleLike(item.id, e)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          likedPosts.includes(item.id)
                            ? "bg-red-950/80 text-red-400 border border-red-500/40"
                            : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-red-400 border border-white/10"
                        }`}
                        title={likedPosts.includes(item.id) ? "Unlike dispatch" : "Like dispatch"}
                      >
                        <Heart className={`w-3.5 h-3.5 transition-transform active:scale-125 ${likedPosts.includes(item.id) ? "fill-red-500 text-red-500" : ""}`} />
                        <span>{getLikesCount(item.id)}</span>
                      </button>

                      <Link
                        href={`/news-events/${item.id}`}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                      >
                        <span>Read</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                  </div>
                </article>
              ))
            )}
          </div>
        )}

        {/* TAB 2: UPCOMING RALLIES (Events: status<>'draft' AND event_date>=now(), limit 3) */}
        {activeTab === "rallies" && (
          <div className="divide-y divide-white/10 space-y-2 animate-in fade-in duration-200">
            {rallies.length === 0 ? (
              <div className="py-14 text-center rounded-3xl bg-black/40 border border-white/10 space-y-2">
                <Calendar className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-sm font-bold text-white">No upcoming rallies scheduled at this time.</p>
                <p className="text-xs text-slate-400">Stay tuned for future environmental mobilizations and assemblies!</p>
              </div>
            ) : (
              rallies.map((item) => (
                <article
                  key={item.id}
                  className="pt-6 pb-6 first:pt-0 group hover:bg-white/[0.02] p-4 rounded-2xl transition-all"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    
                    {/* Visual Preview */}
                    <div className="md:col-span-3">
                      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 bg-black/60">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-red-950/60 text-red-400">
                            <Calendar className="w-8 h-8" />
                          </div>
                        )}
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#DC2626] text-white">
                          Mobilization
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

                      <h3 className="font-heading font-extrabold text-lg sm:text-xl text-white group-hover:text-red-400 transition-colors leading-snug">
                        <Link href="/get-involved">
                          {item.title}
                        </Link>
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Quick Action */}
                    <div className="md:col-span-2 flex md:justify-end">
                      <Link
                        href="/get-involved"
                        className="px-4 py-2 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-md cursor-pointer"
                      >
                        <span>Register</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                  </div>
                </article>
              ))
            )}
          </div>
        )}

      </div>
    </section>
  );
}
