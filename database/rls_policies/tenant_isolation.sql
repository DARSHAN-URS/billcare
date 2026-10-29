-- ============================================================================
-- BillCare Solution Row-Level Security (RLS) Policies
-- Enforces strict multi-tenant isolation at the database layer (PostgreSQL)
-- ============================================================================

-- Ensure receptionist & inventory tables exist before applying security
CREATE TABLE IF NOT EXISTS cash_register_shifts (
    id VARCHAR(64) PRIMARY KEY,
    salon_id VARCHAR(64) NOT NULL,
    opened_by_user_id VARCHAR(64),
    opened_by_name VARCHAR(128) DEFAULT 'Front Desk Cashier',
    closed_by_user_id VARCHAR(64),
    closed_by_name VARCHAR(128),
    opening_float NUMERIC(10, 2) DEFAULT 2000.00,
    cash_sales NUMERIC(10, 2) DEFAULT 0.00,
    upi_sales NUMERIC(10, 2) DEFAULT 0.00,
    card_sales NUMERIC(10, 2) DEFAULT 0.00,
    total_sales NUMERIC(10, 2) DEFAULT 0.00,
    expected_cash NUMERIC(10, 2) DEFAULT 2000.00,
    counted_cash NUMERIC(10, 2),
    cash_variance NUMERIC(10, 2) DEFAULT 0.00,
    status VARCHAR(32) DEFAULT 'open',
    notes TEXT DEFAULT '',
    opened_at TIMESTAMPTZ DEFAULT NOW(),
    closed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS expenses (
    id VARCHAR(64) PRIMARY KEY,
    salon_id VARCHAR(64) NOT NULL,
    title VARCHAR(128) NOT NULL,
    category VARCHAR(64) DEFAULT 'Supplies',
    amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(32) DEFAULT 'Cash',
    date VARCHAR(32),
    recorded_by_name VARCHAR(128) DEFAULT 'Salon Manager',
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory_ledger (
    id VARCHAR(64) PRIMARY KEY,
    salon_id VARCHAR(64) NOT NULL,
    item_id VARCHAR(64) NOT NULL,
    item_name VARCHAR(128) NOT NULL,
    change_qty INT NOT NULL,
    previous_stock INT DEFAULT 0,
    new_stock INT DEFAULT 0,
    reason VARCHAR(128) DEFAULT 'sale',
    performed_by VARCHAR(128) DEFAULT 'POS System',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tenant-specific tables
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'salons') THEN
        ALTER TABLE salons ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'customers') THEN
        ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'appointments') THEN
        ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'invoices') THEN
        ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'payments') THEN
        ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'staff') THEN
        ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'services') THEN
        ALTER TABLE services ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'audit_logs') THEN
        ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'whatsapp_messages') THEN
        ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'cash_register_shifts') THEN
        ALTER TABLE cash_register_shifts ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'expenses') THEN
        ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'inventory_ledger') THEN
        ALTER TABLE inventory_ledger ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Helper function: Returns current authenticated tenant salon_id from session JWT claims or session variable
CREATE OR REPLACE FUNCTION get_current_tenant_id()
RETURNS VARCHAR(64) AS $$
BEGIN
    RETURN COALESCE(
        current_setting('request.jwt.claims', true)::jsonb->>'salon_id',
        current_setting('app.current_salon_id', true)
    );
END;
$$ LANGUAGE plpgsql STABLE;

-- 1. Salons RLS Policy (Tenants can only see their own salon record)
DROP POLICY IF EXISTS "Tenant isolation for salons" ON salons;
DROP POLICY IF EXISTS tenant_isolation_salons ON salons;
CREATE POLICY "Tenant isolation for salons"
ON salons
FOR ALL
USING (id = get_current_tenant_id());

-- 2. Customers RLS Policy
DROP POLICY IF EXISTS "Tenant isolation for customers" ON customers;
DROP POLICY IF EXISTS tenant_isolation_customers ON customers;
CREATE POLICY "Tenant isolation for customers"
ON customers
FOR ALL
USING (salon_id = get_current_tenant_id());

-- 3. Appointments RLS Policy
DROP POLICY IF EXISTS "Tenant isolation for appointments" ON appointments;
DROP POLICY IF EXISTS tenant_isolation_appointments ON appointments;
CREATE POLICY "Tenant isolation for appointments"
ON appointments
FOR ALL
USING (salon_id = get_current_tenant_id());

-- 4. Invoices RLS Policy
DROP POLICY IF EXISTS "Tenant isolation for invoices" ON invoices;
DROP POLICY IF EXISTS tenant_isolation_invoices ON invoices;
CREATE POLICY "Tenant isolation for invoices"
ON invoices
FOR ALL
USING (salon_id = get_current_tenant_id());

-- 5. Staff RLS Policy
DROP POLICY IF EXISTS "Tenant isolation for staff" ON staff;
DROP POLICY IF EXISTS tenant_isolation_staff ON staff;
CREATE POLICY "Tenant isolation for staff"
ON staff
FOR ALL
USING (salon_id = get_current_tenant_id());

-- 6. Services RLS Policy
DROP POLICY IF EXISTS "Tenant isolation for services" ON services;
DROP POLICY IF EXISTS tenant_isolation_services ON services;
CREATE POLICY "Tenant isolation for services"
ON services
FOR ALL
USING (salon_id = get_current_tenant_id());

-- 7. WhatsApp Messages RLS Policy
DROP POLICY IF EXISTS "Tenant isolation for whatsapp_messages" ON whatsapp_messages;
DROP POLICY IF EXISTS tenant_isolation_whatsapp_messages ON whatsapp_messages;
CREATE POLICY "Tenant isolation for whatsapp_messages"
ON whatsapp_messages
FOR ALL
USING (salon_id = get_current_tenant_id());

-- 8. Cash Register Shifts RLS Policy
DROP POLICY IF EXISTS "Tenant isolation for cash_register_shifts" ON cash_register_shifts;
DROP POLICY IF EXISTS tenant_isolation_cash_register_shifts ON cash_register_shifts;
CREATE POLICY "Tenant isolation for cash_register_shifts"
ON cash_register_shifts
FOR ALL
USING (salon_id = get_current_tenant_id());

-- 9. Floor Expenses RLS Policy
DROP POLICY IF EXISTS "Tenant isolation for expenses" ON expenses;
DROP POLICY IF EXISTS tenant_isolation_expenses ON expenses;
CREATE POLICY "Tenant isolation for expenses"
ON expenses
FOR ALL
USING (salon_id = get_current_tenant_id());

-- 10. Inventory Ledger RLS Policy
DROP POLICY IF EXISTS "Tenant isolation for inventory_ledger" ON inventory_ledger;
DROP POLICY IF EXISTS tenant_isolation_inventory_ledger ON inventory_ledger;
CREATE POLICY "Tenant isolation for inventory_ledger"
ON inventory_ledger
FOR ALL
USING (salon_id = get_current_tenant_id());

-- 11. Public read for online booking widget (active and published services only)
DROP POLICY IF EXISTS "Public read for published services" ON services;
DROP POLICY IF EXISTS public_services_read ON services;
CREATE POLICY "Public read for published services"
ON services
FOR SELECT
USING (
    is_active = TRUE 
    AND is_online_bookable = TRUE
);
