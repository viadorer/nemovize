"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export async function createProperty(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Neprihlaseny" }

  const { data: profile } = await supabase
    .from("profiles").select("team_id").eq("id", user.id).single()
  if (!profile) return { error: "Profil nenalezen" }

  const { data, error } = await supabase.from("properties").insert({
    team_id: profile.team_id,
    title: formData.get("title") as string,
    description: formData.get("description") as string || null,
    property_type: formData.get("propertyType") as string,
    transaction_type: formData.get("transactionType") as string,
    price: Number(formData.get("price")),
    address: formData.get("address") as string,
    city: formData.get("city") as string,
    zip: formData.get("zip") as string || null,
    floor_area: formData.get("floorArea") ? Number(formData.get("floorArea")) : null,
    lot_area: formData.get("lotArea") ? Number(formData.get("lotArea")) : null,
    rooms: formData.get("rooms") ? Number(formData.get("rooms")) : null,
    layout: formData.get("layout") as string || null,
    floor: formData.get("floor") ? Number(formData.get("floor")) : null,
    total_floors: formData.get("totalFloors") ? Number(formData.get("totalFloors")) : null,
    construction: formData.get("construction") as string || null,
    condition: formData.get("condition") as string || null,
    energy_rating: formData.get("energyRating") as string || null,
    ownership: formData.get("ownership") as string || null,
    status: "draft",
  }).select().single()

  if (error) return { error: error.message }

  await supabase.from("activities").insert({
    team_id: profile.team_id,
    entity_type: "property",
    entity_id: data.id,
    action: "created",
    description: 'Nemovitost "' + data.title + '" byla vytvorena',
    user_id: user.id,
  })

  redirect("/dashboard/properties/" + data.id)
}

export async function updatePropertyStatus(id: string, status: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("properties").update({
    status,
    published_at: status === "active" ? new Date().toISOString() : undefined,
    updated_at: new Date().toISOString(),
  }).eq("id", id)
  if (error) return { error: error.message }
  return { success: true }
}
