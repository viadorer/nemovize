"use client"

import { useState } from "react"
import Link from "next/link"
import { register } from "../actions"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      setError("Hesla se neshodují.")
      setLoading(false)
      return
    }

    const result = await register(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-8">
        <h2 className="text-xl font-semibold mb-6">Registrace</h2>

        <form action={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="fullName"
            name="fullName"
            type="text"
            label="Celé jméno"
            placeholder="Jan Novák"
            required
          />

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
            placeholder="Min. 6 znaků"
            required
            minLength={6}
          />

          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Heslo znovu"
            placeholder="Zopakujte heslo"
            required
            minLength={6}
          />

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Máte již účet?{" "}
            <Link href="/login" className="text-accent hover:underline">
              Přihlašte se
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
