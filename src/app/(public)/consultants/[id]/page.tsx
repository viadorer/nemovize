import { notFound } from "next/navigation"
import { Star, Mail, Phone } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default async function ConsultantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: consultant } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .eq("role", "consultant")
    .single()

  if (!consultant) notFound()

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, client:clients(first_name, last_name)")
    .eq("consultant_id", id)
    .eq("is_public", true)
    .order("created_at", { ascending: false })

  const avgRating = reviews && reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null

  const initials = consultant.full_name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={consultant.avatar_url ?? undefined} />
                  <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold">{consultant.full_name}</h1>
                  {avgRating && (
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-medium">{avgRating}</span>
                      <span className="text-sm text-muted-foreground">
                        ({reviews?.length} recenzí)
                      </span>
                    </div>
                  )}
                  {consultant.specialization && consultant.specialization.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {consultant.specialization.map((spec: string) => (
                        <Badge key={spec} variant="secondary">{spec}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {consultant.bio && (
                <p className="text-muted-foreground mt-6 leading-relaxed">
                  {consultant.bio}
                </p>
              )}
            </CardContent>
          </Card>

          {reviews && reviews.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recenze</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="pb-6 border-b border-border last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {review.client?.first_name} {review.client?.last_name?.[0]}.
                      </span>
                    </div>
                    {review.text && (
                      <p className="text-sm text-muted-foreground">{review.text}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Kontaktovat konzultanta</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <Input id="contact-name" name="name" label="Jméno" placeholder="Vaše jméno" />
                <Input id="contact-email" name="email" type="email" label="Email" placeholder="váš@email.cz" />
                <Input id="contact-phone" name="phone" type="tel" label="Telefon" placeholder="+420" />
                <Textarea id="contact-message" name="message" label="Zpráva" placeholder="Máte dotaz?" />
                <Button className="w-full">Odeslat</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
