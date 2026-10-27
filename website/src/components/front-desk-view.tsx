"use client";

import React, { useState } from "react";
import { useBillCare } from "@/lib/billcare-context";
import { formatCurrency } from "@/lib/utils";
import { Appointment, CustomerProfile, ServiceItem } from "@/lib/types";
import {
  Calendar,
  Clock,
  User,
  Plus,
  CheckCircle2,
  PlayCircle,
  Receipt,
  Phone,
  Scissors,
  X,
  MessageSquare,
  Sparkles,
  Users,
  Search,
  Check,
  ChevronRight,
  ArrowRight,
  Coffee,
  QrCode,
  DollarSign,
  Smartphone,
  ExternalLink,
  ShieldCheck,
  Heart,
  Tag,
  AlertCircle,
} from "lucide-react";

interface FrontDeskViewProps {
  onNavigateTab: (tab: string) => void;
  onGoToPosBilling?: (customerName: string, serviceName: string, staffName: string) => void;
}

export function FrontDeskView({ onNavigateTab, onGoToPosBilling }: FrontDeskViewProps) {
  const {
    salon,
    appointments,
    staff,
    services,
    customers,
    updateAppointmentStatus,
    bookAppointment,
    createInvoice,
    showToast,
  } = useBillCare();

  // Active status filter for appointments
  const [filterStatus, setFilterStatus] = useState<"All" | "Confirmed" | "In-Service" | "Completed">("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Step 1: Customer Enters Salon Modal (Old vs New Auto-Detect)
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [lookupInput, setLookupInput] = useState("");
  const [detectedCustomer, setDetectedCustomer] = useState<any>(null);
  const [isNewCustomer, setIsNewCustomer] = useState(false);

  // Form Fields
  const [walkInName, setWalkInName] = useState("");
  const [walkInPhone, setWalkInPhone] = useState("+91 ");
  const [walkInService, setWalkInService] = useState(services[0]?.name || "Haircut");
  const [walkInStaff, setWalkInStaff] = useState(staff[0]?.name || "Priya Sharma");

  // Step 2 & 3: Fill Services Taken for In-Chair Client Modal
  const [serviceModalApt, setServiceModalApt] = useState<any>(null);
  const [selectedServiceList, setSelectedServiceList] = useState<string[]>([]);

  // Step 4: Billing with QR & Split Pay Modal
  const [billingApt, setBillingApt] = useState<any>(null);
  const [payMethod, setPayMethod] = useState<"UPI" | "Cash" | "Split">("UPI");
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [upiAmount, setUpiAmount] = useState<number>(0);
  const [finalBillAmount, setFinalBillAmount] = useState<number>(0);

  // Step 5: WhatsApp Thank You Confirmation Modal
  const [whatsappSentModal, setWhatsappSentModal] = useState<{
    customerName: string;
    phone: string;
    amount: number;
    services: string;
    messageText: string;
  } | null>(null);

  // Filtered appointments
  const filteredAppointments = appointments.filter((apt) => {
    const matchesStatus = filterStatus === "All" || apt.status === filterStatus;
    const matchesSearch =
      apt.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.staffName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Simple counts
  const confirmedCount = appointments.filter((a) => a.status === "Confirmed").length;
  const inServiceCount = appointments.filter((a) => a.status === "In-Service").length;
  const completedCount = appointments.filter((a) => a.status === "Completed").length;

  // Free chair calculations
  const busyStaffNames = appointments
    .filter((a) => a.status === "In-Service")
    .map((a) => a.staffName);
  const freeStaff = staff.filter((s) => s.status === "clocked_in" && !busyStaffNames.includes(s.name));
  const busyStaff = staff.filter((s) => s.status === "clocked_in" && busyStaffNames.includes(s.name));

  // Auto-detect customer as receptionist types phone or name
  const handleLookupChange = (val: string) => {
    setLookupInput(val);
    const query = val.trim().toLowerCase();

    if (!query) {
      setDetectedCustomer(null);
      setIsNewCustomer(false);
      setWalkInName("");
      setWalkInPhone("+91 ");
      return;
    }

    const matched = customers.find(
      (c) =>
        c.phone.replace(/[^0-9]/g, "").includes(query.replace(/[^0-9]/g, "")) ||
        c.name.toLowerCase().includes(query)
    );

    if (matched) {
      setDetectedCustomer(matched);
      setIsNewCustomer(false);
      setWalkInName(matched.name);
      setWalkInPhone(matched.phone);
      if (matched.preferredStaff) {
        setWalkInStaff(matched.preferredStaff);
      }
    } else {
      setDetectedCustomer(null);
      setIsNewCustomer(true);
      if (!val.startsWith("+91") && /^[0-9]/.test(val)) {
        setWalkInPhone("+91 " + val);
      } else if (!/^[0-9]/.test(val)) {
        setWalkInName(val);
      }
    }
  };

  // Receptionist clicks "Allot Chair & Begin Service"
  const handleAllotChairAndBegin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInName.trim()) return;

    const srv = services.find((s) => s.name === walkInService);
    const st = staff.find((s) => s.name === walkInStaff);

    bookAppointment({
      customerName: walkInName,
      customerPhone: walkInPhone || "+91 98000 00000",
      serviceName: walkInService,
      staffName: walkInStaff,
      staffId: st?.id || staff[0].id,
      time: "Right Now",
      durationMinutes: srv?.durationMinutes || 45,
      price: srv?.price || 1500,
      source: "Walk-in",
    });

    showToast(`Chair allotted! ${walkInName} seated with ${walkInStaff}.`);
    setShowWalkInModal(false);
    setLookupInput("");
    setDetectedCustomer(null);
    setIsNewCustomer(false);
  };

  // Open "Fill / Edit Services" modal for in-chair client
  const handleOpenServicesModal = (apt: any) => {
    setServiceModalApt(apt);
    setSelectedServiceList([apt.serviceName]);
  };

  const handleToggleService = (srvName: string) => {
    if (selectedServiceList.includes(srvName)) {
      if (selectedServiceList.length > 1) {
        setSelectedServiceList(selectedServiceList.filter((s) => s !== srvName));
      }
    } else {
      setSelectedServiceList([...selectedServiceList, srvName]);
    }
  };

  // Save selected services and go directly to billing
  const handleSaveServicesAndProceedToBill = () => {
    if (!serviceModalApt) return;
    const totalCalc = selectedServiceList.reduce((acc, sName) => {
      const match = services.find((s) => s.name === sName);
      return acc + (match?.price || 1500);
    }, 0);

    const updatedApt = {
      ...serviceModalApt,
      serviceName: selectedServiceList.join(" + "),
      price: totalCalc,
    };

    setServiceModalApt(null);
    handleOpenBillingModal(updatedApt);
  };

  // Open Billing Modal
  const handleOpenBillingModal = (apt: any) => {
    setBillingApt(apt);
    setFinalBillAmount(apt.price);
    setUpiAmount(apt.price);
    setCashAmount(0);
    setPayMethod("UPI");
  };

  // Handle Split amounts
  const handleCashChange = (val: number) => {
    setCashAmount(val);
    setUpiAmount(Math.max(0, finalBillAmount - val));
  };

  const handleUpiChange = (val: number) => {
    setUpiAmount(val);
    setCashAmount(Math.max(0, finalBillAmount - val));
  };

  // Receptionist finishes bill & triggers WhatsApp Thank You
  const handleCompleteBillAndSendWhatsApp = () => {
    if (!billingApt) return;

    // Create the invoice in system
    createInvoice({
      customerName: billingApt.customerName,
      customerPhone: billingApt.customerPhone,
      items: [
        {
          id: "item_1",
          name: billingApt.serviceName,
          type: "service",
          price: finalBillAmount,
          quantity: 1,
          staffId: billingApt.staffId,
          staffName: billingApt.staffName,
        },
      ],
      subtotal: finalBillAmount,
      discount: 0,
      gstAmount: Math.round(finalBillAmount * 0.05),
      total: finalBillAmount,
      paymentMethod: payMethod,
      splitDetails:
        payMethod === "Split" ? { cash: cashAmount, upi: upiAmount } : undefined,
      status: "Paid",
    });

    // Mark appointment as Completed
    updateAppointmentStatus(billingApt.id, "Completed");

    // Prepare friendly WhatsApp message with instant Feedback link
    const cleanPhone = billingApt.customerPhone.replace(/[^0-9]/g, "");
    const feedbackUrl = `https://billcare.io/feedback?name=${encodeURIComponent(
      billingApt.customerName
    )}&phone=${encodeURIComponent(cleanPhone)}&staff=${encodeURIComponent(
      billingApt.staffName
    )}&service=${encodeURIComponent(billingApt.serviceName)}`;

    const messageText = `Hi ${billingApt.customerName}! ✨ Thank you for visiting ${salon.name} today.

🧾 Bill: ${formatCurrency(finalBillAmount)} received via ${payMethod} for ${billingApt.serviceName}.
💇 Stylist: ${billingApt.staffName}

⭐ How was your service by ${billingApt.staffName}?
Tap here to rate in 10 seconds & unlock a 10% return voucher:
👉 ${feedbackUrl}

We look forward to seeing you again soon! 💇‍♀️✨`;

    setWhatsappSentModal({
      customerName: billingApt.customerName,
      phone: cleanPhone || "919845012890",
      amount: finalBillAmount,
      services: billingApt.serviceName,
      messageText,
    });

    setBillingApt(null);
    showToast(`Payment of ${formatCurrency(finalBillAmount)} recorded! Ready for WhatsApp message.`);
  };

  return (
    <div className="space-y-6 text-[#F8FAFC]">
      {/* ============================================================ */}
      {/* FRONT DESK RECEPTIONIST HEADER */}
      {/* ============================================================ */}
      <div className="relative overflow-hidden bg-[#101010] border border-[#27272A] p-7 sm:p-8 rounded-2xl shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FACC15]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181818] border border-[#27272A] text-xs font-mono tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-[#10B981] font-semibold">Receptionist Floor Terminal</span>
              <span className="text-[#71717A]">•</span>
              <span className="text-[#A1A1AA]">Live Front Desk</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#F8FAFC] tracking-tight">
              Customer Enters Salon Workflow
            </h1>
            <p className="text-xs sm:text-sm text-[#A1A1AA] font-light max-w-xl leading-relaxed">
              1-Tap client check-in with automatic returning customer detection, stylist chair allotment, technical service records, and instant WhatsApp billing.
            </p>
          </div>

          {/* Primary Quick Receptionist Action */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setShowWalkInModal(true);
                setLookupInput("");
                setDetectedCustomer(null);
                setIsNewCustomer(false);
              }}
              className="px-5 py-3 bg-[#FACC15] hover:bg-[#EAB308] text-[#080808] font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Customer Enters Salon</span>
            </button>

            <button
              onClick={() => onNavigateTab("pos")}
              className="px-5 py-3 bg-[#181818] hover:bg-[#1C1C1C] text-[#F8FAFC] font-semibold text-xs rounded-xl border border-[#27272A] hover:border-[#FACC15]/50 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Receipt className="w-4 h-4 text-[#FACC15]" />
              <span>Direct POS Bill</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3 COUNTER METRICS FOR RECEPTIONIST */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setFilterStatus("Confirmed")}
          className={`bg-[#151515] p-5 rounded-2xl cursor-pointer border transition-all ${
            filterStatus === "Confirmed"
              ? "border-[#60A5FA] bg-[#181818]"
              : "border-[#27272A] hover:border-[#343438]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#71717A]">
              Waiting in Lounge
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#60A5FA]" />
          </div>
          <div className="font-serif text-3xl font-medium text-[#F8FAFC] mt-2">
            {confirmedCount} <span className="text-sm font-sans font-light text-[#71717A]">Clients</span>
          </div>
          <p className="text-xs text-[#60A5FA] font-mono mt-1">Ready to be seated →</p>
        </div>

        <div
          onClick={() => setFilterStatus("In-Service")}
          className={`bg-[#151515] p-5 rounded-2xl cursor-pointer border transition-all ${
            filterStatus === "In-Service"
              ? "border-[#FACC15] bg-[#181818]"
              : "border-[#27272A] hover:border-[#343438]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#71717A]">
              Currently in Chair
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#FACC15] animate-pulse" />
          </div>
          <div className="font-serif text-3xl font-medium text-[#FACC15] mt-2">
            {inServiceCount} <span className="text-sm font-sans font-light text-[#71717A]">Clients</span>
          </div>
          <p className="text-xs text-[#FACC15] font-mono mt-1">Services being rendered →</p>
        </div>

        <div
          onClick={() => setFilterStatus("Completed")}
          className={`bg-[#151515] p-5 rounded-2xl cursor-pointer border transition-all ${
            filterStatus === "Completed"
              ? "border-[#10B981] bg-[#181818]"
              : "border-[#27272A] hover:border-[#343438]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#71717A]">
              Finished & Billed Today
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
          </div>
          <div className="font-serif text-3xl font-medium text-[#10B981] mt-2">
            {completedCount} <span className="text-sm font-sans font-light text-[#71717A]">Clients</span>
          </div>
          <p className="text-xs text-[#10B981] font-mono mt-1">WhatsApp receipt sent →</p>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MAIN DESK SPLIT: CLIENT QUEUE (LEFT) + CHAIR BOARD (RIGHT) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Live Appointments & Queue */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#151515] border border-[#27272A] p-6 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#27272A]">
              <div>
                <h2 className="font-serif text-lg font-normal text-[#F8FAFC] tracking-tight">
                  Salon Floor Queue & Chairs
                </h2>
                <p className="text-xs text-[#71717A] font-light">
                  Step 1: Seat Client → Step 2: Fill Services Taken → Step 3: QR Bill & WhatsApp
                </p>
              </div>

              {/* Search in queue */}
              <div className="relative max-w-xs w-full">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
                <input
                  type="text"
                  placeholder="Search by client or stylist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#181818] border border-[#27272A] rounded-xl text-[#F8FAFC] placeholder-[#71717A] focus:outline-none focus:border-[#FACC15] font-sans"
                />
              </div>
            </div>

            {/* List of Clients */}
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-12 text-[#71717A] text-xs font-mono">
                No clients in this list. Click '+ Customer Enters Salon' to add one!
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAppointments.map((apt) => {
                  const isInChair = apt.status === "In-Service";
                  const isWaiting = apt.status === "Confirmed";
                  const isDone = apt.status === "Completed";

                  return (
                    <div
                      key={apt.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isInChair
                          ? "bg-[#181818] border-[#FACC15]/40 shadow-sm"
                          : isWaiting
                          ? "bg-[#181818] border-[#60A5FA]/40 shadow-sm"
                          : "bg-[#151515] border-[#27272A] opacity-75"
                      }`}
                    >
                      {/* Left client details */}
                      <div className="flex items-start gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            isInChair
                              ? "bg-[#FACC15]/20 text-[#FACC15] border border-[#FACC15]/30"
                              : isWaiting
                              ? "bg-[#60A5FA]/20 text-[#60A5FA] border border-[#60A5FA]/30"
                              : "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30"
                          }`}
                        >
                          {isInChair ? (
                            <Scissors className="w-5 h-5 text-[#FACC15]" />
                          ) : isWaiting ? (
                            <Clock className="w-5 h-5 text-[#60A5FA]" />
                          ) : (
                            <Check className="w-5 h-5 text-[#10B981]" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-sans font-medium text-sm text-[#F8FAFC]">
                              {apt.customerName}
                            </h3>
                            <span
                              className={`text-[9px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                isInChair
                                  ? "bg-[#FACC15]/15 text-[#FACC15] border border-[#FACC15]/30"
                                  : isWaiting
                                  ? "bg-[#60A5FA]/15 text-[#60A5FA] border border-[#60A5FA]/30"
                                  : "bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30"
                              }`}
                            >
                              {isInChair ? "In Chair" : isWaiting ? "Waiting" : "Billed & Done"}
                            </span>
                          </div>

                          <div className="text-xs text-[#A1A1AA] mt-1 flex flex-wrap items-center gap-2 font-light">
                            <span className="font-normal text-[#F8FAFC]">{apt.serviceName}</span>
                            <span>•</span>
                            <span>Stylist: <span className="text-[#FACC15]">{apt.staffName}</span></span>
                            <span>•</span>
                            <span className="font-mono font-medium text-[#FACC15]">
                              {formatCurrency(apt.price)}
                            </span>
                          </div>

                          <div className="text-[11px] text-[#71717A] mt-0.5 flex items-center gap-2 font-mono">
                            <Phone className="w-3 h-3 text-[#71717A]" />
                            <span>{apt.customerPhone}</span>
                            <span>•</span>
                            <span>Time: {apt.time}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Action Buttons */}
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        {/* WAITING: Click "Seat Client" */}
                        {isWaiting && (
                          <button
                            onClick={() => {
                              updateAppointmentStatus(apt.id, "In-Service");
                              showToast(`${apt.customerName} seated in chair with ${apt.staffName}!`);
                            }}
                            className="px-4 py-2 bg-[#FACC15] hover:bg-[#EAB308] text-[#080808] font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <PlayCircle className="w-4 h-4" />
                            <span>Allot & Seat</span>
                          </button>
                        )}

                        {/* IN-CHAIR: "Fill Services" and "Bill with QR" */}
                        {isInChair && (
                          <>
                            <button
                              onClick={() => handleOpenServicesModal(apt)}
                              className="px-3 py-2 bg-[#181818] hover:bg-[#1C1C1C] text-[#F8FAFC] border border-[#27272A] font-medium text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                              title="Add or change services customer took"
                            >
                              <Scissors className="w-3.5 h-3.5 text-[#FACC15]" />
                              <span>Fill Services</span>
                            </button>

                            <button
                              onClick={() => handleOpenBillingModal(apt)}
                              className="px-4 py-2 bg-[#10B981] hover:bg-[#2EB885] text-[#080808] font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <QrCode className="w-4 h-4" />
                              <span>QR Bill & Done</span>
                            </button>
                          </>
                        )}

                        {/* COMPLETED */}
                        {isDone && (
                          <button
                            onClick={() => {
                              const cleanPhone = apt.customerPhone.replace(/[^0-9]/g, "");
                              const msg = `Hi ${apt.customerName}! ✨ Thank you for visiting ${salon.name}. We hope you loved your styling by ${apt.staffName}! See you again soon! 💇‍♀️`;
                              window.open(
                                `https://wa.me/${cleanPhone || "919845012890"}?text=${encodeURIComponent(
                                  msg
                                )}`,
                                "_blank"
                              );
                            }}
                            className="px-3 py-2 bg-[#181818] hover:bg-[#1C1C1C] text-[#10B981] font-mono text-xs rounded-xl border border-[#27272A] hover:border-[#10B981]/40 transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>WhatsApp Again</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right 4 Cols: Real-Time Stylist Chair Availability Board */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#151515] border border-[#27272A] p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
              <div>
                <h3 className="font-serif text-lg font-normal text-[#F8FAFC]">Chair Availability</h3>
                <p className="text-[11px] text-[#71717A] font-mono">
                  {freeStaff.length} Free • {busyStaffNames.length} In-Service
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#181818] text-[#10B981] border border-[#27272A]">
                Floor Matrix
              </span>
            </div>

            {/* Stylists List */}
            <div className="space-y-2.5">
              {staff.map((s) => {
                const isBusy = busyStaffNames.includes(s.name);
                const isClockedIn = s.status === "clocked_in" || s.isClockedIn;

                return (
                  <div
                    key={s.id}
                    className="p-3 rounded-xl bg-[#181818] border border-[#27272A] flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={s.avatar}
                        alt={s.name}
                        className="w-8 h-8 rounded-lg object-cover border border-[#27272A] shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-medium text-[#F8FAFC] truncate">{s.name}</div>
                        <div className="text-[10px] text-[#71717A] truncate">
                          {s.specialty?.[0] || s.role}
                        </div>
                      </div>
                    </div>

                    <div>
                      {isBusy ? (
                        <span className="px-2.5 py-1 rounded-full bg-[#FACC15]/15 text-[#FACC15] border border-[#FACC15]/30 text-[10px] font-mono font-medium flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15] animate-pulse" />
                          In Chair
                        </span>
                      ) : isClockedIn ? (
                        <button
                          onClick={() => {
                            setWalkInStaff(s.name);
                            setShowWalkInModal(true);
                          }}
                          className="px-2.5 py-1 rounded-full bg-[#10B981]/15 hover:bg-[#10B981]/25 text-[#10B981] border border-[#10B981]/30 text-[10px] font-mono font-medium transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                          Free • Allot
                        </button>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-[#27272A] text-[#71717A] text-[10px] font-mono">
                          Off Shift
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MODAL 1: CUSTOMER ENTERS SALON (OLD VS NEW AUTO-DETECT) */}
      {/* ============================================================ */}
      {showWalkInModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#151515] border border-[#27272A] text-[#F8FAFC] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
              <div>
                <h3 className="font-serif text-lg font-normal text-[#F8FAFC]">
                  Customer Enters Salon
                </h3>
                <p className="text-xs text-[#71717A] font-light">
                  Type phone or name — returning customers are automatically recognized.
                </p>
              </div>
              <button
                onClick={() => setShowWalkInModal(false)}
                className="w-8 h-8 rounded-xl bg-[#181818] hover:bg-[#1C1C1C] text-[#71717A] hover:text-[#F8FAFC] border border-[#27272A] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Smart Search Box */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#A1A1AA]">
                Search Customer Phone Number or Name
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A]" />
                <input
                  type="text"
                  placeholder="e.g. 9845012890 or Ananya..."
                  value={lookupInput}
                  onChange={(e) => handleLookupChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#181818] border border-[#27272A] rounded-xl text-xs font-medium text-[#F8FAFC] placeholder-[#71717A] focus:outline-none focus:border-[#FACC15]"
                  autoFocus
                />
              </div>
            </div>

            {/* CASE A: OLD CUSTOMER FOUND! */}
            {detectedCustomer && (
              <div className="p-4 rounded-xl bg-[#181818] border border-[#10B981]/40 space-y-2.5 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[#10B981] font-mono text-xs">
                    <Sparkles className="w-4 h-4 text-[#10B981]" />
                    <span>Returning Client Recognized</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                    {detectedCustomer.visitsCount || detectedCustomer.totalVisits || 1} Past Visits
                  </span>
                </div>

                <div className="text-xs text-[#A1A1AA] space-y-1">
                  <div>
                    <span className="font-medium text-[#F8FAFC]">{detectedCustomer.name}</span> •{" "}
                    <span className="font-mono">{detectedCustomer.phone}</span>
                  </div>
                  <div className="text-[11px] text-[#71717A]">
                    Preferred Stylist:{" "}
                    <span className="text-[#FACC15]">
                      {detectedCustomer.preferredStaff || "Priya Sharma"}
                    </span>{" "}
                    • Last Service: {detectedCustomer.lastService || "Consultation"}
                  </div>
                  {detectedCustomer.formulaNotes && (
                    <div className="text-[11px] text-[#FACC15] bg-[#FACC15]/10 p-2 rounded-lg border border-[#FACC15]/20 font-mono">
                      Technical Formula: {detectedCustomer.formulaNotes}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CASE B: NEW CUSTOMER DETECTED */}
            {isNewCustomer && (
              <div className="p-4 rounded-xl bg-[#181818] border border-[#60A5FA]/40 space-y-3 animate-in fade-in">
                <div className="flex items-center gap-1.5 text-[#60A5FA] font-mono text-xs">
                  <User className="w-4 h-4 text-[#60A5FA]" />
                  <span>New Client Entry</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-[#A1A1AA]">Client Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Mehta"
                      value={walkInName}
                      onChange={(e) => setWalkInName(e.target.value)}
                      className="w-full px-3 py-2 bg-[#151515] border border-[#27272A] rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#FACC15]"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-[#A1A1AA]">WhatsApp Number *</label>
                    <input
                      type="text"
                      placeholder="+91 98..."
                      value={walkInPhone}
                      onChange={(e) => setWalkInPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-[#151515] border border-[#27272A] rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#FACC15] font-mono"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: ALLOT FREE CHAIR & STYLIST */}
            <form onSubmit={handleAllotChairAndBegin} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Initial Service */}
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[#A1A1AA]">Service Expected</label>
                  <select
                    value={walkInService}
                    onChange={(e) => setWalkInService(e.target.value)}
                    className="w-full px-3 py-2 bg-[#181818] border border-[#27272A] rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#FACC15]"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.name} className="bg-[#151515]">
                        {s.name} ({formatCurrency(s.price)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Available Stylist / Chair */}
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[#A1A1AA]">
                    Assign Stylist ({freeStaff.length} Free)
                  </label>
                  <select
                    value={walkInStaff}
                    onChange={(e) => setWalkInStaff(e.target.value)}
                    className="w-full px-3 py-2 bg-[#181818] border border-[#27272A] rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#FACC15]"
                  >
                    {staff.map((s) => {
                      const isFree = freeStaff.some((f) => f.id === s.id);
                      return (
                        <option key={s.id} value={s.name} className="bg-[#151515]">
                          {s.name} {isFree ? "• [FREE CHAIR]" : "• [Busy]"}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#27272A]">
                <button
                  type="button"
                  onClick={() => setShowWalkInModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium text-[#71717A] hover:text-[#F8FAFC] hover:bg-[#181818] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!walkInName.trim()}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#FACC15] hover:bg-[#EAB308] text-[#080808] uppercase tracking-wider shadow-md disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Allot Chair & Begin</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: FILL SERVICES TAKEN (DURING / AFTER SERVICE) */}
      {/* ============================================================ */}
      {serviceModalApt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#151515] border border-[#27272A] text-[#F8FAFC] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
              <div>
                <h3 className="font-serif text-lg font-normal text-[#F8FAFC]">
                  Services Taken • {serviceModalApt.customerName}
                </h3>
                <p className="text-xs text-[#71717A] font-light">
                  Select all services provided during this appointment session.
                </p>
              </div>
              <button
                onClick={() => setServiceModalApt(null)}
                className="w-8 h-8 rounded-xl bg-[#181818] hover:bg-[#1C1C1C] text-[#71717A] hover:text-[#F8FAFC] border border-[#27272A] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Service Selection Pills */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-[#A1A1AA]">Services Performed:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-1">
                {services.map((srv) => {
                  const isSelected = selectedServiceList.includes(srv.name);
                  return (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => handleToggleService(srv.name)}
                      className={`p-2.5 rounded-xl text-xs text-left border transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? "bg-[#181818] text-[#FACC15] border-[#FACC15] shadow-sm font-semibold"
                          : "bg-[#151515] text-[#A1A1AA] border-[#27272A] hover:border-[#343438]"
                      }`}
                    >
                      <span className="truncate">{srv.name}</span>
                      <span className="font-mono text-[11px] shrink-0 ml-1">
                        {formatCurrency(srv.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Total Calculation */}
            <div className="p-3.5 rounded-xl bg-[#181818] border border-[#27272A] flex items-center justify-between font-mono">
              <span className="text-xs text-[#71717A]">Updated Session Total:</span>
              <span className="text-lg font-serif text-[#FACC15] font-medium">
                {formatCurrency(
                  selectedServiceList.reduce((acc, sName) => {
                    const match = services.find((s) => s.name === sName);
                    return acc + (match?.price || 1500);
                  }, 0)
                )}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#27272A]">
              <button
                onClick={() => setServiceModalApt(null)}
                className="px-4 py-2 text-xs font-medium text-[#71717A] hover:text-[#F8FAFC] hover:bg-[#181818] rounded-xl cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={handleSaveServicesAndProceedToBill}
                className="px-5 py-2.5 bg-[#FACC15] hover:bg-[#EAB308] text-[#080808] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Receipt className="w-4 h-4" />
                <span>Save & Proceed to Billing</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: BILLING WITH SALON SHOP QR CODE & CASH/UPI SPLIT */}
      {/* ============================================================ */}
      {billingApt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#151515] border border-[#27272A] text-[#F8FAFC] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
              <div>
                <h3 className="font-serif text-lg font-normal text-[#F8FAFC]">
                  Billing & Settlement • {billingApt.customerName}
                </h3>
                <p className="text-xs text-[#71717A] font-mono">{billingApt.serviceName}</p>
              </div>
              <button
                onClick={() => setBillingApt(null)}
                className="w-8 h-8 rounded-xl bg-[#181818] hover:bg-[#1C1C1C] text-[#71717A] hover:text-[#F8FAFC] border border-[#27272A] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Total to pay banner */}
            <div className="p-4 rounded-xl bg-[#181818] border border-[#27272A] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#71717A] block uppercase font-mono tracking-wider">
                  Payable Amount
                </span>
                <span className="text-2xl font-serif text-[#FACC15] font-medium">
                  {formatCurrency(finalBillAmount)}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-[#10B981] text-xs font-mono border border-emerald-500/20">
                GST Included
              </span>
            </div>

            {/* Shop QR Display */}
            <div className="p-4 rounded-xl bg-[#181818] border border-[#27272A] flex flex-col sm:flex-row items-center gap-4">
              <div className="w-24 h-24 bg-white p-2 rounded-xl flex flex-col items-center justify-center shrink-0">
                <QrCode className="w-16 h-16 text-black" />
                <span className="text-[7px] font-mono uppercase text-slate-800 font-bold mt-0.5">UPI QR</span>
              </div>

              <div className="space-y-1 text-center sm:text-left">
                <div className="font-serif text-sm text-[#F8FAFC]">
                  {salon.name} Counter QR
                </div>
                <div className="text-[11px] text-[#A1A1AA] font-mono">
                  UPI ID: billcare.{salon.slug || "demo"}@axisbank
                </div>
                <p className="text-[11px] text-[#10B981] font-light">
                  Customer can scan instantly via Google Pay, PhonePe, or Paytm.
                </p>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-[#A1A1AA]">Tender Type:</label>
              <div className="grid grid-cols-3 gap-2">
                {(["UPI", "Cash", "Split"] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => {
                      setPayMethod(method);
                      if (method === "UPI") {
                        setUpiAmount(finalBillAmount);
                        setCashAmount(0);
                      } else if (method === "Cash") {
                        setCashAmount(finalBillAmount);
                        setUpiAmount(0);
                      } else {
                        setCashAmount(Math.round(finalBillAmount / 2));
                        setUpiAmount(finalBillAmount - Math.round(finalBillAmount / 2));
                      }
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-mono uppercase transition-all cursor-pointer border ${
                      payMethod === method
                        ? "bg-[#FACC15] text-[#080808] border-[#FACC15] font-bold"
                        : "bg-[#181818] text-[#A1A1AA] border-[#27272A] hover:border-[#343438]"
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* Split input fields */}
            {payMethod === "Split" && (
              <div className="p-3.5 rounded-xl bg-[#181818] border border-[#FACC15]/30 space-y-3">
                <span className="text-xs font-mono text-[#FACC15] block">
                  Split Payment Breakdown
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-[#A1A1AA]">Cash (₹)</label>
                    <input
                      type="number"
                      value={cashAmount}
                      onChange={(e) => handleCashChange(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#151515] border border-[#27272A] rounded-xl text-xs font-mono text-[#F8FAFC] focus:outline-none focus:border-[#FACC15]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-[#A1A1AA]">UPI (₹)</label>
                    <input
                      type="number"
                      value={upiAmount}
                      onChange={(e) => handleUpiChange(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#151515] border border-[#27272A] rounded-xl text-xs font-mono text-[#F8FAFC] focus:outline-none focus:border-[#FACC15]"
                    />
                  </div>
                </div>
                <div className="text-[11px] text-[#A1A1AA] font-mono">
                  Allocated: {formatCurrency(cashAmount + upiAmount)} / {formatCurrency(finalBillAmount)}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#27272A]">
              <button
                type="button"
                onClick={() => setBillingApt(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-[#71717A] hover:text-[#F8FAFC] hover:bg-[#181818] cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleCompleteBillAndSendWhatsApp}
                className="px-5 py-2.5 bg-[#10B981] hover:bg-[#2EB885] text-[#080808] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Complete & Send WhatsApp Bill</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 4: WHATSAPP THANK YOU SENT CONFIRMATION */}
      {/* ============================================================ */}
      {whatsappSentModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#151515] border border-[#27272A] text-[#F8FAFC] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-[#10B981] border border-emerald-500/20 flex items-center justify-center font-bold">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-normal text-[#F8FAFC]">Service Finalized</h3>
                  <p className="text-xs text-[#71717A] font-light">
                    Chair released for next client • WhatsApp message prepared
                  </p>
                </div>
              </div>
              <button
                onClick={() => setWhatsappSentModal(null)}
                className="w-8 h-8 rounded-xl bg-[#181818] hover:bg-[#1C1C1C] text-[#71717A] hover:text-[#F8FAFC] border border-[#27272A] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* WhatsApp Message Preview Card */}
            <div className="p-4 rounded-xl bg-[#181818] border border-[#10B981]/30 space-y-2">
              <div className="flex items-center gap-2 text-[#10B981] font-mono text-xs">
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Message Content:</span>
              </div>

              <div className="p-3 bg-[#151515] rounded-xl text-xs text-[#F8FAFC] font-sans leading-relaxed whitespace-pre-line border border-[#27272A]">
                {whatsappSentModal.messageText}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#27272A]">
              <button
                onClick={() => setWhatsappSentModal(null)}
                className="px-4 py-2 text-xs font-medium text-[#71717A] hover:text-[#F8FAFC] hover:bg-[#181818] rounded-xl cursor-pointer"
              >
                Done / Next Client
              </button>
              <button
                onClick={() => {
                  window.open(
                    `https://wa.me/${whatsappSentModal.phone}?text=${encodeURIComponent(
                      whatsappSentModal.messageText
                    )}`,
                    "_blank"
                  );
                  setWhatsappSentModal(null);
                }}
                className="px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                <span>Open in WhatsApp Web</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
