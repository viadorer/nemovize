-- ============================================================================
-- OPRAVA RLS POLICIES PRO VEŘEJNÝ PŘÍSTUP
-- ============================================================================

-- Povolit RLS na nových tabulkách
ALTER TABLE real_estate_agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE brokers ENABLE ROW LEVEL SECURITY;

-- Veřejné čtení pro aktivní realitní kanceláře
CREATE POLICY "agencies_public_select" ON real_estate_agencies 
  FOR SELECT 
  USING (is_active = true);

-- Veřejné čtení pro aktivní makléře
CREATE POLICY "brokers_public_select" ON brokers 
  FOR SELECT 
  USING (is_active = true);

-- Aktualizace policy pro properties - povolit čtení i bez autentizace
DROP POLICY IF EXISTS "properties_select" ON properties;
CREATE POLICY "properties_select" ON properties 
  FOR SELECT 
  USING (
    status = 'active' 
    OR team_id IN (SELECT team_id FROM profiles WHERE id = auth.uid())
  );

-- Aktualizace policy pro property_images - povolit čtení i bez autentizace
DROP POLICY IF EXISTS "property_images_select" ON property_images;
CREATE POLICY "property_images_select" ON property_images 
  FOR SELECT 
  USING (
    property_id IN (
      SELECT id FROM properties WHERE status = 'active'
    )
    OR property_id IN (
      SELECT id FROM properties WHERE team_id IN (
        SELECT team_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

-- Aktualizace policy pro reviews - povolit čtení veřejných recenzí
DROP POLICY IF EXISTS "reviews_select" ON reviews;
CREATE POLICY "reviews_select" ON reviews 
  FOR SELECT 
  USING (
    is_public = true 
    OR consultant_id = auth.uid()
  );
