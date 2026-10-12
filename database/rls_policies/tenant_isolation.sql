-- ============================================================================
-- RUVEXI Row-Level Security (RLS) Policies
-- Enforces tenant isolation at the database layer (PRD Section 5.3 & 11.2)
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

-- Helper function: Get salon_ids that the current authenticated user belongs to
CREATE OR REPLACE FUNCTION get_user_salons()
RETURNS TABLE (salon_id UUID) AS $$
BEGIN
    RETURN QUERY
    SELECT sm.salon_id
    FROM salon_memberships sm
    WHERE sm.user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Customers RLS Policy
CREATE POLICY "Tenant isolation for customers"
ON customers
FOR ALL
USING (salon_id IN (SELECT get_user_salons()));

-- 2. Appointments RLS Policy
CREATE POLICY "Tenant isolation for appointments"
ON appointments
FOR ALL
USING (salon_id IN (SELECT get_user_salons()));

-- 3. Invoices RLS Policy
CREATE POLICY "Tenant isolation for invoices"
ON invoices
FOR ALL
USING (salon_id IN (SELECT get_user_salons()));

-- 4. Public access for published salon booking website (services & public info)
CREATE POLICY "Public read for published services"
ON services
FOR SELECT
USING (
    is_active = TRUE 
    AND is_online_bookable = TRUE
    AND salon_id IN (SELECT id FROM salons WHERE is_published = TRUE)
);
