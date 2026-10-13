"use client";

import React, { useState, useRef, useEffect } from "react";
import { useDemo } from "@/lib/demo-context";
import { formatCurrency } from "@/lib/utils";
import {
  TrendingUp,
  Users,
  DollarSign,
  Scissors,
  Star,
  Award,
  Calendar,
  Clock,
  Boxes,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Phone,
  Percent,
  Sparkles,
  ChevronRight,
  ShoppingBag,
  HeartHandshake,
  BarChart3,
  Flame,
  BadgeAlert,
  Send,
  Bot,
  Lightbulb,
  RotateCcw,
  Check,
  CornerDownLeft,
  MessageSquare,
  Crown,
  Smile,
  ThumbsUp,
  Heart,
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  time: string;
  quickAction?: {
    label: string;
    actionType: "reorder" | "promo" | "staff";
  };
}

export function SalonOwnerView() {
  const { staff, services, inventory, invoices, appointments, customers, salon, showToast, feedbacks } =
    useDemo();

  // Time toggle: This Week vs This Month
  const [timeRange, setTimeRange] = useState<"week" | "month">("month");
  const isMonth = timeRange === "month";
  const multiplier = isMonth ? 4 : 1;

  // Aggregate totals
  const totalMonthRevenue = invoices.reduce((acc, inv) => acc + inv.total, 0) * (isMonth ? 18 : 4.5);
  const totalAppointmentsCount = appointments.length * (isMonth ? 22 : 5);
  const repeatClientPercentage = 68; // 68% repeat clients
  const avgBillSize = Math.round(totalMonthRevenue / (totalAppointmentsCount || 1));

  // Staff performance detailed data
  const workerAnalytics = staff.map((s, idx) => {
    const servicesGiven = (s.todayServicesCount * 5 + idx * 3) * multiplier;
    const customersHandled = Math.round(servicesGiven * 0.85);
    const revenueGenerated = (s.todayRevenue * 5 + idx * 4500) * multiplier;
    const commissionEarned = Math.round((revenueGenerated * s.commissionRate) / 100);
    const topService = s.specialty[0] || "Signature Haircut";

    return {
      ...s,
      servicesGiven,
      customersHandled,
      revenueGenerated,
      commissionEarned,
      topService,
    };
  });

  // Best services (Top revenue & high bookings)
  const bestServices = [
    {
      id: "srv_b1",
      name: "Keratin Protein Smoothing Therapy",
      category: "Hair Treatment",
      bookings: isMonth ? 84 : 21,
      revenue: (isMonth ? 84 : 21) * 4500,
      rating: 4.9,
      trend: "+28% vs last " + (isMonth ? "month" : "week"),
      tag: "Top Earner",
      tagColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    },
    {
      id: "srv_b2",
      name: "Creative Balayage & Color Gloss",
      category: "Color Bar",
      bookings: isMonth ? 62 : 15,
      revenue: (isMonth ? 62 : 15) * 5500,
      rating: 4.9,
      trend: "+19% demand",
      tag: "High Margin",
      tagColor: "bg-purple-100 text-purple-800 border-purple-200",
    },
    {
      id: "srv_b3",
      name: "Luxury Hair Spa & Scalp Detox",
      category: "Hair Therapy",
      bookings: isMonth ? 110 : 28,
      revenue: (isMonth ? 110 : 28) * 2200,
      rating: 4.8,
      trend: "+14% repeat visits",
      tag: "Client Favorite",
      tagColor: "bg-blue-100 text-blue-800 border-blue-200",
    },
    {
      id: "srv_b4",
      name: "Master Haircut & Blowdry Finish",
      category: "Hair Styling",
      bookings: isMonth ? 142 : 36,
      revenue: (isMonth ? 142 : 36) * 1500,
      rating: 4.9,
      trend: "+22% volume",
      tag: "Most Booked",
      tagColor: "bg-amber-100 text-amber-800 border-amber-200",
    },
  ];

  // Worst / Slow services (Low bookings or low interest)
  const slowServices = [
    {
      id: "srv_w1",
      name: "Classic Beard Trim & Towel Wrap",
      category: "Men Grooming",
      bookings: isMonth ? 8 : 2,
      revenue: (isMonth ? 8 : 2) * 600,
      rating: 4.5,
      issue: "Low stand-alone bookings",
      ownerTip: "Bundle as 'Haircut + Beard' package to lift sales.",
    },
    {
      id: "srv_w2",
      name: "Express Nail Buff & Polish",
      category: "Nail Bar",
      bookings: isMonth ? 6 : 1,
      revenue: (isMonth ? 6 : 1) * 800,
      rating: 4.4,
      issue: "Clients prefer full gel extensions",
      ownerTip: "Replace with Deluxe Spa Gel Pedicure.",
    },
    {
      id: "srv_w3",
      name: "Standard Face Bleach & Cleansing",
      category: "Skin Care",
      bookings: isMonth ? 5 : 1,
      revenue: (isMonth ? 5 : 1) * 950,
      rating: 4.2,
      issue: "Clients upgrade directly to Hydra-Facial",
      ownerTip: "Phase out or offer as complimentary add-on for VIPs.",
    },
  ];

  // Low Stock Items for Salon Owner
  const lowStockItems = inventory.filter((i) => i.currentStock <= i.minThreshold);

  // ============================================================
  // AI SALON ASSISTANT CHATBOT STATE
  // ============================================================
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "msg_1",
      sender: "ai",
      text: `Hello ${salon.name.split(" ")[0]} Owner! 👋 I am your RUVEXI Salon AI Advisor. Ask me anything about your revenue, workers, best/worst services, or stock levels and I will give you concise, data-backed answers!`,
      time: "Just now",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Quick 1-tap question chips
  const quickQuestions = [
    "Who is our top-earning stylist?",
    "Which service brings the most revenue?",
    "Which service is performing worst?",
    "What products are low on stock?",
    "How can I boost sales on slow Tuesdays?",
    "What is our customer retention rate?",
  ];

  const handleSendChat = (questionText?: string) => {
    const query = (questionText || chatInput).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!questionText) setChatInput("");
    setIsAiThinking(true);

    // Generate concise, intelligent AI response based on salon data
    setTimeout(() => {
      const q = query.toLowerCase();
      let aiResponse = "";
      let quickAction: ChatMessage["quickAction"] | undefined = undefined;

      if (q.includes("stylist") || q.includes("worker") || q.includes("staff") || q.includes("who")) {
        const topStylist = workerAnalytics[0];
        aiResponse = `👑 **Top Earner:** **${topStylist.name}** is your #1 stylist this month, generating **${formatCurrency(
          topStylist.revenueGenerated
        )}** across **${topStylist.customersHandled} clients** with a **${topStylist.rating}★ rating**. Her top service is ${topStylist.topService}.`;
        quickAction = { label: "View Staff Ledger", actionType: "staff" };
      } else if (
        q.includes("most revenue") ||
        q.includes("best service") ||
        q.includes("top service") ||
        q.includes("highest")
      ) {
        aiResponse = `⭐ **Highest Revenue Service:** **Keratin Protein Smoothing Therapy** brought in **${formatCurrency(
          bestServices[0].revenue
        )}** across **${bestServices[0].bookings} bookings** (priced at ₹4,500). It currently delivers your salon's highest profit margin!`;
        quickAction = { label: "Create Promo Bundle", actionType: "promo" };
      } else if (
        q.includes("worst") ||
        q.includes("slow") ||
        q.includes("least") ||
        q.includes("low demand")
      ) {
        aiResponse = `⚠️ **Lowest Demand Service:** **Classic Beard Trim** (only ${slowServices[0].bookings} bookings) and **Express Nail Buff** (${slowServices[1].bookings} bookings). \n\n💡 **Action:** Bundle the beard trim with your popular Haircut at a ₹200 discount to boost chair occupancy.`;
        quickAction = { label: "Draft WhatsApp Bundle", actionType: "promo" };
      } else if (
        q.includes("stock") ||
        q.includes("product") ||
        q.includes("inventory") ||
        q.includes("shampoo") ||
        q.includes("cream")
      ) {
        if (lowStockItems.length > 0) {
          const names = lowStockItems.map((i) => `${i.name} (${i.currentStock} ${i.unit} left, min ${i.minThreshold})`).join(", ");
          aiResponse = `📦 **Stock Alert:** You have **${lowStockItems.length} items** running low: **${names}**. Reordering is recommended before weekend rush.`;
          quickAction = { label: "Order Stock via WhatsApp", actionType: "reorder" };
        } else {
          aiResponse = `📦 **All Stock Healthy:** All professional color tubes and retail products are above minimum threshold levels today.`;
        }
      } else if (
        q.includes("retention") ||
        q.includes("repeat") ||
        q.includes("come back") ||
        q.includes("loyal")
      ) {
        aiResponse = `🔁 **Customer Retention:** **${repeatClientPercentage}%** of your clients return within 40 days (industry benchmark is 50%). Your automated WhatsApp reminders have reduced appointment no-shows from **22% down to 3.5%**!`;
      } else if (
        q.includes("feedback") ||
        q.includes("rating") ||
        q.includes("friendliness") ||
        q.includes("improve") ||
        q.includes("review")
      ) {
        aiResponse = `⭐ **Customer Feedback Numbers:** \n• **Overall Salon Rating:** 4.9★ across ${feedbacks.length + 180} reviews.\n• **Staff Friendliness:** 98% positive (clients love the polite attitude & complimentary green tea/coffee).\n• **Top Praise:** 86% praised stylist skill & zero waiting.\n• **Room for Improvement:** Only 10% noted slight wait times during peak Saturday 4 PM rush.`;
        quickAction = { label: "View Feedback Board", actionType: "staff" };
      } else if (
        q.includes("tuesday") ||
        q.includes("slow day") ||
        q.includes("boost") ||
        q.includes("increase sales") ||
        q.includes("more clients")
      ) {
        aiResponse = `💡 **Midweek Boost Strategy:** Chair occupancy drops by ~32% on Tuesdays and Wednesdays. \n\n🎯 **Recommendation:** Send an automated WhatsApp broadcast offering a *"Midweek Pamper Pass"* (Haircut + Free Scalp Detox Massage) to fill empty daytime slots.`;
        quickAction = { label: "Draft Tuesday Offer", actionType: "promo" };
      } else if (q.includes("revenue") || q.includes("sales") || q.includes("money") || q.includes("earnings")) {
        aiResponse = `💰 **Revenue Summary:** Your salon is pacing at **${formatCurrency(
          totalMonthRevenue
        )}** this month across **${totalAppointmentsCount} appointments**, with an average ticket size of **${formatCurrency(
          avgBillSize
        )}** per client (+24.5% vs last month).`;
      } else {
        aiResponse = `📊 **Salon Insights:** Luxe Haven is operating at healthy metrics with ${staff.length} active stylists, ${repeatClientPercentage}% repeat clientele, and strong weekend chair occupancy. For specific data, feel free to ask about staff sales, best/worst services, or stock warnings!`;
      }

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: "ai",
        text: aiResponse,
        time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }),
        quickAction,
      };

      setChatMessages((prev) => [...prev, aiMsg]);
      setIsAiThinking(false);
    }, 600);
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isAiThinking]);

  return (
    <div className="space-y-6">
      {/* Top Banner - Salon Owner Master Dashboard */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Salon Owner Console • {salon.name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Business & Worker Performance
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl">
              Track how many services each worker gives, weekly & monthly revenue, best vs worst services, and ask concise questions to your Salon AI Chatbot.
            </p>
          </div>

          {/* Time range switcher: This Week vs This Month */}
          <div className="flex items-center bg-slate-900/90 border border-slate-700/80 p-1.5 rounded-2xl shadow-inner self-start lg:self-auto">
            <button
              onClick={() => setTimeRange("week")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                timeRange === "week"
                  ? "bg-amber-500 text-slate-950 shadow-md font-extrabold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeRange("month")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                timeRange === "month"
                  ? "bg-amber-500 text-slate-950 shadow-md font-extrabold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              This Month
            </button>
          </div>
        </div>
      </div>

      {/* 4 Top KPI Cards for the Salon Owner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="luxury-card p-5 rounded-3xl border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {isMonth ? "This Month's Sales" : "This Week's Sales"}
            </span>
            <span className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-950 mt-2 font-mono">
            {formatCurrency(totalMonthRevenue)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+24.5% growth vs previous {timeRange}</span>
          </div>
        </div>

        {/* Total Appointments / Customers Handled */}
        <div className="luxury-card p-5 rounded-3xl border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {isMonth ? "Monthly Customers" : "Weekly Customers"}
            </span>
            <span className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-950 mt-2 font-mono">
            {totalAppointmentsCount} Clients
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-blue-600">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Avg Bill: {formatCurrency(avgBillSize)}</span>
          </div>
        </div>

        {/* Repeat Customer Retention */}
        <div className="luxury-card p-5 rounded-3xl border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Repeat Client Rate
            </span>
            <span className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <HeartHandshake className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-700 mt-2 font-mono">
            {repeatClientPercentage}% Returning
          </div>
          <p className="text-xs text-slate-500 font-medium mt-2">
            68 out of 100 clients come back within 40 days
          </p>
        </div>

        {/* Salon Stock Health */}
        <div className="luxury-card p-5 rounded-3xl border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Low Stock Warnings
            </span>
            <span
              className={`p-2.5 rounded-xl ${
                lowStockItems.length > 0 ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
              }`}
            >
              <Boxes className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-950 mt-2 font-mono">
            {lowStockItems.length} Items Low
          </div>
          <p className="text-xs text-rose-600 font-bold mt-2">
            {lowStockItems.length > 0 ? "Reorder needed soon" : "All products well stocked"}
          </p>
        </div>
      </div>

      {/* ============================================================ */}
      {/* NEW: SALON OWNER AI CHATBOT SECTION (ASK CONCISE QUESTIONS) */}
      {/* ============================================================ */}
      <div className="luxury-card p-6 rounded-3xl space-y-4 border-2 border-indigo-200 bg-gradient-to-b from-white via-indigo-50/20 to-white shadow-md">
        {/* Chatbot Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/25">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-950">
                  Salon Owner AI Advisor
                </h2>
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                  <Sparkles className="w-3 h-3 text-indigo-600" />
                  Live Chatbot
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Ask concise questions about your stylists, sales, services, or inventory and get instant answers.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setChatMessages([
                {
                  id: "msg_reset",
                  sender: "ai",
                  text: `Chat cleared! What would you like to ask about your salon operations?`,
                  time: "Just now",
                },
              ]);
              showToast("Chatbot reset to initial state.");
            }}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 self-start sm:self-auto px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Chat</span>
          </button>
        </div>

        {/* 1-Tap Quick Question Chips */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Tap to ask instantly:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
            {quickQuestions.map((qText) => (
              <button
                key={qText}
                onClick={() => handleSendChat(qText)}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-slate-700 text-xs font-semibold whitespace-nowrap shadow-2xs transition-all flex items-center gap-1.5 shrink-0"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>{qText}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Messages Stream Box */}
        <div className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-4 space-y-3.5 max-h-80 overflow-y-auto">
          {chatMessages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"} animate-in fade-in duration-200`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs font-black shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-xl rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    isUser
                      ? "bg-slate-950 text-white rounded-br-xs shadow-xs font-medium"
                      : "bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-2xs"
                  }`}
                >
                  <div className="whitespace-pre-line font-sans">{msg.text}</div>

                  {/* Optional Action Button inside AI Message */}
                  {msg.quickAction && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (msg.quickAction?.actionType === "reorder") {
                            showToast("Purchase order drafted for L'Oréal supplier!");
                          } else if (msg.quickAction?.actionType === "promo") {
                            showToast("Midweek Pamper Pass WhatsApp campaign queued!");
                          } else {
                            showToast("Viewing stylist ledger.");
                          }
                        }}
                        className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-[11px] rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{msg.quickAction.label}</span>
                      </button>
                    </div>
                  )}

                  <div
                    className={`text-[9px] mt-1 text-right font-mono ${
                      isUser ? "text-slate-400" : "text-slate-400"
                    }`}
                  >
                    {msg.time}
                  </div>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 text-xs font-black shadow-xs">
                    <Crown className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* AI Thinking Animation */}
          {isAiThinking && (
            <div className="flex gap-3 justify-start animate-in fade-in">
              <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-500 flex items-center gap-2 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></span>
                <span>AI is analyzing salon data...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendChat();
          }}
          className="flex items-center gap-2 pt-1"
        >
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Ask a concise question (e.g. 'How much did Arjun earn this week?' or 'What is our profit margin?')"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="w-full pl-4 pr-10 py-3 bg-white border border-slate-300 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
            />
          </div>
          <button
            type="submit"
            disabled={!chatInput.trim() || isAiThinking}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-extrabold text-xs rounded-2xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5 shrink-0 tactile-btn"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* ============================================================ */}
      {/* SECTION 1: WORKER PERFORMANCE (SERVICES GIVEN, CUSTOMERS, REVENUE) */}
      {/* ============================================================ */}
      <div className="luxury-card p-6 rounded-3xl space-y-5 border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-950">Worker Performance & Sales</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold font-mono">
                {timeRange === "month" ? "Per Month" : "Per Week"}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              See exactly how many services each worker gave, how many clients they served, and how much money they brought to your salon.
            </p>
          </div>
        </div>

        {/* Worker Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Worker / Stylist</th>
                <th className="py-3.5 px-4">Services Given</th>
                <th className="py-3.5 px-4">Customers Handled</th>
                <th className="py-3.5 px-4">Revenue Generated</th>
                <th className="py-3.5 px-4">Commission Earned</th>
                <th className="py-3.5 px-4">Top Specialty Service</th>
                <th className="py-3.5 px-4 text-center">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {workerAnalytics.map((w) => (
                <tr key={w.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Worker Name & Role */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={w.avatar}
                        alt={w.name}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-950 text-xs">{w.name}</div>
                        <div className="text-[10px] text-slate-500">{w.role}</div>
                      </div>
                    </div>
                  </td>

                  {/* Services Given */}
                  <td className="py-3.5 px-4">
                    <div className="font-extrabold text-slate-950 text-sm font-mono">
                      {w.servicesGiven}
                    </div>
                    <div className="text-[10px] text-slate-500">services completed</div>
                  </td>

                  {/* Customers Handled */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-blue-700 text-sm font-mono">
                      {w.customersHandled}
                    </div>
                    <div className="text-[10px] text-slate-500">clients in chair</div>
                  </td>

                  {/* Revenue Generated */}
                  <td className="py-3.5 px-4">
                    <div className="font-black text-slate-950 text-sm font-mono">
                      {formatCurrency(w.revenueGenerated)}
                    </div>
                    <div className="text-[10px] text-emerald-600 font-bold">
                      {isMonth ? "Monthly revenue" : "Weekly revenue"}
                    </div>
                  </td>

                  {/* Commission Earned */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-purple-700 text-xs font-mono">
                      {formatCurrency(w.commissionEarned)}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Rate: {w.commissionRate}%
                    </div>
                  </td>

                  {/* Top Specialty Service */}
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-[11px] font-bold">
                      {w.topService}
                    </span>
                  </td>

                  {/* Rating */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 text-amber-800 font-bold text-xs">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                      <span>{w.rating}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 2: BEST SERVICES VS WORST SERVICES */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BEST SERVICES */}
        <div className="luxury-card p-6 rounded-3xl space-y-4 border-slate-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-950">
                  Best Performing Services
                </h3>
                <p className="text-[11px] text-slate-500">
                  Highest bookings & maximum revenue for your salon.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Top Earners
            </span>
          </div>

          <div className="space-y-3">
            {bestServices.map((bs, index) => (
              <div
                key={bs.id}
                className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-emerald-300 transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs font-mono shrink-0">
                    #{index + 1}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-950">{bs.name}</div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{bs.category}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-bold">{bs.trend}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-black text-slate-950 text-xs font-mono">
                    {formatCurrency(bs.revenue)}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {bs.bookings} bookings
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WORST / SLOW SERVICES */}
        <div className="luxury-card p-6 rounded-3xl space-y-4 border-slate-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-950">
                  Slow / Underperforming Services
                </h3>
                <p className="text-[11px] text-slate-500">
                  Services with lowest demand & practical owner advice.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              Needs Attention
            </span>
          </div>

          <div className="space-y-3">
            {slowServices.map((ss, index) => (
              <div
                key={ss.id}
                className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-amber-300 transition-all space-y-2"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-xs text-slate-950">{ss.name}</div>
                    <div className="text-[10px] text-slate-500">
                      {ss.category} • {ss.issue}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold text-slate-900 text-xs font-mono">
                      {formatCurrency(ss.revenue)}
                    </div>
                    <div className="text-[10px] text-rose-600 font-bold">
                      Only {ss.bookings} bookings
                    </div>
                  </div>
                </div>

                {/* Practical Owner Advice */}
                <div className="p-2 rounded-xl bg-amber-50/80 border border-amber-200/60 text-[11px] text-amber-900 flex items-start gap-1.5 font-medium">
                  <span className="font-bold shrink-0">💡 Advice:</span>
                  <span>{ss.ownerTip}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 3: SALON STOCK & INVENTORY OVERVIEW */}
      {/* ============================================================ */}
      <div className="luxury-card p-6 rounded-3xl space-y-4 border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-950">
              Salon Stock & Supply Alerts
            </h3>
            <p className="text-xs text-slate-500">
              Check shampoo bottles, hair color tubes, and retail creams so your stylists never run out.
            </p>
          </div>

          <button
            onClick={() => showToast("Stock report and supplier purchase order created!")}
            className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Order Stock via WhatsApp</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {inventory.slice(0, 6).map((item) => {
            const isLow = item.currentStock <= item.minThreshold;
            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isLow
                    ? "bg-rose-50/40 border-rose-200 hover:border-rose-300"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {item.usageType}
                  </span>
                  {isLow ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Low Stock
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      In Stock
                    </span>
                  )}
                </div>

                <div className="mt-3">
                  <div className="font-extrabold text-xs text-slate-950 truncate">
                    {item.name}
                  </div>
                  <div className="text-[10px] text-slate-500">{item.brand}</div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100 font-mono">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Current Units</span>
                    <span
                      className={`font-black text-sm ${
                        isLow ? "text-rose-600" : "text-slate-900"
                      }`}
                    >
                      {item.currentStock} {item.unit}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 text-[10px] block">Min Limit</span>
                    <span className="font-bold text-slate-600 text-sm">
                      {item.minThreshold} {item.unit}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 4: CLIENT FEEDBACK & RATINGS (THE NUMBERS) */}
      {/* ============================================================ */}
      <div className="luxury-card p-6 rounded-3xl space-y-6 border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base sm:text-lg text-slate-950">
                Customer Feedback & Staff Ratings
              </h3>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Live WhatsApp Feed
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Ratings and notes tapped by clients right after their visit from WhatsApp bills.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Total Reviews:</span>
            <span className="px-3 py-1 rounded-full bg-slate-900 text-white font-mono font-bold text-xs">
              {feedbacks.length + 180} Verified
            </span>
          </div>
        </div>

        {/* 4 Scoreboard Numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-1">
            <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider block">
              Overall Salon Rating
            </span>
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-950 font-mono">
                4.9
              </span>
              <div className="flex text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
            </div>
            <p className="text-[11px] text-amber-800 font-medium">96% of clients gave 5 stars</p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-1">
            <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider block">
              Staff Friendliness Score
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono">
              98%
            </div>
            <p className="text-[11px] text-emerald-800 font-medium flex items-center gap-1">
              <Smile className="w-3.5 h-3.5 text-emerald-600" />
              <span>Rated "Super Friendly & Polite"</span>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-1">
            <span className="text-[10px] font-extrabold text-blue-800 uppercase tracking-wider block">
              Stylist Service Quality
            </span>
            <div className="text-2xl sm:text-3xl font-black text-blue-700 font-mono">
              4.9 ★
            </div>
            <p className="text-[11px] text-blue-800 font-medium">Precise haircuts & color work</p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-1">
            <span className="text-[10px] font-extrabold text-purple-800 uppercase tracking-wider block">
              Salon Hygiene & Ambience
            </span>
            <div className="text-2xl sm:text-3xl font-black text-purple-700 font-mono">
              4.8 ★
            </div>
            <p className="text-[11px] text-purple-800 font-medium">Loved music, coffee & vibe</p>
          </div>
        </div>

        {/* Worker-by-Worker Customer Feedback Table */}
        <div className="space-y-3">
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
            Worker-by-Worker Client Satisfaction
          </h4>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Worker / Stylist</th>
                  <th className="py-3 px-4">Service Rating</th>
                  <th className="py-3 px-4">Staff Friendliness</th>
                  <th className="py-3 px-4">Total Reviews</th>
                  <th className="py-3 px-4">Top Client Praise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {workerAnalytics.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-bold text-slate-950 flex items-center gap-2.5">
                      <img src={w.avatar} alt={w.name} className="w-7 h-7 rounded-lg object-cover" />
                      <span>{w.name}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="inline-flex items-center gap-1 font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{w.rating} / 5.0</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-emerald-700 font-extrabold">
                      99% Friendly
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-mono font-bold">
                      {Math.round(w.customersHandled * 0.7)} reviews
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                        "Great listener, gentle hands ✨"
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* "What Can We Improve?" Insights from Customers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Improvement breakdown */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>What Clients Say We Can Improve</span>
            </h4>

            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1 text-[11px]">
                  <span>Everything was perfect & loved styling ✨</span>
                  <span className="font-mono text-emerald-700">86%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "86%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1 text-[11px]">
                  <span>Very polite & courteous staff 💖</span>
                  <span className="font-mono text-emerald-700">94%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: "94%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1 text-[11px]">
                  <span>Slight wait time during peak hours (5-10m) ⏱️</span>
                  <span className="font-mono text-amber-700">12%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "12%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1 text-[11px]">
                  <span>Music a bit loud on Saturday evenings 🎵</span>
                  <span className="font-mono text-slate-600">5%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full bg-slate-400 rounded-full" style={{ width: "5%" }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Recent Feedback Stream */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
              <span>Recent WhatsApp Feedback Entries</span>
            </h4>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {feedbacks.slice(0, 3).map((fb) => (
                <div
                  key={fb.id}
                  className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-xs text-slate-950">
                      {fb.customerName}{" "}
                      <span className="font-normal text-slate-400">
                        • styled by {fb.staffName}
                      </span>
                    </div>
                    <div className="flex items-center text-amber-500 text-[10px] font-bold">
                      <span>{fb.serviceRating} ★</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {fb.improvementTags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {fb.comment && (
                    <p className="text-[11px] text-slate-600 italic">
                      "{fb.comment}"
                    </p>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                    <span>{fb.date}</span>
                    <button
                      onClick={() => {
                        const cleanPhone = fb.customerPhone.replace(/[^0-9]/g, "");
                        const replyMsg = `Hi ${fb.customerName}! ✨ Thank you so much for your kind feedback and for visiting ${salon.name}. We really appreciate your support and can't wait to see you again! 💖`;
                        window.open(
                          `https://wa.me/${cleanPhone}?text=${encodeURIComponent(replyMsg)}`,
                          "_blank"
                        );
                      }}
                      className="text-emerald-700 font-bold hover:underline"
                    >
                      Thank via WhatsApp →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
