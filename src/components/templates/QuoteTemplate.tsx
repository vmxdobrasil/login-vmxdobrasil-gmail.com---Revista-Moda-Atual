import useEditorStore from '@/stores/use-editor-store'
import { cn } from '@/lib/utils'
import { Quote } from 'lucide-react'

export function QuoteTemplate() {
  const { headline, subtitle, date, theme } = useEditorStore()

  const isDark = theme === 'dark'

  return (
    <div
      className={cn(
        'relative w-full h-full flex flex-col items-center justify-center overflow-hidden p-[10cqw]',
        isDark ? 'bg-[#1A1A1A] text-white' : 'bg-[#F9F7F2] text-black',
      )}
    >
      {/* Decorative Elements */}
      <div className="absolute top-[10cqw] left-[10cqw] opacity-10">
        <Quote className="w-[15cqw] h-[15cqw] rotate-180" strokeWidth={1} />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-[85%]">
        <h1 className="text-[6cqw] leading-tight font-serif italic mb-[6cqw] animate-fade-in-up">
          "{headline}"
        </h1>

        <div className="w-[10cqw] h-[1px] bg-brand-gold mb-[4cqw]" />

        <p className="text-[3cqw] font-sans font-medium tracking-wide uppercase mb-[1cqw]">
          {subtitle}
        </p>
        <p className="text-[1.8cqw] font-sans opacity-60 uppercase tracking-widest">{date}</p>
      </div>
    </div>
  )
}
