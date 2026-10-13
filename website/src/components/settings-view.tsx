"use client";

import React, { useState } from "react";
import { useDemo } from "@/lib/demo-context";
import {
  Settings,
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Save,
  MessageSquare,
  Percent,
  Crown,
} from "lucide-react";

export function SettingsView() {
  const { salon, updateSalonProfile, resetDemoData } = useDemo();

  const [name, setName] = useState(salon.name);
  const [tagline, setTagline] = useState(salon.tagline);
  const [branch, setBranch] = useState(salon.branch);
  const [address, setAddress] = useState(salon.address);
  const [phone, setPhone] = useState(salon.phone);
  const [email, setEmail] = useState(salon.email);
  const [gstin, setGstin] = useState(salon.gstin);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Additional salon configs
  const [openTime, setOpenTime] = useState("09:30 AM");
  const [closeTime, setCloseTime] = useState("08:30 PM");
  const [gstRate, setGstRate] = useState("5%");
  const [printerWidth, setPrinterWidth] = useState("80mm (Standard POS)");
  const [autoSendWhatsApp, setAutoSendWhatsApp] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSalonProfile({
      name,
      tagline,
      branch,
      address,
      phone,
      email,
      gstin,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="luxury-card p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 flex items-center justify-center text-white shadow-lg shadow-slate-900/25 border border-white/20">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Salon Configuration & Multi-Branch Settings
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                Tenant Isolation Active
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Brand profile • Tax & GSTIN compliance • WhatsApp Cloud API credentials
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Settings Saved!
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Salon Identity (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="luxury-card p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100">
              <Building2 className="w-4 h-4 text-blue-600" />
              Salon Identity & Location Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Salon Legal Brand Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Branch / Location Title</label>
                <input
                  type="text"
                  required
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Marketing Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-medium text-slate-700"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Complete Physical Address</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-medium text-slate-700"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Official Front-Desk Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Support / Concierge Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-medium"
                />
              </div>
            </div>
          </div>

          {/* Tax, GST & Operating Schedule */}
          <div className="luxury-card p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100">
              <Clock className="w-4 h-4 text-indigo-600" />
              Operating Hours & Tax Configuration
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">GSTIN Number (Govt. Registered)</label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Applicable Tax Slab</label>
                <select
                  value={gstRate}
                  onChange={(e) => setGstRate(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold"
                >
                  <option value="5%">5% GST (Standard Salon Service)</option>
                  <option value="18%">18% GST (Luxury Wellness / Aesthetics)</option>
                  <option value="0%">0% Exempt</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Salon Doors Open</label>
                <input
                  type="text"
                  value={openTime}
                  onChange={(e) => setOpenTime(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Last Chair Slot Closes</label>
                <input
                  type="text"
                  value={closeTime}
                  onChange={(e) => setCloseTime(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Hardware & Automation Badges */}
        <div className="space-y-6">
          {/* WhatsApp Cloud API Status */}
          <div className="luxury-card p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-600" /> WhatsApp Cloud API
              </h3>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Connected
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Meta WABA Status:</span>
                <span className="font-bold text-emerald-600">Active (Tier 2 High Limit)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Phone Number ID:</span>
                <span className="font-mono text-slate-800 font-bold">10982348911029</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Green Tick Verified:</span>
                <span className="font-bold text-emerald-600">Verified Brand ✓</span>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-700 pt-2">
              <input
                type="checkbox"
                checked={autoSendWhatsApp}
                onChange={(e) => setAutoSendWhatsApp(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Auto-dispatch receipts & reminders</span>
            </label>
          </div>

          {/* POS Hardware & Printer */}
          <div className="luxury-card p-6 rounded-3xl space-y-4">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-3 border-b border-slate-100">
              <Printer className="w-4 h-4 text-blue-600" /> POS Hardware & Receipt Format
            </h3>

            <div className="text-xs space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Thermal Paper Roll Width</label>
                <select
                  value={printerWidth}
                  onChange={(e) => setPrinterWidth(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold"
                >
                  <option value="80mm (Standard POS)">80mm (Standard Countertop POS)</option>
                  <option value="58mm (Mini Bluetooth)">58mm (Mini Portable Bluetooth)</option>
                  <option value="A4 / A5 (Full Sheet)">A4 / A5 (Full Laser Invoice)</option>
                </select>
              </div>

              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-[11px] text-blue-900">
                ESC/POS Bluetooth & USB thermal printing compatible without drivers.
              </div>
            </div>
          </div>

          {/* Save / Reset Actions */}
          <div className="space-y-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" /> Save Salon Preferences
            </button>

            <button
              type="button"
              onClick={resetDemoData}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition-all"
            >
              Reset to Factory Baseline
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
