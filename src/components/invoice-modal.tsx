"use client";

import React, { useRef } from "react";
import { Invoice, SalonProfile } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle2, Printer, Share2, X, Sparkles, Building2, Phone, QrCode, ShieldCheck, Crown, Receipt, FileText } from "lucide-react";
import { ThermalReceipt } from "./pos/thermal-receipt";

interface InvoiceModalProps {
  invoice: any;
  salon: any;
  onClose: () => void;
}

export function InvoiceModal({ invoice, salon, onClose }: InvoiceModalProps) {
  const [copied, setCopied] = React.useState(false);
  const [isSendingWhatsApp, setIsSendingWhatsApp] = React.useState(false);
  const [whatsAppResult, setWhatsAppResult] = React.useState<string | null>(null);
  const [razorpayData, setRazorpayData] = React.useState<{ upi_intent?: string; qr_svg_url?: string; short_url?: string } | null>(null);
  const [isGeneratingPayment, setIsGeneratingPayment] = React.useState(false);
  const [receiptMode, setReceiptMode] = React.useState<"a4" | "thermal">("a4");
  const printRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Automatically generate dynamic UPI QR code for this invoice amount
    handleGenerateRazorpayPayment();
  }, [invoice.invoiceNumber, invoice.total]);

  const handlePrint = () => {
    window.print();
  };

  const handleSendMetaWhatsApp = async () => {
    setIsSendingWhatsApp(true);
    setWhatsAppResult(null);

    try {
      const res = await fetch("/api/v1/whatsapp/send-bill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerPhone: invoice.customerPhone,
          customerName: invoice.customerName,
          invoiceNumber: invoice.invoiceNumber,
          totalAmount: invoice.total || invoice.grandTotal || 0,
          items: invoice.items || [],
          paymentLink: razorpayData?.short_url,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setWhatsAppResult(data.is_live ? "Dispatched via Meta Graph API v20.0" : "Dispatched via Meta Cloud API");
      } else {
        setWhatsAppResult("Direct link ready");
      }
    } catch {
      setWhatsAppResult("Sent via Web Client");
    } finally {
      setIsSendingWhatsApp(false);
    }
  };

  const handleGenerateRazorpayPayment = async () => {
    setIsGeneratingPayment(true);
    try {
      // 1. Generate Dynamic UPI QR Code
      const qrRes = await fetch("/api/v1/payments/generate-upi-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: invoice.total || invoice.grandTotal || 0,
          invoiceNumber: invoice.invoiceNumber,
          salonName: salon.name,
          merchantVpa: salon.upiId || "billcare.pos@icici",
        }),
      });
      const qrData = await qrRes.json();

      // 2. Generate Razorpay Payment Link
      const linkRes = await fetch("/api/v1/payments/create-payment-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: invoice.total || invoice.grandTotal || 0,
          customerName: invoice.customerName,
          customerPhone: invoice.customerPhone,
          description: `Salon Bill #${invoice.invoiceNumber}`,
          receipt: invoice.invoiceNumber,
        }),
      });
      const linkData = await linkRes.json();

      setRazorpayData({
        upi_intent: qrData.upi_intent,
        qr_svg_url: qrData.qr_svg_url,
        short_url: linkData.short_url,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingPayment(false);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Hi ${invoice.customerName}! ✨ Thank you for visiting ${salon.name}. Here is your official tax receipt ${invoice.invoiceNumber} for ${formatCurrency(invoice.total || invoice.grandTotal || 0)}.\n\nServices: ${invoice.items?.map((i: any) => i.name).join(", ")}\nTotal Paid: ${formatCurrency(invoice.total || invoice.grandTotal || 0)} via ${invoice.paymentMethod}\n\nWe look forward to welcoming you back!`
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2.5 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#101010] rounded-2xl sm:rounded-3xl shadow-2xl border border-[#27272A] overflow-hidden my-4 sm:my-8 max-h-[92vh] flex flex-col">
        {/* Top Obsidian Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-3.5 sm:py-4 bg-[#080808] text-white border-b border-[#27272A] shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-[#FACC15]/10 text-[#FACC15] border border-[#FACC15]/25">
              <Crown className="w-4 h-4 text-[#FACC15] fill-[#FACC15]" />
            </span>
            <div>
              <h3 className="font-serif font-bold text-sm tracking-wide text-[#F8FAFC]">Official Tax Invoice & Certificate</h3>
              <p className="text-[11px] text-[#A1A1AA] font-mono">{invoice.invoiceNumber}</p>
            </div>
          </div>
          {/* Format Switcher: A4 vs 80mm Thermal */}
          <div className="flex items-center bg-[#181818] p-1 rounded-xl border border-[#27272A] self-start sm:self-auto">
            <button
              onClick={() => setReceiptMode("a4")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                receiptMode === "a4"
                  ? "bg-[#FACC15] text-slate-950 shadow-sm"
                  : "text-[#A1A1AA] hover:text-[#F8FAFC]"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>A4 Invoice</span>
            </button>
            <button
              onClick={() => setReceiptMode("thermal")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                receiptMode === "thermal"
                  ? "bg-[#FACC15] text-slate-950 shadow-sm"
                  : "text-[#A1A1AA] hover:text-[#F8FAFC]"
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>80mm Thermal</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Meta WhatsApp Cloud API Direct Dispatch */}
            <button
              onClick={handleSendMetaWhatsApp}
              disabled={isSendingWhatsApp}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-[#25D366] hover:bg-[#20ba59] text-slate-950 rounded-xl transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50 cursor-pointer"
              title="Dispatch via Official Meta WhatsApp Cloud API"
            >
              <Phone className="w-3.5 h-3.5 text-slate-950" />
              <span>{isSendingWhatsApp ? "Dispatching..." : "Meta WhatsApp"}</span>
            </button>

            {/* Razorpay Dynamic UPI QR / Link */}
            <button
              onClick={handleGenerateRazorpayPayment}
              disabled={isGeneratingPayment}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-[#181818] hover:bg-[#27272A] text-[#FACC15] border border-[#FACC15]/30 rounded-xl transition-all shadow-md disabled:opacity-50 cursor-pointer"
              title="Generate live Razorpay UPI QR & Payment Link"
            >
              <QrCode className="w-3.5 h-3.5 text-[#FACC15]" />
              <span>{isGeneratingPayment ? "Generating..." : "Razorpay UPI"}</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-[#151515] hover:bg-[#181818] text-[#F8FAFC] rounded-xl transition-all border border-[#27272A]"
              title="Copy or share via WhatsApp web client"
            >
              <Share2 className="w-3.5 h-3.5 text-[#A1A1AA]" />
              {copied ? "Copied!" : "Web Share"}
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-gradient-to-r from-[#FACC15] to-[#E5B81D] hover:opacity-95 text-slate-950 rounded-xl transition-all shadow-md shadow-[#FACC15]/20 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              {receiptMode === "thermal" ? "Print 80mm Slip" : "Print Invoice"}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#A1A1AA] hover:text-white hover:bg-[#181818] rounded-xl transition-colors ml-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Container based on receiptMode */}
        {receiptMode === "thermal" ? (
          <div className="p-6 md:p-8 bg-[#18181B] flex justify-center items-center overflow-y-auto">
            <ThermalReceipt invoice={invoice} salon={salon} onClose={onClose} />
          </div>
        ) : (
          /* Printable Luxury A4 Invoice Container */
          <div id="printable-invoice-content" ref={printRef} className="p-8 md:p-10 space-y-6 text-slate-800 bg-white relative">
            <style jsx global>{`
              @media print {
                body * {
                  visibility: hidden;
                }
                #printable-invoice-content,
                #printable-invoice-content * {
                  visibility: visible;
                }
                #printable-invoice-content {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                  padding: 15px !important;
                  margin: 0 !important;
                  box-shadow: none !important;
                  border: none !important;
                }
              }
            `}</style>
            {/* Watermark brand emblem */}
            <div className="absolute right-8 top-32 text-[100px] font-black text-slate-900/[0.03] select-none pointer-events-none tracking-tighter">
              BC
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
                {invoice.items?.map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <span className="text-[9px] uppercase font-black tracking-widest px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-semibold">{item.staffName || "House"}</td>
                    <td className="py-3.5 px-3 text-center font-bold text-slate-800">{item.quantity}</td>
                    <td className="py-3.5 px-3 text-right text-slate-600 font-mono">{formatCurrency(item.price || item.unitPrice || 0)}</td>
                    <td className="py-3.5 px-4 text-right font-black text-slate-900 font-mono">
                      {formatCurrency((item.price || item.unitPrice || 0) * (item.quantity || 1))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Breakdown */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 pt-2">
            {/* Live Dynamic UPI QR / E-Invoice Seal */}
            <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200 text-xs text-slate-600 max-w-sm space-y-2">
              <div className="flex items-center gap-3">
                {razorpayData?.qr_svg_url ? (
                  <img src={razorpayData.qr_svg_url} alt="Dynamic UPI QR" className="w-20 h-20 rounded-lg border border-slate-300 p-1 bg-white shrink-0 shadow-2xs" />
                ) : (
                  <div className="w-20 h-20 rounded-lg border border-slate-200 bg-white flex items-center justify-center shrink-0">
                    <QrCode className="w-10 h-10 text-slate-400" />
                  </div>
                )}
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <p className="font-extrabold text-slate-900">Dynamic UPI QR</p>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">Amount Locked</span>
                  </div>
                  <p className="text-[11px] font-mono text-emerald-700 font-bold truncate max-w-[190px]">
                    {salon.upiId || "billcare.pos@icici"}
                  </p>
                  <p className="text-[10px] leading-tight text-slate-500">
                    Scan with GPay, PhonePe, Paytm, or CRED to settle bill.
                  </p>
                </div>
              </div>

              {razorpayData?.short_url && (
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-700">Payment Link:</span>
                  <a href={razorpayData.short_url} target="_blank" rel="noreferrer" className="text-blue-600 font-mono font-bold hover:underline truncate max-w-[180px]">
                    {razorpayData.short_url}
                  </a>
                </div>
              )}

              {whatsAppResult && (
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{whatsAppResult}</span>
                </div>
              )}
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
            Thank you for indulging at {salon.name}. Designed & Powered by BillCare Solution Salon OS.
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
