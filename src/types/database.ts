export type UserRole = "owner" | "admin" | "consultant" | "viewer"
export type PropertyStatus = "draft" | "active" | "reserved" | "sold"
export type ClientStatus = "lead" | "active" | "closed"
export type InquiryStatus = "new" | "contacted" | "showing" | "offer" | "closed"
export type ValuationStatus = "pending" | "completed" | "expired"
export type MessageChannel = "email" | "sms" | "chat" | "note"

export interface Team {
  id: string
  name: string
  slug: string
  logo_url: string | null
  settings: Record<string, unknown> | null
  created_at: string
}

export interface Profile {
  id: string
  team_id: string
  full_name: string
  email: string
  phone: string | null
  avatar_url: string | null
  role: UserRole
  bio: string | null
  specialization: string[] | null
  created_at: string
}

export interface Client {
  id: string
  team_id: string
  first_name: string
  last_name: string
  email: string | null
  phone: string | null
  source: string | null
  status: ClientStatus
  assigned_to: string | null
  notes: string | null
  tags: string[] | null
  created_at: string
}

export interface Property {
  id: string
  team_id: string
  client_id: string | null
  title: string
  description: string | null
  property_type: string
  transaction_type: string
  price: number
  estimated_price: number | null
  address: string
  city: string
  zip: string | null
  lat: number | null
  lng: number | null
  floor_area: number | null
  lot_area: number | null
  rooms: number | null
  layout: string | null
  floor: number | null
  total_floors: number | null
  construction: string | null
  condition: string | null
  energy_rating: string | null
  ownership: string | null
  features: Record<string, unknown> | null
  status: PropertyStatus
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface PropertyImage {
  id: string
  property_id: string
  url: string
  position: number
  is_primary: boolean
  created_at: string
}

export interface Valuation {
  id: string
  team_id: string
  client_id: string | null
  property_id: string | null
  address: string
  property_type: string
  floor_area: number
  estimated_min: number | null
  estimated_max: number | null
  estimated_avg: number | null
  methodology: string | null
  data_sources: Record<string, unknown> | null
  status: ValuationStatus
  created_at: string
}

export interface Inquiry {
  id: string
  property_id: string
  client_id: string | null
  name: string
  email: string
  phone: string | null
  message: string
  status: InquiryStatus
  assigned_to: string | null
  created_at: string
}

export interface Message {
  id: string
  team_id: string
  inquiry_id: string | null
  client_id: string | null
  sender_type: "consultant" | "client" | "system"
  sender_id: string | null
  channel: MessageChannel
  subject: string | null
  body: string
  created_at: string
}

export interface Review {
  id: string
  consultant_id: string
  client_id: string | null
  property_id: string | null
  rating: number
  text: string | null
  is_public: boolean
  created_at: string
}

export interface Document {
  id: string
  team_id: string
  property_id: string | null
  client_id: string | null
  name: string
  file_url: string
  file_type: string | null
  category: string | null
  created_at: string
}

export interface Activity {
  id: string
  team_id: string
  entity_type: "property" | "client" | "inquiry"
  entity_id: string
  action: string
  description: string | null
  user_id: string | null
  metadata: Record<string, unknown> | null
  created_at: string
}

// Extended types with relations
export interface PropertyWithImages extends Property {
  property_images: PropertyImage[]
}

export interface PropertyWithDetails extends PropertyWithImages {
  client: Client | null
}

export interface ClientWithAssignee extends Client {
  assigned_profile: Profile | null
}

export interface InquiryWithProperty extends Inquiry {
  property: Property | null
  assigned_profile: Profile | null
}

export interface ReviewWithConsultant extends Review {
  consultant: Profile
}
