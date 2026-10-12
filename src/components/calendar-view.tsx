"use client";

import React, { useState } from "react";
import { useDemo } from "@/lib/demo-context";
import { formatCurrency } from "@/lib/utils";
import { Appointment } from "@/lib/demo-data";
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
} from "lucide-react";

interface CalendarViewProps {
  onGoToPosBilling?: (customerName: string, serviceName: string, staffName: string) => void;
}

export function CalendarView({ onGoToPosBilling }: CalendarViewProps) {
  const { appointments, staff, services, customers, updateAppointmentStatus, bookAppointment } = useDemo();

  const [selectedStaffFilter, setSelectedStaffFilter] = useState<string>("All");
  const [showBookModal, setShowBookModal] = useState<boolean>(false);

  // Form state
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("+91 98");
  const [serviceName, setServiceName] = useState(services[0]?.name || "");
  const [staffName, setStaffName] = useState(staff[0]?.name || "");
  const [timeSlot, setTimeSlot] = useState("01:30 PM");

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
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Salon Chair Schedule Matrix</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Live Timeline
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live chair concurrency locks • Stylist assignment • 1-click checkout to POS
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
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
            <img src={st.avatar} alt={st.name} className="w-4 h-4 rounded-full object-cover" />
            {st.name}
          </button>
        ))}
      </div>

      {/* Appointment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAppointments.map((apt) => (
          <div
            key={apt.id}
            className="luxury-card rounded-3xl p-5 flex flex-col justify-between hover:border-blue-400 hover:shadow-xl transition-all"
          >
            <div>
              {/* Card Header */}
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

              {/* Service & Client */}
              <div className="mt-3.5">
                <h3 className="font-extrabold text-slate-900 text-base leading-snug tracking-tight">{apt.serviceName}</h3>
                <p className="text-xs font-bold text-slate-700 mt-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-500" /> {apt.customerName}
                </p>
                <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5 font-mono">
                  <Phone className="w-3 h-3 text-slate-400" /> {apt.customerPhone}
                </p>
              </div>

              {/* Assigned Stylist & Price */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Scissors className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="font-extrabold text-slate-800">{apt.staffName}</span>
                </div>
                <span className="font-black text-slate-900 font-mono text-sm">{formatCurrency(apt.price)}</span>
              </div>
            </div>

            {/* Status Transitions & Checkout Action */}
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

              {/* Bill Now button */}
              {onGoToPosBilling && (
                <button
                  onClick={() => onGoToPosBilling(apt.customerName, apt.serviceName, apt.staffName)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                >
                  <Receipt className="w-3.5 h-3.5" /> Checkout Bill
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* New Booking Modal */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 w-full max-w-md animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">Schedule New Salon Chair Booking</h3>
              <button onClick={() => setShowBookModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Customer Full Name</label>
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
                  <label className="font-bold text-slate-700 block mb-1">Assigned Stylist</label>
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
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="01:30 PM">01:30 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="05:15 PM">05:15 PM</option>
                    <option value="07:00 PM">07:00 PM</option>
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
