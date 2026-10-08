"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  HeartHandshake, 
  Trees, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  Users, 
  Send,
  Heart
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const interestOptions = [
  "Native Tree Reforestation (Sierra Madre & Cavite)",
  "Coastal & Estuary Mangrove Cleanups (Manila Bay & Cavite)",
  "Youth Environmental Education & Eco-Workshops",
  "Urban Food Forests & Barangay Composting Hubs",
  "Field Documentation (Photography, Video & Creative Storytelling)",
  "Policy Research & Legal Advocacy Support",
];

const availabilityOptions = [
  "Weekends (Saturday or Sunday Field Trips)",
  "Weekdays (Workshops & School Sessions)",
  "Monthly Volunteer Assemblies",
  "On-Call / Project-Based Mobilization",
];

export default function GetInvolvedPage() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    location: "",
    interests: [] as string[],
    availability: "Weekends (Saturday or Sunday Field Trips)",
    message: "",
    honeypot: "",
    consent_given: false,
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const toggleInterest = (item: string) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(item);
      if (exists) {
        return { ...prev, interests: prev.interests.filter((i) => i !== item) };
      } else {
        return { ...prev, interests: [...prev.interests, item] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.honeypot) {
      setStatus("success");
      return;
    }

    if (formData.interests.length === 0) {
      setErrorMessage("Please select at least one field of volunteer interest.");
      setStatus("error");
      return;
    }

    if (!formData.consent_given) {
      setErrorMessage("Please accept the Data Privacy Act (RA 10173) consent checkbox.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit volunteer registration.");
      }

      // Also persist locally for instant admin sync
      if (typeof window !== "undefined") {
        try {
          const localRaw = localStorage.getItem("kkk_volunteer_applications");
          const localList = localRaw ? JSON.parse(localRaw) : [];
          localList.unshift(data.data || {
            id: `vol-${Date.now()}`,
            fullName: formData.full_name,
            email: formData.email,
            phone: formData.phone,
            location: formData.location,
            interests: formData.interests,
            availability: formData.availability,
            message: formData.message,
            program: "Sierra Madre Reforestation",
            status: "Pending Review",
            createdAt: new Date().toISOString(),
          });
          localStorage.setItem("kkk_volunteer_applications", JSON.stringify(localList));
          window.dispatchEvent(new Event("kkk_content_updated"));
          window.dispatchEvent(new Event("storage"));
        } catch {
          // ignore
        }
      }

      setStatus("success");
    } catch (err: any) {
      console.error("[Volunteer Submission Error]", err);
      setErrorMessage(err?.message || "Failed to submit volunteer registration. Please review your information.");
      setStatus("error");
    }
  };

  return (
    <div className="py-12 md:py-20 relative overflow-hidden text-white bg-subpage-forest1 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#180E07]/90 border border-[#8B5A2B]/40 text-xs font-bold text-amber-300 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Bayanihan Volunteers • Sumali sa Pagkilos</span>
          </div>

          <h1 
            className="font-alice text-4xl sm:text-6xl font-normal uppercase tracking-tight text-[#e1ffdd]"
            style={{ fontFamily: 'var(--font-alice), "Alice", Georgia, serif', color: '#e1ffdd' }}
          >
            Join the Bayanihan <br />
            <span className="text-white">for Mother Nature</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            Become a community steward. Whether you can give a few hours on a weekend or lead eco-workshops in your barangay, your contribution matters.
          </p>
        </div>

        {/* Success Card */}
        {status === "success" ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-[#0A1B11]/95 backdrop-blur-md border border-emerald-500/40 shadow-2xl text-center space-y-5 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-3xl bg-emerald-950 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h2 className="font-heading text-2xl sm:text-3xl font-black text-white">
                Maraming Salamat, Bayanihan Volunteer!
              </h2>
              <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                Your volunteer application has been received and logged in the system. Our volunteer coordination team will contact you via email with orientation details and upcoming field schedules.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <Link href="/programs">
                <Button className="bg-[#22C55E] hover:bg-[#16A34A] text-slate-950 font-bold text-xs rounded-xl">
                  Explore Active Programs &rarr;
                </Button>
              </Link>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="px-4 py-2.5 rounded-xl border border-white/20 text-xs font-bold text-slate-300 hover:bg-white/10 cursor-pointer transition-colors"
              >
                Submit Another Application
              </button>
            </div>
          </div>
        ) : (
          /* Registration Form Card */
          <div className="p-6 sm:p-10 rounded-3xl bg-[#0A1B11]/90 backdrop-blur-xl border border-emerald-500/25 shadow-2xl space-y-8">
            
            <div className="border-b border-white/10 pb-4">
              <h2 className="font-heading text-2xl font-black text-white">
                Volunteer Registration Form
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Please complete your basic information and volunteer preferences below.
              </p>
            </div>

            {errorMessage && (
              <div className="p-4 rounded-2xl bg-red-950/80 border border-red-500/40 text-xs text-red-300 flex items-start gap-2 shadow-lg">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Bot Honeypot */}
              <input
                type="text"
                name="preferred_country_bot"
                tabIndex={-1}
                autoComplete="off"
                value={formData.honeypot}
                onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                className="hidden"
              />

              {/* 1. Basic Info */}
              <div className="space-y-4">
                <h3 className="font-heading text-sm font-bold text-emerald-400 uppercase tracking-wider">
                  1. Contact Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wide">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maria Clara Santos"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-emerald-500/30 text-white placeholder:text-slate-400 placeholder:font-normal text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all shadow-inner"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wide">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. maria@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-emerald-500/30 text-white placeholder:text-slate-400 placeholder:font-normal text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wide">
                      Mobile Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0917-123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-emerald-500/30 text-white placeholder:text-slate-400 placeholder:font-normal text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all shadow-inner"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wide">
                      Location / City / Province <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dasmariñas, Cavite or Quezon City"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-emerald-500/30 text-white placeholder:text-slate-400 placeholder:font-normal text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all shadow-inner"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Areas of Interest */}
              <div className="space-y-4 pt-2">
                <h3 className="font-heading text-sm font-bold text-emerald-400 uppercase tracking-wider">
                  2. Volunteer Areas of Interest <span className="text-red-400">*</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {interestOptions.map((opt) => {
                    const checked = formData.interests.includes(opt);
                    return (
                      <label
                        key={opt}
                        className={`flex items-start gap-3 p-3.5 rounded-2xl border text-xs sm:text-sm cursor-pointer transition-all ${
                          checked
                            ? "bg-emerald-950/80 border-emerald-400 text-emerald-300 font-bold shadow-md"
                            : "bg-black/40 border-emerald-500/20 text-slate-300 hover:bg-white/5"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleInterest(opt)}
                          className="mt-0.5 h-4 w-4 rounded text-emerald-500 focus:ring-emerald-400 accent-emerald-500"
                        />
                        <span>{opt}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 3. Availability */}
              <div className="space-y-4 pt-2">
                <h3 className="font-heading text-sm font-bold text-emerald-400 uppercase tracking-wider">
                  3. Preferred Availability
                </h3>

                <select
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#08180E] border border-emerald-500/30 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all shadow-inner"
                >
                  {availabilityOptions.map((opt) => (
                    <option key={opt} value={opt} className="bg-[#08180E] text-white">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Notes */}
              <div className="space-y-1.5 pt-2">
                <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wide">
                  Optional Note or Special Skills (e.g. First aid, Drone pilot, Driver, Photographer)
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about yourself or any special skills you bring..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-emerald-500/30 text-white placeholder:text-slate-400 placeholder:font-normal text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all shadow-inner resize-y"
                />
              </div>

              {/* RA 10173 Consent */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-500/20 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="privacy-volunteer"
                  checked={formData.consent_given}
                  onChange={(e) => setFormData({ ...formData, consent_given: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded text-emerald-500 focus:ring-emerald-400 accent-emerald-500 cursor-pointer"
                />
                <label htmlFor="privacy-volunteer" className="text-xs text-slate-300 leading-relaxed cursor-pointer">
                  I agree to the collection of my details for volunteer coordination in accordance with the <strong className="text-white">Data Privacy Act of 2012 (RA 10173)</strong>.
                </label>
              </div>

              <Button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-slate-950 font-black py-4 rounded-xl shadow-lg text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-emerald-950" />
                <span>{status === "loading" ? "Submitting Application..." : "Submit Volunteer Registration"}</span>
              </Button>

            </form>

          </div>
        )}

      </div>
    </div>
  );
}
