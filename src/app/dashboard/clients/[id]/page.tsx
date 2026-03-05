import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Mail, Phone, Tag } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDateShort, formatPhone } from "@/lib/format"

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: client } = await supabase.from("clients").select("*").eq("id", id).single()
  if (!client) notFound()

  const { data: properties } = await supabase
    .from("properties").select("id, title, status, price").eq("client_id", id)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/clients">
          <Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{client.first_name} {client.last_name}</h1>
          <p className="text-muted-foreground mt-1">Klient od {formatDateShort(client.created_at)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Kontaktni udaje</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {client.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{client.email}</span>
                </div>
              )}
              {client.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{formatPhone(client.phone)}</span>
                </div>
              )}
              {client.tags && client.tags.length > 0 && (
                <div className="flex items-center gap-3">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  <div className="flex gap-1.5 flex-wrap">
                    {client.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {client.notes && (
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{client.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Info</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge>{client.status}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Zdroj</span>
              <span>{client.source ?? "-"}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
