"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  User, 
  Trees, 
  Heart, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Award,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MemberDashboardPage() {
  const [activeTab, setActiveTab] = useState<"volunteering" | "donations">("volunteering");

  const sampleVolunteerActivities = [
    {
      id: "v-1",
      program: "Bantay Sierra Madre: Tree-Growing Cohort 4",
      date: "November 14, 2026",
      location: "Tanay, Rizal",
      status: "Confirmed Attendance",
      statusColor: "bg-blue-950 text-blue-300 border-blue-500/40",
      role: "Field Tree Planter",
    },
    {
      id: "v-2",
      program: "Manila Bay Coastal Bakawan Greenbelt",
      date: "September 28, 2026",
      location: "Paombong, Bulacan",
      status: "Completed (6 Eco-Hours)",
      statusColor: "bg-emerald-950 text-emerald-300 border-emerald-500/40",
      role: "Seedling Nursery Support",
    },
  ];

  const sampleDonations = [
    {
      id: "d-1",
      date: "October 02, 2026",
      amount: "₱1,000.00",
      channel: "GCash (Ref: 1004-9281-2918)",
      purpose: "Bakawan Coastal Kit (5 propagules)",
      status: "Verified by Finance",
    },
    {
      id: "d-2",
      date: "August 15, 2026",
      amount: "₱500.00",
      channel: "BPI Online (Ref: TRN-882910)",
      purpose: "Sierra Madre Reforestation Fund",
      status: "Verified by Finance",
    },
  ];

  return (
    <div className="space-y-8 text-white">
      
      {/* Welcome Banner (Dark Forest Glassmorphism) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0A1B11]/85 backdrop-blur-xl border border-emerald-500/25 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-300 font-black text-2xl font-heading shrink-0 shadow-lg">
            M
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 
                style={{ fontFamily: 'var(--font-alice), "Alice", Georgia, serif', color: '#e1ffdd' }}
                className="font-alice text-2xl sm:text-3xl font-normal tracking-tight"
              >
                Welcome back, Maria!
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                Active Eco-Steward
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              Member since August 2026 &bull; <strong className="text-white">6</strong> Volunteer Hours &bull; <strong className="text-white">₱1,500</strong> Carbon Offset Contributions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/get-involved">
            <Button size="sm" className="bg-[#B07D48] hover:bg-[#9E6E3C] text-[#1A1108] text-xs font-bold rounded-xl shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Join Mission</span>
            </Button>
          </Link>
          <Link href="/donate">
            <Button size="sm" className="bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold rounded-xl shadow-md">
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>Donate</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards with Humanity & Nature Themes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Card 1: Volunteer Hours (Philippine Blue) */}
        <div className="p-6 rounded-3xl bg-[#0A1B11]/85 backdrop-blur-xl border border-blue-500/30 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
              Bayanihan Hours
            </span>
            <div className="p-2.5 rounded-2xl bg-blue-950/80 text-blue-400 border border-blue-500/30">
              <Clock className="w-4 h-4 text-[#3B82F6]" />
            </div>
          </div>
          <div className="font-heading text-3xl sm:text-4xl font-black text-white">
            6 Hours
          </div>
          <p className="text-xs text-slate-300">
            1 Field rally completed; 1 upcoming confirmed in Rizal
          </p>
        </div>

        {/* Card 2: Trees Planted (Forest Green) */}
        <div className="p-6 rounded-3xl bg-[#0A1B11]/85 backdrop-blur-xl border border-emerald-500/30 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Native Trees Planted
            </span>
            <div className="p-2.5 rounded-2xl bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
              <Trees className="w-4 h-4 text-[#22C55E]" />
            </div>
          </div>
          <div className="font-heading text-3xl sm:text-4xl font-black text-white">
            7 Trees
          </div>
          <p className="text-xs text-slate-300">
            5 Bakawan propagules + 2 Sierra Madre Narra saplings
          </p>
        </div>

        {/* Card 3: Total Donated (Philippine Red) */}
        <div className="p-6 rounded-3xl bg-[#0A1B11]/85 backdrop-blur-xl border border-red-500/30 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-red-300">
              Total Contributions
            </span>
            <div className="p-2.5 rounded-2xl bg-red-950/80 text-red-400 border border-red-500/30">
              <Heart className="w-4 h-4 fill-[#DC2626] text-[#DC2626]" />
            </div>
          </div>
          <div className="font-heading text-3xl sm:text-4xl font-black text-white">
            ₱1,500.00
          </div>
          <p className="text-xs text-slate-300">
            100% verified &bull; Issued under RA 10173
          </p>
        </div>
      </div>

      {/* Tabs Switcher: Volunteering vs Donations */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-white/10 pb-3">
          <button
            onClick={() => setActiveTab("volunteering")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "volunteering"
                ? "bg-[#25150B] text-[#e1ffdd] border border-[#8B5A2B] shadow-md"
                : "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10"
            }`}
          >
            Volunteer Missions ({sampleVolunteerActivities.length})
          </button>

          <button
            onClick={() => setActiveTab("donations")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "donations"
                ? "bg-[#25150B] text-[#e1ffdd] border border-[#8B5A2B] shadow-md"
                : "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10"
            }`}
          >
            Logged Donations ({sampleDonations.length})
          </button>
        </div>

        {/* Tab 1: Volunteering */}
        {activeTab === "volunteering" && (
          <div className="space-y-4">
            {sampleVolunteerActivities.map((act) => (
              <div
                key={act.id}
                className="p-5 sm:p-6 rounded-3xl bg-[#0A1B11]/85 backdrop-blur-xl border border-emerald-500/25 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${act.statusColor}`}>
                      {act.status}
                    </span>
                    <span className="text-xs font-semibold text-[#F59E0B]">
                      Role: {act.role}
                    </span>
                  </div>
                  <h3 className="font-heading font-extrabold text-base text-white">
                    {act.program}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-slate-300">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      {act.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      {act.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button size="sm" variant="outline" className="text-xs border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/60 rounded-xl">
                    <Award className="w-3.5 h-3.5 text-[#F59E0B] mr-1" />
                    <span>Download Certificate</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Donations */}
        {activeTab === "donations" && (
          <div className="space-y-4">
            {sampleDonations.map((don) => (
              <div
                key={don.id}
                className="p-5 sm:p-6 rounded-3xl bg-[#0A1B11]/85 backdrop-blur-xl border border-emerald-500/25 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                      {don.status}
                    </span>
                    <span className="text-xs text-slate-400">
                      {don.date}
                    </span>
                  </div>
                  <h3 className="font-heading font-black text-xl text-white">
                    {don.amount}
                  </h3>
                  <p className="text-xs text-slate-300">
                    <strong>Purpose:</strong> {don.purpose} &bull; <span className="font-mono text-emerald-300">{don.channel}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button size="sm" variant="outline" className="text-xs border-blue-500/40 text-blue-300 hover:bg-blue-950/60 rounded-xl">
                    View E-Receipt
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
