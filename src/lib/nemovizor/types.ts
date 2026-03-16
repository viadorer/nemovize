// Nemovizor database types (read-only subset)
// Source: Nemovizor offline/nemovizor-mvp/src/lib/supabase-types.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface NemovizorDatabase {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string
          slug: string
          title: string
          listing_type: "sale" | "rent" | "auction" | "shares"
          category: "apartment" | "house" | "land" | "commercial" | "other"
          subtype: string
          rooms_label: string
          price: number
          price_note: string | null
          price_currency: string | null
          price_unit: string | null
          city: string
          district: string
          street: string | null
          zip: string | null
          region: string | null
          city_part: string | null
          location_label: string
          latitude: number
          longitude: number
          area: number
          land_area: number | null
          summary: string
          description: string | null
          condition: string | null
          ownership: string | null
          furnishing: string | null
          energy_rating: string | null
          building_material: string | null
          floor: number | null
          total_floors: number | null
          year_built: number | null
          image_src: string
          image_alt: string
          images: string[]
          broker_id: string | null
          featured: boolean
          active: boolean
          balcony: boolean
          terrace: boolean
          garden: boolean
          elevator: boolean
          cellar: boolean
          garage: boolean
          pool: boolean
          loggia: boolean
          created_at: string
          updated_at: string
        }
        Insert: never // read-only
        Update: never // read-only
      }
      brokers: {
        Row: {
          id: string
          name: string
          phone: string
          email: string
          photo: string | null
          agency_name: string
          specialization: string
          active_listings: number
          rating: number
          total_deals: number
          bio: string
          slug: string | null
          agency_id: string | null
          languages: string[] | null
          certifications: string[] | null
          year_started: number | null
          created_at: string
        }
        Insert: never
        Update: never
      }
      agencies: {
        Row: {
          id: string
          name: string
          slug: string
          logo: string | null
          description: string
          phone: string
          email: string
          website: string | null
          seat_city: string | null
          seat_address: string | null
          founded_year: number | null
          total_brokers: number
          total_listings: number
          total_deals: number
          rating: number
          specializations: string[]
          created_at: string
          updated_at: string
        }
        Insert: never
        Update: never
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

// Convenience aliases
export type NemovizorProperty = NemovizorDatabase["public"]["Tables"]["properties"]["Row"]
export type NemovizorBroker = NemovizorDatabase["public"]["Tables"]["brokers"]["Row"]
export type NemovizorAgency = NemovizorDatabase["public"]["Tables"]["agencies"]["Row"]
