"use client";

import React, { useState } from "react";
import { useDemo } from "@/lib/demo-context";
import { formatCurrency } from "@/lib/utils";
import { Appointment, CustomerProfile } from "@/lib/demo-data";
import { ClientFormulaModal } from "./client-formula-modal";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Plus,
  CheckCircle2,
  PlayCircle,
  XCircle,
  Receipt,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Filter,
  Phone,
  Scissors,
  X,
  Crown,
  Grid3X3,
  Columns,
  FileText,
  Send,
  Zap,
} from "lucide-react";

interface CalendarViewProps {
  onGoToPosBilling?: (customerName: string, serviceName: string, staffName: string) => void;
}

export function CalendarView({ onGoToPosBilling }: CalendarViewProps) {
  const {
    appointments,
    staff,
    services,
    customers,
    invoices,
    updateAppointmentStatus,
    bookAppointment,
  } = useDemo();

  const [viewMode, setViewMode] = useState<"timeline" | "cards">("timeline");
  const [selectedStaffFilter, setSelectedStaffFilter] = useState<string>("All");
  const [showBookModal, setShowBookModal] = useState<boolean>(false);
  const [activeFormulaCustomer, setActiveFormulaCustomer] = useState<CustomerProfile | null>(null);

  // Form state for new appointment
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("+91 98");
  const [serviceName, setServiceName] = useState(services[0]?.name || "");
  const [staffName, setStaffName] = useState(staff[0]?.name || "");
  const [timeSlot, setTimeSlot] = useState("01:30 PM");

  const timelineHours = [
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
  ];

  const filteredAppointments = appointments.filter((apt) => {
    return selectedStaffFilter === "All" || apt.staffName === selectedStaffFilter;
  });

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const srv = services.find((s) => s.name === serviceName);
    const st = staff.find((s) => s.name === staffName);

    bookAppointment({
      customerName: custName,
      customerPhone: custPhone,
      serviceName,
      staffName,
      staffId: st?.id || staff[0].id,
      time: timeSlot,
      durationMinutes: srv?.durationMinutes || 60,
      price: srv?.price || 2000,
      source: "Online Booking",
    });

    setShowBookModal(false);
    setCustName("");
  };

  const handleOpenFormulaCard = (customerName: string) => {
    const found = customers.find(
      (c) => c.name.toLowerCase() === customerName.toLowerCase()
    );
    if (found) {
      setActiveFormulaCustomer(found);
    } else {
      // Create temporary profile for walk-ins
      setActiveFormulaCustomer({
        id: "temp_" + Date.now(),
        name: customerName,
        phone: "+91 98000 00000",
        email: "guest@luxehaven.in",
        gender: "Female",
        visitsCount: 1,
        totalSpent: 3000,
        loyaltyPoints: 50,
        lastVisitDate: "Today",
        lastService: "Salon Treatment",
        preferredStaff: staff[0].name,
        tags: ["First Visit", "Formula Pending"],
        notes: "First time consultation at Luxe Haven.",
        formulaNotes: "Patch test pending. Consultation in progress.",
        patchTestStatus: "Valid",
      });
    }
  };

  const handleQuickSlotClick = (slotTime: string, targetStaffName: string) => {
    setTimeSlot(slotTime);
    setStaffName(targetStaffName);
    setShowBookModal(true);
  };

  // Helper to match appointment into time slot (e.g. 10:30 AM maps to 10:00 AM slot)
  const getAppointmentForSlotAndStaff = (slotTime: string, stName: string) => {
    const slotHourPrefix = slotTime.split(":")[0];
    const slotPeriod = slotTime.slice(-2);

    return appointments.find((apt) => {
      if (apt.staffName !== stName) return false;
      const aptHourPrefix = apt.time.split(":")[0];
      const aptPeriod = apt.time.slice(-2);
      return aptHourPrefix === slotHourPrefix && aptPeriod === slotPeriod;
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="luxury-card p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 border border-white/20">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Fresha-Grade Chair Matrix & Schedule
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Live Timeline
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Multi-stylist timeline • Technical formula cards • 1-click checkout & WhatsApp reminders
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View mode toggle (Fresha Signature Matrix vs Cards) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/80 text-xs">
            <button
              onClick={() => setViewMode("timeline")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                viewMode === "timeline"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Columns className="w-3.5 h-3.5 text-blue-600" />
              Timeline Matrix
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                viewMode === "cards"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5 text-indigo-600" />
              Cards
            </button>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200 text-xs">
            <button className="p-1 text-slate-600 hover:text-slate-900">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-extrabold px-2 text-slate-800">Today, 12 Oct 2026</span>
            <button className="p-1 text-slate-600 hover:text-slate-900">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowBookModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4" /> New Booking
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: FRESHA-GRADE TIMELINE MATRIX (Signature Multi-Stylist Columns) */}
      {viewMode === "timeline" ? (
        <div className="luxury-card rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
          {/* Matrix Header info bar */}
          <div className="p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="font-black text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                FRESHA PARITY TIMELINE
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">
                Click any open cell to instantly reserve a chair slot.
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-bold">
              <span className="flex items-center gap-1 text-blue-300">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span> Confirmed
              </span>
              <span className="flex items-center gap-1 text-amber-300">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span> In Chair
              </span>
              <span className="flex items-center gap-1 text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Completed
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[850px]">
              {/* Columns Header (Stylists) */}
              <div className="grid grid-cols-[85px_repeat(4,minmax(180px,1fr))] bg-slate-50 border-b border-slate-200 text-xs sticky top-0 z-20">
                <div className="p-3 sm:p-4 font-black text-slate-400 uppercase tracking-wider text-[10px] flex items-center justify-center border-r border-slate-200 sticky left-0 z-30 bg-slate-50">
                  Time
                </div>
                {staff.map((st) => (
                  <div
                    key={st.id}
                    className="p-3.5 border-r border-slate-200 last:border-r-0 flex items-center justify-between gap-2 bg-slate-50"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={st.avatar}
                        alt={st.name}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm"
                      />
                      <div>
                        <h4 className="font-extrabold text-slate-900 leading-tight">{st.name}</h4>
                        <span className="text-[10px] text-slate-500 block truncate max-w-[120px]">
                          {st.role}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        st.status === "clocked_in"
                          ? "bg-emerald-500 shadow-sm shadow-emerald-500/50"
                          : "bg-amber-400"
                      }`}
                      title={st.status}
                    />
                  </div>
                ))}
              </div>

              {/* Time Slots Grid */}
              <div className="divide-y divide-slate-100">
                {timelineHours.map((hour) => (
                  <div
                    key={hour}
                    className="grid grid-cols-[85px_repeat(4,minmax(180px,1fr))] min-h-[92px] transition-colors"
                  >
                    {/* Time Label Column (Sticky) */}
                    <div className="p-2 sm:p-3 font-mono font-bold text-slate-500 text-[10px] sm:text-[11px] bg-slate-50/95 border-r border-slate-200 flex items-start justify-center pt-3.5 sticky left-0 z-10 backdrop-blur-sm">
                      {hour}
                    </div>

                    {/* Staff Columns for this Hour */}
                    {staff.map((st) => {
                      const apt = getAppointmentForSlotAndStaff(hour, st.name);

                      return (
                        <div
                          key={st.id}
                          className="p-2 border-r border-slate-200 last:border-r-0 relative group hover:bg-blue-50/30 transition-colors flex flex-col justify-center"
                        >
                          {apt ? (
                            <div
                              className={`p-3 rounded-2xl border transition-all shadow-sm ${
                                apt.status === "Completed"
                                  ? "bg-emerald-50/90 border-emerald-200/90 text-emerald-950"
                                  : apt.status === "In-Service"
                                  ? "bg-amber-50/90 border-amber-200/90 text-amber-950 ring-1 ring-amber-300"
                                  : "bg-blue-50/90 border-blue-200/90 text-blue-950"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className="font-mono text-[10px] font-black px-1.5 py-0.5 rounded-md bg-white/80 border border-slate-200/60">
                                  {apt.time}
                                </span>
                                <span
                                  className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                    apt.status === "Completed"
                                      ? "bg-emerald-200/80 text-emerald-800"
                                      : apt.status === "In-Service"
                                      ? "bg-amber-200/80 text-amber-800 animate-pulse"
                                      : "bg-blue-200/80 text-blue-800"
                                  }`}
                                >
                                  {apt.status}
                                </span>
                              </div>

                              <h5 className="font-black text-xs text-slate-900 leading-snug line-clamp-1">
                                {apt.customerName}
                              </h5>
                              <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5 font-medium">
                                {apt.serviceName}
                              </p>

                              <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                                <span className="font-mono font-black text-slate-900">
                                  {formatCurrency(apt.price)}
                                </span>

                                <div className="flex items-center gap-1">
                                  {/* Formula Card Button */}
                                  <button
                                    onClick={() => handleOpenFormulaCard(apt.customerName)}
                                    className="p-1 hover:bg-white rounded-lg text-indigo-600 transition-colors"
                                    title="View Technical Formula Card"
                                  >
                                    <Sparkles className="w-3.5 h-3.5" />
                                  </button>

                                  {/* POS Checkout Button */}
                                  {onGoToPosBilling && (
                                    <button
                                      onClick={() =>
                                        onGoToPosBilling(
                                          apt.customerName,
                                          apt.serviceName,
                                          apt.staffName
                                        )
                                      }
                                      className="px-2 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold transition-all shadow-sm flex items-center gap-0.5"
                                      title="Checkout at POS"
                                    >
                                      <Receipt className="w-3 h-3" /> Pay
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleQuickSlotClick(hour, st.name)}
                              className="w-full h-full min-h-[70px] rounded-xl border border-dashed border-slate-200/80 hover:border-blue-400 hover:bg-blue-50/50 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100 text-xs font-bold gap-1"
                            >
                              <Plus className="w-3.5 h-3.5" /> Book {hour}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* VIEW MODE 2: CARDS GRID VIEW */
        <div className="space-y-4">
          {/* Stylist Filter tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedStaffFilter("All")}
              className={`px-4 py-2 rounded-2xl font-black transition-all whitespace-nowrap ${
                selectedStaffFilter === "All"
                  ? "bg-slate-950 text-white shadow-md shadow-slate-950/20"
                  : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50"
              }`}
            >
              All Chairs & Artists ({appointments.length})
            </button>
            {staff.map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStaffFilter(st.name)}
                className={`px-3.5 py-2 rounded-2xl font-bold transition-all whitespace-nowrap flex items-center gap-2 border ${
                  selectedStaffFilter === st.name
                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                    : "bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50"
                }`}
              >
                <img
                  src={st.avatar}
                  alt={st.name}
                  className="w-4 h-4 rounded-full object-cover"
                />
                {st.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAppointments.map((apt) => (
              <div
                key={apt.id}
                className="luxury-card rounded-3xl p-5 flex flex-col justify-between hover:border-blue-400 hover:shadow-xl transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-black text-blue-700 bg-blue-50 px-3 py-1 rounded-xl flex items-center gap-1.5 border border-blue-100 font-mono">
                      <Clock className="w-3.5 h-3.5" /> {apt.time} ({apt.durationMinutes}m)
                    </span>

                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        apt.status === "Completed"
                          ? "bg-emerald-100 text-emerald-800"
                          : apt.status === "In-Service"
                          ? "bg-amber-100 text-amber-800"
                          : apt.status === "Cancelled"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>

                  <div className="mt-3.5">
                    <h3 className="font-extrabold text-slate-900 text-base leading-snug tracking-tight">
                      {apt.serviceName}
                    </h3>
                    <div className="flex items-center justify-between mt-1.5">
                      <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-blue-500" /> {apt.customerName}
                      </p>
                      <button
                        onClick={() => handleOpenFormulaCard(apt.customerName)}
                        className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline"
                      >
                        <Sparkles className="w-3 h-3" /> Formula Card
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5 font-mono">
                      <Phone className="w-3 h-3 text-slate-400" /> {apt.customerPhone}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Scissors className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="font-extrabold text-slate-800">{apt.staffName}</span>
                    </div>
                    <span className="font-black text-slate-900 font-mono text-sm">
                      {formatCurrency(apt.price)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    {apt.status === "Confirmed" && (
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, "In-Service")}
                        className="px-2.5 py-1 text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                        title="Mark In-Service"
                      >
                        <PlayCircle className="w-3.5 h-3.5" /> Start
                      </button>
                    )}
                    {apt.status === "In-Service" && (
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, "Completed")}
                        className="px-2.5 py-1 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                        title="Mark Completed"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Finish
                      </button>
                    )}
                    {apt.status !== "Cancelled" && apt.status !== "Completed" && (
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, "Cancelled")}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl text-xs transition-colors"
                        title="Cancel Booking"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {onGoToPosBilling && (
                    <button
                      onClick={() =>
                        onGoToPosBilling(apt.customerName, apt.serviceName, apt.staffName)
                      }
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                    >
                      <Receipt className="w-3.5 h-3.5" /> Checkout Bill
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 360 Client Technical Formula Modal (Fresha & Boulevard Gold Standard) */}
      {activeFormulaCustomer && (
        <ClientFormulaModal
          customer={activeFormulaCustomer}
          invoices={invoices}
          onClose={() => setActiveFormulaCustomer(null)}
        />
      )}

      {/* New Booking Modal */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 w-full max-w-md animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">
                Schedule New Salon Chair Booking
              </h3>
              <button
                onClick={() => setShowBookModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Customer Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shalini Roy"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-mono font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Treatment</label>
                <select
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold text-slate-800"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({formatCurrency(s.price)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Assigned Stylist
                  </label>
                  <select
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold"
                  >
                    {staff.map((st) => (
                      <option key={st.id} value={st.name}>
                        {st.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Time Slot</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold"
                  >
                    {timelineHours.map((th) => (
                      <option key={th} value={th}>
                        {th}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 text-white font-extrabold rounded-xl shadow-md shadow-blue-500/20"
                >
                  Reserve Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
