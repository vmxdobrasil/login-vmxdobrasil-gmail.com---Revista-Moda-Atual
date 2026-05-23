import { useState, useEffect } from 'react'
import { MagazineIssue, getMagazineIssues } from '@/services/magazine_issues'
import pb from '@/lib/pocketbase/client'
import { BookOpen, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function MagazinePage() {
  const [issues, setIssues] = useState<MagazineIssue[]>([])
  const [selectedIssue, setSelectedIssue] = useState<MagazineIssue | null>(null)
  const [currentPage, setCurrentPage] = useState(0)

  useEffect(() => {
    getMagazineIssues().then(setIssues).catch(console.error)
  }, [])

  const handleOpen = (issue: MagazineIssue) => {
    setSelectedIssue(issue)
    setCurrentPage(0)
  }

  const handleClose = () => {
    setSelectedIssue(null)
  }

  const next = () => {
    if (!selectedIssue) return
    const total = getPages(selectedIssue).length
    if (currentPage < total - 1) setCurrentPage((p) => p + 1)
  }

  const prev = () => {
    if (currentPage > 0) setCurrentPage((p) => p - 1)
  }

  const getCoverUrl = (issue: MagazineIssue) => {
    return issue.cover_image
      ? pb.files.getURL(issue, issue.cover_image)
      : 'https://img.usecurling.com/p/600/800?q=fashion%20magazine'
  }

  const getPages = (issue: MagazineIssue) => {
    if (issue.pages && issue.pages.length > 0) {
      return issue.pages.map((p) => pb.files.getURL(issue, p))
    }
    return []
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-8 md:p-12 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tighter text-foreground">
            Curadoria da Editora
          </h1>
          <p className="text-muted-foreground font-serif text-lg max-w-2xl mx-auto">
            Nossas edições exclusivas preparadas com foco em tendências, acessórios, beleza e
            colorimetria.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className="group cursor-pointer space-y-4"
              onClick={() => handleOpen(issue)}
            >
              <div className="aspect-[3/4] bg-muted shadow-lg group-hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                <img
                  src={getCoverUrl(issue)}
                  alt={issue.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                  <Button
                    variant="secondary"
                    className="font-bold uppercase tracking-wider text-xs pointer-events-none"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Ver Edição
                  </Button>
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-serif font-bold text-lg leading-tight">{issue.title}</h3>
                {issue.edition_number && (
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
                    Edição {issue.edition_number}
                  </p>
                )}
              </div>
            </div>
          ))}
          {issues.length === 0 && (
            <div className="col-span-full text-center py-20 text-muted-foreground italic font-serif">
              Nenhuma edição publicada no momento.
            </div>
          )}
        </div>
      </div>

      {selectedIssue && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="absolute top-0 inset-x-0 p-4 md:p-6 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent z-20 pointer-events-none">
            <div className="text-white">
              <h2 className="font-serif text-2xl md:text-3xl font-bold">{selectedIssue.title}</h2>
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 mt-1 text-white/70 text-sm font-medium tracking-wide">
                {selectedIssue.edition_number && <span>Edição {selectedIssue.edition_number}</span>}
                {selectedIssue.publication_date && (
                  <>
                    <span className="hidden md:inline">•</span>
                    <span className="capitalize">
                      {new Date(selectedIssue.publication_date).toLocaleDateString('pt-BR', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 pointer-events-auto shrink-0"
              onClick={handleClose}
            >
              <X className="w-8 h-8" />
            </Button>
          </div>

          <div className="relative w-full max-w-5xl flex-1 aspect-[3/4] md:aspect-auto md:h-[85vh] flex items-center justify-center p-4 mt-16 md:mt-0">
            {getPages(selectedIssue).length > 0 ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 md:-left-16 text-white hover:bg-white/20 disabled:opacity-30 z-10"
                  onClick={(e) => {
                    e.stopPropagation()
                    prev()
                  }}
                  disabled={currentPage === 0}
                >
                  <ChevronLeft className="w-12 h-12" />
                </Button>

                <img
                  key={currentPage}
                  src={getPages(selectedIssue)[currentPage]}
                  className="max-w-full max-h-full object-contain shadow-2xl animate-fade-in pointer-events-none"
                  alt={`Página ${currentPage + 1}`}
                />

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 md:-right-16 text-white hover:bg-white/20 disabled:opacity-30 z-10"
                  onClick={(e) => {
                    e.stopPropagation()
                    next()
                  }}
                  disabled={currentPage === getPages(selectedIssue).length - 1}
                >
                  <ChevronRight className="w-12 h-12" />
                </Button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm tracking-widest font-mono">
                  {currentPage + 1} / {getPages(selectedIssue).length}
                </div>
              </>
            ) : (
              <div className="bg-white/10 backdrop-blur-md p-8 md:p-12 text-center rounded-xl max-w-lg mx-auto border border-white/20 shadow-2xl">
                <BookOpen className="w-16 h-16 mx-auto mb-6 text-brand-gold opacity-80" />
                <h3 className="font-serif text-2xl text-white mb-4">Em Preparação</h3>
                <p className="text-white/80 font-sans leading-relaxed">
                  Esta edição está sendo preparada pela nossa Editora de Moda. Volte em breve!
                </p>
                <Button
                  onClick={handleClose}
                  className="mt-8 bg-brand-gold hover:bg-brand-gold/90 text-black font-semibold"
                >
                  Voltar para o Acervo
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
