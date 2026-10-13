"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDemo } from "@/lib/demo-context";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { allPersonas, switchPersona, loginAs, showToast } = useDemo();

  const [email, setEmail] = useState("sunil@luxehaven.in");
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      loginAs("owner", "Sunil Kumar");
      setIsLoading(false);
      router.push("/dashboard");
    }, 600);
  };

  const handleQuickPersonaSelect = (role: "owner" | "manager" | "stylist" | "admin", personaId: string) => {
    switchPersona(personaId);
    showToast(`Signed in as ${allPersonas.find((p) => p.id === personaId)?.name}`);
    if (role === "admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-slate-800 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      {/* Top Bar */}
      <div className="border-b border-slate-200 bg-white/90 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-slate-950 text-white flex items-center justify-center font-bold text-sm">
            R
          </div>
          <span className="font-extrabold text-base tracking-tight text-slate-950">
            RUVEXI
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            SALON OS
          </span>
        </Link>

        <Link
          href="/"
          className="text-xs font-bold text-slate-500 hover:text-slate-950 transition-colors"
        >
          ← Back to Marketing Site
        </Link>
      </div>

      {/* Main Split Screen */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Editorial Presentation (Hidden on Mobile) */}
        <div className="hidden lg:flex lg:w-1/2 bg-slate-100/60 p-12 xl:p-16 flex-col justify-between border-r border-slate-200">
          <div className="space-y-6 max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Multi-Tenant Architecture</span>
            </div>

            <h2 className="text-3xl xl:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
              Purpose-Built for Hair Studios, Barbers & Day Spas
            </h2>

            <p className="text-slate-600 text-sm leading-relaxed">
              Log in to orchestrate your daily chair schedules, inventory deductions, commission settlements, and WhatsApp appointment confirmations.
            </p>
          </div>

          {/* Real Salon Testimonial Quote */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-3.5 max-w-md">
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              "RUVEXI transformed our front-desk efficiency. The automated 28-day color reminders recovered over ₹85,000 in monthly re-bookings with zero manual coordinator follow-ups."
            </p>
            <div className="flex items-center gap-3 pt-1">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center">
                SS
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Sanya Sethi</div>
                <div className="text-[11px] text-slate-500">Creative Director, Auric Atelier & Day Spa</div>
              </div>
            </div>
          </div>

          {/* Security Badges */}
          <div className="flex items-center gap-6 text-xs text-slate-500 font-medium">
            <span>✓ 99.98% Cloud SLA</span>
            <span>✓ 256-bit SSL</span>
            <span>✓ Zero Commission</span>
          </div>
        </div>

        {/* Right Form Container */}
        <div className="flex-1 p-6 sm:p-12 lg:p-16 flex items-center justify-center">
          <div className="w-full max-w-md space-y-6">
            {/* Header */}
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                Sign in to your salon
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Enter your credentials or choose a 1-click persona to preview different staff roles.
              </p>
            </div>

            {/* 1-Click Demo Personas Selector */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider">
                  1-Click Role Switcher
                </span>
                <span className="text-[10px] text-slate-400">Click to enter as:</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickPersonaSelect("owner", "usr_owner")}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs">
                      👑
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900 group-hover:text-blue-600">Salon Owner</div>
                      <div className="text-[10px] text-slate-500">Sunil (Full Access)</div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickPersonaSelect("manager", "usr_manager")}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs">
                      💼
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900 group-hover:text-blue-600">Operations Manager</div>
                      <div className="text-[10px] text-slate-500">Kavita (POS & Shifts)</div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickPersonaSelect("stylist", "usr_stylist")}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs">
                      ✂️
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900 group-hover:text-blue-600">Senior Stylist</div>
                      <div className="text-[10px] text-slate-500">Priya (Chair & Comm)</div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickPersonaSelect("admin", "usr_admin")}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs">
                      🛡️
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900 group-hover:text-blue-600">Super Admin</div>
                      <div className="text-[10px] text-slate-500">Alex (Multi-Tenant)</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Standard Login Form */}
            <form onSubmit={handleStandardLogin} className="space-y-4">
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
                    className="w-full bg-white border border-slate-200 focus:border-slate-900 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none transition-colors shadow-2xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700">Password</label>
                  <Link
                    href="/forgot-password"
                    className="text-[11px] font-semibold text-blue-600 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full bg-white border border-slate-200 focus:border-slate-900 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 focus:outline-none transition-colors font-mono shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded accent-slate-950 border-slate-300"
                  />
                  <span>Keep this workstation logged in</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <span>Enter Salon Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Signup Link */}
            <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-200">
              Setting up a new salon?{" "}
              <Link href="/signup" className="font-bold text-slate-950 hover:underline">
                Create Salon Workspace (14-Day Free Trial)
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
