"use client";

import React from "react";
import {
  X,
  Check,
  Minus,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Crown,
  Percent,
  MessageSquare,
  Globe,
  Receipt,
  Zap,
} from "lucide-react";

interface CompetitorBenchmarkModalProps {
  onClose: () => void;
}

export function CompetitorBenchmarkModal({ onClose }: CompetitorBenchmarkModalProps) {
  const comparisonData = [
    {
      feature: "Marketplace Commission on New Clients",
      ruvexi: "0% Commission (Keep 100%)",
      fresha: "20% cut on every new client",
      zenoti: "Custom Enterprise SLA",
      boulevard: "0% (but $350+/mo base fee)",
      highlight: true,
    },
    {
      feature: "Meta WhatsApp Cloud API Automation",
      ruvexi: "Built-in (Automated Reminders & Invoices)",
      fresha: "SMS only (charged per SMS)",
      zenoti: "SMS & Twilio add-on",
      boulevard: "SMS only (US/UK)",
      highlight: true,
    },
    {
      feature: "Multi-Stylist Timeline Chair Matrix",
      ruvexi: "Included (Drag, Drop & Live Sync)",
      fresha: "Included",
      zenoti: "Included (Complex grid)",
      boulevard: "Included (Precision scheduling)",
      highlight: false,
    },
    {
      feature: "360° Technical Formula & Patch Test Cards",
      ruvexi: "Included (Hair Dyes, Developers, Peels)",
      fresha: "Included",
      zenoti: "Included",
      boulevard: "Included",
      highlight: true,
    },
    {
      feature: "Indian GST & UPI / QR Split Tender POS",
      ruvexi: "Native (CGST + SGST + Split UPI/Cash)",
      fresha: "Basic Card/Cash only (no Indian GST)",
      zenoti: "Indian Enterprise tier only",
      boulevard: "US Card Readers only (No UPI)",
      highlight: true,
    },
    {
      feature: "Custom Branded Booking Domain",
      ruvexi: "Yes (salon.yourbrand.com)",
      fresha: "No (fresha.com/your-salon)",
      zenoti: "Yes ($$$ high tier)",
      boulevard: "Yes",
      highlight: false,
    },
    {
      feature: "Staff Commission & Performance Leaderboard",
      ruvexi: "Built-in (Service % + Retail %)",
      fresha: "Included",
      zenoti: "Included",
      boulevard: "Included",
      highlight: false,
    },
    {
      feature: "Self-Hosting / Independent Data Sovereignty",
      ruvexi: "Full Supabase RLS isolation",
      fresha: "Locked inside Fresha ecosystem",
      zenoti: "Proprietary cloud lock-in",
      boulevard: "Proprietary cloud lock-in",
      highlight: true,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs tracking-wider uppercase mb-1">
            <Crown className="w-4 h-4 fill-amber-400" />
            Global Salon Management Benchmark
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            RUVEXI vs The World's Best Salon Software
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Built to match the world-class scheduling & POS ergonomics of <b>Fresha</b> and <b>Boulevard</b>, with zero marketplace fees, native WhatsApp automation, and Indian GST & UPI billing.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="p-6 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th className="p-3.5 font-black text-slate-900 rounded-l-2xl">Platform Feature</th>
                <th className="p-3.5 font-black text-blue-700 bg-blue-50/80 border-x border-blue-200">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>RUVEXI OS</span>
                  </div>
                </th>
                <th className="p-3.5 font-extrabold text-slate-700">Fresha</th>
                <th className="p-3.5 font-extrabold text-slate-700">Boulevard</th>
                <th className="p-3.5 font-extrabold text-slate-700 rounded-r-2xl">Zenoti</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {comparisonData.map((row, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-slate-50/60 transition-colors ${
                    row.highlight ? "bg-amber-50/20" : ""
                  }`}
                >
                  <td className="p-3.5 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      {row.highlight && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                      )}
                      <span>{row.feature}</span>
                    </div>
                  </td>
                  <td className="p-3.5 font-black text-blue-900 bg-blue-50/50 border-x border-blue-100 font-mono">
                    <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-lg text-[11px]">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      {row.ruvexi}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-600 font-medium">{row.fresha}</td>
                  <td className="p-3.5 text-slate-600 font-medium">{row.boulevard}</td>
                  <td className="p-3.5 text-slate-600 font-medium">{row.zenoti}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              <b>Enterprise Grade:</b> Next.js 14 App Router, Supabase Multi-Tenant RLS, Tailwind CSS.
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all self-end sm:self-auto"
          >
            Got it, Return to Workspace
          </button>
        </div>
      </div>
    </div>
  );
}
