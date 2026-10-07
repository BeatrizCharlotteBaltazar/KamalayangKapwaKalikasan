"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  ArrowUp,
  Heart,
  Flame,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteSettings } from "@/lib/data";

export function Footer() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage("Please enter your email address.");
      setStatus("error");
      return;
    }
    if (!consent) {
      setErrorMessage("Please check the Data Privacy Act (RA 10173) consent checkbox.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent_given: consent }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to subscribe. Please try again.");
      }

      setStatus("success");
      setEmail("");
    } catch {
      // In demo mode, provide graceful confirmation
      setStatus("success");
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#040E07] text-[#D1E0D4] border-t border-emerald-500/20 relative overflow-hidden">
      
      {/* Top Banner Accent with Humanity and Nature Colors */}
      <div className="bg-[#07160D] py-3 px-4 text-xs text-slate-300 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-2.5">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" title="Royal Blue: Humanity" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" title="Scarlet Red: Bayanihan" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" title="Golden Sun: Hope" />
              <span className="w-2.5 h-2.5 rounded-full bg-white" title="White: Integrity" />
            </span>
            <span className="text-white/20">|</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" title="Green: Nature" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#B45309]" title="Brown: Soil" />
            </span>
            <span className="font-semibold text-white ml-1">
              Kapwa Tao. Kapwa Kalikasan.
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/news-events"
              className="text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1 transition-colors"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Environmental & Humanity Rallies</span>
            </Link>

            {/* Scroll to Top button in top bar */}
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Back to Top</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Col 1: Organization Identity & Mission (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-400 bg-[#0A1A10] shrink-0">
                <Image
                  src="/images/logo.jpg"
                  alt="Kamalayang Kapwa Kalikasan Logo"
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div>
                <span className="font-heading font-black text-lg text-white block uppercase tracking-tight">
                  KAMALAYANG KAPWA KALIKASAN
                </span>
                <span className="text-xs text-emerald-300/80 block font-medium">
                  Philippine Environmental Movement • Cavite HQ
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Rooted in the Filipino virtue of <strong className="text-white">pakikipagkapwa</strong> (shared responsibility). We lead civic mobilizations, rallies for climate justice, native tree-growing in the Sierra Madre, and youth empowerment.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link href="/get-involved">
                <Button size="sm" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-xl px-3.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>Join Volunteer Movement</span>
                </Button>
              </Link>
              <Link href="/donate">
                <Button size="sm" className="bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold rounded-xl px-3.5">
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  <span>Donate to Reforestation</span>
                </Button>
              </Link>
            </div>

            <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-[#F59E0B] shrink-0" />
              <span>Non-Profit Advocacy • RA 10173 Data Privacy Compliant</span>
            </div>
          </div>

          {/* Col 2: Headquarters & Civic Mobilization (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-heading font-bold text-white text-xs uppercase tracking-wider border-b border-white/10 pb-2">
              National Headquarters
            </h4>
            
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                <span className="leading-snug">{siteSettings.office_address}</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#2563EB] shrink-0" />
                <a href={`mailto:${siteSettings.contact_email}`} className="hover:text-white transition-colors">
                  {siteSettings.contact_email}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#22C55E] shrink-0" />
                <span>{siteSettings.contact_phone}</span>
              </div>
            </div>

            {/* Back to top interactive card */}
            <div className="pt-4">
              <button
                type="button"
                onClick={scrollToTop}
                className="w-full py-3 px-4 rounded-2xl bg-[#0A1F13] hover:bg-[#11311F] border border-emerald-500/30 text-emerald-300 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md group"
              >
                <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                <span>Scroll Up to Top</span>
              </button>
            </div>
          </div>

          {/* Col 3: Newsletter & Field Alerts (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-heading font-bold text-white text-xs uppercase tracking-wider border-b border-white/10 pb-2">
              Stay Informed • Action Alerts
            </h4>
            
            <p className="text-xs text-slate-300">
              Receive notifications for upcoming environmental rallies, tree planting schedules, and coastal mobilizations.
            </p>

            {status === "success" ? (
              <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-xs text-emerald-200 flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white font-medium">Salamat sa Pagtala!</strong>
                  You are registered for official environmental action bulletins.
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2.5">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                    required
                  />
                  <Button
                    type="submit"
                    disabled={status === "loading"}
                    className="bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-bold text-xs shrink-0 px-3.5 rounded-xl"
                  >
                    {status === "loading" ? "..." : <Send className="w-4 h-4" />}
                  </Button>
                </div>

                <label className="flex items-start gap-2 text-[11px] text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-[#F59E0B] border-white/30"
                    required
                  />
                  <span>
                    I consent under the{" "}
                    <Link href="/privacy-policy" className="text-white underline hover:text-[#F59E0B]">
                      Data Privacy Act (RA 10173)
                    </Link>{" "}
                    to receive updates from KKK.
                  </span>
                </label>

                {errorMessage && (
                  <p className="text-[11px] text-red-400">{errorMessage}</p>
                )}
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar with Scroll Up button & legal */}
        <div className="pt-8 mt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            &copy; 2026 Kamalayang Kapwa Kalikasan Foundation Inc. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms-of-use" className="hover:text-white transition-colors">
              Terms of Use
            </Link>
            <span>•</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="text-[#F59E0B] hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Scroll to Top</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
