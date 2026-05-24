import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import useEditorStore from '@/stores/use-editor-store'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'

const TEMPLATES = [
  {
    id: 'cover',
    name: 'Capa de Revista',
    description: 'Impactante, tipografia imensa sobrepondo a imagem.',
    previewImg: 'https://img.usecurling.com/p/400/600?q=vogue%20cover',
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

  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }))
  }

  const handleSelect = (id: string) => {
    if (navigatingId) return
    updateField('templateId', id as any)
    setNavigatingId(id)
    setTimeout(() => {
      navigate('/')
    }, 1000)
  }

  return (
    <div className="h-full overflow-y-auto p-6 md:p-10 bg-muted/10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold mb-2">Biblioteca de Templates</h1>
          <p className="text-muted-foreground">
            Escolha um layout base. Seu conteúdo (texto e imagem) será mantido ao trocar de
            template.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEMPLATES.map((tpl) => {
            const isSelected = templateId === tpl.id
            const isNavigatingThis = navigatingId === tpl.id
            const isImageLoaded = loadedImages[tpl.id]

            return (
              <Card
                key={tpl.id}
                className={cn(
                  'cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-elevation group',
                  isSelected ? 'ring-2 ring-brand-gold' : 'hover:border-primary/50',
                )}
                onClick={() => handleSelect(tpl.id)}
              >
                <div className="aspect-[3/4] relative overflow-hidden bg-muted flex items-center justify-center">
                  {!isImageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                    </div>
                  )}
                  <img
                    src={tpl.previewImg}
                    alt={tpl.name}
                    onLoad={() => handleImageLoad(tpl.id)}
                    className={cn(
                      'w-full h-full object-cover transition-all duration-700 group-hover:scale-105 filter grayscale',
                      !isImageLoaded && 'opacity-0',
                    )}
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center backdrop-blur-sm animate-in fade-in">
                      {isNavigatingThis ? (
                        <div className="flex flex-col items-center gap-2">
                          <CheckCircle2 className="w-12 h-12 text-brand-gold bg-black rounded-full animate-bounce" />
                          <span className="text-white font-medium text-sm drop-shadow-md bg-black/50 px-3 py-1 rounded-full">
                            Aplicando...
                          </span>
                        </div>
                      ) : (
                        <CheckCircle2 className="w-12 h-12 text-brand-gold bg-black rounded-full" />
                      )}
                    </div>
                  )}
                </div>
                <CardContent className="p-4 bg-card">
                  <h3 className="font-serif font-semibold text-lg">{tpl.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {tpl.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
