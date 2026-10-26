"use client";

import React, { useState } from "react";
import { useBillCare } from "@/lib/billcare-context";
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
  const { salon, services, staff, bookAppointment } = useBillCare();

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

    // Auto-dispatch Meta WhatsApp booking pass
    fetch("/api/v1/whatsapp/send-reminder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerPhone: clientPhone,
        customerName: clientName,
        serviceName: selectedService.name,
        staffName: selectedStaff.name,
        dateTime: `${selectedDate} at ${selectedTime}`,
      }),
    }).catch((err) => console.warn("WhatsApp reminder notice:", err));

    setConfirmed(true);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner explaining this view */}
      <div className="bg-[#0D0D0F] text-[#F5F4F0] p-6 rounded-2xl shadow-xl border border-[#27272A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F5C928]/5 blur-[80px] pointer-events-none" />
        <div className="relative z-10">
          <span className="px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase bg-[#171719] text-[#F5C928] border border-[#27272A]">
            Client-Facing Experience
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold mt-2 tracking-tight text-[#F5F4F0]">Online Concierge & Booking</h2>
          <p className="text-xs text-[#7E8B9C] mt-0.5 font-mono">
            Published at <span className="text-[#F5C928] underline">{salon.slug || "salon"}.billcare.io</span> with 0% marketplace commission
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-[#171719] px-4 py-2 rounded-xl border border-[#27272A] relative z-10 font-mono text-[#A3A3AD]">
          <ShieldCheck className="w-4 h-4 text-[#F5C928]" />
          <span>Real-time Concurrency Locked</span>
        </div>
      </div>

      {/* Branded Salon Profile Card */}
      <div className="rounded-2xl overflow-hidden border border-[#27272A] bg-[#0D0D0F] shadow-2xl">
        {/* Salon Hero Cover */}
        <div className="h-56 md:h-64 bg-[#080809] relative overflow-hidden">
          <img
            src="/images/hero-showcase.jpg"
            alt="Salon Interior"
            className="w-full h-full object-cover opacity-40 transform hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0F] via-[#0D0D0F]/50 to-transparent"></div>

          <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-8 md:right-8 flex flex-col md:flex-row md:items-end justify-between gap-3 text-white">
            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-block">
                🟢 Salon Open · Reservations Active
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mt-1 text-[#F5F4F0]">{salon.name}</h1>
              <p className="text-xs text-[#A3A3AD] flex items-center gap-1.5 font-mono line-clamp-1">
                <MapPin className="w-3.5 h-3.5 text-[#F5C928] shrink-0" /> {salon.address}
              </p>
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto">
              <div className="bg-[#111113]/90 backdrop-blur-xl px-4 py-2 rounded-xl border border-[#27272A] text-center">
                <div className="text-xs font-mono font-bold flex items-center justify-center gap-1 text-[#F5C928]">
                  <Star className="w-3.5 h-3.5 fill-[#F5C928]" /> {salon.rating}
                </div>
                <div className="text-[11px] text-[#7E8B9C] font-mono">{salon.reviewCount} Verified Reviews</div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Wizard Content */}
        <div className="p-4 sm:p-8 md:p-10">
          {!confirmed ? (
            <div className="space-y-6 sm:space-y-8">
              {/* Stepper Progress */}
              <div className="flex items-center justify-between max-w-lg mx-auto text-xs font-mono uppercase tracking-wider text-[#7E8B9C] px-1 border-b border-[#27272A] pb-4">
                <div className={`flex items-center gap-2 ${step >= 1 ? "text-[#F5C928] font-bold" : ""}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? "bg-[#F5C928] text-[#080809] font-bold" : "bg-[#171719] text-[#7E8B9C]"}`}>1</span>
                  <span>Treatment</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#27272A]" />
                <div className={`flex items-center gap-2 ${step >= 2 ? "text-[#F5C928] font-bold" : ""}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? "bg-[#F5C928] text-[#080809] font-bold" : "bg-[#171719] text-[#7E8B9C]"}`}>2</span>
                  <span>Artist</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#27272A]" />
                <div className={`flex items-center gap-2 ${step >= 3 ? "text-[#F5C928] font-bold" : ""}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? "bg-[#F5C928] text-[#080809] font-bold" : "bg-[#171719] text-[#7E8B9C]"}`}>3</span>
                  <span>Schedule</span>
                </div>
              </div>

              {/* Step 1: Select Service */}
              {step === 1 && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#F5F4F0] tracking-tight">Curated Treatment Menu</h3>
                      <p className="text-xs text-[#7E8B9C]">Select the bespoke treatment you wish to reserve</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((srv) => (
                      <div
                        key={srv.id}
                        onClick={() => setSelectedServiceId(srv.id)}
                        className={`p-5 rounded-xl transition-all cursor-pointer flex flex-col justify-between border ${
                          selectedServiceId === srv.id
                            ? "border-[#F5C928] bg-[#171719] shadow-xl"
                            : "bg-[#111113] border-[#27272A] hover:border-[#27272A]/80 hover:bg-[#171719]/40"
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[#F5C928] bg-[#171719] px-2.5 py-0.5 rounded-full border border-[#27272A]">
                              {srv.category}
                            </span>
                            <span className="text-xs text-[#7E8B9C] font-mono flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#7E8B9C]" /> {srv.durationMinutes} mins
                            </span>
                          </div>
                          <h4 className="font-bold text-[#F5F4F0] text-sm mt-3">{srv.name}</h4>
                          <p className="text-xs text-[#7E8B9C] mt-1 line-clamp-2 leading-relaxed">
                            {srv.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#27272A] flex items-center justify-between">
                          <span className="text-base font-mono font-bold text-[#F5C928]">
                            {formatCurrency(srv.price)}
                          </span>
                          <span className={`text-xs font-mono uppercase tracking-wider ${selectedServiceId === srv.id ? "text-[#F5C928] font-bold" : "text-[#7E8B9C]"}`}>
                            {selectedServiceId === srv.id ? "✓ Selected" : "Select"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={() => setStep(2)}
                      className="px-7 py-3.5 bg-[#F5C928] hover:bg-[#f7d348] text-[#080809] font-bold text-xs uppercase tracking-wider rounded-xl shadow-xl shadow-[#F5C928]/10 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>Continue to Artist Selection</span> <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Select Stylist */}
              {step === 2 && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#F5F4F0] tracking-tight">Select Master Stylist</h3>
                      <p className="text-xs text-[#7E8B9C]">Choose the specialist you want for your session</p>
                    </div>
                    <button onClick={() => setStep(1)} className="text-xs font-mono text-[#F5C928] hover:underline cursor-pointer">
                      ← Change Treatment
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {staff.map((st) => (
                      <div
                        key={st.id}
                        onClick={() => setSelectedStaffId(st.id)}
                        className={`p-5 rounded-xl transition-all cursor-pointer flex items-center gap-4 border ${
                          selectedStaffId === st.id
                            ? "border-[#F5C928] bg-[#171719] shadow-xl"
                            : "bg-[#111113] border-[#27272A] hover:border-[#27272A]/80 hover:bg-[#171719]/40"
                        }`}
                      >
                        <img
                          src={st.avatar}
                          alt={st.name}
                          className="w-14 h-14 rounded-xl object-cover border border-[#27272A]"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-[#F5F4F0] text-sm">{st.name}</h4>
                          <p className="text-xs text-[#A3A3AD] font-mono">{st.role}</p>
                          <div className="text-[11px] text-[#F5C928] font-mono flex items-center gap-1 mt-1 font-bold">
                            <Star className="w-3 h-3 fill-[#F5C928]" /> {st.rating} Certified
                          </div>
                        </div>
                        <div className={`text-xs font-mono ${selectedStaffId === st.id ? "text-[#F5C928] font-bold" : "text-[#27272A]"}`}>
                          {selectedStaffId === st.id ? "✓" : ""}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={() => setStep(1)}
                      className="px-5 py-3 bg-[#171719] hover:bg-[#27272A] text-[#A3A3AD] font-bold text-xs uppercase tracking-wider rounded-xl border border-[#27272A] cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="px-7 py-3.5 bg-[#F5C928] hover:bg-[#f7d348] text-[#080809] font-bold text-xs uppercase tracking-wider rounded-xl shadow-xl shadow-[#F5C928]/10 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>Continue to Time Slot</span> <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Date, Time & Confirmation */}
              {step === 3 && (
                <form onSubmit={handleConfirmBooking} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#F5F4F0] tracking-tight">Select Date & Time</h3>
                      <p className="text-xs text-[#7E8B9C]">Real-time chair calendar slot locking</p>
                    </div>
                    <button type="button" onClick={() => setStep(2)} className="text-xs font-mono text-[#F5C928] hover:underline cursor-pointer">
                      ← Change Artist
                    </button>
                  </div>

                  {/* Date pills */}
                  <div className="flex items-center gap-2.5 overflow-x-auto pb-1 text-xs font-mono">
                    {["Today, Oct 12", "Tomorrow, Oct 13", "Wed, Oct 14", "Thu, Oct 15", "Fri, Oct 16"].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setSelectedDate(d)}
                        className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                          selectedDate === d
                            ? "bg-[#F5C928] text-[#080809] font-bold shadow-lg"
                            : "bg-[#111113] text-[#A3A3AD] border border-[#27272A] hover:text-[#F5F4F0]"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>

                  {/* Time slots */}
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5 text-xs font-mono">
                    {["10:00 AM", "11:30 AM", "01:00 PM", "02:30 PM", "04:00 PM", "05:30 PM", "07:00 PM"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSelectedTime(t)}
                        className={`py-3 px-1 rounded-xl text-center border transition-all cursor-pointer ${
                          selectedTime === t
                            ? "bg-[#F5C928] text-[#080809] font-bold border-[#F5C928] shadow-md"
                            : "bg-[#111113] text-[#A3A3AD] border-[#27272A] hover:text-[#F5F4F0]"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  {/* Summary Box */}
                  <div className="p-5 bg-[#111113] rounded-xl border border-[#27272A] text-xs space-y-2">
                    <div className="flex justify-between font-bold text-[#F5F4F0] text-sm">
                      <span>{selectedService.name}</span>
                      <span className="font-mono text-[#F5C928]">{formatCurrency(selectedService.price)}</span>
                    </div>
                    <div className="text-[#A3A3AD] flex items-center justify-between font-mono">
                      <span>Specialist: <strong className="text-[#F5F4F0] font-bold">{selectedStaff.name}</strong></span>
                      <span className="text-[#F5C928]">{selectedDate} at {selectedTime}</span>
                    </div>
                  </div>

                  {/* Client Details Form */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-mono text-[#A3A3AD] text-[11px] block mb-1.5 uppercase tracking-wider">
                        Client Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Shalini Roy"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full px-4 py-3 bg-[#111113] border border-[#27272A] rounded-xl text-[#F5F4F0] placeholder-[#7E8B9C] focus:border-[#F5C928] focus:outline-none font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-[#A3A3AD] text-[11px] block mb-1.5 uppercase tracking-wider">
                        WhatsApp Contact Number
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98..."
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full px-4 py-3 bg-[#111113] border border-[#27272A] rounded-xl text-[#F5F4F0] placeholder-[#7E8B9C] focus:border-[#F5C928] focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-5 py-3 bg-[#171719] hover:bg-[#27272A] text-[#A3A3AD] font-bold text-xs uppercase tracking-wider rounded-xl border border-[#27272A] cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3.5 bg-[#F5C928] hover:bg-[#f7d348] text-[#080809] font-bold text-xs uppercase tracking-wider rounded-xl shadow-xl shadow-[#F5C928]/10 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>Confirm & Reserve Chair</span> <CheckCircle2 className="w-4 h-4 text-[#080809]" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* Booking Confirmed State */
            <div className="text-center py-12 space-y-5 max-w-md mx-auto animate-in fade-in zoom-in-95">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F5F4F0] tracking-tight">Reservation Confirmed</h2>
              <p className="text-xs text-[#A3A3AD] leading-relaxed">
                Thank you, <strong className="text-[#F5F4F0]">{clientName}</strong>! A digital pass and appointment calendar confirmation has been delivered to <strong className="font-mono text-[#F5C928]">{clientPhone}</strong> via WhatsApp.
              </p>

              <div className="p-5 bg-[#111113] rounded-xl border border-[#27272A] text-xs text-left space-y-1.5 shadow-xl">
                <div className="font-bold text-[#F5F4F0] text-sm">{selectedService.name}</div>
                <div className="text-[#A3A3AD] font-mono">Specialist: <strong className="text-[#F5F4F0] font-bold">{selectedStaff.name}</strong></div>
                <div className="text-[#F5C928] font-mono font-bold">{selectedDate} at {selectedTime}</div>
                <div className="text-[#7E8B9C] text-[11px] pt-2 border-t border-[#27272A] font-mono">
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
                className="px-6 py-3 bg-[#F5C928] hover:bg-[#f7d348] text-[#080809] font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
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
