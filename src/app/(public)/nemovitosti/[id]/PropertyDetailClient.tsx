'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Maximize,
  BedDouble,
  Building,
  Zap,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Calendar,
  Car,
  Ruler,
  Home,
  Play,
  Scan,
  Calculator,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatPrice, formatArea, formatPhone } from '@/lib/format'

interface PropertyDetailClientProps {
  property: any
}

export function PropertyDetailClient({ property }: PropertyDetailClientProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [mediaModalOpen, setMediaModalOpen] = useState(false)
  const [mediaModalType, setMediaModalType] = useState<'video' | '3d' | null>(null)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [leadForm, setLeadForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    gdprConsent: false,
  })
  const [descriptionExpanded, setDescriptionExpanded] = useState(false)
  const [mortgageAmount, setMortgageAmount] = useState(property.price ? Math.round(property.price * 0.8) : 0)
  const [mortgageYears, setMortgageYears] = useState(30)
  const [mortgageRate, setMortgageRate] = useState(5.5)
  const [shareTooltip, setShareTooltip] = useState(false)

  const images = property.images ?? property.property_images ?? []
  const mainImage = images.find((img: any) => img.is_primary) ?? images[0]
  const broker = property.broker
  const agency = property.agency

  const placeholderImage = `https://placehold.co/1200x800/1a1a2e/eaeaea?text=${encodeURIComponent(property.property_type ?? 'Nemovitost')}`

  const pricePerSqm = useMemo(() => {
    if (property.price_per_sqm) return property.price_per_sqm
    if (property.price && property.floor_area) return Math.round(property.price / property.floor_area)
    return null
  }, [property.price, property.floor_area, property.price_per_sqm])

  const monthlyPayment = useMemo(() => {
    if (!mortgageAmount || mortgageAmount <= 0) return 0
    const r = mortgageRate / 100 / 12
    const n = mortgageYears * 12
    if (r === 0) return Math.round(mortgageAmount / n)
    return Math.round(mortgageAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1))
  }, [mortgageAmount, mortgageYears, mortgageRate])

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('nemovize_favorites') || '[]')
    setIsFavorite(favorites.includes(property.id))
  }, [property.id])

  useEffect(() => {
    if (!lightboxOpen && !mediaModalOpen) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setLightboxOpen(false)
        setMediaModalOpen(false)
      } else if (lightboxOpen) {
        if (e.key === 'ArrowLeft') prevPhoto()
        else if (e.key === 'ArrowRight') nextPhoto()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen, mediaModalOpen, images.length])

  const nextPhoto = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const prevPhoto = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  function openLightbox(index: number) {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  function openMediaModal(type: 'video' | '3d') {
    setMediaModalType(type)
    setMediaModalOpen(true)
  }

  function toggleFavorite() {
    const favorites = JSON.parse(localStorage.getItem('nemovize_favorites') || '[]')
    if (isFavorite) {
      localStorage.setItem('nemovize_favorites', JSON.stringify(favorites.filter((id: string) => id !== property.id)))
    } else {
      favorites.push(property.id)
      localStorage.setItem('nemovize_favorites', JSON.stringify(favorites))
    }
    setIsFavorite(!isFavorite)
  }

  async function handleShare() {
    const shareData = {
      title: property.title,
      text: property.description ?? '',
      url: window.location.href,
    }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
        setShareTooltip(true)
        setTimeout(() => setShareTooltip(false), 2000)
      }
    } catch {
      // user cancelled
    }
  }

  async function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      // Placeholder - v budoucnu napojit na Supabase
      await new Promise((resolve) => setTimeout(resolve, 800))
      alert('Děkujeme! Váš zájem byl odeslán. Brzy se vám ozveme.')
      setLeadForm({ name: '', email: '', phone: '', message: '', gdprConsent: false })
      setShowContactForm(false)
    } catch {
      alert('Omlouváme se, nepodařilo se odeslat. Zkuste to znovu.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function getEmbedUrl(url: string): string {
    if (!url) return ''
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0]
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0]
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url
    }
    if (url.includes('vimeo.com/') && !url.includes('player.vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0]
      return `https://player.vimeo.com/video/${videoId}`
    }
    return url
  }

  const minSwipeDistance = 50

  function onTouchStart(e: React.TouchEvent) {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  function onTouchMove(e: React.TouchEvent) {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  function onTouchEnd() {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    if (distance > minSwipeDistance) nextPhoto()
    else if (distance < -minSwipeDistance) prevPhoto()
  }

  function getImageUrl(img: any): string {
    if (!img?.url) return placeholderImage
    if (img.url.startsWith('/')) return placeholderImage
    return img.url
  }

  const transactionLabel = property.transaction_type === 'sale' ? 'Prodej' : property.transaction_type === 'rent' ? 'Pronájem' : property.listing_type
  const propertyTypeLabel = property.property_type === 'byt' ? 'Byt' : property.property_type === 'dům' ? 'Dům' : property.property_type === 'pozemek' ? 'Pozemek' : property.property_type
  const isSale = property.transaction_type === 'sale' || property.listing_type === 'Prodej'
  const descriptionLong = property.description && property.description.length > 500

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs + akce */}
        <div className="flex items-center justify-between mb-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Domů</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/nemovitosti" className="hover:text-foreground transition-colors">Nemovitosti</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-foreground font-medium truncate max-w-[200px]">{property.title}</span>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleFavorite}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Přidat do oblíbených"
            >
              <Heart className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <div className="relative">
              <button
                onClick={handleShare}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Sdílet"
              >
                <Share2 className="w-5 h-5" />
              </button>
              {shareTooltip && (
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap">
                  Zkopírováno!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Galerie - hlavní foto + video/3D/thumbnaily */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3 mb-8 lg:h-[600px]">
          {/* Hlavní fotka */}
          <div
            className="relative aspect-[3/2] lg:aspect-auto lg:h-full rounded-2xl overflow-hidden cursor-pointer hover:opacity-95 transition-opacity bg-muted"
            onClick={() => images.length > 0 && openLightbox(0)}
          >
            <img
              src={getImageUrl(mainImage)}
              alt={property.title}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = placeholderImage }}
            />
            {images.length > 0 && (
              <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-sm">
                {images.length} fotek
              </div>
            )}
          </div>

          {/* Pravý sloupec galerie - video, 3D, thumbnaily */}
          <div className="hidden lg:grid grid-cols-1 gap-3 h-full">
            {/* Video thumbnail */}
            {property.video_url && (
              <div
                className="relative rounded-xl overflow-hidden cursor-pointer hover:opacity-95 transition-opacity bg-muted group"
                onClick={() => openMediaModal('video')}
              >
                <img
                  src={getImageUrl(images[0])}
                  alt="Video náhled"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = placeholderImage }}
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="bg-white/90 rounded-full p-4 group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-accent fill-accent" />
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  Video prohlídka
                </div>
              </div>
            )}

            {/* 3D Tour thumbnail */}
            {(property.virtual_tour_url || property.matterport_url) && (
              <div
                className="relative rounded-xl overflow-hidden cursor-pointer hover:opacity-95 transition-opacity bg-muted group"
                onClick={() => openMediaModal('3d')}
              >
                <img
                  src={getImageUrl(images[0])}
                  alt="3D prohlídka náhled"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = placeholderImage }}
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="bg-white/90 rounded-full p-4 group-hover:scale-110 transition-transform">
                    <Scan className="w-8 h-8 text-accent" />
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  3D prohlídka
                </div>
              </div>
            )}

            {/* Regular thumbnaily - vyplní zbývající místo */}
            {images.slice(1, property.video_url || property.virtual_tour_url || property.matterport_url ? 2 : 3).map((image: any, index: number) => {
              const isLastThumb = !property.video_url && !property.virtual_tour_url && !property.matterport_url
                ? index === 1
                : index === 0

              return (
                <div
                  key={image.id || index}
                  className="relative rounded-xl overflow-hidden cursor-pointer hover:opacity-95 transition-opacity bg-muted"
                  onClick={() => {
                    if (isLastThumb && images.length > 3) {
                      document.getElementById('fotogalerie')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    } else {
                      openLightbox(index + 1)
                    }
                  }}
                >
                  <img
                    src={getImageUrl(image)}
                    alt={`Fotografie ${index + 2}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = placeholderImage }}
                  />
                  {isLastThumb && images.length > 3 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">Další fotky ({images.length})</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Media Modal pro video a 3D */}
        {mediaModalOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setMediaModalOpen(false)}
          >
            <button
              onClick={() => setMediaModalOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="relative w-full h-full max-w-7xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              {mediaModalType === 'video' && property.video_url && (
                <iframe
                  src={getEmbedUrl(property.video_url)}
                  className="w-full h-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
              {mediaModalType === '3d' && (property.virtual_tour_url || property.matterport_url) && (
                <iframe
                  src={getEmbedUrl(property.virtual_tour_url || property.matterport_url)}
                  className="w-full h-full rounded-lg"
                  allow="xr-spatial-tracking; gyroscope; accelerometer"
                  allowFullScreen
                />
              )}
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
              {mediaModalType === 'video' ? 'Video prohlídka' : '3D virtuální prohlídka'}
            </div>
          </div>
        )}

        {/* Lightbox */}
        {lightboxOpen && images.length > 0 && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxOpen(false) }}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="w-8 h-8" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); prevPhoto() }}
              className="absolute left-4 text-white hover:text-gray-300 z-10"
            >
              <ChevronLeft className="w-12 h-12" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextPhoto() }}
              className="absolute right-4 text-white hover:text-gray-300 z-10"
            >
              <ChevronRight className="w-12 h-12" />
            </button>
            <div className="relative w-full h-full max-w-6xl max-h-[85vh] mx-4" onClick={(e) => e.stopPropagation()}>
              <img
                src={getImageUrl(images[lightboxIndex])}
                alt={`Fotografie ${lightboxIndex + 1}`}
                className="w-full h-full object-contain"
                onError={(e) => { (e.target as HTMLImageElement).src = placeholderImage }}
              />
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
              {lightboxIndex + 1} / {images.length}
            </div>
          </div>
        )}

        {/* Obsah - 2 sloupce */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Levý sloupec */}
          <div className="lg:col-span-2 space-y-8">
            {/* Badges + nadpis + cena */}
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                {transactionLabel && (
                  <span className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-accent text-accent-foreground">
                    {transactionLabel}
                  </span>
                )}
                {propertyTypeLabel && (
                  <span className="px-3 py-1.5 rounded-lg text-sm font-medium bg-muted text-foreground">
                    {propertyTypeLabel}
                  </span>
                )}
                {property.status === 'reserved' && (
                  <span className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-yellow-100 text-yellow-800">
                    Rezervováno
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">{property.title}</h1>

              <div className="mb-6">
                <div className="text-3xl sm:text-4xl font-bold text-foreground mb-1">
                  {formatPrice(property.price)}
                </div>
                {pricePerSqm && isSale && (
                  <div className="text-base text-muted-foreground">
                    {new Intl.NumberFormat('cs-CZ').format(pricePerSqm)} Kč/m²
                  </div>
                )}
                {property.monthly_fees && (
                  <div className="text-sm text-muted-foreground mt-1">
                    Měsíční poplatky: {new Intl.NumberFormat('cs-CZ').format(property.monthly_fees)} Kč
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-5 h-5" />
                <span>
                  {property.address && `${property.address}, `}
                  {property.city}
                  {property.district && ` - ${property.district}`}
                </span>
              </div>
            </div>

            {/* Klíčové parametry */}
            <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {property.floor_area && (
                  <div className="text-center">
                    <Maximize className="w-6 h-6 mx-auto mb-2 text-accent" />
                    <div className="text-lg font-semibold">{property.floor_area} m²</div>
                    <div className="text-sm text-muted-foreground">Užitná plocha</div>
                  </div>
                )}
                {property.layout && (
                  <div className="text-center">
                    <BedDouble className="w-6 h-6 mx-auto mb-2 text-accent" />
                    <div className="text-lg font-semibold">{property.layout}</div>
                    <div className="text-sm text-muted-foreground">Dispozice</div>
                  </div>
                )}
                {property.floor != null && (
                  <div className="text-center">
                    <Building className="w-6 h-6 mx-auto mb-2 text-accent" />
                    <div className="text-lg font-semibold">{property.floor}./{property.total_floors || '?'}</div>
                    <div className="text-sm text-muted-foreground">Patro</div>
                  </div>
                )}
                {property.energy_rating && (
                  <div className="text-center">
                    <Zap className="w-6 h-6 mx-auto mb-2 text-accent" />
                    <div className="text-lg font-semibold">{property.energy_rating}</div>
                    <div className="text-sm text-muted-foreground">Energ. třída</div>
                  </div>
                )}
                {property.lot_area && (
                  <div className="text-center">
                    <Ruler className="w-6 h-6 mx-auto mb-2 text-accent" />
                    <div className="text-lg font-semibold">{property.lot_area} m²</div>
                    <div className="text-sm text-muted-foreground">Pozemek</div>
                  </div>
                )}
                {property.year_built && (
                  <div className="text-center">
                    <Calendar className="w-6 h-6 mx-auto mb-2 text-accent" />
                    <div className="text-lg font-semibold">{property.year_built}</div>
                    <div className="text-sm text-muted-foreground">Rok výstavby</div>
                  </div>
                )}
                {property.parking && (
                  <div className="text-center">
                    <Car className="w-6 h-6 mx-auto mb-2 text-accent" />
                    <div className="text-lg font-semibold">{property.parking}</div>
                    <div className="text-sm text-muted-foreground">Parkování</div>
                  </div>
                )}
                {property.rooms && !property.layout && (
                  <div className="text-center">
                    <Home className="w-6 h-6 mx-auto mb-2 text-accent" />
                    <div className="text-lg font-semibold">{property.rooms}</div>
                    <div className="text-sm text-muted-foreground">Pokojů</div>
                  </div>
                )}
              </div>
            </div>

            {/* Popis - rozbalovací */}
            {property.description && (
              <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-xl font-semibold mb-4">Popis</h2>
                <div className="prose prose-gray max-w-none">
                  <p className={`text-muted-foreground leading-relaxed whitespace-pre-line ${descriptionLong && !descriptionExpanded ? 'line-clamp-6' : ''}`}>
                    {property.description}
                  </p>
                </div>
                {descriptionLong && (
                  <button
                    onClick={() => setDescriptionExpanded(!descriptionExpanded)}
                    className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
                  >
                    {descriptionExpanded ? (
                      <>Méně <ChevronUp className="w-4 h-4" /></>
                    ) : (
                      <>Celý popis <ChevronDown className="w-4 h-4" /></>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Detailní informace */}
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <h2 className="text-xl font-semibold mb-4">Detailní informace</h2>
              <div className="glass-card p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-0">
                  {([
                    ['Typ nemovitosti', propertyTypeLabel],
                    ['Transakce', transactionLabel],
                    ['Dispozice', property.layout],
                    ['Užitná plocha', property.floor_area ? `${property.floor_area} m²` : null],
                    ['Plocha pozemku', property.lot_area ? `${property.lot_area} m²` : null],
                    ['Patro', property.floor != null ? `${property.floor}./${property.total_floors || '?'}` : null],
                    ['Konstrukce', property.construction],
                    ['Stav', property.condition],
                    ['Vlastnictví', property.ownership],
                    ['Rok výstavby', property.year_built],
                    ['Rok rekonstrukce', property.year_reconstructed],
                    ['Energetický štítek', property.energy_rating],
                    ['Balkón', property.balcony_area ? `${property.balcony_area} m²` : property.balcony ? 'Ano' : null],
                    ['Terasa', property.terrace_area ? `${property.terrace_area} m²` : property.terrace ? 'Ano' : null],
                    ['Lodžie', property.loggia_area ? `${property.loggia_area} m²` : null],
                    ['Sklep', property.cellar_area ? `${property.cellar_area} m²` : null],
                    ['Výtah', property.elevator ? 'Ano' : null],
                    ['Parkování', property.parking],
                    ['Vybavení', property.furnished],
                    ['Topení', property.heating],
                    ['Cena za m²', pricePerSqm ? `${new Intl.NumberFormat('cs-CZ').format(pricePerSqm)} Kč` : null],
                  ] as [string, any][])
                    .filter(([, val]) => val != null && val !== '' && val !== false)
                    .map(([label, value]) => (
                      <div key={label} className="flex justify-between py-3 border-b border-border/50">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-semibold text-foreground">{value}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Vybavení a vlastnosti */}
            {(() => {
              const features = [
                [property.balcony, 'Balkón'],
                [property.terrace, 'Terasa'],
                [property.elevator, 'Výtah'],
                [property.parking, 'Parkování'],
                [property.cellar, 'Sklep'],
                [property.garden, 'Zahrada'],
                [property.garage, 'Garáž'],
                [property.pool, 'Bazén'],
                [property.air_conditioning, 'Klimatizace'],
                [property.security_system, 'Bezpečnostní systém'],
                [property.furnished === 'ano' || property.furnished === 'částečně', property.furnished === 'částečně' ? 'Částečně zařízeno' : 'Plně zařízeno'],
              ].filter(([val]) => val) as [boolean, string][]

              if (features.length === 0) return null

              return (
                <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  <h2 className="text-xl font-semibold mb-4">Vybavení a vlastnosti</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {features.map(([, label]) => (
                      <div
                        key={label}
                        className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[rgba(240,255,240,0.65)] text-green-700"
                      >
                        <Check className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm font-medium">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })()}

            {/* Mapa */}
            {(property.gps_lat && property.gps_lng) && (
              <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <h2 className="text-xl font-semibold mb-4">Umístění</h2>
                <div className="rounded-2xl overflow-hidden border border-border">
                  <iframe
                    src={`https://frame.mapy.cz/zakladni?x=${property.gps_lng}&y=${property.gps_lat}&z=15&l=0&base=ophoto&m3d=1&height=300&width=600`}
                    className="w-full h-[400px] border-0"
                    loading="lazy"
                    title="Mapa umístění nemovitosti"
                  />
                </div>
                <div className="mt-3 flex items-center gap-4">
                  <a
                    href={`https://mapy.cz/zakladni?x=${property.gps_lng}&y=${property.gps_lat}&z=17`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Otevřít na Mapy.cz
                  </a>
                  <a
                    href={`https://www.google.com/maps?q=${property.gps_lat},${property.gps_lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Google Maps
                  </a>
                </div>
              </div>
            )}

            {/* Kompletní fotogalerie */}
            {images.length > 0 && (
              <div id="fotogalerie" className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <h2 className="text-xl font-semibold mb-4">
                  Kompletní fotogalerie ({images.length})
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {images.map((image: any, index: number) => (
                    <div
                      key={image.id || index}
                      className="relative aspect-[3/2] rounded-xl overflow-hidden bg-muted cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => openLightbox(index)}
                    >
                      <img
                        src={getImageUrl(image)}
                        alt={`Fotografie ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = placeholderImage }}
                      />
                      {image.is_primary && (
                        <div className="absolute top-2 left-2 bg-accent text-white text-xs px-2 py-1 rounded">
                          Hlavní
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pravý sloupec - sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              {/* Makléř */}
              {broker && (
                <div className="rounded-2xl bg-[#1e3a5f] p-6 shadow-lg animate-fade-in">
                  <h3 className="text-lg font-semibold text-white mb-4">Váš makléř</h3>

                  <Link href={`/makleri/${broker.id}`} className="block hover:opacity-90 transition-opacity">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/20 flex-shrink-0">
                        <span className="text-2xl font-bold text-white">
                          {broker.first_name?.[0]}{broker.last_name?.[0]}
                        </span>
                      </div>
                      <div>
                        <div className="font-bold text-white text-lg">
                          {broker.full_name}
                        </div>
                        {agency && (
                          <div className="text-sm text-white/80">{agency.name}</div>
                        )}
                        <div className="text-xs text-white/90 mt-1 font-medium">Zobrazit profil →</div>
                      </div>
                    </div>
                  </Link>

                  <div className="mt-6 space-y-4">
                    {!showContactForm ? (
                      <>
                        <button
                          onClick={() => setShowContactForm(true)}
                          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-[#1e3a5f] font-bold hover:bg-white/90 transition-colors shadow-lg btn-enhanced"
                        >
                          Mám zájem
                        </button>

                        <div className="space-y-3 pt-2">
                          {broker.phone && (
                            <div>
                              <a
                                href={`tel:${broker.phone}`}
                                className="block text-xl font-bold text-white hover:text-white/80 transition-colors"
                              >
                                {formatPhone(broker.phone)}
                              </a>
                              <a
                                href={`tel:${broker.phone}`}
                                className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white transition-colors mt-1"
                              >
                                <Phone className="w-4 h-4" />
                                Zavolat
                              </a>
                            </div>
                          )}
                          {broker.email && (
                            <div>
                              <a
                                href={`mailto:${broker.email}`}
                                className="block text-lg font-bold text-white hover:text-white/80 transition-colors break-all"
                              >
                                {broker.email}
                              </a>
                              <a
                                href={`mailto:${broker.email}`}
                                className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white transition-colors mt-1"
                              >
                                <Mail className="w-4 h-4" />
                                Odeslat email
                              </a>
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <form onSubmit={handleLeadSubmit} className="space-y-3">
                        <input
                          type="text"
                          required
                          value={leadForm.name}
                          onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                          placeholder="Jméno a příjmení *"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-white/30 bg-white/10 text-white placeholder:text-white/50 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-colors"
                        />
                        <input
                          type="email"
                          required
                          value={leadForm.email}
                          onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                          placeholder="Email *"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-white/30 bg-white/10 text-white placeholder:text-white/50 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-colors"
                        />
                        <input
                          type="tel"
                          required
                          value={leadForm.phone}
                          onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                          placeholder="Telefon *"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-white/30 bg-white/10 text-white placeholder:text-white/50 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-colors"
                        />
                        <textarea
                          rows={3}
                          value={leadForm.message}
                          onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
                          placeholder={`Mám zájem o nemovitost: ${property.title}`}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-white/30 bg-white/10 text-white placeholder:text-white/50 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-colors resize-none"
                        />
                        <div className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            id="gdpr"
                            required
                            checked={leadForm.gdprConsent}
                            onChange={(e) => setLeadForm({ ...leadForm, gdprConsent: e.target.checked })}
                            className="mt-1 rounded border-white/30"
                          />
                          <label htmlFor="gdpr" className="text-xs text-white/80">
                            Souhlasím se zpracováním osobních údajů za účelem kontaktování ohledně této nemovitosti *
                          </label>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2 text-sm rounded-lg bg-white text-[#1e3a5f] font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSubmitting ? 'Odesílám...' : 'Odeslat'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowContactForm(false)}
                            className="px-4 py-2 text-sm rounded-lg border-2 border-white/30 text-white font-medium hover:bg-white/10 transition-colors"
                          >
                            Zrušit
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              )}

              {/* Kontaktní formulář - fallback bez brokera */}
              {!broker && (
                <div className="rounded-2xl bg-[#1e3a5f] p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-white mb-4">Máte zájem?</h3>
                  <form onSubmit={handleLeadSubmit} className="space-y-3">
                    <input
                      type="text"
                      required
                      value={leadForm.name}
                      onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                      placeholder="Jméno a příjmení *"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-white/30 bg-white/10 text-white placeholder:text-white/50 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-colors"
                    />
                    <input
                      type="email"
                      required
                      value={leadForm.email}
                      onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                      placeholder="Email *"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-white/30 bg-white/10 text-white placeholder:text-white/50 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-colors"
                    />
                    <input
                      type="tel"
                      required
                      value={leadForm.phone}
                      onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                      placeholder="Telefon *"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-white/30 bg-white/10 text-white placeholder:text-white/50 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-colors"
                    />
                    <textarea
                      rows={3}
                      value={leadForm.message}
                      onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
                      placeholder={`Mám zájem o nemovitost: ${property.title}`}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-white/30 bg-white/10 text-white placeholder:text-white/50 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-colors resize-none"
                    />
                    <div className="flex items-start gap-2">
                      <input type="checkbox" id="gdpr-fallback" required checked={leadForm.gdprConsent} onChange={(e) => setLeadForm({ ...leadForm, gdprConsent: e.target.checked })} className="mt-1 rounded border-white/30" />
                      <label htmlFor="gdpr-fallback" className="text-xs text-white/80">Souhlasím se zpracováním osobních údajů *</label>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 text-sm rounded-lg bg-white text-[#1e3a5f] font-bold hover:bg-white/90 transition-colors disabled:opacity-50 btn-enhanced"
                    >
                      {isSubmitting ? 'Odesílám...' : 'Odeslat poptávku'}
                    </button>
                  </form>
                </div>
              )}

              {/* Hypoteční kalkulačka - jen prodej */}
              {isSale && property.price && (
                <Card className="animate-fade-in overflow-hidden" style={{ animationDelay: '0.2s' }}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Calculator className="w-5 h-5 text-accent" />
                      <h3 className="text-base font-semibold">Hypoteční kalkulačka</h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Výše hypotéky</span>
                          <span className="font-medium">{new Intl.NumberFormat('cs-CZ').format(mortgageAmount)} Kč</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={property.price}
                          step={100000}
                          value={mortgageAmount}
                          onChange={(e) => setMortgageAmount(Number(e.target.value))}
                          className="w-full accent-accent"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>0 Kč</span>
                          <span>{new Intl.NumberFormat('cs-CZ').format(property.price)} Kč</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Doba splácení</span>
                          <span className="font-medium">{mortgageYears} let</span>
                        </div>
                        <input
                          type="range"
                          min={5}
                          max={35}
                          step={1}
                          value={mortgageYears}
                          onChange={(e) => setMortgageYears(Number(e.target.value))}
                          className="w-full accent-accent"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>5 let</span>
                          <span>35 let</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Úroková sazba</span>
                          <span className="font-medium">{mortgageRate.toFixed(1)} %</span>
                        </div>
                        <input
                          type="range"
                          min={2}
                          max={10}
                          step={0.1}
                          value={mortgageRate}
                          onChange={(e) => setMortgageRate(Number(e.target.value))}
                          className="w-full accent-accent"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>2 %</span>
                          <span>10 %</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border">
                        <div className="text-sm text-muted-foreground mb-1">Měsíční splátka</div>
                        <div className="text-2xl font-bold text-accent">
                          {new Intl.NumberFormat('cs-CZ').format(monthlyPayment)} Kč
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Celkem zaplatíte: {new Intl.NumberFormat('cs-CZ').format(monthlyPayment * mortgageYears * 12)} Kč
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Agentura */}
              {agency && (
                <Card className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  <CardContent className="p-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Realitní kancelář</h3>
                    <div className="flex items-center gap-3">
                      {agency.logo_url ? (
                        <img src={agency.logo_url} alt={agency.name} className="w-12 h-12 rounded-lg object-contain" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                          <Building className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <div className="font-semibold">{agency.name}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
