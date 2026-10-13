"use client";

import React, { useState } from "react";
import { useDemo } from "@/lib/demo-context";
import { formatCurrency } from "@/lib/utils";
import { Appointment, CustomerProfile, ServiceItem } from "@/lib/demo-data";
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
  } = useDemo();

  // Active status filter for appointments
  const [filterStatus, setFilterStatus] = useState<"All" | "Confirmed" | "In-Service" | "Completed">("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Step 1: Customer Enters Salon Modal (Old vs New Auto-Detect)
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [lookupInput, setLookupInput] = useState("");
  const [detectedCustomer, setDetectedCustomer] = useState<CustomerProfile | null>(null);
  const [isNewCustomer, setIsNewCustomer] = useState(false);

  // Form Fields
  const [walkInName, setWalkInName] = useState("");
  const [walkInPhone, setWalkInPhone] = useState("+91 ");
  const [walkInService, setWalkInService] = useState(services[0]?.name || "Haircut");
  const [walkInStaff, setWalkInStaff] = useState(staff[0]?.name || "Priya Sharma");

  // Step 2 & 3: Fill Services Taken for In-Chair Client Modal
  const [serviceModalApt, setServiceModalApt] = useState<Appointment | null>(null);
  const [selectedServiceList, setSelectedServiceList] = useState<string[]>([]);

  // Step 4: Billing with QR & Split Pay Modal
  const [billingApt, setBillingApt] = useState<Appointment | null>(null);
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
  const handleOpenServicesModal = (apt: Appointment) => {
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
  const handleOpenBillingModal = (apt: Appointment) => {
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
    const feedbackUrl = `https://ruvexi.com/feedback?name=${encodeURIComponent(
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
    <div className="space-y-6">
      {/* ============================================================ */}
      {/* FRONT DESK RECEPTIONIST HEADER */}
      {/* ============================================================ */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Receptionist Counter • Front Desk</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Customer Enters Salon Workflow
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl">
              1-Tap Customer Check-in (autodetects old customers), Allot free chairs, Fill services taken, QR / Cash Billing, and instant WhatsApp Thank-You.
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
              className="px-5 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 tactile-btn"
            >
              <Plus className="w-4 h-4" />
              <span>+ Customer Enters Salon</span>
            </button>

            <button
              onClick={() => onNavigateTab("pos")}
              className="px-5 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 tactile-btn"
            >
              <Receipt className="w-4 h-4" />
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
          className={`luxury-card p-5 rounded-3xl cursor-pointer border-2 transition-all ${
            filterStatus === "Confirmed" ? "border-blue-500 bg-blue-50/20" : "hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Waiting in Lounge
            </span>
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2 font-mono">
            {confirmedCount} Clients
          </div>
          <p className="text-xs text-blue-600 font-bold mt-1">Ready to be seated →</p>
        </div>

        <div
          onClick={() => setFilterStatus("In-Service")}
          className={`luxury-card p-5 rounded-3xl cursor-pointer border-2 transition-all ${
            filterStatus === "In-Service" ? "border-amber-500 bg-amber-50/20" : "hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Currently in Chair
            </span>
            <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></span>
          </div>
          <div className="text-3xl font-extrabold text-amber-700 mt-2 font-mono">
            {inServiceCount} Clients
          </div>
          <p className="text-xs text-amber-700 font-bold mt-1">Services being done →</p>
        </div>

        <div
          onClick={() => setFilterStatus("Completed")}
          className={`luxury-card p-5 rounded-3xl cursor-pointer border-2 transition-all ${
            filterStatus === "Completed" ? "border-emerald-500 bg-emerald-50/20" : "hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Finished & Billed Today
            </span>
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
          </div>
          <div className="text-3xl font-extrabold text-emerald-700 mt-2 font-mono">
            {completedCount} Clients
          </div>
          <p className="text-xs text-emerald-700 font-bold mt-1">WhatsApp bill sent →</p>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MAIN DESK SPLIT: CLIENT QUEUE (LEFT) + CHAIR BOARD (RIGHT) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Live Appointments & Queue */}
        <div className="lg:col-span-8 space-y-4">
          <div className="luxury-card p-5 rounded-3xl space-y-4 border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-extrabold text-slate-950">
                  Salon Floor Queue & Chairs
                </h2>
                <p className="text-xs text-slate-500">
                  Step 1: Seat Client → Step 2: Fill Services Taken → Step 3: QR Bill & WhatsApp
                </p>
              </div>

              {/* Search in queue */}
              <div className="relative max-w-xs w-full">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by client or stylist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-900 font-medium"
                />
              </div>
            </div>

            {/* List of Clients */}
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
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
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isInChair
                          ? "bg-amber-50/30 border-amber-200 shadow-xs"
                          : isWaiting
                          ? "bg-blue-50/30 border-blue-200 shadow-xs"
                          : "bg-slate-50/50 border-slate-200 opacity-80"
                      }`}
                    >
                      {/* Left client details */}
                      <div className="flex items-start gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            isInChair
                              ? "bg-amber-500 text-white"
                              : isWaiting
                              ? "bg-blue-600 text-white"
                              : "bg-emerald-600 text-white"
                          }`}
                        >
                          {isInChair ? (
                            <Scissors className="w-5 h-5 animate-bounce" />
                          ) : isWaiting ? (
                            <Clock className="w-5 h-5" />
                          ) : (
                            <Check className="w-5 h-5" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-extrabold text-sm text-slate-950">
                              {apt.customerName}
                            </h3>
                            <span
                              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                                isInChair
                                  ? "bg-amber-100 text-amber-800"
                                  : isWaiting
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-emerald-100 text-emerald-800"
                              }`}
                            >
                              {isInChair ? "In Chair" : isWaiting ? "Waiting" : "Billed & Done"}
                            </span>
                          </div>

                          <div className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-2 font-medium">
                            <span className="font-bold text-slate-800">{apt.serviceName}</span>
                            <span>•</span>
                            <span>Stylist: {apt.staffName}</span>
                            <span>•</span>
                            <span className="font-mono font-bold text-slate-900">
                              {formatCurrency(apt.price)}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                            <Phone className="w-3 h-3 text-slate-400" />
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
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 tactile-btn"
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
                              className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
                              title="Add or change services customer took"
                            >
                              <Scissors className="w-3.5 h-3.5 text-slate-600" />
                              <span>Fill Services</span>
                            </button>

                            <button
                              onClick={() => handleOpenBillingModal(apt)}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 tactile-btn"
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
                            className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-200 transition-all flex items-center gap-1.5"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Send WhatsApp Again</span>
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
          <div className="luxury-card p-5 rounded-3xl space-y-4 border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-sm text-slate-950">Chair Availability</h3>
                <p className="text-[11px] text-slate-500">Live chair & stylist board</p>
              </div>
              <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {freeStaff.length} Chairs Free
              </span>
            </div>

            {/* Stylists List */}
            <div className="space-y-2.5">
              {staff.map((s) => {
                const isBusy = busyStaffNames.includes(s.name);
                const isClockedIn = s.status === "clocked_in";

                return (
                  <div
                    key={s.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={s.avatar}
                        alt={s.name}
                        className="w-8 h-8 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <div className="font-bold text-xs text-slate-950">{s.name}</div>
                        <div className="text-[10px] text-slate-500">{s.specialty[0]}</div>
                      </div>
                    </div>

                    <div>
                      {isBusy ? (
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                          In Chair
                        </span>
                      ) : isClockedIn ? (
                        <button
                          onClick={() => {
                            setWalkInStaff(s.name);
                            setShowWalkInModal(true);
                          }}
                          className="px-2.5 py-1 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[10px] font-extrabold transition-all flex items-center gap-1"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Free • Allot
                        </button>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold">
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
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-950">
                  Customer Enters Salon
                </h3>
                <p className="text-xs text-slate-500">
                  Type phone or name — old customers are auto-filled automatically!
                </p>
              </div>
              <button
                onClick={() => setShowWalkInModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Smart Search Box */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Search Customer Phone Number or Name
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. 9845012890 or Ananya..."
                  value={lookupInput}
                  onChange={(e) => handleLookupChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
              </div>
            </div>

            {/* CASE A: OLD CUSTOMER FOUND! (Zero data entry required) */}
            {detectedCustomer && (
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2.5 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-extrabold text-xs">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Returning Customer Found! (No need to re-enter details)</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                    {detectedCustomer.visitsCount} Past Visits
                  </span>
                </div>

                <div className="text-xs text-slate-700 font-medium space-y-1">
                  <div>
                    <span className="font-bold text-slate-900">{detectedCustomer.name}</span> •{" "}
                    <span>{detectedCustomer.phone}</span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Preferred Stylist:{" "}
                    <strong className="text-slate-900">
                      {detectedCustomer.preferredStaff || "Priya Sharma"}
                    </strong>{" "}
                    • Last Service: {detectedCustomer.lastService}
                  </div>
                  {detectedCustomer.formulaNotes && (
                    <div className="text-[11px] text-amber-900 font-semibold bg-amber-100/60 p-1.5 rounded-lg">
                      Hair Formula Notes: {detectedCustomer.formulaNotes}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CASE B: NEW CUSTOMER DETECTED (Ask only Name & WhatsApp) */}
            {isNewCustomer && (
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3 animate-in fade-in">
                <div className="flex items-center gap-1.5 text-blue-900 font-extrabold text-xs">
                  <User className="w-4 h-4 text-blue-600" />
                  <span>New Customer! Enter only Name and WhatsApp number:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Customer Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Mehta"
                      value={walkInName}
                      onChange={(e) => setWalkInName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">WhatsApp Number *</label>
                    <input
                      type="text"
                      placeholder="+91 98..."
                      value={walkInPhone}
                      onChange={(e) => setWalkInPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <label className="text-xs font-bold text-slate-700">Service Expected</label>
                  <select
                    value={walkInService}
                    onChange={(e) => setWalkInService(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} ({formatCurrency(s.price)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Available Stylist / Chair */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Assign Stylist / Chair ({freeStaff.length} Free)
                  </label>
                  <select
                    value={walkInStaff}
                    onChange={(e) => setWalkInStaff(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    {staff.map((s) => {
                      const isFree = freeStaff.some((f) => f.id === s.id);
                      return (
                        <option key={s.id} value={s.name}>
                          {s.name} {isFree ? "• [FREE CHAIR]" : "• [Busy]"}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowWalkInModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!walkInName.trim()}
                  className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all flex items-center gap-1.5"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Allot Chair & Begin Service</span>
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
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-950">
                  Fill Services Taken by {serviceModalApt.customerName}
                </h3>
                <p className="text-xs text-slate-500">
                  Tap to add any extra services taken during this visit
                </p>
              </div>
              <button
                onClick={() => setServiceModalApt(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Service Selection Pills */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Tap services to include:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-1">
                {services.map((srv) => {
                  const isSelected = selectedServiceList.includes(srv.name);
                  return (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => handleToggleService(srv.name)}
                      className={`p-2.5 rounded-xl text-xs font-bold text-left border transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300"
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
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between font-mono">
              <span className="text-xs font-bold text-slate-600">Updated Bill Total:</span>
              <span className="text-lg font-black text-slate-950">
                {formatCurrency(
                  selectedServiceList.reduce((acc, sName) => {
                    const match = services.find((s) => s.name === sName);
                    return acc + (match?.price || 1500);
                  }, 0)
                )}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setServiceModalApt(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={handleSaveServicesAndProceedToBill}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5"
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
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-950">
                  Billing & Payment • {billingApt.customerName}
                </h3>
                <p className="text-xs text-slate-500">{billingApt.serviceName}</p>
              </div>
              <button
                onClick={() => setBillingApt(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Total to pay banner */}
            <div className="p-4 rounded-2xl bg-slate-950 text-white flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block uppercase font-bold">
                  Total Bill to Pay
                </span>
                <span className="text-2xl font-black font-mono">
                  {formatCurrency(finalBillAmount)}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                GST 5% Included
              </span>
            </div>

            {/* Shop QR Display (For UPI payments) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
              {/* Simulated QR Code SVG */}
              <div className="w-28 h-28 bg-white p-2 rounded-2xl border border-slate-300 shadow-sm flex flex-col items-center justify-center shrink-0">
                <QrCode className="w-20 h-20 text-slate-950" />
                <span className="text-[8px] font-black uppercase text-slate-600 mt-1">BHIM UPI QR</span>
              </div>

              <div className="space-y-1 text-center sm:text-left">
                <div className="font-extrabold text-xs text-slate-900">
                  {salon.name} Shop QR Code
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  UPI ID: luxehaven@okhdfcbank
                </div>
                <p className="text-[11px] text-emerald-700 font-medium">
                  Client can scan with Google Pay, PhonePe, or Paytm on counter.
                </p>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">How did the client pay?</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPayMethod("UPI");
                    setUpiAmount(finalBillAmount);
                    setCashAmount(0);
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border transition-all ${
                    payMethod === "UPI"
                      ? "bg-slate-950 text-white border-slate-950 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200"
                  }`}
                >
                  Shop QR / UPI
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPayMethod("Cash");
                    setCashAmount(finalBillAmount);
                    setUpiAmount(0);
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border transition-all ${
                    payMethod === "Cash"
                      ? "bg-slate-950 text-white border-slate-950 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200"
                  }`}
                >
                  Cash Only
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPayMethod("Split");
                    setCashAmount(Math.round(finalBillAmount / 2));
                    setUpiAmount(finalBillAmount - Math.round(finalBillAmount / 2));
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border transition-all ${
                    payMethod === "Split"
                      ? "bg-slate-950 text-white border-slate-950 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200"
                  }`}
                >
                  Both (Split)
                </button>
              </div>
            </div>

            {/* Split input fields (Just type it in!) */}
            {payMethod === "Split" && (
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                <span className="text-xs font-extrabold text-amber-900 block">
                  Split Payment: Just type in the numbers
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Cash Amount (₹)</label>
                    <input
                      type="number"
                      value={cashAmount}
                      onChange={(e) => handleCashChange(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold font-mono focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">UPI / QR Amount (₹)</label>
                    <input
                      type="number"
                      value={upiAmount}
                      onChange={(e) => handleUpiChange(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold font-mono focus:outline-none"
                    />
                  </div>
                </div>
                <div className="text-[11px] text-amber-800 font-medium">
                  Total matches: {formatCurrency(cashAmount + upiAmount)} / {formatCurrency(finalBillAmount)}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setBillingApt(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleCompleteBillAndSendWhatsApp}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 tactile-btn"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Complete Bill & Send WhatsApp Thank-You</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 4: WHATSAPP THANK YOU SENT CONFIRMATION */}
      {/* ============================================================ */}
      {whatsappSentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-950">Service Complete!</h3>
                  <p className="text-xs text-slate-500">
                    Chair freed for next client • WhatsApp message ready
                  </p>
                </div>
              </div>
              <button
                onClick={() => setWhatsappSentModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* WhatsApp Message Preview Card */}
            <div className="p-4 rounded-2xl bg-[#e7f7ed] border border-emerald-300/80 space-y-2">
              <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp Thank-You Message Preview:</span>
              </div>

              <div className="p-3 bg-white rounded-xl text-xs text-slate-800 font-sans leading-relaxed shadow-2xs whitespace-pre-line border border-emerald-200">
                {whatsappSentModal.messageText}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setWhatsappSentModal(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
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
                className="px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5"
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
