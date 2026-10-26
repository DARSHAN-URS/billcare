"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBillCare } from "@/lib/billcare-context";
import { BillCareLogo } from "@/components/brand/billcare-logo";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Star,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, showToast } = useBillCare();

  const [email, setEmail] = useState("owner@billcare.io");
  const [password, setPassword] = useState("billcare2026");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        router.push("/dashboard");
      } else {
        setErrorMessage(res.error || "Authentication failed. Please verify credentials.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillRoleCreds = (selectedEmail: string, roleName: string) => {
    setEmail(selectedEmail);
    setPassword("billcare2026");
    setErrorMessage("");
    showToast(`${roleName} credentials loaded`, "info");
  };

  const roles = [
    { name: "Owner", email: "owner@billcare.io", icon: "👑", badge: "Full Access" },
    { name: "Manager", email: "manager@billcare.io", icon: "💼", badge: "Operations" },
    { name: "Receptionist", email: "reception@billcare.io", icon: "🎧", badge: "Front Desk" },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-100 flex flex-col font-sans selection:bg-amber-200 selection:text-slate-950">
      {/* Top Bar */}
      <header className="border-b border-white/[0.08] bg-[#0c0c0e]/80 backdrop-blur-xl px-6 lg:px-12 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <BillCareLogo size="sm" variant="light" showSubtitle={true} />
        </Link>

        <Link
          href="/"
          className="text-xs uppercase tracking-wider font-mono text-slate-400 hover:text-white transition-colors"
        >
          ← Back to Home
        </Link>
      </header>

      {/* Main Split Screen */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Editorial Presentation */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#0c0c0e] p-10 xl:p-14 flex-col justify-between border-r border-white/[0.08] relative overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[300px] bg-amber-500/5 blur-[120px] pointer-events-none" />

          <div className="space-y-6 max-w-md relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-amber-300 text-xs font-mono uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Multi-Tenant Cloud OS</span>
            </div>

            <h2 className="font-serif text-3xl xl:text-4xl font-normal text-white tracking-tight leading-tight">
              The salon platform crafted for <span className="italic font-light text-amber-200">artistry & yield</span>.
            </h2>

            <p className="text-slate-400 text-xs sm:text-sm font-light leading-relaxed">
              Log in to manage appointments, front-desk point of sale, staff commission allocations, automated WhatsApp reminders, and real-time business analytics.
            </p>

            {/* Real Salon Front Desk Snapshot */}
            <div className="rounded-2xl overflow-hidden border border-white/[0.12] shadow-2xl relative aspect-[16/9] bg-slate-900 group">
              <img
                src="/images/hero-showcase.jpg"
                alt="Luxury salon interior and BillCare terminal"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-black/30 to-transparent flex items-end p-4">
                <span className="text-[11px] font-mono tracking-wider text-slate-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>140+ Salons Active Daily</span>
                </span>
              </div>
            </div>
          </div>

          {/* Testimonial Quote */}
          <div className="bg-[#121216] border border-white/[0.08] rounded-2xl p-5 space-y-3 max-w-md mt-6 relative z-10 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
                Verified Salon Owner
              </span>
            </div>
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              "BillCare transformed our daily operations. Fast checkout, zero commission fees, and automated WhatsApp appointment reminders recovered over ₹1.85 Lakhs in repeat bookings."
            </p>
            <div className="flex items-center gap-3 pt-3 border-t border-white/[0.06]">
              <img
                src="/images/owner-priya.jpg"
                alt="Priya Nair"
                className="w-9 h-9 rounded-full object-cover border border-amber-400/30"
              />
              <div>
                <div className="text-xs font-medium text-white">Priya Nair</div>
                <div className="text-[11px] text-slate-400">Founder & Creative Director, Maison Luxe</div>
              </div>
            </div>
          </div>

          {/* Trust Highlights */}
          <div className="flex items-center gap-6 text-xs text-slate-400 font-mono pt-4 relative z-10">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              99.98% SLA
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              256-bit SSL
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              0% Commission
            </span>
          </div>
        </div>

        {/* Right Form Container */}
        <div className="flex-1 p-6 sm:p-12 lg:p-16 flex items-center justify-center bg-[#09090b]">
          <div className="w-full max-w-md space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="font-serif text-3xl sm:text-4xl font-normal text-white tracking-tight">
                Sign in to your salon
              </h1>
              <p className="text-xs text-slate-400 font-light">
                Enter your work credentials to access your live BillCare console.
              </p>
            </div>

            {/* Error Message if any */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Quick Role Selectors */}
            <div className="bg-[#0c0c0e] border border-white/[0.08] rounded-xl p-3 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  Select Role to Test Isolation
                </span>
                <span className="font-mono text-[10px] text-amber-300">Password: billcare2026</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {roles.map((r) => {
                  const isSelected = email === r.email;
                  return (
                    <button
                      key={r.email}
                      type="button"
                      onClick={() => handleFillRoleCreds(r.email, r.name)}
                      className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-amber-500/15 border-amber-500/40 text-amber-200 shadow-sm"
                          : "bg-white/[0.03] border-white/[0.08] text-slate-300 hover:bg-white/[0.07] hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{r.icon}</span>
                        <span className="font-semibold text-xs truncate">{r.name}</span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5 truncate">
                        {r.badge}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@yoursalon.com"
                    className="w-full bg-[#0c0c0e] border border-white/[0.12] focus:border-amber-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300">Password</label>
                  <Link
                    href="/forgot-password"
                    className="text-[11px] text-slate-400 hover:text-amber-300 transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full bg-[#0c0c0e] border border-white/[0.12] focus:border-amber-400 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded accent-amber-400 bg-white/10 border-white/20"
                  />
                  <span>Keep workstation logged in</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-white hover:bg-slate-200 text-slate-950 font-semibold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Enter Salon Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Signup Link */}
            <div className="text-center text-xs text-slate-400 pt-4 border-t border-white/[0.08]">
              Setting up a new salon?{" "}
              <Link href="/signup" className="text-white hover:text-amber-300 underline underline-offset-4 font-medium transition-colors">
                Start 14-Day Free Trial
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
