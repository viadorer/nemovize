import { notFound } from 'next/navigation'
import { getPropertyById } from '@/lib/api/properties'
import { PropertyDetailClient } from './PropertyDetailClient'

interface Props {
  params: Promise<{ id: string }>
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params
  const { property, error } = await getPropertyById(id)

  if (!property || error) {
    notFound()
  }

  return <PropertyDetailClient property={property} />
}
