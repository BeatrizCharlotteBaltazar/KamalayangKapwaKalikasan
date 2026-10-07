"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
    consent_given: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match. Please verify both fields.");
      return;
    }

    if (!formData.consent_given) {
      setError("Please accept the Data Privacy Act (RA 10173) consent checkbox.");
      return;
    }

    setIsLoading(true);
    setError("");

    setTimeout(() => {
      setIsLoading(false);
      router.push("/member/dashboard");
    }, 700);
  };

  return (
    <div className="space-y-6 text-white">
      <div className="text-center space-y-1">
        <h2 className="font-heading font-black text-xl text-white">
          Create Your Member Account
        </h2>
        <p className="text-xs text-slate-300">
          Track your volunteer hours, certificates, and donation impact
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#D4C3A3] uppercase tracking-wide">
            Full Name
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              required
              placeholder="e.g. Maria Santos"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-emerald-400"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#D4C3A3] uppercase tracking-wide">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="email"
              required
              placeholder="e.g. maria@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-emerald-400"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#D4C3A3] uppercase tracking-wide">
            Password (Min 8 characters)
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="password"
              required
              minLength={8}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-emerald-400"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#D4C3A3] uppercase tracking-wide">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="password"
              required
              minLength={8}
              placeholder="••••••••"
              value={formData.confirm_password}
              onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-emerald-400"
            />
          </div>
        </div>

        {/* Data Privacy Checkbox */}
        <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-start gap-2.5 text-xs text-slate-300">
          <input
            type="checkbox"
            id="privacy-register"
            checked={formData.consent_given}
            onChange={(e) => setFormData({ ...formData, consent_given: e.target.checked })}
            className="mt-0.5 h-4 w-4 rounded accent-[#22C55E] cursor-pointer"
          />
          <label htmlFor="privacy-register" className="cursor-pointer leading-relaxed">
            I consent to the collection of my account details in compliance with the <strong className="text-white">Data Privacy Act of 2012 (RA 10173)</strong>.
          </label>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#B07D48] hover:bg-[#9E6E3C] text-[#1A1108] font-extrabold py-3 rounded-xl shadow-xl text-sm transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02]"
        >
          <span>{isLoading ? "Creating Account..." : "Create Member Account"}</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </Button>
      </form>

      <div className="pt-2 text-center text-xs text-slate-300">
        <span>Already have an account? </span>
        <Link href="/login" className="text-emerald-400 font-bold hover:underline">
          Sign in here
        </Link>
      </div>
    </div>
  );
}
