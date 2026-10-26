"use client";

import React, { useState } from "react";
import { useBillCare } from "@/lib/billcare-context";
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
  Smartphone,
  QrCode,
  CreditCard,
} from "lucide-react";
import { MetaEmbeddedSignupModal } from "./meta-embedded-signup-modal";

export function SettingsView() {
  const { salon, updateSalonProfile, resetDemoData } = useBillCare();

  const [name, setName] = useState(salon.name);
  const [tagline, setTagline] = useState(salon.tagline);
  const [branch, setBranch] = useState(salon.branch);
  const [address, setAddress] = useState(salon.address);
  const [phone, setPhone] = useState(salon.phone);
  const [email, setEmail] = useState(salon.email);
  const [gstin, setGstin] = useState(salon.gstin);
  const [upiId, setUpiId] = useState(salon.upiId || "billcare.pos@icici");
  const [bankAccountName, setBankAccountName] = useState(salon.bankAccountName || salon.name);
  const [bankAccountNumber, setBankAccountNumber] = useState(salon.bankAccountNumber || "50200088991122");
  const [bankIfsc, setBankIfsc] = useState(salon.bankIfsc || "HDFC0001043");
  const [bankName, setBankName] = useState(salon.bankName || "HDFC Bank (Indiranagar Branch)");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Additional salon configs
  const [openTime, setOpenTime] = useState("09:30 AM");
  const [closeTime, setCloseTime] = useState("08:30 PM");
  const [gstRate, setGstRate] = useState("5%");
  const [printerWidth, setPrinterWidth] = useState("80mm (Standard POS)");
  const [autoSendWhatsApp, setAutoSendWhatsApp] = useState(true);
  const [isMetaSignupOpen, setIsMetaSignupOpen] = useState(false);
  const [metaWabaStatus, setMetaWabaStatus] = useState<any>(salon.whatsapp || {
    status: "connected",
    displayNumber: salon.phone,
    verifiedName: salon.name,
    qualityRating: "GREEN",
    phoneNumberId: "10982348911029",
  });

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
      upiId,
      bankAccountName,
      bankAccountNumber,
      bankIfsc,
      bankName,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0D0D0F] border border-[#27272A] p-5 sm:p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#F5C928]/10 border border-[#F5C928]/30 flex items-center justify-center text-[#F5C928] shadow-lg shadow-[#F5C928]/5 shrink-0">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-serif font-bold text-[#F5F4F0] tracking-tight">
                Salon Configuration & Multi-Branch Settings
              </h1>
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-[#171719] text-[#F5C928] border border-[#27272A]">
                Tenant Isolation Active
              </span>
            </div>
            <p className="text-xs text-[#7E8B9C] mt-0.5">
              Brand profile • Tax & GSTIN compliance • WhatsApp Cloud API credentials
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-in fade-in font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Settings Saved!
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Salon Identity (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0D0D0F] border border-[#27272A] p-6 rounded-2xl space-y-4 shadow-xl">
            <h3 className="text-xs font-mono font-bold text-[#A3A3AD] uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-[#27272A]">
              <Building2 className="w-4 h-4 text-[#F5C928]" />
              Salon Identity & Location Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-mono text-[11px] text-[#A3A3AD] block mb-1">Salon Legal Brand Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#111113] border border-[#27272A] rounded-xl text-[#F5F4F0] focus:outline-none focus:border-[#F5C928] font-bold"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] text-[#A3A3AD] block mb-1">Branch / Location Title</label>
                <input
                  type="text"
                  required
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#111113] border border-[#27272A] rounded-xl text-[#F5F4F0] focus:outline-none focus:border-[#F5C928] font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-mono text-[11px] text-[#A3A3AD] block mb-1">Marketing Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#111113] border border-[#27272A] rounded-xl text-[#F5F4F0] focus:outline-none focus:border-[#F5C928]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-mono text-[11px] text-[#A3A3AD] block mb-1">Complete Physical Address</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#111113] border border-[#27272A] rounded-xl text-[#F5F4F0] focus:outline-none focus:border-[#F5C928]"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] text-[#A3A3AD] block mb-1">Official Front-Desk Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#111113] border border-[#27272A] rounded-xl text-[#F5F4F0] focus:outline-none focus:border-[#F5C928] font-mono"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] text-[#A3A3AD] block mb-1">Support / Concierge Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#111113] border border-[#27272A] rounded-xl text-[#F5F4F0] focus:outline-none focus:border-[#F5C928]"
                />
              </div>
            </div>
          </div>

          {/* Tax, GST & Operating Schedule */}
          <div className="bg-[#0D0D0F] border border-[#27272A] p-6 rounded-2xl space-y-4 shadow-xl">
            <h3 className="text-xs font-mono font-bold text-[#A3A3AD] uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-[#27272A]">
              <Clock className="w-4 h-4 text-[#F5C928]" />
              Operating Hours & Tax Configuration
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-mono text-[11px] text-[#A3A3AD] block mb-1">GSTIN Number (Govt. Registered)</label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#111113] border border-[#27272A] rounded-xl text-[#F5F4F0] focus:outline-none focus:border-[#F5C928] font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] text-[#A3A3AD] block mb-1">Applicable Tax Slab</label>
                <select
                  value={gstRate}
                  onChange={(e) => setGstRate(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#111113] border border-[#27272A] rounded-xl text-[#F5F4F0] focus:outline-none focus:border-[#F5C928] font-bold"
                >
                  <option value="5%" className="bg-[#111113] text-[#F5F4F0]">5% GST (Standard Salon Service)</option>
                  <option value="18%" className="bg-[#111113] text-[#F5F4F0]">18% GST (Luxury Wellness / Aesthetics)</option>
                  <option value="0%" className="bg-[#111113] text-[#F5F4F0]">0% Exempt</option>
                </select>
              </div>

              <div>
                <label className="font-mono text-[11px] text-[#A3A3AD] block mb-1">Salon Doors Open</label>
                <input
                  type="text"
                  value={openTime}
                  onChange={(e) => setOpenTime(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#111113] border border-[#27272A] rounded-xl text-[#F5F4F0] focus:outline-none focus:border-[#F5C928] font-mono"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] text-[#A3A3AD] block mb-1">Last Chair Slot Closes</label>
                <input
                  type="text"
                  value={closeTime}
                  onChange={(e) => setCloseTime(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#111113] border border-[#27272A] rounded-xl text-[#F5F4F0] focus:outline-none focus:border-[#F5C928] font-mono"
                />
              </div>
            </div>
          </div>

          {/* UPI ID & Bank Settlement Account Configuration */}
          <div className="bg-[#0D0D0F] border border-[#27272A] p-6 rounded-2xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
              <h3 className="text-xs font-mono font-bold text-[#A3A3AD] uppercase tracking-wider flex items-center gap-2">
                <QrCode className="w-4 h-4 text-emerald-400" />
                Salon UPI ID & Bank Account Settlement
              </h3>
              <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Direct Merchant Settlement
              </span>
            </div>

            <p className="text-xs text-[#7E8B9C] leading-relaxed">
              Configure your salon's primary merchant UPI ID & Bank details. When bills are generated at the POS checkout, dynamic QR codes will automatically lock to this UPI ID for instant customer payments.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="md:col-span-2">
                <label className="font-mono text-[11px] text-[#A3A3AD] block mb-1">
                  Primary Merchant UPI ID / VPA <span className="text-[#F5C928]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. yoursalon@okhdfcbank or 9845011223@paytm"
                    className="w-full px-3.5 py-2.5 bg-[#111113] border border-[#27272A] rounded-xl focus:outline-none focus:border-[#F5C928] font-mono font-bold text-[#F5C928]"
                  />
                  <span className="absolute right-3 top-2 text-[10px] font-mono font-bold text-[#7E8B9C] bg-[#171719] px-2 py-0.5 rounded border border-[#27272A]">
                    NPCI UPI
                  </span>
                </div>
                <span className="text-[11px] text-[#7E8B9C] font-mono mt-1 block">
                  All dynamically generated bill QR codes will route funds directly to this handle.
                </span>
              </div>

              <div>
                <label className="font-mono text-[11px] text-[#A3A3AD] block mb-1">Bank Account Holder Name</label>
                <input
                  type="text"
                  value={bankAccountName}
                  onChange={(e) => setBankAccountName(e.target.value)}
                  placeholder="e.g. BillCare Atelier LLP"
                  className="w-full px-3.5 py-2 bg-[#111113] border border-[#27272A] rounded-xl text-[#F5F4F0] focus:outline-none focus:border-[#F5C928] font-bold"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] text-[#A3A3AD] block mb-1">Bank Account Number</label>
                <input
                  type="text"
                  value={bankAccountNumber}
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                  placeholder="e.g. 50200088991122"
                  className="w-full px-3.5 py-2 bg-[#111113] border border-[#27272A] rounded-xl text-[#F5F4F0] focus:outline-none focus:border-[#F5C928] font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] text-[#A3A3AD] block mb-1">Bank IFSC Code</label>
                <input
                  type="text"
                  value={bankIfsc}
                  onChange={(e) => setBankIfsc(e.target.value)}
                  placeholder="e.g. HDFC0001043"
                  className="w-full px-3.5 py-2 bg-[#111113] border border-[#27272A] rounded-xl text-[#F5C928] focus:outline-none focus:border-[#F5C928] font-mono font-bold uppercase"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] text-[#A3A3AD] block mb-1">Bank Name & Branch</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g. HDFC Bank (Indiranagar Branch)"
                  className="w-full px-3.5 py-2 bg-[#111113] border border-[#27272A] rounded-xl text-[#F5F4F0] focus:outline-none focus:border-[#F5C928] font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Hardware & Automation Badges */}
        <div className="space-y-6">
          {/* WhatsApp Cloud API Status */}
          <div className="bg-[#0D0D0F] border border-[#27272A] p-6 rounded-2xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
              <h3 className="text-xs font-mono font-bold text-[#A3A3AD] uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-400" /> WhatsApp Cloud API
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Connected
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#27272A]">
                <span className="text-[#7E8B9C]">Verified Brand Name:</span>
                <span className="font-bold text-[#F5F4F0]">{metaWabaStatus.verifiedName || salon.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#27272A]">
                <span className="text-[#7E8B9C]">Sender Phone:</span>
                <span className="font-mono text-[#F5F4F0] font-bold">{metaWabaStatus.displayNumber || salon.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#27272A]">
                <span className="text-[#7E8B9C]">Quality Rating:</span>
                <span className="font-bold text-emerald-400 font-mono">HIGH (Tier 2 ✓)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsMetaSignupOpen(true)}
              className="w-full py-2.5 px-3 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Connect Official WhatsApp</span>
            </button>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-[#F5F4F0] pt-1">
              <input
                type="checkbox"
                checked={autoSendWhatsApp}
                onChange={(e) => setAutoSendWhatsApp(e.target.checked)}
                className="rounded text-[#F5C928] focus:ring-[#F5C928]"
              />
              <span>Auto-dispatch receipts & reminders</span>
            </label>
          </div>

          {/* POS Hardware & Printer */}
          <div className="bg-[#0D0D0F] border border-[#27272A] p-6 rounded-2xl space-y-4 shadow-xl">
            <h3 className="text-xs font-mono font-bold text-[#A3A3AD] uppercase tracking-wider flex items-center gap-1.5 pb-3 border-b border-[#27272A]">
              <Printer className="w-4 h-4 text-[#F5C928]" /> POS Hardware & Receipt Format
            </h3>

            <div className="text-xs space-y-3">
              <div>
                <label className="font-mono text-[11px] text-[#A3A3AD] block mb-1">Thermal Paper Roll Width</label>
                <select
                  value={printerWidth}
                  onChange={(e) => setPrinterWidth(e.target.value)}
                  className="w-full px-3 py-2 bg-[#111113] border border-[#27272A] rounded-xl text-[#F5F4F0] focus:outline-none focus:border-[#F5C928] font-bold"
                >
                  <option value="80mm (Standard POS)" className="bg-[#111113] text-[#F5F4F0]">80mm (Standard Countertop POS)</option>
                  <option value="58mm (Mini Bluetooth)" className="bg-[#111113] text-[#F5F4F0]">58mm (Mini Portable Bluetooth)</option>
                  <option value="A4 / A5 (Full Sheet)" className="bg-[#111113] text-[#F5F4F0]">A4 / A5 (Full Laser Invoice)</option>
                </select>
              </div>

              <div className="p-3 bg-[#111113] rounded-xl border border-[#27272A] text-[11px] text-[#7E8B9C] font-mono leading-relaxed">
                ESC/POS Bluetooth & USB thermal printing compatible without drivers.
              </div>
            </div>
          </div>

          {/* Save / Reset Actions */}
          <div className="space-y-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-[#F5C928] hover:bg-[#f7d348] text-[#080809] font-bold text-xs rounded-xl shadow-lg shadow-[#F5C928]/10 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Salon Preferences
            </button>

            <button
              type="button"
              onClick={resetDemoData}
              className="w-full py-2.5 px-4 bg-[#171719] hover:bg-[#27272A] border border-[#27272A] text-[#7E8B9C] hover:text-rose-400 font-mono text-xs rounded-xl transition-all cursor-pointer"
            >
              Reset to Factory Baseline
            </button>
          </div>
        </div>
      </form>

      {/* Meta WhatsApp Embedded Signup Modal */}
      <MetaEmbeddedSignupModal
        isOpen={isMetaSignupOpen}
        onClose={() => setIsMetaSignupOpen(false)}
        salonName={salon.name}
        salonPhone={salon.phone}
        onSuccess={(updatedSalon) => {
          if (updatedSalon?.whatsapp) {
            setMetaWabaStatus(updatedSalon.whatsapp);
          }
          setIsMetaSignupOpen(false);
        }}
      />
    </div>
  );
}
