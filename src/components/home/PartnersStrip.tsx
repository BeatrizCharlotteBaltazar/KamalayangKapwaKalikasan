import React from "react";
import Link from "next/link";
import { partnersData } from "@/lib/data";
import { Handshake, ArrowRight, ShieldCheck } from "lucide-react";

export function PartnersStrip() {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-slate-200 text-xs font-bold text-[#19241A] shadow-xs mb-2">
            <Handshake className="w-3.5 h-3.5 text-[#0C3B7C]" />
            <span className="text-[#0C3B7C]">Partnerships</span>
            <span className="text-slate-300">•</span>
            <span className="text-[#8B5A2B]">Katuwang</span>
          </div>

          <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#19241A]">
            Trusted by Leaders & Communities
          </h3>

          <p className="text-xs sm:text-sm text-[#536054] mt-1.5">
            Collaborating with national agencies, universities, indigenous IP councils, and green enterprises.
          </p>
        </div>

        {/* Partners Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {partnersData.slice(0, 4).map((partner, index) => {
            const badgeColor = 
              index === 0 ? "bg-emerald-50 text-[#2E5E34] border-emerald-200" :
              index === 1 ? "bg-blue-50 text-[#0C3B7C] border-blue-200" :
              index === 2 ? "bg-amber-50 text-[#8B5A2B] border-amber-200" :
              "bg-red-50 text-[#C8102E] border-red-200";

            return (
              <div
                key={partner.id}
                className="flex flex-col items-center text-center p-5 rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200/90 shadow-xs hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-2xl ${badgeColor} border font-black text-base flex items-center justify-center mb-3 shadow-xs`}>
                  {partner.name.charAt(0)}
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-[#19241A] line-clamp-2">
                  {partner.name}
                </h4>

                <span className="text-[10px] text-[#536054] mt-1 font-medium">
                  {partner.type}
                </span>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/partners"
            className="inline-flex items-center text-xs font-bold text-[#0C3B7C] hover:text-[#082956] hover:underline"
          >
            <span>Explore All Organizational Partners</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

      </div>
    </section>
  );
}
