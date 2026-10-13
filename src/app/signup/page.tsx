"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDemo } from "@/lib/demo-context";
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
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { registerSalon, showToast } = useDemo();

  const [step, setStep] = useState<number>(1);
  const [isProvisioning, setIsProvisioning] = useState<boolean>(false);

  // Form State
  const [ownerName, setOwnerName] = useState<string>("Sunil Kumar");
  const [email, setEmail] = useState<string>("sunil@auricatelier.in");
  const [phone, setPhone] = useState<string>("+91 98450 88219");
  const [password, setPassword] = useState<string>("••••••••••••");

  const [salonName, setSalonName] = useState<string>("Auric Atelier & Aesthetic Spa");
  const [subdomainSlug, setSubdomainSlug] = useState<string>("auric-atelier");
  const [category, setCategory] = useState<string>("Hair Studio & Luxury Spa");
  const [chairs, setChairs] = useState<number>(6);

  const [city, setCity] = useState<string>("Bengaluru");
  const [currency, setCurrency] = useState<string>("₹");
  const [gstin, setGstin] = useState<string>("29AABCU9603R1ZM");
  const [autoGst, setAutoGst] = useState<boolean>(true);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleCompleteSetup = () => {
    setIsProvisioning(true);

    setTimeout(() => {
      registerSalon({
        name: salonName,
        ownerName: ownerName,
        branch: `${city} Flagship`,
        chairs: chairs,
        category: category,
      });

      showToast(`Workspace initialized for ${salonName}`);
      setIsProvisioning(false);
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-slate-800 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      {/* Top Header */}
      <div className="border-b border-slate-200 bg-white/90 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-slate-950 text-white flex items-center justify-center font-bold text-sm">
            R
          </div>
          <span className="font-extrabold text-base tracking-tight text-slate-950">
            RUVEXI
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            SALON ONBOARDING
          </span>
        </Link>

        <div className="flex items-center gap-4 text-xs">
          <span className="text-slate-500 hidden sm:inline">Already registered?</span>
          <Link
            href="/login"
            className="font-bold text-slate-950 hover:underline"
          >
            Sign In Instead
          </Link>
        </div>
      </div>

      {/* Main Multi-Step Setup Wizard */}
      <div className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-center">
        {/* Step Progress Tracker */}
        <div className="mb-8 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span className="text-slate-900 uppercase tracking-wider font-mono">
              STEP {step} OF 4
            </span>
            <span>
              {step === 1 && "Managing Director Profile"}
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
                  s <= step ? "bg-slate-950" : "bg-slate-200"
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Wizard Card Body */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm">
          {/* STEP 1: Account Info */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
                  Salon Owner Credentials
                </h2>
                <p className="text-xs text-slate-500">
                  Set up your primary administrator credentials to access your financial reports and settings.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="e.g. Sunil Kumar"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Work Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@yoursalon.com"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">WhatsApp Mobile Number</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98450 00000"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Master Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
                >
                  <span>Continue to Salon Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Salon Brand */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
                  Salon Identity & Custom Domain
                </h2>
                <p className="text-xs text-slate-500">
                  Configure your business brand name and dedicated online booking portal URL.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Salon Name</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
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
                      placeholder="e.g. Auric Atelier & Aesthetic Spa"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Customer Booking URL</label>
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900">
                    <Globe className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                    <span className="font-mono text-slate-950 font-bold">{subdomainSlug || "yoursalon"}</span>
                    <span className="font-mono text-slate-400">.ruvexi.com</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Business Specialization</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="Hair Studio & Luxury Spa">Hair Studio & Luxury Aesthetic Spa</option>
                    <option value="Boutique Hair Salon">Boutique Hair Salon & Color Bar</option>
                    <option value="Gentlemen Barber Lounge">Gentlemen Barber Lounge & Grooming</option>
                    <option value="Nail & Lash Art Bar">Nail Art & Lash Extensions Studio</option>
                    <option value="Skin Wellness & Medi-Spa">Skin Wellness & Medi-Spa Clinic</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-700">Active Styling Chairs / Stations</span>
                    <span className="text-slate-950 font-mono font-black">{chairs} Chairs</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={chairs}
                    onChange={(e) => setChairs(Number(e.target.value))}
                    className="w-full accent-slate-950 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
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
                  className="px-4 py-2 text-slate-500 hover:text-slate-900 font-bold text-xs flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
                >
                  <span>Continue to Financials</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Location & Taxes */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
                  Location & Financial Settings
                </h2>
                <p className="text-xs text-slate-500">
                  Configure tax parameters and currency formatting for automatic invoice generation.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Primary City / Hub</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Bengaluru"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Billing Currency</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none cursor-pointer"
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
                  <label className="text-xs font-bold text-slate-700">GSTIN / Tax ID</label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    placeholder="29AABCU9603R1ZM"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none font-mono"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <label className="flex items-center gap-3 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={autoGst}
                      onChange={(e) => setAutoGst(e.target.checked)}
                      className="w-4 h-4 rounded accent-slate-950 border-slate-300"
                    />
                    <div>
                      <div className="font-bold text-slate-900">Automatic 18% GST (CGST 9% + SGST 9%)</div>
                      <div className="text-[11px] text-slate-500">Computes and prints compliant tax breakdown on every checkout.</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2 text-slate-500 hover:text-slate-900 font-bold text-xs flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
                >
                  <span>Review & Provision</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Review & Provision */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
                  Review & Provision Salon Instance
                </h2>
                <p className="text-xs text-slate-500">
                  Review your parameters below. Your 14-day trial includes all modules and zero transaction commissions.
                </p>
              </div>

              {/* Review Card */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 text-white font-bold text-sm flex items-center justify-center">
                      {salonName.charAt(0) || "S"}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-950">{salonName}</div>
                      <div className="text-[11px] text-blue-700 font-mono">
                        {subdomainSlug}.ruvexi.com
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    14 DAYS FREE TRIAL
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Salon Director</span>
                    <span className="font-bold text-slate-800">{ownerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Styling Chairs</span>
                    <span className="font-bold text-slate-800">{chairs} Chairs</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Specialization</span>
                    <span className="font-bold text-slate-800">{category}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Location</span>
                    <span className="font-bold text-slate-800">{city} Flagship</span>
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Pre-seeded with service menu fixtures and commission rules</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>PostgreSQL Row-Level Security tenant isolation enabled</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>0% Commission guarantee on all customer appointments</span>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isProvisioning}
                  className="px-4 py-2 text-slate-500 hover:text-slate-900 font-bold text-xs flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleCompleteSetup}
                  disabled={isProvisioning}
                  className="px-8 py-3 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 disabled:opacity-50"
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
      </div>
    </div>
  );
}
