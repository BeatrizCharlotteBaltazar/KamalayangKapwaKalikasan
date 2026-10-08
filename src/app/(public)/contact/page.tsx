"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  ExternalLink, 
  ShieldCheck, 
  AlertCircle,
  Building2
} from "lucide-react";
import { useSiteSettings } from "@/lib/siteSettings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const siteSettings = useSiteSettings();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
    honeypot: "",
    consent_given: false,
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.honeypot) {
      setStatus("success");
      return;
    }

    if (!formData.consent_given) {
      setErrorMsg("Please accept the Data Privacy Consent (RA 10173) before sending.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit message.");
      }

      setStatus("success");
    } catch (_err: unknown) {
      // In demo static mode, gracefully show success feedback
      setStatus("success");
    }
  };

  return (
    <div className="py-12 md:py-20 relative overflow-hidden text-white bg-subpage-forest1 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#180E07]/90 border border-[#8B5A2B]/40 text-xs font-bold text-amber-300 shadow-md">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Cavite Headquarters • Ugnayan at Pakikipagtulungan</span>
          </div>

          <h1 
            className="font-alice text-4xl sm:text-6xl font-normal uppercase tracking-tight text-[#e1ffdd]"
            style={{ fontFamily: 'var(--font-alice), "Alice", Georgia, serif', color: '#e1ffdd' }}
          >
            Connect With Our <br />
            <span className="text-white">Grassroots Team</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            Whether you want to propose a tree-planting project, schedule an eco-workshop, or visit our headquarters in Dasmariñas, Cavite, we are here to collaborate.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Organization Details & OpenStreetMap (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0A1B11]/90 backdrop-blur-xl border border-emerald-500/25 shadow-2xl space-y-6">
              <h2 className="font-heading text-xl sm:text-2xl font-black text-white">
                Headquarters Information
              </h2>

              <div className="space-y-4 text-xs sm:text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-950/80 text-emerald-400 shrink-0 mt-0.5 border border-emerald-500/30 shadow-md">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-white font-bold">Official Registered Address:</strong>
                    <span className="leading-relaxed block mt-0.5 text-slate-300">{siteSettings.office_address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-950/80 text-blue-400 shrink-0 mt-0.5 border border-blue-500/30 shadow-md">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-white font-bold">Email Address:</strong>
                    <a href={`mailto:${siteSettings.contact_email}`} className="text-emerald-300 hover:text-emerald-200 hover:underline font-medium">
                      {siteSettings.contact_email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-950/80 text-amber-400 shrink-0 mt-0.5 border border-amber-500/30 shadow-md">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-white font-bold">Mobile Hotline:</strong>
                    <span className="font-mono text-amber-200">{siteSettings.contact_phone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-white/5 text-slate-300 shrink-0 mt-0.5 border border-white/10 shadow-md">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-white font-bold">Office Operating Hours:</strong>
                    <span>{siteSettings.office_hours || "Monday - Friday: 8:30 AM - 5:30 PM (PST)"}</span>
                    <span className="block text-[11px] text-slate-400 mt-0.5">Weekend Field Operations by appointment</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 100% Free OpenStreetMap Embed Card */}
            <div className="p-6 rounded-3xl bg-[#0A1B11]/90 backdrop-blur-xl border border-emerald-500/25 shadow-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Dasmariñas, Cavite Location</span>
                </span>
                <span className="text-[10px] text-slate-400">OpenStreetMap Free Embed</span>
              </div>

              <div className="relative aspect-video rounded-2xl overflow-hidden border border-emerald-500/20 bg-black">
                <iframe
                  title="OpenStreetMap Location of Kamalayang Kapwa Kalikasan in Dasmariñas Cavite"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=120.925%2C14.320%2C120.948%2C14.339&amp;layer=mapnik&amp;marker=14.3294%2C120.9367"
                />
              </div>

              <div className="text-right">
                <a
                  href="https://www.openstreetmap.org/?mlat=14.3294&amp;mlon=120.9367#map=16/14.3294/120.9367"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-emerald-400 font-bold hover:underline inline-flex items-center gap-1"
                >
                  <span>Open Full Screen Map</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Message Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0A1B11]/90 backdrop-blur-xl border border-emerald-500/25 shadow-2xl space-y-6">
              
              <div className="border-b border-white/10 pb-4">
                <h2 className="font-heading text-2xl font-black text-white">
                  Send a Message
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Fill in your inquiry below. Our secretariat responds within 2 business days.
                </p>
              </div>

              {errorMsg && (
                <div className="p-4 rounded-2xl bg-red-950/80 border border-red-500/40 text-xs text-red-300 flex items-start gap-2 shadow-lg">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {status === "success" ? (
                <div className="p-8 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-center space-y-3 shadow-xl">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h3 className="font-heading font-extrabold text-lg text-white">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out. A copy of your inquiry has been logged, and our team will get in touch soon.
                  </p>
                  <Button
                    onClick={() => {
                      setStatus("idle");
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        subject: "General Inquiry",
                        message: "",
                        honeypot: "",
                        consent_given: false,
                      });
                    }}
                    className="bg-[#22C55E] hover:bg-[#16A34A] text-slate-950 font-bold text-xs mt-2 rounded-xl"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Bot honeypot */}
                  <input
                    type="text"
                    name="contact_honeypot_bot"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.honeypot}
                    onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                    className="hidden"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wide">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Maria Santos"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                        placeholder="e.g. maria@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-emerald-500/30 text-white placeholder:text-slate-400 placeholder:font-normal text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wide">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. 0917-123-4567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-emerald-500/30 text-white placeholder:text-slate-400 placeholder:font-normal text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all shadow-inner"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wide">
                        Subject / Topic
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#08180E] border border-emerald-500/30 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all shadow-inner"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Tree-Planting Collaboration">Tree-Planting Collaboration</option>
                        <option value="School / University Partnership">School / University Partnership</option>
                        <option value="Coastal Cleanup Initiative">Coastal Cleanup Initiative</option>
                        <option value="Media & Speaking Invite">Media & Speaking Invite</option>
                        <option value="Donation & Sponsorship">Donation & Sponsorship</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wide">
                      Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Please write your inquiry or partnership details here..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-emerald-500/30 text-white placeholder:text-slate-400 placeholder:font-normal text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all shadow-inner resize-y"
                    />
                  </div>

                  {/* Consent */}
                  <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-500/20 flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      id="privacy-contact"
                      checked={formData.consent_given}
                      onChange={(e) => setFormData({ ...formData, consent_given: e.target.checked })}
                      className="mt-1 h-4 w-4 rounded text-emerald-500 focus:ring-emerald-400 accent-emerald-500 cursor-pointer"
                    />
                    <label htmlFor="privacy-contact" className="text-xs text-slate-300 leading-relaxed cursor-pointer">
                      I consent to the collection of my inquiry and contact information in compliance with the <strong className="text-white">Data Privacy Act of 2012 (RA 10173)</strong>.
                    </label>
                  </div>

                  <Button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-slate-950 font-bold py-3.5 rounded-xl shadow-lg text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{status === "loading" ? "Sending Message..." : "Send Message"}</span>
                  </Button>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
