import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Heart, CheckCircle2, Trees, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Thank You for Your Support | Kamalayang Kapwa Kalikasan",
  description: "Your donation record has been successfully logged.",
};

export default function ThankYouPage() {
  return (
    <div className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        {/* Animated Badge Icon */}
        <div className="w-20 h-20 rounded-full bg-red-50 text-[#C8102E] border-4 border-red-200 flex items-center justify-center mx-auto shadow-lg animate-in zoom-in duration-300">
          <Heart className="w-10 h-10 fill-[#C8102E]" />
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#2E5E34] text-xs font-bold border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Taos-Pusong Pasasalamat • Heartfelt Gratitude</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-black text-[#19241A] tracking-tight">
            Thank You for Empowering Nature!
          </h1>

          <p className="text-base text-[#536054] leading-relaxed max-w-lg mx-auto">
            Your donation information has been successfully logged. Every contribution directly nurtures native trees, protects coastal communities, and sustains volunteer patrols.
          </p>
        </div>

        {/* Status explanation card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/95 backdrop-blur-sm border border-slate-200/90 shadow-sm text-left space-y-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#2E5E34] shrink-0" />
            <h3 className="font-heading font-black text-base text-[#19241A]">
              Record Status: <span className="text-[#0C3B7C]">Pending Verification</span>
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-[#536054] leading-relaxed">
            In compliance with our organization&apos;s strict financial transparency protocols, new donations are logged as <strong>Pending</strong> while our volunteer finance team reconciles the reference number against our official bank or GCash statement.
          </p>

          <p className="text-xs sm:text-sm text-[#536054] leading-relaxed">
            Once confirmed (typically within 24 to 48 hours), you will receive your official <strong>Electronic Certificate of Green Donation</strong> via email.
          </p>

          <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-[#2E5E34] font-semibold">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Protected under the Philippine Data Privacy Act of 2012 (RA 10173).</span>
          </div>
        </div>

        {/* Next Actions */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/programs">
            <Button size="lg" className="w-full sm:w-auto bg-[#2E5E34] hover:bg-[#1F4425] text-white font-bold text-xs flex items-center gap-2">
              <Trees className="w-4 h-4" />
              <span>Explore Programs You Supported</span>
            </Button>
          </Link>

          <Link href="/">
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-200 text-[#0C3B7C] font-bold text-xs flex items-center gap-1.5">
              <span>Return to Homepage</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
