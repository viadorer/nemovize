-- ============================================================================
-- SMAZÁNÍ VŠECH TABULEK A OBJEKTŮ
-- POZOR: Toto smaže všechna data!
-- ============================================================================

-- Nejdřív smažeme všechny views
DROP VIEW IF EXISTS broker_stats_complete CASCADE;
DROP VIEW IF EXISTS sold_properties_public CASCADE;
DROP VIEW IF EXISTS active_properties_public CASCADE;
DROP VIEW IF EXISTS consultant_stats CASCADE;
DROP VIEW IF EXISTS broker_stats CASCADE;

-- Smažeme triggery
DROP TRIGGER IF EXISTS trigger_calculate_property_metrics ON properties;
DROP TRIGGER IF EXISTS trigger_update_broker_stats ON properties;
DROP TRIGGER IF EXISTS trigger_update_broker_rating ON reviews;

-- Smažeme funkce
DROP FUNCTION IF EXISTS calculate_property_metrics() CASCADE;
DROP FUNCTION IF EXISTS update_broker_stats() CASCADE;
DROP FUNCTION IF EXISTS update_broker_rating() CASCADE;

-- Smažeme tabulky v opačném pořadí závislostí
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS inquiries CASCADE;
DROP TABLE IF EXISTS valuations CASCADE;
DROP TABLE IF EXISTS property_images CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS brokers CASCADE;
DROP TABLE IF EXISTS real_estate_agencies CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS teams CASCADE;

-- ============================================================================
-- HOTOVO - všechny tabulky smazány
-- ============================================================================
