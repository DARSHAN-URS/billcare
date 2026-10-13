"use client";

import React, { useState } from "react";
import { useDemo } from "@/lib/demo-context";
import { formatCurrency } from "@/lib/utils";
import {
  Users,
  Clock,
  Award,
  DollarSign,
  TrendingUp,
  UserPlus,
  Star,
  CheckCircle2,
  Coffee,
  LogOut,
  Phone,
  Sparkles,
  Percent,
  X,
  Edit2,
  Calendar,
  Crown,
  ShieldCheck,
  Scissors,
} from "lucide-react";

export function StaffView() {
  const { staff, toggleStaffStatus, updateStaffCommission, addStaffMember } = useDemo();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCommissionId, setEditingCommissionId] = useState<string | null>(null);
  const [newCommissionRate, setNewCommissionRate] = useState<number>(15);

  // Form State for new staff
  const [name, setName] = useState("");
  const [role, setRole] = useState("Master Hair Stylist");
  const [specialties, setSpecialties] = useState("Balayage, Keratin Therapy");
  const [phone, setPhone] = useState("+91 98");
  const [commissionRate, setCommissionRate] = useState(15);
  const [avatar, setAvatar] = useState(
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
  );

  // Aggregated totals
  const totalTodayRevenue = staff.reduce((acc, s) => acc + s.todayRevenue, 0);
  const totalCommissionPayout = staff.reduce((acc, s) => acc + s.todayCommission, 0);
  const clockedInCount = staff.filter((s) => s.status === "clocked_in").length;
  const onBreakCount = staff.filter((s) => s.status === "on_break").length;

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addStaffMember({
      name,
      role,
      specialty: specialties.split(",").map((s) => s.trim()),
      phone,
      avatar,
      commissionRate,
      status: "clocked_in",
      clockInTime: "Just now",
    });

    setName("");
    setPhone("+91 98");
    setShowAddModal(false);
  };

  const handleSaveCommission = (id: string) => {
    updateStaffCommission(id, newCommissionRate);
    setEditingCommissionId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Metrics */}
      <div className="luxury-card p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-700 flex items-center justify-center text-white shadow-lg shadow-indigo-600/25 border border-white/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Staff & Stylists</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Attendance & Earnings
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Who is working today • Commission earnings • 1-tap clock in / out
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" /> Add Stylist
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="luxury-card p-5 rounded-3xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Working Right Now</span>
            <span className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {clockedInCount} <span className="text-xs font-bold text-slate-400">/ {staff.length} Present</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-bold mt-1">
            {onBreakCount} on break • {staff.length - clockedInCount - onBreakCount} off shift
          </p>
        </div>

        <div className="luxury-card p-5 rounded-3xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Today's Stylist Sales</span>
            <span className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 font-mono">{formatCurrency(totalTodayRevenue)}</div>
          <p className="text-[11px] text-blue-600 font-bold mt-1">Services & products sold today</p>
        </div>

        <div className="luxury-card p-5 rounded-3xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Total Commission</span>
            <span className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
              <Percent className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-purple-700 mt-2 font-mono">{formatCurrency(totalCommissionPayout)}</div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Calculated automatically from today's bills</p>
        </div>

        <div className="luxury-card p-5 rounded-3xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Client Reviews</span>
            <span className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <Star className="w-4 h-4 fill-amber-500" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 font-mono">4.88 ★</div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">100% verified customer feedbacks</p>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {staff.map((member) => (
          <div
            key={member.id}
            className="luxury-card rounded-3xl p-6 flex flex-col justify-between hover:border-indigo-400 hover:shadow-xl transition-all"
          >
            <div>
              {/* Member Top Bar */}
              <div className="flex items-start gap-4">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-md"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-extrabold text-slate-900 truncate">{member.name}</h3>
                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                        member.status === "clocked_in"
                          ? "bg-emerald-100 text-emerald-800"
                          : member.status === "on_break"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {member.status === "clocked_in" && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {member.status === "on_break" && <Coffee className="w-3.5 h-3.5" />}
                      {member.status === "clocked_out" && <LogOut className="w-3.5 h-3.5" />}
                      {member.status === "clocked_in"
                        ? "Clocked In"
                        : member.status === "on_break"
                        ? "On Break"
                        : "Clocked Out"}
                    </span>
                  </div>
                  <p className="text-xs text-indigo-700 font-bold mt-0.5">{member.role}</p>
                  <p className="text-[11px] text-slate-500 font-mono flex items-center gap-2 mt-1">
                    <Phone className="w-3 h-3 text-slate-400" /> {member.phone} •{" "}
                    <span className="text-amber-600 font-bold flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {member.rating}
                    </span>
                  </p>
                </div>
              </div>

              {/* Specialties */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {member.specialty.map((spec, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-lg border border-slate-200/60"
                  >
                    {spec}
                  </span>
                ))}
              </div>

              {/* Performance Stats Box */}
              <div className="grid grid-cols-3 gap-2 mt-5 p-3.5 bg-slate-50/90 rounded-2xl border border-slate-100 text-center">
                <div>
                  <span className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">
                    Completed
                  </span>
                  <span className="text-xs font-extrabold text-slate-900 mt-0.5 block">
                    {member.todayServicesCount} sessions
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">
                    Sales Attributed
                  </span>
                  <span className="text-xs font-black text-blue-600 font-mono mt-0.5 block">
                    {formatCurrency(member.todayRevenue)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">
                    Commission
                  </span>
                  <span className="text-xs font-black text-emerald-600 font-mono mt-0.5 block">
                    {formatCurrency(member.todayCommission)}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions: Shift Toggle & Commission Edit */}
            <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                {editingCommissionId === member.id ? (
                  <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-xl p-1">
                    <input
                      type="number"
                      value={newCommissionRate}
                      onChange={(e) => setNewCommissionRate(Number(e.target.value))}
                      className="w-12 text-xs font-black text-slate-900 text-center focus:outline-none"
                    />
                    <span className="text-xs font-bold text-slate-500">%</span>
                    <button
                      onClick={() => handleSaveCommission(member.id)}
                      className="px-2.5 py-1 text-[10px] font-black bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditingCommissionId(member.id);
                      setNewCommissionRate(member.commissionRate);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-blue-600 font-bold bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200 transition-all"
                    title="Click to modify commission rate rule"
                  >
                    <Percent className="w-3.5 h-3.5 text-blue-500" />
                    <span>Rate: <b className="text-slate-900">{member.commissionRate}%</b></span>
                    <Edit2 className="w-3 h-3 text-slate-400" />
                  </button>
                )}
              </div>

              {/* Status Switcher Button */}
              <button
                onClick={() => toggleStaffStatus(member.id)}
                className="px-3.5 py-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Clock className="w-3.5 h-3.5 text-slate-300" />
                Toggle Shift Status
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 w-full max-w-md animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">Add New Team Specialist</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika Menon"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Role / Designation</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold text-slate-800"
                  >
                    <option value="Senior Hair Stylist">Senior Hair Stylist</option>
                    <option value="Master Colorist">Master Colorist</option>
                    <option value="Senior Barber">Senior Barber</option>
                    <option value="Clinical Aesthetician">Clinical Aesthetician</option>
                    <option value="Nail Artiste">Nail Artiste</option>
                    <option value="Salon Receptionist">Salon Receptionist</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Commission Rate (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-extrabold text-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-mono font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Specialties (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Keratin, Balayage, Scalp Treatment"
                  value={specialties}
                  onChange={(e) => setSpecialties(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-md shadow-blue-500/20"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
