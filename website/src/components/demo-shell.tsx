"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useDemo } from "@/lib/demo-context";
import { formatCurrency } from "@/lib/utils";
import { FrontDeskView } from "./front-desk-view";
import { SalonOwnerView } from "./salon-owner-view";
import { OverviewView } from "./overview-view";
import { PosView } from "./pos-view";
import { StaffView } from "./staff-view";
import { InventoryView } from "./inventory-view";
import { CrmFollowupsView } from "./crm-followups-view";
import { CalendarView } from "./calendar-view";
import { BookingPreviewView } from "./booking-preview-view";
import { CompetitorBenchmarkModal } from "./competitor-benchmark-modal";
import { CustomersView } from "./customers-view";
import { ServicesView } from "./services-view";
import { ReportsView } from "./reports-view";
import { SettingsView } from "./settings-view";
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
  Menu,
  X,
  Clock,
  Scissors,
  BarChart3,
  Settings as SettingsIcon,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  Crown,
} from "lucide-react";

export type TabType =
  | "frontdesk"
  | "owner"
  | "overview"
  | "calendar"
  | "pos"
  | "customers"
  | "services"
  | "staff"
  | "inventory"
  | "followups"
  | "reports"
  | "booking"
  | "settings";

interface DemoShellProps {
  initialTab?: TabType;
}

export function DemoShell({ initialTab = "frontdesk" }: DemoShellProps) {
  const { salon, followUps, inventory, staff, invoices, customers, resetDemoData, currentPersona } = useDemo();

  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
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

  const navSections = [
    {
      title: "DAILY OPERATIONS",
      items: [
        {
          id: "frontdesk" as TabType,
          label: "Front Desk Counter",
          icon: CheckCircle2,
          badge: "Active",
          badgeColor: "bg-emerald-100 text-emerald-800",
        },
        {
          id: "owner" as TabType,
          label: "Salon Owner View",
          icon: Crown,
          badge: "Business",
          badgeColor: "bg-amber-100 text-amber-800",
        },
        {
          id: "calendar" as TabType,
          label: "Today's Appointments",
          icon: Calendar,
          badge: "Schedule",
          badgeColor: "bg-blue-100 text-blue-800",
        },
        {
          id: "pos" as TabType,
          label: "Billing & Checkout",
          icon: Receipt,
          badge: "Fast Pay",
          badgeColor: "bg-emerald-100 text-emerald-800",
        },
        {
          id: "overview" as TabType,
          label: "Daily Overview",
          icon: LayoutDashboard,
          badge: null,
        },
        {
          id: "customers" as TabType,
          label: "Clients List",
          icon: Users,
          badge: `${customers.length}`,
          badgeColor: "bg-purple-100 text-purple-800",
        },
        {
          id: "services" as TabType,
          label: "Services & Prices",
          icon: Scissors,
          badge: null,
        },
      ],
    },
    {
      title: "STAFF & PRODUCTS",
      items: [
        {
          id: "staff" as TabType,
          label: "Staff & Stylists",
          icon: Users,
          badge: `${clockedInStaffCount} Present`,
          badgeColor: "bg-indigo-100 text-indigo-800",
        },
        {
          id: "inventory" as TabType,
          label: "Products & Stock",
          icon: Boxes,
          badge: lowStockCount > 0 ? `${lowStockCount} Low` : null,
          badgeColor: "bg-amber-100 text-amber-900",
        },
      ],
    },
    {
      title: "MESSAGES & REPORTS",
      items: [
        {
          id: "followups" as TabType,
          label: "WhatsApp Messages",
          icon: MessageSquare,
          badge: pendingFollowUps > 0 ? `${pendingFollowUps} Due` : null,
          badgeColor: "bg-emerald-100 text-emerald-800",
        },
        {
          id: "reports" as TabType,
          label: "Sales Reports",
          icon: BarChart3,
          badge: null,
        },
        {
          id: "booking" as TabType,
          label: "Client Booking Site",
          icon: Globe,
          badge: "Online",
          badgeColor: "bg-slate-100 text-slate-800",
        },
      ],
    },
    {
      title: "SETTINGS",
      items: [
        {
          id: "settings" as TabType,
          label: "Salon Settings",
          icon: SettingsIcon,
          badge: null,
        },
      ],
    },
  ];

  const getActiveTabTitle = () => {
    for (const sec of navSections) {
      const found = sec.items.find((i) => i.id === activeTab);
      if (found) return found.label;
    }
    return "Front Desk Counter";
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col font-sans text-slate-800 antialiased selection:bg-slate-900 selection:text-white">
      <div className="flex-1 flex min-h-screen">
        {/* ============================================================ */}
        {/* DESKTOP SIDE NAVIGATION BAR */}
        {/* ============================================================ */}
        <aside className="hidden lg:flex w-64 xl:w-72 bg-white border-r border-slate-200/90 flex-col justify-between shrink-0 h-screen sticky top-0 z-30 shadow-[1px_0_4px_rgba(0,0,0,0.01)]">
          {/* Top Brand & Branch Header */}
          <div className="p-5 border-b border-slate-200/80 space-y-4">
            {/* Salon Brand Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                R
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm text-slate-950 truncate tracking-tight">
                    {salon.name}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-slate-100 text-slate-700 uppercase tracking-wider inline-block mt-0.5">
                  LUXE OS
                </span>
              </div>
            </div>

            {/* Branch Selector Dropdown */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-1.5 flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-1" />
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="bg-transparent text-[11px] font-bold text-slate-800 focus:outline-none cursor-pointer w-full truncate"
              >
                <option value="Indiranagar Flagship, Bengaluru">Indiranagar Flagship</option>
                <option value="Koramangala Studio, Bengaluru">Koramangala Studio</option>
                <option value="Lavelle Road Luxe Suite, Bengaluru">Lavelle Road Suite</option>
              </select>
            </div>

            {/* Quick Checkout CTA */}
            <button
              onClick={() => setActiveTab("pos")}
              className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>New POS Checkout</span>
            </button>
          </div>

          {/* Middle Nav Items (Grouped) */}
          <div className="flex-1 overflow-y-auto p-3 space-y-5">
            {navSections.map((section) => (
              <div key={section.title} className="space-y-1">
                <div className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider font-mono">
                  {section.title}
                </div>
                <nav className="space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                          isActive
                            ? "bg-slate-950 text-white shadow-xs"
                            : "text-slate-600 hover:text-slate-950 hover:bg-slate-100/70"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon
                            className={`w-4 h-4 shrink-0 ${
                              isActive ? "text-white" : "text-slate-400"
                            }`}
                          />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                              isActive
                                ? "bg-white/20 text-white"
                                : item.badgeColor || "bg-slate-100 text-slate-700"
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
            ))}
          </div>

          {/* Bottom Footer Info & Persona Profile */}
          <div className="p-3.5 border-t border-slate-200/80 bg-slate-50/70 space-y-2.5">
            {/* Active Persona Card */}
            <div className="flex items-center justify-between bg-white border border-slate-200/90 rounded-xl p-2.5 shadow-2xs">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-slate-950 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {currentPersona.avatar}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs text-slate-950 truncate">
                    {currentPersona.name}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    {currentPersona.roleTitle}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold px-1">
              <button
                onClick={() => setShowBenchmarkModal(true)}
                className="hover:text-slate-950 flex items-center gap-1 transition-colors"
              >
                <span>Comparison</span>
              </button>
              <button
                onClick={resetDemoData}
                className="hover:text-slate-950 flex items-center gap-1 transition-colors"
                title="Reset mock store data"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Store</span>
              </button>
            </div>
          </div>
        </aside>

        {/* ============================================================ */}
        {/* MOBILE DRAWER NAVIGATION */}
        {/* ============================================================ */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex">
            <div className="bg-white w-72 max-w-[85vw] h-full flex flex-col justify-between p-4 shadow-2xl animate-in slide-in-from-left duration-200">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-950 text-white flex items-center justify-center font-bold text-sm">
                      R
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-slate-950">{salon.name}</h3>
                      <p className="text-[10px] text-slate-500">Navigation Menu</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Mobile Nav Links */}
                <div className="overflow-y-auto max-h-[70vh] space-y-4">
                  {navSections.map((section) => (
                    <div key={section.title} className="space-y-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase font-mono">
                        {section.title}
                      </div>
                      <div className="space-y-1">
                        {section.items.map((item) => {
                          const Icon = item.icon;
                          const isActive = activeTab === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                setActiveTab(item.id);
                                setMobileMenuOpen(false);
                              }}
                              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all ${
                                isActive
                                  ? "bg-slate-950 text-white"
                                  : "text-slate-700 hover:bg-slate-100"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <Icon className="w-4 h-4" />
                                <span>{item.label}</span>
                              </div>
                              {item.badge && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                                  {item.badge}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <button
                  onClick={() => {
                    resetDemoData();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-slate-500 hover:text-slate-900 text-xs font-bold"
                >
                  Reset Demo Store Data
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MAIN BODY AREA & TOP CONSOLE BAR */}
        {/* ============================================================ */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Console Bar */}
          <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between gap-4">
              {/* Left: Mobile hamburger & Breadcrumbs */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors"
                >
                  <Menu className="w-5 h-5" />
                </button>

                <div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                    <span>Salon Console</span>
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                    <span className="text-slate-900 font-bold">{getActiveTabTitle()}</span>
                  </div>
                  <h1 className="text-base sm:text-lg font-black text-slate-950 tracking-tight leading-tight">
                    {getActiveTabTitle()}
                  </h1>
                </div>
              </div>

              {/* Right: Metrics & Actions */}
              <div className="flex items-center gap-2.5 sm:gap-3">
                {/* Live Clock */}
                <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-mono text-xs font-semibold">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentTime || "10:00 AM"} IST</span>
                </div>

                {/* Gross Revenue Pill */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="text-slate-400 text-[10px] font-bold uppercase">Today</span>
                  <span className="font-extrabold text-slate-950 font-mono">
                    {formatCurrency(totalTodayRevenue)}
                  </span>
                </div>

                {/* Active Chairs */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="text-slate-400 text-[10px] font-bold uppercase">Chairs</span>
                  <span className="font-extrabold text-blue-700">
                    {clockedInStaffCount} / {staff.length}
                  </span>
                </div>

                {/* Client Site Link */}
                <Link
                  href="/book"
                  className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 transition-all shadow-2xs"
                  title="Test customer online booking experience"
                >
                  <Globe className="w-3.5 h-3.5 text-slate-500" />
                  <span>Client Site</span>
                </Link>

                {/* Primary New Checkout Button */}
                <button
                  onClick={() => setActiveTab("pos")}
                  className="px-3.5 py-1.5 sm:px-4 sm:py-2 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0 tactile-btn"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Quick Bill</span>
                </button>
              </div>
            </div>
          </header>

          {/* Main Module Content View */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 min-h-screen">
            {activeTab === "frontdesk" && (
              <FrontDeskView
                onNavigateTab={(tab) => setActiveTab(tab as any)}
                onGoToPosBilling={handleGoToPosFromCalendar}
              />
            )}
            {activeTab === "owner" && <SalonOwnerView />}
            {activeTab === "overview" && <OverviewView onNavigateTab={(tab) => setActiveTab(tab as any)} />}
            {activeTab === "calendar" && <CalendarView onGoToPosBilling={handleGoToPosFromCalendar} />}
            {activeTab === "pos" && <PosView />}
            {activeTab === "customers" && (
              <CustomersView
                onGoToPos={(_cid) => setActiveTab("pos")}
                onGoToBooking={(_name, _phone) => setActiveTab("calendar")}
              />
            )}
            {activeTab === "services" && <ServicesView />}
            {activeTab === "staff" && <StaffView />}
            {activeTab === "inventory" && <InventoryView />}
            {activeTab === "followups" && <CrmFollowupsView />}
            {activeTab === "reports" && <ReportsView />}
            {activeTab === "booking" && <BookingPreviewView />}
            {activeTab === "settings" && <SettingsView />}
          </main>
        </div>
      </div>

      {/* Competitor Benchmark Modal */}
      {showBenchmarkModal && (
        <CompetitorBenchmarkModal onClose={() => setShowBenchmarkModal(false)} />
      )}
    </div>
  );
}
