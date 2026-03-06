-- ============================================================================
-- OPRAVA RLS POLICIES PRO VEŘEJNÝ PŘÍSTUP (V2 - bez rekurze)
-- ============================================================================

-- Povolit RLS na nových tabulkách
ALTER TABLE real_estate_agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE brokers ENABLE ROW LEVEL SECURITY;

-- Veřejné čtení pro aktivní realitní kanceláře
DROP POLICY IF EXISTS "agencies_public_select" ON real_estate_agencies;
CREATE POLICY "agencies_public_select" ON real_estate_agencies 
  FOR SELECT 
  USING (is_active = true);

-- Veřejné čtení pro aktivní makléře
DROP POLICY IF EXISTS "brokers_public_select" ON brokers;
CREATE POLICY "brokers_public_select" ON brokers 
  FOR SELECT 
  USING (is_active = true);

-- Aktualizace policy pro properties - povolit čtení aktivních nemovitostí VŠEM
DROP POLICY IF EXISTS "properties_select" ON properties;
CREATE POLICY "properties_select" ON properties 
  FOR SELECT 
  USING (status = 'active');

-- Přidat druhou policy pro autentizované uživatele (vlastní team)
CREATE POLICY "properties_select_own_team" ON properties 
  FOR SELECT 
  USING (
    auth.uid() IS NOT NULL 
    AND team_id IN (
      SELECT team_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Aktualizace policy pro property_images - povolit čtení pro aktivní nemovitosti
DROP POLICY IF EXISTS "property_images_select" ON property_images;
CREATE POLICY "property_images_select" ON property_images 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM properties 
      WHERE properties.id = property_images.property_id 
      AND properties.status = 'active'
    )
  );

-- Přidat druhou policy pro autentizované uživatele
CREATE POLICY "property_images_select_own_team" ON property_images 
  FOR SELECT 
  USING (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM properties 
      WHERE properties.id = property_images.property_id 
      AND properties.team_id IN (
        SELECT team_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

-- Aktualizace policy pro reviews - povolit čtení veřejných recenzí VŠEM
DROP POLICY IF EXISTS "reviews_select" ON reviews;
CREATE POLICY "reviews_select" ON reviews 
  FOR SELECT 
  USING (is_public = true);

-- Přidat druhou policy pro vlastní recenze
CREATE POLICY "reviews_select_own" ON reviews 
  FOR SELECT 
  USING (
    auth.uid() IS NOT NULL 
    AND consultant_id = auth.uid()
  );
