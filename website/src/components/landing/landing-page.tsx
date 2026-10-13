"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useDemo } from "@/lib/demo-context";
import { formatCurrency } from "@/lib/utils";
import {
  Calendar,
  Receipt,
  Users,
  MessageSquare,
  Boxes,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  Clock,
  Check,
  Building2,
  Scissors,
  Globe,
  DollarSign,
  Send,
  HelpCircle,
  Sparkles,
} from "lucide-react";

export function LandingPage() {
  const { salon, showToast } = useDemo();

  // Interactive Sandbox Tab State
  const [activePreviewTab, setActivePreviewTab] = useState<"pos" | "calendar" | "whatsapp" | "formula">("pos");

  // POS Sandbox State
  const [posDiscount, setPosDiscount] = useState<number>(10);
  const [posPaymentMethod, setPosPaymentMethod] = useState<"UPI" | "Card" | "Cash">("UPI");
  const [posReceiptShown, setPosReceiptShown] = useState<boolean>(false);

  // WhatsApp Sandbox State
  const [waSent, setWaSent] = useState<boolean>(false);

  // ROI Calculator State
  const [chairsCount, setChairsCount] = useState<number>(6);
  const [avgTicket, setAvgTicket] = useState<number>(1850);
  const [clientsPerChairDay, setClientsPerChairDay] = useState<number>(5);

  // Pricing Interval
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // ROI Calculations
  const dailyTurnover = chairsCount * avgTicket * clientsPerChairDay;
  const monthlyTurnover = dailyTurnover * 26;
  const recoveredViaWhatsApp = Math.round(monthlyTurnover * 0.22);
  const hoursSavedPerMonth = chairsCount * 7;

  const handleSendWhatsAppTest = () => {
    setWaSent(true);
    showToast("Sent simulated WhatsApp booking reminder to client Ananya");
    setTimeout(() => setWaSent(false), 5000);
  };

  const faqs = [
    {
      q: "How does RUVEXI differ from marketplace aggregators like Fresha?",
      a: "Marketplace platforms charge up to 20% commission on repeat clients and display competitor salons when customers search for you. RUVEXI operates on a pure software model with 0% transaction fees. You receive your own dedicated booking domain, direct customer relationships, and complete data privacy.",
    },
    {
      q: "Can stylists access their own chairs without viewing salon financials?",
      a: "Yes. Role-based permissions allow master stylists and assistants to view only their personal schedule, client formulas, and commission earnings. Financial statements, gross revenue, and inventory costs remain restricted to salon owners and managers.",
    },
    {
      q: "Does the Point of Sale integrate with thermal printers and barcode scanners?",
      a: "Yes. The POS works with standard 80mm and 58mm ESC/POS thermal printers, USB and Bluetooth barcode scanners, and can automatically dispatch digital WhatsApp receipts with full GST details directly to client phones.",
    },
    {
      q: "How does automated WhatsApp client retention work?",
      a: "RUVEXI integrates directly with the Meta WhatsApp Cloud API. The platform tracks service intervals and automatically schedules reminders for 28-day root touch-ups, seasonal keratin refreshers, and birthday loyalty benefits without manual staff effort.",
    },
    {
      q: "Can we migrate our existing customer data, formulas, and service menu?",
      a: "Yes. You can import client history, notes, and inventory via Excel or CSV. Our onboarding concierge also assists with hands-on migration to ensure zero downtime for your studio.",
    },
    {
      q: "What happens if our salon loses internet connectivity temporarily?",
      a: "RUVEXI is built as an offline-resilient Progressive Web App. You can continue creating appointments, ringing up cash checkouts, and viewing client cards. All records synchronize automatically once your connection resumes.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf9f6] text-slate-800 font-sans selection:bg-slate-900 selection:text-white">
      {/* Main Luxury Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                R
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg tracking-tight text-slate-950">
                    RUVEXI
                  </span>
                  <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-950 text-white uppercase tracking-wider shadow-xs">
                    SALON OS
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-semibold">
                  The Management System for Modern Studios
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold text-slate-600">
              <a href="#features" className="hover:text-slate-950 transition-colors">
                Platform
              </a>
              <a href="#sandbox" className="hover:text-slate-950 transition-colors">
                Live Preview
              </a>
              <a href="#roi-calculator" className="hover:text-slate-950 transition-colors">
                Revenue Model
              </a>
              <a href="#comparison" className="hover:text-slate-950 transition-colors">
                Why RUVEXI
              </a>
              <a href="#pricing" className="hover:text-slate-950 transition-colors">
                Pricing
              </a>
              <a href="#faq" className="hover:text-slate-950 transition-colors">
                FAQ
              </a>
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-xs font-bold text-slate-700 hover:text-slate-950 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>Launch Live Demo</span>
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 px-4 sm:px-6 lg:px-8 border-b border-slate-200/70">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Easy for Receptionists & Stylists</span>
            <span className="text-slate-300">•</span>
            <span>Zero Training Needed</span>
            <span className="text-slate-300">•</span>
            <span>0% Commission Fees</span>
          </div>

          {/* Master Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-950 leading-[1.12]">
            Simple Salon Software for Modern Salons & Spas
          </h1>

          {/* Subheading */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Manage your daily appointments, seat walk-ins, create fast bills, and send WhatsApp receipts — all in one simple, easy screen that anyone can learn in minutes.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-3">
            <Link
              href="/dashboard"
              className="px-6 py-3.5 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <span>Try Receptionist Counter</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/signup"
              className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs sm:text-sm rounded-xl border border-slate-300 shadow-2xs transition-all"
            >
              Start Free 14-Day Trial
            </Link>

            <Link
              href="/book"
              className="px-5 py-3.5 text-slate-700 hover:text-slate-950 font-bold text-xs sm:text-sm rounded-xl hover:bg-slate-100 transition-all flex items-center gap-1.5"
            >
              <Globe className="w-4 h-4 text-slate-500" />
              <span>Client Booking Page</span>
            </Link>
          </div>

          {/* Proof Numbers */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-3xl mx-auto text-left">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs hover:border-slate-300 transition-colors">
              <div className="text-2xl font-black text-slate-950 font-mono">₹4.85 Lakhs</div>
              <div className="text-xs text-slate-600 font-semibold mt-1 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>Billed Today on POS</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs hover:border-slate-300 transition-colors">
              <div className="text-2xl font-black text-slate-950 font-mono">140+ Salons</div>
              <div className="text-xs text-slate-600 font-semibold mt-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Happy Salons & Studios</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs hover:border-slate-300 transition-colors">
              <div className="text-2xl font-black text-slate-950 font-mono">0% Extra Fees</div>
              <div className="text-xs text-slate-600 font-semibold mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Keep 100% of Sales</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs hover:border-slate-300 transition-colors">
              <div className="text-2xl font-black text-slate-950 font-mono">100% Safe</div>
              <div className="text-xs text-slate-600 font-semibold mt-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Private & Secure Data</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Live Preview Sandbox Section */}
      <section id="sandbox" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
              <span>Interactive Interface Sandbox</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Test Core Operations Right Here
            </h2>
            <p className="text-sm text-slate-600">
              Click through the operational modules below to test real system interactions.
            </p>
          </div>

          {/* Sandbox Frame */}
          <div className="bg-white border border-slate-200/90 rounded-3xl shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] overflow-hidden">
            {/* Tab Header */}
            <div className="flex flex-wrap items-center justify-between border-b border-slate-200 p-2 sm:p-3 bg-slate-50/70 gap-2">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <button
                  onClick={() => setActivePreviewTab("pos")}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    activePreviewTab === "pos"
                      ? "bg-slate-950 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-950 hover:bg-slate-200/60"
                  }`}
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>1. Fast POS & Billing</span>
                </button>

                <button
                  onClick={() => setActivePreviewTab("calendar")}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    activePreviewTab === "calendar"
                      ? "bg-slate-950 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-950 hover:bg-slate-200/60"
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>2. Chair Schedule Matrix</span>
                </button>

                <button
                  onClick={() => setActivePreviewTab("whatsapp")}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    activePreviewTab === "whatsapp"
                      ? "bg-slate-950 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-950 hover:bg-slate-200/60"
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>3. WhatsApp Automation</span>
                </button>

                <button
                  onClick={() => setActivePreviewTab("formula")}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    activePreviewTab === "formula"
                      ? "bg-slate-950 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-950 hover:bg-slate-200/60"
                  }`}
                >
                  <Scissors className="w-3.5 h-3.5" />
                  <span>4. Client Formula Vault</span>
                </button>
              </div>

              <div>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-200 shadow-2xs transition-all"
                >
                  <span>Open Full Suite</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </Link>
              </div>
            </div>

            {/* Tab Contents */}
            <div className="p-5 sm:p-8">
              {/* TAB 1: POS Billing */}
              {activePreviewTab === "pos" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-200">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <div>
                        <h3 className="font-extrabold text-base text-slate-950">Active Checkout Register</h3>
                        <p className="text-xs text-slate-500">Chair #01 • Client: Ananya Deshmukh (Platinum VIP)</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-bold border border-slate-200">
                        LIVE TERMINAL
                      </span>
                    </div>

                    {/* Cart Items */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs">
                            <Scissors className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-xs text-slate-900">Signature Balayage & Olaplex Gloss</div>
                            <div className="text-[11px] text-slate-500">Stylist: Priya Sharma • 90 mins</div>
                          </div>
                        </div>
                        <div className="font-mono font-bold text-xs text-slate-900">₹6,500</div>
                      </div>

                      <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs">
                            <Boxes className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-xs text-slate-900">Moroccanoil Treatment Original (100ml)</div>
                            <div className="text-[11px] text-slate-500">Retail Take-home • Qty: 1</div>
                          </div>
                        </div>
                        <div className="font-mono font-bold text-xs text-slate-900">₹3,400</div>
                      </div>
                    </div>

                    {/* Discount Selector */}
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span>VIP Membership Discount</span>
                        <span className="text-amber-700 font-mono">{posDiscount}% OFF applied</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {[0, 10, 15, 20].map((d) => (
                          <button
                            key={d}
                            onClick={() => setPosDiscount(d)}
                            className={`flex-1 py-1.5 rounded-xl font-bold text-xs transition-all ${
                              posDiscount === d
                                ? "bg-slate-950 text-white font-extrabold shadow-xs"
                                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {d === 0 ? "None" : `${d}%`}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Payment Tender */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">Payment Tender</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(["UPI", "Card", "Cash"] as const).map((method) => (
                          <button
                            key={method}
                            onClick={() => setPosPaymentMethod(method)}
                            className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                              posPaymentMethod === method
                                ? "bg-slate-950 border-slate-950 text-white"
                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            {method === "UPI" && "⚡ UPI / QR"}
                            {method === "Card" && "💳 POS Terminal"}
                            {method === "Cash" && "💵 Cash Drawer"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Receipt & Total */}
                  <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                        <span className="text-xs font-mono font-bold text-slate-600">INVOICE BREAKDOWN</span>
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                          18% GST COMPLIANT
                        </span>
                      </div>

                      {(() => {
                        const sub = 9900;
                        const disc = Math.round((sub * posDiscount) / 100);
                        const taxable = sub - disc;
                        const gst = Math.round(taxable * 0.18);
                        const total = taxable + gst;

                        return (
                          <div className="py-4 space-y-2.5 text-xs font-medium">
                            <div className="flex justify-between text-slate-600">
                              <span>Service & Retail Subtotal</span>
                              <span className="font-mono text-slate-900">{formatCurrency(sub)}</span>
                            </div>
                            <div className="flex justify-between text-amber-700">
                              <span>VIP Tier Savings ({posDiscount}%)</span>
                              <span className="font-mono">-{formatCurrency(disc)}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                              <span>GST @ 18% (CGST 9% + SGST 9%)</span>
                              <span className="font-mono text-slate-900">+{formatCurrency(gst)}</span>
                            </div>
                            <div className="h-px bg-slate-200 my-2"></div>
                            <div className="flex justify-between items-baseline pt-1">
                              <span className="text-sm font-extrabold text-slate-950">Net Total</span>
                              <span className="text-2xl font-black text-slate-950 font-mono">
                                {formatCurrency(total)}
                              </span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="space-y-2 pt-4 border-t border-slate-200">
                      <button
                        onClick={() => {
                          setPosReceiptShown(true);
                          showToast("Payment recorded. Paperless receipt sent via WhatsApp.");
                        }}
                        className="w-full py-3 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Complete {posPaymentMethod} Settlement</span>
                      </button>

                      {posReceiptShown && (
                        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in duration-150">
                          <Check className="w-3.5 h-3.5" />
                          <span>Digital GST invoice sent to client's WhatsApp</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Calendar Matrix */}
              {activePreviewTab === "calendar" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <h3 className="font-extrabold text-base text-slate-950">Live Chair Scheduling Matrix</h3>
                      <p className="text-xs text-slate-500">Multi-chair occupancy tracking • Concurrency lock prevents overbooking</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-bold border border-slate-200">
                      TODAY: 10:00 AM - 08:00 PM
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
                    {/* Chair 1 */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900">CHAIR 01</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      </div>
                      <div className="text-xs text-slate-500 font-medium">Stylist: Priya S. (Director)</div>

                      <div className="p-3 bg-white border border-blue-200 rounded-xl space-y-1 shadow-2xs">
                        <div className="text-[10px] font-bold text-blue-700">11:00 AM - 12:30 PM</div>
                        <div className="font-bold text-xs text-slate-900">Balayage & Olaplex Gloss</div>
                        <div className="text-[11px] text-slate-500">Ananya D. • ₹6,500</div>
                        <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          In-Service
                        </span>
                      </div>

                      <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs">
                        <div className="text-[10px] font-bold text-slate-600">02:00 PM - 03:00 PM</div>
                        <div className="font-bold text-xs text-slate-900">K-Gloss Smoothing</div>
                        <div className="text-[11px] text-slate-500">Rhea Sen • ₹4,200</div>
                        <span className="inline-block px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                          Confirmed
                        </span>
                      </div>
                    </div>

                    {/* Chair 2 */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900">CHAIR 02</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      </div>
                      <div className="text-xs text-slate-500 font-medium">Barber: Arjun V. (Senior)</div>

                      <div className="p-3 bg-white border border-purple-200 rounded-xl space-y-1 shadow-2xs">
                        <div className="text-[10px] font-bold text-purple-700">11:30 AM - 12:15 PM</div>
                        <div className="font-bold text-xs text-slate-900">Beard Sculpt & Fade</div>
                        <div className="text-[11px] text-slate-500">Karan S. • ₹1,200</div>
                        <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          In-Service
                        </span>
                      </div>

                      <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs">
                        <div className="text-[10px] font-bold text-slate-600">01:00 PM - 01:45 PM</div>
                        <div className="font-bold text-xs text-slate-900">Executive Hot Towel Shave</div>
                        <div className="text-[11px] text-slate-500">Vikram R. • ₹1,500</div>
                        <span className="inline-block px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                          Confirmed
                        </span>
                      </div>
                    </div>

                    {/* Chair 3 */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900">CHAIR 03</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      </div>
                      <div className="text-xs text-slate-500 font-medium">Esthetician: Sneha N.</div>

                      <div className="p-3 bg-white border border-emerald-200 rounded-xl space-y-1 shadow-2xs">
                        <div className="text-[10px] font-bold text-emerald-700">11:00 AM - 12:15 PM</div>
                        <div className="font-bold text-xs text-slate-900">Hydra-Infusion Facial</div>
                        <div className="text-[11px] text-slate-500">Meera K. • ₹3,800</div>
                        <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold">
                          Completed
                        </span>
                      </div>

                      <div className="p-3 border border-dashed border-slate-300 rounded-xl text-center py-5">
                        <span className="text-[11px] text-slate-500 font-bold">+ Open Slot (01:00 PM)</span>
                      </div>
                    </div>

                    {/* Chair 4 */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900">CHAIR 04</span>
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      </div>
                      <div className="text-xs text-slate-500 font-medium">Nail Artist: Rohit M.</div>

                      <div className="p-3 bg-white border border-amber-200 rounded-xl space-y-1 shadow-2xs">
                        <div className="text-[10px] font-bold text-amber-800">11:00 AM - 12:00 PM</div>
                        <div className="font-bold text-xs text-slate-900">Sculpted Gel Extensions</div>
                        <div className="text-[11px] text-slate-500">Divya Sen • ₹2,400</div>
                        <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          In-Service
                        </span>
                      </div>

                      <div className="p-3 border border-dashed border-slate-300 rounded-xl text-center py-5">
                        <span className="text-[11px] text-slate-500 font-bold">+ Open Slot (02:30 PM)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: WhatsApp Retention */}
              {activePreviewTab === "whatsapp" && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-in fade-in duration-200">
                  <div className="md:col-span-5 space-y-4">
                    <div className="pb-2 border-b border-slate-200">
                      <h3 className="font-extrabold text-base text-slate-950">Automated Retention Campaign</h3>
                      <p className="text-xs text-slate-500">Meta WhatsApp Cloud API • Zero manual staff messages</p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Trigger Cadence</span>
                        <span className="font-bold text-slate-900">28 Days Post-Color</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Client</span>
                        <span className="font-bold text-slate-900">Ananya Deshmukh (+91 99201...)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Stylist</span>
                        <span className="font-bold text-slate-900">Priya Sharma</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Incentive Code</span>
                        <span className="font-mono font-bold text-emerald-700">GLOW15 (15% OFF)</span>
                      </div>
                    </div>

                    <button
                      onClick={handleSendWhatsAppTest}
                      className="w-full py-3 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{waSent ? "Dispatched" : "Simulate Automated WhatsApp Dispatch"}</span>
                    </button>
                  </div>

                  {/* Clean WhatsApp Mockup */}
                  <div className="md:col-span-7 bg-[#f0f2f5] p-5 rounded-3xl border border-slate-300 flex flex-col justify-between">
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                      <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                        R
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{salon.name}</span>
                          <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px]">
                            ✓
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500">Official WhatsApp Business Account</div>
                      </div>
                    </div>

                    {/* Chat Bubble */}
                    <div className="py-6 space-y-3">
                      <div className="max-w-[85%] bg-white text-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-200 text-xs space-y-2 shadow-xs">
                        <p className="leading-relaxed">
                          Hello <span className="font-bold text-slate-950">Ananya</span>, it has been 4 weeks since your
                          signature Balayage & Olaplex gloss with <span className="font-bold">Priya</span> at {salon.name}.
                        </p>
                        <p className="leading-relaxed">
                          To maintain your luminous tone, your root touch-up is due this week.
                        </p>
                        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px] text-emerald-800 flex items-center justify-between">
                          <span>VIP Code: GLOW15</span>
                          <span>15% SAVINGS</span>
                        </div>
                        <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500">
                          <span className="text-blue-600 font-bold hover:underline cursor-pointer">
                            Reserve Preferred Station →
                          </span>
                          <span className="flex items-center gap-1">
                            10:30 AM <span className="text-blue-600">✓✓</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-500 text-center border-t border-slate-200 pt-2">
                      End-to-end encrypted via Meta Cloud API • Zero spam rate
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: Formula Vault */}
              {activePreviewTab === "formula" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <h3 className="font-extrabold text-base text-slate-950">Client Consultation & Color Vault</h3>
                      <p className="text-xs text-slate-500">Exact gram formulation history • Allergy patch test safety tracking</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-mono text-xs font-bold border border-slate-200">
                      SAFETY CERTIFIED
                    </span>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-sm flex items-center justify-center">
                          MK
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-950">Meera Kapoor</h4>
                          <p className="text-xs text-slate-500">+91 98112 55432 • 18 Total Visits • Total Spent: ₹48,500</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs border border-amber-200">
                          Platinum VIP Tier
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs border border-emerald-200">
                          Patch Test: Valid (Oct 2026)
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 shadow-2xs">
                        <div className="text-xs font-bold text-slate-900">Current Hair Formula Record:</div>
                        <div className="font-mono text-xs text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
                          Schwarzkopf Igora Royal 7-1 (30g) + 8-4 (15g)<br />
                          + 20 Vol Developer (45g)<br />
                          Toner: Olaplex 4-in-1 Moisture Mask (15 min)
                        </div>
                        <div className="text-[10px] text-slate-500">Logged by Priya Sharma on 18 Sep 2026</div>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 shadow-2xs">
                        <div className="text-xs font-bold text-slate-900">Consultation Notes & Preferences:</div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Sensitive scalp to high volume bleach. Prefers low-heat blowout with Moroccan Argan oil.
                          Enjoys cold brew coffee during long appointments.
                        </p>
                        <div className="pt-2 flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            Rebooking Cadence: Every 28 Days
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Salon ROI & Revenue Model */}
      <section id="roi-calculator" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-200/80">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Financial Impact Model</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Calculate Your Salon Revenue Model
            </h2>
            <p className="text-sm text-slate-600">
              Calculate projected monthly turnover and the direct revenue recovered by automated client retention.
            </p>
          </div>

          <div className="bg-[#faf9f6] border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Controls */}
            <div className="lg:col-span-7 space-y-6">
              {/* Slider 1: Chairs */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-slate-800">Styling Chairs</span>
                  <span className="text-slate-950 font-mono font-black text-base">{chairsCount} Chairs</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="20"
                  value={chairsCount}
                  onChange={(e) => setChairsCount(Number(e.target.value))}
                  className="w-full accent-slate-950 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>2 Chairs</span>
                  <span>10 Chairs</span>
                  <span>20 Chairs</span>
                </div>
              </div>

              {/* Slider 2: Average Ticket */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-slate-800">Average Service Ticket</span>
                  <span className="text-slate-950 font-mono font-black text-base">{formatCurrency(avgTicket)}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="5000"
                  step="100"
                  value={avgTicket}
                  onChange={(e) => setAvgTicket(Number(e.target.value))}
                  className="w-full accent-slate-950 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>₹500</span>
                  <span>₹2,500</span>
                  <span>₹5,000</span>
                </div>
              </div>

              {/* Slider 3: Clients per Chair Day */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-slate-800">Daily Clients per Chair</span>
                  <span className="text-slate-950 font-mono font-black text-base">{clientsPerChairDay} Clients</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="10"
                  value={clientsPerChairDay}
                  onChange={(e) => setClientsPerChairDay(Number(e.target.value))}
                  className="w-full accent-slate-950 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>2 Clients</span>
                  <span>5 Clients</span>
                  <span>10 Clients</span>
                </div>
              </div>
            </div>

            {/* Right Card Calculation */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
              <div className="text-xs font-mono text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-200">
                MONTHLY PROJECTED METRICS
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-xs text-slate-500">Estimated Monthly Gross Turnover</div>
                  <div className="text-2xl font-black text-slate-950 font-mono">{formatCurrency(monthlyTurnover)}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Recovered via Automated Touchups (+22%)</span>
                  </div>
                  <div className="text-xl font-extrabold text-emerald-950 font-mono mt-0.5">
                    +{formatCurrency(recoveredViaWhatsApp)} / month
                  </div>
                  <div className="text-[10px] text-emerald-700 mt-1">
                    Via scheduled WhatsApp root-touchup & feedback cadences
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-600" />
                    <span>Management Time Saved</span>
                  </div>
                  <div className="text-xl font-extrabold text-slate-900 font-mono mt-0.5">
                    {hoursSavedPerMonth} Hours / month
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Eliminating manual billing calculation, stock counting, and shift reconciliations
                  </div>
                </div>
              </div>

              <Link
                href="/signup"
                className="w-full py-3 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 text-center"
              >
                <span>Deploy RUVEXI for Your Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Core Product Features Section */}
      <section id="features" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
              <span>Platform Capabilities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Architected for High-Volume Salons
            </h2>
            <p className="text-sm text-slate-600">
              Built so any receptionist or stylist can pick it up in minutes with zero confusion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 hover:border-slate-300 transition-all shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center border border-slate-200">
                <Receipt className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-950">Fast Billing & Receipts</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Make bills in under 5 seconds. Take cash, UPI, or cards, apply discount coupons easily, and send clean WhatsApp receipts directly to clients' phones.
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] font-bold text-slate-600">
                <span className="px-2.5 py-1 rounded-full bg-slate-100">Cash + UPI Split</span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100">WhatsApp Bill</span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100">Clean Tax Invoice</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 hover:border-slate-300 transition-all shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center border border-slate-200">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-950">Easy Appointment Diary</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                A clear daily planner showing who is sitting where. Easy drag-and-drop to change times, seat walk-ins, and avoid double bookings.
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] font-bold text-slate-600">
                <span className="px-2.5 py-1 rounded-full bg-slate-100">No Double Bookings</span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100">See Free Chairs</span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100">Fast Walk-ins</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 hover:border-slate-300 transition-all shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center border border-slate-200">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-950">Automatic WhatsApp Messages</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Remind clients before they arrive, wish them on birthdays, and send friendly follow-up reminders when it is time for their next haircut or color.
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] font-bold text-slate-600">
                <span className="px-2.5 py-1 rounded-full bg-slate-100">Appointment Reminders</span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100">WhatsApp Direct</span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100">Happy Return Clients</span>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 hover:border-slate-300 transition-all shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center border border-slate-200">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-950">Staff Attendance & Commission</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Simple 1-tap staff sign-in. Clear reports showing each stylist's services, tips, and commission so there is zero confusion on salary day.
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] font-bold text-slate-600">
                <span className="px-2.5 py-1 rounded-full bg-slate-100">1-Tap Clock-in</span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100">Fair Commission</span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100">Daily Tip Totals</span>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 hover:border-slate-300 transition-all shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center border border-slate-200">
                <Boxes className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-950">Products & Low Stock Warnings</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Track shampoos, hair colors, and creams. The system subtracts items automatically when sold or used, and warns you before anything runs out.
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] font-bold text-slate-600">
                <span className="px-2.5 py-1 rounded-full bg-slate-100">Salon Use vs Retail</span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100">Barcode Scanning</span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100">Low Stock Alert</span>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 hover:border-slate-300 transition-all shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center border border-slate-200">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-950">Your Own Salon Website</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Give your customers a clean, mobile-friendly booking link with your salon name and logo. No competitor salon ads, no commission fees.
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] font-bold text-slate-600">
                <span className="px-2.5 py-1 rounded-full bg-slate-100">Your Salon Name</span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100">0% Commission</span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100">Phone & Tablet Friendly</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Matrix */}
      <section id="comparison" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-200/80">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
              <span>Why We Are Different</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Why Salons Choose RUVEXI
            </h2>
            <p className="text-sm text-slate-600">
              Clear, honest comparison against other salon software and manual spreadsheets.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="py-4 px-5 font-bold text-slate-600">WHAT MATTERS</th>
                  <th className="py-4 px-5 font-black text-slate-950 bg-slate-100/70 border-x border-slate-200">
                    RUVEXI
                  </th>
                  <th className="py-4 px-5 font-bold text-slate-500">FRESHA</th>
                  <th className="py-4 px-5 font-bold text-slate-500">ZENOTI</th>
                  <th className="py-4 px-5 font-bold text-slate-500">NOTEBOOKS / EXCEL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                <tr>
                  <td className="py-3.5 px-5 text-slate-800 font-semibold">New Client Booking Fee</td>
                  <td className="py-3.5 px-5 font-bold text-emerald-700 bg-slate-100/40 border-x border-slate-200">
                    0% (Always Free)
                  </td>
                  <td className="py-3.5 px-5 text-rose-600">Takes 20% cut per client</td>
                  <td className="py-3.5 px-5 text-slate-500">Custom Transaction Fees</td>
                  <td className="py-3.5 px-5 text-slate-500">0%</td>
                </tr>

                <tr>
                  <td className="py-3.5 px-5 text-slate-800 font-semibold">Your Own Website (No Rival Salon Ads)</td>
                  <td className="py-3.5 px-5 font-bold text-emerald-700 bg-slate-100/40 border-x border-slate-200">
                    Yes (Your Own Salon Link)
                  </td>
                  <td className="py-3.5 px-5 text-rose-600">No (Shows Other Salons)</td>
                  <td className="py-3.5 px-5 text-emerald-700">Yes (High Cost)</td>
                  <td className="py-3.5 px-5 text-rose-600">No</td>
                </tr>

                <tr>
                  <td className="py-3.5 px-5 text-slate-800 font-semibold">Automatic WhatsApp Reminders</td>
                  <td className="py-3.5 px-5 font-bold text-emerald-700 bg-slate-100/40 border-x border-slate-200">
                    Built-in WhatsApp (Fast & Direct)
                  </td>
                  <td className="py-3.5 px-5 text-rose-600">SMS Only (Extra Fee)</td>
                  <td className="py-3.5 px-5 text-slate-500">Paid Add-on</td>
                  <td className="py-3.5 px-5 text-rose-600">Manual Copy-Paste</td>
                </tr>

                <tr>
                  <td className="py-3.5 px-5 text-slate-800 font-semibold">Client Hair Color & Allergy Notes</td>
                  <td className="py-3.5 px-5 font-bold text-emerald-700 bg-slate-100/40 border-x border-slate-200">
                    Client History + Color Formulas
                  </td>
                  <td className="py-3.5 px-5 text-slate-500">Basic Notes Only</td>
                  <td className="py-3.5 px-5 text-emerald-700">Yes</td>
                  <td className="py-3.5 px-5 text-rose-600">Lost on paper slips</td>
                </tr>

                <tr>
                  <td className="py-3.5 px-5 text-slate-800 font-semibold">Staff Attendance & Commission Calculator</td>
                  <td className="py-3.5 px-5 font-bold text-emerald-700 bg-slate-100/40 border-x border-slate-200">
                    1-Tap Clock-in & Auto Split
                  </td>
                  <td className="py-3.5 px-5 text-slate-500">Basic Roster</td>
                  <td className="py-3.5 px-5 text-emerald-700">Complex Setup</td>
                  <td className="py-3.5 px-5 text-rose-600">Hours of Manual Math</td>
                </tr>

                <tr>
                  <td className="py-3.5 px-5 text-slate-800 font-semibold">Your Client Data Privacy</td>
                  <td className="py-3.5 px-5 font-bold text-emerald-700 bg-slate-100/40 border-x border-slate-200">
                    100% Private to Your Salon
                  </td>
                  <td className="py-3.5 px-5 text-slate-500">Shared Aggregate Pool</td>
                  <td className="py-3.5 px-5 text-emerald-700">Private Enterprise</td>
                  <td className="py-3.5 px-5 text-rose-600">Unprotected Sheets</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#faf9f6]">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
              <span>Transparent Pricing</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Straightforward Software Plans
            </h2>
            <p className="text-sm text-slate-600">
              No hidden fees, no per-booking cuts. Choose the tier that fits your chair count.
            </p>

            {/* Toggle */}
            <div className="inline-flex items-center bg-white border border-slate-200 p-1 rounded-xl shadow-2xs">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  billingCycle === "monthly" ? "bg-slate-950 text-white shadow-xs" : "text-slate-600 hover:text-slate-950"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  billingCycle === "annual" ? "bg-slate-950 text-white shadow-xs" : "text-slate-600 hover:text-slate-950"
                }`}
              >
                <span>Annual</span>
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[9px]">
                  SAVE 20%
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Starter */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-7 space-y-6 flex flex-col justify-between shadow-2xs">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="font-extrabold text-base text-slate-950">Starter Studio</h3>
                  <p className="text-xs text-slate-500">For boutique hair salons up to 3 chairs.</p>
                </div>
                <div className="pt-2">
                  <span className="text-3xl font-black text-slate-950 font-mono">
                    {billingCycle === "annual" ? "₹2,399" : "₹2,999"}
                  </span>
                  <span className="text-xs text-slate-500"> / month</span>
                </div>

                <div className="space-y-2.5 pt-4 text-xs text-slate-700 font-medium">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Up to 3 Styling Chairs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Point of Sale & GST Billing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Chair Schedule Matrix</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Client Formula Vault</span>
                  </div>
                </div>
              </div>

              <Link
                href="/signup"
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs rounded-xl border border-slate-200 transition-all text-center block"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Growth */}
            <div className="bg-white border-2 border-slate-950 rounded-2xl p-7 space-y-6 flex flex-col justify-between shadow-sm relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-slate-950 text-white font-extrabold text-[9px] uppercase tracking-wider">
                RECOMMENDED
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="font-extrabold text-base text-slate-950">Growth Salon</h3>
                  <p className="text-xs text-slate-500">For high-traffic studios & multi-service spas.</p>
                </div>
                <div className="pt-2">
                  <span className="text-3xl font-black text-slate-950 font-mono">
                    {billingCycle === "annual" ? "₹4,799" : "₹5,999"}
                  </span>
                  <span className="text-xs text-slate-500"> / month</span>
                </div>

                <div className="space-y-2.5 pt-4 text-xs text-slate-800 font-medium">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-bold">Up to 10 Styling Chairs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-bold">Meta WhatsApp Cloud Marketing AI</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Staff Biometric Clock-in & Commissions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Backbar & Retail Stock Ledger</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Branded Online Customer Booking Portal</span>
                  </div>
                </div>
              </div>

              <Link
                href="/signup"
                className="w-full py-3 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all text-center block"
              >
                Start 14-Day Free Trial
              </Link>
            </div>

            {/* Enterprise */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-7 space-y-6 flex flex-col justify-between shadow-2xs">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="font-extrabold text-base text-slate-950">Multi-Branch Chain</h3>
                  <p className="text-xs text-slate-500">For franchise groups & luxury multi-outlet brands.</p>
                </div>
                <div className="pt-2">
                  <span className="text-3xl font-black text-slate-950 font-mono">
                    {billingCycle === "annual" ? "₹10,399" : "₹12,999"}
                  </span>
                  <span className="text-xs text-slate-500"> / month</span>
                </div>

                <div className="space-y-2.5 pt-4 text-xs text-slate-700 font-medium">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Unlimited Chairs & Locations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Cross-Branch Customer Loyalty Sync</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Centralized Multi-Outlet Stock Transfers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Dedicated PostgreSQL Instance</span>
                  </div>
                </div>
              </div>

              <Link
                href="/signup"
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs rounded-xl border border-slate-200 transition-all text-center block"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-200/80">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="text-center space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Questions & Answers</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-600">Everything you need to know about switching to RUVEXI.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#faf9f6] border border-slate-200 rounded-xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full py-4 px-5 text-left font-bold text-sm text-slate-900 flex items-center justify-between gap-4"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-slate-900" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 animate-in fade-in duration-150">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Editorial Callout Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#faf9f6]">
        <div className="max-w-4xl mx-auto rounded-3xl bg-slate-950 text-white p-8 sm:p-12 text-center space-y-6 shadow-md">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Elevate Your Salon's Daily Operations
          </h2>
          <p className="max-w-xl mx-auto text-sm text-slate-300 font-normal leading-relaxed">
            Join over 140 premier studios operating on RUVEXI. Zero commission lock-ins, 14 days free trial, and instant setup.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Link
              href="/signup"
              className="px-6 py-3 bg-white text-slate-950 hover:bg-slate-100 font-extrabold text-xs rounded-xl shadow-xs transition-all"
            >
              Start Free 14-Day Trial
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all"
            >
              Launch Live Salon Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Refined Light Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-950 text-white flex items-center justify-center font-bold text-sm">
                R
              </div>
              <span className="font-extrabold text-base text-slate-950 tracking-tight">RUVEXI</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                SALON OS
              </span>
            </div>
            <p className="text-slate-600 text-xs max-w-sm leading-relaxed">
              The modern management software and multi-tenant SaaS platform for high-end salons, hair studios, and wellness spas.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="font-bold text-slate-900">Product</div>
            <ul className="space-y-1.5 text-slate-600">
              <li><Link href="/dashboard" className="hover:text-slate-950 transition-colors">Point of Sale (POS)</Link></li>
              <li><Link href="/dashboard" className="hover:text-slate-950 transition-colors">Chair Schedule Matrix</Link></li>
              <li><Link href="/dashboard" className="hover:text-slate-950 transition-colors">WhatsApp Automation</Link></li>
              <li><Link href="/dashboard" className="hover:text-slate-950 transition-colors">Inventory Control</Link></li>
              <li><Link href="/dashboard" className="hover:text-slate-950 transition-colors">Staff Commissions</Link></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <div className="font-bold text-slate-900">Platform</div>
            <ul className="space-y-1.5 text-slate-600">
              <li><Link href="/book" className="hover:text-slate-950 transition-colors">Client Booking Site</Link></li>
              <li><Link href="/admin" className="hover:text-slate-950 transition-colors">Super Admin Console</Link></li>
              <li><Link href="/login" className="hover:text-slate-950 transition-colors">Staff & Owner Sign In</Link></li>
              <li><Link href="/signup" className="hover:text-slate-950 transition-colors">Salon Onboarding</Link></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <div className="font-bold text-slate-900">Compliance & Trust</div>
            <ul className="space-y-1.5 text-slate-600">
              <li><span className="hover:text-slate-950 cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-slate-950 cursor-pointer">Terms of Service</span></li>
              <li><span className="hover:text-slate-950 cursor-pointer">PostgreSQL RLS Architecture</span></li>
              <li><span className="hover:text-slate-950 cursor-pointer">Meta Cloud Integration</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>© {new Date().getFullYear()} RUVEXI. All rights reserved. Zero commission guarantees.</div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-slate-700 font-semibold">99.98% Cloud Availability</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
