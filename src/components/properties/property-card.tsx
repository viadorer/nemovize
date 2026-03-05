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
  const primaryImage = property.property_images?.find((img) => img.is_primary)
    ?? property.property_images?.[0]

  const link = href ?? `/dashboard/properties/${property.id}`

  return (
    <Link href={link}>
      <Card className="overflow-hidden hover:shadow-xl hover:shadow-black/[0.05] transition-all duration-300 group">
        <div className="relative aspect-[16/10] bg-muted overflow-hidden">
          {primaryImage ? (
            <img
              src={primaryImage.url}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <MapPin className="w-8 h-8" />
            </div>
          )}
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
