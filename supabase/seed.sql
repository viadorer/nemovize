-- Seed data pro Nemovize - ukázková data podle Sreality/Reas struktury

-- ============================================================================
-- 0. TESTOVACÍ TEAM (potřebný pro properties)
-- ============================================================================

INSERT INTO teams (id, name, slug) VALUES
('00000000-0000-0000-0000-000000000001', 'Demo Team', 'demo-team');

-- ============================================================================
-- 1. REALITNÍ KANCELÁŘE
-- ============================================================================

INSERT INTO real_estate_agencies (id, name, legal_name, ico, logo_url, description, email, phone, city, region, is_verified, is_active) VALUES
('11111111-1111-1111-1111-111111111111', 'PTF reality', 'PTF reality s.r.o.', '12345678', '/agencies/ptf-logo.png', 'Profesionální realitní služby v Plzni a okolí od roku 1995', 'info@ptfreality.cz', '+420 777 123 456', 'Plzeň', 'Plzeňský kraj', true, true),
('22222222-2222-2222-2222-222222222222', 'NEXT REALITY', 'NEXT REALITY s.r.o.', '87654321', '/agencies/next-logo.png', 'Moderní přístup k realitám', 'info@nextreality.cz', '+420 777 654 321', 'Praha', 'Hlavní město Praha', true, true),
('33333333-3333-3333-3333-333333333333', 'Reality Vysočina', 'Reality Vysočina s.r.o.', '11223344', '/agencies/vysocina-logo.png', 'Váš partner pro nemovitosti na Vysočině', 'info@realityvysocina.cz', '+420 777 999 888', 'Jihlava', 'Kraj Vysočina', true, true);

-- ============================================================================
-- 2. MAKLÉŘI
-- ============================================================================

INSERT INTO brokers (
  id, agency_id, first_name, last_name, title, email, phone, mobile,
  avatar_url, bio, motto, specialization, languages, services, service_areas,
  years_of_experience, is_verified, is_active, is_featured
) VALUES
(
  '01111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  'David', 'Choc', NULL,
  'david.choc@ptfreality.cz', '+420 777 123 456', '+420 777 123 456',
  '/brokers/david-choc.jpg',
  'Realitní agent s dlouholetými zkušenostmi v oblasti prodeje bytů a domů v Plzni a okolí.',
  'Realitní agent ve vašich službách. Od 1995. 5 000+ misí. Důvěra. Výsledek. Vaše nemovitost? Moje další mise.',
  ARRAY['byty', 'domy', 'komerční'],
  ARRAY['čeština', 'angličtina'],
  ARRAY['prodej', 'nákup', 'odhad ceny'],
  ARRAY['Plzeň', 'Plzeňský kraj'],
  29, true, true, true
),
(
  '02222222-2222-2222-2222-222222222222',
  '22222222-2222-2222-2222-222222222222',
  'Jan', 'Kubeš', NULL,
  'jan.kubes@nextreality.cz', '+420 777 234 567', '+420 777 234 567',
  '/brokers/jan-kubes.jpg',
  'Specialista na prodej luxusních nemovitostí v Praze.',
  'Váš průvodce světem prémiových nemovitostí.',
  ARRAY['byty', 'domy', 'luxusní nemovitosti'],
  ARRAY['čeština', 'angličtina', 'němčina'],
  ARRAY['prodej', 'nákup'],
  ARRAY['Praha', 'Středočeský kraj'],
  15, true, true, true
),
(
  '03333333-3333-3333-3333-333333333333',
  '33333333-3333-3333-3333-333333333333',
  'Petra', 'Janštová', 'Bc.',
  'petra.janstova@realityvysocina.cz', '+420 777 345 678', '+420 777 345 678',
  '/brokers/petra-janstova.jpg',
  'Realitní makléřka s osobním přístupem a důrazem na spokojenost klientů.',
  'S úsměvem k vašemu novému domovu.',
  ARRAY['byty', 'domy', 'pozemky'],
  ARRAY['čeština'],
  ARRAY['prodej', 'nákup', 'pronájem', 'odhad ceny'],
  ARRAY['Jihlava', 'Kraj Vysočina'],
  12, true, true, false
);

-- ============================================================================
-- 3. NEMOVITOSTI NA PRODEJ
-- ============================================================================

INSERT INTO properties (
  id, team_id, broker_id, agency_id, title, description,
  property_type, property_subtype, listing_type, transaction_type,
  price, city, district, address, zip,
  floor_area, rooms, layout, floor, total_floors,
  balcony, elevator, parking, furnished, energy_rating,
  year_built, status, published_at
) VALUES
(
  '10111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000001',
  '01111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  'Byt 3+1, 88 m²',
  'Prostorný byt v klidné lokalitě s výbornou dostupností do centra. Byt je po kompletní rekonstrukci.',
  'byt', 'panel', 'sale', 'prodej',
  11900000, 'Praha', 'Hlubočepy', 'Kříženeckého náměstí', '15200',
  88, 4, '3+1', 3, 8,
  true, true, 'garážové stání', 'částečně', 'C',
  1985, 'active', now()
),
(
  '10222222-2222-2222-2222-222222222222',
  '00000000-0000-0000-0000-000000000001',
  '01111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  'Dům, 763 m²',
  'Rodinný dům s velkým pozemkem, ideální pro rodinu s dětmi.',
  'dům', 'rodinný dům', 'sale', 'prodej',
  8500000, 'Varnsdorf', NULL, 'Bratislavská', '40747',
  763, 6, '5+1', NULL, 2,
  false, false, 'garáž', 'ne', 'D',
  1995, 'active', now()
);

-- ============================================================================
-- 4. PRODANÉ NEMOVITOSTI
-- ============================================================================

INSERT INTO properties (
  id, team_id, broker_id, agency_id, title, description,
  property_type, property_subtype, listing_type, transaction_type,
  price, sold_price, city, district, address, zip,
  floor_area, rooms, layout, floor, total_floors,
  balcony, elevator, parking, furnished, energy_rating,
  year_built, status, published_at, sold_at, is_public_sale
) VALUES
(
  '10333333-3333-3333-3333-333333333333',
  '00000000-0000-0000-0000-000000000001',
  '01111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  'Byt 1+kk, 35 m²',
  'Moderní byt v centru města, ideální pro mladé lidi nebo investici.',
  'byt', 'novostavba', 'sale', 'prodej',
  2000000, 2095000, 'Plzeň', 'Východní Předměstí', 'Barrandova 609/20', '30100',
  35, 1, '1+kk', 2, 5,
  true, true, 'ne', 'ano', 'B',
  2020, 'sold', now() - interval '3 months', now() - interval '1 month', true
),
(
  '10444444-4444-4444-4444-444444444444',
  '00000000-0000-0000-0000-000000000001',
  '01111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  'Byt 2+1, 55 m²',
  'Cihlový byt po rekonstrukci v klidné lokalitě.',
  'byt', 'cihla', 'sale', 'prodej',
  2900000, 3050000, 'Plzeň', 'Východní Předměstí', 'Táborská 1989/32', '30100',
  55, 3, '2+1', 4, 8,
  true, true, 'ne', 'částečně', 'C',
  1975, 'sold', now() - interval '4 months', now() - interval '2 months', true
),
(
  '10555555-5555-5555-5555-555555555555',
  '00000000-0000-0000-0000-000000000001',
  '01111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  'Byt 3+1, 65 m²',
  'Prostorný byt s lodžií a výhledem do zeleně.',
  'byt', 'panel', 'sale', 'prodej',
  3800000, 3970000, 'Plzeň', 'Jižní Předměstí', 'Družstevní 2331/19', '30100',
  65, 4, '3+1', 6, 12,
  false, true, 'ne', 'ne', 'D',
  1980, 'sold', now() - interval '5 months', now() - interval '3 months', true
);

-- ============================================================================
-- 5. RECENZE
-- ============================================================================

INSERT INTO reviews (
  broker_id, property_id, rating, text,
  rating_communication, rating_professionalism, rating_speed,
  is_verified, is_public, transaction_type, created_at
) VALUES
(
  '01111111-1111-1111-1111-111111111111',
  '10333333-3333-3333-3333-333333333333',
  5, 'Profesionální přístup, rychlé jednání a skvělá komunikace. Pan Choc nám pomohl prodat byt za výbornou cenu. Doporučuji!',
  5, 5, 5, true, true, 'prodej', now() - interval '1 month'
),
(
  '01111111-1111-1111-1111-111111111111',
  '10444444-4444-4444-4444-444444444444',
  5, 'Výborná spolupráce, vše proběhlo hladce a rychle. Děkujeme za profesionální přístup.',
  5, 5, 5, true, true, 'prodej', now() - interval '2 months'
),
(
  '01111111-1111-1111-1111-111111111111',
  '10555555-5555-5555-5555-555555555555',
  4, 'Solidní makléř, komunikace byla dobrá. Prodej trval trochu déle, ale nakonec jsme byli spokojeni.',
  4, 5, 4, true, true, 'prodej', now() - interval '3 months'
),
(
  '01111111-1111-1111-1111-111111111111',
  NULL,
  5, 'Pan Choc je skvělý realitní makléř. Pomohl nám najít vysněný byt a celý proces byl bezproblémový.',
  5, 5, 5, true, true, 'nákup', now() - interval '4 months'
),
(
  '01111111-1111-1111-1111-111111111111',
  NULL,
  5, 'Profesionální jednání, výborná znalost trhu. Doporučuji všem, kdo hledají spolehlivého makléře.',
  5, 5, 5, true, true, 'prodej', now() - interval '5 months'
);

-- Přidáme více recenzí pro realistické hodnocení 4.4
INSERT INTO reviews (broker_id, rating, text, rating_communication, rating_professionalism, rating_speed, is_verified, is_public, transaction_type, created_at)
SELECT 
  '01111111-1111-1111-1111-111111111111',
  (ARRAY[4, 4, 5, 5, 5, 4, 5, 4, 5, 5])[(gs.i - 6) % 10 + 1], -- rating
  'Spokojenost s poskytnutými službami.', -- text
  (ARRAY[4, 4, 5, 5, 5, 4, 5, 4, 5, 5])[(gs.i - 6) % 10 + 1], -- rating_communication
  (ARRAY[5, 4, 5, 5, 4, 5, 5, 4, 5, 5])[(gs.i - 6) % 10 + 1], -- rating_professionalism
  (ARRAY[4, 5, 5, 4, 5, 4, 5, 5, 4, 5])[(gs.i - 6) % 10 + 1], -- rating_speed
  true, -- is_verified
  true, -- is_public
  'prodej', -- transaction_type
  now() - (gs.i || ' months')::interval -- created_at
FROM generate_series(6, 15) AS gs(i);

-- ============================================================================
-- 6. OBRÁZKY NEMOVITOSTÍ
-- ============================================================================

INSERT INTO property_images (property_id, url, position, is_primary) VALUES
('10111111-1111-1111-1111-111111111111', '/properties/p1-1.jpg', 0, true),
('10111111-1111-1111-1111-111111111111', '/properties/p1-2.jpg', 1, false),
('10111111-1111-1111-1111-111111111111', '/properties/p1-3.jpg', 2, false),
('10222222-2222-2222-2222-222222222222', '/properties/p2-1.jpg', 0, true),
('10222222-2222-2222-2222-222222222222', '/properties/p2-2.jpg', 1, false),
('10333333-3333-3333-3333-333333333333', '/properties/p3-1.jpg', 0, true),
('10444444-4444-4444-4444-444444444444', '/properties/p4-1.jpg', 0, true),
('10555555-5555-5555-5555-555555555555', '/properties/p5-1.jpg', 0, true);

-- ============================================================================
-- KONEC SEED
-- ============================================================================
