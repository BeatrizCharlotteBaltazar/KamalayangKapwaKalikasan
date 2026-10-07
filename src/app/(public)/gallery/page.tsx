"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  X, 
  MapPin, 
  Maximize2, 
  Video, 
  Sparkles
} from "lucide-react";
import { galleryData } from "@/lib/data";
import { GalleryItem } from "@/types";

const albums = [
  "All",
  "Tree Planting",
  "Coastal Clean-up",
  "Youth Eco-Camp",
  "Community Workshops",
];

export default function GalleryPage() {
  const [selectedAlbum, setSelectedAlbum] = useState<string>("All");
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const filteredItems = galleryData.filter((item) => {
    if (selectedAlbum === "All") return true;
    return item.album === selectedAlbum;
  });

  // Handle ESC key to close lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveItem(null);
      }
    };
    if (activeItem) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [activeItem]);

  return (
    <div className="py-12 md:py-20 relative overflow-hidden text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0E2616] border border-emerald-500/30 text-xs font-bold text-emerald-300 shadow-md">
            <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
            <span>Larawan ng Pagkilos • Field Gallery</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
            Chronicles of Bayanihan <br />
            <span className="text-[#22C55E]">& Environmental Action</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            Real community action on camera—from high mountain ridges in the Sierra Madre to peaceful climate rallies and coastal mangrove nurseries.
          </p>
        </div>

        {/* Album Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {albums.map((album) => (
            <button
              key={album}
              type="button"
              onClick={() => setSelectedAlbum(album)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedAlbum === album
                  ? "bg-emerald-600 text-slate-950 font-black shadow-md scale-102"
                  : "bg-white/5 text-slate-300 hover:text-white border border-white/10"
              }`}
            >
              {album === "All" ? "All Albums" : album}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => {
            const albumColor = 
              item.album === "Coastal Clean-up" ? "bg-blue-950/80 text-blue-300 border-blue-600/30" :
              item.album === "Tree Planting" ? "bg-emerald-950/80 text-emerald-300 border-emerald-600/30" :
              item.album === "Youth Eco-Camp" ? "bg-red-950/80 text-red-300 border-red-600/30" :
              "bg-amber-950/80 text-amber-300 border-amber-600/30";

            return (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className="group relative rounded-3xl overflow-hidden bg-[#08180E]/85 backdrop-blur-md border border-emerald-500/20 shadow-xl hover:border-emerald-500/40 transition-all cursor-pointer flex flex-col"
              >
                <div className="relative aspect-square overflow-hidden bg-black/60">
                  <Image
                    src={item.media_url}
                    alt={item.caption}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-xs text-white font-bold flex items-center gap-1">
                      <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>View Full Resolution</span>
                    </span>
                  </div>

                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase shadow-sm border ${albumColor}`}>
                      {item.album}
                    </span>
                  </div>

                  {item.media_type === "video" && (
                    <div className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white backdrop-blur-md">
                      <Video className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <h3 className="font-heading font-bold text-sm text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {item.caption}
                  </h3>

                  {item.location && (
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{item.location}</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Accessible Dark Lightbox Modal */}
        {activeItem && (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
            onClick={() => setActiveItem(null)}
          >
            <div
              className="relative max-w-4xl w-full bg-[#08180E] border border-emerald-500/30 rounded-3xl overflow-hidden shadow-2xl space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video w-full bg-black">
                {activeItem.media_type === "video" ? (
                  <iframe
                    src={activeItem.media_url}
                    title={activeItem.caption}
                    className="w-full h-full"
                    allowFullScreen
                  />
                ) : (
                  <Image
                    src={activeItem.media_url}
                    alt={activeItem.caption}
                    fill
                    className="object-contain"
                  />
                )}

                <button
                  onClick={() => setActiveItem(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-heading font-black text-xl text-white">
                    {activeItem.caption}
                  </h3>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-emerald-300 border border-white/10">
                    {activeItem.album}
                  </span>
                </div>

                {activeItem.location && (
                  <div className="pt-1 text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{activeItem.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
