"use client";

import React, { useState } from "react";
import { useBillCare } from "@/lib/billcare-context";
import { formatCurrency } from "@/lib/utils";
import { CustomerProfile } from "@/lib/types";
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
  const { customers, invoices, addCustomer, updateCustomer } = useBillCare();

  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("All");
  const [selectedCustomerForModal, setSelectedCustomerForModal] =
    useState<any>(null);
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

  const handleWhatsAppClick = (c: any) => {
    const text = encodeURIComponent(
      `Hi ${c.name}! ✨ From BillCare: We hope you are loving your look! Your stylist ${c.preferredStaff || "specialist"} wanted to check in. Would you like to reserve a chair for your next visit?`
    );
    const cleanPhone = c.phone.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Metrics */}
      <div className="bg-[#0D0D0F] border border-[#27272A] p-5 sm:p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#F5C928]/10 border border-[#F5C928]/30 flex items-center justify-center text-[#F5C928] shadow-lg shadow-[#F5C928]/5 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-serif font-bold text-[#F5F4F0] tracking-tight">
                Client CRM & Formula Registry
              </h1>
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-[#171719] text-[#F5C928] border border-[#27272A]">
                {customers.length} Clients
              </span>
            </div>
            <p className="text-xs text-[#7E8B9C] mt-0.5">
              Technical hair/skin formula cards • Lifetime value tracking • Patch test safety records
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#F5C928] hover:bg-[#f7d348] text-[#080809] font-bold text-xs rounded-xl shadow-lg shadow-[#F5C928]/10 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add New Client
          </button>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#111113] border border-[#27272A] p-4 rounded-xl">
          <span className="text-[10px] font-mono font-bold text-[#7E8B9C] uppercase tracking-wider block">
            Client Lifetime Spend
          </span>
          <span className="text-lg font-mono font-bold text-[#F5C928] mt-1 block">
            {formatCurrency(totalLifetimeValue)}
          </span>
        </div>
        <div className="bg-[#111113] border border-[#27272A] p-4 rounded-xl">
          <span className="text-[10px] font-mono font-bold text-[#7E8B9C] uppercase tracking-wider block">
            VIP Diamond Tiers
          </span>
          <span className="text-lg font-mono font-bold text-[#F5C928] mt-1 block">
            {vipCount} VIP Clients
          </span>
        </div>
        <div className="bg-[#111113] border border-[#27272A] p-4 rounded-xl">
          <span className="text-[10px] font-mono font-bold text-[#7E8B9C] uppercase tracking-wider block">
            Average Chair Visits
          </span>
          <span className="text-lg font-mono font-bold text-[#F5F4F0] mt-1 block">
            {avgVisits} visits / client
          </span>
        </div>
        <div className="bg-[#111113] border border-[#27272A] p-4 rounded-xl">
          <span className="text-[10px] font-mono font-bold text-[#7E8B9C] uppercase tracking-wider block">
            Patch Test Safety Rate
          </span>
          <span className="text-lg font-mono font-bold text-emerald-400 mt-1 block">
            100% Certified
          </span>
        </div>
      </div>

      {/* Search & Tier Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7E8B9C]" />
          <input
            type="text"
            placeholder="Search by name, phone (+91) or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#111113] border border-[#27272A] rounded-xl text-[#F5F4F0] placeholder-[#7E8B9C] focus:outline-none focus:border-[#F5C928] font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
          {["All", "VIP", "Gold VIP", "Silver Regular", "At-Risk"].map((tier) => (
            <button
              key={tier}
              onClick={() => setTierFilter(tier)}
              className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all border ${
                tierFilter === tier
                  ? "bg-[#F5C928] text-[#080809] border-[#F5C928] shadow-sm"
                  : "bg-[#111113] text-[#A3A3AD] border-[#27272A] hover:text-[#F5F4F0]"
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Client Cards Grid */}
      {filteredCustomers.length === 0 ? (
        <div className="bg-[#0D0D0F] border border-[#27272A] p-12 rounded-2xl text-center space-y-4 max-w-md mx-auto shadow-xl">
          <div className="w-16 h-16 rounded-full bg-[#171719] border border-[#27272A] text-[#F5C928] flex items-center justify-center mx-auto">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-[#F5F4F0]">No Clients Found</h3>
            <p className="text-xs text-[#7E8B9C] mt-1">
              No salon clients match "{searchQuery}" with tier filter "{tierFilter}".
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 pt-1">
            <button
              onClick={() => {
                setSearchQuery("");
                setTierFilter("All");
              }}
              className="px-4 py-2 bg-[#171719] hover:bg-[#27272A] border border-[#27272A] text-[#F5F4F0] font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Reset Filters
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-[#F5C928] hover:bg-[#f7d348] text-[#080809] font-bold text-xs rounded-xl shadow-xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add New Client
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((cust) => (
            <div
              key={cust.id}
              className="bg-[#111113] border border-[#27272A] rounded-xl p-5 flex flex-col justify-between hover:border-[#F5C928]/50 hover:bg-[#171719] transition-all shadow-lg"
            >
              <div>
                {/* Header with VIP Pill & Initials */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#171719] border border-[#27272A] text-[#F5C928] font-bold text-sm flex items-center justify-center shadow-md font-mono">
                      {cust.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#F5F4F0] text-sm leading-tight">
                        {cust.name}
                      </h3>
                      <p className="text-xs text-[#7E8B9C] font-mono mt-0.5">{cust.phone}</p>
                    </div>
                  </div>

                  <span
                    className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 bg-[#171719] text-[#F5C928] border border-[#27272A]"
                  >
                    <Crown className="w-3 h-3 fill-current text-[#F5C928]" />
                    {cust.vipTier || "Gold VIP"}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {cust.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-[#171719] text-[#A3A3AD] border border-[#27272A]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Spend Metrics & Preferred Stylist */}
                <div className="mt-4 pt-3 border-t border-[#27272A] grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-[#0D0D0F] border border-[#27272A] p-2 rounded-lg">
                    <span className="text-[10px] text-[#7E8B9C] font-mono uppercase block">SPENT</span>
                    <span className="font-bold text-[#F5C928] font-mono text-xs">
                      {formatCurrency(cust.totalSpent)}
                    </span>
                  </div>
                  <div className="bg-[#0D0D0F] border border-[#27272A] p-2 rounded-lg">
                    <span className="text-[10px] text-[#7E8B9C] font-mono uppercase block">VISITS</span>
                    <span className="font-bold text-[#F5F4F0] font-mono text-xs">{cust.visitsCount}x</span>
                  </div>
                  <div className="bg-[#0D0D0F] border border-[#27272A] p-2 rounded-lg">
                    <span className="text-[10px] text-[#7E8B9C] font-mono uppercase block">POINTS</span>
                    <span className="font-bold text-[#F5C928] font-mono text-xs">{cust.loyaltyPoints}</span>
                  </div>
                </div>

                {/* Technical Formula Snippet */}
                {cust.formulaNotes && (
                  <div className="mt-3 p-2.5 bg-[#0D0D0F] rounded-lg border border-[#27272A] text-[11px]">
                    <span className="font-mono text-[#F5C928] flex items-center gap-1 font-bold">
                      <Sparkles className="w-3 h-3 text-[#F5C928]" /> Formula:
                    </span>
                    <p className="text-[#A3A3AD] line-clamp-1 mt-0.5 font-mono">{cust.formulaNotes}</p>
                  </div>
                )}
              </div>

              {/* Actions Bar */}
              <div className="mt-4 pt-3 border-t border-[#27272A] flex items-center justify-between gap-2 text-xs">
                <button
                  onClick={() => setSelectedCustomerForModal(cust)}
                  className="inline-flex items-center gap-1 font-bold text-[#F5C928] hover:underline cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Full Formula
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleWhatsAppClick(cust)}
                    className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors cursor-pointer"
                    title="WhatsApp Client"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>

                  {onGoToBooking && (
                    <button
                      onClick={() => onGoToBooking(cust.name, cust.phone)}
                      className="px-2.5 py-1.5 bg-[#171719] hover:bg-[#27272A] border border-[#27272A] text-[#F5F4F0] rounded-lg text-[11px] font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                    >
                      <Calendar className="w-3 h-3" /> Book
                    </button>
                  )}

                  {onGoToPos && (
                    <button
                      onClick={() => onGoToPos(cust.id)}
                      className="px-2.5 py-1.5 bg-[#F5C928] hover:bg-[#f7d348] text-[#080809] rounded-lg text-[11px] font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                    >
                      <Receipt className="w-3 h-3" /> Bill
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-[#0D0D0F] border border-[#27272A] rounded-2xl shadow-2xl p-6 w-full max-w-md animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
              <h3 className="font-serif font-bold text-[#F5F4F0] text-base">
                Create Client Profile & Technical Record
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#7E8B9C] hover:text-[#F5F4F0] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-mono text-[11px] text-[#A3A3AD] block mb-1">Full Client Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shalini Roy"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#111113] border border-[#27272A] rounded-xl text-[#F5F4F0] focus:outline-none focus:border-[#F5C928] font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-mono text-[11px] text-[#A3A3AD] block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#111113] border border-[#27272A] rounded-xl text-[#F5F4F0] focus:outline-none focus:border-[#F5C928] font-mono"
                  />
                </div>
                <div>
                  <label className="font-mono text-[11px] text-[#A3A3AD] block mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="client@mail.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#111113] border border-[#27272A] rounded-xl text-[#F5F4F0] focus:outline-none focus:border-[#F5C928] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-[11px] text-[#A3A3AD] block mb-1">Preferred Stylist</label>
                <input
                  type="text"
                  placeholder="e.g. Priya Sharma"
                  value={newPreferredStaff}
                  onChange={(e) => setNewPreferredStaff(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#111113] border border-[#27272A] rounded-xl text-[#F5F4F0] focus:outline-none focus:border-[#F5C928] font-medium"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] text-[#A3A3AD] block mb-1">
                  Initial Technical Formula / Color Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Wella KP 6/1 + 20 Vol • Sensitive scalp"
                  value={newFormula}
                  onChange={(e) => setNewFormula(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#111113] border border-[#27272A] rounded-xl text-[#F5F4F0] focus:outline-none focus:border-[#F5C928] font-mono text-[11px]"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-[#171719] text-[#A3A3AD] hover:text-[#F5F4F0] font-bold rounded-xl border border-[#27272A] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#F5C928] hover:bg-[#f7d348] text-[#080809] font-bold rounded-xl shadow-md shadow-[#F5C928]/10 cursor-pointer"
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
