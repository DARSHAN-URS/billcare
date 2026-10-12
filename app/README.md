# RUVEXI Mobile Application (`app`)

Mobile application for salon staff operations and customer loyalty, built with **Flutter** as outlined in the RUVEXI PRD (Sections 3, 6 & Roadmap Phase 3).

---

## 🎯 Scope & Capabilities
1. **Staff Schedule & Timeline**:
   - Daily agenda view with appointment cards.
   - Real-time status transitions: `Confirmed` → `Checked In` → `In Service` → `Completed`.
2. **Attendance & Shifts**:
   - Geofenced / biometric clock-in & clock-out for salon branch shifts.
   - Leave requests and shift swap view.
3. **Commissions & Performance**:
   - Completed service ledger with calculated commission percentages.
   - Daily/monthly earnings summaries.
4. **Push Notifications**:
   - Instant push notifications for newly assigned appointments or cancellations.
5. **Customer App (Future Phase)**:
   - Repeat customer loyalty points, bookings, and receipt history.

---

## 🏗️ Folder Structure

```
app/
├── lib/
│   ├── core/                    # Core foundation
│   │   ├── auth/                # Staff auth session & token refresh
│   │   ├── constants/           # API endpoints, storage keys, config
│   │   ├── network/             # Dio client with tenant headers & interceptors
│   │   └── theme/               # RUVEXI Brand Theme (Primary #2563EB, Navy #0F172A)
│   ├── features/                # Domain-driven features
│   │   ├── appointments/        # Daily timeline, assigned bookings, status updater
│   │   │   ├── models/
│   │   │   ├── screens/
│   │   │   └── widgets/
│   │   ├── attendance/          # Shift check-in, attendance records
│   │   ├── auth/                # Login with phone / OTP or email
│   │   ├── commissions/         # Commission reports and completed invoices
│   │   ├── notifications/       # In-app and push notification inbox
│   │   └── profile/             # Staff bio, specialties, branch assignments
│   ├── shared/                  # Reusable widgets (Buttons, Cards, Dialogs)
│   └── main.dart                # App entry point
├── assets/
│   ├── icons/                   # Vector icons
│   └── images/                  # Brand logos and banners
└── pubspec.yaml                 # Flutter configuration & dependencies
```

---

## 🚀 Running the App
```bash
cd app
flutter pub get
flutter run
```
