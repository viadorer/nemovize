import { createClient } from "@/lib/supabase/server"
import { PropertyCard } from "@/components/properties/property-card"

export const metadata = {
  title: "Nemovitosti",
  description: "Prohlížejte nemovitosti na prodej a k pronájmu",
}

const filters = ["Všechny", "Byty", "Domy", "Pozemky"]

export default async function PublicPropertiesPage() {
  const supabase = await createClient()

  const { data: properties } = await supabase
    .from("properties")
    .select("*, property_images(*)")
    .eq("status", "active")
    .order("published_at", { ascending: false })

  return (
    <div className="min-h-screen py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Nemovitosti</h1>
          <p className="text-lg text-muted-foreground mt-4">
            {properties?.length ?? 0} nemovitostí v nabídce
          </p>
        </div>

        {!properties || properties.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Žádné nemovitosti v nabídce</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                href={`/properties/${property.id}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
