import useEditorStore from '@/stores/use-editor-store'
import { cn } from '@/lib/utils'

export function EditorialTemplate() {
  const { headline, subtitle, date, imageUrl, filter } = useEditorStore()

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#EAE8E3] text-black p-[4cqw]">
      <div className="relative w-full h-full flex flex-col">
        {/* Frame */}
        <div className="absolute inset-0 border-[0.5cqw] border-black/10 z-20 pointer-events-none" />

        {/* Image */}
        <div className="w-full flex-1 relative z-10 overflow-hidden shadow-lg">
          <img
            src={imageUrl}
            alt="Editorial"
            className={cn(
              'w-full h-full object-cover transition-all duration-500',
              filter === 'grayscale' && 'filter-grayscale',
              filter === 'sepia' && 'filter-sepia',
              filter === 'contrast' && 'filter-contrast',
            )}
          />
        </div>

        {/* Text Area */}
        <div className="w-full pt-[4cqw] flex flex-col items-start text-left z-10">
          <div className="flex items-center gap-[2cqw] mb-[2cqw]">
            <span className="w-[4cqw] h-[2px] bg-brand-gold" />
            <p className="text-[1.5cqw] tracking-widest uppercase font-sans font-bold text-brand-gold">
              {date}
            </p>
          </div>
          <h1 className="text-[7cqw] leading-none font-serif tracking-tight mb-[2cqw]">
            {headline}
          </h1>
          <p className="text-[2.2cqw] font-serif italic opacity-80 max-w-[90%]">{subtitle}</p>
        </div>
      </div>
    </div>
  )
}
