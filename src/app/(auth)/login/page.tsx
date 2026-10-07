"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    setTimeout(() => {
      setIsLoading(false);
      if (email.includes("admin")) {
        router.push("/admin");
      } else {
        router.push("/member/dashboard");
      }
    }, 600);
  };

  return (
    <div className="space-y-6 text-white">
      <div className="text-center space-y-1">
        <h2 className="font-heading font-black text-xl text-white">
          Sign In to Portal
        </h2>
        <p className="text-xs text-slate-300">
          Enter your registered volunteer or staff credentials
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#D4C3A3] uppercase tracking-wide">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="email"
              required
              placeholder="e.g. volunteer@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-emerald-400"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-[#D4C3A3] uppercase tracking-wide">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[11px] font-semibold text-emerald-300 hover:text-[#e1ffdd] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-emerald-400"
            />
          </div>
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
          <span>{isLoading ? "Signing in..." : "Sign In to Dashboard"}</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </Button>
      </form>

      {/* Quick Demo Help */}
      <div className="p-3.5 rounded-2xl bg-black/40 border border-emerald-500/30 text-[11px] text-slate-300 space-y-1">
        <strong className="block font-bold text-[#F59E0B]">Quick Demo Credentials:</strong>
        <p>&bull; Type <code className="bg-white/10 px-1 py-0.5 rounded text-emerald-300">admin@kkk.org</code> for Admin Stewardship Portal</p>
        <p>&bull; Type any volunteer email for Member Dashboard</p>
      </div>

      <div className="pt-2 text-center text-xs text-slate-300">
        <span>Don&apos;t have an account yet? </span>
        <Link href="/register" className="text-emerald-400 font-bold hover:underline">
          Register here
        </Link>
      </div>
    </div>
  );
}
