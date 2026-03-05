import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Edit, MapPin } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatPrice, formatArea, formatDateShort } from "@/lib/format"

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: property } = await supabase
    .from("properties")
    .select("*, property_images(*), client:clients(id, first_name, last_name)")
    .eq("id", id)
    .single()

  if (!property) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/properties">
            <Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{property.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">{property.address}, {property.city}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge>{property.status}</Badge>
          <Link href={`/dashboard/properties/${id}/edit`}>
            <Button variant="secondary"><Edit className="w-4 h-4" />Upravit</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Přehled</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Cena</p>
                  <p className="text-lg font-bold text-accent">{formatPrice(property.price)}</p>
                </div>
                {property.floor_area && (
                  <div>
                    <p className="text-sm text-muted-foreground">Plocha</p>
                    <p className="text-lg font-semibold">{formatArea(property.floor_area)}</p>
                  </div>
                )}
                {property.layout && (
                  <div>
                    <p className="text-sm text-muted-foreground">Dispozice</p>
                    <p className="text-lg font-semibold">{property.layout}</p>
                  </div>
                )}
                {property.rooms && (
                  <div>
                    <p className="text-sm text-muted-foreground">Pokoje</p>
                    <p className="text-lg font-semibold">{property.rooms}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {property.description && (
            <Card>
              <CardHeader><CardTitle>Popis</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                  {property.description}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Detaily</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[
                ["Typ", property.property_type],
                ["Transakce", property.transaction_type],
                ["Konstrukce", property.construction],
                ["Stav", property.condition],
                ["Energetický štítek", property.energy_rating],
                ["Vlastnictví", property.ownership],
                ["Patro", property.floor != null ? `${property.floor}/${property.total_floors}` : null],
                ["Pozemek", property.lot_area ? formatArea(property.lot_area) : null],
              ].filter(([, val]) => val).map(([label, value]) => (
                <div key={label as string} className="flex justify-between">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Časová osa</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vytvořeno</span>
                <span>{formatDateShort(property.created_at)}</span>
              </div>
              {property.published_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Publikováno</span>
                  <span>{formatDateShort(property.published_at)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Aktualizováno</span>
                <span>{formatDateShort(property.updated_at)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
