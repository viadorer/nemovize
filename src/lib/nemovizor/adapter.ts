import type { NemovizorProperty } from "./types"
import type { PropertyWithImages } from "@/types"

/**
 * Converts a Nemovizor property to the Nemovize PropertyWithImages format
 * so it can be rendered by existing components (PropertyCard, etc.)
 */
export function adaptNemovizorProperty(p: NemovizorProperty): PropertyWithImages {
  // Map Nemovizor listing_type → Nemovize transaction_type
  const transactionMap: Record<string, string> = {
    sale: "Prodej",
    rent: "Pronájem",
    auction: "Dražba",
    shares: "Podíly",
  }

  // Map Nemovizor category → Nemovize property_type
  const categoryMap: Record<string, string> = {
    apartment: "Byt",
    house: "Dům",
    land: "Pozemek",
    commercial: "Komerční",
    other: "Ostatní",
  }

  return {
    id: `nv-${p.id}`,
    team_id: "",
    client_id: null,
    title: p.title,
    description: p.description ?? p.summary,
    property_type: categoryMap[p.category] ?? p.category,
    transaction_type: transactionMap[p.listing_type] ?? p.listing_type,
    price: p.price,
    estimated_price: null,
    address: [p.street, p.city_part].filter(Boolean).join(", ") || p.location_label,
    city: p.city,
    zip: p.zip ?? null,
    lat: p.latitude,
    lng: p.longitude,
    floor_area: p.area,
    lot_area: p.land_area ?? null,
    rooms: null,
    layout: p.rooms_label || null,
    floor: p.floor ?? null,
    total_floors: p.total_floors ?? null,
    construction: p.building_material ?? null,
    condition: p.condition ?? null,
    energy_rating: p.energy_rating ?? null,
    ownership: p.ownership ?? null,
    features: {
      balcony: p.balcony,
      terrace: p.terrace,
      garden: p.garden,
      elevator: p.elevator,
      cellar: p.cellar,
      garage: p.garage,
      pool: p.pool,
      loggia: p.loggia,
      source: "nemovizor",
    },
    status: p.active ? "active" : "sold",
    published_at: p.created_at,
    created_at: p.created_at,
    updated_at: p.updated_at,
    listing_type: p.listing_type,
    property_images: p.images.map((url, i) => ({
      id: `nv-img-${p.id}-${i}`,
      property_id: `nv-${p.id}`,
      url,
      position: i,
      is_primary: i === 0,
      created_at: p.created_at,
    })),
  } as PropertyWithImages
}

export function adaptNemovizorProperties(properties: NemovizorProperty[]): PropertyWithImages[] {
  return properties.map(adaptNemovizorProperty)
}
