import { createClient } from "@/lib/supabase/server"
import { PropertyCard } from "@/components/properties/property-card"
import { fetchNemovizorProperties, adaptNemovizorProperties } from "@/lib/nemovizor"

export const metadata = {
  title: "Nemovitosti",
  description: "Prohlížejte nemovitosti na prodej a k pronájmu",
}

export default async function PublicPropertiesPage() {
  const supabase = await createClient()

  // Fetch from both sources in parallel
  const [localResult, nemovizorResult] = await Promise.all([
    supabase
      .from("properties")
      .select("*, property_images(*)")
      .eq("status", "active")
      .order("published_at", { ascending: false }),
    fetchNemovizorProperties({ limit: 50 }).catch(() => ({ properties: [], count: 0 })),
  ])

  const localProperties = localResult.data ?? []
  const nemovizorAdapted = adaptNemovizorProperties(nemovizorResult.properties)
  const allProperties = [...localProperties, ...nemovizorAdapted]

  return (
    <div className="min-h-screen py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Nemovitosti</h1>
          <p className="text-lg text-muted-foreground mt-4">
            {allProperties.length} nemovitostí v nabídce
          </p>
        </div>

        {allProperties.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Žádné nemovitosti v nabídce</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {allProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                href={
                  property.id.startsWith('nv-')
                    ? `/nemovitosti/${property.id}`
                    : `/properties/${property.id}`
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
