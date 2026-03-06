"use client"

import { useState } from "react"
import Link from "next/link"
import { login } from "../actions"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-8">
        <h2 className="text-xl font-semibold mb-6">Přihlášení</h2>

        <form action={handleSubmit} className="flex flex-col space-y-6">
          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="váš@email.cz"
            required
          />

          <Input
            id="password"
            name="password"
            type="password"
            label="Heslo"
            placeholder="Vaše heslo"
            required
          />

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Button type="submit" disabled={loading} className="w-full mt-2">
            {loading ? "Přihlašování..." : "Přihlásit se"}
          </Button>
        </form>

        <div className="mt-6 flex flex-col gap-2 text-center text-sm">
          <Link
            href="/forgot-password"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Zapomenuté heslo?
          </Link>
          <p className="text-muted-foreground">
            Nemáte účet?{" "}
            <Link
              href="/register"
              className="text-accent hover:underline"
            >
              Zaregistrujte se
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
