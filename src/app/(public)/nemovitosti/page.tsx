import { Suspense } from 'react'
import { PropertyCard } from '@/components/properties/property-card'
import { getProperties } from '@/lib/api/properties'
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
  const filters = {
    propertyType: searchParams.propertyType,
    listingType: searchParams.listingType,
    city: searchParams.city,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    minArea: searchParams.minArea ? Number(searchParams.minArea) : undefined,
    maxArea: searchParams.maxArea ? Number(searchParams.maxArea) : undefined,
    rooms: searchParams.rooms ? Number(searchParams.rooms) : undefined,
  }

  const sortBy = (searchParams.sortBy as any) || 'newest'

  const { properties, total, totalPages } = await getProperties(
    filters,
    sortBy,
    page,
    12
  )

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
              Zobrazeno {properties.length} z {total}
            </p>
            <PropertySorting />
          </div>

          {properties.length === 0 ? (
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
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    href={`/nemovitosti/${property.id}`}
                  />
                ))}
              </div>

              {(totalPages ?? 0) > 1 && (
                <div className="mt-8">
                  <PropertyPagination
                    currentPage={page}
                    totalPages={totalPages ?? 1}
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
