import { createClient } from "@supabase/supabase-js"
import type { NemovizorDatabase } from "./types"

/**
 * Read-only Supabase client for Nemovizor database.
 * Used server-side only — no cookies, no auth needed.
 */
export function createNemovizorClient() {
  const url = process.env.NEMOVIZOR_SUPABASE_URL
  const key = process.env.NEMOVIZOR_SUPABASE_ANON_KEY

  console.log("[Nemovizor] ENV check — url:", !!url, "key:", !!key)

  if (!url || !key) {
    throw new Error("Missing NEMOVIZOR_SUPABASE_URL or NEMOVIZOR_SUPABASE_ANON_KEY")
  }

  return createClient<NemovizorDatabase>(url, key, {
    auth: { persistSession: false },
  })
}
