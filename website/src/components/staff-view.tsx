"use client";

import React, { useState } from "react";
import { useBillCare } from "@/lib/billcare-context";
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
  Lock,
} from "lucide-react";

export function StaffView() {
  const { user, staff, toggleStaffStatus, updateStaffCommission, addStaffMember } = useBillCare();
  const isOwner = user?.role === "owner" || user?.role === "admin";

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
  const totalTodayRevenue = staff.reduce((acc, s) => acc + (s.todayRevenue || s.todayEarnings || 0), 0);
  const totalCommissionPayout = staff.reduce((acc, s) => acc + (s.todayCommission || 0), 0);
  const clockedInCount = staff.filter((s) => s.status === "clocked_in" || s.isClockedIn).length;
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
      <div className="bg-[#0D0D0F] border border-[#27272A] p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#F5C928]/10 border border-[#F5C928]/30 flex items-center justify-center text-[#F5C928] shadow-lg shadow-[#F5C928]/5 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-serif font-bold text-[#F5F4F0] tracking-tight">Staff & Stylists</h1>
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-[#171719] text-[#F5C928] border border-[#27272A]">
                Attendance & Earnings
              </span>
            </div>
            <p className="text-xs text-[#7E8B9C] mt-0.5">
              Who is working today • Commission earnings • 1-tap clock in / out
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#F5C928] hover:bg-[#f7d348] text-[#080809] font-bold text-xs rounded-xl shadow-lg shadow-[#F5C928]/10 transition-all self-start sm:self-auto cursor-pointer"
        >
          <UserPlus className="w-4 h-4" /> Add Stylist
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111113] border border-[#27272A] p-5 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-[#7E8B9C] uppercase tracking-wider">Working Right Now</span>
            <span className="p-2 bg-[#171719] text-emerald-400 rounded-lg border border-[#27272A]">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-mono font-bold text-[#F5F4F0] mt-2">
            {clockedInCount} <span className="text-xs text-[#7E8B9C]">/ {staff.length} Present</span>
          </div>
          <p className="text-[11px] text-emerald-400 font-mono mt-1">
            {onBreakCount} on break • {staff.length - clockedInCount - onBreakCount} off shift
          </p>
        </div>

        <div className="bg-[#111113] border border-[#27272A] p-5 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-[#7E8B9C] uppercase tracking-wider">Today's Stylist Sales</span>
            <span className="p-2 bg-[#171719] text-[#F5C928] rounded-lg border border-[#27272A]">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-mono font-bold text-[#F5C928] mt-2">{formatCurrency(totalTodayRevenue)}</div>
          <p className="text-[11px] text-[#A3A3AD] mt-1 font-mono">Services & products sold today</p>
        </div>

        <div className="bg-[#111113] border border-[#27272A] p-5 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-[#7E8B9C] uppercase tracking-wider">Total Commission</span>
            <span className="p-2 bg-[#171719] text-[#F5C928] rounded-lg border border-[#27272A]">
              <Percent className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-mono font-bold text-[#F5C928] mt-2">{formatCurrency(totalCommissionPayout)}</div>
          <p className="text-[11px] text-[#7E8B9C] mt-1 font-mono">Calculated from today's bills</p>
        </div>

        <div className="bg-[#111113] border border-[#27272A] p-5 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-[#7E8B9C] uppercase tracking-wider">Client Reviews</span>
            <span className="p-2 bg-[#171719] text-[#F5C928] rounded-lg border border-[#27272A]">
              <Star className="w-4 h-4 fill-[#F5C928]" />
            </span>
          </div>
          <div className="text-2xl font-mono font-bold text-[#F5F4F0] mt-2">4.88 ★</div>
          <p className="text-[11px] text-[#7E8B9C] mt-1 font-mono">100% verified customer feedbacks</p>
        </div>
      </div>

      {/* Staff Grid */}
      {staff.length === 0 ? (
        <div className="bg-[#111113] border border-[#27272A] p-12 rounded-2xl text-center space-y-4 max-w-md mx-auto shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-[#171719] border border-[#27272A] text-[#F5C928] flex items-center justify-center mx-auto">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-[#F5F4F0]">No Team Members Yet</h3>
            <p className="text-xs text-[#7E8B9C] mt-1">
              Add your stylists, barbers, nail artists, and team to start tracking attendance and commissions.
            </p>
          </div>
          <div className="pt-1">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 bg-[#F5C928] hover:bg-[#f7d348] text-[#080809] font-bold text-xs rounded-xl shadow-xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" /> Add Your First Team Member
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {staff.map((member) => (
          <div
            key={member.id}
            className="bg-[#111113] border border-[#27272A] rounded-xl p-5 flex flex-col justify-between hover:border-[#F5C928]/50 hover:bg-[#171719] transition-all shadow-lg"
          >
            <div>
              {/* Member Top Bar */}
              <div className="flex items-start gap-4">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-16 h-16 rounded-xl object-cover border border-[#27272A] shadow-md"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-[#F5F4F0] truncate">{member.name}</h3>
                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
                        member.status === "clocked_in"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : member.status === "on_break"
                          ? "bg-[#F5C928]/20 text-[#F5C928] border border-[#F5C928]/30"
                          : "bg-[#171719] text-[#7E8B9C] border border-[#27272A]"
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
                  <p className="text-xs text-[#F5C928] font-bold mt-0.5">{member.role}</p>
                  <p className="text-[11px] text-[#7E8B9C] font-mono flex items-center gap-2 mt-1">
                    <Phone className="w-3 h-3 text-[#7E8B9C]" /> {member.phone} •{" "}
                    <span className="text-[#F5C928] font-bold flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-[#F5C928] text-[#F5C928]" /> {member.rating}
                    </span>
                  </p>
                </div>
              </div>

              {/* Specialties */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {(member.specialty || []).map((spec: any, i: number) => (
                  <span
                    key={i}
                    className="text-[10px] font-mono font-medium bg-[#171719] text-[#A3A3AD] px-2.5 py-0.5 rounded-lg border border-[#27272A]"
                  >
                    {spec}
                  </span>
                ))}
              </div>

              {/* Performance Stats Box */}
              <div className="grid grid-cols-3 gap-2 mt-5 p-3.5 bg-[#0D0D0F] rounded-xl border border-[#27272A] text-center">
                <div>
                  <span className="text-[10px] uppercase font-mono font-bold text-[#7E8B9C] block tracking-wider">
                    Completed
                  </span>
                  <span className="text-xs font-mono font-bold text-[#F5F4F0] mt-0.5 block">
                    {member.todayServicesCount || member.totalServicesCompleted || 0} sessions
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono font-bold text-[#7E8B9C] block tracking-wider">
                    Attributed
                  </span>
                  <span className="text-xs font-mono font-bold text-[#F5C928] mt-0.5 block">
                    {formatCurrency(member.todayRevenue || member.todayEarnings || 0)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono font-bold text-[#7E8B9C] block tracking-wider">
                    Commission
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400 mt-0.5 block">
                    {formatCurrency(member.todayCommission || 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions: Shift Toggle & Commission Edit */}
            <div className="mt-5 pt-3.5 border-t border-[#27272A] flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                {editingCommissionId === member.id ? (
                  <div className="flex items-center gap-1.5 bg-[#171719] border border-[#F5C928] rounded-xl p-1">
                    <input
                      type="number"
                      value={newCommissionRate}
                      onChange={(e) => setNewCommissionRate(Number(e.target.value))}
                      className="w-12 text-xs font-mono font-bold text-[#F5F4F0] bg-transparent text-center focus:outline-none"
                    />
                    <span className="text-xs font-bold text-[#7E8B9C]">%</span>
                    <button
                      onClick={() => handleSaveCommission(member.id)}
                      className="px-2.5 py-1 text-[10px] font-bold bg-[#F5C928] text-[#080809] rounded-lg cursor-pointer"
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
                    className="inline-flex items-center gap-1.5 text-xs text-[#A3A3AD] hover:text-[#F5F4F0] font-mono font-bold bg-[#171719] px-2.5 py-1.5 rounded-xl border border-[#27272A] transition-all cursor-pointer"
                    title="Click to modify commission rate rule"
                  >
                    <Percent className="w-3.5 h-3.5 text-[#F5C928]" />
                    <span>Rate: <b className="text-[#F5C928]">{member.commissionRate}%</b></span>
                    <Edit2 className="w-3 h-3 text-[#7E8B9C]" />
                  </button>
                )}
              </div>

              {/* Status Switcher Button */}
              <button
                onClick={() => toggleStaffStatus(member.id)}
                className="px-3.5 py-1.5 text-xs font-bold bg-[#171719] hover:bg-[#27272A] border border-[#27272A] text-[#F5F4F0] rounded-xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5 text-[#7E8B9C]" />
                Toggle Shift
              </button>
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-[#0D0D0F] border border-[#27272A] rounded-2xl shadow-2xl p-6 w-full max-w-md animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
              <h3 className="font-serif font-bold text-[#F5F4F0] text-base">Add New Team Specialist</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#7E8B9C] hover:text-[#F5F4F0] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-mono text-[11px] text-[#A3A3AD] block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika Menon"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#111113] border border-[#27272A] rounded-xl text-[#F5F4F0] focus:outline-none focus:border-[#F5C928] font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-[11px] text-[#A3A3AD] block mb-1">Role / Designation</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#111113] border border-[#27272A] rounded-xl text-[#F5F4F0] focus:outline-none focus:border-[#F5C928] font-bold"
                  >
                    <option value="Senior Hair Stylist" className="bg-[#111113] text-[#F5F4F0]">Senior Hair Stylist</option>
                    <option value="Master Colorist" className="bg-[#111113] text-[#F5F4F0]">Master Colorist</option>
                    <option value="Senior Barber" className="bg-[#111113] text-[#F5F4F0]">Senior Barber</option>
                    <option value="Clinical Aesthetician" className="bg-[#111113] text-[#F5F4F0]">Clinical Aesthetician</option>
                    <option value="Nail Artiste" className="bg-[#111113] text-[#F5F4F0]">Nail Artiste</option>
                    <option value="Salon Receptionist" className="bg-[#111113] text-[#F5F4F0]">Salon Receptionist</option>
                  </select>
                </div>
                <div>
                  <label className="font-mono text-[11px] text-[#A3A3AD] block mb-1">Commission Rate (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-[#111113] border border-[#27272A] rounded-xl text-[#F5C928] focus:outline-none focus:border-[#F5C928] font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-[11px] text-[#A3A3AD] block mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#111113] border border-[#27272A] rounded-xl text-[#F5F4F0] focus:outline-none focus:border-[#F5C928] font-mono font-medium"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] text-[#A3A3AD] block mb-1">Specialties (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Keratin, Balayage, Scalp Treatment"
                  value={specialties}
                  onChange={(e) => setSpecialties(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#111113] border border-[#27272A] rounded-xl text-[#F5F4F0] focus:outline-none focus:border-[#F5C928]"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-[#171719] text-[#A3A3AD] hover:text-[#F5F4F0] font-bold rounded-xl border border-[#27272A] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#F5C928] hover:bg-[#f7d348] text-[#080809] font-bold rounded-xl shadow-md shadow-[#F5C928]/10 cursor-pointer"
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
