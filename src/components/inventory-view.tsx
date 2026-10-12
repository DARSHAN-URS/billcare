"use client";

import React, { useState } from "react";
import { useDemo } from "@/lib/demo-context";
import { formatCurrency } from "@/lib/utils";
import { InventoryItem } from "@/lib/demo-data";
import {
  Package,
  AlertTriangle,
  Plus,
  Minus,
  RotateCcw,
  Search,
  Filter,
  DollarSign,
  TrendingDown,
  CheckCircle2,
  Boxes,
  Tag,
  X,
  Sparkles,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

export function InventoryView() {
  const { inventory, updateStock, restockItem, addInventoryItem } = useDemo();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [usageFilter, setUsageFilter] = useState<"All" | "Salon Professional" | "Retail Sale">("All");
  const [onlyLowStock, setOnlyLowStock] = useState(false);

  // Modals
  const [restockModalItem, setRestockModalItem] = useState<InventoryItem | null>(null);
  const [restockQuantity, setRestockQuantity] = useState<number>(10);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemBrand, setNewItemBrand] = useState("");
  const [newItemSku, setNewItemSku] = useState("");
  const [newItemCategory, setNewItemCategory] = useState<InventoryItem["category"]>("Hair Care");
  const [newItemUsage, setNewItemUsage] = useState<InventoryItem["usageType"]>("Salon Professional");
  const [newItemCurrentStock, setNewItemCurrentStock] = useState(10);
  const [newItemMinThreshold, setNewItemMinThreshold] = useState(5);
  const [newItemCostPrice, setNewItemCostPrice] = useState(850);
  const [newItemRetailPrice, setNewItemRetailPrice] = useState(1400);
  const [newItemUnit, setNewItemUnit] = useState("Bottles");

  // Filtered Items
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    const matchesUsage = usageFilter === "All" || item.usageType === usageFilter;
    const matchesLowStock = onlyLowStock ? item.currentStock <= item.minThreshold : true;

    return matchesSearch && matchesCategory && matchesUsage && matchesLowStock;
  });

  // Analytics
  const lowStockCount = inventory.filter((i) => i.currentStock <= i.minThreshold).length;
  const totalValuation = inventory.reduce((acc, i) => acc + i.currentStock * i.costPrice, 0);
  const retailPotentialValue = inventory
    .filter((i) => i.usageType === "Retail Sale" && i.retailPrice)
    .reduce((acc, i) => acc + i.currentStock * (i.retailPrice || 0), 0);

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (restockModalItem && restockQuantity > 0) {
      restockItem(restockModalItem.id, restockQuantity);
      setRestockModalItem(null);
      setRestockQuantity(10);
    }
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    addInventoryItem({
      name: newItemName,
      brand: newItemBrand || "Luxe Salon",
      sku: newItemSku || `SKU-${Date.now().toString().slice(-5)}`,
      category: newItemCategory,
      usageType: newItemUsage,
      currentStock: newItemCurrentStock,
      minThreshold: newItemMinThreshold,
      costPrice: newItemCostPrice,
      retailPrice: newItemUsage === "Retail Sale" ? newItemRetailPrice : undefined,
      unit: newItemUnit,
    });

    setShowAddModal(false);
    setNewItemName("");
    setNewItemBrand("");
    setNewItemSku("");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="luxury-card p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/25 border border-white/20">
            <Boxes className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Salon Floor Stock & Retail Inventory
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                Multi-Bin Ledger
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Professional salon backbar usage • Retail shelves ledger • Dynamic reorder threshold alerts
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Product SKU
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="luxury-card p-5 rounded-3xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Total Active SKUs</span>
            <span className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Package className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{inventory.length} Products</div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Across 4 luxury categories</p>
        </div>

        <div className="luxury-card p-5 rounded-3xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Reorder Alerts</span>
            <span className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-rose-600 mt-2">{lowStockCount} Critical</div>
          <button
            onClick={() => setOnlyLowStock(!onlyLowStock)}
            className="text-[11px] text-rose-600 hover:underline font-bold mt-1 block"
          >
            {onlyLowStock ? "Show all items" : "Filter below threshold →"}
          </button>
        </div>

        <div className="luxury-card p-5 rounded-3xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Wholesale Cost Basis</span>
            <span className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 font-mono">{formatCurrency(totalValuation)}</div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Total physical stock value</p>
        </div>

        <div className="luxury-card p-5 rounded-3xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Retail Shelf Potential</span>
            <span className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2 font-mono">{formatCurrency(retailPotentialValue)}</div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Projected customer revenue</p>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="luxury-card p-4 rounded-3xl space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search product name, brand or SKU (e.g. Olaplex, Moroccanoil, Wella)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none font-medium"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={usageFilter}
              onChange={(e: any) => setUsageFilter(e.target.value)}
              className="px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none"
            >
              <option value="All">All Usages (Backbar & Retail)</option>
              <option value="Salon Professional">Salon Backbar (Professional)</option>
              <option value="Retail Sale">Retail Shelves</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Hair Care">Hair Care</option>
              <option value="Color & Chemical">Color & Chemical</option>
              <option value="Skin & Facial">Skin & Facial</option>
              <option value="Tools & Disposables">Tools & Disposables</option>
            </select>

            <button
              onClick={() => setOnlyLowStock(!onlyLowStock)}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 ${
                onlyLowStock
                  ? "bg-rose-50 text-rose-700 border-rose-300 shadow-sm"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Low Stock Alert ({lowStockCount})
            </button>
          </div>
        </div>
      </div>

      {/* Stock Table */}
      <div className="luxury-card rounded-3xl overflow-hidden shadow-lg border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Item & Brand</th>
                <th className="py-3.5 px-4">Classification</th>
                <th className="py-3.5 px-4">Stock Level</th>
                <th className="py-3.5 px-4">Reorder Min</th>
                <th className="py-3.5 px-4">Cost Basis</th>
                <th className="py-3.5 px-4">Retail MSRP</th>
                <th className="py-3.5 px-4">Last Stocking</th>
                <th className="py-3.5 px-4 text-center">Fast Inventory Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInventory.map((item) => {
                const isLow = item.currentStock <= item.minThreshold;
                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-extrabold text-slate-900">{item.name}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-blue-600 font-bold">{item.brand}</span>
                        <span className="text-[10px] text-slate-400 font-mono">SKU: {item.sku}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          item.usageType === "Retail Sale"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-purple-50 text-purple-800 border border-purple-200"
                        }`}
                      >
                        {item.usageType}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-black font-mono ${
                            isLow ? "text-rose-600" : "text-slate-800"
                          }`}
                        >
                          {item.currentStock} {item.unit}
                        </span>
                        {isLow && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-100 text-rose-700 flex items-center gap-1 animate-pulse">
                            <AlertTriangle className="w-2.5 h-2.5" /> REORDER
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-500 font-medium">
                      Min: {item.minThreshold} {item.unit}
                    </td>

                    <td className="py-4 px-4 font-bold text-slate-700 font-mono">{formatCurrency(item.costPrice)}</td>

                    <td className="py-4 px-4 font-black text-emerald-700 font-mono">
                      {item.retailPrice ? formatCurrency(item.retailPrice) : "—"}
                    </td>

                    <td className="py-4 px-4 text-slate-500 font-mono text-[11px]">{item.lastRestocked}</td>

                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Deduct usage in salon floor */}
                        <button
                          onClick={() => updateStock(item.id, -1, "Floor consumption")}
                          title="Log 1 Unit Consumed in Treatment"
                          className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-slate-200"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        {/* Quick Restock Action */}
                        <button
                          onClick={() => {
                            setRestockModalItem(item);
                            setRestockQuantity(10);
                          }}
                          className="px-3 py-1.5 text-xs font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" /> Restock Batch
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restock Modal */}
      {restockModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 w-full max-w-sm animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-sm">Replenish Product Batch</h3>
              <button onClick={() => setRestockModalItem(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRestockSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Item:</span>
                <p className="font-extrabold text-slate-900 text-sm">{restockModalItem.name}</p>
                <p className="text-[11px] text-slate-500 font-medium">
                  Current Floor Stock: <b className="text-blue-600">{restockModalItem.currentStock} {restockModalItem.unit}</b>
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Add Units ({restockModalItem.unit})</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-black text-blue-600 focus:bg-white focus:outline-none font-mono"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setRestockModalItem(null)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 text-white font-extrabold rounded-xl shadow-md shadow-blue-500/20"
                >
                  Confirm Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Inventory Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 w-full max-w-md animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">Register New Beauty SKU</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewItem} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kérastase Chronologiste Hair Mask (200ml)"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Brand</label>
                  <input
                    type="text"
                    placeholder="e.g. Kérastase"
                    value={newItemBrand}
                    onChange={(e) => setNewItemBrand(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newItemCategory}
                    onChange={(e: any) => setNewItemCategory(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold"
                  >
                    <option value="Hair Care">Hair Care</option>
                    <option value="Color & Chemical">Color & Chemical</option>
                    <option value="Skin & Facial">Skin & Facial</option>
                    <option value="Tools & Disposables">Tools & Disposables</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Usage Type</label>
                  <select
                    value={newItemUsage}
                    onChange={(e: any) => setNewItemUsage(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold"
                  >
                    <option value="Salon Professional">Salon Backbar (Pro)</option>
                    <option value="Retail Sale">Retail Sale Shelf</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Unit of Measure</label>
                  <input
                    type="text"
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                    placeholder="Bottles / Tubs / Packs"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Initial Stock</label>
                  <input
                    type="number"
                    value={newItemCurrentStock}
                    onChange={(e) => setNewItemCurrentStock(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Min Alert Threshold</label>
                  <input
                    type="number"
                    value={newItemMinThreshold}
                    onChange={(e) => setNewItemMinThreshold(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-bold font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Cost Price (₹)</label>
                  <input
                    type="number"
                    value={newItemCostPrice}
                    onChange={(e) => setNewItemCostPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-bold font-mono"
                  />
                </div>
                {newItemUsage === "Retail Sale" && (
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Retail Shelf Price (₹)</label>
                    <input
                      type="number"
                      value={newItemRetailPrice}
                      onChange={(e) => setNewItemRetailPrice(Number(e.target.value))}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-bold font-mono"
                    />
                  </div>
                )}
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
                  className="flex-1 py-2.5 bg-blue-600 text-white font-extrabold rounded-xl shadow-md shadow-blue-500/20"
                >
                  Register SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
