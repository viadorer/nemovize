"use client"

import Link from "next/link"
import { MapPin, Maximize, BedDouble } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice, formatArea } from "@/lib/format"
import type { PropertyWithImages, PropertyStatus } from "@/types"

const statusVariant: Record<PropertyStatus, "default" | "success" | "warning" | "secondary"> = {
  draft: "secondary",
  active: "success",
  reserved: "warning",
  sold: "default",
}

const statusLabel: Record<PropertyStatus, string> = {
  draft: "Koncept",
  active: "Aktivní",
  reserved: "Rezervováno",
  sold: "Prodáno",
}

interface PropertyCardProps {
  property: PropertyWithImages
  href?: string
}

export function PropertyCard({ property, href }: PropertyCardProps) {
  const images = (property as any).images ?? property.property_images ?? []
  const primaryImage = images.find((img: any) => img.is_primary) ?? images[0]

  const link = href ?? `/dashboard/properties/${property.id}`

  const placeholderImage = `https://placehold.co/800x500/1a1a2e/eaeaea?text=${encodeURIComponent(property.property_type ?? 'Nemovitost')}`

  return (
    <Link href={link}>
      <Card className="overflow-hidden hover:shadow-xl hover:shadow-black/[0.05] transition-all duration-300 group">
        <div className="relative aspect-[16/10] bg-muted overflow-hidden">
          <img
            src={primaryImage?.url?.startsWith('/') ? placeholderImage : (primaryImage?.url ?? placeholderImage)}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = placeholderImage
            }}
          />
          <div className="absolute top-3 left-3">
            <Badge variant={statusVariant[property.status]}>
              {statusLabel[property.status]}
            </Badge>
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-base leading-tight line-clamp-1">
              {property.title}
            </h3>
            <span className="text-base font-bold text-accent whitespace-nowrap">
              {formatPrice(property.price)}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span className="line-clamp-1">{property.city}</span>
          </div>
          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
            {property.floor_area && (
              <div className="flex items-center gap-1">
                <Maximize className="w-3.5 h-3.5" />
                <span>{formatArea(property.floor_area)}</span>
              </div>
            )}
            {property.layout && (
              <div className="flex items-center gap-1">
                <BedDouble className="w-3.5 h-3.5" />
                <span>{property.layout}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  )
}
