"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useBillCare } from "@/lib/billcare-context";
import { BillCareLogo } from "@/components/brand/billcare-logo";
import {
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  KeyRound,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const { showToast } = useBillCare();

  const [step, setStep] = useState<"email" | "otp" | "success">("email");
  const [email, setEmail] = useState("owner@billcare.io");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("otp");
    showToast("Security verification code dispatched to " + email);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("success");
    showToast("Password updated successfully");
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-100 flex flex-col font-sans selection:bg-amber-200 selection:text-slate-950">
      {/* Top Header */}
      <header className="border-b border-white/[0.08] bg-[#0c0c0e]/80 backdrop-blur-xl px-6 lg:px-12 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <BillCareLogo size="sm" variant="light" showSubtitle={true} />
          <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-full bg-white/[0.06] text-amber-300 border border-white/[0.1] ml-2">
            SECURITY
          </span>
        </Link>

        <Link
          href="/login"
          className="text-xs uppercase tracking-wider font-mono text-slate-400 hover:text-white transition-colors"
        >
          ← Back to Sign In
        </Link>
      </header>

      <div className="flex-1 max-w-md w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
        <div className="bg-[#0c0c0e] border border-white/[0.12] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 blur-[80px] pointer-events-none" />

          {step === "email" && (
            <form onSubmit={handleSendCode} className="space-y-5 relative z-10">
              <div className="space-y-2 text-center">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.04] text-amber-300 mx-auto flex items-center justify-center border border-white/[0.1]">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h1 className="font-serif text-2xl font-normal text-white tracking-tight">Reset Password</h1>
                <p className="text-xs text-slate-400 font-light">
                  Enter your registered work email. We will send a security verification code.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300">Work Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@yoursalon.com"
                    className="w-full bg-[#121216] border border-white/[0.12] focus:border-amber-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-white hover:bg-slate-200 text-slate-950 font-semibold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Send Verification Code</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleResetPassword} className="space-y-5 relative z-10">
              <div className="space-y-2 text-center">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.04] text-amber-300 mx-auto flex items-center justify-center border border-white/[0.1]">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h1 className="font-serif text-2xl font-normal text-white tracking-tight">Enter Security Code</h1>
                <p className="text-xs text-slate-400 font-light">
                  We sent a code to <span className="text-slate-200 font-medium">{email}</span>. Enter code <span className="font-mono text-amber-300 font-medium">8492</span>.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300">Verification Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="8492"
                  maxLength={4}
                  required
                  className="w-full bg-[#121216] border border-white/[0.12] focus:border-amber-400 rounded-xl px-4 py-2.5 text-center font-mono text-lg tracking-widest text-amber-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full bg-[#121216] border border-white/[0.12] focus:border-amber-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-white hover:bg-slate-200 text-slate-950 font-semibold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Save New Password & Sign In</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </button>
            </form>
          )}

          {step === "success" && (
            <div className="text-center space-y-4 py-4 animate-in fade-in duration-200 relative z-10">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h2 className="font-serif text-2xl font-normal text-white">Password Updated</h2>
              <p className="text-xs text-slate-400 font-light">
                Your credentials have been updated. You can now access your salon console.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 w-full py-3 bg-white hover:bg-slate-200 text-slate-950 font-semibold text-xs uppercase tracking-wider rounded-xl transition-all"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
