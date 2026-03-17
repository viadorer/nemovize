"use client"

import Link from "next/link"
import {
  MapPin,
  Maximize,
  BedDouble,
  Building2,
  Home,
  LandPlot,
  Store,
  Layers,
  Tag,
  Flower2,
  ParkingSquare,
  ArrowUpFromDot,
  Warehouse,
  Waves,
  Sun,
} from "lucide-react"
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

const transactionVariant: Record<string, "default" | "success" | "warning" | "destructive" | "secondary"> = {
  Prodej: "default",
  "Pronájem": "secondary",
  "Dražba": "destructive",
  "Podíly": "warning",
}

const propertyTypeIcon: Record<string, React.ReactNode> = {
  Byt: <Building2 className="w-3 h-3" />,
  "Dům": <Home className="w-3 h-3" />,
  Pozemek: <LandPlot className="w-3 h-3" />,
  "Komerční": <Store className="w-3 h-3" />,
  "Ostatní": <Layers className="w-3 h-3" />,
}

interface FeatureItem {
  key: string
  label: string
  icon: React.ReactNode
}

const featureList: FeatureItem[] = [
  { key: "garden", label: "Zahrada", icon: <Flower2 className="w-3 h-3" /> },
  { key: "garage", label: "Garáž", icon: <ParkingSquare className="w-3 h-3" /> },
  { key: "elevator", label: "Výtah", icon: <ArrowUpFromDot className="w-3 h-3" /> },
  { key: "balcony", label: "Balkón", icon: <Sun className="w-3 h-3" /> },
  { key: "terrace", label: "Terasa", icon: <Sun className="w-3 h-3" /> },
  { key: "cellar", label: "Sklep", icon: <Warehouse className="w-3 h-3" /> },
  { key: "pool", label: "Bazén", icon: <Waves className="w-3 h-3" /> },
]

interface PropertyCardProps {
  property: PropertyWithImages
  href?: string
}

export function PropertyCard({ property, href }: PropertyCardProps) {
  const images = (property as any).images ?? property.property_images ?? []
  const primaryImage = images.find((img: any) => img.is_primary) ?? images[0]

  const link = href ?? `/dashboard/properties/${property.id}`

  const placeholderImage = `https://placehold.co/800x500/1a1a2e/eaeaea?text=${encodeURIComponent(property.property_type ?? 'Nemovitost')}`

  const features = (property as any).features as Record<string, any> | undefined
  const activeFeatures = features
    ? featureList.filter((f) => features[f.key] === true)
    : []

  const transactionType = (property as any).transaction_type as string | undefined
  const propertyType = property.property_type as string | undefined

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
          {/* Top-left: status */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            <Badge variant={statusVariant[property.status]}>
              {statusLabel[property.status]}
            </Badge>
          </div>
          {/* Top-right: transaction type */}
          {transactionType && (
            <div className="absolute top-3 right-3">
              <Badge variant={transactionVariant[transactionType] ?? "default"}>
                <Tag className="w-3 h-3 mr-1" />
                {transactionType}
              </Badge>
            </div>
          )}
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
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="line-clamp-1">{property.city}</span>
          </div>

          {/* Property type + metrics row */}
          <div className="flex items-center gap-3 mt-3 text-sm text-muted-foreground">
            {propertyType && (
              <div className="flex items-center gap-1">
                {propertyTypeIcon[propertyType] ?? <Layers className="w-3.5 h-3.5" />}
                <span>{propertyType}</span>
              </div>
            )}
            {property.floor_area ? (
              <div className="flex items-center gap-1">
                <Maximize className="w-3.5 h-3.5" />
                <span>{formatArea(property.floor_area)}</span>
              </div>
            ) : null}
            {property.layout && (
              <div className="flex items-center gap-1">
                <BedDouble className="w-3.5 h-3.5" />
                <span>{property.layout}</span>
              </div>
            )}
          </div>

          {/* Feature badges */}
          {activeFeatures.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {activeFeatures.slice(0, 4).map((f) => (
                <span
                  key={f.key}
                  className="inline-flex items-center gap-1 rounded-md bg-black/5 px-2 py-0.5 text-xs font-medium text-black/70"
                >
                  {f.icon}
                  {f.label}
                </span>
              ))}
              {activeFeatures.length > 4 && (
                <span className="inline-flex items-center rounded-md bg-black/5 px-2 py-0.5 text-xs font-medium text-black/70">
                  +{activeFeatures.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </Card>
    </Link>
  )
}
