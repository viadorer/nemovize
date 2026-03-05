"use client"

import { useState } from "react"
import { ArrowRight, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { PROPERTY_TYPES, CONDITION_TYPES } from "@/lib/constants"
import { formatPrice } from "@/lib/format"

type Step = "property" | "details" | "contact" | "result"

export default function ValuationPage() {
  const [step, setStep] = useState<Step>("property")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ min: number; max: number; avg: number } | null>(null)

  const [formData, setFormData] = useState({
    propertyType: "",
    address: "",
    city: "",
    floorArea: "",
    rooms: "",
    floor: "",
    condition: "",
    name: "",
    email: "",
    phone: "",
  })

  function updateField(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit() {
    setLoading(true)
    // Simulate valuation calculation
    const area = Number(formData.floorArea) || 60
    const basePrice = 85000 // CZK per m2 (simulated average)
    const avg = area * basePrice
    const min = Math.round(avg * 0.85)
    const max = Math.round(avg * 1.15)

    await new Promise((r) => setTimeout(r, 1500))
    setResult({ min, max, avg: Math.round(avg) })
    setStep("result")
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Online ocenění nemovitosti
        </h1>
        <p className="text-muted-foreground mt-3 text-lg">
          Získejte odhad tržní ceny během minut. Zdarma.
        </p>
      </div>

      {/* Progress */}
      {step !== "result" && (
        <div className="flex items-center justify-center gap-2 mb-8">
          {(["property", "details", "contact"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                  step === s
                    ? "bg-accent text-accent-foreground"
                    : ["property", "details", "contact"].indexOf(step) > i
                      ? "bg-accent/20 text-accent"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              {i < 2 && <div className="w-12 h-px bg-border" />}
            </div>
          ))}
        </div>
      )}

      {step === "property" && (
        <Card>
          <CardHeader>
            <CardTitle>O jaké nemovitosti jde?</CardTitle>
            <CardDescription>Základní informace o nemovitosti</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              id="propertyType"
              label="Typ nemovitosti"
              options={[...PROPERTY_TYPES]}
              placeholder="Vyberte typ"
              value={formData.propertyType}
              onChange={(e) => updateField("propertyType", e.target.value)}
            />
            <Input
              id="address"
              label="Adresa"
              placeholder="Ulice a číslo"
              value={formData.address}
              onChange={(e) => updateField("address", e.target.value)}
            />
            <Input
              id="city"
              label="Město"
              placeholder="Praha"
              value={formData.city}
              onChange={(e) => updateField("city", e.target.value)}
            />
            <div className="pt-2">
              <Button
                onClick={() => setStep("details")}
                className="w-full"
                disabled={!formData.propertyType || !formData.address || !formData.city}
              >
                Pokračovat
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "details" && (
        <Card>
          <CardHeader>
            <CardTitle>Parametry nemovitosti</CardTitle>
            <CardDescription>Upřesněte detaily pro přesnější odhad</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              id="floorArea"
              type="number"
              label="Užitná plocha (m²)"
              placeholder="75"
              value={formData.floorArea}
              onChange={(e) => updateField("floorArea", e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="rooms"
                type="number"
                label="Počet pokojů"
                placeholder="3"
                value={formData.rooms}
                onChange={(e) => updateField("rooms", e.target.value)}
              />
              <Input
                id="floor"
                type="number"
                label="Patro"
                placeholder="3"
                value={formData.floor}
                onChange={(e) => updateField("floor", e.target.value)}
              />
            </div>
            <Select
              id="condition"
              label="Stav"
              options={[...CONDITION_TYPES]}
              placeholder="Vyberte stav"
              value={formData.condition}
              onChange={(e) => updateField("condition", e.target.value)}
            />
            <div className="pt-2 flex gap-3">
              <Button variant="outline" onClick={() => setStep("property")} className="flex-1">
                Zpět
              </Button>
              <Button
                onClick={() => setStep("contact")}
                className="flex-1"
                disabled={!formData.floorArea}
              >
                Pokracovat
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "contact" && (
        <Card>
          <CardHeader>
            <CardTitle>Vaše kontaktní údaje</CardTitle>
            <CardDescription>Výsledek ocenění zašleme na váš email</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              id="name"
              label="Jméno a příjmení"
              placeholder="Jan Novák"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
            <Input
              id="email"
              type="email"
              label="Email"
              placeholder="váš@email.cz"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
            <Input
              id="phone"
              type="tel"
              label="Telefon"
              placeholder="+420 123 456 789"
              value={formData.phone}
              onChange={(e) => updateField("phone", e.target.value)}
            />
            <div className="pt-2 flex gap-3">
              <Button variant="outline" onClick={() => setStep("details")} className="flex-1">
                Zpět
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1"
                disabled={loading || !formData.name || !formData.email}
              >
                {loading ? "Počítám odhad..." : "Získat odhad"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "result" && result && (
        <Card>
          <CardContent className="p-8 sm:p-12 text-center">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-emerald-500/10 text-emerald-600 mb-6">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Odhad tržní ceny</h2>
            <p className="text-muted-foreground mb-8">
              {formData.address}, {formData.city}
            </p>

            <div className="bg-muted rounded-2xl p-6 sm:p-8 mb-8">
              <div className="text-sm text-muted-foreground mb-2">Odhadovaná cena</div>
              <div className="text-4xl sm:text-5xl font-bold text-accent">
                {formatPrice(result.avg)}
              </div>
              <div className="text-sm text-muted-foreground mt-3">
                Rozsah: {formatPrice(result.min)} - {formatPrice(result.max)}
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              Detailní ocenění jsme zaslali na {formData.email}.
              Náš konzultant se vám ozve do 24 hodin.
            </p>

            <Button variant="secondary" onClick={() => { setStep("property"); setResult(null) }}>
              Nové ocenění
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
