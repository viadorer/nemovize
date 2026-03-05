import { createClient } from '@/lib/supabase/server'

export type PropertyFilters = {
  propertyType?: string
  listingType?: 'sale' | 'rent'
  city?: string
  minPrice?: number
  maxPrice?: number
  minArea?: number
  maxArea?: number
  rooms?: number
  status?: 'active' | 'reserved' | 'sold'
}

export type PropertySortBy = 'price_asc' | 'price_desc' | 'area_asc' | 'area_desc' | 'newest' | 'oldest'

export async function getProperties(
  filters: PropertyFilters = {},
  sortBy: PropertySortBy = 'newest',
  page: number = 1,
  pageSize: number = 12
) {
  const supabase = await createClient()
  
  let query = supabase
    .from('properties')
    .select(`
      *,
      broker:brokers(
        id,
        first_name,
        last_name,
        full_name,
        avatar_url,
        phone,
        email
      ),
      agency:real_estate_agencies(
        id,
        name,
        logo_url
      ),
      images:property_images(
        id,
        url,
        position,
        is_primary
      )
    `, { count: 'exact' })

  if (filters.status) {
    query = query.eq('status', filters.status)
  } else {
    query = query.eq('status', 'active')
  }

  if (filters.propertyType) {
    query = query.eq('property_type', filters.propertyType)
  }

  if (filters.listingType) {
    query = query.eq('listing_type', filters.listingType)
  }

  if (filters.city) {
    query = query.ilike('city', `%${filters.city}%`)
  }

  if (filters.minPrice) {
    query = query.gte('price', filters.minPrice)
  }

  if (filters.maxPrice) {
    query = query.lte('price', filters.maxPrice)
  }

  if (filters.minArea) {
    query = query.gte('floor_area', filters.minArea)
  }

  if (filters.maxArea) {
    query = query.lte('floor_area', filters.maxArea)
  }

  if (filters.rooms) {
    query = query.eq('rooms', filters.rooms)
  }

  switch (sortBy) {
    case 'price_asc':
      query = query.order('price', { ascending: true })
      break
    case 'price_desc':
      query = query.order('price', { ascending: false })
      break
    case 'area_asc':
      query = query.order('floor_area', { ascending: true })
      break
    case 'area_desc':
      query = query.order('floor_area', { ascending: false })
      break
    case 'oldest':
      query = query.order('published_at', { ascending: true })
      break
    case 'newest':
    default:
      query = query.order('published_at', { ascending: false })
      break
  }

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching properties:', error)
    return { properties: [], total: 0, error: error.message }
  }

  return {
    properties: data || [],
    total: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize)
  }
}

export async function getPropertyById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('properties')
    .select(`
      *,
      broker:brokers(
        id,
        first_name,
        last_name,
        full_name,
        avatar_url,
        phone,
        mobile,
        email,
        bio,
        years_of_experience,
        avg_rating,
        total_reviews
      ),
      agency:real_estate_agencies(
        id,
        name,
        logo_url,
        email,
        phone,
        website
      ),
      images:property_images(
        id,
        url,
        position,
        is_primary
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching property:', error)
    return { property: null, error: error.message }
  }

  return { property: data, error: null }
}

export async function getPropertiesByBroker(
  brokerId: string,
  status: 'active' | 'sold' = 'active',
  limit: number = 10
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('properties')
    .select(`
      *,
      images:property_images(
        id,
        url,
        position,
        is_primary
      )
    `)
    .eq('broker_id', brokerId)
    .eq('status', status)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching broker properties:', error)
    return { properties: [], error: error.message }
  }

  return { properties: data || [], error: null }
}
