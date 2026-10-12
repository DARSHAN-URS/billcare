# RUVEXI - Salon Management SaaS Monorepo

The Operating System for Modern Salons. Multi-tenant SaaS platform covering daily operations, branded booking websites, customer CRM, POS, staff management, WhatsApp automation, and business intelligence.

---

## 📁 Repository Structure Overview

```
RUVEXI/
├── website/                     # Next.js 14+ Web Application (Dashboard + Branded Sites + Super Admin)
│   ├── src/
│   │   ├── app/                 # App Router with multi-tenant domain routing
│   │   │   ├── (marketing)/     # RUVEXI main marketing & SaaS sales site
│   │   │   ├── (dashboard)/     # Salon Owner / Staff Operations Portal (POS, CRM, Calendar)
│   │   │   ├── (tenant-site)/   # Dynamic branded salon websites & customer booking flow
│   │   │   ├── (super-admin)/   # Multi-tenant platform management console
│   │   │   └── api/             # Next.js edge API routes / webhook forwarders
│   │   ├── components/          # Reusable UI & design system (shadcn/ui + Tailwind)
│   │   ├── lib/                 # Client utilities, Supabase client, tenant resolver
│   │   └── styles/              # Global styles, Tailwind config, design tokens
│   ├── public/                  # Static assets & brand media
│   └── package.json
│
├── app/                         # Mobile Application (Flutter / React Native - Staff & Customer)
│   ├── lib/                     # Application source code
│   │   ├── core/                # Theme, network client, auth, storage, constants
│   │   ├── features/            # Feature-driven architecture (Auth, Schedule, Attendance, Comm)
│   │   │   ├── auth/            # Staff login & session handling
│   │   │   ├── appointments/    # Daily timeline, assigned appointments & status update
│   │   │   ├── attendance/      # Clock-in / clock-out & branch shift check
│   │   │   ├── commissions/     # Earnings, commission breakdown & completed services
│   │   │   └── profile/         # Staff profile & specialties
│   │   └── shared/              # Shared widgets and state management
│   └── pubspec.yaml             # Mobile app dependencies & configuration
│
├── backend/                     # FastAPI + Python Modular Monolith API
│   ├── app/
│   │   ├── api/v1/              # API router endpoints
│   │   ├── core/                # Security, database connection, Redis, config
│   │   ├── modules/             # Business modules (Tenant isolation, Appointments, POS, etc.)
│   │   │   ├── tenants/         # Tenant lifecycle, branding config, domain mapping
│   │   │   ├── appointments/    # Scheduling engine, conflict prevention & concurrency lock
│   │   │   ├── customers/       # CRM, customer profile, history, GDPR/DPDP consent
│   │   │   ├── staff/           # Staff profiles, working hours, commissions
│   │   │   ├── pos/             # Billing, invoices, split payments, GST calculations
│   │   │   ├── inventory/       # Stock tracking, ledger, low-stock alerts
│   │   │   ├── notifications/   # Meta WhatsApp Cloud API & reminders
│   │   │   └── ai_insights/     # Revenue forecasting & business pattern analysis
│   │   ├── workers/             # Background task workers (Celery/ARQ with Redis)
│   │   └── main.py              # Application entrypoint
│   ├── requirements.txt         # Python dependencies
│   └── Dockerfile               # Railway/container deployment configuration
│
├── database/                    # Supabase PostgreSQL Database
│   ├── migrations/              # SQL schema migrations
│   ├── rls_policies/            # Row-Level Security (RLS) multi-tenant isolation policies
│   └── seeds/                   # Development seed fixtures
│
└── docs/                        # Architecture specs, PRD references, API contracts
```

---

## 🎨 Brand Identity Guidelines (PRD v1.0)
- **Primary Blue**: `#2563EB` (Interactive elements, primary CTAs)
- **Deep Navy**: `#0F172A` (Headings, dark surfaces, sidebar)
- **Accent Purple**: `#8B5CF6` (Badges, highlights, AI features)
- **Surfaces**: Clean white `#FFFFFF` & light neutral `#F8FAFC`

---

## 🚀 Quick Setup & Getting Started

### 1. Website (Next.js Dashboard & Branded Sites)
```bash
cd website
npm install
npm run dev
```

### 2. Mobile App (Staff App)
```bash
cd app
flutter pub get
flutter run
```

### 3. Backend (FastAPI API & Workers)
```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```
