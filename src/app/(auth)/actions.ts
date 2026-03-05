"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export async function login(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  })

  if (error) {
    return { error: error.message }
  }

  redirect("/dashboard")
}

export async function register(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("fullName") as string

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.user) {
    // Create default team and profile
    const { data: team } = await supabase
      .from("teams")
      .insert({ name: `${fullName} tym`, slug: email.split("@")[0] })
      .select()
      .single()

    if (team) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        team_id: team.id,
        full_name: fullName,
        email,
        role: "owner",
      })
    }
  }

  redirect("/dashboard")
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}

export async function forgotPassword(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(
    formData.get("email") as string,
    { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` }
  )

  if (error) {
    return { error: error.message }
  }

  return { success: "Odkaz pro obnoveni hesla byl zaslan na vas email." }
}
