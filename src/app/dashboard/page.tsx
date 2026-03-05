import { createClient } from "@/lib/supabase/server"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentActivity } from "@/components/dashboard/recent-activity"

export default async function DashboardPage() {
  const supabase = await createClient()

  const [
    { count: propertyCount },
    { count: clientCount },
    { count: valuationCount },
    { data: properties },
    { data: activities },
  ] = await Promise.all([
    supabase.from("properties").select("*", { count: "exact", head: true }),
    supabase.from("clients").select("*", { count: "exact", head: true }),
    supabase.from("valuations").select("*", { count: "exact", head: true }),
    supabase.from("properties").select("price").eq("status", "active"),
    supabase
      .from("activities")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10),
  ])

  const totalValue = properties?.reduce((sum, p) => sum + (p.price || 0), 0) ?? 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Přehled vaší realitní činnosti</p>
      </div>

      <StatsCards
        propertyCount={propertyCount ?? 0}
        clientCount={clientCount ?? 0}
        valuationCount={valuationCount ?? 0}
        totalValue={totalValue}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity activities={activities ?? []} />
      </div>
    </div>
  )
}
