"use client";

import React, { useState } from "react";
import { useBillCare } from "@/lib/billcare-context";
import { formatCurrency } from "@/lib/utils";
import { Appointment, CustomerProfile } from "@/lib/types";
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
  } = useBillCare();

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
      setActiveFormulaCustomer(found as any);
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
      <div className="bg-[#0D0D0F] border border-[#27272A] p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#F5C928]/10 border border-[#F5C928]/30 flex items-center justify-center text-[#F5C928] shadow-lg shadow-[#F5C928]/5 shrink-0">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-serif font-bold text-[#F5F4F0] tracking-tight">
                Chair Matrix & Appointments
              </h1>
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
                Live Timeline
              </span>
            </div>
            <p className="text-xs text-[#7E8B9C] mt-0.5">
              Multi-stylist timeline • Technical formula cards • 1-click checkout & WhatsApp reminders
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View mode toggle (Timeline Matrix vs Cards) */}
          <div className="flex items-center bg-[#171719] p-1 rounded-xl border border-[#27272A] text-xs">
            <button
              onClick={() => setViewMode("timeline")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewMode === "timeline"
                  ? "bg-[#F5C928] text-[#080809] shadow-sm"
                  : "text-[#A3A3AD] hover:text-[#F5F4F0]"
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              Timeline Matrix
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewMode === "cards"
                  ? "bg-[#F5C928] text-[#080809] shadow-sm"
                  : "text-[#A3A3AD] hover:text-[#F5F4F0]"
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              Cards
            </button>
          </div>

          <div className="flex items-center gap-1.5 bg-[#171719] p-1.5 rounded-xl border border-[#27272A] text-xs">
            <button className="p-1 text-[#7E8B9C] hover:text-[#F5F4F0]">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono font-bold px-2 text-[#F5F4F0]">Today, 12 Oct 2026</span>
            <button className="p-1 text-[#7E8B9C] hover:text-[#F5F4F0]">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowBookModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#F5C928] hover:bg-[#f7d348] text-[#080809] font-bold text-xs rounded-xl shadow-lg shadow-[#F5C928]/10 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> New Booking
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: FRESHA-GRADE TIMELINE MATRIX */}
      {viewMode === "timeline" ? (
        <div className="bg-[#0D0D0F] border border-[#27272A] rounded-2xl overflow-hidden shadow-xl">
          {/* Timeline filter & controls */}
          <div className="p-3 bg-[#111113] text-[#F5F4F0] flex flex-wrap items-center justify-between gap-3 text-xs border-b border-[#27272A]">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="font-mono font-bold text-[#F5C928] flex items-center gap-1.5 mr-2">
                <Sparkles className="w-3.5 h-3.5" />
                TIMELINE
              </span>
              <button
                onClick={() => setSelectedStaffFilter("All")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  selectedStaffFilter === "All"
                    ? "bg-[#F5C928] text-[#080809] shadow-xs"
                    : "bg-[#171719] text-[#A3A3AD] hover:text-[#F5F4F0] border border-[#27272A]"
                }`}
              >
                All Chairs ({staff.length})
              </button>
              {staff.map((st) => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStaffFilter(st.name)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    selectedStaffFilter === st.name
                      ? "bg-[#F5C928] text-[#080809] shadow-xs"
                      : "bg-[#171719] text-[#A3A3AD] hover:text-[#F5F4F0] border border-[#27272A]"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  {st.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 text-xs font-mono font-bold">
              <span className="flex items-center gap-1.5 text-blue-400">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span> Confirmed
              </span>
              <span className="flex items-center gap-1.5 text-[#F5C928]">
                <span className="w-2 h-2 rounded-full bg-[#F5C928] animate-pulse"></span> In Chair
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Completed
              </span>
            </div>
          </div>

          {(() => {
            const visibleStaff = selectedStaffFilter === "All"
              ? staff
              : staff.filter((s) => s.name === selectedStaffFilter);

            return (
              <div className="overflow-x-auto">
                <div className={visibleStaff.length === 1 ? "min-w-full" : "min-w-[850px]"}>
                  {/* Columns Header (Stylists) */}
                  <div
                    className="grid bg-[#111113] border-b border-[#27272A] text-xs sticky top-0 z-20"
                    style={{
                      gridTemplateColumns: `90px repeat(${visibleStaff.length}, minmax(180px, 1fr))`,
                    }}
                  >
                    <div className="p-3 sm:p-4 font-mono font-bold text-[#7E8B9C] uppercase tracking-wider text-xs flex items-center justify-center border-r border-[#27272A] sticky left-0 z-30 bg-[#111113]">
                      Time
                    </div>
                    {visibleStaff.map((st) => (
                      <div
                        key={st.id}
                        className="p-3.5 border-r border-[#27272A] last:border-r-0 flex items-center justify-between gap-2 bg-[#111113]"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={st.avatar}
                            alt={st.name}
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-[#27272A]"
                          />
                          <div>
                            <h4 className="font-bold text-[#F5F4F0] leading-tight">{st.name}</h4>
                            <span className="text-[11px] text-[#7E8B9C] block truncate max-w-[140px]">
                              {st.role}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            st.status === "clocked_in"
                              ? "bg-emerald-400 shadow-sm shadow-emerald-400/50"
                              : "bg-[#F5C928]"
                          }`}
                          title={st.status}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Time Slots Grid */}
                  <div className="divide-y divide-[#27272A]">
                    {timelineHours.map((hour) => (
                      <div
                        key={hour}
                        className="grid min-h-[96px] transition-colors"
                        style={{
                          gridTemplateColumns: `90px repeat(${visibleStaff.length}, minmax(180px, 1fr))`,
                        }}
                      >
                        {/* Time Label Column (Sticky) */}
                        <div className="p-2 sm:p-3 font-mono font-bold text-[#7E8B9C] text-xs bg-[#111113]/95 border-r border-[#27272A] flex items-start justify-center pt-3.5 sticky left-0 z-10 backdrop-blur-sm">
                          {hour}
                        </div>

                        {/* Staff Columns for this Hour */}
                        {visibleStaff.map((st) => {
                          const apt = getAppointmentForSlotAndStaff(hour, st.name);

                          return (
                            <div
                              key={st.id}
                              className="p-2 border-r border-[#27272A] last:border-r-0 relative group hover:bg-[#171719]/40 transition-colors flex flex-col justify-center"
                            >
                              {apt ? (
                                <div
                                  className={`p-3 rounded-xl border transition-all shadow-sm ${
                                    apt.status === "Completed"
                                      ? "bg-emerald-500/10 border-emerald-500/30 text-[#F5F4F0]"
                                      : apt.status === "In-Service"
                                      ? "bg-[#F5C928]/10 border-[#F5C928]/40 text-[#F5F4F0] ring-1 ring-[#F5C928]/30"
                                      : "bg-[#171719] border-[#27272A] text-[#F5F4F0]"
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-1 mb-1.5">
                                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-[#111113] border border-[#27272A] text-[#F5F4F0]">
                                      {apt.time}
                                    </span>
                                    <span
                                      className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                                        apt.status === "Completed"
                                          ? "bg-emerald-500/20 text-emerald-400"
                                          : apt.status === "In-Service"
                                          ? "bg-[#F5C928]/20 text-[#F5C928] animate-pulse"
                                          : "bg-blue-500/20 text-blue-400"
                                      }`}
                                    >
                                      {apt.status}
                                    </span>
                                  </div>

                                  <h5 className="font-bold text-xs text-[#F5F4F0] leading-snug line-clamp-1">
                                    {apt.customerName}
                                  </h5>
                                  <p className="text-xs text-[#A3A3AD] line-clamp-1 mt-0.5">
                                    {apt.serviceName}
                                  </p>

                                  <div className="mt-2 pt-2 border-t border-[#27272A] flex items-center justify-between text-xs">
                                    <span className="font-mono font-bold text-[#F5C928]">
                                      {formatCurrency(apt.price)}
                                    </span>

                                    <div className="flex items-center gap-1.5">
                                      {/* Formula Card Button */}
                                      <button
                                        onClick={() => handleOpenFormulaCard(apt.customerName)}
                                        className="p-1 hover:bg-[#27272A] rounded-lg text-[#F5C928] transition-colors border border-[#27272A]"
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
                                          className="px-2.5 py-1 bg-[#F5C928] hover:bg-[#f7d348] text-[#080809] rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
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
                                  className="w-full h-full min-h-[70px] rounded-xl border border-dashed border-[#27272A] hover:border-[#F5C928]/60 hover:bg-[#F5C928]/5 flex items-center justify-center text-[#7E8B9C] hover:text-[#F5C928] transition-all opacity-0 group-hover:opacity-100 text-xs font-bold gap-1 cursor-pointer"
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
            );
          })()}
        </div>
      ) : (
        /* VIEW MODE 2: CARDS GRID VIEW */
        <div className="space-y-4">
          {/* Stylist Filter tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedStaffFilter("All")}
              className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
                selectedStaffFilter === "All"
                  ? "bg-[#F5C928] text-[#080809] shadow-md shadow-[#F5C928]/10"
                  : "bg-[#111113] text-[#A3A3AD] border border-[#27272A] hover:text-[#F5F4F0]"
              }`}
            >
              All Chairs & Artists ({appointments.length})
            </button>
            {staff.map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStaffFilter(st.name)}
                className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-2 border ${
                  selectedStaffFilter === st.name
                    ? "bg-[#F5C928] text-[#080809] border-[#F5C928] shadow-md shadow-[#F5C928]/10"
                    : "bg-[#111113] text-[#A3A3AD] border-[#27272A] hover:text-[#F5F4F0]"
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

          {filteredAppointments.length === 0 ? (
            <div className="bg-[#0D0D0F] border border-[#27272A] p-12 rounded-2xl text-center space-y-4 max-w-md mx-auto shadow-xl">
              <div className="w-16 h-16 rounded-full bg-[#171719] border border-[#27272A] text-[#F5C928] flex items-center justify-center mx-auto">
                <CalendarIcon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-[#F5F4F0]">No Appointments Scheduled</h3>
                <p className="text-xs text-[#7E8B9C] mt-1">
                  There are no bookings matching the selected artist filter.
                </p>
              </div>
              <button
                onClick={() => setShowBookModal(true)}
                className="px-5 py-2.5 bg-[#F5C928] hover:bg-[#f7d348] text-[#080809] font-bold text-xs rounded-xl shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Schedule New Booking
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-[#111113] border border-[#27272A] rounded-xl p-5 flex flex-col justify-between hover:border-[#F5C928]/50 hover:bg-[#171719] transition-all shadow-lg"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-mono font-bold text-[#F5C928] bg-[#171719] px-3 py-1 rounded-lg flex items-center gap-1.5 border border-[#27272A]">
                        <Clock className="w-3.5 h-3.5" /> {apt.time} ({apt.durationMinutes}m)
                      </span>

                      <span
                        className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          apt.status === "Completed"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : apt.status === "In-Service"
                            ? "bg-[#F5C928]/20 text-[#F5C928]"
                            : apt.status === "Cancelled"
                            ? "bg-rose-500/20 text-rose-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>

                    <div className="mt-3.5">
                      <h3 className="font-serif font-bold text-[#F5F4F0] text-base leading-snug">
                        {apt.serviceName}
                      </h3>
                      <div className="flex items-center justify-between mt-1.5">
                        <p className="text-xs font-bold text-[#A3A3AD] flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-[#F5C928]" /> {apt.customerName}
                        </p>
                        <button
                          onClick={() => handleOpenFormulaCard(apt.customerName)}
                          className="text-[11px] font-bold text-[#F5C928] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3" /> Formula Card
                        </button>
                      </div>
                      <p className="text-[11px] text-[#7E8B9C] flex items-center gap-1.5 mt-0.5 font-mono">
                        <Phone className="w-3 h-3 text-[#7E8B9C]" /> {apt.customerPhone}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#27272A] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Scissors className="w-3.5 h-3.5 text-[#7E8B9C]" />
                        <span className="font-bold text-[#F5F4F0]">{apt.staffName}</span>
                      </div>
                      <span className="font-mono font-bold text-[#F5C928] text-sm">
                        {formatCurrency(apt.price)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#27272A] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      {apt.status === "Confirmed" && (
                        <button
                          onClick={() => updateAppointmentStatus(apt.id, "In-Service")}
                          className="px-2.5 py-1 text-[#F5C928] bg-[#F5C928]/10 hover:bg-[#F5C928]/20 border border-[#F5C928]/30 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Mark In-Service"
                        >
                          <PlayCircle className="w-3.5 h-3.5" /> Start
                        </button>
                      )}
                      {apt.status === "In-Service" && (
                        <button
                          onClick={() => updateAppointmentStatus(apt.id, "Completed")}
                          className="px-2.5 py-1 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Mark Completed"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Finish
                        </button>
                      )}
                      {apt.status !== "Cancelled" && apt.status !== "Completed" && (
                        <button
                          onClick={() => updateAppointmentStatus(apt.id, "Cancelled")}
                          className="p-1.5 text-[#7E8B9C] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg text-xs transition-colors cursor-pointer"
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
                        className="px-3 py-1.5 bg-[#F5C928] hover:bg-[#f7d348] text-[#080809] rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                      >
                        <Receipt className="w-3.5 h-3.5" /> Checkout Bill
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 360 Client Technical Formula Modal */}
      {activeFormulaCustomer && (
        <ClientFormulaModal
          customer={activeFormulaCustomer}
          invoices={invoices as any}
          onClose={() => setActiveFormulaCustomer(null)}
        />
      )}

      {/* New Booking Modal */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-[#0D0D0F] border border-[#27272A] rounded-2xl shadow-2xl p-6 w-full max-w-md animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
              <h3 className="font-serif font-bold text-[#F5F4F0] text-base">
                Schedule New Salon Chair Booking
              </h3>
              <button
                onClick={() => setShowBookModal(false)}
                className="text-[#7E8B9C] hover:text-[#F5F4F0] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-mono text-[11px] text-[#A3A3AD] block mb-1">
                  Customer Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shalini Roy"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#111113] border border-[#27272A] rounded-xl text-[#F5F4F0] focus:outline-none focus:border-[#F5C928] font-bold"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] text-[#A3A3AD] block mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#111113] border border-[#27272A] rounded-xl text-[#F5F4F0] focus:outline-none focus:border-[#F5C928] font-mono font-medium"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] text-[#A3A3AD] block mb-1">Select Treatment</label>
                <select
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#111113] border border-[#27272A] rounded-xl text-[#F5F4F0] focus:outline-none focus:border-[#F5C928] font-bold"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.name} className="bg-[#111113] text-[#F5F4F0]">
                      {s.name} ({formatCurrency(s.price)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-[11px] text-[#A3A3AD] block mb-1">
                    Assigned Stylist
                  </label>
                  <select
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#111113] border border-[#27272A] rounded-xl text-[#F5F4F0] focus:outline-none focus:border-[#F5C928] font-bold"
                  >
                    {staff.map((st) => (
                      <option key={st.id} value={st.name} className="bg-[#111113] text-[#F5F4F0]">
                        {st.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-mono text-[11px] text-[#A3A3AD] block mb-1">Time Slot</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#111113] border border-[#27272A] rounded-xl text-[#F5F4F0] focus:outline-none focus:border-[#F5C928] font-bold"
                  >
                    {timelineHours.map((th) => (
                      <option key={th} value={th} className="bg-[#111113] text-[#F5F4F0]">
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
                  className="flex-1 py-2.5 bg-[#171719] text-[#A3A3AD] hover:text-[#F5F4F0] font-bold rounded-xl border border-[#27272A] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#F5C928] hover:bg-[#f7d348] text-[#080809] font-bold rounded-xl shadow-md shadow-[#F5C928]/10 cursor-pointer"
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
