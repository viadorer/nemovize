import Link from "next/link"
import { Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { PropertyCard } from "@/components/properties/property-card"

export default async function PropertiesPage() {
  const supabase = await createClient()
  const { data: properties } = await supabase
    .from("properties")
    .select("*, property_images(*)")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Nemovitosti</h1>
          <p className="text-muted-foreground mt-1">Správa vašich nemovitostí</p>
        </div>
        <Link href="/dashboard/properties/new">
          <Button><Plus className="w-4 h-4" />Nová nemovitost</Button>
        </Link>
      </div>
      {!properties || properties.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground mb-4">Žádné nemovitosti</p>
          <Link href="/dashboard/properties/new"><Button>Přidat první nemovitost</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  )
}
