"use client";

import React from "react";
import { useBillCare } from "@/lib/billcare-context";
import { formatCurrency } from "@/lib/utils";
import {
  TrendingUp,
  Users,
  Receipt,
  Boxes,
  MessageSquare,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  Calendar,
  Clock,
  Scissors,
  CheckCircle2,
  DollarSign,
  ChevronRight,
  Crown,
  ShieldCheck,
  Star,
  Activity,
  ArrowRight,
} from "lucide-react";

interface OverviewViewProps {
  onNavigateTab: (tab: string) => void;
}

export function OverviewView({ onNavigateTab }: OverviewViewProps) {
  const { salon, staff, inventory, followUps, invoices, appointments } = useBillCare();

  const totalTodayRevenue = invoices.reduce((acc, inv) => acc + (inv.total || inv.grandTotal || 0), 0);
  const totalCommission = staff.reduce((acc, s) => acc + (s.todayCommission || s.todayEarnings || 0), 0);
  const clockedInStaff = staff.filter((s) => s.status === "clocked_in" || s.isClockedIn);
  const lowStockItems = inventory.filter((i) => i.currentStock <= i.minThreshold);
  const pendingFollowUps = followUps.filter((f) => f.status === "Pending" || f.status === "pending");

  const todayDateString = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-6 text-[#F5F4F0]">
      {/* Salon Daily Welcome Banner */}
      <div className="relative overflow-hidden bg-[#0D0D0F] border border-[#27272A] p-7 sm:p-9 rounded-2xl shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F5C928]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171719] border border-[#27272A] text-xs font-mono tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#35C995] animate-pulse" />
              <span className="text-[#35C995] font-semibold">Salon Operational</span>
              <span className="text-[#7E8B9C]">•</span>
              <span className="text-[#A3A3AD]">{todayDateString}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#F5F4F0] tracking-tight">
              {salon.name}
            </h1>

            <p className="text-xs sm:text-sm text-[#A3A3AD] max-w-2xl leading-relaxed font-light">
              {salon.branch} • Operational executive console. Review active chairs, manage client checkout, and monitor live stylist yields.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab("frontdesk")}
              className="px-5 py-3 bg-[#171719] hover:bg-[#1D1D20] text-[#F5F4F0] font-semibold text-xs rounded-xl border border-[#27272A] hover:border-[#F5C928]/50 transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-[#35C995]" />
              <span>Front Desk Counter</span>
            </button>
            <button
              onClick={() => onNavigateTab("pos")}
              className="px-5 py-3 bg-[#F5C928] hover:bg-[#FFDA50] text-[#080809] font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Receipt className="w-4 h-4" />
              <span>Make a Bill</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Launch Action Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { id: "frontdesk", label: "Front Desk", icon: CheckCircle2, accent: "text-[#35C995]" },
          { id: "calendar", label: "Chair Schedule", icon: Calendar, accent: "text-[#87B8E8]" },
          { id: "pos", label: "Live POS", icon: Receipt, accent: "text-[#F5C928]" },
          { id: "customers", label: "Customer CRM", icon: Users, accent: "text-[#A3A3AD]" },
          { id: "services", label: "Services Menu", icon: Scissors, accent: "text-[#E9A23B]" },
          { id: "inventory", label: "Stock & Products", icon: Boxes, accent: "text-[#F16B70]" },
        ].map((mod) => {
          const Icon = mod.icon;
          return (
            <button
              key={mod.id}
              onClick={() => onNavigateTab(mod.id)}
              className="p-3.5 rounded-xl border border-[#27272A] bg-[#111113] hover:bg-[#171719] hover:border-[#343438] transition-all flex items-center gap-3 text-xs font-medium text-[#F5F4F0] text-left cursor-pointer group"
            >
              <div className="p-2 rounded-lg bg-[#171719] border border-[#27272A] group-hover:border-[#F5C928]/30 transition-colors">
                <Icon className={`w-4 h-4 ${mod.accent}`} />
              </div>
              <span className="leading-tight font-sans text-xs">{mod.label}</span>
            </button>
          );
        })}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div
          onClick={() => onNavigateTab("pos")}
          className="bg-[#111113] border border-[#27272A] hover:border-[#F5C928]/50 p-6 rounded-2xl cursor-pointer group transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#7E8B9C]">
              Today's Revenue
            </span>
            <span className="p-2.5 bg-[#171719] text-[#F5C928] rounded-xl border border-[#27272A]">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="font-serif text-2xl sm:text-3xl text-[#F5C928] mt-3 tracking-tight font-medium">
            {formatCurrency(totalTodayRevenue)}
          </div>
          <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-[#27272A]/80">
            <span className="text-[#35C995] font-mono text-[11px] flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> Live Receipts
            </span>
            <span className="text-[#7E8B9C] font-mono text-[11px]">{invoices.length} Bills paid</span>
          </div>
        </div>

        {/* Staff on Duty */}
        <div
          onClick={() => onNavigateTab("staff")}
          className="bg-[#111113] border border-[#27272A] hover:border-[#35C995]/50 p-6 rounded-2xl cursor-pointer group transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#7E8B9C]">
              Stylists on Duty
            </span>
            <span className="p-2.5 bg-[#171719] text-[#35C995] rounded-xl border border-[#27272A]">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="font-serif text-2xl sm:text-3xl text-[#F5F4F0] mt-3 tracking-tight font-medium">
            {clockedInStaff.length}{" "}
            <span className="text-sm font-sans font-light text-[#7E8B9C]">/ {staff.length} Active</span>
          </div>
          <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-[#27272A]/80">
            <span className="text-[#A3A3AD] font-mono text-[11px]">
              Commission: {formatCurrency(totalCommission)}
            </span>
            <span className="text-[#7E8B9C] text-[11px] group-hover:text-[#F5F4F0] transition-colors">Team →</span>
          </div>
        </div>

        {/* Stock Alert */}
        <div
          onClick={() => onNavigateTab("inventory")}
          className="bg-[#111113] border border-[#27272A] hover:border-[#E9A23B]/50 p-6 rounded-2xl cursor-pointer group transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#7E8B9C]">
              Inventory Status
            </span>
            <span
              className={`p-2.5 rounded-xl border border-[#27272A] ${
                lowStockItems.length > 0 ? "bg-[#F16B70]/10 text-[#F16B70]" : "bg-[#35C995]/10 text-[#35C995]"
              }`}
            >
              <Boxes className="w-4 h-4" />
            </span>
          </div>
          <div className="font-serif text-2xl sm:text-3xl text-[#F5F4F0] mt-3 tracking-tight font-medium">
            {lowStockItems.length > 0 ? (
              <span className="text-[#F16B70]">{lowStockItems.length} Low Stock</span>
            ) : (
              <span className="text-[#35C995]">Healthy</span>
            )}
          </div>
          <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-[#27272A]/80">
            <span className={`text-[11px] font-mono ${lowStockItems.length > 0 ? "text-[#F16B70]" : "text-[#35C995]"}`}>
              {lowStockItems.length > 0 ? "Reorder alerts" : "All SKUs stocked"}
            </span>
            <span className="text-[#7E8B9C] font-mono text-[11px]">{inventory.length} SKUs</span>
          </div>
        </div>

        {/* WhatsApp Retention */}
        <div
          onClick={() => onNavigateTab("followups")}
          className="bg-[#111113] border border-[#27272A] hover:border-[#87B8E8]/50 p-6 rounded-2xl cursor-pointer group transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#7E8B9C]">
              WhatsApp CRM
            </span>
            <span className="p-2.5 bg-[#171719] text-[#87B8E8] rounded-xl border border-[#27272A]">
              <MessageSquare className="w-4 h-4" />
            </span>
          </div>
          <div className="font-serif text-2xl sm:text-3xl text-[#F5F4F0] mt-3 tracking-tight font-medium">
            {pendingFollowUps.length} <span className="text-sm font-sans font-light text-[#7E8B9C]">Due</span>
          </div>
          <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-[#27272A]/80">
            <span className="text-[#35C995] font-mono text-[11px]">Meta Cloud API</span>
            <span className="text-[#7E8B9C] text-[11px] group-hover:text-[#F5F4F0] transition-colors">Cadence →</span>
          </div>
        </div>
      </div>

      {/* Main Split: Today's Appointments & Stylist Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Today's Appointments */}
        <div className="lg:col-span-7 bg-[#111113] border border-[#27272A] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-[#F5C928]" />
              <h3 className="font-serif text-lg font-normal text-[#F5F4F0] tracking-tight">
                Live Stylist Chair Schedule
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab("calendar")}
              className="text-xs font-mono text-[#F5C928] hover:underline flex items-center gap-1 cursor-pointer"
            >
              Full Calendar <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="p-3.5 rounded-xl border border-[#27272A] bg-[#171719] hover:bg-[#1D1D20] transition-colors flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 text-center">
                    <span className="text-xs font-bold text-[#F5F4F0] block font-mono">
                      {apt.time.split(" ")[0]}
                    </span>
                    <span className="text-[10px] text-[#7E8B9C] uppercase font-mono">
                      {apt.time.split(" ")[1]}
                    </span>
                  </div>

                  <div className="h-8 w-px bg-[#27272A]" />

                  <div>
                    <h4 className="text-xs font-medium text-[#F5F4F0]">{apt.serviceName}</h4>
                    <p className="text-[11px] text-[#7E8B9C] mt-0.5 font-light">
                      Client: <span className="text-[#A3A3AD] font-normal">{apt.customerName}</span> • Stylist:{" "}
                      <span className="text-[#F5C928] font-normal">{apt.staffName}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      apt.status === "Completed"
                        ? "bg-emerald-500/10 text-[#35C995] border border-emerald-500/20"
                        : apt.status === "In-Service"
                        ? "bg-amber-500/10 text-[#F5C928] border border-amber-500/20"
                        : "bg-blue-500/10 text-[#87B8E8] border border-blue-500/20"
                    }`}
                  >
                    {apt.status}
                  </span>
                  <span className="text-xs font-mono text-[#F5C928] font-medium">
                    {formatCurrency(apt.price)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Stylist Productivity & Stock Feed */}
        <div className="lg:col-span-5 space-y-6">
          {/* Stylist Leaderboard */}
          <div className="bg-[#111113] border border-[#27272A] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
              <h3 className="font-serif text-lg font-normal text-[#F5F4F0] flex items-center gap-2">
                <Scissors className="w-4 h-4 text-[#F5C928]" /> Stylist Productivity
              </h3>
              <button
                onClick={() => onNavigateTab("staff")}
                className="text-xs text-[#F5C928] hover:underline font-mono cursor-pointer"
              >
                Roster →
              </button>
            </div>

            <div className="space-y-3">
              {staff.map((st) => (
                <div
                  key={st.id}
                  className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-[#171719] border border-[#27272A]"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={st.avatar}
                      alt={st.name}
                      className="w-9 h-9 rounded-xl object-cover border border-[#27272A]"
                    />
                    <div>
                      <div className="font-medium text-[#F5F4F0]">{st.name}</div>
                      <span className="text-[10px] text-[#7E8B9C] font-mono">
                        {st.todayServicesCount} services • {st.commissionRate}% comm
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-[#F5C928] font-medium">
                      {formatCurrency(st.todayRevenue || 0)}
                    </div>
                    <span className="text-[10px] text-[#35C995] font-mono">
                      +{formatCurrency(st.todayCommission || 0)} comm
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Urgent Low Stock Alerts */}
          {lowStockItems.length > 0 && (
            <div className="bg-[#111113] border border-[#F16B70]/30 rounded-2xl p-6 space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-[#27272A]">
                <h4 className="font-mono text-xs text-[#F16B70] flex items-center gap-2 uppercase tracking-wider">
                  <AlertTriangle className="w-3.5 h-3.5" /> Reorder Alerts ({lowStockItems.length})
                </h4>
                <button
                  onClick={() => onNavigateTab("inventory")}
                  className="text-xs text-[#F5C928] hover:underline font-mono cursor-pointer"
                >
                  Restock →
                </button>
              </div>

              <div className="space-y-2">
                {lowStockItems.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-xs bg-[#171719] p-3 rounded-xl border border-[#27272A]"
                  >
                    <div>
                      <span className="font-medium text-[#F5F4F0] block truncate max-w-[190px]">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-[#7E8B9C] font-mono">SKU: {item.sku}</span>
                    </div>
                    <span className="text-[11px] font-mono text-[#F16B70] bg-[#F16B70]/10 px-2 py-0.5 rounded-md border border-[#F16B70]/20">
                      {item.currentStock} {item.unit} left
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
