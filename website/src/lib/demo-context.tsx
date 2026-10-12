"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  SalonProfile,
  StaffMember,
  ServiceItem,
  InventoryItem,
  CustomerProfile,
  FollowUpCampaign,
  Invoice,
  Appointment,
  INITIAL_SALON,
  INITIAL_STAFF,
  INITIAL_SERVICES,
  INITIAL_INVENTORY,
  INITIAL_CUSTOMERS,
  INITIAL_FOLLOW_UPS,
  INITIAL_INVOICES,
  INITIAL_APPOINTMENTS,
} from "./demo-data";

interface DemoContextType {
  salon: SalonProfile;
  staff: StaffMember[];
  services: ServiceItem[];
  inventory: InventoryItem[];
  customers: CustomerProfile[];
  followUps: FollowUpCampaign[];
  invoices: Invoice[];
  appointments: Appointment[];

  // POS Actions
  createInvoice: (newInvoice: Omit<Invoice, "id" | "invoiceNumber" | "date">) => Invoice;
  
  // Staff Actions
  toggleStaffStatus: (staffId: string) => void;
  updateStaffCommission: (staffId: string, rate: number) => void;
  addStaffMember: (member: Omit<StaffMember, "id" | "todayRevenue" | "todayCommission" | "todayServicesCount" | "rating">) => void;

  // Inventory Actions
  updateStock: (itemId: string, delta: number, reason: string) => void;
  restockItem: (itemId: string, quantity: number) => void;
  addInventoryItem: (item: Omit<InventoryItem, "id" | "lastRestocked">) => void;

  // Follow-up & CRM Actions
  sendFollowUp: (followUpId: string) => void;
  createFollowUp: (campaign: Omit<FollowUpCampaign, "id" | "status">) => void;
  addCustomer: (customer: Omit<CustomerProfile, "id" | "visitsCount" | "totalSpent" | "loyaltyPoints" | "lastVisitDate">) => void;

  // Appointment Actions
  updateAppointmentStatus: (id: string, status: Appointment["status"]) => void;
  bookAppointment: (apt: Omit<Appointment, "id" | "status">) => void;

  // Reset to default
  resetDemoData: () => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [salon, setSalon] = useState<SalonProfile>(INITIAL_SALON);
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [services] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [customers, setCustomers] = useState<CustomerProfile[]>(INITIAL_CUSTOMERS);
  const [followUps, setFollowUps] = useState<FollowUpCampaign[]>(INITIAL_FOLLOW_UPS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);

  // Initialize from localStorage if available
  useEffect(() => {
    try {
      const savedStaff = localStorage.getItem("ruvexi_staff");
      if (savedStaff) setStaff(JSON.parse(savedStaff));

      const savedInventory = localStorage.getItem("ruvexi_inventory");
      if (savedInventory) setInventory(JSON.parse(savedInventory));

      const savedInvoices = localStorage.getItem("ruvexi_invoices");
      if (savedInvoices) setInvoices(JSON.parse(savedInvoices));

      const savedFollowUps = localStorage.getItem("ruvexi_followups");
      if (savedFollowUps) setFollowUps(JSON.parse(savedFollowUps));

      const savedAppointments = localStorage.getItem("ruvexi_appointments");
      if (savedAppointments) setAppointments(JSON.parse(savedAppointments));
    } catch {
      // Fallback to initial state
    }
  }, []);

  // Sync to local storage
  const saveToStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch {
      // Ignore storage errors in sandbox
    }
  };

  const createInvoice = (newInvData: Omit<Invoice, "id" | "invoiceNumber" | "date">) => {
    const nextNum = 1045 + invoices.length;
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const invoice: Invoice = {
      ...newInvData,
      id: `inv_${Date.now()}`,
      invoiceNumber: `INV-2026-${nextNum}`,
      date: formattedDate,
    };

    const updatedInvoices = [invoice, ...invoices];
    setInvoices(updatedInvoices);
    saveToStorage("ruvexi_invoices", updatedInvoices);

    // 1. Update Staff commissions & metrics
    setStaff((prevStaff) => {
      const nextStaff = prevStaff.map((st) => {
        const staffItems = invoice.items.filter((item) => item.staffId === st.id);
        if (staffItems.length === 0) return st;

        const staffRevenue = staffItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
        const commissionEarned = Math.round((staffRevenue * st.commissionRate) / 100);

        return {
          ...st,
          todayRevenue: st.todayRevenue + staffRevenue,
          todayCommission: st.todayCommission + commissionEarned,
          todayServicesCount: st.todayServicesCount + staffItems.length,
        };
      });
      saveToStorage("ruvexi_staff", nextStaff);
      return nextStaff;
    });

    // 2. Decrement stock for retail items sold
    setInventory((prevInv) => {
      const nextInv = prevInv.map((invItem) => {
        const itemSold = invoice.items.find((it) => it.type === "product" && it.name.includes(invItem.name));
        if (itemSold) {
          return {
            ...invItem,
            currentStock: Math.max(0, invItem.currentStock - itemSold.quantity),
          };
        }
        return invItem;
      });
      saveToStorage("ruvexi_inventory", nextInv);
      return nextInv;
    });

    // 3. Update Customer spend and loyalty points
    setCustomers((prevCust) => {
      return prevCust.map((c) => {
        if (c.name.toLowerCase() === invoice.customerName.toLowerCase() || c.phone === invoice.customerPhone) {
          const earnedPoints = Math.floor(invoice.total / 100) * 10;
          return {
            ...c,
            visitsCount: c.visitsCount + 1,
            totalSpent: c.totalSpent + invoice.total,
            loyaltyPoints: c.loyaltyPoints + earnedPoints,
            lastVisitDate: "Today",
          };
        }
        return c;
      });
    });

    return invoice;
  };

  const toggleStaffStatus = (staffId: string) => {
    setStaff((prev) => {
      const updated = prev.map((s) => {
        if (s.id !== staffId) return s;
        const nextStatus: StaffMember["status"] =
          s.status === "clocked_in" ? "on_break" : s.status === "on_break" ? "clocked_out" : "clocked_in";
        return { ...s, status: nextStatus };
      });
      saveToStorage("ruvexi_staff", updated);
      return updated;
    });
  };

  const updateStaffCommission = (staffId: string, rate: number) => {
    setStaff((prev) => {
      const updated = prev.map((s) => (s.id === staffId ? { ...s, commissionRate: rate } : s));
      saveToStorage("ruvexi_staff", updated);
      return updated;
    });
  };

  const addStaffMember = (member: Omit<StaffMember, "id" | "todayRevenue" | "todayCommission" | "todayServicesCount" | "rating">) => {
    const newStaff: StaffMember = {
      ...member,
      id: `st_${Date.now()}`,
      todayRevenue: 0,
      todayCommission: 0,
      todayServicesCount: 0,
      rating: 5.0,
    };
    const updated = [...staff, newStaff];
    setStaff(updated);
    saveToStorage("ruvexi_staff", updated);
  };

  const updateStock = (itemId: string, delta: number, _reason: string) => {
    setInventory((prev) => {
      const updated = prev.map((item) =>
        item.id === itemId ? { ...item, currentStock: Math.max(0, item.currentStock + delta) } : item
      );
      saveToStorage("ruvexi_inventory", updated);
      return updated;
    });
  };

  const restockItem = (itemId: string, quantity: number) => {
    const todayStr = new Date().toISOString().split("T")[0];
    setInventory((prev) => {
      const updated = prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              currentStock: item.currentStock + quantity,
              lastRestocked: todayStr,
            }
          : item
      );
      saveToStorage("ruvexi_inventory", updated);
      return updated;
    });
  };

  const addInventoryItem = (item: Omit<InventoryItem, "id" | "lastRestocked">) => {
    const todayStr = new Date().toISOString().split("T")[0];
    const newItem: InventoryItem = {
      ...item,
      id: `inv_${Date.now()}`,
      lastRestocked: todayStr,
    };
    const updated = [newItem, ...inventory];
    setInventory(updated);
    saveToStorage("ruvexi_inventory", updated);
  };

  const sendFollowUp = (followUpId: string) => {
    setFollowUps((prev) => {
      const updated = prev.map((f) => (f.id === followUpId ? { ...f, status: "Sent" as const } : f));
      saveToStorage("ruvexi_followups", updated);
      return updated;
    });
  };

  const createFollowUp = (campaign: Omit<FollowUpCampaign, "id" | "status">) => {
    const newCampaign: FollowUpCampaign = {
      ...campaign,
      id: `flw_${Date.now()}`,
      status: "Pending",
    };
    const updated = [newCampaign, ...followUps];
    setFollowUps(updated);
    saveToStorage("ruvexi_followups", updated);
  };

  const addCustomer = (custData: Omit<CustomerProfile, "id" | "visitsCount" | "totalSpent" | "loyaltyPoints" | "lastVisitDate">) => {
    const newCust: CustomerProfile = {
      ...custData,
      id: `cst_${Date.now()}`,
      visitsCount: 1,
      totalSpent: 0,
      loyaltyPoints: 50,
      lastVisitDate: "Today",
    };
    setCustomers((prev) => [newCust, ...prev]);
  };

  const updateAppointmentStatus = (id: string, status: Appointment["status"]) => {
    setAppointments((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, status } : a));
      saveToStorage("ruvexi_appointments", updated);
      return updated;
    });
  };

  const bookAppointment = (aptData: Omit<Appointment, "id" | "status">) => {
    const newApt: Appointment = {
      ...aptData,
      id: `apt_${Date.now()}`,
      status: "Confirmed",
    };
    const updated = [...appointments, newApt];
    setAppointments(updated);
    saveToStorage("ruvexi_appointments", updated);
  };

  const resetDemoData = () => {
    setSalon(INITIAL_SALON);
    setStaff(INITIAL_STAFF);
    setInventory(INITIAL_INVENTORY);
    setCustomers(INITIAL_CUSTOMERS);
    setFollowUps(INITIAL_FOLLOW_UPS);
    setInvoices(INITIAL_INVOICES);
    setAppointments(INITIAL_APPOINTMENTS);
    localStorage.clear();
  };

  return (
    <DemoContext.Provider
      value={{
        salon,
        staff,
        services,
        inventory,
        customers,
        followUps,
        invoices,
        appointments,
        createInvoice,
        toggleStaffStatus,
        updateStaffCommission,
        addStaffMember,
        updateStock,
        restockItem,
        addInventoryItem,
        sendFollowUp,
        createFollowUp,
        addCustomer,
        updateAppointmentStatus,
        bookAppointment,
        resetDemoData,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error("useDemo must be used within a DemoProvider");
  }
  return context;
}
