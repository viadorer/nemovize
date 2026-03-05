import { notFound } from "next/navigation"
import Link from "next/link"
import { Star, MapPin, Phone, Mail, Home, TrendingUp, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"

export default async function BrokerPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  
  // Fetch broker data with stats
  const { data: broker, error } = await supabase
    .from('broker_stats_complete')
    .select('*')
    .eq('broker_id', params.id)
    .single()

  if (error || !broker) {
    notFound()
  }

  // Fetch active properties
  const { data: activeProperties } = await supabase
    .from('active_properties_public')
    .select('*')
    .eq('broker_id', params.id)
    .limit(6)

  // Fetch sold properties
  const { data: soldProperties } = await supabase
    .from('sold_properties_public')
    .select('*')
    .eq('broker_id', params.id)
    .limit(12)

  // Fetch reviews
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('broker_id', params.id)
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <div className="min-h-screen">
      {/* Cover Image + Profile Header */}
      <div className="relative h-64 bg-gradient-to-br from-[rgba(240,255,240,0.65)] to-[rgba(0,112,243,0.15)]">
        {broker.cover_image_url && (
          <img 
            src={broker.cover_image_url} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Info */}
        <div className="relative -mt-20 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
            {/* Avatar */}
            <div className="relative">
              <div className="w-40 h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
                {broker.avatar_url ? (
                  <img 
                    src={broker.avatar_url} 
                    alt={broker.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[rgba(240,255,240,0.65)] to-[rgba(0,112,243,0.15)] text-4xl font-bold text-[#111111]">
                    {broker.first_name[0]}{broker.last_name[0]}
                  </div>
                )}
              </div>
            </div>

            {/* Name & Info */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h1 className="text-3xl font-bold mb-2">
                  {broker.title && `${broker.title} `}{broker.full_name}
                </h1>
                <p className="text-lg text-[#666666] mb-3">
                  Makléř v {broker.agency_name}
                </p>
                {broker.motto && (
                  <p className="text-base text-[#111111] italic mb-4">
                    {broker.motto}
                  </p>
                )}
                
                {/* Rating */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-5 h-5 ${
                            star <= Math.round(broker.avg_rating || 0)
                              ? 'fill-[#fbbf24] text-[#fbbf24]'
                              : 'text-[#e5e7eb]'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-lg">{broker.avg_rating || 0}</span>
                    <span className="text-[#666666]">({broker.total_reviews || 0})</span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="flex flex-wrap gap-4 text-sm">
                  {broker.phone && (
                    <div className="flex items-center gap-2 text-[#666666]">
                      <Phone className="w-4 h-4" />
                      <span>{broker.phone}</span>
                    </div>
                  )}
                  {broker.email && (
                    <div className="flex items-center gap-2 text-[#666666]">
                      <Mail className="w-4 h-4" />
                      <span>{broker.email}</span>
                    </div>
                  )}
                  {broker.service_areas && broker.service_areas.length > 0 && (
                    <div className="flex items-center gap-2 text-[#666666]">
                      <MapPin className="w-4 h-4" />
                      <span>{broker.service_areas.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Button */}
            <div className="md:mb-6">
              <Button size="lg" className="w-full md:w-auto">
                Kontaktovat
              </Button>
            </div>
          </div>
        </div>

        {/* Bio */}
        {broker.bio && (
          <div className="mb-12">
            <Card>
              <CardContent className="p-6">
                <p className="text-base text-[#666666] leading-relaxed">
                  {broker.bio}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Services */}
        {broker.services && broker.services.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Služby makléře</h2>
            <div className="flex flex-wrap gap-3">
              {broker.services.map((service: string) => (
                <div
                  key={service}
                  className="px-6 py-3 bg-[rgba(240,255,240,0.65)] backdrop-blur-[10px] border border-[rgba(0,112,243,0.15)] rounded-full font-semibold"
                >
                  {service.charAt(0).toUpperCase() + service.slice(1)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Statistiky makléře</h2>
          <p className="text-[#666666] mb-6">
            Prodejní výsledky makléře za poslední 2 roky.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Home className="w-8 h-8 mx-auto mb-3 text-[#0071e3]" />
                <div className="text-3xl font-bold mb-1">
                  {broker.properties_for_sale || 0}
                </div>
                <div className="text-[#666666]">Nemovitosti na prodej</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-3 text-[#0071e3]" />
                <div className="text-3xl font-bold mb-1">
                  {broker.total_sold || 0}
                </div>
                <div className="text-[#666666]">Prodané nemovitosti</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 mx-auto mb-3 text-[#0071e3]" />
                <div className="text-3xl font-bold mb-1">
                  {broker.total_sales_volume 
                    ? `${(broker.total_sales_volume / 1000000).toFixed(1)} mil.`
                    : '0'}
                </div>
                <div className="text-[#666666]">Objem prodejů (Kč)</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Active Properties */}
        {activeProperties && activeProperties.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Nemovitosti na prodej</h2>
                <p className="text-[#666666] mt-1">
                  K makléři {broker.full_name} evidujeme celkem {broker.properties_for_sale || 0} nemovitosti na prodej.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeProperties.map((property: any) => (
                <Link key={property.id} href={`/properties/${property.id}`}>
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                    <div className="aspect-video bg-gradient-to-br from-[rgba(240,255,240,0.65)] to-[rgba(0,112,243,0.15)] relative">
                      {property.primary_image_url && (
                        <img 
                          src={property.primary_image_url} 
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg mb-2">{property.title}</h3>
                      <p className="text-[#666666] text-sm mb-3">
                        {property.address}, {property.city}
                      </p>
                      <div className="text-2xl font-bold text-[#0071e3]">
                        {property.price?.toLocaleString('cs-CZ')} Kč
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Sold Properties */}
        {soldProperties && soldProperties.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Prodané nemovitosti</h2>
                <p className="text-[#666666] mt-1">
                  K makléři {broker.full_name} evidujeme celkem {broker.total_sold || 0} prodaných nemovitostí.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {soldProperties.slice(0, 3).map((property: any) => (
                <Card key={property.id} className="overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-[rgba(240,255,240,0.65)] to-[rgba(0,112,243,0.15)] relative">
                    {property.primary_image_url && (
                      <img 
                        src={property.primary_image_url} 
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-2">{property.title}</h3>
                    <p className="text-[#666666] text-sm mb-3">
                      {property.address}, {property.city}
                    </p>
                    <div className="text-2xl font-bold">
                      {property.sold_price?.toLocaleString('cs-CZ')} Kč
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {soldProperties.length > 3 && (
              <div className="text-center">
                <Button variant="outline" size="lg">
                  Zobrazit další prodeje
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Reviews */}
        {reviews && reviews.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Hodnocení makléře</h2>
            <div className="flex items-center gap-4 mb-8">
              <div className="text-5xl font-bold">{broker.avg_rating || 0}</div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-5 h-5 ${
                        star <= Math.round(broker.avg_rating || 0)
                          ? 'fill-[#fbbf24] text-[#fbbf24]'
                          : 'text-[#e5e7eb]'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-[#666666]">{broker.total_reviews || 0} hodnocení</div>
              </div>
            </div>

            <div className="space-y-6">
              {reviews.map((review: any) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-4 h-4 ${
                                star <= review.rating
                                  ? 'fill-[#fbbf24] text-[#fbbf24]'
                                  : 'text-[#e5e7eb]'
                              }`}
                            />
                          ))}
                        </div>
                        {review.is_verified && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Ověřená recenze
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-[#666666]">
                        {review.transaction_type && `${review.transaction_type.charAt(0).toUpperCase() + review.transaction_type.slice(1)} • `}
                        {new Date(review.created_at).toLocaleDateString('cs-CZ')}
                      </span>
                    </div>
                    <p className="text-[#666666] leading-relaxed">
                      {review.text}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Contact CTA */}
        <div className="mb-12">
          <Card className="bg-gradient-to-r from-[rgba(240,255,240,0.65)] to-[rgba(0,112,243,0.15)]">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Máte zájem o spolupráci?
              </h2>
              <p className="text-lg text-[#666666] mb-6 max-w-2xl mx-auto">
                Kontaktujte {broker.full_name} a získejte profesionální pomoc s prodejem nebo koupí nemovitosti.
              </p>
              <Button size="lg">
                Kontaktovat makléře
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
