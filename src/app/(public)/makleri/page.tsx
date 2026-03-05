import Link from "next/link"
import { Star, MapPin, TrendingUp, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"

export default async function BrokersPage() {
  const supabase = await createClient()
  
  // Fetch all active brokers with stats
  const { data: brokers } = await supabase
    .from('broker_stats_complete')
    .select('*')
    .order('avg_rating', { ascending: false, nullsFirst: false })

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-b from-[rgba(240,255,240,0.3)] to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
              Najděte svého realitního makléře
            </h1>
            <p className="text-lg text-[#666666] max-w-2xl mx-auto">
              Vyberte si z našich ověřených realitních makléřů s nejlepším hodnocením
            </p>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
              <input
                type="text"
                placeholder="Hledat makléře podle města nebo jména..."
                className="w-full pl-12 pr-4 py-4 text-base bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold mb-1">{brokers?.length || 0}</div>
                <div className="text-[#666666]">Aktivních makléřů</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold mb-1">
                  {brokers?.reduce((sum, b) => sum + (b.total_sold || 0), 0) || 0}
                </div>
                <div className="text-[#666666]">Prodaných nemovitostí</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold mb-1">4.6</div>
                <div className="text-[#666666]">Průměrné hodnocení</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Brokers List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {brokers?.map((broker) => (
              <Link key={broker.broker_id} href={`/makleri/${broker.broker_id}`}>
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                  {/* Cover Image */}
                  <div className="h-32 bg-gradient-to-br from-[rgba(240,255,240,0.65)] to-[rgba(0,112,243,0.15)] relative">
                    {broker.cover_image_url && (
                      <img 
                        src={broker.cover_image_url} 
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <CardContent className="p-6">
                    {/* Avatar */}
                    <div className="relative -mt-16 mb-4">
                      <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white mx-auto">
                        {broker.avatar_url ? (
                          <img 
                            src={broker.avatar_url} 
                            alt={broker.full_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[rgba(240,255,240,0.65)] to-[rgba(0,112,243,0.15)] text-2xl font-bold text-[#111111]">
                            {broker.first_name?.[0]}{broker.last_name?.[0]}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="text-center mb-4">
                      <h3 className="font-bold text-xl mb-1">
                        {broker.title && `${broker.title} `}{broker.full_name}
                      </h3>
                      <p className="text-sm text-[#666666] mb-3">
                        {broker.agency_name}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-4 h-4 ${
                                star <= Math.round(broker.avg_rating || 0)
                                  ? 'fill-[#fbbf24] text-[#fbbf24]'
                                  : 'text-[#e5e7eb]'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-semibold">{broker.avg_rating || 0}</span>
                        <span className="text-sm text-[#666666]">({broker.total_reviews || 0})</span>
                      </div>

                      {/* Location */}
                      {broker.service_areas && broker.service_areas.length > 0 && (
                        <div className="flex items-center justify-center gap-1 text-sm text-[#666666] mb-4">
                          <MapPin className="w-4 h-4" />
                          <span>{broker.service_areas[0]}</span>
                          {broker.service_areas.length > 1 && (
                            <span>+{broker.service_areas.length - 1}</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[rgba(0,0,0,0.1)]">
                      <div className="text-center">
                        <div className="text-xl font-bold text-[#0071e3]">
                          {broker.properties_for_sale || 0}
                        </div>
                        <div className="text-xs text-[#666666]">Na prodej</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-[#0071e3]">
                          {broker.total_sold || 0}
                        </div>
                        <div className="text-xs text-[#666666]">Prodáno</div>
                      </div>
                    </div>

                    {/* Specialization */}
                    {broker.specialization && broker.specialization.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2 justify-center">
                        {broker.specialization.slice(0, 3).map((spec: string) => (
                          <span 
                            key={spec}
                            className="text-xs px-3 py-1 bg-[rgba(240,255,240,0.65)] rounded-full"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {(!brokers || brokers.length === 0) && (
            <div className="text-center py-12">
              <p className="text-lg text-[#666666] mb-6">
                Zatím nemáme žádné makléře v databázi.
              </p>
              <p className="text-sm text-[#666666]">
                Spusťte seed data pro naplnění databáze ukázkovými makléři.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-b from-transparent to-[rgba(240,255,240,0.3)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-r from-[rgba(240,255,240,0.65)] to-[rgba(0,112,243,0.15)]">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Chcete se stát naším partnerem?
              </h2>
              <p className="text-lg text-[#666666] mb-6 max-w-2xl mx-auto">
                Připojte se k našim ověřeným realitním makléřům a získejte přístup k tisícům potenciálních klientů.
              </p>
              <Button size="lg">
                Stát se makléřem
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
