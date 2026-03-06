-- ============================================================================
-- VYTVOŘENÍ ADMIN UŽIVATELE
-- Email: admin@ptf.cz
-- Heslo: admin123
-- ============================================================================

-- KROK 1: Vytvoř auth uživatele v Supabase Dashboard
-- --------------------------------------------------------
-- 1. Jdi do Supabase Dashboard → Authentication → Users
-- 2. Klikni "Add user" → "Create new user"
-- 3. Email: admin@ptf.cz
-- 4. Password: admin123
-- 5. Auto Confirm User: ANO (zaškrtni!)
-- 6. Klikni "Create user"

-- KROK 2: Spusť tento SQL pro vytvoření admin brokera
-- --------------------------------------------------------
-- Tento skript vytvoří záznam v brokers tabulce propojený s auth uživatelem

INSERT INTO brokers (
  user_id,
  first_name,
  last_name,
  email,
  phone,
  bio,
  is_verified,
  is_active,
  is_featured,
  years_of_experience
)
SELECT 
  id,
  'Admin',
  'PTF',
  'admin@ptf.cz',
  '+420 123 456 789',
  'Administrátor platformy Nemovize',
  true,
  true,
  true,
  10
FROM auth.users
WHERE email = 'admin@ptf.cz'
ON CONFLICT DO NOTHING;

-- Ověření, že admin byl vytvořen
SELECT 
  b.id,
  b.full_name,
  b.email,
  b.is_verified,
  b.is_active,
  au.email as auth_email,
  au.confirmed_at
FROM brokers b
JOIN auth.users au ON b.user_id = au.id
WHERE b.email = 'admin@ptf.cz';
