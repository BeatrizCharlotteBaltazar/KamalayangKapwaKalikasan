import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Data Privacy Policy (RA 10173) | Kamalayang Kapwa Kalikasan",
  description:
    "Official Data Privacy Manual of Kamalayang Kapwa Kalikasan in full compliance with the Republic Act No. 10173 (Data Privacy Act of 2012) of the Philippines.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-10 md:py-16 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0C3B7C] text-xs font-bold border border-blue-200">
            <ShieldCheck className="w-4 h-4" />
            <span>Republic Act No. 10173 (Data Privacy Act of 2012)</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-[#19241A] tracking-tight">
            Data Privacy Policy & Manual
          </h1>
          <p className="text-xs sm:text-sm text-[#536054]">
            Last Updated: October 2026 • Version 1.0 • Grounded in National Privacy Commission (NPC) Circulars
          </p>
        </div>

        {/* Introduction Callout */}
        <div className="p-6 rounded-3xl bg-white/95 backdrop-blur-sm border border-slate-200/90 shadow-xs flex items-start gap-4">
          <ShieldCheck className="w-8 h-8 text-[#2E5E34] shrink-0 mt-1" />
          <div className="space-y-1 text-xs sm:text-sm text-[#19241A]">
            <strong className="block font-bold">Our Commitment to Data Privacy:</strong>
            <p className="text-[#536054] leading-relaxed">
              <strong>Kamalayang Kapwa Kalikasan Foundation Inc.</strong> respects your fundamental right to privacy. This policy outlines how we collect, process, safeguard, and dispose of your personal information in accordance with the <em>Data Privacy Act of 2012 (RA 10173)</em>.
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-sm space-y-8 text-xs sm:text-sm text-[#19241A] leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-heading font-bold text-lg text-[#19241A] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#2E5E34] text-white text-xs flex items-center justify-center font-bold">
                1
              </span>
              What Personal Information Do We Collect?
            </h2>
            <p className="text-[#536054]">
              We adhere strictly to the principle of <strong>Data Minimization</strong>, collecting only information required for environmental advocacy, volunteer safety, and donor accountability:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[#536054]">
              <li>
                <strong>Volunteers:</strong> Full name, email address, mobile number, city/province, field interests, and volunteer skills.
              </li>
              <li>
                <strong>Donors:</strong> Full name (or Anonymous), email for e-receipts, donation amount, payment reference number, and optional transfer receipt screenshot.
              </li>
              <li>
                <strong>Newsletter Subscribers:</strong> Email address for monthly environmental field dispatches.
              </li>
              <li>
                <strong>Contact Inquiries:</strong> Name, email address, contact number, topic, and message content.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-heading font-bold text-lg text-[#19241A] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#0C3B7C] text-white text-xs flex items-center justify-center font-bold">
                2
              </span>
              Purpose of Data Collection & Processing
            </h2>
            <p className="text-[#536054]">
              Your personal data is used solely for the following legitimate non-profit purposes:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-[#536054]">
              <li>Coordinating and mobilizing volunteer assemblies, eco-camps, and tree-growing field trips.</li>
              <li>Issuing electronic receipts and official certificates of appreciation to donors.</li>
              <li>Responding to institutional, academic, or community inquiries.</li>
              <li>Disseminating open-access environmental publications and emergency watershed alerts.</li>
            </ul>
            <p className="text-xs text-[#C8102E] font-bold mt-2">
              We never sell, rent, monetize, or disclose your personal data to third-party commercial marketing firms.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-heading font-bold text-lg text-[#19241A] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#8B5A2B] text-white text-xs flex items-center justify-center font-bold">
                3
              </span>
              Data Protection & Storage Security
            </h2>
            <p className="text-[#536054]">
              All data is stored securely in encrypted databases utilizing industry-standard Row Level Security (RLS) policies. Only authorized organization officers and data protection officers possess credentialed access. Donors&apos; financial transfer proof screenshots are stored in private cloud buckets accessible exclusively by our verified finance secretariat.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-heading font-bold text-lg text-[#19241A] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#D97706] text-white text-xs flex items-center justify-center font-bold">
                4
              </span>
              Your Data Privacy Rights Under RA 10173
            </h2>
            <p className="text-[#536054]">
              As a data subject, you are entitled to the full rights guaranteed by the Philippine Data Privacy Act:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <strong className="block text-xs font-bold text-[#19241A]">Right to be Informed</strong>
                <span className="text-[11px] text-[#536054]">To know how your data is collected and utilized.</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <strong className="block text-xs font-bold text-[#19241A]">Right to Access & Rectify</strong>
                <span className="text-[11px] text-[#536054]">To request a copy and correct inaccurate data.</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <strong className="block text-xs font-bold text-[#19241A]">Right to Erasure or Blocking</strong>
                <span className="text-[11px] text-[#536054]">To request the permanent deletion of your profile.</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <strong className="block text-xs font-bold text-[#19241A]">Right to Data Portability</strong>
                <span className="text-[11px] text-[#536054]">To obtain your volunteer history in a portable format.</span>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 pt-2 border-t border-slate-100">
            <h2 className="font-heading font-bold text-lg text-[#19241A]">
              5. Contact the Data Protection Officer (DPO)
            </h2>
            <p className="text-[#536054]">
              For any questions, requests to delete data, or privacy concerns, please contact our designated Data Protection Officer:
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <p><strong>Kamalayang Kapwa Kalikasan Foundation Inc.</strong></p>
              <p>Attn: Data Protection Officer (DPO)</p>
              <p>Address: Hannah Grace Bldg, Block 21 Lot 9, Mango Village, Salitran IV, 4114 City of Dasmariñas, Cavite</p>
              <p>Email: <a href="mailto:privacy@kkk.org.ph" className="text-[#0C3B7C] hover:underline font-bold">privacy@kkk.org.ph</a></p>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}
