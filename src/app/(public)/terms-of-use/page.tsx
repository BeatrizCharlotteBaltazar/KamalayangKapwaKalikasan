import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { FileCheck, BookOpen, Heart, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Terms of Use | Kamalayang Kapwa Kalikasan",
  description:
    "Official Terms of Use and Code of Conduct for volunteers and visitors of Kamalayang Kapwa Kalikasan.",
};

export default function TermsOfUsePage() {
  return (
    <div className="py-10 md:py-16 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#2E5E34] text-xs font-bold border border-emerald-200">
            <FileCheck className="w-4 h-4" />
            <span>Community Agreement & Code of Conduct</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-[#19241A] tracking-tight">
            Terms of Use
          </h1>
          <p className="text-xs sm:text-sm text-[#536054]">
            Last Updated: October 2026 • Version 1.0 • Kamalayang Kapwa Kalikasan Foundation Inc.
          </p>
        </div>

        {/* Introduction Callout */}
        <div className="p-6 rounded-3xl bg-white/95 backdrop-blur-sm border border-slate-200/90 shadow-xs flex items-start gap-4">
          <FileCheck className="w-8 h-8 text-[#2E5E34] shrink-0 mt-1" />
          <div className="space-y-1 text-xs sm:text-sm text-[#19241A]">
            <strong className="block font-bold">Welcome to Kamalayang Kapwa Kalikasan:</strong>
            <p className="text-[#536054] leading-relaxed">
              By accessing our platform, downloading open-access guides, participating in volunteer activities, or donating to our causes, you agree to comply with the terms and community values set forth below.
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-sm space-y-8 text-xs sm:text-sm text-[#19241A] leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="font-heading font-bold text-lg text-[#19241A]">
              1. Platform Purpose & Proper Use
            </h2>
            <p className="text-[#536054]">
              This platform exists exclusively for educational, non-profit, community mobilization, and conservation fundraising purposes in the Philippines. Any use of this platform for fraudulent transactions, defamation, spam, commercial unauthorized resale, or malicious activities is strictly prohibited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-lg text-[#19241A]">
              2. Open Knowledge & Creative Commons
            </h2>
            <p className="text-[#536054]">
              All educational manuals, tree care guides, and composting resources published in our <strong>Resources</strong> section are distributed under the <em>Creative Commons Attribution-NonCommercial (CC BY-NC 4.0)</em> license. You are encouraged to read, distribute, and teach these materials in your communities provided attribution is given to Kamalayang Kapwa Kalikasan.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-lg text-[#19241A]">
              3. Volunteer Code of Conduct (Pakikipagkapwa)
            </h2>
            <p className="text-[#536054]">
              Volunteers participating in field assemblies (such as tree-growing in Tanay or coastal cleanups in Manila Bay) must observe respect for indigenous communities, safety guidelines, and Leave No Trace principles. Any harassment or discrimination based on gender, ethnicity, religion, or background will result in immediate dismissal from organization activities.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-lg text-[#19241A]">
              4. Donations & Transparency
            </h2>
            <p className="text-[#536054]">
              All donations made via GCash or BPI are voluntary and non-refundable. Funds are dedicated 100% to verified environmental programs, community saplings, and field operations. Official receipts and acknowledgment certificates are issued in accordance with Philippine non-profit guidelines.
            </p>
          </section>

          <section className="space-y-3 pt-2 border-t border-slate-100">
            <h2 className="font-heading font-bold text-lg text-[#19241A]">
              5. Governing Law
            </h2>
            <p className="text-[#536054]">
              These terms are governed by the laws of the Republic of the Philippines. Any legal inquiries may be directed to our headquarters at Hannah Grace Bldg, Block 21 Lot 9, Mango Village, Salitran IV, 4114 City of Dasmariñas, Cavite.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}
