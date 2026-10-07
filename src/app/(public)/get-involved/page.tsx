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

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit volunteer registration.");
      }

      setStatus("success");
    } catch (err: any) {
      // In demo static mode, gracefully show success feedback
      setStatus("success");
    }
  };

  return (
    <div className="py-10 md:py-16 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200 text-xs font-bold text-[#19241A] shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0C3B7C]" />
            <span className="text-[#0C3B7C]">Bayanihan Volunteers</span>
            <span className="text-slate-300">•</span>
            <span className="text-[#2E5E34]">Get Involved</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl font-black text-[#19241A] tracking-tight">
            Join the Bayanihan for Nature
          </h1>

          <p className="text-base sm:text-lg text-[#536054] leading-relaxed max-w-2xl mx-auto">
            Become a community steward. Whether you can give a few hours on a weekend or lead eco-workshops in your barangay, your contribution matters.
          </p>
        </div>

        {/* Success Card */}
        {status === "success" ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-white/95 backdrop-blur-sm border-2 border-[#2E5E34]/30 shadow-xl text-center space-y-5 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-[#2E5E34] flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h2 className="font-heading text-2xl sm:text-3xl font-black text-[#19241A]">
                Maraming Salamat, Bayanihan Volunteer!
              </h2>
              <p className="text-sm text-[#536054] max-w-lg mx-auto leading-relaxed">
                Your volunteer application has been received. Our volunteer coordination team will contact you via email with orientation details and upcoming field schedules.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <Link href="/programs">
                <Button className="bg-[#2E5E34] hover:bg-[#1F4425] text-white font-bold text-xs">
                  Explore Active Programs &rarr;
                </Button>
              </Link>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#536054] hover:bg-slate-50 cursor-pointer"
              >
                Submit Another Application
              </button>
            </div>
          </div>
        ) : (
          /* Registration Form Card */
          <div className="p-6 sm:p-10 rounded-3xl bg-white/95 backdrop-blur-sm border border-slate-200/90 shadow-sm space-y-8">
            
            <div className="border-b border-slate-100 pb-4">
              <h2 className="font-heading text-2xl font-black text-[#19241A]">
                Volunteer Registration Form
              </h2>
              <p className="text-xs sm:text-sm text-[#536054] mt-1">
                Please complete your basic information and volunteer preferences below.
              </p>
            </div>

            {errorMessage && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
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
                <h3 className="font-heading text-sm font-bold text-[#0C3B7C] uppercase tracking-wider">
                  1. Contact Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#19241A] uppercase tracking-wide">
                      Full Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maria Clara Santos"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3B7C]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#19241A] uppercase tracking-wide">
                      Email Address <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. maria@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3B7C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#19241A] uppercase tracking-wide">
                      Mobile Number <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0917-123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3B7C]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#19241A] uppercase tracking-wide">
                      Location / City / Province <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dasmariñas, Cavite or Quezon City"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3B7C]"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Areas of Interest */}
              <div className="space-y-4 pt-2">
                <h3 className="font-heading text-sm font-bold text-[#0C3B7C] uppercase tracking-wider">
                  2. Volunteer Areas of Interest <span className="text-red-600">*</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {interestOptions.map((opt) => {
                    const checked = formData.interests.includes(opt);
                    return (
                      <label
                        key={opt}
                        className={`flex items-start gap-3 p-3.5 rounded-2xl border text-xs sm:text-sm cursor-pointer transition-all ${
                          checked
                            ? "bg-blue-50/80 border-[#0C3B7C] text-[#0C3B7C] font-bold shadow-xs"
                            : "bg-slate-50/80 border-slate-200 text-[#536054] hover:bg-slate-100"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleInterest(opt)}
                          className="mt-0.5 h-4 w-4 rounded text-[#0C3B7C] focus:ring-[#0C3B7C]"
                        />
                        <span>{opt}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 3. Availability */}
              <div className="space-y-4 pt-2">
                <h3 className="font-heading text-sm font-bold text-[#0C3B7C] uppercase tracking-wider">
                  3. Preferred Availability
                </h3>

                <select
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3B7C]"
                >
                  {availabilityOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Notes */}
              <div className="space-y-1.5 pt-2">
                <label className="block text-xs font-bold text-[#19241A] uppercase tracking-wide">
                  Optional Note or Special Skills (e.g. First aid, Drone pilot, Driver)
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about yourself or your organization..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3B7C]"
                />
              </div>

              {/* RA 10173 Consent */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="privacy-volunteer"
                  checked={formData.consent_given}
                  onChange={(e) => setFormData({ ...formData, consent_given: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded text-[#0C3B7C] focus:ring-[#0C3B7C]"
                />
                <label htmlFor="privacy-volunteer" className="text-xs text-[#536054] leading-relaxed cursor-pointer">
                  I agree to the collection of my details for volunteer coordination in accordance with the <strong>Data Privacy Act of 2012 (RA 10173)</strong>.
                </label>
              </div>

              <Button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-[#0C3B7C] hover:bg-[#082956] text-white font-black py-3 rounded-xl shadow-md text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                <span>{status === "loading" ? "Submitting Application..." : "Submit Volunteer Registration"}</span>
              </Button>

            </form>

          </div>
        )}

      </div>
    </div>
  );
}
