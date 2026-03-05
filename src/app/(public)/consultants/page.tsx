import { Star } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export const metadata = {
  title: "Konzultanti",
  description: "Naši realitní konzultanti",
}

export default async function ConsultantsPage() {
  const supabase = await createClient()

  const { data: consultants } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "consultant")
    .order("full_name")

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight">Naši konzultanti</h1>
        <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
          Každý klient má svého osobního konzultanta, který ho provede celým procesem.
        </p>
      </div>

      {!consultants || consultants.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">Žádní konzultanti k dispozici</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {consultants.map((consultant) => {
            const initials = consultant.full_name
              ?.split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase()

            return (
              <Link key={consultant.id} href={`/consultants/${consultant.id}`}>
                <Card className="hover:shadow-xl hover:shadow-black/[0.05] transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <Avatar className="h-20 w-20 mx-auto">
                      <AvatarImage src={consultant.avatar_url ?? undefined} />
                      <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold mt-4">{consultant.full_name}</h3>
                    {consultant.specialization && consultant.specialization.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                        {consultant.specialization.map((spec: string) => (
                          <Badge key={spec} variant="secondary">{spec}</Badge>
                        ))}
                      </div>
                    )}
                    {consultant.bio && (
                      <p className="text-sm text-muted-foreground mt-3 line-clamp-3">
                        {consultant.bio}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
