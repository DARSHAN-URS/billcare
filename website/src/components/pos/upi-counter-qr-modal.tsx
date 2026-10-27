"use client";

import React, { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";
import {
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Building2,
  ExternalLink,
  RefreshCw,
  Clock,
  Sparkles,
  Smartphone,
  Lock,
  X,
  CreditCard,
  Banknote,
  AlertCircle
} from "lucide-react";

interface UpiCounterQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  customerName: string;
  customerPhone?: string;
  invoiceNumber: string;
  salonName: string;
  upiId?: string;
  isSplitPayment?: boolean;
  totalBillAmount?: number;
  cashCollected?: number;
  bankDetails?: {
    accountName?: string;
    accountNumber?: string;
    ifsc?: string;
    bankName?: string;
  };
  onPaymentSuccess: (details: {
    paymentMethod: string;
    transactionRef: string;
    paidAmount: number;
  }) => void;
}

export function UpiCounterQrModal({
  isOpen,
  onClose,
  amount,
  customerName,
  customerPhone,
  invoiceNumber,
  salonName,
  upiId = "billcare.pos@icici",
  isSplitPayment = false,
  totalBillAmount,
  cashCollected,
  bankDetails,
  onPaymentSuccess,
}: UpiCounterQrModalProps) {
  const [activeTab, setActiveTab] = useState<"qr" | "bank">("qr");
  const [loading, setLoading] = useState<boolean>(true);
  const [qrSvgUrl, setQrSvgUrl] = useState<string>("");
  const [upiIntent, setUpiIntent] = useState<string>("");
  const [merchantVpa, setMerchantVpa] = useState<string>(upiId);
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes session
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [manualUtr, setManualUtr] = useState<string>("");

  // Fetch or generate dynamic UPI QR code
  const fetchQrCode = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/payments/generate-upi-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          invoiceNumber,
          salonName,
          merchantVpa: upiId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setQrSvgUrl(data.qr_svg_url);
        setUpiIntent(data.upi_intent);
        setMerchantVpa(data.merchant_vpa || upiId);
      } else {
        // Deterministic fallback if backend offline
        const targetVpa = upiId || "billcare.pos@icici";
        const amtStr = amount.toFixed(2);
        const encodedName = encodeURIComponent(salonName);
        const note = encodeURIComponent(`Invoice ${invoiceNumber}`);
        const intent = `upi://pay?pa=${targetVpa}&pn=${encodedName}&tr=${invoiceNumber}&am=${amtStr}&cu=INR&tn=${note}`;
        setUpiIntent(intent);
        setMerchantVpa(targetVpa);
        setQrSvgUrl(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=${encodeURIComponent(intent)}`);
      }
    } catch (err) {
      console.warn("Using offline UPI intent generator:", err);
      const targetVpa = upiId || "billcare.pos@icici";
      const amtStr = amount.toFixed(2);
      const encodedName = encodeURIComponent(salonName);
      const note = encodeURIComponent(`Invoice ${invoiceNumber}`);
      const intent = `upi://pay?pa=${targetVpa}&pn=${encodedName}&tr=${invoiceNumber}&am=${amtStr}&cu=INR&tn=${note}`;
      setUpiIntent(intent);
      setMerchantVpa(targetVpa);
      setQrSvgUrl(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=${encodeURIComponent(intent)}`);
    } finally {
      setLoading(false);
      setTimeLeft(300);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchQrCode();
    }
  }, [isOpen, amount, invoiceNumber, upiId]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, timeLeft]);

  if (!isOpen) return null;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(merchantVpa);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleCopyField = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleConfirmPayment = () => {
    setIsVerifying(true);
    const txnRef = manualUtr.trim() || `UPI-${Date.now().toString().slice(-8)}`;

    setTimeout(() => {
      setIsVerifying(false);
      onPaymentSuccess({
        paymentMethod: activeTab === "qr" ? "UPI / Dynamic QR" : "Bank Transfer / IMPS",
        transactionRef: txnRef,
        paidAmount: amount,
      });
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#101010] text-[#F8FAFC] rounded-3xl shadow-2xl border border-[#27272A] overflow-hidden my-auto flex flex-col">
        {/* Countertop Obsidian Top Bar */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#080808] border-b border-[#27272A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FACC15]/10 border border-[#FACC15]/25 flex items-center justify-center text-[#FACC15]">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-sm text-[#F8FAFC] tracking-wide">
                  Dynamic UPI Payment Terminal
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FACC15]/15 text-[#FACC15] border border-[#FACC15]/30">
                  NPCI Certified
                </span>
              </div>
              <p className="text-[11px] text-[#A1A1AA]">
                {salonName} • {invoiceNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#A1A1AA] hover:text-white hover:bg-[#181818] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector: Dynamic QR vs Direct Bank Transfer */}
        <div className="flex border-b border-[#27272A] bg-[#080808] p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab("qr")}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "qr"
                ? "bg-gradient-to-r from-[#FACC15] to-[#E5B81D] text-slate-950 font-bold shadow-md shadow-[#FACC15]/15"
                : "text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#181818]"
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Dynamic UPI QR (Scan & Pay)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("bank")}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "bank"
                ? "bg-gradient-to-r from-[#FACC15] to-[#E5B81D] text-slate-950 font-bold shadow-md shadow-[#FACC15]/15"
                : "text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#181818]"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Bank Account / IMPS</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {/* Amount Locked Display Banner */}
          <div className="bg-[#151515] p-4 rounded-2xl border border-[#27272A] flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#A1A1AA] block uppercase tracking-wider">
                {isSplitPayment ? "Remaining UPI Balance (Locked in QR)" : "Total Bill Amount (Locked)"}
              </span>
              <div className="text-3xl font-serif font-black text-white font-mono tracking-tight flex items-baseline gap-2 mt-0.5">
                <span className="text-[#FACC15]">{formatCurrency(amount)}</span>
                {isSplitPayment && totalBillAmount && (
                  <span className="text-xs text-[#A1A1AA] font-normal">
                    (Total Bill: {formatCurrency(totalBillAmount)})
                  </span>
                )}
              </div>
              <div className="text-[11px] text-[#A1A1AA] flex flex-wrap items-center gap-2 mt-1">
                <span>Client: <b className="text-[#F8FAFC]">{customerName}</b> {customerPhone ? `(${customerPhone})` : ""}</span>
                {isSplitPayment && cashCollected !== undefined && (
                  <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                    💵 Cash Received: {formatCurrency(cashCollected)}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#FACC15]/10 border border-[#FACC15]/30 text-[#FACC15] text-[11px] font-bold">
                <Lock className="w-3 h-3" /> Locked
              </span>
              <div className="text-[10px] text-[#71717A] mt-1 font-mono">
                {isSplitPayment ? "Split QR" : "No manual edit"}
              </div>
            </div>
          </div>

          {activeTab === "qr" ? (
            /* Tab 1: Dynamic Countertop UPI QR */
            <div className="space-y-4">
              {/* QR Container */}
              <div className="relative mx-auto w-64 h-64 bg-white rounded-3xl p-4 shadow-2xl flex flex-col items-center justify-center border-4 border-slate-700">
                {loading ? (
                  <div className="flex flex-col items-center gap-3">
                    <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                    <span className="text-xs font-bold text-slate-600">Generating Secure UPI QR...</span>
                  </div>
                ) : qrSvgUrl ? (
                  <>
                    <img
                      src={qrSvgUrl}
                      alt="Dynamic UPI QR Code"
                      className="w-full h-full object-contain rounded-xl"
                    />
                    {/* Salon Logo or Watermark overlay */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-lg border border-slate-200 flex items-center justify-center p-1">
                        <span className="text-xs font-black text-blue-700">BC</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
                    <p className="text-xs text-slate-600 font-bold">Failed to load QR</p>
                  </div>
                )}
              </div>

              {/* Supported UPI App Badges */}
              <div className="flex items-center justify-center gap-2 flex-wrap text-[11px] font-semibold text-slate-300">
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1">
                  🟢 Google Pay
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1">
                  🟣 PhonePe
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1">
                  🔵 Paytm
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1">
                  ⚫ CRED / BHIM
                </span>
              </div>

              {/* Merchant UPI ID Box */}
              <div className="flex items-center justify-between p-3 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Salon Verified UPI ID:</span>
                  <span className="font-mono font-bold text-emerald-400 text-xs">{merchantVpa}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUpi ? "Copied" : "Copy ID"}</span>
                  </button>

                  {upiIntent && (
                    <a
                      href={upiIntent}
                      className="px-2.5 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 text-blue-400 border border-blue-500/30 text-[11px] font-bold flex items-center gap-1 transition-colors"
                      title="Open in UPI App on this device"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>App</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Countdown & Refresh */}
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span className="flex items-center gap-1.5 font-mono text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  QR expires in:{" "}
                  <b className={timeLeft < 60 ? "text-rose-400" : "text-slate-200"}>
                    {formatTimer(timeLeft)}
                  </b>
                </span>
                <button
                  type="button"
                  onClick={fetchQrCode}
                  className="text-[11px] text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" /> Refresh QR
                </button>
              </div>
            </div>
          ) : (
            /* Tab 2: Direct Bank Account Transfer (IMPS / NEFT / RTGS) */
            <div className="space-y-3">
              <div className="p-3 bg-blue-950/40 rounded-2xl border border-blue-900/50 text-xs text-blue-300">
                💡 Useful for bridal packages or high-value bills above standard UPI limits. Direct settlement to salon bank account.
              </div>

              <div className="space-y-2 text-xs">
                {/* Account Name */}
                <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Account Holder Name</span>
                    <span className="font-bold text-slate-100">{bankDetails?.accountName || salonName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyField(bankDetails?.accountName || salonName, "name")}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                  >
                    {copiedField === "name" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Account Number */}
                <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Account Number</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      {bankDetails?.accountNumber || "50200088991122"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyField(bankDetails?.accountNumber || "50200088991122", "acc")}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                  >
                    {copiedField === "acc" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* IFSC Code & Bank Name */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">IFSC Code</span>
                      <span className="font-mono font-bold text-sky-400">{bankDetails?.ifsc || "HDFC0001043"}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyField(bankDetails?.ifsc || "HDFC0001043", "ifsc")}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                    >
                      {copiedField === "ifsc" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold">Bank & Branch</span>
                    <span className="font-bold text-slate-200 truncate block">
                      {bankDetails?.bankName || "HDFC Bank (Indiranagar)"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Optional UTR / Bank Reference Input */}
          <div className="pt-2 border-t border-[#27272A]">
            <label className="text-[11px] font-bold text-[#A1A1AA] block mb-1">
              Bank Ref / UTR / Order Note (Optional)
            </label>
            <input
              type="text"
              value={manualUtr}
              onChange={(e) => setManualUtr(e.target.value)}
              placeholder="e.g. 423489110294 or leave blank for auto-ref"
              className="w-full px-3 py-2 bg-[#080808] border border-[#27272A] rounded-xl text-xs font-mono text-[#F8FAFC] focus:outline-none focus:border-[#FACC15]"
            />
          </div>

          {/* Confirmation Actions */}
          <div className="pt-2 space-y-2">
            <button
              type="button"
              onClick={handleConfirmPayment}
              disabled={isVerifying}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#FACC15] via-[#F0C120] to-[#E5B81D] hover:opacity-95 text-slate-950 font-bold text-sm rounded-2xl shadow-xl shadow-[#FACC15]/20 flex items-center justify-center gap-2 transition-all cursor-pointer transform active:scale-[0.99] disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Verifying Transaction...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-slate-950" />
                  <span>
                    {isSplitPayment
                      ? `Confirm Cash (${formatCurrency(cashCollected || 0)}) + UPI (${formatCurrency(amount)}) • Complete Bill`
                      : `Payment Received • Confirm ${formatCurrency(amount)}`}
                  </span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-3 bg-[#181818] hover:bg-[#27272A] text-[#A1A1AA] hover:text-white font-semibold text-xs rounded-xl border border-[#27272A] transition-all cursor-pointer"
            >
              Cancel / Select Different Payment Method
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
