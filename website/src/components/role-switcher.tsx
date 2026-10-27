"use client";

import React, { useState, useRef, useEffect } from "react";
import { useBillCare } from "@/lib/billcare-context";
import { ROLE_CONFIGS, UserRole, getRoleConfig } from "@/lib/role-permissions";
import { Crown, Briefcase, Headphones, ChevronDown, Check, ShieldCheck, Sparkles } from "lucide-react";

interface RoleSwitcherProps {
  variant?: "pill" | "sidebar";
  onRoleSwitched?: (role: UserRole) => void;
}

export function RoleSwitcher({ variant = "pill", onRoleSwitched }: RoleSwitcherProps) {
  const { user, switchPersona } = useBillCare();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentRole = ((user?.role as UserRole) || "owner");
  const currentConfig = getRoleConfig(currentRole);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const roles: { role: UserRole; title: string; subtitle: string; icon: any; color: string }[] = [
    {
      role: "owner",
      title: "Salon Owner",
      subtitle: "Full 360° Access & P&L",
      icon: Crown,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      role: "manager",
      title: "Salon Manager",
      subtitle: "Operations, Staff & Stock",
      icon: Briefcase,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
      role: "receptionist",
      title: "Receptionist",
      subtitle: "Front Desk, Calendar & POS",
      icon: Headphones,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
  ];

  const handleSelectRole = (role: UserRole) => {
    switchPersona(role);
    setIsOpen(false);
    if (onRoleSwitched) {
      onRoleSwitched(role);
    }
  };

  const getRoleIcon = (r: UserRole) => {
    if (r === "owner") return Crown;
    if (r === "manager") return Briefcase;
    return Headphones;
  };

  const ActiveIcon = getRoleIcon(currentRole);

  if (variant === "sidebar") {
    return (
      <div className="bg-[#151515] border border-[#27272A] rounded-xl p-2.5 space-y-2">
        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[#71717A]">
          <span>Role View Mode</span>
          <span className="text-amber-300 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            Active
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1 bg-[#09090A] p-1 rounded-lg border border-[#222226]">
          {roles.map((r) => {
            const Icon = r.icon;
            const isSelected = currentRole === r.role;
            return (
              <button
                key={r.role}
                type="button"
                onClick={() => handleSelectRole(r.role)}
                title={`Switch to ${r.title} perspective`}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-md text-[10px] font-medium transition-all ${
                  isSelected
                    ? "bg-[#1F1F24] text-white shadow-sm font-semibold border border-white/10"
                    : "text-[#71717A] hover:text-[#F8FAFC] hover:bg-white/5"
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 mb-1 ${
                    isSelected
                      ? r.role === "owner"
                        ? "text-amber-400"
                        : r.role === "manager"
                        ? "text-blue-400"
                        : "text-emerald-400"
                      : "text-[#71717A]"
                  }`}
                />
                <span className="truncate w-full text-center capitalize">{r.role}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shadow-sm cursor-pointer ${currentConfig.badgeClasses}`}
        title="Switch simulated salon role to test feature isolation"
      >
        <ActiveIcon className="w-3.5 h-3.5 shrink-0" />
        <span className="hidden sm:inline font-mono uppercase tracking-wider text-[11px]">
          {currentConfig.shortTitle}
        </span>
        <ChevronDown className={`w-3 h-3 text-[#A1A1AA] transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-[#121215] border border-[#27272A] rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in-50 zoom-in-95 backdrop-blur-xl">
          <div className="px-2.5 py-1.5 border-b border-[#222226] mb-1.5 flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717A]">
              Role-Based Access
            </span>
            <span className="text-[9px] font-mono text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
              Live Testing
            </span>
          </div>

          <div className="space-y-1">
            {roles.map((r) => {
              const Icon = r.icon;
              const isSelected = currentRole === r.role;
              return (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => handleSelectRole(r.role)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                    isSelected
                      ? "bg-[#1C1C22] text-white border border-white/10"
                      : "text-[#A1A1AA] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${r.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate flex items-center gap-1.5">
                        <span>{r.title}</span>
                      </div>
                      <div className="text-[10px] text-[#71717A] truncate font-light">
                        {r.subtitle}
                      </div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-[#222226] px-2 text-[10px] text-[#71717A] font-mono leading-tight">
            Role isolation automatically filters navigation tabs and guards financial ledgers.
          </div>
        </div>
      )}
    </div>
  );
}
