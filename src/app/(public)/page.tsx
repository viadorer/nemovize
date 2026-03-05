"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowRight, Shield, BarChart3, Clock, Users, Search, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const tabs = [
  { id: 'prodat', label: 'Prodat' },
  { id: 'koupit', label: 'Koupit' },
  { id: 'odhad', label: 'Odhad' },
  { id: 'prodane', label: 'Prodané' },
  { id: 'makleri', label: 'Makléři' },
]

const services = [
  {
    icon: Clock,
    title: "Nabídka už do 24 hodin",
    description: "Zdarma a jednoduše",
    link: "/vykup",
  },
  {
    icon: BarChart3,
    title: "Až o 9 % vyšší prodejní cena",
    description: "Než na trhu",
    link: "/prodej",
  },
  {
    icon: Shield,
    title: "Upozornění na atraktivní nemovitosti",
    description: "Ke koupi",
    link: "/nemovitosti",
  },
  {
    icon: ArrowRight,
    title: "Ocenění vaší nemovitosti",
    description: "Zdarma. Do 3 minut.",
    link: "/valuation",
  },
  {
    icon: Users,
    title: "Skutečné prodejní ceny",
    description: "Nemovitostí kolem vás",
    link: "/prodane",
  },
]

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('prodat')
  const [searchQuery, setSearchQuery] = useState('')
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Nadpis a hodnocení */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
              Nejlépe hodnocené realitní služby v ČR
            </h1>
            <div className="flex items-center justify-center gap-3 text-lg">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-[#fbbf24] text-[#fbbf24]" />
                ))}
              </div>
              <span className="font-semibold text-[#111111]">4.8</span>
              <span className="text-[#666666]">(5 089 hodnocení)</span>
            </div>
          </div>

          {/* Taby */}
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 p-2 bg-[rgba(240,255,240,0.65)] backdrop-blur-[10px] border border-[rgba(0,112,243,0.15)] rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] max-w-fit mx-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-full font-semibold text-base transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-[#111111] text-white shadow-lg'
                      : 'text-[#111111] hover:bg-[rgba(255,255,255,0.5)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Vyhledávací řádek */}
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    activeTab === 'prodat' ? 'Zadejte adresu nemovitosti' :
                    activeTab === 'koupit' ? 'Zadejte lokalitu nebo adresu' :
                    activeTab === 'odhad' ? 'Zadejte adresu pro ocenění' :
                    activeTab === 'prodane' ? 'Hledat prodané nemovitosti' :
                    'Hledat makléře podle města'
                  }
                  className="w-full pl-12 pr-4 py-4 text-base bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent transition-all"
                />
              </div>
              <Button 
                size="lg" 
                className="px-8 py-4 text-base rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                {activeTab === 'prodat' ? 'Získat nabídku' :
                 activeTab === 'koupit' ? 'Hledat' :
                 activeTab === 'odhad' ? 'Ocenit' :
                 activeTab === 'prodane' ? 'Zobrazit' :
                 'Najít makléře'}
              </Button>
            </div>

            {/* Popisek pod vyhledáváním */}
            <p className="text-center text-base text-[#666666] mt-6 leading-relaxed">
              {activeTab === 'prodat' && 'Vyhledejte, oceňte i prodejte nemovitost na jednom místě. Rychle, transparentně a bez starostí.'}
              {activeTab === 'koupit' && 'Katalog více než 35 000 nemovitostí na prodej v celém Česku'}
              {activeTab === 'odhad' && 'Spočítejte si orientační cenu svého bytu či domu. Zdarma, nezávazně a do pár minut.'}
              {activeTab === 'prodane' && 'Exkluzivní katalog více než 100 000 prodaných nemovitostí v celém Česku'}
              {activeTab === 'makleri' && 'Najděte ty nejlepší realitní makléře ve vašem okolí'}
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {services.map((service) => (
              <Link key={service.title} href={service.link}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-8 text-center">
                    <div className="inline-flex p-4 rounded-2xl bg-[rgba(240,255,240,0.65)] backdrop-blur-[10px] border border-[rgba(0,112,243,0.15)] shadow-[0_8px_20px_rgba(0,0,0,0.15)] text-[#111111] mb-6 group-hover:scale-110 transition-transform">
                      <service.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 leading-tight">{service.title}</h3>
                    <p className="text-base text-[#666666]">{service.description}</p>
                    <div className="mt-4 text-[#0071e3] font-semibold text-sm flex items-center justify-center gap-1 group-hover:gap-2 transition-all">
                      Zjistit více <ArrowRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recenze a prodané nemovitosti */}
      <section className="py-24 sm:py-32 bg-gradient-to-b from-transparent to-[rgba(240,255,240,0.3)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Připojte se k více než 10 tisícům spokojených klientů
            </h2>
            <p className="text-lg text-[#666666]">
              S Reas prodáte výhodně a s jistotou
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Placeholder pro prodané nemovitosti - budou se načítat z DB */}
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Card key={item} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="aspect-video bg-gradient-to-br from-[rgba(240,255,240,0.65)] to-[rgba(0,112,243,0.15)] relative">
                  <div className="absolute inset-0 flex items-center justify-center text-[#666666]">
                    <Users className="w-12 h-12" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 fill-[#fbbf24] text-[#fbbf24]" />
                      ))}
                    </div>
                    <span className="text-sm font-semibold">5.0</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Prodaný byt 2+1, 63 m²</h3>
                  <p className="text-[#666666] text-sm mb-3">Praha - Vinohrady</p>
                  <p className="text-sm text-[#666666] line-clamp-2">
                    Profesionální přístup, rychlé jednání a skvělá komunikace. Doporučuji!
                  </p>
                  <div className="mt-4 pt-4 border-t border-[rgba(0,0,0,0.1)]">
                    <p className="text-xs text-[#666666]">Prodáno před 1 měsícem</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link href="/recenze">
              <Button variant="outline" size="lg">
                Zobrazit všechny recenze
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Navigační sekce */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Prodávám */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-[#111111]">Prodávám</h3>
              <div className="space-y-4">
                <Link href="/prodej" className="block group">
                  <Card className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-lg group-hover:text-[#0071e3] transition-colors">
                          Prodej s Nemovize
                        </h4>
                        <p className="text-sm text-[#666666] mt-1">
                          Až o 9% vyšší cena než na trhu
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-[#666666] group-hover:text-[#0071e3] group-hover:translate-x-1 transition-all" />
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/valuation" className="block group">
                  <Card className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-lg group-hover:text-[#0071e3] transition-colors">
                          Chytrý odhad ceny
                        </h4>
                        <p className="text-sm text-[#666666] mt-1">
                          Zdarma, do 3 minut
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-[#666666] group-hover:text-[#0071e3] group-hover:translate-x-1 transition-all" />
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/prodane" className="block group">
                  <Card className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-lg group-hover:text-[#0071e3] transition-colors">
                          Ceny prodaných nemovitostí
                        </h4>
                        <p className="text-sm text-[#666666] mt-1">
                          Skutečné ceny v okolí
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-[#666666] group-hover:text-[#0071e3] group-hover:translate-x-1 transition-all" />
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/vykup" className="block group">
                  <Card className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-lg group-hover:text-[#0071e3] transition-colors">
                          Okamžitý výkup
                        </h4>
                        <p className="text-sm text-[#666666] mt-1">
                          Nabídka do 24 hodin
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-[#666666] group-hover:text-[#0071e3] group-hover:translate-x-1 transition-all" />
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>

            {/* Kupuji */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-[#111111]">Kupuji</h3>
              <div className="space-y-4">
                <Link href="/properties" className="block group">
                  <Card className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-lg group-hover:text-[#0071e3] transition-colors">
                          Nemovitosti na prodej
                        </h4>
                        <p className="text-sm text-[#666666] mt-1">
                          Katalog nemovitostí v celém Česku
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-[#666666] group-hover:text-[#0071e3] group-hover:translate-x-1 transition-all" />
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/hlidac" className="block group">
                  <Card className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-lg group-hover:text-[#0071e3] transition-colors">
                          Hlídač nabídek
                        </h4>
                        <p className="text-sm text-[#666666] mt-1">
                          Upozornění na nové nemovitosti
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-[#666666] group-hover:text-[#0071e3] group-hover:translate-x-1 transition-all" />
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="overflow-hidden">
            <CardContent className="p-12 sm:p-16 lg:p-20 text-center">
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-[#111111] to-[#555555] bg-clip-text text-transparent">
                Chcete vědět, kolik vaše nemovitost stojí?
              </h2>
              <p className="text-lg text-[#666666] mt-6 max-w-2xl mx-auto">
                Získejte odhad ceny během minut. Zdarma a bez závazku.
              </p>
              <div className="mt-10">
                <Link href="/valuation">
                  <Button size="lg">
                    Získat odhad zdarma
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  )
}
