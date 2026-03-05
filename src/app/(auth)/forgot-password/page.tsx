"use client"

import { useState } from "react"
import Link from "next/link"
import { forgotPassword } from "../actions"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setSuccess(null)
    const result = await forgotPassword(formData)
    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setSuccess(result.success)
    }
    setLoading(false)
  }

  return (
    <Card>
      <CardContent className="p-8">
        <h2 className="text-xl font-semibold mb-2">Obnovení hesla</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Zadejte svůj email a pošleme vám odkaz pro obnovení hesla.
        </p>

        <form action={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="váš@email.cz"
            required
          />

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {success && (
            <p className="text-sm text-emerald-600 bg-emerald-500/10 rounded-lg px-3 py-2">
              {success}
            </p>
          )}

          <Button type="submit" disabled={loading} className="w-full mt-2">
            {loading ? "Odesílání..." : "Odeslat odkaz"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/login" className="text-accent hover:underline">
Zpět na přihlášení
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
