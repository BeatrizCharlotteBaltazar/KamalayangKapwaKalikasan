"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, 
  BookOpen, 
  Clock, 
  Calendar, 
  ArrowRight, 
  Download,
  Sparkles
} from "lucide-react";
import { fetchPublicResources } from "@/lib/supabase/publicStore";
import { Resource, ResourceCategory } from "@/types";
import { formatDate } from "@/lib/utils";

const categories: ("All" | ResourceCategory)[] = [
  "All",
  "Zero Waste",
  "Biodiversity",
  "Climate Action",
  "Community Guides",
  "Eco-Living Tips",
];

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    let isMounted = true;
    fetchPublicResources().then((items) => {
      if (isMounted) {
        setResources(items || []);
        setIsLoading(false);
      }
    });

    const handleUpdate = () => {
      fetchPublicResources().then((items) => {
        if (isMounted) {
          setResources(items || []);
        }
      });
    };
    window.addEventListener("kkk_content_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener("kkk_content_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const filteredResources = resources.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-12 md:py-20 relative overflow-hidden text-white bg-subpage-forest1 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0E2616] border border-emerald-500/30 text-xs font-bold text-emerald-300 shadow-md">
            <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
            <span>Dunong Pangkalikasan • Knowledge Hub</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
            Environmental Guides <br />
            <span className="text-[#22C55E]">& Research</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            Free, open-access manuals, ecological guides, and practical tips on composting, native tree propagation, climate rallies, and zero-waste living.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="bg-[#08180E]/85 backdrop-blur-md rounded-3xl border border-emerald-500/20 p-6 shadow-2xl space-y-6">
          
          {/* Search Input */}
          <div className="relative max-w-xl mx-auto">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics (e.g. Bokashi, Narra, Zero Waste, Mangroves)..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-black/40 border border-white/20 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          {/* Categories Pill Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-white/10">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-emerald-600 text-slate-950 font-black shadow-md scale-102"
                    : "bg-white/5 text-slate-300 hover:text-white border border-white/10"
                }`}
              >
                {cat === "All" ? "All Categories" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Resource Articles Grid */}
        {filteredResources.length === 0 ? (
          <div className="text-center py-16 bg-[#08180E]/85 rounded-3xl border border-emerald-500/20 p-8 space-y-3">
            <BookOpen className="w-12 h-12 text-amber-400 mx-auto opacity-60" />
            <h3 className="font-heading text-lg font-bold text-white">
              No educational resources found
            </h3>
            <p className="text-xs text-slate-300">
              Try searching for different keywords like &ldquo;composting&rdquo;, &ldquo;trees&rdquo;, or reset the category filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="text-xs font-bold text-emerald-400 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResources.map((item) => {
              const catTheme = 
                item.category === "Zero Waste" ? "bg-red-950/80 text-red-300 border-red-600/30" :
                item.category === "Biodiversity" ? "bg-emerald-950/80 text-emerald-300 border-emerald-600/30" :
                item.category === "Climate Action" ? "bg-blue-950/80 text-blue-300 border-blue-600/30" :
                "bg-amber-950/80 text-amber-300 border-amber-600/30";

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
                    />
                    
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase shadow-sm border ${catTheme}`}>
                        {item.category}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-black/70 text-white text-[10px] font-semibold flex items-center gap-1 backdrop-blur-md border border-white/10">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      <span>{item.read_time}</span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Published {formatDate(item.published_at)}</span>
                      </div>

                      <h2 className="font-heading font-bold text-lg text-white group-hover:text-emerald-400 transition-colors leading-snug mb-2">
                        <Link href={`/resources/${item.slug}`}>
                          {item.title}
                        </Link>
                      </h2>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                        {item.summary}
                      </p>

                      {item.tags && (
                        <div className="flex flex-wrap gap-1.5 pt-3">
                          {item.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-semibold text-slate-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/5"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-emerald-400">
                      <Link
                        href={`/resources/${item.slug}`}
                        className="inline-flex items-center gap-1 hover:underline"
                      >
                        <span>Read Full Guide</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      {item.file_url && (
                        <span className="text-[11px] text-amber-300 flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          <span>PDF</span>
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
