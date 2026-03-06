import { createClient } from '@/lib/supabase/server'

export type UserRole = 'superadmin' | 'admin' | 'broker' | 'user'

export interface UserPermissions {
  role: UserRole
  canManageProperties: boolean
  canManageBrokers: boolean
  canManageAgencies: boolean
  canManageUsers: boolean
  canViewAnalytics: boolean
  isActive: boolean
}

export async function getCurrentUser() {
  const supabase = await createClient()
  
  const { data: { user: authUser } } = await supabase.auth.getUser()
  
  if (!authUser) {
    return null
  }

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single()

  return user
}

export async function getUserPermissions(): Promise<UserPermissions | null> {
  const user = await getCurrentUser()
  
  if (!user) {
    return null
  }

  return {
    role: user.role as UserRole,
    canManageProperties: user.can_manage_properties,
    canManageBrokers: user.can_manage_brokers,
    canManageAgencies: user.can_manage_agencies,
    canManageUsers: user.can_manage_users,
    canViewAnalytics: user.can_view_analytics,
    isActive: user.is_active,
  }
}

export async function hasRole(requiredRole: UserRole): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.role === requiredRole && user?.is_active === true
}

export async function hasAnyRole(requiredRoles: UserRole[]): Promise<boolean> {
  const user = await getCurrentUser()
  return requiredRoles.includes(user?.role as UserRole) && user?.is_active === true
}

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return ['admin', 'superadmin'].includes(user?.role) && user?.is_active === true
}

export async function isSuperAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.role === 'superadmin' && user?.is_active === true
}

export async function canManageProperties(): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user || !user.is_active) return false
  return user.can_manage_properties || ['admin', 'superadmin'].includes(user.role)
}

export async function canManageBrokers(): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user || !user.is_active) return false
  return user.can_manage_brokers || ['admin', 'superadmin'].includes(user.role)
}

export async function canManageAgencies(): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user || !user.is_active) return false
  return user.can_manage_agencies || ['admin', 'superadmin'].includes(user.role)
}

export async function canManageUsers(): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user || !user.is_active) return false
  return user.can_manage_users || user.role === 'superadmin'
}

export async function canViewAnalytics(): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user || !user.is_active) return false
  return user.can_view_analytics || ['admin', 'superadmin'].includes(user.role)
}
