import Link from "next/link"
import { Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { formatPrice, formatArea, formatDateShort } from "@/lib/format"
import type { ValuationStatus } from "@/types"

const statusVariant: Record<ValuationStatus, "default" | "success" | "secondary"> = {
  pending: "default", completed: "success", expired: "secondary",
}
const statusLabel: Record<ValuationStatus, string> = {
  pending: "Čeká", completed: "Dokončeno", expired: "Expirované",
}

export default async function ValuationsPage() {
  const supabase = await createClient()
  const { data: valuations } = await supabase
    .from("valuations").select("*").order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ocenění</h1>
          <p className="text-muted-foreground mt-1">Přehled ocenění nemovitostí</p>
        </div>
        <Button><Plus className="w-4 h-4" />Nové ocenění</Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Adresa</TableHead>
                <TableHead>Typ</TableHead>
                <TableHead>Plocha</TableHead>
                <TableHead>Odhad</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Datum</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(!valuations || valuations.length === 0) && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">Žádná ocenění</TableCell>
                </TableRow>
              )}
              {valuations?.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-medium">{v.address}</TableCell>
                  <TableCell className="text-muted-foreground">{v.property_type}</TableCell>
                  <TableCell className="text-muted-foreground">{formatArea(v.floor_area)}</TableCell>
                  <TableCell>{v.estimated_avg ? formatPrice(v.estimated_avg) : "-"}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[v.status as ValuationStatus]}>
                      {statusLabel[v.status as ValuationStatus] ?? v.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDateShort(v.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
