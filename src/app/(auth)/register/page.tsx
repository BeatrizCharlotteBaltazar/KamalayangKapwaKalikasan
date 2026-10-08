"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Trees, 
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";

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
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match. Please verify both password fields.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (!formData.consent_given) {
      setError("Please accept the Data Privacy Act (RA 10173) consent checkbox.");
      return;
    }

    setIsLoading(true);

    try {
      // Register in Supabase Auth (default role: member; admins promoted manually in Supabase dashboard)
      const cleanEmail = formData.email.trim().toLowerCase();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name.trim(),
            role: "member",
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setIsLoading(false);
        return;
      }

      // Store local session info
      if (typeof window !== "undefined") {
        const userObj = {
          id: data.user?.id || `usr-${Date.now()}`,
          email: cleanEmail,
          fullName: formData.full_name.trim(),
          role: "member",
        };
        localStorage.setItem("kkk_current_user", JSON.stringify(userObj));
      }

      // Check if session is active immediately or confirmation is pending
      if (data.session) {
        router.push("/member/dashboard");
      } else {
        setSuccessMessage(
          "Account registered successfully! You can now sign in with your credentials. (If you are designated as an administrator, your role will activate once granted in Supabase)."
        );
        setIsLoading(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create account. Please check your connection and try again.";
      setError(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-white">
      
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-bold text-emerald-300 mb-1">
          <Trees className="w-3.5 h-3.5 text-[#22C55E]" />
          <span>Kamalayang Kapwa Kalikasan Membership</span>
        </div>
        <h2 className="font-heading font-black text-2xl text-white">
          Create Your Account
        </h2>
        <p className="text-xs text-slate-300">
          Join our grassroots community of environmental defenders and tree stewards
        </p>
      </div>

      {successMessage ? (
        <div className="p-5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-center space-y-3 animate-in fade-in">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
          <h3 className="font-heading font-bold text-base text-white">
            Registration Submitted
          </h3>
          <p className="text-xs text-slate-200 leading-relaxed">
            {successMessage}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
            <Link
              href="/login"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-slate-950 font-bold text-xs transition-colors"
            >
              Go to Sign In &rarr;
            </Link>
          </div>
        </div>
      ) : (
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
              I consent to the processing of my credentials under the <strong className="text-white">Philippine Data Privacy Act of 2012 (RA 10173)</strong>.
            </label>
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
            className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-slate-950 font-extrabold py-3.5 rounded-xl shadow-xl text-sm transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02]"
          >
            <span>{isLoading ? "Registering in Supabase..." : "Create Account"}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Button>
        </form>
      )}

      <div className="pt-2 text-center text-xs text-slate-300">
        <span>Already have an account? </span>
        <Link href="/login" className="text-emerald-400 font-bold hover:underline">
          Sign in here
        </Link>
      </div>

    </div>
  );
}
