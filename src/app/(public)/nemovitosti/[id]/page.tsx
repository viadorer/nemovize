import { notFound } from 'next/navigation'
import { fetchNemovizorProperty, adaptNemovizorProperty } from '@/lib/nemovizor'
import { PropertyDetailClient } from './PropertyDetailClient'

interface Props {
  params: Promise<{ id: string }>
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params

  // Strip "nv-" prefix if present
  const nemovizorId = id.startsWith('nv-') ? id.slice(3) : id

  try {
    const nvProperty = await fetchNemovizorProperty(nemovizorId)
    const adapted = adaptNemovizorProperty(nvProperty)
    return <PropertyDetailClient property={adapted} />
  } catch {
    notFound()
  }
}
