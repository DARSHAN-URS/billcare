"use client";

import React from "react";
import { useBillCare } from "@/lib/billcare-context";
import { getRoleConfig, getRequiredRoleForTab, DashboardTab, UserRole } from "@/lib/role-permissions";
import { ShieldAlert, ArrowLeft, ArrowRight, Lock, KeyRound, Crown, Briefcase, Headphones } from "lucide-react";

interface RolePermissionGuardProps {
  tab: DashboardTab;
  tabLabel: string;
  onNavigateToAllowedTab?: (tab: DashboardTab) => void;
}

export function RolePermissionGuard({ tab, tabLabel, onNavigateToAllowedTab }: RolePermissionGuardProps) {
  const { user, switchPersona } = useBillCare();
  const currentRole = (user?.role || "owner") as UserRole;
  const currentConfig = getRoleConfig(currentRole);
  const requiredRole = getRequiredRoleForTab(tab);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-[#151515] border border-[#27272A] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-32 bg-amber-500/10 blur-[60px] pointer-events-none" />

        <div className="relative z-10 space-y-6 text-center">
          {/* Lock Icon */}
          <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-inner">
            <ShieldAlert className="w-8 h-8 animate-pulse" />
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
              Feature Isolated by Role
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-medium text-white tracking-tight">
              Access Restricted: {tabLabel}
            </h2>
            <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-md mx-auto leading-relaxed">
              This module contains confidential salon operational records restricted to{" "}
              <span className="text-amber-300 font-semibold">{requiredRole}</span> permissions.
            </p>
          </div>

          {/* Role Comparison Pill */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left bg-[#0A0A0C] border border-[#222226] rounded-xl p-3.5">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#71717A] uppercase tracking-wider block">
                Your Current Role
              </span>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${currentConfig.badgeClasses}`}>
                  {currentConfig.label}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#71717A] uppercase tracking-wider block">
                Required Authorization
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                  <Lock className="w-3 h-3" />
                  {requiredRole}
                </span>
              </div>
            </div>
          </div>

          {/* Explanation Notes */}
          <div className="bg-[#181818]/60 border border-[#27272A]/80 rounded-xl p-3.5 text-left text-xs text-[#A1A1AA] space-y-2">
            <div className="font-medium text-white flex items-center gap-1.5 text-xs">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Why is this feature isolated?</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-[#8E8E98]">
              {tab === "owner" && (
                <>
                  <li>Contains executive net EBITDA, owner gross profits, and strategic forecasts.</li>
                  <li>Restricted exclusively to salon directors and verified business owners.</li>
                </>
              )}
              {tab === "reports" && (
                <>
                  <li>Contains tax filing figures (CGST + SGST), bank reconciliation, and profit margins.</li>
                  <li>Hidden from front desk to maintain confidentiality and audit compliance.</li>
                </>
              )}
              {tab === "staff" && (
                <>
                  <li>Stylist commission rates and payroll payouts are private between owner and staff.</li>
                  <li>Managers can record daily attendance, but only owners adjust payout percentages.</li>
                </>
              )}
              {tab === "inventory" && (
                <>
                  <li>Wholesale supplier costs and margin markups are confidential.</li>
                  <li>Front desk receptionists focus on point-of-sale customer checkout.</li>
                </>
              )}
              {tab === "settings" && (
                <>
                  <li>Contains official GSTIN registration, bank IFSC, UPI account, and franchise details.</li>
                  <li>Modifications require highest-tier salon administrative authority.</li>
                </>
              )}
              {tab === "followups" && (
                <>
                  <li>Automated WhatsApp broadcast triggers and retention campaigns.</li>
                  <li>Managed by marketing leads, managers, and salon owners.</li>
                </>
              )}
            </ul>
          </div>

          {/* Quick Role Switcher Buttons for Pair-Programming & Live Testing */}
          <div className="pt-2 border-t border-[#27272A] space-y-2.5">
            <span className="text-[11px] font-mono text-[#71717A] block">
              Quickly test this feature as another role:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => switchPersona("owner")}
                className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Switch to Owner</span>
              </button>
              <button
                type="button"
                onClick={() => switchPersona("manager")}
                className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Switch to Manager</span>
              </button>
              {onNavigateToAllowedTab && (
                <button
                  type="button"
                  onClick={() => onNavigateToAllowedTab(currentConfig.defaultTab)}
                  className="px-3 py-1.5 bg-[#1F1F23] hover:bg-[#27272A] text-white border border-[#333338] rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to {currentConfig.defaultTab === "frontdesk" ? "Front Desk" : "Dashboard"}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
