/**
 * BillCare Solution Platform API Client
 * Seamlessly connects Next.js frontend to FastAPI backend API
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" && window.location.origin.includes("3000")
    ? "http://127.0.0.1:8000/api/v1"
    : "/api/v1");

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (typeof window !== "undefined") {
    try {
      const token = localStorage.getItem("billcare_token");
      if (token && !headers["Authorization"]) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    } catch {}
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorJson;
      try {
        errorJson = JSON.parse(errorText);
      } catch {
        errorJson = { detail: errorText || `HTTP ${res.status}` };
      }
      throw new Error(errorJson.detail || `Request failed with status ${res.status}`);
    }

    return (await res.json()) as T;
  } catch (err: any) {
    // Return friendly error or propagate
    console.warn(`[BillCare API] ${options.method || "GET"} ${url} error:`, err.message);
    throw err;
  }
}

export const billcareApi = {
  // Bootstrap entire workspace state
  getBootstrap: () => request<any>("/bootstrap"),

  // Auth
  login: (credentials: { email: string; password?: string }) =>
    request<any>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  signup: (payload: { user: any; salon: any }) =>
    request<any>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Salon Profile
  getSalon: () => request<any>("/salon"),
  updateSalon: (data: any) =>
    request<any>("/salon", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Customers
  getCustomers: () => request<any[]>("/customers"),
  createCustomer: (data: any) =>
    request<any>("/customers", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateCustomer: (id: string, data: any) =>
    request<any>(`/customers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteCustomer: (id: string) =>
    request<{ success: boolean; id: string }>(`/customers/${id}`, {
      method: "DELETE",
    }),

  // Services
  getServices: () => request<any[]>("/services"),
  createService: (data: any) =>
    request<any>("/services", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateService: (id: string, data: any) =>
    request<any>(`/services/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteService: (id: string) =>
    request<{ success: boolean; id: string }>(`/services/${id}`, {
      method: "DELETE",
    }),

  // Staff
  getStaff: () => request<any[]>("/staff"),
  createStaff: (data: any) =>
    request<any>("/staff", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateStaff: (id: string, data: any) =>
    request<any>(`/staff/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  toggleClock: (id: string) =>
    request<any>(`/staff/${id}/toggle-clock`, {
      method: "POST",
    }),
  deleteStaff: (id: string) =>
    request<{ success: boolean; id: string }>(`/staff/${id}`, {
      method: "DELETE",
    }),

  // Inventory
  getInventory: () => request<any[]>("/inventory"),
  createInventory: (data: any) =>
    request<any>("/inventory", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateInventory: (id: string, data: any) =>
    request<any>(`/inventory/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  adjustStock: (id: string, change: number, reason?: string) =>
    request<any>(`/inventory/${id}/adjust-stock`, {
      method: "POST",
      body: JSON.stringify({ change, reason }),
    }),
  deleteInventory: (id: string) =>
    request<{ success: boolean; id: string }>(`/inventory/${id}`, {
      method: "DELETE",
    }),

  // Appointments
  getAppointments: () => request<any[]>("/appointments"),
  createAppointment: (data: any) =>
    request<any>("/appointments", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateAppointmentStatus: (id: string, status: string) =>
    request<any>(`/appointments/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
  deleteAppointment: (id: string) =>
    request<{ success: boolean; id: string }>(`/appointments/${id}`, {
      method: "DELETE",
    }),

  // Invoices & POS
  getInvoices: () => request<any[]>("/invoices"),
  createInvoice: (data: any) =>
    request<any>("/invoices", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Follow-ups & Retention
  getFollowUps: () => request<any[]>("/followups"),
  createFollowUp: (data: any) =>
    request<any>("/followups", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  markFollowUpSent: (id: string) =>
    request<any>(`/followups/${id}/sent`, {
      method: "POST",
    }),

  // Feedbacks
  getFeedbacks: () => request<any[]>("/feedbacks"),
  createFeedback: (data: any) =>
    request<any>("/feedbacks", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
