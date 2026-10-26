"use client";

import React, { useState } from "react";
import { useBillCare } from "@/lib/billcare-context";
import { InvoiceItem, Invoice } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { InvoiceModal } from "./invoice-modal";
import { ClientFormulaModal } from "./client-formula-modal";
import { UpiCounterQrModal } from "./pos/upi-counter-qr-modal";
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
  X,
} from "lucide-react";

export function PosView() {
  const { salon, staff, services, inventory, customers, invoices, createInvoice } = useBillCare();

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

  // Payment, Tip & Discount
  const [discountCode, setDiscountCode] = useState<string>("");
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [discountMessage, setDiscountMessage] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "UPI" | "Card" | "Split">("UPI");
  const [splitCashAmount, setSplitCashAmount] = useState<number>(1000);
  const [splitCardAmount, setSplitCardAmount] = useState<number>(0);
  const [splitMethod, setSplitMethod] = useState<"cash_upi" | "cash_card" | "upi_card" | "three_way">("cash_upi");
  const [cashTendered, setCashTendered] = useState<number>(0);
  const [tipPercentage, setTipPercentage] = useState<number | null>(null);
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [redeemLoyalty, setRedeemLoyalty] = useState<boolean>(false);
  const [showFormulaModal, setShowFormulaModal] = useState<boolean>(false);
  const [showUpiQrModal, setShowUpiQrModal] = useState<boolean>(false);

  // Custom Item Modal
  const [showCustomItemModal, setShowCustomItemModal] = useState<boolean>(false);
  const [customItemName, setCustomItemName] = useState<string>("");
  const [customItemPrice, setCustomItemPrice] = useState<number>(500);
  const [customItemType, setCustomItemType] = useState<"service" | "product">("service");
  const [customItemStaffId, setCustomItemStaffId] = useState<string>("");

  // Active view modal for completed invoice
  const [activeInvoice, setActiveInvoice] = useState<any>(null);

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const loyaltyDiscount = redeemLoyalty && selectedCustomer ? Math.min(Math.floor(selectedCustomer.loyaltyPoints / 2), 500) : 0;
  const totalDiscount = appliedDiscount + loyaltyDiscount;
  const gstAmount = Math.round(subtotal * 0.05); // 5% GST (CGST 2.5% + SGST 2.5%)
  const grandTotal = Math.max(0, subtotal - totalDiscount + gstAmount + tipAmount);

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

  const handleAddCustomItem = () => {
    if (!customItemName.trim()) {
      alert("Please enter a custom charge name or service description.");
      return;
    }
    const defaultStaff = staff.find((s) => s.id === customItemStaffId) || staff.find((s) => s.status === "clocked_in") || staff[0];
    const sId = defaultStaff?.id || "staff_house";
    const sName = defaultStaff?.name || "House";

    const customId = `custom_${Date.now()}`;
    setCart((prev) => [
      ...prev,
      {
        id: customId,
        name: customItemName.trim(),
        type: customItemType,
        price: Number(customItemPrice) || 0,
        quantity: 1,
        staffId: sId,
        staffName: sName,
      },
    ]);

    setCustomItemName("");
    setCustomItemPrice(500);
    setShowCustomItemModal(false);
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

    if (paymentMethod === "UPI") {
      setShowUpiQrModal(true);
      return;
    }

    if (paymentMethod === "Split") {
      const upiDue =
        splitMethod === "cash_card"
          ? 0
          : Math.max(0, grandTotal - (splitMethod === "upi_card" ? 0 : splitCashAmount) - (splitMethod === "cash_upi" ? 0 : splitCardAmount));
      if (upiDue > 0) {
        setShowUpiQrModal(true);
        return;
      }
    }

    finalizeCheckout(paymentMethod);
  };

  const finalizeCheckout = (method: string, txnRef?: string) => {
    const customerName = isWalkIn ? customCustomerName || "Walk-in Guest" : selectedCustomer?.name || "Guest";
    const customerPhone = isWalkIn ? customCustomerPhone || "+91 90000 00000" : selectedCustomer?.phone || "+91 90000 00000";

    const pointsEarned = Math.floor(grandTotal / 100);
    const balancePoints = Math.max(
      0,
      (selectedCustomer?.loyaltyPoints || 0) + pointsEarned - (redeemLoyalty ? loyaltyDiscount * 2 : 0)
    );

    const newInvoice = createInvoice({
      customerName,
      customerPhone,
      items: cart,
      subtotal,
      discount: totalDiscount,
      gstAmount,
      total: grandTotal,
      paymentMethod: method,
      splitDetails:
        method === "Split"
          ? {
              cash: splitMethod === "upi_card" ? 0 : splitCashAmount,
              card: splitMethod === "cash_upi" ? 0 : splitCardAmount,
              upi:
                splitMethod === "cash_card"
                  ? 0
                  : Math.max(0, grandTotal - (splitMethod === "upi_card" ? 0 : splitCashAmount) - (splitMethod === "cash_upi" ? 0 : splitCardAmount)),
            }
          : method === "Cash"
          ? {
              cash: grandTotal,
              tendered: cashTendered > grandTotal ? cashTendered : grandTotal,
              change: cashTendered > grandTotal ? cashTendered - grandTotal : 0,
            }
          : undefined,
      notes: txnRef ? `UPI / Bank Ref: ${txnRef}` : undefined,
      status: "Paid",
      loyaltyPointsEarned: pointsEarned,
      loyaltyPointsBalance: balancePoints,
    } as any);

    // Reset checkout form
    setCart([]);
    setAppliedDiscount(0);
    setTipAmount(0);
    setTipPercentage(null);
    setRedeemLoyalty(false);
    setDiscountCode("");
    setDiscountMessage("");
    setCashTendered(0);

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
    .filter((inv) => inv.name.toLowerCase().includes(catalogSearch.toLowerCase()) || (inv.brand?.toLowerCase().includes(catalogSearch.toLowerCase()) ?? false));

  return (
    <div className="space-y-6">
      {/* Top Header & Sub-tab Switcher */}
      <div className="bg-[#0D0D0F] border border-[#27272A] p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#F5C928]/10 border border-[#F5C928]/30 flex items-center justify-center text-[#F5C928] shadow-lg shadow-[#F5C928]/5 shrink-0">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-serif font-bold text-[#F5F4F0] tracking-tight">Point of Sale & Register</h1>
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Live Terminal
              </span>
            </div>
            <p className="text-xs text-[#7E8B9C] mt-0.5">
              Rapid multi-item counter billing • Stylist commission attribution • GST split compliance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-[#171719] p-1.5 rounded-xl border border-[#27272A]">
          <button
            onClick={() => setActiveSubTab("terminal")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeSubTab === "terminal"
                ? "bg-[#F5C928] text-[#080809] shadow-sm"
                : "text-[#A3A3AD] hover:text-[#F5F4F0]"
            }`}
          >
            Counter Terminal
          </button>
          <button
            onClick={() => setActiveSubTab("history")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeSubTab === "history"
                ? "bg-[#F5C928] text-[#080809] shadow-sm"
                : "text-[#A3A3AD] hover:text-[#F5F4F0]"
            }`}
          >
            <span>Bill Ledger</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${activeSubTab === "history" ? "bg-[#080809] text-[#F5C928]" : "bg-[#27272A] text-[#A3A3AD]"}`}>
              {invoices.length}
            </span>
          </button>
        </div>
      </div>

      {activeSubTab === "terminal" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Side: Catalog of Services & Retail Products */}
          <div className="lg:col-span-7 space-y-4">
            {/* Catalog Filter Controls */}
            <div className="bg-[#0D0D0F] border border-[#27272A] p-4 rounded-2xl space-y-3">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7E8B9C]" />
                  <input
                    type="text"
                    placeholder="Search services or retail products (e.g. Balayage, Olaplex, HydraFacial)..."
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#111113] border border-[#27272A] rounded-xl text-[#F5F4F0] placeholder-[#7E8B9C] focus:outline-none focus:border-[#F5C928] transition-all font-medium"
                  />
                </div>

                <div className="flex items-center gap-1.5 w-full sm:w-auto">
                  <div className="flex items-center gap-1 bg-[#171719] p-1 rounded-xl border border-[#27272A] flex-1 sm:flex-initial">
                    <button
                      onClick={() => setItemTypeTab("services")}
                      className={`flex-1 sm:flex-initial px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                        itemTypeTab === "services"
                          ? "bg-[#F5C928] text-[#080809] shadow-sm"
                          : "text-[#A3A3AD] hover:text-[#F5F4F0]"
                      }`}
                    >
                      <Scissors className="w-3.5 h-3.5" /> Treatments ({services.length})
                    </button>
                    <button
                      onClick={() => setItemTypeTab("retail")}
                      className={`flex-1 sm:flex-initial px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                        itemTypeTab === "retail"
                          ? "bg-[#F5C928] text-[#080809] shadow-sm"
                          : "text-[#A3A3AD] hover:text-[#F5F4F0]"
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Retail ({inventory.filter((i) => i.usageType === "Retail Sale").length})
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowCustomItemModal(true)}
                    className="px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 bg-[#171719] hover:bg-[#27272A] text-[#F5C928] border border-[#F5C928]/30 shadow-xs cursor-pointer shrink-0"
                    title="Add manual custom service or sudden product add-on"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Custom</span>
                  </button>
                </div>
              </div>

              {itemTypeTab === "services" && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                  {["All", "Hair", "Skin & Spa", "Nails", "Beard & Grooming"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap text-xs font-bold transition-all ${
                        categoryFilter === cat
                          ? "bg-[#F5C928] text-[#080809] shadow-sm"
                          : "bg-[#171719] text-[#A3A3AD] hover:text-[#F5F4F0] border border-[#27272A]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Catalog Grid */}
            <div className="max-h-[620px] overflow-y-auto pr-1 space-y-3">
              {itemTypeTab === "services" ? (
                filteredServices.length === 0 ? (
                  <div className="bg-[#0D0D0F] border border-[#27272A] p-12 rounded-2xl text-center space-y-3">
                    <div className="w-14 h-14 rounded-full bg-[#171719] border border-[#27272A] text-[#F5C928] flex items-center justify-center mx-auto">
                      <Scissors className="w-7 h-7" />
                    </div>
                    <h4 className="font-serif font-bold text-[#F5F4F0] text-sm">No treatments found</h4>
                    <p className="text-xs text-[#7E8B9C]">
                      No salon service matches "{catalogSearch}" in {categoryFilter === "All" ? "any category" : categoryFilter}.
                    </p>
                    <button
                      onClick={() => {
                        setCatalogSearch("");
                        setCategoryFilter("All");
                      }}
                      className="px-4 py-2 bg-[#F5C928] hover:bg-[#f7d348] text-[#080809] rounded-xl text-xs font-bold transition-all shadow-sm"
                    >
                      Reset Catalog Filter
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {filteredServices.map((srv) => (
                      <div
                        key={srv.id}
                        onClick={() => addToCart({ id: srv.id, name: srv.name, price: srv.price, type: "service" })}
                        className="bg-[#111113] border border-[#27272A] group p-4 rounded-xl hover:border-[#F5C928]/50 hover:bg-[#171719] transition-all cursor-pointer flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-[#171719] text-[#F5C928] border border-[#27272A]">
                              {srv.category}
                            </span>
                            <span className="text-xs text-[#7E8B9C] font-mono flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-[#7E8B9C]" /> {srv.durationMinutes}m
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-[#F5F4F0] mt-2.5 group-hover:text-[#F5C928] transition-colors leading-snug">
                            {srv.name}
                          </h4>
                          <p className="text-xs text-[#7E8B9C] mt-1 line-clamp-2 leading-relaxed">
                            {srv.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#27272A] flex items-center justify-between">
                          <span className="text-base font-extrabold text-[#F5C928] font-mono">
                            {formatCurrency(srv.price)}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#F5C928] group-hover:translate-x-1 transition-transform">
                            <Plus className="w-3.5 h-3.5" /> Add
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : filteredRetailProducts.length === 0 ? (
                <div className="bg-[#0D0D0F] border border-[#27272A] p-12 rounded-2xl text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-[#171719] border border-[#27272A] text-emerald-400 flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                  <h4 className="font-serif font-bold text-[#F5F4F0] text-sm">No retail products found</h4>
                  <p className="text-xs text-[#7E8B9C]">
                    No retail take-home items matched "{catalogSearch}".
                  </p>
                  <button
                    onClick={() => setCatalogSearch("")}
                    className="px-4 py-2 bg-[#F5C928] hover:bg-[#f7d348] text-[#080809] rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    Clear Search
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {filteredRetailProducts.map((prod) => (
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
                      className="bg-[#111113] border border-[#27272A] group p-4 rounded-xl hover:border-emerald-500/50 hover:bg-[#171719] transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-[#171719] text-emerald-400 border border-[#27272A]">
                            {prod.brand}
                          </span>
                          <span
                            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                              prod.currentStock <= prod.minThreshold
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                                : "bg-[#171719] text-[#A3A3AD] border border-[#27272A]"
                            }`}
                          >
                            Stock: {prod.currentStock} {prod.unit}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-[#F5F4F0] mt-2.5 group-hover:text-emerald-400 transition-colors leading-snug">
                          {prod.name}
                        </h4>
                        <p className="text-xs text-[#7E8B9C] font-mono mt-1">SKU: {prod.sku}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#27272A] flex items-center justify-between">
                        <span className="text-base font-extrabold text-[#F5C928] font-mono">
                          {formatCurrency(prod.retailPrice || prod.costPrice * 1.5)}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
                          <Plus className="w-3.5 h-3.5" /> Add Retail
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Floating Mobile Cart Bar */}
          {cart.length > 0 && (
            <div className="lg:hidden fixed bottom-16 left-3 right-3 z-30 bg-[#0D0D0F] text-[#F5F4F0] p-3 rounded-2xl shadow-2xl flex items-center justify-between border border-[#27272A] animate-in slide-in-from-bottom duration-200">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-[#F5C928] flex items-center justify-center font-bold text-xs text-[#080809]">
                  {cart.reduce((acc, i) => acc + i.quantity, 0)}
                </span>
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#7E8B9C] block uppercase tracking-wider">
                    Cart Total
                  </span>
                  <span className="font-extrabold text-sm text-[#F5C928] font-mono">
                    {formatCurrency(grandTotal)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  document.getElementById("pos-checkout-drawer")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-4 py-2 bg-[#F5C928] text-[#080809] font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
              >
                <span>Checkout</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Right Side: Active Cart & Boutique Checkout Drawer */}
          <div id="pos-checkout-drawer" className="lg:col-span-5 space-y-4">
            <div className="bg-[#0D0D0F] border border-[#27272A] rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
              {/* Customer Selector with VIP Badge */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-mono font-bold text-[#A3A3AD] uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#F5C928]" /> Client Details
                  </label>
                  <button
                    onClick={() => setIsWalkIn(!isWalkIn)}
                    className="text-xs text-[#F5C928] hover:underline font-bold"
                  >
                    {isWalkIn ? "Pick Registered Client" : "+ New Walk-In Client"}
                  </button>
                </div>

                {isWalkIn ? (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Guest Name (e.g. Shalini)"
                      value={customCustomerName}
                      onChange={(e) => setCustomCustomerName(e.target.value)}
                      className="px-3.5 py-2 text-xs bg-[#111113] border border-[#27272A] rounded-xl text-[#F5F4F0] placeholder-[#7E8B9C] focus:outline-none focus:border-[#F5C928] font-medium"
                    />
                    <input
                      type="tel"
                      placeholder="Phone (e.g. 98450...)"
                      value={customCustomerPhone}
                      onChange={(e) => setCustomCustomerPhone(e.target.value)}
                      className="px-3.5 py-2 text-xs bg-[#111113] border border-[#27272A] rounded-xl text-[#F5F4F0] placeholder-[#7E8B9C] focus:outline-none focus:border-[#F5C928] font-medium"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <select
                      value={selectedCustomerId}
                      onChange={(e) => setSelectedCustomerId(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-[#111113] border border-[#27272A] rounded-xl text-[#F5F4F0] focus:outline-none focus:border-[#F5C928] font-bold"
                    >
                      {customers.map((c) => (
                        <option key={c.id} value={c.id} className="bg-[#111113] text-[#F5F4F0]">
                          {c.name} ({c.phone}) - {c.loyaltyPoints} Pts
                        </option>
                      ))}
                    </select>

                    {selectedCustomer && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs bg-[#111113] p-3 rounded-xl border border-[#27272A]">
                          <div>
                            <div className="flex items-center gap-1.5 font-bold text-[#F5F4F0]">
                              <Crown className="w-3.5 h-3.5 text-[#F5C928] fill-[#F5C928]" />
                              <span>{selectedCustomer.vipTier || "VIP Tier Member"}</span>
                            </div>
                            <span className="text-[11px] text-[#7E8B9C] font-mono">
                              Total Spent: <b className="text-[#F5F4F0]">{formatCurrency(selectedCustomer.totalSpent)}</b> • Visits: <b className="text-[#F5F4F0]">{selectedCustomer.visitsCount}</b>
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setShowFormulaModal(true)}
                              className="px-2.5 py-1 text-[11px] font-bold text-[#F5C928] bg-[#171719] border border-[#F5C928]/30 rounded-lg hover:bg-[#F5C928]/10 shadow-xs flex items-center gap-1 cursor-pointer"
                              title="View Hair & Skin Technical Formula Card"
                            >
                              <Sparkles className="w-3 h-3 text-[#F5C928]" /> Formula
                            </button>
                            <span className="text-xs font-mono font-bold text-[#F5C928] bg-[#171719] border border-[#27272A] px-2.5 py-1 rounded-lg">
                              {selectedCustomer.loyaltyPoints} Pts
                            </span>
                          </div>
                        </div>

                        {selectedCustomer.loyaltyPoints >= 100 && (
                          <label className="flex items-center gap-2 text-xs font-bold text-[#F5F4F0] bg-[#171719] p-2.5 rounded-xl border border-[#27272A] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={redeemLoyalty}
                              onChange={(e) => setRedeemLoyalty(e.target.checked)}
                              className="rounded text-[#F5C928] focus:ring-[#F5C928]"
                            />
                            <span>
                              Redeem points for discount:{" "}
                              <b className="text-[#F5C928] font-mono">
                                -{formatCurrency(Math.min(Math.floor(selectedCustomer.loyaltyPoints / 2), 500))} off
                              </b>
                            </span>
                          </label>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Cart Items List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-mono font-bold text-[#A3A3AD] uppercase tracking-wider">
                    Invoice Order Items ({cart.length})
                  </h3>
                  {cart.length > 0 && (
                    <button
                      onClick={() => setCart([])}
                      className="text-xs text-rose-400 hover:underline font-semibold"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-8 bg-[#111113] rounded-xl border border-dashed border-[#27272A] text-[#7E8B9C]">
                    <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-[#7E8B9C]/50" />
                    <p className="text-xs font-bold text-[#F5F4F0]">Cart is empty</p>
                    <p className="text-[11px] text-[#7E8B9C]">Click any treatment or product on the left to add</p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {cart.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-[#111113] p-3 rounded-xl border border-[#27272A] flex flex-col gap-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-xs font-bold text-[#F5F4F0]">{item.name}</div>
                            <span className="text-[10px] text-[#7E8B9C] font-mono">{formatCurrency(item.price)} each</span>
                          </div>
                          <div className="text-xs font-mono font-bold text-[#F5C928]">
                            {formatCurrency(item.price * item.quantity)}
                          </div>
                        </div>

                        {/* Stylist Selector & Quantity controls */}
                        <div className="flex items-center justify-between pt-2 border-t border-[#27272A]">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-[#7E8B9C] font-semibold">Artist:</span>
                            <select
                              value={item.staffId}
                              onChange={(e) => updateItemStaff(idx, e.target.value)}
                              className="text-[11px] font-bold bg-[#171719] border border-[#27272A] rounded-lg px-2 py-0.5 text-[#F5F4F0] focus:outline-none"
                            >
                              {staff.map((s) => (
                                <option key={s.id} value={s.id} className="bg-[#111113] text-[#F5F4F0]">
                                  {s.name} ({s.commissionRate}%)
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex items-center bg-[#171719] border border-[#27272A] rounded-lg overflow-hidden">
                              <button
                                onClick={() => updateQuantity(idx, -1)}
                                className="p-1.5 text-[#7E8B9C] hover:text-[#F5F4F0] hover:bg-[#27272A] transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 text-xs font-bold text-[#F5F4F0] font-mono">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(idx, 1)}
                                className="p-1.5 text-[#7E8B9C] hover:text-[#F5F4F0] hover:bg-[#27272A] transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(idx)}
                              className="p-1 text-[#7E8B9C] hover:text-rose-400 transition-colors"
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
              <div className="pt-2 border-t border-[#27272A] space-y-2">
                <span className="text-xs font-mono font-bold text-[#A3A3AD] block uppercase tracking-wider">
                  Discount Coupons:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => applyPredefinedCoupon("FESTIVE20")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                      discountCode === "FESTIVE20"
                        ? "bg-[#F5C928] text-[#080809] border-[#F5C928] shadow-sm"
                        : "bg-[#171719] text-[#A3A3AD] border-[#27272A] hover:bg-[#27272A]"
                    }`}
                  >
                    🏷️ FESTIVE20 (20% Off)
                  </button>
                  <button
                    onClick={() => applyPredefinedCoupon("LUXE10")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                      discountCode === "LUXE10"
                        ? "bg-[#F5C928] text-[#080809] border-[#F5C928] shadow-sm"
                        : "bg-[#171719] text-[#A3A3AD] border-[#27272A] hover:bg-[#27272A]"
                    }`}
                  >
                    🏷️ LUXE10 (10% Off)
                  </button>
                  <button
                    onClick={() => applyPredefinedCoupon("VIP500")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                      discountCode === "VIP500"
                        ? "bg-[#F5C928] text-[#080809] border-[#F5C928] shadow-sm"
                        : "bg-[#171719] text-[#A3A3AD] border-[#27272A] hover:bg-[#27272A]"
                    }`}
                  >
                    🏷️ VIP500 (₹500 Off)
                  </button>
                </div>
                {discountMessage && (
                  <p className="text-xs text-emerald-400 font-bold">{discountMessage}</p>
                )}
              </div>

              {/* Stylist Gratuity & Tip Selector */}
              <div className="pt-2 border-t border-[#27272A] space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-[#A3A3AD] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#F5C928]" /> Stylist Tip (Optional)
                  </span>
                  {tipAmount > 0 && (
                    <span className="font-bold text-[#F5C928] font-mono">
                      +{formatCurrency(tipAmount)}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[0, 10, 15, 20].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => {
                        setTipPercentage(pct);
                        setTipAmount(pct === 0 ? 0 : Math.round((subtotal * pct) / 100));
                      }}
                      className={`py-1.5 rounded-lg text-xs font-bold border transition-all font-mono ${
                        tipPercentage === pct
                          ? "bg-[#F5C928] text-[#080809] border-[#F5C928] shadow-sm"
                          : "bg-[#171719] text-[#A3A3AD] border-[#27272A] hover:bg-[#27272A]"
                      }`}
                    >
                      {pct === 0 ? "No Tip" : `${pct}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bill Breakdown */}
              <div className="bg-[#111113] p-4 rounded-xl border border-[#27272A] space-y-2 text-xs">
                <div className="flex justify-between text-[#A3A3AD] font-medium">
                  <span>Subtotal:</span>
                  <span className="font-bold text-[#F5F4F0] font-mono">{formatCurrency(subtotal)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Discount ({discountCode}):</span>
                    <span className="font-mono">- {formatCurrency(appliedDiscount)}</span>
                  </div>
                )}
                {loyaltyDiscount > 0 && (
                  <div className="flex justify-between text-purple-400 font-bold">
                    <span>Points Discount:</span>
                    <span className="font-mono">- {formatCurrency(loyaltyDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#A3A3AD] font-medium">
                  <span>Tax (5% GST):</span>
                  <span className="font-bold text-[#F5F4F0] font-mono">{formatCurrency(gstAmount)}</span>
                </div>
                {tipAmount > 0 && (
                  <div className="flex justify-between text-[#F5C928] font-bold">
                    <span>Stylist Tip:</span>
                    <span className="font-mono">+{formatCurrency(tipAmount)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-[#27272A] flex justify-between text-sm font-extrabold text-[#F5F4F0]">
                  <span>Total to Pay:</span>
                  <span className="text-[#F5C928] text-lg font-mono">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              {/* Payment Mode Selector */}
              <div>
                <label className="text-xs font-mono font-bold text-[#A3A3AD] uppercase tracking-wider block mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => setPaymentMethod("UPI")}
                    className={`py-2.5 px-1 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all ${
                      paymentMethod === "UPI"
                        ? "bg-[#F5C928] text-[#080809] border-[#F5C928] shadow-md"
                        : "bg-[#111113] text-[#A3A3AD] border-[#27272A] hover:bg-[#171719]"
                    }`}
                  >
                    <QrCode className="w-4 h-4" /> UPI / QR
                  </button>
                  <button
                    onClick={() => setPaymentMethod("Card")}
                    className={`py-2.5 px-1 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all ${
                      paymentMethod === "Card"
                        ? "bg-[#F5C928] text-[#080809] border-[#F5C928] shadow-md"
                        : "bg-[#111113] text-[#A3A3AD] border-[#27272A] hover:bg-[#171719]"
                    }`}
                  >
                    <CreditCard className="w-4 h-4" /> POS Card
                  </button>
                  <button
                    onClick={() => setPaymentMethod("Cash")}
                    className={`py-2.5 px-1 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all ${
                      paymentMethod === "Cash"
                        ? "bg-[#F5C928] text-[#080809] border-[#F5C928] shadow-md"
                        : "bg-[#111113] text-[#A3A3AD] border-[#27272A] hover:bg-[#171719]"
                    }`}
                  >
                    <Banknote className="w-4 h-4" /> Cash
                  </button>
                  <button
                    onClick={() => setPaymentMethod("Split")}
                    className={`py-2.5 px-1 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all ${
                      paymentMethod === "Split"
                        ? "bg-[#F5C928] text-[#080809] border-[#F5C928] shadow-md"
                        : "bg-[#111113] text-[#A3A3AD] border-[#27272A] hover:bg-[#171719]"
                    }`}
                  >
                    <Split className="w-4 h-4" /> Split Pay
                  </button>
                </div>

                {/* Dynamic UPI Preview Banner */}
                {paymentMethod === "UPI" && (
                  <div className="mt-3 p-3.5 bg-[#111113] border border-[#27272A] rounded-xl flex items-center justify-between gap-3 animate-in fade-in">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#F5F4F0]">Dynamic Amount QR</span>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                            {formatCurrency(grandTotal)}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#7E8B9C] font-mono">
                          Merchant: <span className="text-[#F5F4F0] font-bold">{salon.upiId || "billcare.pos@icici"}</span>
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowUpiQrModal(true)}
                      disabled={cart.length === 0}
                      className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-[#080809] font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Show QR Stand</span>
                    </button>
                  </div>
                )}

                {/* Cash Tendered & Change Return Calculator */}
                {paymentMethod === "Cash" && (
                  <div className="mt-3 p-3.5 bg-[#111113] border border-[#27272A] rounded-xl space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#F5F4F0] flex items-center gap-1.5">
                        <Banknote className="w-4 h-4 text-emerald-400" /> Cash Tendered by Guest
                      </span>
                      {cashTendered > grandTotal && (
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Return Change: {formatCurrency(cashTendered - grandTotal)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#7E8B9C]">₹</span>
                        <input
                          type="number"
                          placeholder={String(grandTotal)}
                          value={cashTendered || ""}
                          onChange={(e) => setCashTendered(Number(e.target.value) || 0)}
                          className="w-full pl-7 pr-3 py-2 text-xs bg-[#171719] border border-[#27272A] rounded-xl font-mono font-bold text-[#F5F4F0] focus:outline-none focus:border-[#F5C928]"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setCashTendered(grandTotal)}
                          className="px-2.5 py-2 text-[11px] font-mono font-bold bg-[#171719] hover:bg-[#27272A] text-[#F5C928] rounded-xl border border-[#27272A] transition-colors cursor-pointer"
                        >
                          Exact
                        </button>
                        {[500, 1000, 2000].map((note) => (
                          <button
                            key={note}
                            type="button"
                            onClick={() => setCashTendered(note)}
                            className="px-2.5 py-2 text-[11px] font-mono font-bold bg-[#171719] hover:bg-[#27272A] text-[#A3A3AD] hover:text-[#F5F4F0] rounded-xl border border-[#27272A] transition-colors cursor-pointer"
                          >
                            ₹{note}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Split Configuration */}
                {paymentMethod === "Split" && (
                  <div className="mt-3 p-4 bg-[#111113] rounded-xl border border-[#27272A] text-xs space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#F5F4F0] flex items-center gap-1.5">
                        <Split className="w-3.5 h-3.5 text-[#F5C928]" />
                        Split Payment Distribution
                      </span>
                      <div className="flex items-center gap-1 bg-[#171719] p-0.5 rounded-lg border border-[#27272A]">
                        <button
                          type="button"
                          onClick={() => setSplitMethod("cash_upi")}
                          className={`px-2 py-1 text-[10px] font-bold rounded ${splitMethod === "cash_upi" ? "bg-[#F5C928] text-slate-950" : "text-[#A3A3AD]"}`}
                        >
                          Cash + UPI
                        </button>
                        <button
                          type="button"
                          onClick={() => setSplitMethod("cash_card")}
                          className={`px-2 py-1 text-[10px] font-bold rounded ${splitMethod === "cash_card" ? "bg-[#F5C928] text-slate-950" : "text-[#A3A3AD]"}`}
                        >
                          Cash + Card
                        </button>
                        <button
                          type="button"
                          onClick={() => setSplitMethod("three_way")}
                          className={`px-2 py-1 text-[10px] font-bold rounded ${splitMethod === "three_way" ? "bg-[#F5C928] text-slate-950" : "text-[#A3A3AD]"}`}
                        >
                          3-Way
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-[#A3A3AD]">1. Cash Amount (₹)</label>
                        <input
                          type="number"
                          value={splitCashAmount}
                          onChange={(e) => setSplitCashAmount(Math.max(0, Math.min(grandTotal, Number(e.target.value))))}
                          className="w-full px-3 py-2 text-xs bg-[#171719] border border-[#27272A] rounded-xl font-bold text-[#F5F4F0] focus:outline-none focus:border-[#F5C928] font-mono"
                        />
                      </div>
                      {splitMethod === "cash_card" ? (
                        <div className="space-y-1">
                          <label className="text-[11px] font-mono text-[#A3A3AD]">2. POS Card Swipe (₹)</label>
                          <div className="px-3 py-2 bg-[#171719] border border-[#27272A] rounded-xl font-bold text-[#F5C928] font-mono text-xs flex items-center justify-between">
                            <span>{formatCurrency(Math.max(0, grandTotal - splitCashAmount))}</span>
                            <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#27272A] text-[#7E8B9C]">Card</span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <label className="text-[11px] font-mono text-[#A3A3AD]">2. Remaining UPI Due (₹)</label>
                          <div className="px-3 py-2 bg-[#171719] border border-[#27272A] rounded-xl font-bold text-[#F5C928] font-mono text-xs flex items-center justify-between">
                            <span>{formatCurrency(Math.max(0, grandTotal - splitCashAmount - (splitMethod === "three_way" ? splitCardAmount : 0)))}</span>
                            <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#27272A] text-[#7E8B9C]">UPI</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {splitMethod === "three_way" && (
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-[#A3A3AD]">3. Card Swipe Portion (₹)</label>
                        <input
                          type="number"
                          value={splitCardAmount}
                          onChange={(e) => setSplitCardAmount(Math.max(0, Math.min(grandTotal - splitCashAmount, Number(e.target.value))))}
                          className="w-full px-3 py-2 text-xs bg-[#171719] border border-[#27272A] rounded-xl font-bold text-[#F5F4F0] focus:outline-none focus:border-[#F5C928] font-mono"
                        />
                      </div>
                    )}

                    {splitMethod !== "cash_card" && Math.max(0, grandTotal - splitCashAmount - (splitMethod === "three_way" ? splitCardAmount : 0)) > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowUpiQrModal(true)}
                        className="w-full py-2.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-[#080809] font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Generate Dynamic QR for Remaining UPI ({formatCurrency(Math.max(0, grandTotal - splitCashAmount - (splitMethod === "three_way" ? splitCardAmount : 0)))})</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Complete Checkout Button */}
              <div className="pt-2">
                <button
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                  className="w-full py-3.5 px-4 bg-[#F5C928] hover:bg-[#f7d348] disabled:opacity-50 text-[#080809] font-extrabold text-sm rounded-xl shadow-lg shadow-[#F5C928]/10 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Generate Tax Bill & Collect {formatCurrency(grandTotal)}
                </button>
                <p className="text-[11px] text-center text-[#7E8B9C] mt-2 font-mono">
                  Instant stock deduction • Stylist commission credited • WhatsApp receipt dispatched
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Bill History Tab */
        <div className="bg-[#0D0D0F] border border-[#27272A] rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-[#F5F4F0] text-lg">Invoices & Daily Billing Ledger</h3>
              <p className="text-xs text-[#7E8B9C]">Official GST compliant receipt records</p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 bg-[#171719] border border-[#27272A] rounded-xl text-[#F5C928]">
              {invoices.length} Bills Total
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111113] text-[#7E8B9C] font-mono uppercase tracking-wider text-[11px] border-b border-[#27272A]">
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
              <tbody className="divide-y divide-[#27272A]">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#171719] transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-[#F5C928]">{inv.invoiceNumber}</td>
                    <td className="py-4 px-4 text-[#A3A3AD] font-mono">{inv.date}</td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-[#F5F4F0]">{inv.customerName}</div>
                      <span className="text-[11px] text-[#7E8B9C] font-mono">{inv.customerPhone}</span>
                    </td>
                    <td className="py-4 px-4 text-[#A3A3AD] max-w-xs truncate font-medium">
                      {inv.items.map((i) => `${i.name} (x${i.quantity})`).join(", ")}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#171719] text-[#F5F4F0] border border-[#27272A]">
                        {inv.paymentMethod}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-extrabold text-[#F5C928] font-mono text-sm">
                      {formatCurrency(inv.total)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => setActiveInvoice(inv)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#F5C928] bg-[#171719] hover:bg-[#27272A] border border-[#27272A] rounded-lg transition-colors cursor-pointer"
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

      {/* 360 Client Technical Formula Modal */}
      {showFormulaModal && selectedCustomer && (
        <ClientFormulaModal
          customer={selectedCustomer}
          invoices={invoices}
          onClose={() => setShowFormulaModal(false)}
        />
      )}

      {/* Dynamic Countertop UPI QR Modal */}
      <UpiCounterQrModal
        isOpen={showUpiQrModal}
        onClose={() => setShowUpiQrModal(false)}
        amount={paymentMethod === "Split" ? Math.max(0, grandTotal - splitCashAmount) : grandTotal}
        isSplitPayment={paymentMethod === "Split"}
        totalBillAmount={grandTotal}
        cashCollected={paymentMethod === "Split" ? splitCashAmount : undefined}
        customerName={isWalkIn ? customCustomerName || "Walk-in Guest" : selectedCustomer?.name || "Guest"}
        customerPhone={isWalkIn ? customCustomerPhone : selectedCustomer?.phone}
        invoiceNumber={`BC-POS-${Date.now().toString().slice(-6)}`}
        salonName={salon.name}
        upiId={salon.upiId || "billcare.pos@icici"}
        bankDetails={{
          accountName: salon.bankAccountName || salon.name,
          accountNumber: salon.bankAccountNumber || "50200088991122",
          ifsc: salon.bankIfsc || "HDFC0001043",
          bankName: salon.bankName || "HDFC Bank (Indiranagar)",
        }}
        onPaymentSuccess={(details) => {
          finalizeCheckout(paymentMethod, details.transactionRef);
        }}
      />

      {/* Quick Custom Charge Modal */}
      {showCustomItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#0D0D0F] border border-[#27272A] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#F5C928]/10 text-[#F5C928] border border-[#F5C928]/30">
                  <Plus className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#F5F4F0]">Quick Custom Charge</h3>
                  <p className="text-[11px] text-[#7E8B9C]">Add-on service or impromptu retail item</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCustomItemModal(false)}
                className="p-1.5 text-[#7E8B9C] hover:text-[#F5F4F0] rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-[#A3A3AD] block">Item / Service Name</label>
                <input
                  type="text"
                  placeholder="e.g. Extra Styling Addon, Bridal Pinning, Special Serum"
                  value={customItemName}
                  onChange={(e) => setCustomItemName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#171719] border border-[#27272A] rounded-xl text-[#F5F4F0] placeholder-[#7E8B9C] focus:outline-none focus:border-[#F5C928] font-medium"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-[#A3A3AD] block">Price (₹ INR)</label>
                  <input
                    type="number"
                    value={customItemPrice}
                    onChange={(e) => setCustomItemPrice(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#171719] border border-[#27272A] rounded-xl text-[#F5C928] font-bold font-mono focus:outline-none focus:border-[#F5C928]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-[#A3A3AD] block">Classification</label>
                  <select
                    value={customItemType}
                    onChange={(e) => setCustomItemType(e.target.value as "service" | "product")}
                    className="w-full px-3 py-2.5 text-xs bg-[#171719] border border-[#27272A] rounded-xl text-[#F5F4F0] font-bold focus:outline-none focus:border-[#F5C928]"
                  >
                    <option value="service">Treatment (Service)</option>
                    <option value="product">Retail Shelf (Product)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-[#A3A3AD] block">Attributed Stylist / Staff</label>
                <select
                  value={customItemStaffId}
                  onChange={(e) => setCustomItemStaffId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#171719] border border-[#27272A] rounded-xl text-[#F5F4F0] font-bold focus:outline-none focus:border-[#F5C928]"
                >
                  <option value="">Default (First Clocked-in Staff)</option>
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.role} • {s.commissionRate}%)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomItemModal(false)}
                  className="flex-1 py-2.5 px-3 text-xs font-bold text-[#A3A3AD] bg-[#171719] hover:bg-[#27272A] rounded-xl border border-[#27272A] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddCustomItem}
                  className="flex-1 py-2.5 px-3 text-xs font-bold text-[#080809] bg-[#F5C928] hover:bg-[#f7d348] rounded-xl transition-all shadow-md shadow-[#F5C928]/20 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Cart ({formatCurrency(customItemPrice)})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
