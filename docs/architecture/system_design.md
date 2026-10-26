# BillCare Solution System Design & Technical Specification

The All-in-One Operating System for Modern Salons & Spas.

---

## 1. System Surfaces & Users

```
                                 ┌──────────────────────────────┐
                                 │      BillCare Platform       │
                                 └──────────────┬───────────────┘
                                                │
         ┌──────────────────────────────┼──────────────────────────────┐
         ▼                              ▼                              ▼
┌──────────────────┐          ┌──────────────────┐          ┌──────────────────┐
│  Salon Websites  │          │ Owner & Staff    │          │  Super-Admin     │
│  & Online Book   │          │ Dashboard & POS  │          │  Control Console │
├──────────────────┤          ├──────────────────┤          ├──────────────────┤
│[slug].billcare.io│          │ app.billcare.io  │          │admin.billcare.io │
│ (Next.js / PWA)  │          │ (Next.js + RLS)  │          │ (Protected Web)  │
└──────────────────┘          └────────┬─────────┘          └──────────────────┘
                                       │
                                       ▼
                              ┌──────────────────┐
                              │ Staff Mobile App │
                              ├──────────────────┤
                              │ Flutter (iOS/And)│
                              │ Daily Timeline & │
                              │ Attendance/Comm. │
                              └──────────────────┘
```

## 2. Multi-Tenant Architecture
- Every salon tenant is partitioned with strict tenancy isolation.
- Subdomain resolution dynamically loads salon settings, service menus, and booking calendars.
- Zero commissions: Salons retain 100% of revenue from their clients.
