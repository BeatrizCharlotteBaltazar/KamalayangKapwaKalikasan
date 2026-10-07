"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Trees, 
  Users, 
  Heart, 
  Flame, 
  FileText, 
  Download, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Search, 
  ArrowLeft, 
  LogOut, 
  Sparkles, 
  ShieldCheck, 
  Mail, 
  ExternalLink,
  ChevronRight,
  Filter,
  UserCheck,
  ShieldAlert,
  RotateCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentUser, signOutUser, UserProfile } from "@/lib/auth";

interface VolunteerRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  program: string;
  date: string;
  status: "Approved" | "Pending Review";
}

interface DonationRow {
  id: string;
  donor: string;
  amount: string;
  trees: number;
  method: string;
  refNo: string;
  date: string;
  status: "Verified" | "Pending Verification";
}

interface EventRow {
  id: string;
  title: string;
  type: "Rally for Nature" | "Tree Growing" | "Coastal Cleanup";
  location: string;
  date: string;
  targetVolunteers: number;
  signedUp: number;
  status: "Confirmed" | "Planning";
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"volunteers" | "donations" | "events" | "cms" | "subscribers">("volunteers");
  const [searchTerm, setSearchTerm] = useState("");
  const [adminUser, setAdminUser] = useState<UserProfile | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const checkAuth = async () => {
    setIsCheckingAuth(true);
    const user = await getCurrentUser();
    setAdminUser(user);
    setIsCheckingAuth(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Real-time record state
  const [volunteers, setVolunteers] = useState<VolunteerRow[]>([
    {
      id: "VOL-001",
      name: "Juanito Dela Cruz",
      email: "juanito.cruz@up.edu.ph",
      phone: "+63 917 223 4455",
      program: "Sierra Madre Reforestation & Rally",
      date: "Oct 06, 2026",
      status: "Approved",
    },
    {
      id: "VOL-002",
      name: "Bea Patricia Reyes",
      email: "bea.reyes@dlsu.edu.ph",
      phone: "+63 920 882 1919",
      program: "Manila Bay Coastal Bakawan Greenbelt",
      date: "Oct 06, 2026",
      status: "Pending Review",
    },
    {
      id: "VOL-003",
      name: "Mark Anthony Santos",
      email: "mark.santos@gmail.com",
      phone: "+63 945 112 9901",
      program: "Peaceful Climate Rally: Defend Sierra Madre",
      date: "Oct 05, 2026",
      status: "Approved",
    },
    {
      id: "VOL-004",
      name: "Camille Joy Tan",
      email: "camille.tan@ust.edu.ph",
      phone: "+63 918 334 7712",
      program: "Tanay Community Seed Nursery",
      date: "Oct 04, 2026",
      status: "Pending Review",
    },
  ]);

  const [donations, setDonations] = useState<DonationRow[]>([
    {
      id: "DON-1029",
      donor: "Maria Corazon Gomez",
      amount: "₱5,000",
      trees: 20,
      method: "GCash",
      refNo: "GC-9921-0029",
      date: "Oct 06, 2026",
      status: "Verified",
    },
    {
      id: "DON-1028",
      donor: "Anonymous Advocate",
      amount: "₱2,500",
      trees: 10,
      method: "Maya",
      refNo: "MY-8812-4011",
      date: "Oct 05, 2026",
      status: "Verified",
    },
    {
      id: "DON-1027",
      donor: "Green Future Corp PH",
      amount: "₱25,000",
      trees: 100,
      method: "Bank Transfer (BPI)",
      refNo: "TRN-902192",
      date: "Oct 05, 2026",
      status: "Pending Verification",
    },
  ]);

  const [events, setEvents] = useState<EventRow[]>([
    {
      id: "EV-01",
      title: "Rally for Climate Justice: Defend Sierra Madre",
      type: "Rally for Nature",
      location: "Quezon Memorial Circle to DENR Central, QC",
      date: "November 28, 2026",
      targetVolunteers: 500,
      signedUp: 382,
      status: "Confirmed",
    },
    {
      id: "EV-02",
      title: "Pista ng Kalikasan: 2,500 Native Tree-Growing",
      type: "Tree Growing",
      location: "Brgy. Cuyambay, Tanay, Rizal",
      date: "November 14, 2026",
      targetVolunteers: 250,
      signedUp: 198,
      status: "Confirmed",
    },
    {
      id: "EV-03",
      title: "Bulacan Mangrove Bakawan Defense Action",
      type: "Coastal Cleanup",
      location: "Paombong River Delta, Bulacan",
      date: "December 05, 2026",
      targetVolunteers: 150,
      signedUp: 94,
      status: "Planning",
    },
  ]);

  const handleApproveVolunteer = (id: string) => {
    setVolunteers((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: "Approved" } : v))
    );
  };

  const handleVerifyDonation = (id: string) => {
    setDonations((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "Verified" } : d))
    );
  };

  const handleExportCsv = (type: string) => {
    alert(`Exporting ${type} data as CSV. Download will begin shortly.`);
  };

  if (isCheckingAuth) {
    return (
      <div className="flex flex-col relative min-h-screen items-center justify-center text-white">
        <div className="fixed inset-0 -z-30 pointer-events-none select-none">
          <Image
            src="/images/bg2.jpg"
            alt="Sierra Madre Rainforest Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#06110a]/85 via-[#07160c]/80 to-[#040e06]/95" />
        </div>
        <div className="text-center space-y-4 p-8 rounded-3xl bg-[#0A1B11]/85 backdrop-blur-xl border border-emerald-500/25 shadow-2xl max-w-md mx-4">
          <RotateCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
          <h2 className="font-heading font-bold text-lg text-white">
            Verifying Supabase Permissions
          </h2>
          <p className="text-xs text-slate-300">
            Checking organization administrator privileges...
          </p>
        </div>
      </div>
    );
  }

  if (!adminUser || adminUser.role !== "admin") {
    return (
      <div className="flex flex-col relative min-h-screen items-center justify-center text-white p-4">
        <div className="fixed inset-0 -z-30 pointer-events-none select-none">
          <Image
            src="/images/bg2.jpg"
            alt="Sierra Madre Rainforest Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#06110a]/85 via-[#07160c]/80 to-[#040e06]/95" />
        </div>

        <div className="max-w-lg w-full p-8 rounded-3xl bg-[#0A1B11]/90 backdrop-blur-xl border border-amber-500/30 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/20 inline-block">
              Executive Staff Clearance Required
            </span>
            <h1 
              style={{ fontFamily: 'var(--font-alice), "Alice", Georgia, serif', color: '#e1ffdd' }}
              className="font-alice text-2xl sm:text-3xl font-normal uppercase tracking-tight"
            >
              Admin Stewardship Portal
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              {adminUser ? (
                <>
                  Signed in as <strong className="text-white">{adminUser.email}</strong> (<span className="text-emerald-400 font-bold capitalize">{adminUser.role}</span>). This account does not yet have administrator rights.
                </>
              ) : (
                "You must be signed in with an administrator account to access the operations command center."
              )}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/50 border border-white/10 text-left text-xs text-slate-300 space-y-2">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <span>How to grant Admin role in Supabase:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300 leading-relaxed">
              <li>Open your <strong>Supabase Project Dashboard</strong></li>
              <li>Navigate to <strong>Authentication &rarr; Users</strong></li>
              <li>Find this user and click <strong>Edit User / User Metadata</strong></li>
              <li>Set <code className="text-emerald-300 font-mono">{`"role": "admin"`}</code> and save</li>
            </ol>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs">
            {adminUser ? (
              <>
                <Button
                  onClick={() => checkAuth()}
                  className="w-full sm:w-auto bg-[#22C55E] hover:bg-[#16A34A] text-slate-950 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Recheck Permissions</span>
                </Button>
                <Link
                  href="/member/dashboard"
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors text-center"
                >
                  Go to Member Portal
                </Link>
                <button
                  type="button"
                  onClick={() => signOutUser()}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 hover:text-white font-bold transition-colors cursor-pointer text-center"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-slate-950 font-bold transition-colors text-center"
                >
                  Sign In to Admin Account &rarr;
                </Link>
                <Link
                  href="/"
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors text-center"
                >
                  Back to Website
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col relative min-h-screen">
      
      {/* Sticky Background with bg 2 for the Whole Admin Page (Matching Home Page) */}
      <div className="fixed inset-0 -z-30 pointer-events-none select-none">
        <Image
          src="/images/bg2.jpg"
          alt="Sierra Madre Rainforest Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Cinematic dark forest overlay for high contrast & readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#06110a]/75 via-[#07160c]/70 to-[#040e06]/92" />
      </div>

      {/* Admin Translucent Navbar */}
      <header className="sticky top-0 z-40 bg-[#1F1209]/75 backdrop-blur-md border-b border-[#4A2814]/40 py-3.5 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#8B5A2B]/50 bg-[#120A04] shadow-md group-hover:scale-105 transition-transform">
                <Image
                  src="/images/logo.jpg"
                  alt="Logo"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <div>
                <span className="font-heading font-extrabold text-sm sm:text-base text-white tracking-wide block leading-tight">
                  Kamalayang Kapwa Kalikasan
                </span>
                <span className="text-[10px] font-bold text-[#F59E0B] uppercase tracking-wider block">
                  Admin Operations Center
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2.5 text-xs">
            {adminUser && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-medium">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="truncate max-w-[150px]">{adminUser.fullName || adminUser.email}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-bold uppercase">
                  {adminUser.role}
                </span>
              </div>
            )}

            <Link
              href="/"
              className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 font-semibold"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#22C55E]" />
              <span className="hidden sm:inline">Live Website</span>
            </Link>

            <Link
              href="/member/dashboard"
              className="px-3 py-1.5 rounded-full bg-[#2563EB]/20 hover:bg-[#2563EB]/40 border border-[#2563EB]/40 text-[#93C5FD] transition-all flex items-center gap-1.5 font-bold"
            >
              <Users className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span className="hidden sm:inline">Member Portal</span>
            </Link>

            <button
              type="button"
              onClick={() => signOutUser()}
              className="px-3 py-1.5 rounded-full bg-[#DC2626]/20 hover:bg-[#DC2626]/40 border border-[#DC2626]/40 text-red-300 hover:text-white transition-all flex items-center gap-1.5 font-bold cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-[#EF4444]" />
              <span>Sign Out</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 relative z-10">
        
        {/* Page Header (Matching Home font: Alice serif in #e1ffdd) */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#180E07]/90 border border-[#8B5A2B]/40 text-xs font-bold text-[#F59E0B]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
            <span>Executive Staff Command &bull; Cavite HQ</span>
          </div>

          <h1 
            style={{ fontFamily: 'var(--font-alice), "Alice", Georgia, serif', color: '#e1ffdd' }}
            className="font-alice text-4xl sm:text-5xl lg:text-6xl font-normal uppercase tracking-tight leading-tight select-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
          >
            Admin Stewardship Portal
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            Central dashboard for coordinating climate justice rallies, tracking native tree donations for carbon footprint offset, and reviewing grassroots volunteer dispatches.
          </p>
        </div>

        {/* Real-time KPI Highlights (Home Theme Glass Panels) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: Trees Planted & Donated */}
          <div className="p-6 rounded-3xl bg-[#0A1B11]/85 backdrop-blur-xl border border-emerald-500/25 shadow-2xl flex flex-col justify-between space-y-3 hover:border-emerald-400/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4C3A3]">
                Carbon Offset Trees
              </span>
              <div className="p-2.5 rounded-2xl bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                <Trees className="w-5 h-5 text-[#22C55E]" />
              </div>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                14,800+
              </span>
              <p className="text-xs text-emerald-300 font-semibold mt-1">
                +240 trees pledged this week
              </p>
            </div>
            <div className="pt-2 border-t border-white/10 text-[11px] text-slate-300 flex items-center justify-between">
              <span>Goal: 25,000 in Sierra Madre</span>
              <span className="text-[#F59E0B] font-bold">59%</span>
            </div>
          </div>

          {/* Card 2: Total Funds Raised */}
          <div className="p-6 rounded-3xl bg-[#0A1B11]/85 backdrop-blur-xl border border-emerald-500/25 shadow-2xl flex flex-col justify-between space-y-3 hover:border-emerald-400/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4C3A3]">
                Donations Collected
              </span>
              <div className="p-2.5 rounded-2xl bg-red-950/80 text-red-400 border border-red-500/30">
                <Heart className="w-5 h-5 fill-[#DC2626] text-[#DC2626]" />
              </div>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                ₱3,700,000
              </span>
              <p className="text-xs text-red-300 font-semibold mt-1">
                100% Free Open Transparency
              </p>
            </div>
            <div className="pt-2 border-t border-white/10 text-[11px] text-slate-300 flex items-center justify-between">
              <span>GCash &bull; Maya &bull; Direct BPI</span>
              <span className="text-emerald-400 font-bold">Audited</span>
            </div>
          </div>

          {/* Card 3: Volunteers Registered */}
          <div className="p-6 rounded-3xl bg-[#0A1B11]/85 backdrop-blur-xl border border-emerald-500/25 shadow-2xl flex flex-col justify-between space-y-3 hover:border-emerald-400/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4C3A3]">
                Volunteers Enrolled
              </span>
              <div className="p-2.5 rounded-2xl bg-blue-950/80 text-blue-400 border border-blue-500/30">
                <Users className="w-5 h-5 text-[#2563EB]" />
              </div>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                1,250
              </span>
              <p className="text-xs text-blue-300 font-semibold mt-1">
                Youth & Community Leaders
              </p>
            </div>
            <div className="pt-2 border-t border-white/10 text-[11px] text-slate-300 flex items-center justify-between">
              <span>Active Field Stewards</span>
              <span className="text-blue-400 font-bold">8 Cohorts</span>
            </div>
          </div>

          {/* Card 4: Scheduled Rallies */}
          <div className="p-6 rounded-3xl bg-[#0A1B11]/85 backdrop-blur-xl border border-emerald-500/25 shadow-2xl flex flex-col justify-between space-y-3 hover:border-emerald-400/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4C3A3]">
                Climate Rallies
              </span>
              <div className="p-2.5 rounded-2xl bg-amber-950/80 text-amber-400 border border-amber-500/30">
                <Flame className="w-5 h-5 text-[#F59E0B]" />
              </div>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                4 Active
              </span>
              <p className="text-xs text-amber-300 font-semibold mt-1">
                Mobilizations in Nov & Dec
              </p>
            </div>
            <div className="pt-2 border-t border-white/10 text-[11px] text-slate-300 flex items-center justify-between">
              <span>Peaceful Environmental Action</span>
              <span className="text-amber-400 font-bold">Planned</span>
            </div>
          </div>

        </div>

        {/* Tab Navigation (Using The Seasons font style) */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
          {[
            { id: "volunteers", label: "Volunteer Applications", icon: Users, badge: "2 Pending" },
            { id: "donations", label: "Tree Donations & Verification", icon: Trees, badge: "1 New" },
            { id: "events", label: "Climate Rallies & Events", icon: Flame, badge: "4 Active" },
            { id: "cms", label: "Knowledge Articles CMS", icon: FileText },
            { id: "subscribers", label: "Subscribers & CSV Export", icon: Mail },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? "bg-[#25150B] text-[#e1ffdd] border border-[#8B5A2B] shadow-lg scale-102"
                    : "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10 hover:text-white"
                }`}
                style={{ fontFamily: 'var(--font-the-seasons), "The Seasons", Georgia, serif' }}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#e1ffdd]" : "text-slate-400"}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-sans ${
                    isActive ? "bg-[#e1ffdd] text-[#120A04] font-black" : "bg-white/10 text-slate-300"
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: Volunteers Management */}
        {activeTab === "volunteers" && (
          <section className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">
                  Volunteer Rosters & Applications
                </h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  Review new sign-ups, approve attendance, and assign volunteers to cohorts.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => handleExportCsv("Volunteers")} 
                  variant="outline" 
                  size="sm" 
                  className="border-emerald-500/40 text-emerald-300 hover:text-white hover:bg-emerald-950/50"
                >
                  <Download className="w-3.5 h-3.5 mr-1" />
                  <span>Export CSV</span>
                </Button>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-3xl overflow-hidden bg-[#0A1B11]/85 backdrop-blur-xl border border-emerald-500/25 shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#12281B] text-[#D4C3A3] text-[11px] font-bold uppercase tracking-wider border-b border-white/10">
                    <tr>
                      <th className="py-3.5 px-6">ID & Volunteer</th>
                      <th className="py-3.5 px-6">Contact Info</th>
                      <th className="py-3.5 px-6">Assigned Program</th>
                      <th className="py-3.5 px-6">Date Registered</th>
                      <th className="py-3.5 px-6">Status</th>
                      <th className="py-3.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-slate-200">
                    {volunteers.map((v) => (
                      <tr key={v.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6 font-semibold">
                          <span className="block text-white font-bold">{v.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{v.id}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="block text-slate-300">{v.email}</span>
                          <span className="text-xs text-slate-400">{v.phone}</span>
                        </td>
                        <td className="py-4 px-6 text-emerald-300 font-medium">
                          {v.program}
                        </td>
                        <td className="py-4 px-6 text-slate-400 text-xs">
                          {v.date}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                            v.status === "Approved"
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-500/40"
                              : "bg-amber-950 text-amber-400 border border-amber-500/40"
                          }`}>
                            {v.status === "Approved" ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Clock className="w-3 h-3 text-amber-400" />
                            )}
                            <span>{v.status}</span>
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          {v.status !== "Approved" ? (
                            <Button
                              onClick={() => handleApproveVolunteer(v.id)}
                              size="sm"
                              className="bg-[#22C55E] hover:bg-[#16A34A] text-slate-950 font-bold text-xs rounded-xl"
                            >
                              Approve
                            </Button>
                          ) : (
                            <span className="text-xs text-emerald-400 font-semibold">
                              Ready for Field
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* TAB 2: Tree Donations & Verification */}
        {activeTab === "donations" && (
          <section className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">
                  Tree Sponsorships & Donation Ledger
                </h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  Verify GCash, Maya, and bank transfers to issue native tree offset certificates.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => handleExportCsv("Donations")} 
                  variant="outline" 
                  size="sm" 
                  className="border-emerald-500/40 text-emerald-300 hover:text-white hover:bg-emerald-950/50"
                >
                  <Download className="w-3.5 h-3.5 mr-1" />
                  <span>Export Financial Report</span>
                </Button>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-3xl overflow-hidden bg-[#0A1B11]/85 backdrop-blur-xl border border-emerald-500/25 shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#12281B] text-[#D4C3A3] text-[11px] font-bold uppercase tracking-wider border-b border-white/10">
                    <tr>
                      <th className="py-3.5 px-6">Donation ID & Donor</th>
                      <th className="py-3.5 px-6">Amount</th>
                      <th className="py-3.5 px-6">Trees Sponsored</th>
                      <th className="py-3.5 px-6">Payment Method & Ref</th>
                      <th className="py-3.5 px-6">Date</th>
                      <th className="py-3.5 px-6">Status</th>
                      <th className="py-3.5 px-6 text-right">Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-slate-200">
                    {donations.map((d) => (
                      <tr key={d.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6">
                          <span className="block text-white font-bold">{d.donor}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{d.id}</span>
                        </td>
                        <td className="py-4 px-6 text-white font-extrabold text-base">
                          {d.amount}
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/30 text-xs inline-flex items-center gap-1">
                            <Trees className="w-3 h-3 text-[#22C55E]" />
                            <span>{d.trees} Native Trees</span>
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="block text-white font-medium">{d.method}</span>
                          <span className="text-[11px] text-slate-400 font-mono">{d.refNo}</span>
                        </td>
                        <td className="py-4 px-6 text-slate-400 text-xs">
                          {d.date}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                            d.status === "Verified"
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-500/40"
                              : "bg-amber-950 text-amber-400 border border-amber-500/40"
                          }`}>
                            {d.status === "Verified" ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Clock className="w-3 h-3 text-amber-400" />
                            )}
                            <span>{d.status}</span>
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          {d.status !== "Verified" ? (
                            <Button
                              onClick={() => handleVerifyDonation(d.id)}
                              size="sm"
                              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-xl"
                            >
                              Verify & Issue Cert
                            </Button>
                          ) : (
                            <span className="text-xs text-blue-300 font-semibold">
                              Receipt & Cert Issued
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* TAB 3: Climate Rallies & Events CMS */}
        {activeTab === "events" && (
          <section className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">
                  Environmental Rallies & Field Missions CMS
                </h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  Organize and publish peaceful climate rallies, watershed protection camps, and volunteer assemblies.
                </p>
              </div>

              <Button size="sm" className="bg-[#B07D48] hover:bg-[#9E6E3C] text-[#1A1108] font-bold text-xs rounded-full">
                <Plus className="w-3.5 h-3.5 mr-1" />
                <span>Create New Rally or Mission</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="p-6 rounded-3xl bg-[#0A1B11]/85 backdrop-blur-xl border border-emerald-500/25 shadow-2xl flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-red-950/80 text-red-300 text-[10px] font-bold border border-red-500/30">
                        {ev.type}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400">
                        {ev.status}
                      </span>
                    </div>

                    <h3 className="font-heading font-extrabold text-lg text-white leading-snug">
                      {ev.title}
                    </h3>

                    <p className="text-xs text-slate-300">
                      <strong>Location:</strong> {ev.location}
                    </p>

                    <p className="text-xs text-amber-300">
                      <strong>Date:</strong> {ev.date}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 space-y-2">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Volunteers Mobilized</span>
                      <strong className="text-white">{ev.signedUp} / {ev.targetVolunteers}</strong>
                    </div>
                    <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#22C55E] h-full rounded-full"
                        style={{ width: `${Math.min(100, (ev.signedUp / ev.targetVolunteers) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 4: Knowledge Hub CMS */}
        {activeTab === "cms" && (
          <section className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">
                  Educational Publications & Guides
                </h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  Manage downloadable PDF resources and ecological farming manuals.
                </p>
              </div>

              <Link href="/resources">
                <Button size="sm" variant="outline" className="border-emerald-500/40 text-emerald-300">
                  <ExternalLink className="w-3.5 h-3.5 mr-1" />
                  <span>View Public Knowledge Hub</span>
                </Button>
              </Link>
            </div>

            <div className="p-8 rounded-3xl bg-[#0A1B11]/85 backdrop-blur-xl border border-emerald-500/25 shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-white text-sm">
                  Connected to Supabase Content Repository
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                All articles are stored in markdown format and served statically with Next.js ISR (Incremental Static Regeneration). Staff can edit guides directly or draft new environmental manuals.
              </p>
            </div>
          </section>
        )}

        {/* TAB 5: Subscribers & Community */}
        {activeTab === "subscribers" && (
          <section className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">
                  Newsletter & Community Subscribers
                </h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  Over 3,420 Filipino environmental supporters subscribed to action alerts and rally calls.
                </p>
              </div>

              <Button 
                onClick={() => handleExportCsv("Subscribers")}
                size="sm"
                className="bg-[#22C55E] hover:bg-[#16A34A] text-slate-950 font-bold"
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                <span>Export Subscriber List (CSV)</span>
              </Button>
            </div>

            <div className="p-8 rounded-3xl bg-[#0A1B11]/85 backdrop-blur-xl border border-emerald-500/25 shadow-2xl space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">
                Subscribers receive weekly digests on Sierra Madre watershed updates, mangrove replanting invitations, and emergency eco mobilization dispatches.
              </p>
            </div>
          </section>
        )}

      </main>

      {/* Admin Footer */}
      <footer className="py-6 border-t border-[#4A2814]/30 text-center text-xs text-slate-400 bg-[#120A04]/60 backdrop-blur-md">
        <p>&copy; 2026 Kamalayang Kapwa Kalikasan Foundation &bull; Internal Operations</p>
      </footer>

    </div>
  );
}
