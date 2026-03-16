import { notFound } from "next/navigation"
import { MapPin, Maximize, BedDouble, Building, Zap, Phone, Mail } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { fetchNemovizorProperty, adaptNemovizorProperty } from "@/lib/nemovizor"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatPrice, formatArea, formatDate } from "@/lib/format"

export default async function PublicPropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // Nemovizor properties have IDs prefixed with "nv-"
  let property: any = null

  if (id.startsWith('nv-')) {
    const nemovizorId = id.slice(3)
    try {
      const nvProperty = await fetchNemovizorProperty(nemovizorId)
      property = adaptNemovizorProperty(nvProperty)
    } catch {
      notFound()
    }
  } else {
    const supabase = await createClient()
    const { data } = await supabase
      .from("properties")
      .select("*, property_images(*)")
      .eq("id", id)
      .eq("status", "active")
      .single()
    property = data
  }

  if (!property) notFound()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Gallery */}
      {property.property_images && property.property_images.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 rounded-2xl overflow-hidden mb-8">
          <div className="aspect-[4/3] bg-muted">
            <img
              src={property.property_images.find((img: { is_primary: boolean }) => img.is_primary)?.url ?? property.property_images[0].url}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {property.property_images.slice(1, 5).map((img: { id: string; url: string }) => (
              <div key={img.id} className="aspect-[4/3] bg-muted">
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl font-bold tracking-tight">{property.title}</h1>
              <span className="text-2xl font-bold text-accent whitespace-nowrap">
                {formatPrice(property.price)}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{property.address}, {property.city}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 py-4 border-y border-border">
            {property.floor_area && (
              <div className="flex items-center gap-2">
                <Maximize className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{formatArea(property.floor_area)}</span>
              </div>
            )}
            {property.layout && (
              <div className="flex items-center gap-2">
                <BedDouble className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{property.layout}</span>
              </div>
            )}
            {property.construction && (
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{property.construction}</span>
              </div>
            )}
            {property.energy_rating && (
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-muted-foreground" />
                <Badge variant="secondary">{property.energy_rating}</Badge>
              </div>
            )}
          </div>

          {property.description && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Popis</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {property.description}
              </p>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Parametry</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  ["Typ", property.property_type],
                  ["Transakce", property.transaction_type],
                  ["Konstrukce", property.construction],
                  ["Stav", property.condition],
                  ["Vlastnictví", property.ownership],
                  ["Patro", property.floor != null ? `${property.floor}/${property.total_floors}` : null],
                  ["Pozemek", property.lot_area ? formatArea(property.lot_area) : null],
                  ["Energetický štítek", property.energy_rating],
                ]
                  .filter(([, val]) => val)
                  .map(([label, value]) => (
                    <div key={label as string} className="flex justify-between py-2 border-b border-border last:border-0">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Máte zájem?</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <Input id="inquiry-name" name="name" label="Jméno" placeholder="Vaše jméno" required />
                <Input id="inquiry-email" name="email" type="email" label="Email" placeholder="váš@email.cz" required />
                <Input id="inquiry-phone" name="phone" type="tel" label="Telefon" placeholder="+420" />
                <Textarea id="inquiry-message" name="message" label="Zpráva" placeholder="Mám zájem o prohlídku..." />
                <Button className="w-full">Odeslat poptávku</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
