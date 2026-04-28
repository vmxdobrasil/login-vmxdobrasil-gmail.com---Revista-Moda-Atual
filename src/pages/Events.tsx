import { useState, useEffect } from 'react'
import { FashionEvent, getEvents } from '@/services/fashion_events'
import { useRealtime } from '@/hooks/use-realtime'
import pb from '@/lib/pocketbase/client'
import { Camera, Calendar, Share2, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

const CATEGORIES = ['All', 'Desfile', 'Festa', 'Tapete Vermelho', 'Outros']

export default function EventsPage() {
  const [events, setEvents] = useState<FashionEvent[]>([])
  const [activeCategory, setActiveCategory] = useState('All')

  const loadEvents = async () => {
    try {
      const data = await getEvents()
      setEvents(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])
  useRealtime('fashion_events', loadEvents)

  const filteredEvents =
    activeCategory === 'All' ? events : events.filter((e) => e.category === activeCategory)

  // Spotlight is the first `is_spotlight` that matches the filter, or just the first event
  const spotlight = filteredEvents.find((e) => e.is_spotlight) || filteredEvents[0]
  const archive = filteredEvents.filter((e) => e.id !== spotlight?.id)

  const galleryData: any[] = (spotlight?.gallery_data as any[]) || []

  const handleShare = (legend: string, imgUrl?: string) => {
    const text = `Confira ${legend} na Coluna Holofote da Revista Moda Atual!`
    const url = window.location.href
    if (navigator.share) {
      navigator.share({ title: legend, text, url }).catch(console.error)
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12 space-y-4">
          <h1 className="font-serif text-6xl md:text-8xl font-bold tracking-tighter text-foreground">
            HOLOFOTE
          </h1>
          <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-forest/10 rounded-full border border-brand-forest/20 shadow-sm">
            <Camera className="w-5 h-5 text-brand-forest" />
            <span className="text-sm font-bold tracking-[0.2em] uppercase text-brand-forest">
              Colunista: Fabia Mendonça
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-16">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? 'default' : 'outline'}
              className={`rounded-full px-6 text-xs uppercase tracking-widest font-bold ${activeCategory === cat ? 'bg-brand-forest text-white' : 'text-muted-foreground hover:text-brand-forest'}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat === 'All' ? 'Todas' : cat}
            </Button>
          ))}
        </div>

        {!spotlight ? (
          <div className="text-center py-20 text-muted-foreground font-serif text-lg italic">
            Nenhuma cobertura encontrada para esta categoria.
          </div>
        ) : (
          <div className="space-y-24">
            {/* Main Coverage */}
            <div className="space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                <div className="lg:col-span-7 relative aspect-[4/3] overflow-hidden bg-muted shadow-2xl rounded-sm group">
                  {spotlight.image ? (
                    <img
                      src={pb.files.getURL(spotlight, spotlight.image)}
                      alt={spotlight.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Camera className="w-12 h-12 opacity-20" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-brand-forest text-white text-xs font-bold uppercase tracking-wider px-4 py-2 shadow-sm backdrop-blur-md bg-brand-forest/90">
                    {spotlight.category || 'Cobertura'}
                  </div>
                </div>
                <div className="lg:col-span-5 space-y-6">
                  <div className="flex items-center text-xs text-muted-foreground/70 uppercase tracking-widest font-bold">
                    <Calendar className="w-4 h-4 mr-2 text-brand-forest" />
                    {new Date(spotlight.date).toLocaleDateString('pt-BR')}
                  </div>
                  <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight text-foreground">
                    {spotlight.title}
                  </h2>
                  {spotlight.description && (
                    <p className="text-muted-foreground text-lg leading-relaxed font-serif">
                      {spotlight.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Gallery Grid */}
              {galleryData.length > 0 && (
                <div className="pt-12 border-t border-border/50">
                  <h3 className="font-serif text-2xl font-bold mb-8 text-center uppercase tracking-widest">
                    Galeria do Evento
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {galleryData.map((item, idx) => (
                      <div key={idx} className="group relative flex flex-col gap-3">
                        <div className="aspect-[3/4] bg-muted overflow-hidden rounded-sm shadow-md relative">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Camera className="w-8 h-8 text-muted-foreground/20" />
                            </div>
                          )}
                          <Button
                            variant="secondary"
                            size="icon"
                            className="absolute bottom-3 right-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0"
                            onClick={() => handleShare(item.title, item.imageUrl)}
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-lg leading-tight">
                            {item.title}
                          </h4>
                          {item.description && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Archive Section */}
            {archive.length > 0 && (
              <div className="pt-20 border-t border-border">
                <h3 className="font-serif text-3xl font-bold mb-10 text-center">
                  Coberturas Anteriores
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {archive.map((ev) => (
                    <div key={ev.id} className="group cursor-pointer">
                      <div className="aspect-video bg-muted overflow-hidden rounded-sm shadow-md mb-4 relative">
                        {ev.image ? (
                          <img
                            src={pb.files.getURL(ev, ev.image)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Camera className="w-8 h-8 text-muted-foreground/20" />
                          </div>
                        )}
                        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-foreground text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm">
                          {ev.category || 'Outros'}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                          {new Date(ev.date).toLocaleDateString('pt-BR')}
                        </div>
                        <h4 className="font-serif text-xl font-bold leading-tight group-hover:text-brand-forest transition-colors">
                          {ev.title}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
