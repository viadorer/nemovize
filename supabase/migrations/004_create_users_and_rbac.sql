-- ============================================================================
-- MIGRACE 004: USERS TABULKA A ROLE-BASED ACCESS CONTROL (RBAC)
-- ============================================================================
-- Tato migrace vytváří kompletní strukturu pro správu uživatelů a rolí
-- pro budoucí admin panel

-- ============================================================================
-- ČÁST 1: ENUM TYPY PRO ROLE
-- ============================================================================

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('superadmin', 'admin', 'broker', 'user');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- ČÁST 2: USERS TABULKA
-- ============================================================================
-- Tabulka users propojuje auth.users s aplikační logikou a rolemi

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  role user_role DEFAULT 'user' NOT NULL,
  
  -- Metadata
  phone text,
  bio text,
  
  -- Permissions flags
  can_manage_properties boolean DEFAULT false,
  can_manage_brokers boolean DEFAULT false,
  can_manage_agencies boolean DEFAULT false,
  can_manage_users boolean DEFAULT false,
  can_view_analytics boolean DEFAULT false,
  
  -- Status
  is_active boolean DEFAULT true,
  is_email_verified boolean DEFAULT false,
  last_login_at timestamptz,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexy pro rychlé vyhledávání
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

-- ============================================================================
-- ČÁST 3: TRIGGER PRO AUTOMATICKÉ VYTVOŘENÍ USER ZÁZNAMU
-- ============================================================================
-- Když se vytvoří nový auth.users, automaticky se vytvoří i záznam v users

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, full_name, role, is_email_verified)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'user',
    NEW.email_confirmed_at IS NOT NULL
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    is_email_verified = EXCLUDED.is_email_verified,
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- ČÁST 4: PROPOJENÍ BROKERS S USERS
-- ============================================================================
-- Přidání role sloupce do brokers tabulky a propojení s users

ALTER TABLE brokers ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'broker';

-- Trigger pro synchronizaci broker -> user role
CREATE OR REPLACE FUNCTION sync_broker_to_user_role()
RETURNS TRIGGER AS $$
BEGIN
  -- Pokud broker má user_id, aktualizuj roli v users tabulce
  IF NEW.user_id IS NOT NULL THEN
    UPDATE users
    SET 
      role = COALESCE(NEW.role, 'broker'),
      can_manage_properties = true,
      updated_at = now()
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_broker_role_change ON brokers;
CREATE TRIGGER on_broker_role_change
  AFTER INSERT OR UPDATE OF role, user_id ON brokers
  FOR EACH ROW
  EXECUTE FUNCTION sync_broker_to_user_role();

-- ============================================================================
-- ČÁST 5: HELPER FUNKCE PRO KONTROLU ROLÍ
-- ============================================================================

-- Funkce pro kontrolu, zda má uživatel danou roli
CREATE OR REPLACE FUNCTION has_role(user_id uuid, required_role user_role)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = user_id AND role = required_role AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Funkce pro kontrolu, zda má uživatel alespoň jednu z rolí
CREATE OR REPLACE FUNCTION has_any_role(user_id uuid, required_roles user_role[])
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = user_id AND role = ANY(required_roles) AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Funkce pro kontrolu, zda je uživatel admin nebo superadmin
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = user_id 
      AND role IN ('admin', 'superadmin') 
      AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Funkce pro kontrolu, zda je uživatel superadmin
CREATE OR REPLACE FUNCTION is_superadmin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = user_id 
      AND role = 'superadmin' 
      AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Funkce pro získání role aktuálního uživatele
CREATE OR REPLACE FUNCTION current_user_role()
RETURNS user_role AS $$
BEGIN
  RETURN (
    SELECT role FROM users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- ČÁST 6: RLS POLICIES PRO USERS TABULKU
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Každý může číst vlastní záznam
DROP POLICY IF EXISTS "Users can view own record" ON users;
CREATE POLICY "Users can view own record"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Každý může aktualizovat vlastní záznam (kromě role a permissions)
DROP POLICY IF EXISTS "Users can update own record" ON users;
CREATE POLICY "Users can update own record"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND role = (SELECT role FROM users WHERE id = auth.uid())
    AND can_manage_properties = (SELECT can_manage_properties FROM users WHERE id = auth.uid())
    AND can_manage_brokers = (SELECT can_manage_brokers FROM users WHERE id = auth.uid())
    AND can_manage_agencies = (SELECT can_manage_agencies FROM users WHERE id = auth.uid())
    AND can_manage_users = (SELECT can_manage_users FROM users WHERE id = auth.uid())
  );

-- Admini mohou číst všechny uživatele
DROP POLICY IF EXISTS "Admins can view all users" ON users;
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() 
        AND role IN ('admin', 'superadmin')
        AND is_active = true
    )
  );

-- Admini mohou upravovat uživatele
DROP POLICY IF EXISTS "Admins can update users" ON users;
CREATE POLICY "Admins can update users"
  ON users FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() 
        AND role IN ('admin', 'superadmin')
        AND is_active = true
    )
  );

-- Pouze superadmin může měnit role a permissions
DROP POLICY IF EXISTS "Superadmins can manage roles" ON users;
CREATE POLICY "Superadmins can manage roles"
  ON users FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() 
        AND role = 'superadmin'
        AND is_active = true
    )
  );

-- ============================================================================
-- ČÁST 7: AKTUALIZACE RLS POLICIES PRO OSTATNÍ TABULKY
-- ============================================================================

-- Properties - admini mohou upravovat všechny nemovitosti
DROP POLICY IF EXISTS "Admins can manage all properties" ON properties;
CREATE POLICY "Admins can manage all properties"
  ON properties FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() 
        AND (role IN ('admin', 'superadmin') OR can_manage_properties = true)
        AND is_active = true
    )
  );

-- Brokers - admini mohou upravovat všechny brokery
DROP POLICY IF EXISTS "Admins can manage all brokers" ON brokers;
CREATE POLICY "Admins can manage all brokers"
  ON brokers FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() 
        AND (role IN ('admin', 'superadmin') OR can_manage_brokers = true)
        AND is_active = true
    )
  );

-- Agencies - admini mohou upravovat všechny agentury
DROP POLICY IF EXISTS "Admins can manage all agencies" ON real_estate_agencies;
CREATE POLICY "Admins can manage all agencies"
  ON real_estate_agencies FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() 
        AND (role IN ('admin', 'superadmin') OR can_manage_agencies = true)
        AND is_active = true
    )
  );

-- ============================================================================
-- ČÁST 8: AUDIT LOG TABULKA (VOLITELNÉ - PRO ADMIN PANEL)
-- ============================================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  action text NOT NULL,
  table_name text,
  record_id uuid,
  old_data jsonb,
  new_data jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

-- RLS pro audit logs - pouze admini mohou číst
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view audit logs" ON audit_logs;
CREATE POLICY "Admins can view audit logs"
  ON audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() 
        AND role IN ('admin', 'superadmin')
        AND is_active = true
    )
  );

-- ============================================================================
-- HOTOVO
-- ============================================================================
-- Migrace dokončena. Nyní máš:
-- ✅ users tabulku s role systémem
-- ✅ RBAC helper funkce
-- ✅ RLS policies pro role-based přístup
-- ✅ Audit log pro admin panel
-- ✅ Automatickou synchronizaci auth.users -> users
-- ✅ Propojení brokers s users rolemi
