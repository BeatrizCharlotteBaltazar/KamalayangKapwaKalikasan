"use client";

import React from "react";
import Link from "next/link";
import { 
  Target, 
  Compass, 
  Trees, 
  ShieldCheck, 
  Flame, 
  ArrowRight,
  MapPin,
  CheckCircle2,
  Phone,
  Mail,
  GraduationCap,
  Users,
  HeartHandshake,
  Handshake,
  Megaphone,
  Sparkles
} from "lucide-react";
import { 
  officersData, 
  organizationVision, 
  organizationMission, 
  missionPathways 
} from "@/lib/data";
import { useSiteSettings } from "@/lib/siteSettings";
import { Button } from "@/components/ui/button";

const pathwayStyles: Record<string, {
  icon: any;
  color: string;
  badge: string;
  glow: string;
  border: string;
  hoverBorder: string;
  btnBg: string;
  btnHover: string;
}> = {
  "pathway-1": {
    icon: GraduationCap,
    color: "text-sky-400",
    badge: "bg-sky-950/90 text-sky-300 border-sky-500/40",
    glow: "from-sky-500/30 via-sky-500/10 to-transparent",
    border: "border-sky-500/30",
    hoverBorder: "hover:border-sky-400/70",
    btnBg: "bg-sky-500/15 text-sky-200 border-sky-500/40",
    btnHover: "hover:bg-sky-500 hover:text-slate-950",
  },
  "pathway-2": {
    icon: Users,
    color: "text-amber-400",
    badge: "bg-amber-950/90 text-amber-300 border-amber-500/40",
    glow: "from-amber-500/30 via-amber-500/10 to-transparent",
    border: "border-amber-500/30",
    hoverBorder: "hover:border-amber-400/70",
    btnBg: "bg-amber-500/15 text-amber-200 border-amber-500/40",
    btnHover: "hover:bg-amber-500 hover:text-slate-950",
  },
  "pathway-3": {
    icon: HeartHandshake,
    color: "text-rose-400",
    badge: "bg-rose-950/90 text-rose-300 border-rose-500/40",
    glow: "from-rose-500/30 via-rose-500/10 to-transparent",
    border: "border-rose-500/30",
    hoverBorder: "hover:border-rose-400/70",
    btnBg: "bg-rose-500/15 text-rose-200 border-rose-500/40",
    btnHover: "hover:bg-rose-500 hover:text-slate-950",
  },
  "pathway-4": {
    icon: Handshake,
    color: "text-yellow-400",
    badge: "bg-yellow-950/90 text-yellow-300 border-yellow-500/40",
    glow: "from-yellow-500/30 via-yellow-500/10 to-transparent",
    border: "border-yellow-500/30",
    hoverBorder: "hover:border-yellow-400/70",
    btnBg: "bg-yellow-500/15 text-yellow-200 border-yellow-500/40",
    btnHover: "hover:bg-yellow-500 hover:text-slate-950",
  },
  "pathway-5": {
    icon: Megaphone,
    color: "text-emerald-400",
    badge: "bg-emerald-950/90 text-emerald-300 border-emerald-500/40",
    glow: "from-emerald-500/30 via-emerald-500/10 to-transparent",
    border: "border-emerald-500/30",
    hoverBorder: "hover:border-emerald-400/70",
    btnBg: "bg-emerald-500/15 text-emerald-200 border-emerald-500/40",
    btnHover: "hover:bg-emerald-500 hover:text-slate-950",
  },
};

export default function AboutPage() {
  const siteSettings = useSiteSettings();
  return (
    <div className="py-12 md:py-20 relative overflow-hidden text-white bg-subpage-forest1 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#180E07]/90 border border-[#8B5A2B]/40 text-xs font-bold text-[#e1ffdd] shadow-md">
            <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
            <span>Tungkol sa Kamalayang Kapwa Kalikasan</span>
          </div>

          <h1 
            className="font-alice text-4xl sm:text-6xl font-normal uppercase tracking-tight text-[#e1ffdd]"
            style={{ fontFamily: 'var(--font-alice), "Alice", Georgia, serif', color: '#e1ffdd' }}
          >
            Rooted in Humanity. <br />
            <span>Defending Mother Earth.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            Kamalayang Kapwa Kalikasan is a grassroots environmental movement rooted in <strong className="text-white">pakikipagkapwa</strong> (shared responsibility). We organize rallies for climate justice, restore indigenous rainforests, and educate youth across the Philippines.
          </p>
        </div>

        {/* Vision & Mission (NO tabs, NO boxy cards - Open Editorial Layout) */}
        <section className="space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            
            {/* Vision (Open Editorial Typography) */}
            <div className="space-y-4 border-l-2 border-[#22C55E] pl-6 py-2">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-emerald-400">
                <Compass className="w-4 h-4 text-[#F59E0B]" />
                <span>Our Vision (Bisyon)</span>
              </div>

              <blockquote className="font-heading text-xl sm:text-2xl font-bold text-white leading-snug">
                &ldquo;{organizationVision.statement}&rdquo;
              </blockquote>

              <div className="pt-2 text-xs text-slate-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Virtue of Pakikipagkapwa:</strong> What harms our watersheds and mountains harms our people; safeguarding our forests secures health, safety, and dignity for every Filipino generation.
                </span>
              </div>
            </div>

            {/* Mission (Open Editorial Typography) */}
            <div className="space-y-4 border-l-2 border-[#2563EB] pl-6 py-2">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#60A5FA]">
                <Target className="w-4 h-4 text-[#EF4444]" />
                <span>Our Mission (Misyon)</span>
              </div>

              <p className="font-heading text-lg sm:text-xl font-bold text-white leading-relaxed">
                {organizationMission.statement}
              </p>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2">
                {organizationMission.conclusion}
              </p>
            </div>

          </div>

        </section>

        {/* Section: 5 Strategic Mission Pathways */}
        <section className="space-y-8 pt-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#F59E0B]">
                Limang Haligi ng Aksyon
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold uppercase text-white mt-1">
                5 Strategic Pathways of Action
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md">
              Translating our values into tangible results, from peaceful climate rallies to watershed reforestation.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {missionPathways.map((item) => {
              const style = pathwayStyles[item.id] || {
                icon: Sparkles,
                color: "text-emerald-400",
                badge: "bg-emerald-950 text-emerald-300 border-emerald-500/40",
                glow: "from-emerald-500/30 to-transparent",
                border: "border-emerald-500/30",
                hoverBorder: "hover:border-emerald-400",
                btnBg: "bg-emerald-500/15 text-emerald-200 border-emerald-500/40",
                btnHover: "hover:bg-emerald-500 hover:text-slate-950",
              };
              const IconComponent = style.icon;

              return (
                <div
                  key={item.id}
                  className={`w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] group relative rounded-3xl p-7 bg-gradient-to-b from-[#092113]/90 via-[#06180E]/95 to-[#041009]/98 backdrop-blur-xl border ${style.border} ${style.hoverBorder} shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between overflow-hidden`}
                >
                  {/* Top Glowing Gradient Accent Bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${style.glow}`} />

                  {/* Watermark Large Number in Background */}
                  <div className="absolute top-3 right-4 font-heading font-black text-7xl text-white/[0.04] select-none pointer-events-none group-hover:text-white/[0.08] transition-colors">
                    {item.number}
                  </div>

                  <div className="space-y-4 relative z-10">
                    {/* Header Row: Icon + Tag Badge */}
                    <div className="flex items-center justify-between gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-black/50 border ${style.border} ${style.color} shadow-inner group-hover:scale-110 transition-transform`}>
                        <IconComponent className="w-6 h-6 stroke-[2.2]" />
                      </div>

                      <span className={`text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border shadow-xs ${style.badge}`}>
                        {item.tag}
                      </span>
                    </div>

                    {/* Pathway Title */}
                    <div className="pt-1">
                      <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-slate-400 block mb-1">
                        Pathway {item.number}
                      </span>
                      <h3 className="font-heading font-extrabold text-xl text-white leading-snug group-hover:text-emerald-300 transition-colors">
                        {item.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>

                  {/* Interactive Action CTA Link */}
                  <div className="pt-6 mt-4 border-t border-white/10 relative z-10">
                    <Link
                      href={item.href}
                      className={`inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border ${style.btnBg} ${style.btnHover} shadow-md`}
                    >
                      <span>{item.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section: Leadership & Board of Trustees (All members displayed without filter) */}
        <section className="space-y-8 pt-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#60A5FA]">
                Pamunuan at Lupon
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold uppercase text-white mt-1">
                Our Leadership Team
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md">
              Grassroots organizers, community foresters, youth conveners, and indigenous allies guiding our mission.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {officersData.map((officer) => (
              <div
                key={officer.id || officer.name}
                className="p-6 rounded-2xl bg-[#08180E]/80 backdrop-blur-md border border-white/10 hover:border-emerald-500/40 shadow-xl transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-heading font-extrabold text-lg text-white leading-tight">
                        {officer.name}
                      </h3>
                      <p className="text-xs font-bold text-emerald-400 mt-0.5">
                        {officer.role}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-black/40 text-[10px] font-bold text-slate-300 border border-white/10 shrink-0">
                      {officer.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {officer.bio}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-[#60A5FA] font-semibold">
                  <span>KKK Official Leader</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Headquarters Interactive MAP Embed */}
        <section className="space-y-6 pt-6 border-t border-white/10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F59E0B] flex items-center justify-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#F59E0B]" />
              <span>National Operations Center</span>
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold uppercase text-white">
              Cavite Headquarters Map
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              {siteSettings.office_address}
            </p>
          </div>

          {/* Interactive OpenStreetMap Map */}
          <div className="rounded-3xl overflow-hidden border border-emerald-500/30 shadow-2xl bg-[#0A1A10]">
            <div className="w-full h-80 sm:h-96 relative">
              <iframe
                title="Kamalayang Kapwa Kalikasan Cavite Headquarters Map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=120.9300%2C14.3050%2C120.9850%2C14.3450&amp;layer=mapnik&amp;marker=14.3235%2C120.9580"
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>

            <div className="p-6 bg-[#0E1F14] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300">
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1.5 text-white font-bold">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>Hannah Grace Bldg, Mango Village, Salitran IV, Dasmariñas, Cavite</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{siteSettings.contact_phone}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span>{siteSettings.contact_email}</span>
                </span>
              </div>

              <a
                href="https://www.openstreetmap.org/?mlat=14.3235&amp;mlon=120.9580#map=15/14.3235/120.9580"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#B07D48] hover:bg-[#9E6E3C] text-[#1A1108] font-bold text-xs uppercase tracking-wider transition-colors shrink-0"
              >
                View Larger Map &rarr;
              </a>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
