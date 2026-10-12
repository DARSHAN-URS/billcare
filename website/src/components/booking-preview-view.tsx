"use client";

import React, { useState } from "react";
import { useDemo } from "@/lib/demo-context";
import { formatCurrency } from "@/lib/utils";
import {
  Sparkles,
  Scissors,
  Calendar,
  Clock,
  User,
  Phone,
  CheckCircle2,
  Star,
  MapPin,
  ShieldCheck,
  ChevronRight,
  Heart,
  Crown,
  Building2,
  Award,
} from "lucide-react";

export function BookingPreviewView() {
  const { salon, services, staff, bookAppointment } = useDemo();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0]?.id || "");
  const [selectedStaffId, setSelectedStaffId] = useState<string>(staff[0]?.id || "");
  const [selectedDate, setSelectedDate] = useState<string>("Tomorrow, Oct 13");
  const [selectedTime, setSelectedTime] = useState<string>("11:30 AM");

  const [clientName, setClientName] = useState<string>("");
  const [clientPhone, setClientPhone] = useState<string>("");
  const [confirmed, setConfirmed] = useState<boolean>(false);

  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0];
  const selectedStaff = staff.find((s) => s.id === selectedStaffId) || staff[0];

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) return;

    bookAppointment({
      customerName: clientName,
      customerPhone: clientPhone,
      serviceName: selectedService.name,
      staffName: selectedStaff.name,
      staffId: selectedStaff.id,
      time: selectedTime,
      durationMinutes: selectedService.durationMinutes,
      price: selectedService.price,
      source: "Online Booking",
    });

    setConfirmed(true);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner explaining this view */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-6 rounded-3xl shadow-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-amber-500/20 text-amber-300 border border-amber-400/30">
            Client-Facing Digital Experience
          </span>
          <h2 className="text-xl font-black mt-2 tracking-tight text-white">Branded Client Portal & Online Concierge</h2>
          <p className="text-xs text-slate-300 font-medium mt-0.5">
            Published at <span className="font-mono text-blue-400 underline font-bold">luxehaven.ruvexi.com</span> with custom domain SSL
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-white/10 px-3.5 py-2 rounded-2xl backdrop-blur-md border border-white/15">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-bold">Real-time Concurrency Locked</span>
        </div>
      </div>

      {/* Branded Salon Profile Card */}
      <div className="luxury-card rounded-[2.5rem] overflow-hidden border-slate-200 shadow-xl">
        {/* Salon Hero Cover */}
        <div className="h-56 md:h-64 bg-slate-950 relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&auto=format&fit=crop&q=80"
            alt="Salon Interior"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

          <div className="absolute bottom-6 left-8 right-8 flex flex-col md:flex-row md:items-end justify-between gap-4 text-white">
            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white shadow-md">
                🟢 Salon Open • Accepting Online Reservations
              </span>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight mt-2">{salon.name}</h1>
              <p className="text-xs text-slate-300 flex items-center gap-2 font-medium">
                <MapPin className="w-3.5 h-3.5 text-blue-400" /> {salon.address}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white/15 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/20 text-center">
                <div className="text-xs font-black flex items-center justify-center gap-1 text-amber-300">
                  <Star className="w-4 h-4 fill-amber-300" /> {salon.rating}
                </div>
                <div className="text-[10px] text-slate-200 font-medium">{salon.reviewCount} Verified Reviews</div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Wizard Content */}
        <div className="p-8 md:p-10">
          {!confirmed ? (
            <div className="space-y-8">
              {/* Stepper Progress */}
              <div className="flex items-center justify-between max-w-lg mx-auto text-xs font-black text-slate-400">
                <div className={`flex items-center gap-2 ${step >= 1 ? "text-blue-600" : ""}`}>
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? "bg-blue-600 text-white shadow-md shadow-blue-500/30" : "bg-slate-100"}`}>1</span>
                  <span>Select Treatment</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
                <div className={`flex items-center gap-2 ${step >= 2 ? "text-blue-600" : ""}`}>
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? "bg-blue-600 text-white shadow-md shadow-blue-500/30" : "bg-slate-100"}`}>2</span>
                  <span>Choose Artist</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
                <div className={`flex items-center gap-2 ${step >= 3 ? "text-blue-600" : ""}`}>
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 3 ? "bg-blue-600 text-white shadow-md shadow-blue-500/30" : "bg-slate-100"}`}>3</span>
                  <span>Schedule & Pass</span>
                </div>
              </div>

              {/* Step 1: Select Service */}
              {step === 1 && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-black text-slate-900 text-base tracking-tight">Curated Treatment Menu</h3>
                      <p className="text-xs text-slate-500">Select the bespoke treatment you wish to reserve</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((srv) => (
                      <div
                        key={srv.id}
                        onClick={() => setSelectedServiceId(srv.id)}
                        className={`luxury-card p-5 rounded-3xl transition-all cursor-pointer flex flex-col justify-between ${
                          selectedServiceId === srv.id
                            ? "border-blue-600 ring-2 ring-blue-500/20 shadow-xl bg-blue-50/20"
                            : "hover:border-slate-300"
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                              {srv.category}
                            </span>
                            <span className="text-xs text-slate-400 font-medium flex items-center gap-1 font-mono">
                              <Clock className="w-3 h-3 text-slate-400" /> {srv.durationMinutes} mins
                            </span>
                          </div>
                          <h4 className="font-extrabold text-slate-900 text-sm mt-3">{srv.name}</h4>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                            {srv.description}
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-base font-black text-slate-900 font-mono">
                            {formatCurrency(srv.price)}
                          </span>
                          <span className={`text-xs font-black ${selectedServiceId === srv.id ? "text-blue-600" : "text-slate-400"}`}>
                            {selectedServiceId === srv.id ? "✓ Selected" : "Select"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={() => setStep(2)}
                      className="px-7 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs rounded-2xl shadow-xl shadow-blue-500/25 transition-all flex items-center gap-2"
                    >
                      Continue: Select Master Artist <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Select Stylist */}
              {step === 2 && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-black text-slate-900 text-base tracking-tight">Select Master Artist</h3>
                      <p className="text-xs text-slate-500">Choose the specialist you want for your session</p>
                    </div>
                    <button onClick={() => setStep(1)} className="text-xs text-blue-600 hover:underline font-bold">
                      ← Change Treatment
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {staff.map((st) => (
                      <div
                        key={st.id}
                        onClick={() => setSelectedStaffId(st.id)}
                        className={`luxury-card p-5 rounded-3xl transition-all cursor-pointer flex items-center gap-4 ${
                          selectedStaffId === st.id
                            ? "border-blue-600 ring-2 ring-blue-500/20 shadow-xl bg-blue-50/20"
                            : "hover:border-slate-300"
                        }`}
                      >
                        <img
                          src={st.avatar}
                          alt={st.name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
                        />
                        <div className="flex-1">
                          <h4 className="font-black text-slate-900 text-sm">{st.name}</h4>
                          <p className="text-xs text-indigo-700 font-bold">{st.role}</p>
                          <div className="text-[11px] text-amber-600 font-bold flex items-center gap-1 mt-1">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {st.rating} Certified Expert
                          </div>
                        </div>
                        <div className={`text-xs font-black ${selectedStaffId === st.id ? "text-blue-600" : "text-slate-300"}`}>
                          {selectedStaffId === st.id ? "✓" : ""}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={() => setStep(1)}
                      className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="px-7 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs rounded-2xl shadow-xl shadow-blue-500/25 transition-all flex items-center gap-2"
                    >
                      Continue: Reserve Time Slot <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Date, Time & Confirmation */}
              {step === 3 && (
                <form onSubmit={handleConfirmBooking} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-black text-slate-900 text-base tracking-tight">Select Date & Time</h3>
                      <p className="text-xs text-slate-500">Real-time chair calendar slot locking</p>
                    </div>
                    <button type="button" onClick={() => setStep(2)} className="text-xs text-blue-600 hover:underline font-bold">
                      ← Change Artist
                    </button>
                  </div>

                  {/* Date pills */}
                  <div className="flex items-center gap-2.5 overflow-x-auto pb-1 text-xs">
                    {["Today, Oct 12", "Tomorrow, Oct 13", "Wed, Oct 14", "Thu, Oct 15", "Fri, Oct 16"].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setSelectedDate(d)}
                        className={`px-4 py-2.5 rounded-2xl font-black whitespace-nowrap transition-all ${
                          selectedDate === d
                            ? "bg-slate-950 text-white shadow-lg shadow-slate-950/20"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>

                  {/* Time slots */}
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5 text-xs">
                    {["10:00 AM", "11:30 AM", "01:00 PM", "02:30 PM", "04:00 PM", "05:30 PM", "07:00 PM"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSelectedTime(t)}
                        className={`py-3 px-1 rounded-2xl font-extrabold text-center border transition-all ${
                          selectedTime === t
                            ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  {/* Summary Box */}
                  <div className="p-5 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-3xl border border-blue-100 text-xs space-y-2">
                    <div className="flex justify-between font-black text-slate-900 text-sm">
                      <span>{selectedService.name}</span>
                      <span className="font-mono">{formatCurrency(selectedService.price)}</span>
                    </div>
                    <div className="text-slate-600 flex items-center justify-between font-medium">
                      <span>With Master Artist: <b>{selectedStaff.name}</b></span>
                      <span className="font-bold text-blue-700">{selectedDate} at {selectedTime}</span>
                    </div>
                  </div>

                  {/* Client Details Form */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-extrabold text-slate-700 block mb-1.5 uppercase tracking-wider">
                        Client Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Shalini Roy"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-extrabold text-slate-700 block mb-1.5 uppercase tracking-wider">
                        WhatsApp Contact Number
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98..."
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none font-bold font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs rounded-2xl shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2 transform active:scale-95"
                    >
                      Confirm & Reserve Chair <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* Booking Confirmed State */
            <div className="text-center py-12 space-y-5 max-w-md mx-auto animate-in fade-in zoom-in-95">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Reservation Confirmed</h2>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Thank you, <b>{clientName}</b>! A digital pass and appointment calendar confirmation has been delivered to <b>{clientPhone}</b> via WhatsApp.
              </p>

              <div className="p-5 bg-slate-50/90 rounded-3xl border border-slate-200 text-xs text-left space-y-1.5 shadow-2xs">
                <div className="font-extrabold text-slate-900 text-sm">{selectedService.name}</div>
                <div className="text-slate-600 font-medium">Specialist: <b>{selectedStaff.name}</b></div>
                <div className="text-blue-600 font-bold">{selectedDate} at {selectedTime}</div>
                <div className="text-slate-400 text-[11px] pt-2 border-t border-slate-200">
                  Location: {salon.address}
                </div>
              </div>

              <button
                onClick={() => {
                  setConfirmed(false);
                  setStep(1);
                  setClientName("");
                  setClientPhone("");
                }}
                className="px-6 py-3 bg-slate-950 hover:bg-slate-900 text-white font-black text-xs rounded-2xl shadow-lg shadow-slate-900/20"
              >
                Book Another Appointment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
