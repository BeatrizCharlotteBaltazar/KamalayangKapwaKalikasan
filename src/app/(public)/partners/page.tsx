"use client";

import React, { useState, useEffect } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { 
  Handshake, 
  Globe, 
  ExternalLink, 
  GraduationCap, 
  Building2, 
  Trees, 
  Store,
  Sparkles 
} from "lucide-react";
import { fetchPublicPartners } from "@/lib/supabase/publicStore";
import { Partner, PartnerType } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const partnerCategories: { 
  type: PartnerType; 
  icon: React.ReactNode; 
  badgeColor: string;
  description: string 
}[] = [
  {
    type: "Environmental NGOs",
    icon: <Trees className="w-5 h-5 text-[#2E5E34]" />,
    badgeColor: "bg-emerald-50 text-[#2E5E34] border-emerald-200",
    description: "Frontline civil society groups and indigenous communities leading biodiversity protection.",
  },
  {
    type: "Academic & Schools",
    icon: <GraduationCap className="w-5 h-5 text-[#0C3B7C]" />,
    badgeColor: "bg-blue-50 text-[#0C3B7C] border-blue-200",
    description: "Universities and research centers contributing scientific data, internships, and youth mobilizing.",
  },
  {
    type: "Government Units",
    icon: <Building2 className="w-5 h-5 text-[#8B5A2B]" />,
    badgeColor: "bg-amber-50 text-[#8B5A2B] border-amber-200",
    description: "Local barangay councils, LGUs, and national agencies collaborating on policy and enforcement.",
  },
  {
    type: "Industry & Eco-Enterprises",
    icon: <Store className="w-5 h-5 text-[#C8102E]" />,
    badgeColor: "bg-red-50 text-[#C8102E] border-red-200",
    description: "Green businesses and social enterprises practicing zero-waste and extended producer responsibility.",
  },
];

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = () => {
    fetchPublicPartners().then((live) => {
      setPartners(live || []);
      setIsLoading(false);
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

  return (
    <div className="py-10 md:py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200 text-xs font-bold text-[#19241A] shadow-xs">
            <Handshake className="w-3.5 h-3.5 text-[#0C3B7C]" />
            <span className="text-[#0C3B7C]">Katuwang sa Pagbabago</span>
            <span className="text-slate-300">•</span>
            <span className="text-[#2E5E34]">Alliances</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl font-black text-[#19241A] tracking-tight">
            Strategic Partners & Stakeholders
          </h1>

          <p className="text-base sm:text-lg text-[#536054] leading-relaxed max-w-2xl mx-auto">
            Environmental resilience cannot be achieved alone. We forge authentic partnerships across civil society, academia, local governments, and sustainable enterprises.
          </p>
        </div>

        {/* Grouped Partners Sections */}
        {partners.length === 0 ? (
          <div className="text-center py-16 bg-white/95 rounded-3xl border border-slate-200 p-8 space-y-3 shadow-xs">
            <Handshake className="w-12 h-12 text-[#0C3B7C] mx-auto opacity-60" />
            <h3 className="font-heading text-lg font-bold text-[#19241A]">
              Wala pang nakatalang opisyal na partner sa talaan
            </h3>
            <p className="text-xs text-[#536054] max-w-md mx-auto">
              Bukas ang Kamalayang Kapwa Kalikasan para sa pakikipagtulungan sa mga NGO, paaralan, LGU, at mga makakalikasang negosyo.
            </p>
            <div className="pt-2">
              <Link href="/contact">
                <Button size="sm" className="bg-[#2E5E34] text-white font-bold text-xs">
                  Makipag-ugnayan Para sa Alliances &rarr;
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-16">
          {partnerCategories.map((cat) => {
            const partnersInGroup = partners.filter((p) => p.type === cat.type);

            return (
              <section key={cat.type} className="space-y-6">
                {/* Category Header */}
                <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-white shadow-xs border border-slate-200">
                      {cat.icon}
                    </div>
                    <div>
                      <h2 className="font-heading text-2xl font-black text-[#19241A]">
                        {cat.type}
                      </h2>
                      <p className="text-xs text-[#536054]">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${cat.badgeColor} w-fit`}>
                    {partnersInGroup.length} Partner Organizations
                  </span>
                </div>

                {/* Partners Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {partnersInGroup.map((partner) => (
                    <div
                      key={partner.id}
                      className="p-6 rounded-3xl bg-white/95 backdrop-blur-sm border border-slate-200/90 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 font-black text-lg text-[#19241A] flex items-center justify-center shrink-0 border border-slate-200">
                          {partner.name.charAt(0)}
                        </div>

                        <div className="space-y-1 flex-1">
                          <h3 className="font-heading font-extrabold text-lg text-[#19241A] leading-snug">
                            {partner.name}
                          </h3>
                          <p className="text-xs text-[#536054] leading-relaxed">
                            {partner.description}
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        {partner.website ? (
                          <a
                            href={partner.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#0C3B7C] font-bold hover:underline inline-flex items-center gap-1"
                          >
                            <Globe className="w-3.5 h-3.5" />
                            <span>Visit Official Site</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-400">Community Alliance</span>
                        )}

                        <span className="text-[10px] font-semibold text-[#2E5E34] bg-emerald-50 px-2 py-0.5 rounded-md">
                          Verified Partner
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
        )}

        {/* Partnership Proposal CTA */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-emerald-950 via-[#19241A] to-blue-950 text-white text-center space-y-4 shadow-xl">
          <h3 className="font-heading text-2xl sm:text-3xl font-black">
            Want to Partner with Kamalayang Kapwa Kalikasan?
          </h3>
          <p className="text-xs sm:text-sm text-[#DCE6DA] max-w-xl mx-auto leading-relaxed">
            We collaborate with schools for eco-workshops, LGUs for mangrove buffers, and organizations seeking authentic corporate social responsibility.
          </p>
          <div className="pt-2">
            <Link href="/contact">
              <Button className="bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-bold text-xs">
                Inquire About Alliances &rarr;
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
