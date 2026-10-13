"use client";

import React, { useState } from "react";
import { CustomerProfile, Invoice } from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils";
import {
  X,
  Crown,
  Sparkles,
  Scissors,
  Calendar,
  Phone,
  Mail,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Send,
  Save,
  CheckCircle2,
  FileText,
  User,
  Coffee,
  Heart,
  TrendingUp,
} from "lucide-react";

interface ClientFormulaModalProps {
  customer: CustomerProfile;
  invoices: Invoice[];
  onClose: () => void;
  onUpdateFormula?: (customerId: string, newFormula: string) => void;
}

export function ClientFormulaModal({
  customer,
  invoices,
  onClose,
  onUpdateFormula,
}: ClientFormulaModalProps) {
  const [formulaText, setFormulaText] = useState(customer.formulaNotes || "");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);

  const customerInvoices = invoices.filter(
    (inv) =>
      inv.customerName.toLowerCase() === customer.name.toLowerCase() ||
      inv.customerPhone === customer.phone
  );

  const handleSaveFormula = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateFormula) {
      onUpdateFormula(customer.id, formulaText);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSendWhatsAppReminder = () => {
    const text = encodeURIComponent(
      `Hello ${customer.name}! ✨ From Luxe Haven Salon: Your stylist ${customer.preferredStaff} was reviewing your hair profile and wanted to check in. Your ${customer.lastService} is ready for a refresher! Would you like to reserve your favorite chair this week?`
    );
    const phoneClean = customer.phone.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${phoneClean}?text=${text}`, "_blank");
    setCopiedWhatsApp(true);
    setTimeout(() => setCopiedWhatsApp(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-2.5 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-3xl max-h-[92vh] overflow-y-auto flex flex-col">
        {/* Header with VIP Badge */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-black text-2xl text-white shadow-xl shadow-blue-500/30 border border-white/20">
                {customer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black tracking-tight">{customer.name}</h2>
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider ${
                      customer.vipTier === "Platinum VIP"
                        ? "bg-amber-400/20 text-amber-300 border border-amber-400/40"
                        : "bg-blue-400/20 text-blue-300 border border-blue-400/40"
                    }`}
                  >
                    <Crown className="w-3 h-3 fill-current" />
                    {customer.vipTier || "Gold VIP"}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-300">
                  <span className="flex items-center gap-1 font-mono">
                    <Phone className="w-3.5 h-3.5 text-blue-400" /> {customer.phone}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" /> {customer.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick WhatsApp Action */}
            <button
              onClick={handleSendWhatsAppReminder}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-500/25 whitespace-nowrap self-start sm:self-auto"
            >
              <Send className="w-3.5 h-3.5" />
              {copiedWhatsApp ? "Opening WhatsApp..." : "WhatsApp Direct"}
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-6 pt-5 border-t border-white/10 text-xs">
            <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Lifetime Spend
              </span>
              <span className="text-base font-black text-amber-300 font-mono">
                {formatCurrency(customer.totalSpent)}
              </span>
            </div>
            <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Total Visits
              </span>
              <span className="text-base font-black text-white font-mono">
                {customer.visitsCount} times
              </span>
            </div>
            <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Loyalty Points
              </span>
              <span className="text-base font-black text-purple-300 font-mono">
                {customer.loyaltyPoints} pts
              </span>
            </div>
            <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Rebooking Cycle
              </span>
              <span className="text-base font-black text-emerald-300 font-mono">
                Every {customer.rebookingCadenceDays || 30}d
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Safety & Allergy Alerts (Fresha Signature) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-start gap-3">
              <div className="p-2 bg-emerald-500 text-white rounded-xl">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-emerald-900">Skin Patch Test</h4>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px] uppercase">
                    {customer.patchTestStatus || "Valid"}
                  </span>
                </div>
                <p className="text-emerald-700 mt-1">
                  Tested on {customer.patchTestDate || "2026-09-15"} • Safe for chemical color, developer & peels.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3">
              <div className="p-2 bg-amber-500 text-white rounded-xl">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <h4 className="font-extrabold text-amber-900">Allergies & Sensitivities</h4>
                <p className="text-amber-800 mt-1">
                  {customer.allergies || "No chemical allergies recorded. Sensitive scalp noticed."}
                </p>
              </div>
            </div>
          </div>

          {/* Technical Formula Card (Boulevard / Fresha Signature) */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Technical Color & Treatment Formula Card
                </h3>
              </div>
              <span className="text-[11px] font-bold text-slate-500 font-mono">
                Stylist: {customer.preferredStaff}
              </span>
            </div>

            <form onSubmit={handleSaveFormula} className="mt-3 space-y-3">
              <p className="text-xs text-slate-600">
                Keep precision records of dyes, developer ratios, processing durations, and finishing serums for consistent results across chair visits.
              </p>

              <textarea
                rows={3}
                value={formulaText}
                onChange={(e) => setFormulaText(e.target.value)}
                placeholder="e.g. Roots: Wella KP 6/1 (30g) + 20 Vol (30g) • Balayage: Blondor + 20 Vol • Toner: Color Touch 9/16"
                className="w-full p-3.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800"
              />

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500 italic">
                  Changes save to customer history record.
                </span>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  {savedSuccess ? "Saved!" : "Update Formula"}
                </button>
              </div>
            </form>
          </div>

          {/* Salon Concierge Notes & Preferences */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-start gap-3">
            <Coffee className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
            <div className="text-xs">
              <h4 className="font-extrabold text-indigo-950">Concierge & Beverage Preference</h4>
              <p className="text-indigo-900 mt-0.5">{customer.notes}</p>
            </div>
          </div>

          {/* Visit History & Receipts */}
          <div>
            <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              Visit History & Receipts ({customerInvoices.length})
            </h4>

            {customerInvoices.length === 0 ? (
              <p className="text-xs text-slate-500 italic bg-slate-50 p-4 rounded-xl border border-slate-100">
                Last recorded service: {customer.lastService} on {customer.lastVisitDate}
              </p>
            ) : (
              <div className="space-y-2">
                {customerInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-3.5 rounded-xl border border-slate-200/80 bg-white flex items-center justify-between text-xs hover:border-blue-300 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 font-mono">
                          {inv.invoiceNumber}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {inv.status}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        {inv.date} • {inv.items.map((i) => i.name).join(", ")}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-slate-900 font-mono text-sm block">
                        {formatCurrency(inv.total)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">
                        via {inv.paymentMethod}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}
