import { createNemovizorClient } from "./client"
import type { NemovizorProperty, NemovizorBroker, NemovizorAgency } from "./types"

// Map Czech filter values → Nemovizor DB values
const categoryMap: Record<string, string> = {
  byt: "apartment",
  dům: "house",
  dum: "house",
  pozemek: "land",
  "komerční": "commercial",
  komercni: "commercial",
  // pass-through English values
  apartment: "apartment",
  house: "house",
  land: "land",
  commercial: "commercial",
  other: "other",
}

export type PropertyFilters = {
  listing_type?: string
  category?: string
  city?: string
  rooms?: string
  priceMin?: number
  priceMax?: number
  areaMin?: number
  areaMax?: number
  sortBy?: string
  limit?: number
  offset?: number
}

export async function fetchNemovizorProperties(filters: PropertyFilters = {}) {
  const nemovizor = createNemovizorClient()

  // Sorting
  let orderColumn = "created_at"
  let orderAscending = false
  switch (filters.sortBy) {
    case "oldest":
      orderColumn = "created_at"; orderAscending = true; break
    case "price_asc":
      orderColumn = "price"; orderAscending = true; break
    case "price_desc":
      orderColumn = "price"; orderAscending = false; break
    case "area_asc":
      orderColumn = "area"; orderAscending = true; break
    case "area_desc":
      orderColumn = "area"; orderAscending = false; break
    default: // "newest"
      orderColumn = "created_at"; orderAscending = false; break
  }

  let query = nemovizor
    .from("properties")
    .select("*", { count: "exact" })
    .eq("active", true)
    .order(orderColumn, { ascending: orderAscending })

  if (filters.listing_type) query = query.eq("listing_type", filters.listing_type)

  // Resolve Czech category names to English DB values
  if (filters.category) {
    const resolved = categoryMap[filters.category.toLowerCase()] ?? filters.category
    query = query.eq("category", resolved)
  }

  if (filters.city) query = query.ilike("city", `%${filters.city}%`)
  if (filters.rooms) query = query.ilike("rooms_label", `%${filters.rooms}%`)
  if (filters.priceMin) query = query.gte("price", filters.priceMin)
  if (filters.priceMax) query = query.lte("price", filters.priceMax)
  if (filters.areaMin) query = query.gte("area", filters.areaMin)
  if (filters.areaMax) query = query.lte("area", filters.areaMax)

  const limit = filters.limit ?? 20
  const offset = filters.offset ?? 0
  query = query.range(offset, offset + limit - 1)

  const { data, error, count } = await query

  console.log("[Nemovizor] Query result — rows:", data?.length, "total:", count, "error:", error?.message ?? "none")

  if (error) throw new Error(`Nemovizor query failed: ${error.message}`)

  return { properties: data as NemovizorProperty[], count: count ?? data?.length ?? 0 }
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
