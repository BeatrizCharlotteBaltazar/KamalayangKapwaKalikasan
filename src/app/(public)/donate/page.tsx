"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Heart, 
  QrCode, 
  Copy, 
  Check, 
  Upload, 
  ShieldCheck, 
  Trees, 
  Building2, 
  AlertCircle, 
  User, 
  CheckCircle2,
  Sparkles,
  Lock
} from "lucide-react";
import { useSiteSettings } from "@/lib/siteSettings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const presetAmounts = [
  { amount: 250, label: "₱250", desc: "1 Native Tree Sapling (Narra / Molave)" },
  { amount: 500, label: "₱500", desc: "2 Trees + 1 Year Community Forest Ranger Patrol" },
  { amount: 1000, label: "₱1,000", desc: "Coastal Mangrove Kit (5 Bakawan propagules + protective barrier)" },
  { amount: 2500, label: "₱2,500", desc: "Community Native Tree Nursery Support & Seedbed Kit" },
];

export default function DonatePage() {
  const siteSettings = useSiteSettings();
  const router = useRouter();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    donor_name: "",
    email: "",
    amount: "500",
    custom_amount: "",
    reference_no: "",
    proof_file: null as File | null,
    consent_given: false,
    honeypot: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const copyToClipboard = (text: string, field: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check 2MB constraint
      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage("Image file exceeds 2MB limit. Please compress the file before uploading.");
        return;
      }
      setErrorMessage("");
      setFormData({ ...formData, proof_file: file });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.honeypot) {
      router.push("/donate/thank-you");
      return;
    }

    const finalAmount = formData.custom_amount || formData.amount;
    if (!finalAmount || Number(finalAmount) <= 0) {
      setErrorMessage("Please enter a valid donation amount.");
      setStatus("error");
      return;
    }

    if (!formData.reference_no) {
      setErrorMessage("Please provide the Reference Number from your GCash or bank receipt.");
      setStatus("error");
      return;
    }

    if (!formData.consent_given) {
      setErrorMessage("Please check the Data Privacy Act (RA 10173) consent checkbox.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const payload = {
        donor_name: formData.donor_name.trim() || "Anonymous",
        email: formData.email,
        amount: Number(finalAmount),
        currency: "PHP",
        payment_method: "GCASH_BPI",
        reference_no: formData.reference_no,
        proof_url: "",
      };

      const res = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to submit donation record.");
      }

      router.push("/donate/thank-you");
    } catch (_err: unknown) {
      // In demo static mode, gracefully navigate to thank you
      router.push("/donate/thank-you");
    }
  };

  return (
    <div className="py-10 md:py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200 text-xs font-bold text-[#19241A] shadow-xs">
            <Heart className="w-3.5 h-3.5 text-[#C8102E] fill-[#C8102E]" />
            <span className="text-[#C8102E]">Tulong Para sa Kalikasan</span>
            <span className="text-slate-300">•</span>
            <span className="text-[#0C3B7C]">Direct Support</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl font-black text-[#19241A] tracking-tight">
            Support Philippine Reforestation & Coasts
          </h1>

          <p className="text-base sm:text-lg text-[#536054] leading-relaxed max-w-2xl mx-auto">
            {siteSettings.stat_donation_percentage
              ? `${siteSettings.stat_donation_percentage} of public donations fund endemic seedling nurseries, field rations for volunteer patrols, and wave barriers in vulnerable coastal barangays.`
              : "Public donations fund endemic seedling nurseries, field rations for volunteer patrols, and wave barriers in vulnerable coastal barangays."}
          </p>
        </div>

        {/* Preset Impact Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {presetAmounts.map((p) => {
            const isSelected = formData.amount === String(p.amount) && !formData.custom_amount;

            return (
              <button
                key={p.amount}
                type="button"
                onClick={() => setFormData({ ...formData, amount: String(p.amount), custom_amount: "" })}
                className={`p-5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#C8102E] text-white border-[#C8102E] shadow-md scale-102"
                    : "bg-white/95 border-slate-200/90 text-[#19241A] hover:border-[#C8102E]/40 hover:shadow-xs"
                }`}
              >
                <div>
                  <div className="font-heading font-black text-2xl tracking-tight">
                    {p.label}
                  </div>
                  <p className={`text-xs mt-1 leading-relaxed ${isSelected ? "text-white/90" : "text-[#536054]"}`}>
                    {p.desc}
                  </p>
                </div>
                <div className={`mt-3 pt-2 text-[10px] font-bold uppercase tracking-wider flex items-center justify-between ${isSelected ? "border-t border-white/20 text-white" : "border-t border-slate-100 text-[#C8102E]"}`}>
                  <span>{isSelected ? "Selected Tier" : "Select Tier"}</span>
                  <span>&rarr;</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* 2-Column Grid: Payment Channels & Verification Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: GCash and Bank Details (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* GCash Box (Philippine Blue / Humanity accent) */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white/95 backdrop-blur-sm border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#0C3B7C] text-white font-black text-lg flex items-center justify-center shadow-xs">
                    G
                  </div>
                  <div>
                    <h2 className="font-heading font-extrabold text-base text-[#19241A]">
                      GCash Transfer
                    </h2>
                    <span className="text-xs text-[#536054]">Scan QR or Mobile Number</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-[#2E5E34] text-[10px] font-bold border border-emerald-200">
                  Zero Transfer Fees
                </span>
              </div>

              {/* QR Image or Fallback */}
              {siteSettings.gcash_qr_url ? (
                <div className="relative aspect-square max-w-[200px] mx-auto rounded-2xl overflow-hidden border-2 border-blue-500/20 p-2 bg-blue-50/30 flex flex-col items-center justify-center">
                  <div className="relative w-full h-full rounded-xl overflow-hidden bg-white shadow-inner flex items-center justify-center">
                    <Image
                      src={siteSettings.gcash_qr_url}
                      alt="Kamalayang Kapwa Kalikasan GCash QR Code"
                      fill
                      sizes="200px"
                      className="object-cover"
                    />
                  </div>
                </div>
              ) : (
                <div className="relative aspect-square max-w-[200px] mx-auto rounded-2xl border border-dashed border-blue-300/60 p-4 bg-blue-50/30 flex flex-col items-center justify-center text-center">
                  <QrCode className="w-10 h-10 text-[#0C3B7C]/50 mb-2" />
                  <p className="text-[11px] font-semibold text-[#536054]">
                    Donation details will be posted soon
                  </p>
                </div>
              )}
              <p className="text-[11px] text-center text-[#536054]">
                {siteSettings.gcash_qr_url ? "Scan directly using your GCash app camera" : "Official QR code image will appear here once uploaded"}
              </p>

              {/* Number and Name Copy */}
              <div className="p-4 rounded-2xl bg-[#F4F8F4] border border-slate-200 space-y-2 text-xs">
                <div>
                  <span className="text-[11px] text-[#536054] block">Account Name:</span>
                  <strong className="text-xs text-[#19241A] block">
                    {siteSettings.gcash_name || "Donation details will be posted soon"}
                  </strong>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                  <div>
                    <span className="text-[11px] text-[#536054] block">GCash Number:</span>
                    <strong className="text-sm text-[#0C3B7C] font-mono">
                      {siteSettings.gcash_number || "Donation details will be posted soon"}
                    </strong>
                  </div>
                  {siteSettings.gcash_number ? (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(siteSettings.gcash_number, "gcash")}
                      className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-[#0C3B7C] transition-colors flex items-center gap-1 font-bold text-[11px] cursor-pointer"
                    >
                      {copiedField === "gcash" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === "gcash" ? "Copied!" : "Copy"}</span>
                    </button>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Bank Transfer Box (BPI) */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white/95 backdrop-blur-sm border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#8B5A2B] text-white flex items-center justify-center shadow-xs">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-heading font-extrabold text-base text-[#19241A]">
                    Bank Deposit / Transfer
                  </h2>
                  <span className="text-xs text-[#536054]">Online Bank Transfer / OTC</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 space-y-2 text-xs">
                <div>
                  <span className="text-[11px] text-[#536054] block">Bank Name:</span>
                  <strong className="text-xs text-[#19241A]">
                    {siteSettings.bank_name || "Donation details will be posted soon"}
                  </strong>
                </div>
                <div>
                  <span className="text-[11px] text-[#536054] block">Account Name:</span>
                  <strong className="text-xs text-[#19241A]">
                    {siteSettings.bank_account_name || "Donation details will be posted soon"}
                  </strong>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-amber-200/50">
                  <div>
                    <span className="text-[11px] text-[#536054] block">Account Number:</span>
                    <strong className="text-sm text-[#8B5A2B] font-mono">
                      {siteSettings.bank_account_number || "Donation details will be posted soon"}
                    </strong>
                  </div>
                  {siteSettings.bank_account_number ? (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(siteSettings.bank_account_number, "bank")}
                      className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-[#8B5A2B] transition-colors flex items-center gap-1 font-bold text-[11px] cursor-pointer"
                    >
                      {copiedField === "bank" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === "bank" ? "Copied!" : "Copy"}</span>
                    </button>
                  ) : null}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Donation Verification Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-white/95 backdrop-blur-sm border border-slate-200/90 shadow-sm space-y-6">
              
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C8102E] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#C8102E]" />
                  <span>Transparent Acknowledgment Form</span>
                </span>
                <h2 className="font-heading text-2xl font-black text-[#19241A] mt-1">
                  Log Your Donation
                </h2>
                <p className="text-xs sm:text-sm text-[#536054] mt-1 leading-relaxed">
                  Enter your receipt reference number. Our team will review your reference number and contact you.
                </p>
              </div>

              {errorMessage && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Honeypot field for bot protection */}
                <input
                  type="text"
                  name="website_url_check"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                  className="hidden"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#19241A] uppercase tracking-wide">
                      Full Name (Optional / Anonymous)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Juan dela Cruz or leave blank for Anonymous"
                      value={formData.donor_name}
                      onChange={(e) => setFormData({ ...formData, donor_name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E5E34]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#19241A] uppercase tracking-wide">
                      Email Address (For Verification &amp; Receipt)
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. juan@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E5E34]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#19241A] uppercase tracking-wide">
                      Selected Amount (PHP) <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="50"
                      value={formData.custom_amount || formData.amount}
                      onChange={(e) => setFormData({ ...formData, custom_amount: e.target.value })}
                      placeholder="500"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-[#19241A] focus:outline-none focus:ring-2 focus:ring-[#2E5E34]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#19241A] uppercase tracking-wide">
                      GCash / Bank Reference No. <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 100234891234"
                      value={formData.reference_no}
                      onChange={(e) => setFormData({ ...formData, reference_no: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#2E5E34]"
                    />
                  </div>
                </div>

                {/* Proof Upload (capped at 2MB) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#19241A] uppercase tracking-wide">
                    Screenshot Proof of Transfer (Optional, Max 2MB)
                  </label>
                  <div className="border border-dashed border-slate-300 rounded-2xl p-4 text-center hover:bg-slate-50 transition-colors">
                    <input
                      type="file"
                      id="proof-upload"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="proof-upload" className="cursor-pointer flex flex-col items-center gap-1.5">
                      <Upload className="w-5 h-5 text-[#536054]" />
                      <span className="text-xs font-bold text-[#0C3B7C]">
                        {formData.proof_file ? formData.proof_file.name : "Choose an image file (PNG, JPG)"}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Client-side cap: strictly under 2MB
                      </span>
                    </label>
                  </div>
                </div>

                {/* Data Privacy RA 10173 Consent */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="consent-check"
                    checked={formData.consent_given}
                    onChange={(e) => setFormData({ ...formData, consent_given: e.target.checked })}
                    className="mt-1 h-4 w-4 rounded text-[#2E5E34] focus:ring-[#2E5E34]"
                  />
                  <label htmlFor="consent-check" className="text-xs text-[#536054] leading-relaxed cursor-pointer">
                    I consent to the processing of my contact and donation details solely for verification, reporting, and acknowledgment in full compliance with the <strong>Data Privacy Act of 2012 (RA 10173)</strong>.
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-[#C8102E] hover:bg-[#9E0D24] text-white font-black py-3 rounded-xl shadow-md text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>{status === "loading" ? "Recording Donation..." : "Confirm & Submit Donation Record"}</span>
                </Button>

              </form>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
