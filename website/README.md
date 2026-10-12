# RUVEXI Web Application (`website`)

Multi-tenant Next.js application that powers three primary product surfaces as defined in the RUVEXI PRD:
1. **Salon Owner / Staff Dashboard** (`/overview`, `/appointments`, `/calendar`, `/pos`, `/customers`, etc.)
2. **Branded Salon Websites & Customer Booking Flow** (Subdomain / dynamic tenant routing `[salonSlug]`)
3. **Super Admin Console** (`/super-admin/tenants`, `/super-admin/subscriptions`, etc.)

---

## 🏗️ Folder Structure

```
website/
├── src/
│   ├── app/
│   │   ├── (marketing)/         # SaaS landing page for ruvexi.com
│   │   ├── (dashboard)/         # Owner & staff portal (auth-guarded, RBAC-aware)
│   │   │   ├── overview/        # Daily appointments, KPI cards, revenue breakdown
│   │   │   ├── appointments/    # Appointment list, filtering, status transitions
│   │   │   ├── calendar/        # Day, week, staff-column & mobile agenda views
│   │   │   ├── customers/       # CRM, customer profile, history, visits
│   │   │   ├── services/        # Service catalog, pricing, durations & buffers
│   │   │   ├── staff/           # Staff profiles, rosters, attendance, commission
│   │   │   ├── pos/             # Checkout, billing, split payments & invoices
│   │   │   ├── inventory/       # Stock tracking, retail items, minimum alert thresholds
│   │   │   ├── loyalty/         # Memberships, prepaid packages, loyalty points
│   │   │   ├── whatsapp/        # Meta WhatsApp Cloud API connection & reminders
│   │   │   ├── reports/         # Financial, appointment, inventory & staff reports
│   │   │   ├── ai-insights/     # Overdue signals, demand trends, underbooked periods
│   │   │   ├── branding/        # Real-time branding editor (logo, colors, gallery preview)
│   │   │   ├── settings/        # Salon policies, business hours, tax rules
│   │   │   └── subscription/    # Plan management (Starter, Growth, Pro) & billing
│   │   ├── (tenant-site)/       # Public branded salon websites
│   │   │   └── [salonSlug]/
│   │   │       ├── page.tsx     # Branded homepage (hero, services, team, gallery)
│   │   │       ├── book/        # Responsive online booking & confirmation flow
│   │   │       ├── services/    # Salon service menu
│   │   │       ├── gallery/     # Salon portfolio
│   │   │       └── contact/     # Contact info, map, operating hours, WhatsApp link
│   │   ├── (super-admin)/       # RUVEXI platform administration
│   │   │   ├── tenants/         # Salon directory, onboarding status & controls
│   │   │   ├── subscriptions/   # Platform-wide MRR, plan limits, payment status
│   │   │   └── health/          # Background worker status, integration logs
│   │   ├── api/                 # Edge API routes & webhook handlers
│   │   └── middleware.ts        # Subdomain / tenant resolution middleware
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components (Button, Dialog, Input, Table)
│   │   ├── dashboard/           # Dashboard shell, navigation, KPI metric cards
│   │   ├── booking/             # Step-by-step customer booking wizard
│   │   ├── branding-editor/     # Live theme customizer with real-time preview
│   │   └── pos/                 # Checkout drawer, invoice generator & payment split
│   ├── lib/
│   │   ├── supabase/            # Supabase SSR client & authentication helpers
│   │   ├── tenant/              # Hostname parsing and tenant resolution engine
│   │   └── utils/               # Formatting, currency (INR/₹), date helpers
│   └── styles/
│       └── globals.css          # Design tokens (RUVEXI Blue, Navy, Purple, surfaces)
```

---

## 🎨 Theme & Styling System (PRD v1.0)
- **Primary Blue**: `#2563EB`
- **Deep Navy**: `#0F172A`
- **Accent Purple**: `#8B5CF6`
- **Light Neutrals**: `#F8FAFC`, `#FFFFFF`
- **Typography**: Inter / Outfit via Google Fonts
