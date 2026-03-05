'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card } from '@/components/ui/card'

const propertyTypes = [
  { value: '', label: 'Všechny typy' },
  { value: 'byt', label: 'Byt' },
  { value: 'dům', label: 'Dům' },
  { value: 'pozemek', label: 'Pozemek' },
  { value: 'komerční', label: 'Komerční' },
]

const listingTypes = [
  { value: '', label: 'Prodej i pronájem' },
  { value: 'sale', label: 'Prodej' },
  { value: 'rent', label: 'Pronájem' },
]

const roomOptions = [
  { value: '', label: 'Libovolný počet' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5+' },
]

export function PropertyFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    
    params.delete('page')
    
    router.push(`/nemovitosti?${params.toString()}`)
  }

  const handleReset = () => {
    router.push('/nemovitosti')
  }

  return (
    <Card className="p-6 sticky top-4">
      <h2 className="font-semibold text-lg mb-4">Filtry</h2>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Typ nemovitosti</label>
          <Select
            options={propertyTypes}
            value={searchParams.get('propertyType') || ''}
            onChange={(e) => handleFilterChange('propertyType', e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Transakce</label>
          <Select
            options={listingTypes}
            value={searchParams.get('listingType') || ''}
            onChange={(e) => handleFilterChange('listingType', e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Město</label>
          <Input
            type="text"
            placeholder="Např. Praha"
            value={searchParams.get('city') || ''}
            onChange={(e) => handleFilterChange('city', e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Počet pokojů</label>
          <Select
            options={roomOptions}
            value={searchParams.get('rooms') || ''}
            onChange={(e) => handleFilterChange('rooms', e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Cena (Kč)</label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Od"
              value={searchParams.get('minPrice') || ''}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            />
            <Input
              type="number"
              placeholder="Do"
              value={searchParams.get('maxPrice') || ''}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Plocha (m²)</label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Od"
              value={searchParams.get('minArea') || ''}
              onChange={(e) => handleFilterChange('minArea', e.target.value)}
            />
            <Input
              type="number"
              placeholder="Do"
              value={searchParams.get('maxArea') || ''}
              onChange={(e) => handleFilterChange('maxArea', e.target.value)}
            />
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={handleReset}
        >
          Resetovat filtry
        </Button>
      </div>
    </Card>
  )
}
