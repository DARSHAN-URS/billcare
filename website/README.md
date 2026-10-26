# BillCare Solution - Salon Management SaaS (`website`)

Multi-tenant Next.js web application that powers three primary product surfaces:
1. **Salon Owner & Staff Dashboard** (`/dashboard`, POS, Appointments, Staff, Inventory, CRM, Reports, Settings)
2. **Branded Salon Websites & Online Customer Booking Portal** (`/book`, 24/7 self-service scheduling)
3. **Super Admin Platform Console** (`/admin`, Multi-tenant fleet, subscriptions, GMV)

---

## 🏗️ Architecture & Technology Stack

- **Framework**: Next.js 14 App Router (React 18, TypeScript)
- **Design System & Styling**: Custom Luxury Design Tokens + Tailwind CSS
- **Real Multi-Tenant Auth**: Persistent authenticated sessions with RBAC (Owner, Manager, Stylist, Receptionist)
- **POS & Billing Engine**: Indian GST (CGST + SGST) / Sales tax computation, discount matrices, split payments (Cash, UPI, Card), thermal 80mm & PDF invoice printing
- **Salonist-Style AI Advisor**: BillCare AI Business Assistant answering queries on revenue, top services, inventory alerts, and stylist commissions
- **WhatsApp Cloud Automation**: Automated 28-day color retouch, 60-day keratin refresh, and instant invoice dispatch via WhatsApp Web API
