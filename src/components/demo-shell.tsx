"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBillCare } from "@/lib/billcare-context";
import { formatCurrency } from "@/lib/utils";
import { BillCareLogo } from "./brand/billcare-logo";
import { FrontDeskView } from "./front-desk-view";
import { SalonOwnerView } from "./salon-owner-view";
import { OverviewView } from "./overview-view";
import { PosView } from "./pos-view";
import { StaffView } from "./staff-view";
import { InventoryView } from "./inventory-view";
import { CrmFollowupsView } from "./crm-followups-view";
import { CalendarView } from "./calendar-view";
import { BookingPreviewView } from "./booking-preview-view";
import { CustomersView } from "./customers-view";
import { ServicesView } from "./services-view";
import { ReportsView } from "./reports-view";
import { SettingsView } from "./settings-view";
import { ZenotiEnterpriseModal } from "./zenoti-enterprise-modal";
import { RoleSwitcher } from "./role-switcher";
import { RolePermissionGuard } from "./role-permission-guard";
import { canAccessTab, getRoleConfig, DashboardTab, UserRole } from "@/lib/role-permissions";
import {
  LayoutDashboard,
  Receipt,
  Users,
  Boxes,
  MessageSquare,
  Calendar,
  Globe,
  Building2,
  Menu,
  X,
  Clock,
  Scissors,
  BarChart3,
  Settings as SettingsIcon,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Crown,
  LogOut,
  Plus,
  Lock,
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
  const router = useRouter();
  const {
    user,
    salon,
    followUps,
    inventory,
    staff,
    invoices,
    customers,
    logout,
    isBackendConnected,
  } = useBillCare();

  const userRole = ((user?.role as UserRole) || "owner");
  const roleConfig = getRoleConfig(userRole);

  const [activeTab, setActiveTab] = useState<TabType>(() => {
    if (canAccessTab(user?.role, initialTab)) return initialTab;
    return roleConfig.defaultTab;
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(salon.branch || "Flagship Studio - Bandra West");
  const [isZenotiModalOpen, setIsZenotiModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");

  // Sync tab if user switches role to one that cannot access current tab
  useEffect(() => {
    if (!canAccessTab(user?.role, activeTab)) {
      setActiveTab(roleConfig.defaultTab);
    }
  }, [user?.role]);

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

  // Compute live metrics from actual data collections
  // Strict Authentication Guard: redirect unauthenticated visitors to /login
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

    const totalTodayRevenue = invoices.reduce((acc, inv) => acc + inv.grandTotal, 0);
  const clockedInStaffCount = staff.filter((s) => s.isClockedIn).length;
  const pendingFollowUps = followUps.filter((f) => f.status === "pending").length;
  const lowStockCount = inventory.filter((i) => i.currentStock <= i.minThreshold).length;

  const handleGoToPosFromCalendar = (
    _customerName: string,
    _serviceName: string,
    _staffName: string
  ) => {
    setActiveTab("pos");
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navSections = [
    {
      title: "OPERATIONS",
      items: [
        {
          id: "frontdesk" as TabType,
          label: "Front Desk Counter",
          icon: CheckCircle2,
          badge: "Live",
          badgeColor: "bg-emerald-100 text-emerald-800",
        },
        {
          id: "owner" as TabType,
          label: "Salon Owner View",
          icon: Crown,
          badge: "Executive",
          badgeColor: "bg-amber-100 text-amber-800",
        },
        {
          id: "calendar" as TabType,
          label: "Appointment Calendar",
          icon: Calendar,
          badge: "Schedule",
          badgeColor: "bg-blue-100 text-blue-800",
        },
        {
          id: "pos" as TabType,
          label: "POS Billing & Checkout",
          icon: Receipt,
          badge: "Quick Bill",
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
          label: "Customer CRM",
          icon: Users,
          badge: `${customers.length}`,
          badgeColor: "bg-purple-100 text-purple-800",
        },
        {
          id: "services" as TabType,
          label: "Services & Pricing",
          icon: Scissors,
          badge: null,
        },
      ],
    },
    {
      title: "STAFF & INVENTORY",
      items: [
        {
          id: "staff" as TabType,
          label: "Staff & Stylists",
          icon: Users,
          badge: `${clockedInStaffCount} In`,
          badgeColor: "bg-indigo-100 text-indigo-800",
        },
        {
          id: "inventory" as TabType,
          label: "Stock & Products",
          icon: Boxes,
          badge: lowStockCount > 0 ? `${lowStockCount} Low` : null,
          badgeColor: "bg-amber-100 text-amber-900",
        },
      ],
    },
    {
      title: "MARKETING & GROWTH",
      items: [
        {
          id: "followups" as TabType,
          label: "WhatsApp Retention",
          icon: MessageSquare,
          badge: pendingFollowUps > 0 ? `${pendingFollowUps} Due` : null,
          badgeColor: "bg-emerald-100 text-emerald-800",
        },
        {
          id: "reports" as TabType,
          label: "Sales & Tax Reports",
          icon: BarChart3,
          badge: null,
        },
        {
          id: "booking" as TabType,
          label: "Online Booking Site",
          icon: Globe,
          badge: "24/7",
          badgeColor: "bg-slate-100 text-slate-800",
        },
      ],
    },
    {
      title: "ENTERPRISE & CHAIN",
      items: [
        {
          id: "settings" as TabType,
          label: "Zenoti Enterprise Hub",
          icon: Building2,
          badge: "Multi-Center",
          badgeColor: "bg-indigo-100 text-indigo-800",
          onClick: () => setIsZenotiModalOpen(true),
        },
      ],
    },
    {
      title: "SYSTEM",
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

  if (!user) {
    return (
      <div className="min-h-screen bg-[#080809] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#171719] border border-[#27272A] flex items-center justify-center text-[#F5C928] mb-4 shadow-xl">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-xl font-bold text-[#F5F4F0] mb-2">Access Restricted</h2>
        <p className="text-xs text-[#7E8B9C] max-w-sm mb-6 leading-relaxed">
          Authentication is required to access the BillCare management operating system. Please sign in with your credentials.
        </p>
        <Link
          href="/login"
          className="px-6 py-2.5 rounded-xl bg-[#F5C928] text-[#080809] font-bold text-xs hover:bg-[#f7d348] transition-all shadow-md"
        >
          Proceed to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080809] flex flex-col font-sans text-[#F5F4F0] antialiased selection:bg-[#F5C928]/30 selection:text-[#F5F4F0]">
      <div className="flex-1 flex min-h-screen">
        {/* ============================================================ */}
        {/* DESKTOP SIDE NAVIGATION BAR */}
        {/* ============================================================ */}
        <aside className="hidden lg:flex w-64 xl:w-72 bg-[#0D0D0F] border-r border-[#27272A] flex-col justify-between shrink-0 h-screen sticky top-0 z-30 shadow-2xl">
          {/* Top Brand & Branch Header */}
          <div className="p-4 border-b border-[#27272A] space-y-3.5">
            {/* Salon Brand Title with BillCare Logo */}
            <div className="flex items-center justify-between">
              <Link href="/" className="hover:opacity-90 transition-opacity">
                <BillCareLogo size="sm" variant="light" showSubtitle={true} />
              </Link>
              <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-full bg-[#171719] text-[#F5C928] border border-[#27272A]">
                PRO OS
              </span>
            </div>

            {/* Current Salon Name Card - Zenoti Switcher */}
            <div
              onClick={() => setIsZenotiModalOpen(true)}
              className="bg-[#111113] hover:bg-[#171719] border border-[#27272A] hover:border-[#F5C928]/40 rounded-xl p-2.5 space-y-1 cursor-pointer transition-all group"
              title="Click to switch studio location or open Zenoti Multi-Center Suite"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#7E8B9C] group-hover:text-[#F5C928]">
                  Active Center
                </span>
                <span className="text-[9px] font-mono uppercase text-[#F5C928] bg-[#F5C928]/10 group-hover:bg-[#F5C928]/20 px-1.5 py-0.5 rounded border border-[#F5C928]/20">
                  Switch ⚙️
                </span>
              </div>
              <div className="font-medium text-xs text-[#F5F4F0] truncate font-sans">
                {salon.name}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#A3A3AD] font-light">
                <Building2 className="w-3 h-3 text-[#F5C928] shrink-0" />
                <span className="truncate">{selectedBranch}</span>
              </div>
            </div>

            {/* Quick Checkout CTA */}
            <button
              onClick={() => setActiveTab("pos")}
              className="w-full py-2.5 bg-white hover:bg-slate-200 text-[#080809] font-semibold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>New POS Checkout</span>
            </button>

            {/* Quick Role View Mode Switcher */}
            <RoleSwitcher variant="sidebar" onRoleSwitched={(r) => {
              const cfg = getRoleConfig(r);
              if (!cfg.allowedTabs.includes(activeTab)) {
                setActiveTab(cfg.defaultTab);
              }
            }} />
          </div>

          {/* Middle Nav Items (Grouped) */}
          <div className="flex-1 overflow-y-auto p-3 space-y-5">
            {navSections.map((section) => {
              const permittedItems = section.items.filter((item) => canAccessTab(user?.role, item.id));
              return (
                <div key={section.title} className="space-y-1">
                  <div className="px-3 text-[10px] font-mono uppercase tracking-wider text-[#7E8B9C] flex items-center justify-between">
                    <span>{section.title}</span>
                    {permittedItems.length === 0 && (
                      <span className="text-[9px] text-[#6A6A75] flex items-center gap-1 font-mono">
                        <Lock className="w-2.5 h-2.5 text-amber-500/60" />
                        Restricted
                      </span>
                    )}
                  </div>
                  <nav className="space-y-0.5">
                    {section.items.map((item: any) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      const isPermitted = canAccessTab(user?.role, item.id);

                      if (!isPermitted) {
                        return (
                          <button
                            key={item.label}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition-all text-left cursor-pointer group ${
                              isActive
                                ? "bg-amber-500/10 text-amber-300 border-l-2 border-amber-500"
                                : "text-[#55555E] hover:text-[#8E8E98] hover:bg-[#151518]"
                            }`}
                            title={`Restricted feature: Click to view permission requirements`}
                          >
                            <div className="flex items-center gap-2.5">
                              <Lock className="w-3.5 h-3.5 shrink-0 text-[#45454F] group-hover:text-amber-400" />
                              <span className="truncate">{item.label}</span>
                            </div>
                            <span className="text-[8px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#18181C] text-[#6A6A75] border border-[#27272A]/40">
                              Locked
                            </span>
                          </button>
                        );
                      }

                      return (
                        <button
                          key={item.label}
                          onClick={() => {
                            if (item.onClick) {
                              item.onClick();
                            } else {
                              setActiveTab(item.id);
                            }
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                            isActive
                              ? "bg-[#171719] text-[#F5F4F0] border-l-2 border-[#F5C928] shadow-sm"
                              : "text-[#A3A3AD] hover:text-[#F5F4F0] hover:bg-[#1D1D20]"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon
                              className={`w-4 h-4 shrink-0 ${
                                isActive ? "text-[#F5C928]" : "text-[#7E8B9C]"
                              }`}
                            />
                            <span>{item.label}</span>
                          </div>
                          {item.badge && (
                            <span
                              className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${
                                isActive
                                  ? "bg-[#F5C928]/15 text-[#F5C928] border border-[#F5C928]/30"
                                  : "bg-[#171719] text-[#A3A3AD] border border-[#27272A]"
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
              );
            })}
          </div>

          {/* Bottom Footer Info & Real Authenticated User Profile */}
          <div className="p-3.5 border-t border-[#27272A] bg-[#080809] space-y-2.5">
            {/* Authenticated User Card */}
            <div className="flex items-center justify-between bg-[#111113] border border-[#27272A] rounded-xl p-2.5 shadow-sm">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-[#F5C928] text-[#080809] flex items-center justify-center text-xs font-bold shrink-0">
                  {user?.avatar || user?.name?.charAt(0) || "U"}
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-xs text-[#F5F4F0] truncate flex items-center gap-1.5">
                    <span>{user?.name || "Salon Director"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded border ${roleConfig.badgeClasses}`}>
                      {roleConfig.shortTitle}
                    </span>
                    <span className="text-[10px] text-[#7E8B9C] truncate font-light">
                      {user?.email || "owner@billcare.io"}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-[#7E8B9C] hover:text-[#F16B70] hover:bg-[#F16B70]/10 transition-colors"
                title="Sign out of BillCare"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Links */}
            <div className="flex items-center justify-between text-[11px] text-[#7E8B9C] font-semibold px-1">
              <Link
                href="/book"
                className="hover:text-[#F5F4F0] flex items-center gap-1 transition-colors"
                target="_blank"
              >
                <Globe className="w-3 h-3 text-[#7E8B9C]" />
                <span>Client Site ↗</span>
              </Link>
              <Link
                href="/admin"
                className="text-[#F5C928] hover:text-[#FFDA50] font-bold flex items-center gap-1 transition-colors"
                title="BillCare Platform Owner Super Admin Hub"
              >
                <ShieldCheck className="w-3 h-3 text-[#F5C928]" />
                <span>Super Admin</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* ============================================================ */}
        {/* MOBILE DRAWER NAVIGATION */}
        {/* ============================================================ */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex">
            <div className="bg-[#0D0D0F] border-r border-[#27272A] text-[#F5F4F0] w-72 max-w-[85vw] h-full flex flex-col justify-between p-4 shadow-2xl animate-in slide-in-from-left duration-200">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
                  <BillCareLogo size="sm" variant="light" showSubtitle={true} />
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg text-[#7E8B9C] hover:text-[#F5F4F0] hover:bg-[#171719]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Role Switcher */}
                <RoleSwitcher variant="sidebar" onRoleSwitched={(r) => {
                  const cfg = getRoleConfig(r);
                  if (!cfg.allowedTabs.includes(activeTab)) {
                    setActiveTab(cfg.defaultTab);
                  }
                  setMobileMenuOpen(false);
                }} />

                <div className="space-y-4 overflow-y-auto max-h-[60vh]">
                  {navSections.map((sec) => (
                    <div key={sec.title} className="space-y-1">
                      <div className="text-[10px] font-bold text-[#7E8B9C] uppercase tracking-wider font-mono">
                        {sec.title}
                      </div>
                      <div className="space-y-1">
                        {sec.items.map((item) => {
                          const Icon = item.icon;
                          const isActive = activeTab === item.id;
                          const isPermitted = canAccessTab(user?.role, item.id);

                          if (!isPermitted) {
                            return (
                              <button
                                key={item.label}
                                onClick={() => {
                                  setActiveTab(item.id);
                                  setMobileMenuOpen(false);
                                }}
                                className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-all ${
                                  isActive
                                    ? "bg-amber-500/10 text-amber-300 border-l-2 border-amber-500"
                                    : "text-[#55555E] hover:bg-[#151518]"
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <Lock className="w-3.5 h-3.5 text-[#45454F]" />
                                  <span className="truncate">{item.label}</span>
                                </div>
                                <span className="text-[8px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#18181C] text-[#6A6A75] border border-[#27272A]/40">
                                  Locked
                                </span>
                              </button>
                            );
                          }

                          return (
                            <button
                              key={item.label}
                              onClick={() => {
                                if ((item as any).onClick) {
                                  (item as any).onClick();
                                } else {
                                  setActiveTab(item.id);
                                }
                                setMobileMenuOpen(false);
                              }}
                              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all ${
                                isActive
                                  ? "bg-[#171719] text-[#F5F4F0] border-l-2 border-[#F5C928]"
                                  : "text-[#A3A3AD] hover:bg-[#1D1D20] hover:text-[#F5F4F0]"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <Icon className={`w-4 h-4 ${isActive ? "text-[#F5C928]" : "text-[#7E8B9C]"}`} />
                                <span>{item.label}</span>
                              </div>
                              {item.badge && (
                                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-[#111113] text-[#A3A3AD] border border-[#27272A]">
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

              <div className="pt-3 border-t border-[#27272A]">
                <button
                  onClick={handleLogout}
                  className="w-full py-2 text-[#F16B70] hover:bg-[#F16B70]/10 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MAIN BODY AREA & TOP CONSOLE BAR */}
        {/* ============================================================ */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#080809]">
          {/* Top Console Bar */}
          <header className="sticky top-0 z-20 bg-[#0D0D0F]/95 backdrop-blur-xl border-b border-[#27272A] px-4 sm:px-6 lg:px-8 py-3.5 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              {/* Left: Mobile hamburger & Breadcrumbs */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="lg:hidden p-2 rounded-xl text-[#7E8B9C] hover:text-[#F5F4F0] hover:bg-[#171719] transition-colors"
                >
                  <Menu className="w-5 h-5" />
                </button>

                <div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#7E8B9C] font-mono">
                    <span>Console</span>
                    <ChevronRight className="w-3 h-3 text-[#7E8B9C]" />
                    <span className="text-[#F5C928] font-medium">{getActiveTabTitle()}</span>
                  </div>
                  <h1 className="font-serif text-base sm:text-xl font-normal text-[#F5F4F0] tracking-tight leading-tight">
                    {getActiveTabTitle()}
                  </h1>
                </div>
              </div>

              {/* Right: Metrics & Actions */}
              <div className="flex items-center gap-2.5 sm:gap-3">
                {/* Active Role Switcher Pill */}
                <RoleSwitcher
                  variant="pill"
                  onRoleSwitched={(r) => {
                    const cfg = getRoleConfig(r);
                    if (!cfg.allowedTabs.includes(activeTab)) {
                      setActiveTab(cfg.defaultTab);
                    }
                  }}
                />

                {/* Live Database Status Indicator */}
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-mono ${
                    isBackendConnected
                      ? "bg-emerald-500/10 border-emerald-500/20 text-[#35C995]"
                      : "bg-[#111113] border-[#27272A] text-[#7E8B9C]"
                  }`}
                  title={isBackendConnected ? "Connected to live database" : "Connecting to backend..."}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isBackendConnected ? "bg-[#35C995] animate-pulse" : "bg-[#E9A23B]"
                    }`}
                  ></span>
                  <span className="hidden sm:inline text-[11px]">
                    {isBackendConnected ? "Live Cloud" : "Connecting..."}
                  </span>
                </div>

                {/* Live Clock */}
                <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111113] border border-[#27272A] text-[#A3A3AD] font-mono text-xs">
                  <Clock className="w-3.5 h-3.5 text-[#F5C928]" />
                  <span>{currentTime || "10:00 AM"} IST</span>
                </div>

                {/* Gross Revenue Pill */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#111113] border border-[#27272A] text-xs">
                  <span className="text-[#7E8B9C] text-[10px] font-mono uppercase">Today</span>
                  <span className="font-mono text-[#F5C928] font-semibold">
                    {formatCurrency(totalTodayRevenue)}
                  </span>
                </div>

                {/* Active Chairs */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#111113] border border-[#27272A] text-xs">
                  <span className="text-[#7E8B9C] text-[10px] font-mono uppercase">Chairs In</span>
                  <span className="font-mono text-[#35C995] font-semibold">
                    {clockedInStaffCount} / {staff.length}
                  </span>
                </div>

                {/* Zenoti Multi-Center Location Switcher (Owner Only) */}
                {userRole === "owner" || userRole === "admin" ? (
                  <button
                    onClick={() => setIsZenotiModalOpen(true)}
                    className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#171719] hover:bg-[#1D1D20] text-[#F5F4F0] text-xs border border-[#27272A] transition-all cursor-pointer group"
                    title="Switch studio branch or open Zenoti Multi-Center Enterprise Suite"
                  >
                    <Building2 className="w-3.5 h-3.5 text-[#F5C928] group-hover:scale-110 transition-transform" />
                    <span className="max-w-[130px] truncate">{selectedBranch.includes("All") ? "Consolidated HQ" : selectedBranch}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#F5C928]/15 text-[#F5C928] font-mono font-medium uppercase tracking-wider">Zenoti</span>
                  </button>
                ) : null}

                {/* Client Site Link */}
                <Link
                  href="/book"
                  className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111113] hover:bg-[#171719] text-[#A3A3AD] hover:text-[#F5F4F0] font-mono text-xs border border-[#27272A] transition-all"
                  title="Open live customer online booking portal"
                  target="_blank"
                >
                  <Globe className="w-3.5 h-3.5 text-[#7E8B9C]" />
                  <span>Booking Portal</span>
                </Link>

                {/* Primary New Checkout Button */}
                <button
                  onClick={() => setActiveTab("pos")}
                  className="px-3.5 py-1.5 sm:px-4 sm:py-2 bg-[#F5C928] hover:bg-[#FFDA50] text-[#080809] font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Quick Bill</span>
                </button>
              </div>
            </div>
          </header>

          {/* Main Module Content View guarded by Role-Based Feature Isolation */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 min-h-screen">
            {!canAccessTab(user?.role, activeTab) ? (
              <RolePermissionGuard
                tab={activeTab}
                tabLabel={getActiveTabTitle()}
                onNavigateToAllowedTab={(tab) => setActiveTab(tab)}
              />
            ) : (
              <>
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
              </>
            )}
          </main>
        </div>
      </div>

      {/* Zenoti Enterprise Multi-Center & Clinical Suite Modal */}
      <ZenotiEnterpriseModal
        isOpen={isZenotiModalOpen}
        onClose={() => setIsZenotiModalOpen(false)}
        activeCenter={selectedBranch}
        onSelectCenter={(center) => setSelectedBranch(center)}
      />
    </div>
  );
}

export const DashboardShell = DemoShell;
