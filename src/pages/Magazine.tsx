import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getPublishedIssues, MagazineIssue, getIssue } from '@/services/magazine_issues'
import pb from '@/lib/pocketbase/client'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import { ArrowLeft, BookOpen, Loader2, Maximize, Minimize, Share } from 'lucide-react'
import { useRealtime } from '@/hooks/use-realtime'

export default function MagazinePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const idFromUrl = searchParams.get('id')
  const viewFromUrl = searchParams.get('view')

  const [issues, setIssues] = useState<MagazineIssue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [api, setApi] = useState<CarouselApi>()
  const [isFullscreen, setIsFullscreen] = useState(false)

  const fetchedIds = useRef<Set<string>>(new Set())

  const loadData = useCallback(async (isInitial = false, specificId?: string | null) => {
    try {
      if (isInitial) setLoading(true)

      const published = await getPublishedIssues()
      let allIssues = [...published]

      if (
        specificId &&
        !published.find((i) => i.id === specificId) &&
        !fetchedIds.current.has(specificId)
      ) {
        fetchedIds.current.add(specificId)
        try {
          const specificIssue = await getIssue(specificId)
          allIssues.push(specificIssue)
        } catch (e) {
          console.warn('Could not fetch specific issue, falling back to latest.', e)
        }
      }

      setIssues(allIssues)
      setError(null)
    } catch (err) {
      console.error(err)
      setError('Não foi possível carregar as edições da revista.')
    } finally {
      if (isInitial) setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData(true, idFromUrl)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useRealtime('magazine_issues', () => {
    loadData(false, idFromUrl)
  })

  useEffect(() => {
    if (
      !loading &&
      idFromUrl &&
      !issues.find((i) => i.id === idFromUrl) &&
      !fetchedIds.current.has(idFromUrl)
    ) {
      loadData(false, idFromUrl)
    }
  }, [idFromUrl, loading, issues, loadData])

  const targetIssue = (idFromUrl ? issues.find((i) => i.id === idFromUrl) : null) || issues[0]
  const isGridMode = viewFromUrl === 'archive' || (!targetIssue && issues.length === 0)

  useEffect(() => {
    if (!loading && targetIssue && targetIssue.id !== idFromUrl && viewFromUrl !== 'archive') {
      setSearchParams(
        (prev) => {
          prev.set('id', targetIssue.id)
          return prev
        },
        { replace: true },
      )
    }
  }, [loading, targetIssue, idFromUrl, viewFromUrl, setSearchParams])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!targetIssue || isGridMode) return
      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {})
          setIsFullscreen(false)
        } else {
          setSearchParams({ view: 'archive' })
        }
      }
      if (e.key === 'ArrowRight' && api) {
        api.scrollNext()
      }
      if (e.key === 'ArrowLeft' && api) {
        api.scrollPrev()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [targetIssue, isGridMode, api, setSearchParams])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }

  const handleBackToGrid = () => {
    setSearchParams({ view: 'archive' })
  }

  const handleSelectIssue = (issue: MagazineIssue) => {
    setSearchParams({ id: issue.id })
  }

  const handleExportPost = () => {
    console.log('Exporting post...', targetIssue?.title)
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-forest" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-red-500 font-medium">
        {error}
      </div>
    )
  }

  if (targetIssue && !isGridMode) {
    const pagesField = targetIssue.pages
    const pagesArray = Array.isArray(pagesField) ? pagesField : pagesField ? [pagesField] : []
    const hasPages = pagesArray.length > 0
    const pagesToDisplay = hasPages
      ? ([targetIssue.cover_image, ...pagesArray].filter(Boolean) as string[])
      : []

    return (
      <div className="h-full flex flex-col bg-[#111] text-white relative">
        <div className="p-4 flex flex-wrap gap-4 items-center justify-between border-b border-white/10 shrink-0 bg-black/40 backdrop-blur-sm z-10">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={handleBackToGrid}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao Acervo
            </Button>
            <div className="hidden md:flex items-center ml-4 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <span className="text-xs font-semibold tracking-wider uppercase text-white/70">
                ModaAtual Studio
              </span>
            </div>
          </div>

          <div className="text-center flex-1 order-last w-full md:w-auto md:order-none">
            <h2 className="font-serif font-bold text-lg tracking-wide">{targetIssue.title}</h2>
            {targetIssue.edition_number && (
              <p className="text-xs text-white/60">Edição {targetIssue.edition_number}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="text-white border-white/20 bg-transparent hover:bg-white/10"
              onClick={handleExportPost}
            >
              <Share className="w-4 h-4 mr-2" /> Exportar Post
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-t from-brand-forest/10 to-transparent pointer-events-none opacity-50" />

          {hasPages ? (
            <Carousel
              setApi={setApi}
              className="w-full max-w-4xl h-full flex flex-col justify-center"
            >
              <CarouselContent className="h-full items-center">
                {pagesToDisplay.map((page, i) => (
                  <CarouselItem key={i} className="flex items-center justify-center h-full">
                    <div className="relative h-[85vh] w-auto aspect-[3/4] bg-white shadow-2xl overflow-hidden md:rounded-r-md md:rounded-l-sm border border-black/5 ring-1 ring-white/10 transition-transform duration-500">
                      <img
                        src={pb.files.getURL(targetIssue, page)}
                        alt={`Página ${i + 1}`}
                        className="w-full h-full object-cover"
                        loading={i < 2 ? 'eager' : 'lazy'}
                      />
                      <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/30 via-black/5 to-transparent pointer-events-none" />
                      <div className="absolute inset-y-0 right-0 w-2 bg-gradient-to-l from-black/10 to-transparent pointer-events-none" />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {pagesToDisplay.length > 1 && (
                <>
                  <CarouselPrevious className="left-2 md:-left-12 bg-black/50 hover:bg-black/80 text-white border-white/20 h-12 w-12" />
                  <CarouselNext className="right-2 md:-right-12 bg-black/50 hover:bg-black/80 text-white border-white/20 h-12 w-12" />
                </>
              )}
            </Carousel>
          ) : (
            <div className="text-center text-white/50 bg-black/40 p-8 rounded-xl backdrop-blur-sm border border-white/10 shadow-2xl">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="font-serif text-lg">Esta edição não possui páginas cadastradas.</p>
              <Button
                variant="outline"
                className="mt-6 border-white/20 text-white hover:bg-white/10 hover:text-white bg-transparent"
                onClick={handleBackToGrid}
              >
                Explorar Acervo
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Grid Mode (Archive)
  return (
    <div className="h-full bg-background overflow-y-auto">
      <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-forest/10 flex items-center justify-center rounded-xl">
              <BookOpen className="w-6 h-6 text-brand-forest" />
            </div>
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                Acervo Digital
              </h1>
              <p className="text-muted-foreground mt-1">
                Acesse todas as publicações exclusivas da Moda Atual.
              </p>
            </div>
          </div>
        </div>

        {issues.length === 0 ? (
          <div className="text-center p-16 bg-muted/30 rounded-2xl border border-dashed">
            <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground font-serif text-lg">
              Nenhuma edição publicada no momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
            {issues
              .filter((i) => i.is_published)
              .map((issue) => (
                <div
                  key={issue.id}
                  className="group cursor-pointer flex flex-col gap-4"
                  onClick={() => handleSelectIssue(issue)}
                >
                  <div className="aspect-[3/4] rounded-lg overflow-hidden border shadow-sm transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:ring-2 ring-brand-forest/50 relative bg-muted flex-shrink-0">
                    {issue.cover_image ? (
                      <img
                        src={pb.files.getURL(issue, issue.cover_image, { thumb: '400x600' })}
                        alt={issue.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 bg-white"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-brand-forest/5 text-brand-forest/20">
                        <BookOpen className="w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Button
                        variant="secondary"
                        className="bg-white/90 text-black hover:bg-white border-0 shadow-lg"
                      >
                        Ler Agora
                      </Button>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base leading-tight group-hover:text-brand-forest transition-colors line-clamp-2">
                      {issue.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1.5 uppercase tracking-wider font-semibold">
                      {issue.edition_number ? `Edição ${issue.edition_number}` : 'Especial'}
                      {issue.publication_date &&
                        ` • ${new Date(issue.publication_date).getFullYear()}`}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
