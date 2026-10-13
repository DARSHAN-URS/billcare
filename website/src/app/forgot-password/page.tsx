"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useDemo } from "@/lib/demo-context";
import {
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  KeyRound,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const { showToast } = useDemo();

  const [step, setStep] = useState<"email" | "otp" | "success">("email");
  const [email, setEmail] = useState("sunil@luxehaven.in");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("otp");
    showToast("Verification code dispatched (Demo Code: 8492)");
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("success");
    showToast("Password updated successfully");
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-slate-800 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      {/* Top Header */}
      <div className="border-b border-slate-200 bg-white/90 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-slate-950 text-white flex items-center justify-center font-bold text-sm">
            R
          </div>
          <span className="font-extrabold text-base tracking-tight text-slate-950">
            RUVEXI
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            SECURITY
          </span>
        </Link>

        <Link
          href="/login"
          className="text-xs font-bold text-slate-500 hover:text-slate-950 transition-colors"
        >
          ← Back to Sign In
        </Link>
      </div>

      <div className="flex-1 max-w-md w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          {step === "email" && (
            <form onSubmit={handleSendCode} className="space-y-5">
              <div className="space-y-1.5 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-900 mx-auto flex items-center justify-center border border-slate-200">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h1 className="text-xl font-extrabold text-slate-950">Reset Account Password</h1>
                <p className="text-xs text-slate-500">
                  Enter your registered work email. We will send a security authentication code.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Work Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@yoursalon.com"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <span>Send Security Verification Code</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div className="space-y-1.5 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-900 mx-auto flex items-center justify-center border border-slate-200">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h1 className="text-xl font-extrabold text-slate-950">Enter 4-Digit Security Code</h1>
                <p className="text-xs text-slate-500">
                  We sent a code to <span className="font-semibold text-slate-800">{email}</span>. Use demo code <span className="font-mono font-bold text-slate-950">8492</span>.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Verification Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="8492"
                  maxLength={4}
                  required
                  className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 rounded-xl px-4 py-2.5 text-center font-mono text-lg tracking-widest text-slate-950 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <span>Save New Password & Sign In</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </button>
            </form>
          )}

          {step === "success" && (
            <div className="text-center space-y-4 py-4 animate-in fade-in duration-200">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-950">Password Updated</h2>
              <p className="text-xs text-slate-500">
                Your credentials have been updated. You can now access your salon console.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 w-full py-3 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all"
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
