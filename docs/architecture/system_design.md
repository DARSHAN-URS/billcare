# RUVEXI System Design & Technical Specification

Based on **RUVEXI Product Requirements Document v1.0**.

---

## 1. System Surfaces & Users

```
                                 ┌──────────────────────────────┐
                                 │       RUVEXI Platform        │
                                 └──────────────┬───────────────┘
                                                │
         ┌──────────────────────────────┼──────────────────────────────┐
         ▼                              ▼                              ▼
┌──────────────────┐          ┌──────────────────┐          ┌──────────────────┐
│  Salon Websites  │          │ Owner & Staff    │          │  Super-Admin     │
│  & Online Book   │          │ Dashboard & POS  │          │  Control Console │
├──────────────────┤          ├──────────────────┤          ├──────────────────┤
│ [slug].ruvexi.com│          │ app.ruvexi.com   │          │ admin.ruvexi.com │
│ (Next.js / PWA)  │          │ (Next.js + shadcn│          │ (Protected Web)  │
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

---

## 2. Technology Stack & Responsibilities

| Layer | Technology | Primary Responsibilities |
|---|---|---|
| **Web Platform** | Next.js 14+ (TypeScript) + Tailwind CSS + shadcn/ui | Owner dashboard, branded tenant websites, customer booking flow, super-admin |
| **Mobile App** | Flutter (Dart) + BLoC | Staff daily schedule, appointment completion, attendance clock-in, commission tracker |
| **Backend API** | FastAPI (Python) Modular Monolith | Business logic, booking concurrency locking, RBAC, tenant authorization |
| **Database** | Supabase PostgreSQL | Multi-tenant relational schema, Row-Level Security (RLS), foreign key cascades |
| **Auth & Storage** | Supabase Auth & Storage | Session validation, logo & image uploads |
| **Async & Workers** | Redis + Celery / ARQ | Appointment reminders, WhatsApp automation, scheduled reports |
| **Integrations** | Razorpay, Meta WhatsApp Cloud API | Payments, invoices, automated notifications |

---

## 3. Multi-Tenant Isolation Guarantees
1. **Never trust `salon_id` from client payloads.**
2. Request headers and JWT tokens are mapped to authenticated profile identities.
3. Database queries enforce tenant scoping via PostgreSQL RLS policies.
4. Concurrency lock prevents double-booking the same staff/slot combination across simultaneous requests.
