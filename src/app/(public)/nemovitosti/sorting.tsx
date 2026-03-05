'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Select } from '@/components/ui/select'

const sortOptions = [
  { value: 'newest', label: 'Nejnovější' },
  { value: 'oldest', label: 'Nejstarší' },
  { value: 'price_asc', label: 'Cena: od nejnižší' },
  { value: 'price_desc', label: 'Cena: od nejvyšší' },
  { value: 'area_asc', label: 'Plocha: od nejmenší' },
  { value: 'area_desc', label: 'Plocha: od největší' },
]

export function PropertySorting() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sortBy', value)
    params.delete('page')
    router.push(`/nemovitosti?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Řadit:</span>
      <Select
        options={sortOptions}
        value={searchParams.get('sortBy') || 'newest'}
        onChange={(e) => handleSortChange(e.target.value)}
        className="w-48"
      />
    </div>
  )
}
