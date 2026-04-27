import useEditorStore from '@/stores/use-editor-store'
import { cn } from '@/lib/utils'

export function CoverTemplate() {
  const { headline, subtitle, date, imageUrl, theme, filter } = useEditorStore()

  const isDark = theme === 'dark'

  return (
    <div
      className={cn(
        'relative w-full h-full flex flex-col items-center justify-center overflow-hidden',
        isDark ? 'bg-black text-white' : 'bg-white text-black',
      )}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={imageUrl}
          alt="Cover"
          className={cn(
            'w-full h-full object-cover transition-all duration-500',
            filter === 'grayscale' && 'filter-grayscale',
            filter === 'sepia' && 'filter-sepia',
            filter === 'contrast' && 'filter-contrast',
          )}
        />
        <div
          className={cn(
            'absolute inset-0 transition-opacity duration-300',
            isDark ? 'bg-black/40' : 'bg-black/10',
          )}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between p-8 text-center">
        <div className="mt-8 animate-fade-in-down">
          <h2 className="text-[1.5cqw] tracking-widest uppercase font-sans font-semibold mb-2 opacity-90 drop-shadow-md">
            {date}
          </h2>
          <h1 className="text-[12cqw] leading-[0.85] font-serif tracking-tighter drop-shadow-lg">
            {headline}
          </h1>
        </div>

        <div className="mb-8 max-w-[80%] mx-auto animate-fade-in-up">
          <p className="text-[3cqw] font-serif italic opacity-90 drop-shadow-md">{subtitle}</p>
        </div>
      </div>
    </div>
  )
}
