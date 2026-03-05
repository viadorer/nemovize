import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = user
    ? await supabase.from("profiles").select("*, team:teams(*)").eq("id", user.id).single()
    : { data: null }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Nastavení</h1>
        <p className="text-muted-foreground mt-1">Správa účtu a týmu</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
          <CardDescription>Vaše osobní údaje</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input id="s-name" label="Jméno" defaultValue={profile?.full_name ?? ""} />
          <Input id="s-email" label="Email" defaultValue={profile?.email ?? ""} disabled />
          <Input id="s-phone" label="Telefon" defaultValue={profile?.phone ?? ""} />
          <Button>Uložit změny</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Tým</CardTitle>
          <CardDescription>Nastavení vašeho týmu</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input id="s-team" label="Název týmu" defaultValue={profile?.team?.name ?? ""} />
          <Button>Uložit změny</Button>
        </CardContent>
      </Card>
    </div>
  )
}
