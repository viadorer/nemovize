-- ============================================================================
-- OPRAVA RLS POLICIES PRO VEŘEJNÝ PŘÍSTUP (V3 - bez rekurze, jen veřejný přístup)
-- ============================================================================

-- Smazat VŠECHNY existující policies pro properties
DROP POLICY IF EXISTS "properties_select" ON properties;
DROP POLICY IF EXISTS "properties_select_own_team" ON properties;
DROP POLICY IF EXISTS "properties_insert" ON properties;
DROP POLICY IF EXISTS "properties_update" ON properties;
DROP POLICY IF EXISTS "properties_delete" ON properties;

-- Smazat VŠECHNY existující policies pro property_images
DROP POLICY IF EXISTS "property_images_select" ON property_images;
DROP POLICY IF EXISTS "property_images_select_own_team" ON property_images;
DROP POLICY IF EXISTS "property_images_insert" ON property_images;
DROP POLICY IF EXISTS "property_images_delete" ON property_images;

-- Smazat VŠECHNY existující policies pro reviews
DROP POLICY IF EXISTS "reviews_select" ON reviews;
DROP POLICY IF EXISTS "reviews_select_own" ON reviews;
DROP POLICY IF EXISTS "reviews_insert" ON reviews;

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

-- JEDNODUCHÁ policy pro properties - povolit čtení aktivních nemovitostí VŠEM
CREATE POLICY "properties_public_select" ON properties 
  FOR SELECT 
  USING (status = 'active');

-- JEDNODUCHÁ policy pro property_images - povolit čtení VŠEM
CREATE POLICY "property_images_public_select" ON property_images 
  FOR SELECT 
  USING (true);

-- JEDNODUCHÁ policy pro reviews - povolit čtení veřejných recenzí VŠEM
CREATE POLICY "reviews_public_select" ON reviews 
  FOR SELECT 
  USING (is_public = true);

-- Povolit vkládání recenzí všem
CREATE POLICY "reviews_public_insert" ON reviews 
  FOR INSERT 
  WITH CHECK (true);
