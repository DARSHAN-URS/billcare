-- ============================================================================
-- RUVEXI Core Database Schema (PRD Section 5.2)
-- Target: Supabase PostgreSQL (Multi-tenant SaaS)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SALONS (TENANTS)
CREATE TABLE IF NOT EXISTS salons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(32),
    email VARCHAR(255),
    timezone VARCHAR(64) DEFAULT 'Asia/Kolkata',
    currency VARCHAR(10) DEFAULT 'INR',
    logo_url TEXT,
    primary_color VARCHAR(16) DEFAULT '#2563EB',
    accent_color VARCHAR(16) DEFAULT '#8B5CF6',
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BRANCHES
CREATE TABLE IF NOT EXISTS branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    phone VARCHAR(32),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROFILES & SALON MEMBERSHIPS (Supabase Auth link)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY, -- links to auth.users.id
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(32),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS salon_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role VARCHAR(32) NOT NULL CHECK (role IN ('owner', 'manager', 'receptionist', 'staff')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(salon_id, user_id)
);

-- 4. CUSTOMERS (CRM)
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    first_name VARCHAR(128) NOT NULL,
    last_name VARCHAR(128),
    phone VARCHAR(32) NOT NULL,
    email VARCHAR(255),
    gender VARCHAR(16),
    birthday DATE,
    notes TEXT,
    loyalty_points INT DEFAULT 0,
    marketing_consent BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(salon_id, phone)
);

-- 5. SERVICES & CATEGORIES
CREATE TABLE IF NOT EXISTS service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    name VARCHAR(128) NOT NULL,
    sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    category_id UUID REFERENCES service_categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INT NOT NULL DEFAULT 30,
    buffer_minutes INT NOT NULL DEFAULT 5,
    price NUMERIC(10, 2) NOT NULL,
    is_online_bookable BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. STAFF
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(32),
    email VARCHAR(255),
    role VARCHAR(64) DEFAULT 'Stylist',
    commission_rate NUMERIC(5, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. APPOINTMENTS
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'requested'
        CHECK (status IN ('requested', 'confirmed', 'checked_in', 'in_service', 'completed', 'cancelled', 'no_show')),
    source VARCHAR(32) DEFAULT 'website', -- website, walk_in, phone
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. INVOICES & PAYMENTS (POS)
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    invoice_number VARCHAR(64) NOT NULL,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE RESTRICT,
    subtotal NUMERIC(10, 2) NOT NULL,
    discount_amount NUMERIC(10, 2) DEFAULT 0.00,
    tax_amount NUMERIC(10, 2) DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'paid', 'partially_paid', 'voided')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(salon_id, invoice_number)
);

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    method VARCHAR(32) NOT NULL CHECK (method IN ('cash', 'upi', 'card', 'razorpay', 'split')),
    provider_transaction_id VARCHAR(255),
    status VARCHAR(32) NOT NULL DEFAULT 'completed',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action VARCHAR(128) NOT NULL,
    entity_type VARCHAR(64) NOT NULL,
    entity_id UUID,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
