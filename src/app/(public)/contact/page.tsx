import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin } from "lucide-react"

export const metadata = {
  title: "Kontakt",
}

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Kontakt</h1>
      <p className="text-muted-foreground mt-3">Ozvěte se nám. Rádi vám poradíme.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
        <Card>
          <CardHeader>
            <CardTitle>Napište nám</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input id="contact-first" name="firstName" label="Jméno" placeholder="Jan" />
                <Input id="contact-last" name="lastName" label="Příjmení" placeholder="Novák" />
              </div>
              <Input id="contact-email" name="email" type="email" label="Email" placeholder="váš@email.cz" />
              <Input id="contact-phone" name="phone" type="tel" label="Telefon" placeholder="+420 123 456 789" />
              <Textarea id="contact-msg" name="message" label="Zpráva" placeholder="Jak vám můžeme pomoci?" />
              <Button className="w-full">Odeslat zprávu</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-accent/10 text-accent">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">info@nemovize.cz</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-accent/10 text-accent">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefon</p>
                  <p className="font-medium">+420 123 456 789</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-accent/10 text-accent">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Adresa</p>
                  <p className="font-medium">Praha, Česká republika</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
