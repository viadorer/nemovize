"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { createProperty } from "../actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  PROPERTY_TYPES, TRANSACTION_TYPES, CONSTRUCTION_TYPES,
  CONDITION_TYPES, ENERGY_RATINGS, OWNERSHIP_TYPES,
} from "@/lib/constants"

export default function NewPropertyPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await createProperty(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/properties">
          <Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Nová nemovitost</h1>
          <p className="text-muted-foreground mt-1">Přidejte novou nemovitost do nabídky</p>
        </div>
      </div>

      <form action={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Základní údaje</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input id="title" name="title" label="Název" placeholder="např. Byt 3+kk Praha 5" required />
            <Textarea id="description" name="description" label="Popis" placeholder="Podrobný popis nemovitosti..." />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select id="propertyType" name="propertyType" label="Typ nemovitosti" options={[...PROPERTY_TYPES]} placeholder="Vyberte typ" required />
              <Select id="transactionType" name="transactionType" label="Typ transakce" options={[...TRANSACTION_TYPES]} placeholder="Vyberte typ" required />
            </div>
            <Input id="price" name="price" type="number" label="Cena (CZK)" placeholder="5000000" required />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Lokace</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input id="address" name="address" label="Adresa" placeholder="Ulice a číslo" required />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input id="city" name="city" label="Město" placeholder="Praha" required />
              <Input id="zip" name="zip" label="PSC" placeholder="15000" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Parametry</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input id="floorArea" name="floorArea" type="number" label="Užitná plocha (m²)" />
              <Input id="lotArea" name="lotArea" type="number" label="Plocha pozemku (m²)" />
              <Input id="rooms" name="rooms" type="number" label="Počet pokojů" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input id="layout" name="layout" label="Dispozice" placeholder="3+kk" />
              <Input id="floor" name="floor" type="number" label="Patro" />
              <Input id="totalFloors" name="totalFloors" type="number" label="Celkem pater" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select id="construction" name="construction" label="Konstrukce" options={[...CONSTRUCTION_TYPES]} placeholder="Vyberte" />
              <Select id="condition" name="condition" label="Stav" options={[...CONDITION_TYPES]} placeholder="Vyberte" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select id="energyRating" name="energyRating" label="Energetický štítek" options={ENERGY_RATINGS.map((r) => ({ value: r, label: r }))} placeholder="Vyberte" />
              <Select id="ownership" name="ownership" label="Vlastnictví" options={[...OWNERSHIP_TYPES]} placeholder="Vyberte" />
            </div>
          </CardContent>
        </Card>

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-3">{error}</p>
        )}

        <div className="flex justify-end gap-3">
          <Link href="/dashboard/properties"><Button variant="outline">Zrušit</Button></Link>
          <Button type="submit" disabled={loading}>
            {loading ? "Ukládání..." : "Vytvořit nemovitost"}
          </Button>
        </div>
      </form>
    </div>
  )
}
