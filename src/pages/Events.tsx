import { useState, useEffect } from 'react'
import { FashionEvent, getEvents } from '@/services/fashion_events'
import { useRealtime } from '@/hooks/use-realtime'
import pb from '@/lib/pocketbase/client'
import { Camera, Calendar } from 'lucide-react'

export default function EventsPage() {
  const [events, setEvents] = useState<FashionEvent[]>([])

  const loadEvents = async () => {
    try {
      const data = await getEvents()
      setEvents(
        data.filter((e) => e.display_order > 0).sort((a, b) => a.display_order - b.display_order),
      )
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  useRealtime('fashion_events', loadEvents)

  const spotlight = events.find((e) => e.is_spotlight) || events[0]
  const secondaries = events.filter((e) => e.id !== spotlight?.id)

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16 space-y-4">
          <h1 className="font-serif text-6xl md:text-8xl font-bold tracking-tighter text-foreground">
            HOLOFOTE
          </h1>
          <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-forest/10 rounded-full border border-brand-forest/20">
            <Camera className="w-5 h-5 text-brand-forest" />
            <span className="text-sm font-bold tracking-[0.2em] uppercase text-brand-forest">
              Colunista: Fabia Mendonça
            </span>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground font-serif text-lg italic">
            A coluna de hoje ainda está sendo preparada...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Main Highlight */}
            {spotlight && (
              <div className="lg:col-span-7 xl:col-span-8 group flex flex-col">
                <div className="relative aspect-[3/4] md:aspect-square lg:aspect-[4/3] overflow-hidden rounded-sm bg-muted mb-6 shadow-xl">
                  {spotlight.image ? (
                    <img
                      src={pb.files.getURL(spotlight, spotlight.image)}
                      alt={spotlight.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted/50 text-muted-foreground">
                      <Camera className="w-12 h-12 opacity-20" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-brand-forest text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 shadow-sm">
                    Destaque
                  </div>
                </div>
                <div className="space-y-3 px-2">
                  <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight text-foreground">
                    {spotlight.title}
                  </h2>
                  {spotlight.description && (
                    <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-3xl font-serif">
                      {spotlight.description}
                    </p>
                  )}
                  <div className="flex items-center text-xs text-muted-foreground/70 uppercase tracking-widest font-bold pt-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(spotlight.date).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
            )}

            {/* Secondary Entries */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-8 lg:pt-0 pt-8 border-t lg:border-t-0 lg:border-l lg:pl-12 border-border">
              <h3 className="font-serif text-xl font-bold uppercase tracking-widest text-muted-foreground mb-2 hidden lg:block">
                Mais Vistos
              </h3>
              {secondaries.map((item, index) => (
                <div
                  key={item.id}
                  className="group flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-5"
                >
                  <div className="w-full sm:w-40 lg:w-full xl:w-32 aspect-square shrink-0 overflow-hidden bg-muted shadow-md">
                    {item.image ? (
                      <img
                        src={pb.files.getURL(item, item.image)}
                        alt={item.title}
                        className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Camera className="w-8 h-8 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="text-[10px] font-bold text-brand-forest uppercase tracking-widest mb-2">
                      Foto {index + 2}
                    </div>
                    <h4 className="font-serif text-xl font-bold leading-tight mb-2 group-hover:text-brand-forest transition-colors">
                      {item.title}
                    </h4>
                    {item.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3 font-serif">
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
    </div>
  )
}
