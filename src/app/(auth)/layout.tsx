import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-white selection:bg-emerald-500 selection:text-black">
      
      {/* Fixed Sticky Background with bg 2 for the Whole Auth Layout */}
      <div className="fixed inset-0 -z-30 pointer-events-none select-none">
        <Image
          src="/images/bg2.jpg"
          alt="Sierra Madre Forest Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Dark forest atmospheric overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#06110a]/80 via-[#07160c]/75 to-[#040e06]/92" />
      </div>

      {/* Top Bar with brand and return to site */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#e1ffdd] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Main Website</span>
        </Link>
        <span className="text-[11px] font-semibold text-emerald-300 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
          <span>256-bit Encrypted</span>
        </span>
      </div>

      {/* Main Form Center */}
      <div className="max-w-md w-full mx-auto my-6 relative z-10">
        <div className="text-center mb-6 space-y-2">
          <Link href="/" className="inline-block">
            <div className="relative w-14 h-14 mx-auto rounded-full overflow-hidden border-2 border-[#8B5A2B]/60 bg-[#120A04] shadow-xl hover:scale-105 transition-transform">
              <Image
                src="/images/logo.jpg"
                alt="Kamalayang Kapwa Kalikasan Logo"
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
          </Link>
          <h1 
            style={{ fontFamily: 'var(--font-alice), "Alice", Georgia, serif', color: '#e1ffdd' }}
            className="font-alice text-2xl uppercase tracking-tight"
          >
            Kapwa Kalikasan
          </h1>
          <p className="text-xs text-slate-300">
            Member Portal & Staff Command Center (CMS)
          </p>
        </div>

        <div className="bg-[#0A1B11]/85 backdrop-blur-xl rounded-3xl border border-emerald-500/25 shadow-2xl p-8 space-y-6 text-white">
          {children}
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="text-center text-xs text-slate-400 space-y-1 relative z-10">
        <p className="flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
          <span>Compliant with the Philippine Data Privacy Act of 2012 (RA 10173)</span>
        </p>
        <p>&copy; 2026 Kamalayang Kapwa Kalikasan Foundation Inc. &bull; Cavite HQ</p>
      </div>
    </div>
  );
}
