import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import useEditorStore from '@/stores/use-editor-store'
import { CheckCircle2, Loader2, AlertCircle, LayoutTemplate } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'

const TEMPLATES = [
  {
    id: 'cover',
    name: 'Capa',
    description: 'Impactante, tipografia imensa sobrepondo a imagem.',
    previewImg: 'https://img.usecurling.com/p/400/600?q=vogue%20cover',
    tag: 'Destaque',
  },
  {
    id: 'minimalist',
    name: 'Minimalista',
    description: 'Design limpo, meia tela imagem, meia tela texto.',
    previewImg: 'https://img.usecurling.com/p/400/600?q=minimalist%20fashion',
  },
  {
    id: 'editorial',
    name: 'Editorial',
    description: 'Moldura fina, tipografia clássica e cores terrosas.',
    previewImg: 'https://img.usecurling.com/p/400/600?q=editorial%20layout',
    tag: 'Clássico',
  },
  {
    id: 'quote',
    name: 'Citação',
    description: 'Foco total no texto para frases inspiradoras.',
    previewImg: 'https://img.usecurling.com/p/400/600?q=typography%20quote',
  },
]

export default function Templates() {
  const { templateId, updateField } = useEditorStore()
  const navigate = useNavigate()
  const [navigatingId, setNavigatingId] = useState<string | null>(null)
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({})
  const [errorImages, setErrorImages] = useState<Record<string, boolean>>({})

  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }))
  }

  const handleImageError = (id: string) => {
    setErrorImages((prev) => ({ ...prev, [id]: true }))
    setLoadedImages((prev) => ({ ...prev, [id]: true }))
  }

  const handleSelect = (id: string) => {
    if (navigatingId) return
    updateField('templateId', id as any)
    setNavigatingId(id)
    setTimeout(() => {
      navigate('/')
    }, 800)
  }

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 lg:p-12 bg-background">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-4">
            <LayoutTemplate className="w-4 h-4" />
            <span className="text-sm font-medium">Galeria de Templates</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Escolha o estilo da sua revista
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Selecione um layout base para o seu conteúdo. Suas informações e imagens serão mantidas
            ao trocar de template.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {TEMPLATES.map((tpl) => {
            const isSelected = templateId === tpl.id
            const isNavigatingThis = navigatingId === tpl.id
            const isImageLoaded = loadedImages[tpl.id]
            const isError = errorImages[tpl.id]

            return (
              <Card
                key={tpl.id}
                className={cn(
                  'cursor-pointer overflow-hidden transition-all duration-300 group flex flex-col',
                  isSelected
                    ? 'ring-2 ring-primary shadow-lg scale-[1.02]'
                    : 'hover:border-primary/50 hover:shadow-md hover:-translate-y-1',
                )}
                onClick={() => handleSelect(tpl.id)}
              >
                <div className="aspect-[3/4] relative overflow-hidden bg-muted flex items-center justify-center">
                  {!isImageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted/50 backdrop-blur-sm z-10">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                  )}

                  {isError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground bg-muted z-10">
                      <AlertCircle className="w-8 h-8 opacity-50" />
                      <span className="text-xs font-medium">Imagem indisponível</span>
                    </div>
                  )}

                  <img
                    src={tpl.previewImg}
                    alt={tpl.name}
                    onLoad={() => handleImageLoad(tpl.id)}
                    onError={() => handleImageError(tpl.id)}
                    className={cn(
                      'w-full h-full object-cover transition-transform duration-700',
                      !isImageLoaded && 'opacity-0',
                      !isError && 'group-hover:scale-105',
                    )}
                  />

                  {tpl.tag && (
                    <div className="absolute top-3 left-3 z-20">
                      <Badge
                        variant="secondary"
                        className="bg-background/80 backdrop-blur-md shadow-sm"
                      >
                        {tpl.tag}
                      </Badge>
                    </div>
                  )}

                  {isSelected && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center backdrop-blur-[2px] animate-in fade-in duration-300 z-20">
                      {isNavigatingThis ? (
                        <div className="flex flex-col items-center gap-3 bg-background/90 p-4 rounded-xl shadow-lg">
                          <Loader2 className="w-8 h-8 text-primary animate-spin" />
                          <span className="text-foreground font-medium text-sm">Aplicando...</span>
                        </div>
                      ) : (
                        <div className="bg-background rounded-full p-2 shadow-lg animate-in zoom-in-50 duration-300">
                          <CheckCircle2 className="w-8 h-8 text-primary" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <CardContent className="p-5 bg-card flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg tracking-tight">{tpl.name}</h3>
                    {isSelected && !isNavigatingThis && (
                      <Badge variant="default" className="text-[10px] h-5 px-2">
                        Atual
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tpl.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
