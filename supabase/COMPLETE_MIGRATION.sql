-- ============================================================================
-- KOMPLETNÍ MIGRACE PRO NEMOVIZE
-- Spusť tento soubor CELÝ najednou v Supabase SQL Editoru
-- ============================================================================

-- Nejdřív smažeme všechny existující views a triggery, které by mohly způsobovat konflikty
DROP VIEW IF EXISTS broker_stats_complete CASCADE;
DROP VIEW IF EXISTS sold_properties_public CASCADE;
DROP VIEW IF EXISTS active_properties_public CASCADE;
DROP VIEW IF EXISTS consultant_stats CASCADE;
DROP VIEW IF EXISTS broker_stats CASCADE;

-- Smazání triggerů, které by mohly odkazovat na neexistující sloupce
DROP TRIGGER IF EXISTS trigger_calculate_property_metrics ON properties;
DROP TRIGGER IF EXISTS trigger_update_broker_stats ON properties;
DROP TRIGGER IF EXISTS trigger_update_broker_rating ON reviews;

-- Smazání funkcí
DROP FUNCTION IF EXISTS calculate_property_metrics() CASCADE;
DROP FUNCTION IF EXISTS update_broker_stats() CASCADE;
DROP FUNCTION IF EXISTS update_broker_rating() CASCADE;

-- ============================================================================
-- ČÁST 1: REALITNÍ KANCELÁŘE A MAKLÉŘI (z migrace 003)
-- ============================================================================

CREATE TABLE IF NOT EXISTS real_estate_agencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  legal_name text,
  ico text,
  dic text,
  logo_url text,
  cover_image_url text,
  description text,
  website text,
  email text,
  phone text,
  street text,
  city text,
  zip text,
  region text,
  country text DEFAULT 'CZ',
  facebook_url text,
  instagram_url text,
  linkedin_url text,
  total_brokers integer DEFAULT 0,
  total_properties integer DEFAULT 0,
  total_sold integer DEFAULT 0,
  avg_rating numeric,
  total_reviews integer DEFAULT 0,
  is_verified boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_agencies_active ON real_estate_agencies(is_active, is_verified);
CREATE INDEX IF NOT EXISTS idx_agencies_city ON real_estate_agencies(city);

CREATE TABLE IF NOT EXISTS brokers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id uuid REFERENCES real_estate_agencies(id) ON DELETE SET NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  full_name text GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
  title text,
  email text NOT NULL,
  phone text,
  mobile text,
  avatar_url text,
  cover_image_url text,
  bio text,
  motto text,
  specialization text[],
  languages text[],
  license_number text,
  license_valid_until date,
  certifications text[],
  services text[],
  service_areas text[],
  working_hours jsonb,
  total_properties_active integer DEFAULT 0,
  total_properties_sold integer DEFAULT 0,
  total_sales_volume numeric DEFAULT 0,
  avg_sale_price numeric DEFAULT 0,
  avg_days_to_sell numeric DEFAULT 0,
  avg_rating numeric,
  total_reviews integer DEFAULT 0,
  years_of_experience integer,
  facebook_url text,
  instagram_url text,
  linkedin_url text,
  is_employee boolean DEFAULT true,
  is_verified boolean DEFAULT false,
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  joined_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_brokers_agency ON brokers(agency_id);
CREATE INDEX IF NOT EXISTS idx_brokers_active ON brokers(is_active, is_verified);
CREATE INDEX IF NOT EXISTS idx_brokers_rating ON brokers(avg_rating DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_brokers_name ON brokers(last_name, first_name);
CREATE UNIQUE INDEX IF NOT EXISTS idx_brokers_email ON brokers(email);

-- ============================================================================
-- ČÁST 2: ROZŠÍŘENÍ PROPERTIES
-- ============================================================================

ALTER TABLE properties ADD COLUMN IF NOT EXISTS broker_id uuid;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS agency_id uuid;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS listing_type text DEFAULT 'sale' CHECK (listing_type IN ('sale', 'rent'));
ALTER TABLE properties ADD COLUMN IF NOT EXISTS rent_price numeric;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS rent_deposit numeric;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS rent_fees numeric;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS is_exclusive boolean DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS property_subtype text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS building_type text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS year_built integer;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS year_reconstructed integer;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS balcony boolean DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS terrace boolean DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS loggia boolean DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS cellar boolean DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS parking text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS parking_count integer DEFAULT 0;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS elevator boolean DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS barrier_free boolean DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS furnished text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS heating text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS water text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS sewage text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS electricity boolean DEFAULT true;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS gas boolean DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS district text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS cadastral_area text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS land_registry_number text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS price_note text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS commission numeric;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS commission_note text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS sold_price numeric;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS sold_at timestamptz;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS days_on_market integer;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS is_public_sale boolean DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS price_per_sqm numeric;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS seo_title text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS seo_description text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS video_url text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS virtual_tour_url text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS views_count integer DEFAULT 0;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS favorites_count integer DEFAULT 0;

-- Indexy na properties (musí být před foreign keys)
CREATE INDEX IF NOT EXISTS idx_properties_broker ON properties(broker_id);
CREATE INDEX IF NOT EXISTS idx_properties_agency ON properties(agency_id);
CREATE INDEX IF NOT EXISTS idx_properties_listing_type ON properties(listing_type, status);
CREATE INDEX IF NOT EXISTS idx_properties_city_type ON properties(city, property_type, listing_type);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_properties_sold_public ON properties(status, is_public_sale, sold_at DESC) 
  WHERE status = 'sold' AND is_public_sale = true;

-- ============================================================================
-- ČÁST 3: ROZŠÍŘENÍ REVIEWS
-- ============================================================================

-- Změna consultant_id na nullable (recenze mohou být i pro brokery/agentury)
ALTER TABLE reviews ALTER COLUMN consultant_id DROP NOT NULL;

ALTER TABLE reviews ADD COLUMN IF NOT EXISTS broker_id uuid;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS agency_id uuid;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS transaction_type text;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS rating_communication integer CHECK (rating_communication >= 1 AND rating_communication <= 5);
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS rating_professionalism integer CHECK (rating_professionalism >= 1 AND rating_professionalism <= 5);
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS rating_speed integer CHECK (rating_speed >= 1 AND rating_speed <= 5);
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS rating_price integer CHECK (rating_price >= 1 AND rating_price <= 5);
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS broker_response text;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS responded_at timestamptz;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS helpful_count integer DEFAULT 0;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS source text DEFAULT 'platform';

-- Indexy pro reviews
CREATE INDEX IF NOT EXISTS idx_reviews_broker ON reviews(broker_id, is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_reviews_agency ON reviews(agency_id, is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_reviews_verified ON reviews(is_verified, is_public) WHERE is_verified = true AND is_public = true;

-- ============================================================================
-- ČÁST 3B: FOREIGN KEY CONSTRAINTS (až po vytvoření všech sloupců a indexů)
-- ============================================================================

-- Foreign keys pro properties
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_properties_broker') THEN
    ALTER TABLE properties ADD CONSTRAINT fk_properties_broker 
      FOREIGN KEY (broker_id) REFERENCES brokers(id) ON DELETE SET NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_properties_agency') THEN
    ALTER TABLE properties ADD CONSTRAINT fk_properties_agency 
      FOREIGN KEY (agency_id) REFERENCES real_estate_agencies(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Foreign keys pro reviews
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_reviews_broker') THEN
    ALTER TABLE reviews ADD CONSTRAINT fk_reviews_broker 
      FOREIGN KEY (broker_id) REFERENCES brokers(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_reviews_agency') THEN
    ALTER TABLE reviews ADD CONSTRAINT fk_reviews_agency 
      FOREIGN KEY (agency_id) REFERENCES real_estate_agencies(id) ON DELETE CASCADE;
  END IF;
END $$;

-- ============================================================================
-- ČÁST 4: VIEWS - MUSÍ BÝT AŽ PO PŘIDÁNÍ VŠECH SLOUPCŮ
-- ============================================================================

CREATE OR REPLACE VIEW broker_stats_complete AS
SELECT 
  b.id as broker_id,
  b.first_name,
  b.last_name,
  b.full_name,
  b.title,
  b.email,
  b.phone,
  b.avatar_url,
  b.cover_image_url,
  b.bio,
  b.motto,
  b.specialization,
  b.services,
  b.service_areas,
  b.years_of_experience,
  a.id as agency_id,
  a.name as agency_name,
  a.logo_url as agency_logo,
  COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'active' AND p.listing_type = 'sale') as properties_for_sale,
  COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'active' AND p.listing_type = 'rent') as properties_for_rent,
  COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'sold') as total_sold,
  COALESCE(SUM(p.sold_price) FILTER (WHERE p.status = 'sold'), 0) as total_sales_volume,
  ROUND(AVG(p.sold_price) FILTER (WHERE p.status = 'sold')::numeric, 0) as avg_sale_price,
  ROUND(AVG(p.days_on_market) FILTER (WHERE p.status = 'sold')::numeric, 0) as avg_days_to_sell,
  ROUND(AVG(r.rating)::numeric, 1) as avg_rating,
  COUNT(DISTINCT r.id) FILTER (WHERE r.is_public = true) as total_reviews,
  ROUND(AVG(r.rating_communication)::numeric, 1) as avg_rating_communication,
  ROUND(AVG(r.rating_professionalism)::numeric, 1) as avg_rating_professionalism,
  ROUND(AVG(r.rating_speed)::numeric, 1) as avg_rating_speed,
  b.is_verified,
  b.is_active,
  b.is_featured,
  b.joined_at,
  b.updated_at
FROM brokers b
LEFT JOIN real_estate_agencies a ON b.agency_id = a.id
LEFT JOIN properties p ON p.broker_id = b.id
LEFT JOIN reviews r ON r.broker_id = b.id AND r.is_public = true
WHERE b.is_active = true
GROUP BY b.id, a.id, a.name, a.logo_url;

CREATE OR REPLACE VIEW sold_properties_public AS
SELECT 
  p.id,
  p.title,
  p.property_type,
  p.property_subtype,
  p.listing_type,
  p.city,
  p.district,
  p.address,
  p.floor_area,
  p.lot_area,
  p.rooms,
  p.layout,
  p.price as original_price,
  p.sold_price,
  p.price_per_sqm,
  p.sold_at,
  p.days_on_market,
  p.published_at,
  (SELECT url FROM property_images WHERE property_id = p.id AND is_primary = true LIMIT 1) as primary_image_url,
  b.id as broker_id,
  b.full_name as broker_name,
  b.avatar_url as broker_avatar,
  a.id as agency_id,
  a.name as agency_name,
  a.logo_url as agency_logo
FROM properties p
LEFT JOIN brokers b ON p.broker_id = b.id
LEFT JOIN real_estate_agencies a ON p.agency_id = a.id
WHERE p.status = 'sold' 
  AND p.is_public_sale = true
  AND p.sold_at IS NOT NULL
ORDER BY p.sold_at DESC;

CREATE OR REPLACE VIEW active_properties_public AS
SELECT 
  p.id,
  p.title,
  p.description,
  p.property_type,
  p.property_subtype,
  p.listing_type,
  p.transaction_type,
  p.city,
  p.district,
  p.address,
  p.zip,
  p.lat,
  p.lng,
  p.floor_area,
  p.lot_area,
  p.rooms,
  p.layout,
  p.floor,
  p.total_floors,
  p.price,
  p.rent_price,
  p.price_per_sqm,
  p.is_exclusive,
  p.balcony,
  p.terrace,
  p.parking,
  p.elevator,
  p.furnished,
  p.energy_rating,
  p.year_built,
  p.views_count,
  p.favorites_count,
  p.published_at,
  p.updated_at,
  (SELECT url FROM property_images WHERE property_id = p.id AND is_primary = true LIMIT 1) as primary_image_url,
  (SELECT COUNT(*) FROM property_images WHERE property_id = p.id) as images_count,
  b.id as broker_id,
  b.full_name as broker_name,
  b.avatar_url as broker_avatar,
  b.phone as broker_phone,
  a.id as agency_id,
  a.name as agency_name,
  a.logo_url as agency_logo
FROM properties p
LEFT JOIN brokers b ON p.broker_id = b.id
LEFT JOIN real_estate_agencies a ON p.agency_id = a.id
WHERE p.status = 'active'
ORDER BY p.published_at DESC;

-- ============================================================================
-- ČÁST 6: RLS POLICIES
-- ============================================================================

ALTER TABLE real_estate_agencies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "agencies_select_public" ON real_estate_agencies;
CREATE POLICY "agencies_select_public" ON real_estate_agencies FOR SELECT USING (is_active = true);

ALTER TABLE brokers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "brokers_select_public" ON brokers;
CREATE POLICY "brokers_select_public" ON brokers FOR SELECT USING (is_active = true AND is_verified = true);

-- ============================================================================
-- ČÁST 6: TRIGGERY PRO AUTOMATICKOU AKTUALIZACI STATISTIK
-- ============================================================================

-- Trigger pro výpočet metrik nemovitosti
CREATE OR REPLACE FUNCTION calculate_property_metrics()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'sold' AND NEW.sold_at IS NOT NULL AND NEW.published_at IS NOT NULL THEN
    NEW.days_on_market = EXTRACT(DAY FROM (NEW.sold_at - NEW.published_at))::integer;
  END IF;
  
  IF NEW.floor_area > 0 THEN
    IF NEW.sold_price IS NOT NULL THEN
      NEW.price_per_sqm = ROUND((NEW.sold_price / NEW.floor_area)::numeric, 0);
    ELSIF NEW.price IS NOT NULL THEN
      NEW.price_per_sqm = ROUND((NEW.price / NEW.floor_area)::numeric, 0);
    END IF;
  END IF;
  
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_calculate_property_metrics ON properties;
CREATE TRIGGER trigger_calculate_property_metrics
  BEFORE INSERT OR UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION calculate_property_metrics();

-- Trigger pro aktualizaci statistik makléře
CREATE OR REPLACE FUNCTION update_broker_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.broker_id IS NOT NULL THEN
    UPDATE brokers
    SET 
      total_properties_active = (
        SELECT COUNT(*) FROM properties 
        WHERE broker_id = NEW.broker_id AND status = 'active'
      ),
      total_properties_sold = (
        SELECT COUNT(*) FROM properties 
        WHERE broker_id = NEW.broker_id AND status = 'sold'
      ),
      total_sales_volume = (
        SELECT COALESCE(SUM(sold_price), 0) FROM properties 
        WHERE broker_id = NEW.broker_id AND status = 'sold'
      ),
      avg_sale_price = (
        SELECT COALESCE(AVG(sold_price), 0) FROM properties 
        WHERE broker_id = NEW.broker_id AND status = 'sold'
      ),
      avg_days_to_sell = (
        SELECT COALESCE(AVG(days_on_market), 0) FROM properties 
        WHERE broker_id = NEW.broker_id AND status = 'sold'
      ),
      updated_at = now()
    WHERE id = NEW.broker_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_broker_stats ON properties;
CREATE TRIGGER trigger_update_broker_stats
  AFTER INSERT OR UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_broker_stats();

-- Trigger pro aktualizaci ratingu makléře
CREATE OR REPLACE FUNCTION update_broker_rating()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.broker_id IS NOT NULL THEN
    UPDATE brokers
    SET 
      avg_rating = (
        SELECT COALESCE(AVG(rating), 0) FROM reviews 
        WHERE broker_id = NEW.broker_id AND is_public = true
      ),
      total_reviews = (
        SELECT COUNT(*) FROM reviews 
        WHERE broker_id = NEW.broker_id AND is_public = true
      ),
      updated_at = now()
    WHERE id = NEW.broker_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_broker_rating ON reviews;
CREATE TRIGGER trigger_update_broker_rating
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW
  WHEN (NEW.broker_id IS NOT NULL)
  EXECUTE FUNCTION update_broker_rating();

-- ============================================================================
-- HOTOVO!
-- ============================================================================
