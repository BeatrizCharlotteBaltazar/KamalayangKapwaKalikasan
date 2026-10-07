"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-6 text-white">
      <div className="text-center space-y-1">
        <h2 className="font-heading font-black text-xl text-white">
          Reset Your Password
        </h2>
        <p className="text-xs text-slate-300">
          Enter your email address and we will send a password reset link
        </p>
      </div>

      {submitted ? (
        <div className="p-6 rounded-2xl bg-black/40 border border-emerald-500/30 text-center space-y-3 animate-in fade-in">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <h3 className="font-heading font-black text-base text-white">
            Reset Link Sent
          </h3>
          <p className="text-xs text-slate-300">
            Please check your inbox at <strong className="text-emerald-300">{email}</strong> for instructions to reset your password.
          </p>
          <div className="pt-2">
            <Link href="/login">
              <Button size="sm" className="bg-[#B07D48] hover:bg-[#9E6E3C] text-[#1A1108] text-xs font-bold rounded-xl">
                Return to Sign In
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#D4C3A3] uppercase tracking-wide">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                placeholder="e.g. member@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-emerald-400"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#B07D48] hover:bg-[#9E6E3C] text-[#1A1108] font-extrabold py-3 rounded-xl shadow-xl text-sm transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02]"
          >
            <span>Send Reset Instructions</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Button>
        </form>
      )}

      <div className="pt-2 text-center text-xs text-slate-300">
        <Link href="/login" className="text-emerald-400 font-bold hover:underline">
          &larr; Back to Portal Sign In
        </Link>
      </div>
    </div>
  );
}
