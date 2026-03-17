export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import { PropertyCard } from '@/components/properties/property-card'
import { fetchNemovizorProperties, adaptNemovizorProperties } from '@/lib/nemovizor'
import { PropertyFilters } from './filters'
import { PropertyPagination } from './pagination'
import { PropertySorting } from './sorting'

type SearchParams = {
  page?: string
  propertyType?: string
  listingType?: 'sale' | 'rent'
  city?: string
  minPrice?: string
  maxPrice?: string
  minArea?: string
  maxArea?: string
  rooms?: string
  sortBy?: string
}

export default async function NemovitostiPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const page = Number(searchParams.page) || 1
  const pageSize = 12

  const nemovizorResult = await fetchNemovizorProperties({
    listing_type: searchParams.listingType,
    category: searchParams.propertyType,
    city: searchParams.city,
    rooms: searchParams.rooms,
    priceMin: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    priceMax: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    areaMin: searchParams.minArea ? Number(searchParams.minArea) : undefined,
    areaMax: searchParams.maxArea ? Number(searchParams.maxArea) : undefined,
    sortBy: searchParams.sortBy,
    limit: pageSize,
    offset: (page - 1) * pageSize,
  }).catch((err) => {
    console.error("[Nemovizor] Fetch failed:", err.message)
    return { properties: [], count: 0 }
  })

  const allProperties = adaptNemovizorProperties(nemovizorResult.properties)
  const total = nemovizorResult.count || allProperties.length
  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Nemovitosti</h1>
        <p className="text-muted-foreground">
          Nalezeno {total} {total === 1 ? 'nemovitost' : total < 5 ? 'nemovitosti' : 'nemovitostí'}
        </p>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        <aside>
          <Suspense fallback={<div>Načítání filtrů...</div>}>
            <PropertyFilters />
          </Suspense>
        </aside>

        <main>
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              Zobrazeno {allProperties.length} z {total}
            </p>
            <Suspense fallback={null}>
              <PropertySorting />
            </Suspense>
          </div>

          {allProperties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Žádné nemovitosti nenalezeny
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Zkuste upravit filtry nebo vyhledávání
              </p>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {allProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    href={
                      property.id.startsWith('nv-')
                        ? `/nemovitosti/${property.id}`
                        : `/nemovitosti/${property.id}`
                    }
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8">
                  <PropertyPagination
                    currentPage={page}
                    totalPages={totalPages}
                  />
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
