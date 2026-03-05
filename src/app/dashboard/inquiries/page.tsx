import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { formatDateShort } from "@/lib/format"
import type { InquiryStatus } from "@/types"

const statusVariant: Record<InquiryStatus, "default" | "success" | "warning" | "secondary" | "destructive"> = {
  new: "default", contacted: "warning", showing: "success", offer: "success", closed: "secondary",
}
const statusLabel: Record<InquiryStatus, string> = {
  new: "Nová", contacted: "Kontaktován", showing: "Prohlídka", offer: "Nabídka", closed: "Uzavřeno",
}

export default async function InquiriesPage() {
  const supabase = await createClient()
  const { data: inquiries } = await supabase
    .from("inquiries").select("*, property:properties(title)").order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Poptávky</h1>
        <p className="text-muted-foreground mt-1">Poptávky od zájemců o nemovitosti</p>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Jméno</TableHead>
                <TableHead>Nemovitost</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Datum</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(!inquiries || inquiries.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">Žádné poptávky</TableCell>
                </TableRow>
              )}
              {inquiries?.map((inq) => (
                <TableRow key={inq.id}>
                  <TableCell className="font-medium">{inq.name}</TableCell>
                  <TableCell className="text-muted-foreground">{inq.property?.title ?? "-"}</TableCell>
                  <TableCell className="text-muted-foreground">{inq.email}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[inq.status as InquiryStatus]}>
                      {statusLabel[inq.status as InquiryStatus] ?? inq.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDateShort(inq.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
