import useEditorStore from '@/stores/use-editor-store'
import { cn } from '@/lib/utils'

export function MinimalistTemplate() {
  const { headline, subtitle, date, imageUrl, theme, filter } = useEditorStore()

  const isDark = theme === 'dark'

  return (
    <div
      className={cn(
        'relative w-full h-full flex flex-col overflow-hidden',
        isDark ? 'bg-black text-white' : 'bg-white text-black',
      )}
    >
      {/* Top Half Image */}
      <div className="w-full h-[60%] relative overflow-hidden">
        <img
          src={imageUrl}
          alt="Minimalist"
          className={cn(
            'w-full h-full object-cover transition-all duration-500',
            filter === 'grayscale' && 'filter-grayscale',
            filter === 'sepia' && 'filter-sepia',
            filter === 'contrast' && 'filter-contrast',
          )}
        />
      </div>

      {/* Bottom Half Text */}
      <div className="w-full h-[40%] flex flex-col items-center justify-center p-[8cqw] text-center">
        <p className="text-[1.8cqw] tracking-[0.2em] uppercase font-sans font-medium mb-[2cqw] opacity-70">
          {date}
        </p>
        <h1 className="text-[6cqw] leading-tight font-serif mb-[2cqw]">{headline}</h1>
        <p className="text-[2.5cqw] font-sans opacity-80 max-w-[80%] font-light">{subtitle}</p>
      </div>
    </div>
  )
}
