-- ============================================================================
-- BillCare Solution Row-Level Security (RLS) Policies
-- Enforces strict multi-tenant isolation at the database layer (PostgreSQL)
-- ============================================================================

-- Enable RLS on all tenant-specific tables
ALTER TABLE salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_register_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_ledger ENABLE ROW LEVEL SECURITY;

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
CREATE POLICY "Tenant isolation for salons"
ON salons
FOR ALL
USING (id = get_current_tenant_id());

-- 2. Customers RLS Policy
CREATE POLICY "Tenant isolation for customers"
ON customers
FOR ALL
USING (salon_id = get_current_tenant_id());

-- 3. Appointments RLS Policy
CREATE POLICY "Tenant isolation for appointments"
ON appointments
FOR ALL
USING (salon_id = get_current_tenant_id());

-- 4. Invoices RLS Policy
CREATE POLICY "Tenant isolation for invoices"
ON invoices
FOR ALL
USING (salon_id = get_current_tenant_id());

-- 5. Staff RLS Policy
CREATE POLICY "Tenant isolation for staff"
ON staff
FOR ALL
USING (salon_id = get_current_tenant_id());

-- 6. Services RLS Policy
CREATE POLICY "Tenant isolation for services"
ON services
FOR ALL
USING (salon_id = get_current_tenant_id());

-- 7. WhatsApp Messages RLS Policy
CREATE POLICY "Tenant isolation for whatsapp_messages"
ON whatsapp_messages
FOR ALL
USING (salon_id = get_current_tenant_id());

-- 8. Cash Register Shifts RLS Policy
CREATE POLICY "Tenant isolation for cash_register_shifts"
ON cash_register_shifts
FOR ALL
USING (salon_id = get_current_tenant_id());

-- 9. Floor Expenses RLS Policy
CREATE POLICY "Tenant isolation for expenses"
ON expenses
FOR ALL
USING (salon_id = get_current_tenant_id());

-- 10. Inventory Ledger RLS Policy
CREATE POLICY "Tenant isolation for inventory_ledger"
ON inventory_ledger
FOR ALL
USING (salon_id = get_current_tenant_id());

-- 11. Public read for online booking widget (active and published services only)
CREATE POLICY "Public read for published services"
ON services
FOR SELECT
USING (
    is_active = TRUE 
    AND is_online_bookable = TRUE
);
