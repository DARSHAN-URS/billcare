"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBillCare } from "@/lib/billcare-context";
import { BillCareLogo } from "@/components/brand/billcare-logo";
import {
  User,
  Mail,
  Lock,
  Phone,
  Building2,
  Globe,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { signup, showToast } = useBillCare();

  const [step, setStep] = useState<number>(1);
  const [isProvisioning, setIsProvisioning] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Form State
  const [ownerName, setOwnerName] = useState<string>("Sunil Kumar");
  const [email, setEmail] = useState<string>("sunil@billcaresalon.com");
  const [phone, setPhone] = useState<string>("+91 98450 88219");
  const [password, setPassword] = useState<string>("billcare2026");

  const [salonName, setSalonName] = useState<string>("Aura Luxury Salon & Spa");
  const [subdomainSlug, setSubdomainSlug] = useState<string>("aura-salon");
  const [category, setCategory] = useState<string>("Hair Studio & Luxury Spa");
  const [chairs, setChairs] = useState<number>(6);

  const [city, setCity] = useState<string>("Bengaluru");
  const [currency, setCurrency] = useState<string>("₹");
  const [gstin, setGstin] = useState<string>("29AABCU9603R1ZM");
  const [autoGst, setAutoGst] = useState<boolean>(true);

  const handleNext = () => {
    setErrorMessage("");
    if (step === 1) {
      if (!ownerName || !email || !phone) {
        setErrorMessage("Please fill in all owner credential fields.");
        return;
      }
    } else if (step === 2) {
      if (!salonName) {
        setErrorMessage("Please enter your salon name.");
        return;
      }
    }
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    setErrorMessage("");
    if (step > 1) setStep(step - 1);
  };

  const handleCompleteSetup = async () => {
    setIsProvisioning(true);
    setErrorMessage("");

    try {
      const res = await signup(
        {
          name: ownerName,
          email: email,
          phone: phone,
          password: password,
        },
        {
          name: salonName,
          city: city,
          category: category,
          chairs: chairs,
          currency: currency,
          gstin: gstin,
        }
      );

      if (res.success) {
        router.push("/dashboard");
      } else {
        setErrorMessage(res.error || "Failed to initialize salon instance.");
        setIsProvisioning(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to provision workspace.");
      setIsProvisioning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-100 flex flex-col font-sans selection:bg-amber-200 selection:text-slate-950">
      {/* Top Header */}
      <header className="border-b border-white/[0.08] bg-[#0c0c0e]/80 backdrop-blur-xl px-6 lg:px-12 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <BillCareLogo size="sm" variant="light" showSubtitle={true} />
          <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-full bg-white/[0.06] text-amber-300 border border-white/[0.1] ml-2">
            ONBOARDING
          </span>
        </Link>

        <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-wider">
          <span className="text-slate-400 hidden sm:inline">Already registered?</span>
          <Link
            href="/login"
            className="text-white hover:text-amber-300 underline underline-offset-4 font-medium transition-colors"
          >
            Sign In Instead
          </Link>
        </div>
      </header>

      {/* Main Multi-Step Setup Wizard */}
      <div className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-center">
        {/* Step Progress Tracker */}
        <div className="mb-8 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-400">
            <span className="text-amber-300 font-medium">
              STEP {step} OF 4
            </span>
            <span className="text-slate-300">
              {step === 1 && "Salon Owner Profile"}
              {step === 2 && "Salon Brand & Category"}
              {step === 3 && "Location & GST Tax Settings"}
              {step === 4 && "Review & Provision"}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s <= step ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]" : "bg-white/10"
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Wizard Card Body */}
        <div className="bg-[#0c0c0e] border border-white/[0.12] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[90px] pointer-events-none" />

          {/* STEP 1: Account Info */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200 relative z-10">
              <div className="space-y-1">
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-white tracking-tight">
                  Salon Owner Credentials
                </h2>
                <p className="text-xs text-slate-400 font-light">
                  Set up your primary administrator credentials to access your financial reports, staff roster, and POS checkout.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="e.g. Sunil Kumar"
                      className="w-full bg-[#121216] border border-white/[0.12] focus:border-amber-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300">Work Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@yoursalon.com"
                      className="w-full bg-[#121216] border border-white/[0.12] focus:border-amber-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-slate-300">WhatsApp Number</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98450 00000"
                        className="w-full bg-[#121216] border border-white/[0.12] focus:border-amber-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none font-mono transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-slate-300">Master Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-[#121216] border border-white/[0.12] focus:border-amber-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none font-mono transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 bg-white hover:bg-slate-200 text-slate-950 font-semibold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue to Salon Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Salon Brand */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200 relative z-10">
              <div className="space-y-1">
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-white tracking-tight">
                  Salon Identity & Custom Portal
                </h2>
                <p className="text-xs text-slate-400 font-light">
                  Configure your brand name and your dedicated 24/7 online customer booking portal URL.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300">Salon Name</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={salonName}
                      onChange={(e) => {
                        setSalonName(e.target.value);
                        setSubdomainSlug(
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9]/g, "-")
                            .replace(/-+/g, "-")
                        );
                      }}
                      placeholder="e.g. Aura Luxury Salon & Spa"
                      className="w-full bg-[#121216] border border-white/[0.12] focus:border-amber-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300">Customer Booking URL</label>
                  <div className="flex items-center bg-[#121216] border border-white/[0.12] rounded-xl px-3.5 py-2.5 text-xs text-white">
                    <Globe className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
                    <span className="font-mono text-amber-300 font-medium">{subdomainSlug || "yoursalon"}</span>
                    <span className="font-mono text-slate-400">.billcare.io</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300">Business Specialization</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#121216] border border-white/[0.12] focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="Hair Studio & Luxury Spa">Hair Studio & Luxury Aesthetic Spa</option>
                    <option value="Boutique Hair Salon">Boutique Hair Salon & Color Bar</option>
                    <option value="Gentlemen Barber Lounge">Gentlemen Barber Lounge & Grooming</option>
                    <option value="Nail & Lash Art Bar">Nail Art & Lash Extensions Studio</option>
                    <option value="Skin Wellness & Medi-Spa">Skin Wellness & Medi-Spa Clinic</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-300 uppercase tracking-wider">Styling Chairs / Treatment Rooms</span>
                    <span className="text-amber-300 font-medium">{chairs} Chairs</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={chairs}
                    onChange={(e) => setChairs(Number(e.target.value))}
                    className="w-full accent-amber-400 h-2 bg-white/10 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>1 Chair</span>
                    <span>6 Chairs</span>
                    <span>20 Chairs</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2 text-slate-400 hover:text-white font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 bg-white hover:bg-slate-200 text-slate-950 font-semibold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue to Financials</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Location & Taxes */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200 relative z-10">
              <div className="space-y-1">
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-white tracking-tight">
                  Location & Financial Settings
                </h2>
                <p className="text-xs text-slate-400 font-light">
                  Configure tax parameters and currency formatting for automatic POS invoice generation.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-slate-300">City / Location</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Bengaluru"
                        className="w-full bg-[#121216] border border-white/[0.12] focus:border-amber-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-slate-300">Currency</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full bg-[#121216] border border-white/[0.12] focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                    >
                      <option value="₹">₹ - Indian Rupee (INR)</option>
                      <option value="$">$ - US Dollar (USD)</option>
                      <option value="€">€ - Euro (EUR)</option>
                      <option value="AED">AED - UAE Dirham</option>
                      <option value="£">£ - British Pound</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300">GSTIN / Tax ID</label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    placeholder="29AABCU9603R1ZM"
                    className="w-full bg-[#121216] border border-white/[0.12] focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none font-mono"
                  />
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                  <label className="flex items-center gap-3 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={autoGst}
                      onChange={(e) => setAutoGst(e.target.checked)}
                      className="w-4 h-4 rounded accent-amber-400 bg-white/10 border-white/20"
                    />
                    <div>
                      <div className="font-medium text-white">Automatic 18% GST (CGST 9% + SGST 9%)</div>
                      <div className="text-[11px] text-slate-400 font-light">Computes and prints compliant tax breakdown on every checkout receipt.</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2 text-slate-400 hover:text-white font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 bg-white hover:bg-slate-200 text-slate-950 font-semibold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Review & Provision</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Review & Provision */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200 relative z-10">
              <div className="space-y-1">
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-white tracking-tight">
                  Review & Initialize Workspace
                </h2>
                <p className="text-xs text-slate-400 font-light">
                  Review your parameters below. Your 14-day trial includes all modules, unlimited staff, and zero transaction commissions.
                </p>
              </div>

              {/* Review Card */}
              <div className="bg-[#121216] p-5 rounded-2xl border border-white/[0.08] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white text-slate-950 font-bold text-sm flex items-center justify-center">
                      {salonName.charAt(0) || "B"}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-white">{salonName}</div>
                      <div className="text-[11px] text-amber-300 font-mono">
                        {subdomainSlug}.billcare.io
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 text-[10px] font-mono tracking-widest uppercase">
                    14 DAYS FREE TRIAL
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] font-mono uppercase tracking-wider block">Salon Director</span>
                    <span className="font-medium text-white">{ownerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] font-mono uppercase tracking-wider block">Styling Chairs</span>
                    <span className="font-medium text-white">{chairs} Chairs</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] font-mono uppercase tracking-wider block">Specialization</span>
                    <span className="font-medium text-white">{category}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] font-mono uppercase tracking-wider block">Location</span>
                    <span className="font-medium text-white">{city} Studio</span>
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-2 text-xs text-slate-300 font-light">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Real appointment calendar & 24/7 online booking engine ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Integrated POS checkout, GST calculations & thermal receipt printer</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>0% Commission guarantee on all customer appointments</span>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isProvisioning}
                  className="px-4 py-2 text-slate-400 hover:text-white font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleCompleteSetup}
                  disabled={isProvisioning}
                  className="px-8 py-3.5 bg-white hover:bg-slate-200 text-slate-950 font-semibold text-xs uppercase tracking-wider rounded-xl shadow-xl transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isProvisioning ? (
                    <span>Provisioning Isolated Workspace...</span>
                  ) : (
                    <>
                      <span>Complete Setup & Enter Console</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Social Proof & Trust Footer */}
        <div className="mt-6 bg-[#0c0c0e] border border-white/[0.08] rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/images/owner-priya.jpg"
              alt="Priya Nair"
              className="w-10 h-10 rounded-full object-cover border border-amber-400/30 shrink-0"
            />
            <div>
              <div className="text-xs font-medium text-white">Priya Nair · Maison Luxe Studio, Bengaluru</div>
              <div className="text-[11px] text-slate-400 font-light">"Setup took under 3 minutes. Our receptionists love it."</div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1 text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              14-Day Free Trial
            </span>
            <span className="flex items-center gap-1 text-slate-300 bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/[0.08]">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              No Card Needed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
