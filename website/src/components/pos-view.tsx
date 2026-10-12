"use client";

import React, { useState } from "react";
import { useDemo } from "@/lib/demo-context";
import { InvoiceItem, Invoice } from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils";
import { InvoiceModal } from "./invoice-modal";
import {
  CreditCard,
  QrCode,
  Banknote,
  Split,
  Plus,
  Minus,
  Trash2,
  Search,
  Sparkles,
  ShoppingBag,
  Scissors,
  CheckCircle2,
  Tag,
  Receipt,
  User,
  Phone,
  Clock,
  Printer,
  ChevronRight,
  ShieldCheck,
  Percent,
  Crown,
  Zap,
} from "lucide-react";

export function PosView() {
  const { salon, staff, services, inventory, customers, invoices, createInvoice } = useDemo();

  // Selected tab: "terminal" or "history"
  const [activeSubTab, setActiveSubTab] = useState<"terminal" | "history">("terminal");

  // Cart state
  const [cart, setCart] = useState<InvoiceItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || "");
  const [customCustomerName, setCustomCustomerName] = useState<string>("");
  const [customCustomerPhone, setCustomCustomerPhone] = useState<string>("");
  const [isWalkIn, setIsWalkIn] = useState<boolean>(false);

  // Filter & Search
  const [catalogSearch, setCatalogSearch] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [itemTypeTab, setItemTypeTab] = useState<"services" | "retail">("services");

  // Payment & Discount
  const [discountCode, setDiscountCode] = useState<string>("");
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [discountMessage, setDiscountMessage] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "UPI" | "Card" | "Split">("UPI");
  const [splitCashAmount, setSplitCashAmount] = useState<number>(1000);

  // Active view modal for completed invoice
  const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null);

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const gstAmount = Math.round(subtotal * 0.05); // 5% GST
  const grandTotal = Math.max(0, subtotal - appliedDiscount + gstAmount);

  // Cart Operations
  const addToCart = (
    item: { id: string; name: string; price: number; type: "service" | "product" },
    preferredStaffId?: string
  ) => {
    const defaultStaff = staff.find((s) => s.status === "clocked_in") || staff[0];
    const staffId = preferredStaffId || defaultStaff.id;
    const staffName = staff.find((s) => s.id === staffId)?.name || "House";

    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.staffId === staffId);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.staffId === staffId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          type: item.type,
          price: item.price,
          quantity: 1,
          staffId,
          staffName,
        },
      ];
    });
  };

  const updateQuantity = (index: number, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item, idx) => {
          if (idx !== index) return item;
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        })
        .filter(Boolean) as InvoiceItem[];
    });
  };

  const updateItemStaff = (index: number, newStaffId: string) => {
    const sName = staff.find((s) => s.id === newStaffId)?.name || "House";
    setCart((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, staffId: newStaffId, staffName: sName } : item))
    );
  };

  const removeItem = (index: number) => {
    setCart((prev) => prev.filter((_, idx) => idx !== index));
  };

  const applyPredefinedCoupon = (code: string) => {
    setDiscountCode(code);
    if (code === "FESTIVE20") {
      const disc = Math.round(subtotal * 0.2);
      setAppliedDiscount(disc);
      setDiscountMessage("✓ 20% Festive Special Applied");
    } else if (code === "LUXE10") {
      const disc = Math.round(subtotal * 0.1);
      setAppliedDiscount(disc);
      setDiscountMessage("✓ 10% Privilege Applied");
    } else if (code === "VIP500") {
      setAppliedDiscount(500);
      setDiscountMessage("✓ ₹500 VIP Voucher Applied");
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Cart is empty! Please select at least one service or retail product.");
      return;
    }

    const customerName = isWalkIn ? customCustomerName || "Walk-in Guest" : selectedCustomer?.name || "Guest";
    const customerPhone = isWalkIn ? customCustomerPhone || "+91 90000 00000" : selectedCustomer?.phone || "+91 90000 00000";

    const newInvoice = createInvoice({
      customerName,
      customerPhone,
      items: cart,
      subtotal,
      discount: appliedDiscount,
      gstAmount,
      total: grandTotal,
      paymentMethod,
      splitDetails:
        paymentMethod === "Split"
          ? {
              cash: splitCashAmount,
              upi: Math.max(0, grandTotal - splitCashAmount),
            }
          : undefined,
      status: "Paid",
    });

    // Reset checkout form
    setCart([]);
    setAppliedDiscount(0);
    setDiscountCode("");
    setDiscountMessage("");

    // Open Printable/Viewable Invoice Modal
    setActiveInvoice(newInvoice);
  };

  // Filtered Services
  const filteredServices = services.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(catalogSearch.toLowerCase()) || s.description.toLowerCase().includes(catalogSearch.toLowerCase());
    const matchesCat = categoryFilter === "All" || s.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  // Filtered Retail Inventory
  const filteredRetailProducts = inventory
    .filter((inv) => inv.usageType === "Retail Sale" || inv.retailPrice)
    .filter((inv) => inv.name.toLowerCase().includes(catalogSearch.toLowerCase()) || inv.brand.toLowerCase().includes(catalogSearch.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Top Header & Sub-tab Switcher */}
      <div className="luxury-card p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 border border-white/20">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Point of Sale & Checkout Register</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Live Terminal
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Rapid multi-item counter billing • Stylist commission attribution • GST split compliance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80">
          <button
            onClick={() => setActiveSubTab("terminal")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeSubTab === "terminal"
                ? "bg-white text-slate-950 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Counter Terminal
          </button>
          <button
            onClick={() => setActiveSubTab("history")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              activeSubTab === "history"
                ? "bg-white text-slate-950 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Bill Ledger ({invoices.length})
          </button>
        </div>
      </div>

      {activeSubTab === "terminal" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Side: Catalog of Services & Retail Products */}
          <div className="lg:col-span-7 space-y-4">
            {/* Catalog Filter Controls */}
            <div className="luxury-card p-4 rounded-3xl space-y-3">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search services or retail products (e.g. Balayage, Olaplex, HydraFacial)..."
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50/80 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                  />
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl w-full sm:w-auto">
                  <button
                    onClick={() => setItemTypeTab("services")}
                    className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                      itemTypeTab === "services"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Scissors className="w-3.5 h-3.5" /> Treatments ({services.length})
                  </button>
                  <button
                    onClick={() => setItemTypeTab("retail")}
                    className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                      itemTypeTab === "retail"
                        ? "bg-white text-emerald-700 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Retail Shelf ({inventory.filter((i) => i.usageType === "Retail Sale").length})
                  </button>
                </div>
              </div>

              {itemTypeTab === "services" && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                  {["All", "Hair", "Skin & Spa", "Nails", "Beard & Grooming"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap text-xs font-bold transition-all ${
                        categoryFilter === cat
                          ? "bg-slate-950 text-white shadow-sm"
                          : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/80"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[620px] overflow-y-auto pr-1">
              {itemTypeTab === "services"
                ? filteredServices.map((srv) => (
                    <div
                      key={srv.id}
                      onClick={() => addToCart({ id: srv.id, name: srv.name, price: srv.price, type: "service" })}
                      className="luxury-card group p-5 rounded-3xl hover:border-blue-400 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                            {srv.category}
                          </span>
                          <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" /> {srv.durationMinutes}m
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mt-2.5 group-hover:text-blue-600 transition-colors leading-snug">
                          {srv.name}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {srv.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-base font-extrabold text-slate-900 font-mono">
                          {formatCurrency(srv.price)}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                          <Plus className="w-3.5 h-3.5" /> Add
                        </span>
                      </div>
                    </div>
                  ))
                : filteredRetailProducts.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() =>
                        addToCart({
                          id: prod.id,
                          name: `${prod.name} (${prod.brand})`,
                          price: prod.retailPrice || prod.costPrice * 1.5,
                          type: "product",
                        })
                      }
                      className="luxury-card group p-5 rounded-3xl hover:border-emerald-400 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
                            {prod.brand}
                          </span>
                          <span
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                              prod.currentStock <= prod.minThreshold
                                ? "bg-amber-100 text-amber-800 border border-amber-200"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            Stock: {prod.currentStock} {prod.unit}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mt-2.5 group-hover:text-emerald-700 transition-colors leading-snug">
                          {prod.name}
                        </h4>
                        <p className="text-xs text-slate-400 font-mono mt-1">SKU: {prod.sku}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-base font-extrabold text-slate-900 font-mono">
                          {formatCurrency(prod.retailPrice || prod.costPrice * 1.5)}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
                          <Plus className="w-3.5 h-3.5" /> Add Retail
                        </span>
                      </div>
                    </div>
                  ))}
            </div>
          </div>

          {/* Right Side: Active Cart & Boutique Checkout Drawer */}
          <div className="lg:col-span-5 space-y-4">
            <div className="luxury-card rounded-3xl p-6 space-y-5 border-slate-200/90 shadow-lg">
              {/* Customer Selector with VIP Badge */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-600" /> Client Profile
                  </label>
                  <button
                    onClick={() => setIsWalkIn(!isWalkIn)}
                    className="text-xs text-blue-600 hover:underline font-bold"
                  >
                    {isWalkIn ? "Select VIP Client" : "+ Fast Walk-in"}
                  </button>
                </div>

                {isWalkIn ? (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Guest Name (e.g. Shalini)"
                      value={customCustomerName}
                      onChange={(e) => setCustomCustomerName(e.target.value)}
                      className="px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-medium"
                    />
                    <input
                      type="tel"
                      placeholder="Phone (e.g. 98450...)"
                      value={customCustomerPhone}
                      onChange={(e) => setCustomCustomerPhone(e.target.value)}
                      className="px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-medium"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <select
                      value={selectedCustomerId}
                      onChange={(e) => setSelectedCustomerId(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none font-bold text-slate-800"
                    >
                      {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.phone}) - {c.loyaltyPoints} Pts
                        </option>
                      ))}
                    </select>

                    {selectedCustomer && (
                      <div className="flex items-center justify-between text-xs bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-2xl border border-blue-100/80">
                        <div>
                          <div className="flex items-center gap-1.5 font-bold text-slate-900">
                            <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span>VIP Black Diamond Tier</span>
                          </div>
                          <span className="text-[11px] text-slate-500">
                            Total Spent: <b>{formatCurrency(selectedCustomer.totalSpent)}</b> • Visits: <b>{selectedCustomer.visitsCount}</b>
                          </span>
                        </div>
                        <span className="text-xs font-black text-blue-700 bg-white px-2.5 py-1 rounded-xl shadow-2xs">
                          {selectedCustomer.loyaltyPoints} Pts
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Cart Items List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    Invoice Order Items ({cart.length})
                  </h3>
                  {cart.length > 0 && (
                    <button
                      onClick={() => setCart([])}
                      className="text-xs text-rose-600 hover:underline font-semibold"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200 text-slate-400">
                    <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-xs font-bold text-slate-600">Cart is empty</p>
                    <p className="text-[11px] text-slate-400">Click any treatment or product on the left to add</p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {cart.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50/90 p-3.5 rounded-2xl border border-slate-200 flex flex-col gap-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-xs font-bold text-slate-900">{item.name}</div>
                            <span className="text-[10px] text-slate-500 font-mono">{formatCurrency(item.price)} each</span>
                          </div>
                          <div className="text-xs font-extrabold text-slate-900 font-mono">
                            {formatCurrency(item.price * item.quantity)}
                          </div>
                        </div>

                        {/* Stylist Selector & Quantity controls */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-slate-500 font-semibold">Artist:</span>
                            <select
                              value={item.staffId}
                              onChange={(e) => updateItemStaff(idx, e.target.value)}
                              className="text-[11px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-0.5 text-slate-800 focus:outline-none"
                            >
                              {staff.map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.name} ({s.commissionRate}%)
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                              <button
                                onClick={() => updateQuantity(idx, -1)}
                                className="p-1.5 text-slate-500 hover:bg-slate-100 transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 text-xs font-bold text-slate-800">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(idx, 1)}
                                className="p-1.5 text-slate-500 hover:bg-slate-100 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(idx)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Predefined Coupon Codes */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">
                  Salon Privilege Vouchers:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => applyPredefinedCoupon("FESTIVE20")}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all ${
                      discountCode === "FESTIVE20"
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                    }`}
                  >
                    🏷️ FESTIVE20 (20% Off)
                  </button>
                  <button
                    onClick={() => applyPredefinedCoupon("LUXE10")}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all ${
                      discountCode === "LUXE10"
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                    }`}
                  >
                    🏷️ LUXE10 (10% Off)
                  </button>
                  <button
                    onClick={() => applyPredefinedCoupon("VIP500")}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all ${
                      discountCode === "VIP500"
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                    }`}
                  >
                    🏷️ VIP500 (₹500 Off)
                  </button>
                </div>
                {discountMessage && (
                  <p className="text-[11px] text-emerald-600 font-bold">{discountMessage}</p>
                )}
              </div>

              {/* Bill Breakdown */}
              <div className="bg-slate-50/90 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Subtotal Amount:</span>
                  <span className="font-bold text-slate-900 font-mono">{formatCurrency(subtotal)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount Privilege:</span>
                    <span className="font-mono">- {formatCurrency(appliedDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>GST (CGST 2.5% + SGST 2.5%):</span>
                  <span className="font-bold text-slate-900 font-mono">{formatCurrency(gstAmount)}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-slate-900">
                  <span>Grand Total Payable:</span>
                  <span className="text-blue-600 text-lg font-mono">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              {/* Payment Mode Selector */}
              <div>
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block mb-2">
                  Tender Payment Method
                </label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => setPaymentMethod("UPI")}
                    className={`py-2.5 px-1 rounded-2xl text-xs font-extrabold flex flex-col items-center gap-1 border transition-all ${
                      paymentMethod === "UPI"
                        ? "bg-slate-950 text-white border-slate-950 shadow-md"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-emerald-400" /> UPI / QR
                  </button>
                  <button
                    onClick={() => setPaymentMethod("Card")}
                    className={`py-2.5 px-1 rounded-2xl text-xs font-extrabold flex flex-col items-center gap-1 border transition-all ${
                      paymentMethod === "Card"
                        ? "bg-slate-950 text-white border-slate-950 shadow-md"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-blue-400" /> POS Card
                  </button>
                  <button
                    onClick={() => setPaymentMethod("Cash")}
                    className={`py-2.5 px-1 rounded-2xl text-xs font-extrabold flex flex-col items-center gap-1 border transition-all ${
                      paymentMethod === "Cash"
                        ? "bg-slate-950 text-white border-slate-950 shadow-md"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-amber-400" /> Cash
                  </button>
                  <button
                    onClick={() => setPaymentMethod("Split")}
                    className={`py-2.5 px-1 rounded-2xl text-xs font-extrabold flex flex-col items-center gap-1 border transition-all ${
                      paymentMethod === "Split"
                        ? "bg-purple-900 text-white border-purple-900 shadow-md"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <Split className="w-4 h-4 text-purple-300" /> Split Pay
                  </button>
                </div>

                {/* Split Configuration */}
                {paymentMethod === "Split" && (
                  <div className="mt-3 p-3.5 bg-purple-50/80 rounded-2xl border border-purple-200 text-xs space-y-2">
                    <span className="font-extrabold text-purple-950 block">Configure Split Distribution:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-semibold text-purple-800">Cash Collected (₹)</label>
                        <input
                          type="number"
                          value={splitCashAmount}
                          onChange={(e) => setSplitCashAmount(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-purple-200 rounded-xl font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-purple-800">UPI Balance Due (₹)</label>
                        <div className="px-2.5 py-1.5 bg-purple-100 border border-purple-200 rounded-xl font-black text-purple-950 font-mono">
                          {formatCurrency(Math.max(0, grandTotal - splitCashAmount))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Complete Checkout Button */}
              <div className="pt-2">
                <button
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                  className="w-full py-4 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Generate Tax Bill & Collect {formatCurrency(grandTotal)}
                </button>
                <p className="text-[11px] text-center text-slate-400 mt-2 font-medium">
                  Instant stock deduction • Stylist commission credited • WhatsApp receipt dispatched
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Bill History Tab */
        <div className="luxury-card rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Invoices & Daily Billing Ledger</h3>
              <p className="text-xs text-slate-500">Official GST compliant receipt records</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-slate-100 rounded-xl text-slate-700">
              {invoices.length} Bills Total
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Invoice #</th>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">Client Name</th>
                  <th className="py-3.5 px-4">Service & Product Breakdown</th>
                  <th className="py-3.5 px-4">Payment Method</th>
                  <th className="py-3.5 px-4 text-right">Grand Total</th>
                  <th className="py-3.5 px-4 text-center">Receipt Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-blue-600">{inv.invoiceNumber}</td>
                    <td className="py-4 px-4 text-slate-600 font-medium">{inv.date}</td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900">{inv.customerName}</div>
                      <span className="text-[11px] text-slate-400">{inv.customerPhone}</span>
                    </td>
                    <td className="py-4 px-4 text-slate-600 max-w-xs truncate font-medium">
                      {inv.items.map((i) => `${i.name} (x${i.quantity})`).join(", ")}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-100 text-slate-800">
                        {inv.paymentMethod}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-black text-slate-900 font-mono text-sm">
                      {formatCurrency(inv.total)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => setActiveInvoice(inv)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" /> View Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invoice Modal Preview */}
      {activeInvoice && (
        <InvoiceModal invoice={activeInvoice} salon={salon} onClose={() => setActiveInvoice(null)} />
      )}
    </div>
  );
}
