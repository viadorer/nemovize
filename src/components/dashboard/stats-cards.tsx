import { Building2, Users, Calculator, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { formatPrice } from "@/lib/format"

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  icon: React.ReactNode
}

function StatCard({ title, value, change, icon }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">{title}</span>
            <span className="text-2xl font-bold tracking-tight">{value}</span>
            {change && (
              <span className="text-xs text-emerald-600">{change}</span>
            )}
          </div>
          <div className="p-3 rounded-xl bg-accent/10 text-accent">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface StatsCardsProps {
  propertyCount: number
  clientCount: number
  valuationCount: number
  totalValue: number
}

export function StatsCards({
  propertyCount,
  clientCount,
  valuationCount,
  totalValue,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Nemovitosti"
        value={propertyCount}
        icon={<Building2 className="w-5 h-5" />}
      />
      <StatCard
        title="Klienti"
        value={clientCount}
        icon={<Users className="w-5 h-5" />}
      />
      <StatCard
        title="Ocenění"
        value={valuationCount}
        icon={<Calculator className="w-5 h-5" />}
      />
      <StatCard
        title="Celková hodnota"
        value={formatPrice(totalValue)}
        icon={<TrendingUp className="w-5 h-5" />}
      />
    </div>
  )
}
