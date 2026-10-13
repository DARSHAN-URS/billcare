"use client";

import React, { useRef } from "react";
import { Invoice, SalonProfile } from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle2, Printer, Share2, X, Sparkles, Building2, Phone, QrCode, ShieldCheck, Crown } from "lucide-react";

interface InvoiceModalProps {
  invoice: Invoice;
  salon: SalonProfile;
  onClose: () => void;
}

export function InvoiceModal({ invoice, salon, onClose }: InvoiceModalProps) {
  const [copied, setCopied] = React.useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Hi ${invoice.customerName}! ✨ Thank you for visiting ${salon.name}. Here is your official tax receipt ${invoice.invoiceNumber} for ${formatCurrency(invoice.total)}.\n\nServices: ${invoice.items.map((i) => i.name).join(", ")}\nTotal Paid: ${formatCurrency(invoice.total)} via ${invoice.paymentMethod}\n\nWe look forward to welcoming you back!`
    );
    const phoneClean = invoice.customerPhone.replace(/[^0-9]/g, "");
    if (phoneClean && phoneClean.length > 5) {
      window.open(`https://wa.me/${phoneClean}?text=${text}`, "_blank");
    } else {
      navigator.clipboard.writeText(decodeURIComponent(text));
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-2.5 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-4 sm:my-8 max-h-[92vh] flex flex-col">
        {/* Top Obsidian Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-3.5 sm:py-4 bg-[#0b0f19] text-white border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/30">
              <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
            </span>
            <div>
              <h3 className="font-extrabold text-sm tracking-wide text-white">Official Tax Invoice & Certificate</h3>
              <p className="text-[11px] text-slate-400 font-mono">{invoice.invoiceNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all shadow-md shadow-emerald-600/20"
              title="Share via WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              {copied ? "Copied!" : "WhatsApp Share"}
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-md shadow-blue-600/20"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Receipt
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Luxury Invoice Container */}
        <div ref={printRef} className="p-8 md:p-10 space-y-6 text-slate-800 bg-white relative">
          {/* Watermark brand emblem */}
          <div className="absolute right-8 top-32 text-[120px] font-black text-slate-900/[0.02] select-none pointer-events-none">
            R
          </div>

          {/* Salon Brand Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-slate-100 pb-8">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Building2 className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-black text-slate-950 tracking-tight">{salon.name}</h2>
              </div>
              <p className="text-xs text-slate-500 font-medium italic">{salon.tagline}</p>
              <p className="text-xs text-slate-600 max-w-sm mt-2">{salon.address}</p>
              <p className="text-xs text-slate-500 flex items-center gap-2 pt-1 font-mono">
                <Phone className="w-3 h-3 text-slate-400" /> {salon.phone} • {salon.email}
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100/90 text-slate-800 rounded-lg text-[11px] font-mono font-bold border border-slate-200">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> GSTIN: {salon.gstin}
              </div>
            </div>

            <div className="text-left md:text-right bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 min-w-[210px] space-y-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" /> PAID IN FULL
              </span>
              <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Invoice Serial No:</p>
              <p className="text-sm font-mono font-extrabold text-slate-950">{invoice.invoiceNumber}</p>
              <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider pt-1">Date & Time:</p>
              <p className="text-xs font-semibold text-slate-700">{invoice.date}</p>
              <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider pt-1">Payment Method:</p>
              <p className="text-xs font-extrabold text-blue-600">{invoice.paymentMethod}</p>
            </div>
          </div>

          {/* Billed To Customer Box */}
          <div className="bg-gradient-to-r from-blue-50/70 to-indigo-50/70 border border-blue-100 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest block">
                Billed To (Client):
              </span>
              <h4 className="text-base font-extrabold text-slate-900 mt-0.5">{invoice.customerName}</h4>
              <p className="text-xs text-slate-600 font-mono">{invoice.customerPhone}</p>
            </div>
            <div className="text-left md:text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Branch</span>
              <p className="text-xs font-extrabold text-slate-800">{salon.branch}</p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 text-slate-700 font-extrabold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Treatment / Retail Item</th>
                  <th className="py-3 px-4">Master Artist</th>
                  <th className="py-3 px-3 text-center">Qty</th>
                  <th className="py-3 px-3 text-right">Unit Price</th>
                  <th className="py-3 px-4 text-right">Net Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <span className="text-[9px] uppercase font-black tracking-widest px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-semibold">{item.staffName || "House"}</td>
                    <td className="py-3.5 px-3 text-center font-bold text-slate-800">{item.quantity}</td>
                    <td className="py-3.5 px-3 text-right text-slate-600 font-mono">{formatCurrency(item.price)}</td>
                    <td className="py-3.5 px-4 text-right font-black text-slate-900 font-mono">
                      {formatCurrency(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Breakdown */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 pt-2">
            <div className="flex items-center gap-3.5 p-4 bg-slate-50/80 rounded-2xl border border-slate-200 text-xs text-slate-500 max-w-sm">
              <QrCode className="w-12 h-12 text-slate-800 shrink-0" />
              <div className="space-y-0.5">
                <p className="font-extrabold text-slate-800">Govt. E-Invoice & GST Seal</p>
                <p className="text-[11px] leading-relaxed text-slate-500">
                  Digitally certified tax receipt. Valid for input tax credit & rewards claim.
                </p>
              </div>
            </div>

            <div className="w-full md:w-72 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Subtotal (Before Tax):</span>
                <span className="font-bold text-slate-800 font-mono">{formatCurrency(invoice.subtotal)}</span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Privilege Voucher:</span>
                  <span className="font-mono">- {formatCurrency(invoice.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600 font-medium">
                <span>GST (CGST 2.5% + SGST 2.5%):</span>
                <span className="font-bold text-slate-800 font-mono">{formatCurrency(invoice.gstAmount)}</span>
              </div>
              <div className="border-t-2 border-slate-900 pt-2 flex justify-between text-base font-black text-slate-900">
                <span>Total Amount:</span>
                <span className="text-blue-600 font-mono text-lg">{formatCurrency(invoice.total)}</span>
              </div>
              {invoice.splitDetails && (
                <div className="text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-600 space-y-1 mt-2">
                  <div className="font-bold text-slate-800">Split Payment Audit:</div>
                  <div className="flex justify-between font-mono">
                    <span>Cash Tendered:</span>
                    <span>{formatCurrency(invoice.splitDetails.cash)}</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span>UPI Transfer:</span>
                    <span>{formatCurrency(invoice.splitDetails.upi)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer certification */}
          <div className="text-center border-t border-slate-100 pt-6 text-[11px] text-slate-400">
            Thank you for indulging at {salon.name}. Designed & Powered by RUVEXI Salon SaaS OS.
          </div>
        </div>
      </div>
    </div>
  );
}
