"use client";

import React, { useState } from "react";
import { useDemo } from "@/lib/demo-context";
import { formatCurrency } from "@/lib/utils";
import { CustomerProfile } from "@/lib/demo-data";
import { ClientFormulaModal } from "./client-formula-modal";
import {
  Users,
  Search,
  Plus,
  Crown,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  Receipt,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  Tag,
  Clock,
  Send,
  X,
  Filter,
} from "lucide-react";

interface CustomersViewProps {
  onGoToPos?: (customerId: string) => void;
  onGoToBooking?: (customerName: string, customerPhone: string) => void;
}

export function CustomersView({ onGoToPos, onGoToBooking }: CustomersViewProps) {
  const { customers, invoices, addCustomer, updateCustomer } = useDemo();

  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("All");
  const [selectedCustomerForModal, setSelectedCustomerForModal] =
    useState<CustomerProfile | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New customer form state
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("+91 ");
  const [newEmail, setNewEmail] = useState("");
  const [newGender, setNewGender] = useState<"Female" | "Male" | "Other">("Female");
  const [newPreferredStaff, setNewPreferredStaff] = useState("Priya Sharma");
  const [newNotes, setNewNotes] = useState("");
  const [newFormula, setNewFormula] = useState("");

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTier =
      tierFilter === "All" ||
      (tierFilter === "VIP" && c.vipTier?.includes("VIP")) ||
      (tierFilter === "At-Risk" && c.tags.includes("At-Risk Inactive")) ||
      c.vipTier === tierFilter;

    return matchesSearch && matchesTier;
  });

  const totalLifetimeValue = customers.reduce((acc, c) => acc + c.totalSpent, 0);
  const vipCount = customers.filter((c) => c.vipTier?.includes("VIP")).length;
  const avgVisits = Math.round(
    customers.reduce((acc, c) => acc + c.visitsCount, 0) / (customers.length || 1)
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomer({
      name: newName,
      phone: newPhone,
      email: newEmail || `${newName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      gender: newGender,
      lastService: "Consultation & Bespoke Styling",
      preferredStaff: newPreferredStaff,
      tags: ["New Client", "First Visit"],
      notes: newNotes || "Consultation in progress.",
      vipTier: "Silver Regular",
      formulaNotes: newFormula || "Initial consultation pending.",
      patchTestStatus: "Valid",
      patchTestDate: new Date().toISOString().split("T")[0],
      rebookingCadenceDays: 30,
    });

    setShowAddModal(false);
    setNewName("");
    setNewPhone("+91 ");
    setNewEmail("");
    setNewNotes("");
    setNewFormula("");
  };

  const handleWhatsAppClick = (c: CustomerProfile) => {
    const text = encodeURIComponent(
      `Hi ${c.name}! ✨ From Luxe Haven Salon: We hope you are loving your hair! Your stylist ${c.preferredStaff} wanted to check in. Would you like to reserve a chair for your next visit?`
    );
    const cleanPhone = c.phone.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Metrics */}
      <div className="luxury-card p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/25 border border-white/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Client 360° CRM & Formula Registry
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                {customers.length} Clients
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Technical hair/skin formula cards • Lifetime value tracking • Patch test safety records
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-purple-500/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Add New Client
          </button>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="luxury-card p-4 rounded-2xl border-slate-200/80">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Client Lifetime Spend
          </span>
          <span className="text-lg font-black text-slate-900 font-mono mt-1 block">
            {formatCurrency(totalLifetimeValue)}
          </span>
        </div>
        <div className="luxury-card p-4 rounded-2xl border-slate-200/80">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            VIP Diamond Tiers
          </span>
          <span className="text-lg font-black text-purple-600 font-mono mt-1 block">
            {vipCount} VIP Clients
          </span>
        </div>
        <div className="luxury-card p-4 rounded-2xl border-slate-200/80">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Average Chair Visits
          </span>
          <span className="text-lg font-black text-blue-600 font-mono mt-1 block">
            {avgVisits} visits / client
          </span>
        </div>
        <div className="luxury-card p-4 rounded-2xl border-slate-200/80">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Patch Test Safety Rate
          </span>
          <span className="text-lg font-black text-emerald-600 font-mono mt-1 block">
            100% Certified
          </span>
        </div>
      </div>

      {/* Search & Tier Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, phone (+91) or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
          {["All", "VIP", "Gold VIP", "Silver Regular", "At-Risk"].map((tier) => (
            <button
              key={tier}
              onClick={() => setTierFilter(tier)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border ${
                tierFilter === tier
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Client Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((cust) => (
          <div
            key={cust.id}
            className="luxury-card rounded-3xl p-5 flex flex-col justify-between hover:border-purple-300 hover:shadow-xl transition-all"
          >
            <div>
              {/* Header with VIP Pill & Initials */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-md shadow-purple-500/20">
                    {cust.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm leading-tight">
                      {cust.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">{cust.phone}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    cust.vipTier?.includes("Platinum")
                      ? "bg-amber-100 text-amber-800 border border-amber-200"
                      : "bg-purple-50 text-purple-700 border border-purple-200"
                  }`}
                >
                  <Crown className="w-3 h-3 fill-current" />
                  {cust.vipTier || "Gold VIP"}
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mt-3">
                {cust.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Spend Metrics & Preferred Stylist */}
              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-50 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold block">SPENT</span>
                  <span className="font-black text-slate-900 font-mono">
                    {formatCurrency(cust.totalSpent)}
                  </span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold block">VISITS</span>
                  <span className="font-black text-slate-900 font-mono">{cust.visitsCount}x</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold block">POINTS</span>
                  <span className="font-black text-purple-600 font-mono">{cust.loyaltyPoints}</span>
                </div>
              </div>

              {/* Technical Formula Snippet */}
              {cust.formulaNotes && (
                <div className="mt-3 p-2.5 bg-purple-50/50 rounded-xl border border-purple-100/70 text-[11px]">
                  <span className="font-bold text-purple-900 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-purple-600" /> Technical Formula:
                  </span>
                  <p className="text-slate-600 line-clamp-1 mt-0.5 font-mono">{cust.formulaNotes}</p>
                </div>
              )}
            </div>

            {/* Actions Bar */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
              <button
                onClick={() => setSelectedCustomerForModal(cust)}
                className="inline-flex items-center gap-1 font-extrabold text-purple-700 hover:text-purple-900 hover:underline"
              >
                <Sparkles className="w-3.5 h-3.5" /> Full Formula
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleWhatsAppClick(cust)}
                  className="p-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                  title="WhatsApp Client"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>

                {onGoToBooking && (
                  <button
                    onClick={() => onGoToBooking(cust.name, cust.phone)}
                    className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[11px] font-bold transition-all shadow-sm flex items-center gap-1"
                  >
                    <Calendar className="w-3 h-3" /> Book
                  </button>
                )}

                {onGoToPos && (
                  <button
                    onClick={() => onGoToPos(cust.id)}
                    className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-bold transition-all shadow-sm flex items-center gap-1"
                  >
                    <Receipt className="w-3 h-3" /> Bill
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 360 Client Technical Formula Modal */}
      {selectedCustomerForModal && (
        <ClientFormulaModal
          customer={selectedCustomerForModal}
          invoices={invoices}
          onClose={() => setSelectedCustomerForModal(null)}
          onUpdateFormula={(cid, newFormula) => {
            updateCustomer(cid, { formulaNotes: newFormula });
          }}
        />
      )}

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 w-full max-w-md animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">
                Create Client Profile & Technical Record
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Client Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shalini Roy"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="client@mail.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Preferred Stylist</label>
                <input
                  type="text"
                  placeholder="e.g. Priya Sharma"
                  value={newPreferredStaff}
                  onChange={(e) => setNewPreferredStaff(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Initial Technical Formula / Color Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Wella KP 6/1 + 20 Vol • Sensitive scalp"
                  value={newFormula}
                  onChange={(e) => setNewFormula(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-mono text-[11px]"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-600 text-white font-extrabold rounded-xl shadow-md shadow-purple-500/20"
                >
                  Create Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
