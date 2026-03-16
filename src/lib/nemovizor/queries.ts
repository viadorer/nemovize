import { createNemovizorClient } from "./client"
import type { NemovizorProperty, NemovizorBroker, NemovizorAgency } from "./types"

type PropertyFilters = {
  listing_type?: string
  category?: string
  city?: string
  priceMin?: number
  priceMax?: number
  areaMin?: number
  areaMax?: number
  limit?: number
  offset?: number
}

export async function fetchNemovizorProperties(filters: PropertyFilters = {}) {
  const nemovizor = createNemovizorClient()

  let query = nemovizor
    .from("properties")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false })

  if (filters.listing_type) query = query.eq("listing_type", filters.listing_type)
  if (filters.category) query = query.eq("category", filters.category)
  if (filters.city) query = query.ilike("city", `%${filters.city}%`)
  if (filters.priceMin) query = query.gte("price", filters.priceMin)
  if (filters.priceMax) query = query.lte("price", filters.priceMax)
  if (filters.areaMin) query = query.gte("area", filters.areaMin)
  if (filters.areaMax) query = query.lte("area", filters.areaMax)

  const limit = filters.limit ?? 20
  const offset = filters.offset ?? 0
  query = query.range(offset, offset + limit - 1)

  const { data, error, count } = await query

  console.log("[Nemovizor] Query result — count:", data?.length, "error:", error?.message ?? "none")

  if (error) throw new Error(`Nemovizor query failed: ${error.message}`)

  return { properties: data as NemovizorProperty[], count }
}

export async function fetchNemovizorProperty(slug: string) {
  const nemovizor = createNemovizorClient()

  const { data, error } = await nemovizor
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .single()

  if (error) throw new Error(`Nemovizor property fetch failed: ${error.message}`)

  return data as NemovizorProperty
}

export async function fetchNemovizorBrokers(limit = 50) {
  const nemovizor = createNemovizorClient()

  const { data, error } = await nemovizor
    .from("brokers")
    .select("*")
    .order("rating", { ascending: false })
    .limit(limit)

  if (error) throw new Error(`Nemovizor brokers fetch failed: ${error.message}`)

  return data as NemovizorBroker[]
}

export async function fetchNemovizorAgencies(limit = 50) {
  const nemovizor = createNemovizorClient()

  const { data, error } = await nemovizor
    .from("agencies")
    .select("*")
    .order("rating", { ascending: false })
    .limit(limit)

  if (error) throw new Error(`Nemovizor agencies fetch failed: ${error.message}`)

  return data as NemovizorAgency[]
}
