"use client";

import React, { useState, useEffect } from "react";
import { useDemo } from "@/lib/demo-context";
import { formatCurrency } from "@/lib/utils";
import { OverviewView } from "./overview-view";
import { PosView } from "./pos-view";
import { StaffView } from "./staff-view";
import { InventoryView } from "./inventory-view";
import { CrmFollowupsView } from "./crm-followups-view";
import { CalendarView } from "./calendar-view";
import { BookingPreviewView } from "./booking-preview-view";
import { CompetitorBenchmarkModal } from "./competitor-benchmark-modal";
import {
  LayoutDashboard,
  Receipt,
  Users,
  Boxes,
  MessageSquare,
  Calendar,
  Globe,
  RotateCcw,
  Sparkles,
  Building2,
  Bell,
  Search,
  CheckCircle2,
  Menu,
  X,
  ShieldCheck,
  ChevronDown,
  Star,
  Clock,
  TrendingUp,
  CreditCard,
  Crown,
  Laptop,
} from "lucide-react";

export function DemoShell() {
  const { salon, followUps, inventory, staff, invoices, resetDemoData } = useDemo();

  const [activeTab, setActiveTab] = useState<
    "overview" | "pos" | "staff" | "inventory" | "followups" | "calendar" | "booking"
  >("overview");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(salon.branch);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [showBenchmarkModal, setShowBenchmarkModal] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const totalTodayRevenue = invoices.reduce((acc, inv) => acc + inv.total, 0);
  const clockedInStaffCount = staff.filter((s) => s.status === "clocked_in").length;
  const pendingFollowUps = followUps.filter((f) => f.status === "Pending").length;
  const lowStockCount = inventory.filter((i) => i.currentStock <= i.minThreshold).length;

  const handleGoToPosFromCalendar = (
    _customerName: string,
    _serviceName: string,
    _staffName: string
  ) => {
    setActiveTab("pos");
  };

  const navItems = [
    {
      id: "overview",
      label: "Executive Hub",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "pos",
      label: "Billing & POS",
      icon: Receipt,
      badge: "Fast Pay",
      badgeColor: "bg-blue-500/15 text-blue-700 border-blue-500/30",
    },
    {
      id: "staff",
      label: "Artists & Shifts",
      icon: Users,
      badge: `${clockedInStaffCount} Active`,
      badgeColor: "bg-indigo-500/15 text-indigo-700 border-indigo-500/30",
    },
    {
      id: "inventory",
      label: "Stock & Inventory",
      icon: Boxes,
      badge: lowStockCount > 0 ? `${lowStockCount} Reorder` : null,
      badgeColor: "bg-amber-500/15 text-amber-700 border-amber-500/30",
    },
    {
      id: "followups",
      label: "WhatsApp CRM",
      icon: MessageSquare,
      badge: pendingFollowUps > 0 ? `${pendingFollowUps} Due` : null,
      badgeColor: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
    },
    {
      id: "calendar",
      label: "Chair Schedule",
      icon: Calendar,
      badge: null,
    },
    {
      id: "booking",
      label: "Customer Portal",
      icon: Globe,
      badge: "Live View",
      badgeColor: "bg-purple-500/15 text-purple-700 border-purple-500/30",
    },
  ];

  return (
    <div className="min-h-screen luxury-ambient-bg flex flex-col font-sans text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
      {/* Topmost Obsidian Command Bar */}
      <div className="bg-[#0b0f19] text-white border-b border-slate-800/80 px-4 sm:px-6 py-2 text-[11px] font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <Crown className="w-3.5 h-3.5 fill-amber-400" />
              <span>RUVEXI ENTERPRISE SUITE</span>
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-400 hidden sm:inline">
              Multi-Tenant Architecture v2.4 • Supabase RLS Active
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-300 font-mono">
              <Clock className="w-3 h-3 text-blue-400" />
              {currentTime || "10:00 AM"} IST
            </span>
            <span className="hidden md:flex items-center gap-1 text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              99.98% SLA
            </span>
            <button
              onClick={() => setShowBenchmarkModal(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 hover:bg-blue-500/30 hover:text-white transition-all font-bold text-[10px]"
            >
              <Sparkles className="w-3 h-3 text-amber-400" /> Compare vs Fresha & Zenoti
            </button>
            <button
              onClick={resetDemoData}
              className="hover:text-white flex items-center gap-1 text-slate-400 hover:underline transition-all"
              title="Reset mock data to pristine baseline"
            >
              <RotateCcw className="w-3 h-3" /> Reset Store
            </button>
          </div>
        </div>
      </div>

      {/* Main Luxury Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo & Salon selector */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <div
                onClick={() => setActiveTab("overview")}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-slate-950 via-slate-900 to-blue-900 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-900/20 border border-slate-700/50 group-hover:scale-105 transition-all duration-300">
                  <span className="bg-gradient-to-br from-white via-blue-100 to-indigo-300 bg-clip-text text-transparent">
                    R
                  </span>
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center">
                    <Sparkles className="w-2 h-2 text-white" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-lg tracking-tight text-slate-950 group-hover:text-blue-600 transition-colors">
                      RUVEXI
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-white tracking-widest uppercase">
                      LUXE OS
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    The Modern Operating System for High-End Salons
                  </p>
                </div>
              </div>

              {/* Branch Switcher Badge */}
              <div className="hidden xl:flex items-center gap-2 ml-4 pl-4 border-l border-slate-200">
                <div className="flex items-center gap-2 bg-slate-100/80 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/80 transition-all">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="bg-transparent font-bold text-slate-800 text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="Indiranagar Flagship, Bengaluru">Indiranagar Flagship (Bengaluru)</option>
                    <option value="Koramangala Studio, Bengaluru">Koramangala Studio (Bengaluru)</option>
                    <option value="Lavelle Road Luxe Suite, Bengaluru">Lavelle Road Luxe Suite (Bengaluru)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Live Ticker Metrics & Action Pill */}
            <div className="flex items-center gap-3">
              {/* Daily Gross Revenue Pill */}
              <div className="hidden md:flex items-center gap-3 bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 rounded-2xl">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Today's Gross
                  </span>
                  <span className="text-xs font-extrabold text-slate-900 font-mono">
                    {formatCurrency(totalTodayRevenue)}
                  </span>
                </div>
                <div className="h-6 w-px bg-slate-200"></div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Chairs Active
                  </span>
                  <span className="text-xs font-extrabold text-blue-600">
                    {clockedInStaffCount} / {staff.length}
                  </span>
                </div>
              </div>

              {/* Primary Call to Action */}
              <button
                onClick={() => setActiveTab("pos")}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/25 transition-all transform active:scale-[0.98] flex items-center gap-2"
              >
                <Receipt className="w-4 h-4" />
                <span>New Checkout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Segmented Navigation Tabs */}
        <div className="hidden lg:block border-t border-slate-200/60 bg-slate-50/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-1.5 py-2 overflow-x-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? "bg-white text-slate-950 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.08)] border border-slate-200/90 ring-1 ring-slate-900/5"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/70"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? "text-blue-600" : "text-slate-400"
                      }`}
                    />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                          item.badgeColor || "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white p-4 space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-slate-900 text-white shadow-md"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-slate-500"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive ? "bg-white/20 text-white" : item.badgeColor || "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === "overview" && <OverviewView onNavigateTab={(tab) => setActiveTab(tab as any)} />}
        {activeTab === "pos" && <PosView />}
        {activeTab === "staff" && <StaffView />}
        {activeTab === "inventory" && <InventoryView />}
        {activeTab === "followups" && <CrmFollowupsView />}
        {activeTab === "calendar" && <CalendarView onGoToPosBilling={handleGoToPosFromCalendar} />}
        {activeTab === "booking" && <BookingPreviewView />}
      </main>

      {/* Luxury Brand Footer */}
      <footer className="border-t border-slate-200/80 bg-white/90 backdrop-blur-md py-8 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-slate-950 flex items-center justify-center text-white font-black text-xs">
              R
            </div>
            <span className="font-bold text-slate-900">RUVEXI Luxe Salon SaaS</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-400">Enterprise High-Volume Architecture</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] font-semibold text-slate-500">
            <span className="flex items-center gap-1 text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" /> Razorpay & Meta Cloud Synced
            </span>
            <span>•</span>
            <span>PostgreSQL Multi-Tenant RLS</span>
            <span>•</span>
            <span>GDPR / India DPDP Ready</span>
          </div>
        </div>
      </footer>

      {showBenchmarkModal && (
        <CompetitorBenchmarkModal onClose={() => setShowBenchmarkModal(false)} />
      )}
    </div>
  );
}
