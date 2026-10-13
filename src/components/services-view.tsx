"use client";

import React, { useState } from "react";
import { useDemo } from "@/lib/demo-context";
import { formatCurrency } from "@/lib/utils";
import { ServiceItem } from "@/lib/demo-data";
import {
  Scissors,
  Plus,
  Search,
  Sparkles,
  Clock,
  Tag,
  Star,
  CheckCircle2,
  X,
  Edit2,
  DollarSign,
  TrendingUp,
} from "lucide-react";

export function ServicesView() {
  const { services, addService, updateService } = useDemo();

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<number>(0);

  // New service form state
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<
    "Hair" | "Skin & Spa" | "Nails" | "Beard & Grooming" | "Makeup"
  >("Hair");
  const [newDuration, setNewDuration] = useState<number>(60);
  const [newPrice, setNewPrice] = useState<number>(2500);
  const [newDescription, setNewDescription] = useState("");
  const [newPopular, setNewPopular] = useState(false);

  const categories = ["All", "Hair", "Skin & Spa", "Nails", "Beard & Grooming", "Makeup"];

  const filteredServices = services.filter((s) => {
    const matchesCategory = activeCategory === "All" || s.category === activeCategory;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const avgPrice = Math.round(
    services.reduce((acc, s) => acc + s.price, 0) / (services.length || 1)
  );
  const popularCount = services.filter((s) => s.popular).length;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addService({
      name: newName,
      category: newCategory,
      durationMinutes: newDuration,
      price: newPrice,
      description: newDescription,
      popular: newPopular,
    });

    setShowAddModal(false);
    setNewName("");
    setNewDescription("");
  };

  const handleSavePriceEdit = (id: string) => {
    if (editingPrice > 0) {
      updateService(id, { price: editingPrice });
    }
    setEditingServiceId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="luxury-card p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 border border-white/20">
            <Scissors className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Salon Treatment Catalog & Service Menu
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {services.length} Treatments Active
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Service durations • Standard pricing & GST • Online booking catalog availability
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Treatment
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="luxury-card p-4 rounded-2xl border-slate-200/80">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Total Menu Services
          </span>
          <span className="text-lg font-black text-slate-900 font-mono mt-1 block">
            {services.length} Items
          </span>
        </div>
        <div className="luxury-card p-4 rounded-2xl border-slate-200/80">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Average Ticket Size
          </span>
          <span className="text-lg font-black text-blue-600 font-mono mt-1 block">
            {formatCurrency(avgPrice)}
          </span>
        </div>
        <div className="luxury-card p-4 rounded-2xl border-slate-200/80">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Signature Bestsellers
          </span>
          <span className="text-lg font-black text-amber-500 font-mono mt-1 block">
            {popularCount} Flagships
          </span>
        </div>
        <div className="luxury-card p-4 rounded-2xl border-slate-200/80">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            GST Compliance
          </span>
          <span className="text-lg font-black text-emerald-600 font-mono mt-1 block">
            5% Standard Rate
          </span>
        </div>
      </div>

      {/* Search & Category Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search treatments by name, therapy or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border ${
                activeCategory === cat
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="luxury-card rounded-3xl p-5 flex flex-col justify-between hover:border-blue-300 hover:shadow-xl transition-all"
          >
            <div>
              {/* Category Pill & Popular Badge */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 tracking-wider">
                  {service.category}
                </span>

                <div className="flex items-center gap-1.5">
                  {service.popular && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400" /> Bestseller
                    </span>
                  )}
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-blue-500" /> {service.durationMinutes}m
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="mt-3.5">
                <h3 className="font-extrabold text-slate-900 text-base leading-snug tracking-tight">
                  {service.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>

            {/* Price & Edit Section */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              {editingServiceId === service.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={editingPrice}
                    onChange={(e) => setEditingPrice(Number(e.target.value))}
                    className="w-24 px-2 py-1 text-xs border border-blue-400 rounded-lg font-mono font-bold"
                  />
                  <button
                    onClick={() => handleSavePriceEdit(service.id)}
                    className="px-2 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingServiceId(null)}
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="font-black text-slate-900 font-mono text-lg">
                    {formatCurrency(service.price)}
                  </span>
                  <span className="text-[10px] text-slate-400">+5% GST</span>
                </div>
              )}

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setEditingServiceId(service.id);
                    setEditingPrice(service.price);
                  }}
                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                  title="Edit Price"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => updateService(service.id, { popular: !service.popular })}
                  className={`p-1.5 rounded-xl transition-colors ${
                    service.popular
                      ? "text-amber-500 hover:bg-amber-50"
                      : "text-slate-300 hover:text-amber-500"
                  }`}
                  title="Toggle Popular Status"
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Treatment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 w-full max-w-md animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">
                Add New Salon Treatment
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Treatment Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Japanese Silk Keratin Infusion"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold"
                  >
                    <option value="Hair">Hair</option>
                    <option value="Skin & Spa">Skin & Spa</option>
                    <option value="Nails">Nails</option>
                    <option value="Beard & Grooming">Beard & Grooming</option>
                    <option value="Makeup">Makeup</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    required
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Price (₹ INR) *</label>
                <input
                  type="number"
                  required
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Bespoke service details, benefits and steps..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={newPopular}
                  onChange={(e) => setNewPopular(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Feature as Signature Bestseller</span>
              </label>

              <div className="pt-2 flex gap-2">
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
                  Add Treatment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
