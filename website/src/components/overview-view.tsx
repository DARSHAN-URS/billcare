"use client";

import React from "react";
import { useDemo } from "@/lib/demo-context";
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
} from "lucide-react";

interface OverviewViewProps {
  onNavigateTab: (tab: string) => void;
}

export function OverviewView({ onNavigateTab }: OverviewViewProps) {
  const { salon, staff, inventory, followUps, invoices, appointments } = useDemo();

  const totalTodayRevenue = invoices.reduce((acc, inv) => acc + inv.total, 0);
  const totalCommission = staff.reduce((acc, s) => acc + s.todayCommission, 0);
  const clockedInStaff = staff.filter((s) => s.status === "clocked_in");
  const lowStockItems = inventory.filter((i) => i.currentStock <= i.minThreshold);
  const pendingFollowUps = followUps.filter((f) => f.status === "Pending");

  return (
    <div className="space-y-6">
      {/* Salon Daily Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0b0f19] via-[#0f172a] to-[#1e1b4b] text-white p-7 sm:p-9 rounded-[2rem] shadow-2xl border border-slate-800/80">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Salon Open • Ready for Clients</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              {salon.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed font-medium">
              {salon.branch} • Today's salon desk. Check in arriving clients, make quick bills, and see what needs restocking.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab("frontdesk")}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-2xl shadow-xl shadow-emerald-600/30 transition-all flex items-center gap-2 transform active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" /> Go to Front Desk
            </button>
            <button
              onClick={() => onNavigateTab("pos")}
              className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-2xl shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2 transform active:scale-95"
            >
              <Receipt className="w-4 h-4" /> Make a Bill
            </button>
          </div>
        </div>

        {/* Ambient decorative glow orbs */}
        <div className="absolute -right-16 -bottom-16 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/3 -top-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Quick Launch Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {[
          { id: "frontdesk", label: "Front Desk", icon: CheckCircle2, color: "text-emerald-700 bg-emerald-50 hover:border-emerald-300" },
          { id: "calendar", label: "Appointments", icon: Calendar, color: "text-blue-600 bg-blue-50 hover:border-blue-300" },
          { id: "pos", label: "Billing & Cash", icon: Receipt, color: "text-emerald-600 bg-emerald-50 hover:border-emerald-300" },
          { id: "customers", label: "Clients List", icon: Users, color: "text-purple-600 bg-purple-50 hover:border-purple-300" },
          { id: "services", label: "Services Menu", icon: Scissors, color: "text-indigo-600 bg-indigo-50 hover:border-indigo-300" },
          { id: "inventory", label: "Products & Stock", icon: Boxes, color: "text-amber-600 bg-amber-50 hover:border-amber-300" },
        ].map((mod) => {
          const Icon = mod.icon;
          return (
            <button
              key={mod.id}
              onClick={() => onNavigateTab(mod.id)}
              className={`p-3 rounded-2xl border border-slate-200/80 bg-white hover:shadow-md transition-all flex items-center gap-2.5 text-xs font-bold text-slate-800 text-left`}
            >
              <span className={`p-2 rounded-xl ${mod.color}`}>
                <Icon className="w-4 h-4" />
              </span>
              <span className="leading-tight">{mod.label}</span>
            </button>
          );
        })}
      </div>

      {/* KPI Cards Grid - Simple & Clear Numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div
          onClick={() => onNavigateTab("pos")}
          className="luxury-card p-6 rounded-3xl cursor-pointer group hover:border-blue-500 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Today's Total Sales
            </span>
            <span className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform shadow-2xs">
              <DollarSign className="w-5 h-5" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-3 font-mono">
            {formatCurrency(totalTodayRevenue)}
          </div>
          <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-slate-100">
            <span className="text-emerald-700 font-extrabold flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4" /> Billed today
            </span>
            <span className="text-slate-500 font-semibold font-mono">{invoices.length} Bills paid</span>
          </div>
        </div>

        {/* Staff on Duty */}
        <div
          onClick={() => onNavigateTab("staff")}
          className="luxury-card p-6 rounded-3xl cursor-pointer group hover:border-indigo-500 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Stylists Working Today
            </span>
            <span className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform shadow-2xs">
              <Users className="w-5 h-5" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
            {clockedInStaff.length}{" "}
            <span className="text-sm font-bold text-slate-500">/ {staff.length} Present</span>
          </div>
          <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-slate-100">
            <span className="text-indigo-700 font-bold font-mono">
              Tips & Comm: {formatCurrency(totalCommission)}
            </span>
            <span className="text-slate-500 font-semibold">View team →</span>
          </div>
        </div>

        {/* Stock Alert */}
        <div
          onClick={() => onNavigateTab("inventory")}
          className="luxury-card p-6 rounded-3xl cursor-pointer group hover:border-amber-500 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              Backbar Inventory
            </span>
            <span
              className={`p-3 rounded-2xl group-hover:scale-110 transition-transform shadow-2xs ${
                lowStockItems.length > 0 ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
              }`}
            >
              <Boxes className="w-5 h-5" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
            {lowStockItems.length > 0 ? (
              <span className="text-rose-600 flex items-center gap-1.5">
                {lowStockItems.length} Low
              </span>
            ) : (
              <span className="text-emerald-600">Optimal</span>
            )}
          </div>
          <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-slate-100">
            <span className={lowStockItems.length > 0 ? "text-rose-600 font-bold" : "text-emerald-600 font-bold"}>
              {lowStockItems.length > 0 ? "Restock required" : "All SKUs healthy"}
            </span>
            <span className="text-slate-400 font-mono font-medium">{inventory.length} SKUs</span>
          </div>
        </div>

        {/* CRM Retention */}
        <div
          onClick={() => onNavigateTab("followups")}
          className="luxury-card p-6 rounded-3xl cursor-pointer group hover:border-emerald-500 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              WhatsApp CRM
            </span>
            <span className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform shadow-2xs">
              <MessageSquare className="w-5 h-5" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-3">
            {pendingFollowUps.length} Triggers
          </div>
          <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-slate-100">
            <span className="text-emerald-700 font-bold">Meta Cloud API</span>
            <span className="text-slate-400 font-medium">Review queue →</span>
          </div>
        </div>
      </div>

      {/* Main Split: Today's Appointments & Stylist Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Today's Appointments */}
        <div className="lg:col-span-7 luxury-card rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="font-extrabold text-slate-900 text-base tracking-tight">
                Live Stylist Chair Schedule
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab("calendar")}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Full Calendar <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-14 text-center">
                    <span className="text-xs font-black text-slate-900 block font-mono">{apt.time.split(" ")[0]}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-black">{apt.time.split(" ")[1]}</span>
                  </div>

                  <div className="h-9 w-px bg-slate-200"></div>

                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">{apt.serviceName}</h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Client: <b className="text-slate-800">{apt.customerName}</b> • Artist: <b className="text-indigo-600">{apt.staffName}</b>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      apt.status === "Completed"
                        ? "bg-emerald-100 text-emerald-800"
                        : apt.status === "In-Service"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {apt.status}
                  </span>
                  <span className="text-xs font-black text-slate-900 font-mono">
                    {formatCurrency(apt.price)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Stylist Productivity & Urgent Restock Feed */}
        <div className="lg:col-span-5 space-y-6">
          {/* Stylist Leaderboard */}
          <div className="luxury-card rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Scissors className="w-4 h-4 text-indigo-600" /> Master Artist Productivity
              </h3>
              <button
                onClick={() => onNavigateTab("staff")}
                className="text-xs text-indigo-600 hover:underline font-bold"
              >
                View Roster
              </button>
            </div>

            <div className="space-y-3.5">
              {staff.map((st) => (
                <div key={st.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={st.avatar} alt={st.name} className="w-10 h-10 rounded-2xl object-cover border border-slate-100 shadow-2xs" />
                    <div>
                      <div className="font-extrabold text-slate-900">{st.name}</div>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {st.todayServicesCount} services ({st.commissionRate}% comm)
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-extrabold text-blue-600 font-mono">{formatCurrency(st.todayRevenue)}</div>
                    <span className="text-[10px] text-emerald-600 font-bold font-mono">
                      +{formatCurrency(st.todayCommission)} comm
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Urgent Low Stock Alerts widget */}
          {lowStockItems.length > 0 && (
            <div className="bg-rose-50/80 border border-rose-200 rounded-3xl p-6 space-y-3.5 shadow-sm">
              <div className="flex items-center justify-between text-rose-900">
                <h4 className="font-extrabold text-xs flex items-center gap-2 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-rose-600" /> Backbar Reorder Required ({lowStockItems.length})
                </h4>
                <button
                  onClick={() => onNavigateTab("inventory")}
                  className="text-xs text-rose-700 hover:underline font-black"
                >
                  Restock All →
                </button>
              </div>

              <div className="space-y-2">
                {lowStockItems.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-xs bg-white p-3 rounded-2xl border border-rose-100 shadow-2xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block truncate max-w-[210px]">{item.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">SKU: {item.sku}</span>
                    </div>
                    <span className="text-xs font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-xl">
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
