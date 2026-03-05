import Link from "next/link"
import { Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table"
import { formatDateShort, formatPhone } from "@/lib/format"
import type { ClientStatus } from "@/types"

const statusVariant: Record<ClientStatus, "default" | "success" | "secondary"> = {
  lead: "default", active: "success", closed: "secondary",
}
const statusLabel: Record<ClientStatus, string> = {
  lead: "Lead", active: "Aktivní", closed: "Uzavřený",
}

export default async function ClientsPage() {
  const supabase = await createClient()
  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Klienti</h1>
          <p className="text-muted-foreground mt-1">Správa klientů a kontaktů</p>
        </div>
        <Button><Plus className="w-4 h-4" />Nový klient</Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Jméno</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Vytvořeno</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(!clients || clients.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
Žádní klienti
                  </TableCell>
                </TableRow>
              )}
              {clients?.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <Link href={`/dashboard/clients/${client.id}`} className="font-medium hover:text-accent transition-colors">
                      {client.first_name} {client.last_name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{client.email ?? "-"}</TableCell>
                  <TableCell className="text-muted-foreground">{client.phone ? formatPhone(client.phone) : "-"}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[client.status as ClientStatus]}>
                      {statusLabel[client.status as ClientStatus] ?? client.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDateShort(client.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
