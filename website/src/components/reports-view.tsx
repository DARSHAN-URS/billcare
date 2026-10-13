"use client";

import React, { useState } from "react";
import { useDemo } from "@/lib/demo-context";
import { formatCurrency } from "@/lib/utils";
import {
  BarChart3,
  TrendingUp,
  Receipt,
  CreditCard,
  QrCode,
  Banknote,
  Split,
  Calendar,
  Printer,
  FileSpreadsheet,
  Users,
  Percent,
  Download,
  Building2,
  Sparkles,
} from "lucide-react";

export function ReportsView() {
  const { salon, invoices, staff } = useDemo();

  const [dateFilter, setDateFilter] = useState<"Today" | "Week" | "Month">("Today");

  // Calculations
  const totalGrossRevenue = invoices.reduce((acc, inv) => acc + inv.total, 0);
  const totalDiscounts = invoices.reduce((acc, inv) => acc + inv.discount, 0);
  const totalGst = invoices.reduce((acc, inv) => acc + inv.gstAmount, 0);

  // Service vs Product breakdown
  let totalServiceRevenue = 0;
  let totalRetailRevenue = 0;

  invoices.forEach((inv) => {
    inv.items.forEach((item) => {
      if (item.type === "service") {
        totalServiceRevenue += item.price * item.quantity;
      } else {
        totalRetailRevenue += item.price * item.quantity;
      }
    });
  });

  // Payment Breakdown
  const upiTotal = invoices
    .filter((inv) => inv.paymentMethod === "UPI")
    .reduce((acc, inv) => acc + inv.total, 0);
  const cardTotal = invoices
    .filter((inv) => inv.paymentMethod === "Card")
    .reduce((acc, inv) => acc + inv.total, 0);
  const cashTotal = invoices
    .filter((inv) => inv.paymentMethod === "Cash")
    .reduce((acc, inv) => acc + inv.total, 0);
  const splitTotal = invoices
    .filter((inv) => inv.paymentMethod === "Split")
    .reduce((acc, inv) => acc + inv.total, 0);

  const avgTicket = Math.round(totalGrossRevenue / (invoices.length || 1));

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = "InvoiceNumber,Date,Customer,PaymentMethod,Subtotal,Discount,GST,Total\n";
    const rows = invoices
      .map(
        (i) =>
          `"${i.invoiceNumber}","${i.date}","${i.customerName}","${i.paymentMethod}",${i.subtotal},${i.discount},${i.gstAmount},${i.total}`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ruvexi_sales_report_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="luxury-card p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 border border-white/20">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Executive Sales & Financial Intelligence
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                GST Ready
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Daily revenue ledger • Payment tender settlement • Staff commission distribution
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-2xs transition-all"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
          >
            <Printer className="w-3.5 h-3.5" /> Print Ledger
          </button>
        </div>
      </div>

      {/* Primary KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="luxury-card p-5 rounded-3xl border-slate-200">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Gross Billed Revenue
          </span>
          <h3 className="text-2xl font-black text-slate-900 font-mono mt-1">
            {formatCurrency(totalGrossRevenue)}
          </h3>
          <span className="text-[11px] text-emerald-600 font-bold mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +18.4% vs last cycle
          </span>
        </div>

        <div className="luxury-card p-5 rounded-3xl border-slate-200">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Average Ticket Size
          </span>
          <h3 className="text-2xl font-black text-blue-600 font-mono mt-1">
            {formatCurrency(avgTicket)}
          </h3>
          <span className="text-[11px] text-slate-500 font-medium mt-2 block">
            Across {invoices.length} completed tickets
          </span>
        </div>

        <div className="luxury-card p-5 rounded-3xl border-slate-200">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Net GST Collected (5%)
          </span>
          <h3 className="text-2xl font-black text-indigo-600 font-mono mt-1">
            {formatCurrency(totalGst)}
          </h3>
          <span className="text-[11px] text-slate-500 font-medium mt-2 block">
            CGST: {formatCurrency(Math.round(totalGst / 2))} • SGST:{" "}
            {formatCurrency(Math.round(totalGst / 2))}
          </span>
        </div>

        <div className="luxury-card p-5 rounded-3xl border-slate-200">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Total Privilege Vouchers
          </span>
          <h3 className="text-2xl font-black text-amber-600 font-mono mt-1">
            {formatCurrency(totalDiscounts)}
          </h3>
          <span className="text-[11px] text-amber-700 font-medium mt-2 block">
            Customer retention promotions
          </span>
        </div>
      </div>

      {/* Two Column Section: Payment Mode Breakdown & Revenue Mix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Tender Settlement */}
        <div className="luxury-card p-6 rounded-3xl space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-600" />
            Payment Mode Settlement Distribution
          </h3>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs">UPI & Dynamic QR</h4>
                  <span className="text-[11px] text-slate-400 font-mono">0% Merchant Fee</span>
                </div>
              </div>
              <span className="font-black text-slate-900 font-mono text-sm">
                {formatCurrency(upiTotal)}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-800">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs">Credit & Debit Cards</h4>
                  <span className="text-[11px] text-slate-400 font-mono">Visa / Mastercard / RuPay</span>
                </div>
              </div>
              <span className="font-black text-slate-900 font-mono text-sm">
                {formatCurrency(cardTotal)}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                  <Banknote className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs">Physical Cash Register</h4>
                  <span className="text-[11px] text-slate-400 font-mono">Counter Tender</span>
                </div>
              </div>
              <span className="font-black text-slate-900 font-mono text-sm">
                {formatCurrency(cashTotal)}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-100 text-purple-800">
                  <Split className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs">Multi-Tender Split Pay</h4>
                  <span className="text-[11px] text-slate-400 font-mono">Combined Tenders</span>
                </div>
              </div>
              <span className="font-black text-slate-900 font-mono text-sm">
                {formatCurrency(splitTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Revenue Mix: Salon Services vs Retail Products */}
        <div className="luxury-card p-6 rounded-3xl space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            Revenue Category Split
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-700">Salon Treatment Services</span>
                <span className="text-slate-900 font-mono">
                  {formatCurrency(totalServiceRevenue)} (88%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full w-[88%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-700">Retail Product Sales (Moroccanoil, Olaplex)</span>
                <span className="text-slate-900 font-mono">
                  {formatCurrency(totalRetailRevenue)} (12%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 h-full rounded-full w-[12%]" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100/80 text-xs">
              <h4 className="font-extrabold text-indigo-950">Retail Upsell Insight</h4>
              <p className="text-indigo-900 mt-1">
                Top performing salons maintain a 15–20% retail ratio. Encourage stylists to suggest take-home hair masks following chemical services.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Commission Distribution Leaderboard */}
      <div className="luxury-card p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Stylist & Artist Performance Leaderboard
            </h3>
            <p className="text-xs text-slate-500">
              Individual billings, assigned treatments, and credited commissions
            </p>
          </div>
          <span className="text-xs font-black text-purple-700 bg-purple-50 px-3 py-1 rounded-xl border border-purple-200">
            {staff.length} Artists Credited
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Artist Name & Specialty</th>
                <th className="py-3 px-4">Services Done</th>
                <th className="py-3 px-4">Commission Rate</th>
                <th className="py-3 px-4 text-right">Today's Revenue</th>
                <th className="py-3 px-4 text-right">Commission Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staff.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={st.avatar}
                        alt={st.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <div>
                        <span className="font-extrabold text-slate-900 block">{st.name}</span>
                        <span className="text-[10px] text-slate-400">{st.role}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    {st.todayServicesCount} treatments
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                    {st.commissionRate}%
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-slate-900 font-mono">
                    {formatCurrency(st.todayRevenue)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-emerald-600 font-mono">
                    {formatCurrency(st.todayCommission)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
