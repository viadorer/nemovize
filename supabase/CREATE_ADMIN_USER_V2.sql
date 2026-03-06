-- ============================================================================
-- VYTVOŘENÍ ADMIN UŽIVATELE (V2 - S USERS TABULKOU)
-- Email: admin@ptf.cz
-- Heslo: admin123
-- Role: superadmin
-- ============================================================================

-- DŮLEŽITÉ: Nejdřív spusť migraci 004_create_users_and_rbac.sql!

-- KROK 1: Vytvoř auth uživatele v Supabase Dashboard
-- --------------------------------------------------------
-- 1. Jdi do Supabase Dashboard → Authentication → Users
-- 2. Klikni "Add user" → "Create new user"
-- 3. Email: admin@ptf.cz
-- 4. Password: admin123
-- 5. Auto Confirm User: ANO (zaškrtni!)
-- 6. Klikni "Create user"

-- KROK 2: Spusť tento SQL pro nastavení superadmin role
-- --------------------------------------------------------

-- Aktualizace users tabulky - nastavení superadmin role a všech oprávnění
UPDATE users
SET 
  role = 'superadmin',
  full_name = 'Super Admin PTF',
  can_manage_properties = true,
  can_manage_brokers = true,
  can_manage_agencies = true,
  can_manage_users = true,
  can_view_analytics = true,
  is_active = true,
  updated_at = now()
WHERE email = 'admin@ptf.cz';

-- KROK 3: Vytvoření admin brokera (volitelné - pokud chceš admin i jako broker)
-- --------------------------------------------------------

-- Nejdřív zkontroluj, jestli broker už neexistuje
DO $$
DECLARE
  v_user_id uuid;
  v_broker_exists boolean;
BEGIN
  -- Získej user_id
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'admin@ptf.cz';
  
  -- Zkontroluj, jestli broker existuje
  SELECT EXISTS(SELECT 1 FROM brokers WHERE user_id = v_user_id) INTO v_broker_exists;
  
  IF v_broker_exists THEN
    -- Aktualizuj existujícího brokera
    UPDATE brokers
    SET 
      role = 'superadmin',
      is_verified = true,
      is_active = true,
      is_featured = true,
      updated_at = now()
    WHERE user_id = v_user_id;
  ELSE
    -- Vytvoř nového brokera
    INSERT INTO brokers (
      user_id,
      first_name,
      last_name,
      email,
      phone,
      bio,
      role,
      is_verified,
      is_active,
      is_featured,
      years_of_experience
    ) VALUES (
      v_user_id,
      'Admin',
      'PTF',
      'admin@ptf.cz',
      '+420 123 456 789',
      'Administrátor platformy Nemovize',
      'superadmin',
      true,
      true,
      true,
      10
    );
  END IF;
END $$;

-- KROK 4: Ověření, že admin byl správně vytvořen
-- --------------------------------------------------------

SELECT 
  u.id,
  u.email,
  u.full_name,
  u.role,
  u.can_manage_properties,
  u.can_manage_brokers,
  u.can_manage_agencies,
  u.can_manage_users,
  u.can_view_analytics,
  u.is_active,
  au.email_confirmed_at,
  au.last_sign_in_at,
  b.id as broker_id,
  b.full_name as broker_name
FROM users u
JOIN auth.users au ON u.id = au.id
LEFT JOIN brokers b ON b.user_id = u.id
WHERE u.email = 'admin@ptf.cz';

-- Výsledek by měl ukázat:
-- ✅ role = 'superadmin'
-- ✅ všechny can_* permissions = true
-- ✅ is_active = true
-- ✅ email_confirmed_at IS NOT NULL
-- ✅ broker_id IS NOT NULL (pokud jsi spustil KROK 3)
