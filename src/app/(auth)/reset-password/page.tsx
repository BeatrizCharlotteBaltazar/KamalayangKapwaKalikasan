"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify both password fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        setError(updateError.message);
        setIsLoading(false);
        return;
      }

      // Password updated successfully - redirect to login with success message
      const successMsg = encodeURIComponent("Password updated successfully! Please sign in with your new password.");
      router.push(`/login?message=${successMsg}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update password. Please try again.";
      setError(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-white">
      <div className="text-center space-y-1">
        <h2 className="font-heading font-black text-2xl text-white">
          Create New Password
        </h2>
        <p className="text-xs text-slate-300">
          Enter and confirm your new secure password (minimum 8 characters)
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#D4C3A3] uppercase tracking-wide">
            New Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="password"
              required
              minLength={8}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-emerald-400"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#D4C3A3] uppercase tracking-wide">
            Confirm New Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="password"
              required
              minLength={8}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-emerald-400"
            />
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/40 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-slate-950 font-extrabold py-3.5 rounded-xl shadow-xl text-sm transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02] disabled:opacity-50"
        >
          <span>{isLoading ? "Updating Password..." : "Update Password & Sign In"}</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </Button>
      </form>

      <div className="pt-2 text-center text-xs text-slate-300">
        <Link href="/login" className="text-emerald-400 font-bold hover:underline">
          &larr; Back to Portal Sign In
        </Link>
      </div>
    </div>
  );
}
