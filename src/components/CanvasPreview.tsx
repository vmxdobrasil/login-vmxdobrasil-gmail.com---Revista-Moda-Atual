import useEditorStore from '@/stores/use-editor-store'
import { cn } from '@/lib/utils'
import { CoverTemplate } from './templates/CoverTemplate'
import { MinimalistTemplate } from './templates/MinimalistTemplate'
import { EditorialTemplate } from './templates/EditorialTemplate'
import { QuoteTemplate } from './templates/QuoteTemplate'

export function CanvasPreview() {
  const { format, templateId, theme } = useEditorStore()

  // Map format to aspect ratio class
  const aspectRatioClass =
    format === '1:1' ? 'aspect-square' : format === '9:16' ? 'aspect-[9/16]' : 'aspect-video'

  const renderTemplate = () => {
    switch (templateId) {
      case 'cover':
        return <CoverTemplate />
      case 'minimalist':
        return <MinimalistTemplate />
      case 'editorial':
        return <EditorialTemplate />
      case 'quote':
        return <QuoteTemplate />
      default:
        return <CoverTemplate />
    }
  }

  const isDark = theme === 'dark'

  return (
    <div className="w-full h-full flex items-center justify-center p-4 md:p-8 bg-muted/30 overflow-hidden">
      <div className="relative flex flex-col items-center max-h-full max-w-full animate-fade-in">
        {/* The Post Canvas Wrapper */}
        <div
          className={cn(
            'relative shadow-elevation bg-background overflow-hidden transition-all duration-500 ease-apple preview-container',
            aspectRatioClass,
          )}
          style={{ height: 'min(70vh, 100%)' }} // Control the scale
        >
          {/* Magazine Brand Overlay - Fixed on all templates */}
          <div className="absolute top-4 left-0 w-full z-50 flex justify-center pointer-events-none drop-shadow-md">
            <span
              className={cn(
                'font-serif tracking-widest text-[1.5cqw] uppercase font-bold',
                isDark ? 'text-white' : 'text-black',
                templateId === 'editorial' && 'text-black', // Force black for this specific light-bg template
              )}
            >
              Revista Moda Atual
            </span>
          </div>

          {/* Actual Template Content */}
          {renderTemplate()}
        </div>

        <div className="mt-4 text-xs font-medium text-muted-foreground uppercase tracking-widest flex items-center gap-2">
          <span>Pré-visualização ao vivo</span>
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </div>
      </div>
    </div>
  )
}
