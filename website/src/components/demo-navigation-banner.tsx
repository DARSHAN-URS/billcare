"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDemo } from "@/lib/demo-context";
import {
  Globe,
  Lock,
  UserPlus,
  LayoutDashboard,
  Calendar,
  ShieldCheck,
  RotateCcw,
  ChevronDown,
  UserCheck,
  CheckCircle2,
  ChevronUp,
  Sparkles,
} from "lucide-react";

export function DemoNavigationBanner() {
  const pathname = usePathname();
  const { currentPersona, allPersonas, switchPersona, resetDemoData, toast, showToast } = useDemo();
  const [collapsed, setCollapsed] = useState(false);
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);

  const navLinks = [
    { href: "/front-desk", label: "🛎️ Receptionist View", icon: CheckCircle2 },
    { href: "/owner", label: "👑 Salon Owner View", icon: LayoutDashboard },
    { href: "/admin", label: "🌐 RUVEXI Owner View", icon: ShieldCheck },
    { href: "/book", label: "💇 Client Booking", icon: Calendar },
    { href: "/", label: "Landing", icon: Globe },
  ];

  return (
    <>
      {/* Toast Notification Pill */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="bg-slate-900 text-white border border-slate-700/80 rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-slate-100">{toast}</span>
          </div>
        </div>
      )}

      {/* When Collapsed: Discreet Floating Glass Pill */}
      {collapsed ? (
        <aside aria-label="Demo Controls" className="fixed top-3 right-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => setCollapsed(false)}
            aria-label="Expand Demo Tour toolbar"
            className="flex items-center gap-2.5 bg-slate-950/90 text-white px-3.5 py-1.5 rounded-full border border-slate-800 shadow-xl hover:bg-slate-900 transition-all text-xs font-bold backdrop-blur-md tactile-btn"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono text-[11px] font-bold text-slate-200">
              {currentPersona.name} ({currentPersona.role})
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </aside>
      ) : (
        /* Top Luxury Controller Bar - Ultra-slim & non-intrusive */
        <aside aria-label="Demo Navigation" className="relative z-50 bg-slate-950 text-slate-200 border-b border-slate-800/90 px-3 sm:px-6 py-1.5 shadow-md backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
            {/* Left Brand Badge */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 font-extrabold uppercase tracking-wider text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>RUVEXI DEMO</span>
              </div>
              <span className="text-slate-700 hidden md:inline">|</span>
              <span className="text-slate-400 hidden lg:inline font-medium text-[11px]">
                Explore System:
              </span>
            </div>

            {/* Central Navigation Pills */}
            <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-0.5">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href === "/dashboard" &&
                    (pathname.startsWith("/overview") ||
                      pathname.startsWith("/pos") ||
                      pathname.startsWith("/calendar") ||
                      pathname.startsWith("/customers") ||
                      pathname.startsWith("/staff") ||
                      pathname.startsWith("/inventory") ||
                      pathname.startsWith("/whatsapp") ||
                      pathname.startsWith("/reports") ||
                      pathname.startsWith("/settings")));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition-all whitespace-nowrap text-xs ${
                      isActive
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Controls: Persona & Reset */}
            <div className="flex items-center gap-2 relative">
              {/* Persona Switcher Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-700 px-2.5 py-1 rounded-lg font-medium transition-all text-xs"
                >
                  <div className="w-4 h-4 rounded-full bg-blue-600 text-[10px] font-bold text-white flex items-center justify-center">
                    {currentPersona.avatar}
                  </div>
                  <span className="max-w-[90px] sm:max-w-none truncate font-bold text-slate-100">
                    {currentPersona.name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 uppercase font-mono font-bold">
                    {currentPersona.role}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showPersonaMenu && (
                  <div className="absolute right-0 top-full mt-1.5 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-2.5 py-1.5 text-[11px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-800 mb-1">
                      Active User Persona
                    </div>
                    {allPersonas.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          switchPersona(p.id);
                          setShowPersonaMenu(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors ${
                          p.id === currentPersona.id
                            ? "bg-blue-600/30 text-white border border-blue-500/50"
                            : "hover:bg-slate-800 text-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-blue-400">
                            {p.avatar}
                          </div>
                          <div>
                            <div className="font-bold text-slate-100">{p.name}</div>
                            <div className="text-[11px] text-slate-400">{p.roleTitle}</div>
                          </div>
                        </div>
                        {p.id === currentPersona.id && (
                          <UserCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Reset Data Button */}
              <button
                onClick={() => {
                  resetDemoData();
                  showToast("Restored demo fixtures to initial state.");
                }}
                title="Reset mock fixtures"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Minimize Bar */}
              <button
                onClick={() => setCollapsed(true)}
                title="Minimize banner"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}

