"use client";

import React, { useState } from "react";
import { useDemo } from "@/lib/demo-context";
import { formatCurrency } from "@/lib/utils";
import { FollowUpCampaign, CustomerProfile } from "@/lib/demo-data";
import {
  MessageSquare,
  Sparkles,
  Send,
  CheckCircle2,
  Clock,
  Heart,
  Gift,
  RefreshCw,
  Search,
  User,
  Star,
  Phone,
  ShieldCheck,
  Calendar,
  Check,
  Tag,
  ArrowRight,
  TrendingUp,
  X,
  Crown,
  Smartphone,
  CheckCheck,
} from "lucide-react";

export function CrmFollowupsView() {
  const { customers, followUps, sendFollowUp, createFollowUp, salon } = useDemo();

  const [activeTab, setActiveTab] = useState<"campaigns" | "clients">("campaigns");
  const [selectedFollowUp, setSelectedFollowUp] = useState<FollowUpCampaign>(followUps[0]);
  const [customDraft, setCustomDraft] = useState<string>(followUps[0]?.suggestedMessage || "");
  const [clientSearch, setClientSearch] = useState<string>("");
  const [sentSuccessFeedback, setSentSuccessFeedback] = useState<boolean>(false);

  // New follow-up modal
  const [showNewModal, setShowNewModal] = useState<boolean>(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || "");
  const [campaignType, setCampaignType] = useState<FollowUpCampaign["campaignType"]>("24h_feedback");
  const [discountOffer, setDiscountOffer] = useState<string>("10% Privilege Voucher");
  const [messageTemplate, setMessageTemplate] = useState<string>(
    "Hi {name}! ✨ We hope you loved your pampering at Luxe Haven. Reply to this WhatsApp to claim your special reward!"
  );

  const pendingCount = followUps.filter((f) => f.status === "Pending").length;
  const sentCount = followUps.filter((f) => f.status === "Sent" || f.status === "Delivered").length;

  const handleSelectCampaign = (campaign: FollowUpCampaign) => {
    setSelectedFollowUp(campaign);
    setCustomDraft(campaign.suggestedMessage);
    setSentSuccessFeedback(false);
  };

  const handleSendCampaign = () => {
    if (!selectedFollowUp) return;
    sendFollowUp(selectedFollowUp.id);
    setSentSuccessFeedback(true);
    setTimeout(() => setSentSuccessFeedback(false), 4000);
  };

  const insertSmartTag = (tag: string) => {
    setCustomDraft((prev) => prev + " " + tag);
  };

  const handleCreateNewCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === selectedCustomerId);
    if (!cust) return;

    createFollowUp({
      customerId: cust.id,
      customerName: cust.name,
      customerPhone: cust.phone,
      campaignType,
      scheduledFor: "Scheduled for Today",
      serviceTrigger: "Manual Engagement Trigger",
      suggestedMessage: messageTemplate.replace("{name}", cust.name),
      discountOffer,
    });

    setShowNewModal(false);
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.phone.includes(clientSearch) ||
      c.tags.some((t) => t.toLowerCase().includes(clientSearch.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="luxury-card p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-600/25 border border-white/20">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Customer Follow-ups & WhatsApp Retention Engine
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Meta Cloud API
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated post-service reviews • Color refresh reminders • Inactive client re-activation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80">
            <button
              onClick={() => setActiveTab("campaigns")}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === "campaigns"
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Retention Triggers ({pendingCount})
            </button>
            <button
              onClick={() => setActiveTab("clients")}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === "clients"
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              VIP Client Directory ({customers.length})
            </button>
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" /> + New Trigger
          </button>
        </div>
      </div>

      {activeTab === "campaigns" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Scheduled Trigger Queue */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                Scheduled Retention Triggers ({followUps.length})
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                <b className="text-slate-900">{pendingCount}</b> pending dispatch • <b className="text-emerald-700">{sentCount}</b> sent
              </span>
            </div>

            <div className="space-y-3">
              {followUps.map((campaign) => {
                const isSelected = selectedFollowUp?.id === campaign.id;
                const isSent = campaign.status === "Sent" || campaign.status === "Delivered";

                return (
                  <div
                    key={campaign.id}
                    onClick={() => handleSelectCampaign(campaign)}
                    className={`luxury-card p-5 rounded-3xl transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg bg-emerald-50/20"
                        : "hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`p-2 rounded-xl text-xs ${
                              campaign.campaignType === "24h_feedback"
                                ? "bg-blue-100 text-blue-800"
                                : campaign.campaignType === "color_touchup"
                                ? "bg-purple-100 text-purple-800"
                                : campaign.campaignType === "win_back"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {campaign.campaignType === "24h_feedback" && <Star className="w-4 h-4 fill-blue-800" />}
                            {campaign.campaignType === "color_touchup" && <RefreshCw className="w-4 h-4" />}
                            {campaign.campaignType === "win_back" && <Clock className="w-4 h-4" />}
                            {campaign.campaignType === "birthday_offer" && <Gift className="w-4 h-4" />}
                          </span>

                          <div>
                            <span className="text-xs font-black text-slate-900 tracking-tight">
                              {campaign.campaignType === "24h_feedback" && "24h Post-Care & Google Review Request"}
                              {campaign.campaignType === "color_touchup" && "21-Day Refresh & Root Touch-up"}
                              {campaign.campaignType === "win_back" && "45-Day Inactive Win-Back Alert"}
                              {campaign.campaignType === "birthday_offer" && "Celebration Glamour Voucher"}
                            </span>
                            <span className="text-[10px] text-slate-400 block font-medium">
                              Triggered by: {campaign.serviceTrigger}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            isSent
                              ? "bg-emerald-100 text-emerald-800 flex items-center gap-1"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {isSent && <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />}
                          {campaign.status}
                        </span>
                      </div>

                      <div className="mt-3.5 flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-900">{campaign.customerName}</h4>
                          <p className="text-xs text-slate-500 font-mono">{campaign.customerPhone}</p>
                        </div>
                        {campaign.discountOffer && (
                          <span className="text-[11px] font-black text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                            🎁 {campaign.discountOffer}
                          </span>
                        )}
                      </div>

                      <div className="mt-3 bg-slate-50/80 p-3 rounded-2xl border border-slate-100 text-xs text-slate-600 line-clamp-2 italic leading-relaxed">
                        "{campaign.suggestedMessage}"
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> {campaign.scheduledFor}
                      </span>
                      <span className="font-extrabold text-emerald-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Preview WhatsApp & Dispatch <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: AMOLED Smartphone Mockup */}
          <div className="lg:col-span-5 space-y-4">
            <div className="luxury-card rounded-3xl p-6 space-y-5 shadow-xl border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-600" /> Meta Cloud Simulator
                </h3>
                <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Verified Green Badge
                </span>
              </div>

              {/* iPhone 16 AMOLED Frame */}
              <div className="rounded-[2.2rem] overflow-hidden border-4 border-slate-950 shadow-2xl bg-[#0b141a] relative">
                {/* Dynamic Island Speaker pill */}
                <div className="bg-slate-950 h-5 w-28 mx-auto rounded-b-xl flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800"></div>
                </div>

                {/* WhatsApp Chat Top Bar */}
                <div className="bg-[#202c33] text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={salon.logo}
                        alt="Salon Avatar"
                        className="w-9 h-9 rounded-full object-cover border border-slate-700"
                      />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute bottom-0 right-0 border-2 border-[#202c33]"></span>
                    </div>
                    <div>
                      <div className="text-xs font-extrabold flex items-center gap-1 text-white">
                        {salon.name.slice(0, 22)}...
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium">Official Concierge Account</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">Encrypted</span>
                </div>

                {/* Chat Background & Message Bubbles */}
                <div
                  className="p-5 space-y-3 min-h-[280px] flex flex-col justify-end"
                  style={{
                    backgroundColor: "#0b141a",
                    backgroundImage: `radial-gradient(#1e293b 1px, transparent 1px)`,
                    backgroundSize: "16px 16px",
                  }}
                >
                  <div className="mx-auto bg-[#182229] text-[#8696a0] text-[10px] px-3 py-1 rounded-lg text-center max-w-[260px] font-medium">
                    🔒 Messages are verified by Meta WhatsApp Business API
                  </div>

                  {/* Outgoing WhatsApp Bubble */}
                  <div className="self-end bg-[#005c4b] text-white p-4 rounded-2xl rounded-tr-none max-w-[92%] shadow-lg text-xs space-y-2">
                    <p className="whitespace-pre-line leading-relaxed text-[12px] font-sans">
                      {customDraft}
                    </p>

                    <div className="flex items-center justify-end gap-1.5 text-[10px] text-[#8696a0] pt-1 font-mono">
                      <span>Just now</span>
                      <CheckCheck className="w-3.5 h-3.5 text-sky-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Tag Insertion Bar */}
              <div>
                <span className="text-[11px] font-extrabold text-slate-600 block mb-1.5 uppercase tracking-wider">
                  Insert Personalization Tokens:
                </span>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  <button
                    onClick={() => insertSmartTag("{name}")}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold"
                  >
                    + {"{name}"}
                  </button>
                  <button
                    onClick={() => insertSmartTag("{stylist}")}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold"
                  >
                    + {"{stylist}"}
                  </button>
                  <button
                    onClick={() => insertSmartTag("https://luxehaven.in/book")}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold"
                  >
                    + {"{booking_link}"}
                  </button>
                </div>
              </div>

              {/* Editable Draft Area */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Customize Message Content:
                </label>
                <textarea
                  rows={4}
                  value={customDraft}
                  onChange={(e) => setCustomDraft(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-800 leading-relaxed font-sans"
                />
              </div>

              {/* Action Trigger Button */}
              <div>
                <button
                  onClick={handleSendCampaign}
                  disabled={selectedFollowUp?.status === "Sent"}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-60 text-white font-extrabold text-xs rounded-2xl shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <Send className="w-4 h-4" />
                  {selectedFollowUp?.status === "Sent"
                    ? "✓ Follow-up Dispatched via Meta API"
                    : `Send WhatsApp to ${selectedFollowUp?.customerName}`}
                </button>

                {sentSuccessFeedback && (
                  <div className="mt-2.5 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-center text-xs text-emerald-800 font-extrabold animate-in fade-in">
                    🚀 Dispatch verified! Status updated in CRM database.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Client Directory Tab */
        <div className="luxury-card rounded-3xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">VIP & Loyal Customer Directory</h3>
              <p className="text-xs text-slate-500">Tier status, lifetime spend & stylist preferences</p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search clients by name, tag or phone..."
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none font-medium"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Client Name</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Visits & Lifetime Spend</th>
                  <th className="py-3.5 px-4">Loyalty Tier</th>
                  <th className="py-3.5 px-4">Preferred Artist</th>
                  <th className="py-3.5 px-4">Client Tags</th>
                  <th className="py-3.5 px-4">Concierge Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-blue-600" />
                        {cust.name}
                      </div>
                      <span className="text-[11px] text-slate-400">{cust.gender}</span>
                    </td>

                    <td className="py-4 px-4 text-slate-600">
                      <div className="font-mono font-medium">{cust.phone}</div>
                      <span className="text-[11px] text-slate-400">{cust.email}</span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-extrabold text-slate-900 font-mono">{formatCurrency(cust.totalSpent)}</div>
                      <span className="text-[11px] text-slate-500">{cust.visitsCount} salon visits</span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1 w-fit">
                        <Crown className="w-3 h-3 text-amber-600 fill-amber-600" />
                        {cust.loyaltyPoints} Pts
                      </span>
                    </td>

                    <td className="py-4 px-4 font-bold text-indigo-700">{cust.preferredStaff}</td>

                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {cust.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-700"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-500 max-w-xs truncate italic">
                      "{cust.notes}"
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Follow-up Campaign Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 w-full max-w-md animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">Schedule Retention Trigger</h3>
              <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewCampaign} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Client</label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold text-slate-800"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone}) - {c.lastService}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Trigger Objective</label>
                <select
                  value={campaignType}
                  onChange={(e: any) => setCampaignType(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold"
                >
                  <option value="24h_feedback">24h Post-Care & Google Review Request</option>
                  <option value="color_touchup">Color & Keratin Touch-up Reminder</option>
                  <option value="win_back">45-Day Win-Back Re-activation</option>
                  <option value="birthday_offer">Birthday Celebration Special</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Attached Privilege Offer</label>
                <input
                  type="text"
                  value={discountOffer}
                  onChange={(e) => setDiscountOffer(e.target.value)}
                  placeholder="e.g. 15% VIP code or Free Treatment"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Message Body</label>
                <textarea
                  rows={3}
                  value={messageTemplate}
                  onChange={(e) => setMessageTemplate(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none leading-relaxed font-sans"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md shadow-emerald-600/20"
                >
                  Schedule Trigger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
