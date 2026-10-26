# BillCare Solution - Salon Management SaaS Monorepo

The All-in-One Operating System for Modern Salons & Spas. Multi-tenant SaaS platform covering appointment scheduling, branded online customer booking, client CRM, fast POS billing, staff commission tracking, stock inventory control, WhatsApp automation, and AI business intelligence.

---

## 📁 Repository Overview

```
BillCare/
├── website/                     # Next.js 14+ Web Platform (Console, POS, Booking & Landing)
│   ├── src/
│   │   ├── app/                 # App Router with multi-tenant domain routing
│   │   │   ├── (dashboard)/     # Salon Operations Portal (POS, CRM, Calendar, Inventory)
│   │   │   ├── (tenant-site)/   # Dynamic branded salon booking sites
│   │   │   ├── admin/           # Platform management console
│   │   │   ├── book/            # Real 24/7 client booking engine
│   │   │   ├── login/           # Real authentication & session login
│   │   │   └── signup/          # Multi-step salon onboarding & instance provisioning
│   │   ├── components/          # Reusable UI & BillCare design system
│   │   ├── lib/                 # Real persistence engine (BillCare Context, utils)
│   │   └── styles/              # Global luxury dark & light styling
│   └── public/                  # Official BillCare brand logo & media
│
├── backend/                     # FastAPI + Python Modular API
├── database/                    # PostgreSQL Schema & Migrations
└── docs/                        # Architecture specs & documentation
```

## 🚀 Key Modules (Modeled on Salonist.io)

1. **Smart Appointment Calendar**: Day, week & staff-matrix views with live drag-and-drop status flow (Scheduled -> Confirmed -> Arrived -> In Service -> Completed).
2. **Point of Sale (POS) Billing**: Lightning-fast checkout, CGST + SGST tax computation, discount application, split payment methods (UPI, Card, Cash), and thermal receipt printing.
3. **Customer 360 CRM**: Profile management, loyalty points, visit histories, treatment notes, and formula cards.
4. **Staff & Stylist Management**: Live clock-in attendance tracker, designations, and automated commission calculations.
5. **Inventory & Stock Tracking**: Product catalog, retail vs back-bar stock, low-stock threshold warnings, and auto-deduction upon sale.
6. **WhatsApp Retention Automation**: Automated reminders for 28-day color retouch, 60-day keratin refresh, birthday greetings, and review collection.
7. **BillCare AI Business Advisor**: Natural-language conversational AI assistant analyzing daily revenue, top services, inventory alerts, and stylist efficiency.
8. **24/7 Online Client Booking**: Dedicated booking page for clients to choose services, pick staff, select timeslots, and reserve immediately.
