"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, LogOut, User, Trees, Heart, Calendar } from "lucide-react";
import { signOutUser } from "@/lib/auth";
import { MemberNotificationsDropdown } from "@/components/member/MemberNotificationsDropdown";

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col text-white relative selection:bg-emerald-500 selection:text-black">
      
      {/* Sticky Fixed Background: bg 2 for the Whole Member Dashboard */}
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#06110a]/75 via-[#07160c]/70 to-[#040e06]/92" />
      </div>

      {/* Member Translucent Header */}
      <header className="bg-[#1F1209]/75 backdrop-blur-md border-b border-[#4A2814]/40 py-3.5 sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#8B5A2B]/60 bg-[#120A04] shadow-md group-hover:scale-105 transition-transform">
                <Image
                  src="/images/logo.jpg"
                  alt="Logo"
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </div>
              <span className="font-heading font-extrabold text-sm sm:text-base text-white">
                Kapwa Kalikasan
              </span>
            </Link>
            <span className="hidden sm:inline-block text-xs bg-[#2563EB]/20 text-[#93C5FD] px-2.5 py-0.5 rounded-full font-bold border border-[#2563EB]/40">
              Member Portal
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {/* Real-time Announcements Notifications Bell */}
            <MemberNotificationsDropdown />

            <Link
              href="/"
              className="text-slate-300 hover:text-white hidden sm:inline-flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Main Website</span>
            </Link>
            <button
              type="button"
              onClick={() => signOutUser()}
              className="px-3 py-1.5 rounded-full bg-[#DC2626]/20 border border-[#DC2626]/40 text-red-300 hover:bg-[#DC2626]/40 hover:text-white font-bold flex items-center gap-1 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        {children}
      </main>

      {/* Simple Dark Footer */}
      <footer className="bg-[#120A04]/60 backdrop-blur-md border-t border-[#4A2814]/30 py-6 text-center text-xs text-slate-400">
        <p>&copy; 2026 Kamalayang Kapwa Kalikasan &bull; Member Services</p>
      </footer>
    </div>
  );
}
