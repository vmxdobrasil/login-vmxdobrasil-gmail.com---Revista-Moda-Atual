import { MagazinePost } from '@/services/magazine_posts'
import { cn } from '@/lib/utils'

export function PostPreviewLayout({
  post,
  imageUrl,
  format = 'web',
}: {
  post: Partial<MagazinePost>
  imageUrl?: string | null
  format?: string
}) {
  const isSocialCard = ['ig_square', 'ig_portrait', 'stories', 'linkedin'].includes(format)

  if (isSocialCard) {
    return <SocialCardLayout post={post} imageUrl={imageUrl} format={format} />
  }

  switch (post.type) {
    case 'social':
      return <SocialLayout post={post} imageUrl={imageUrl} />
    case 'trends':
      return <TrendsLayout post={post} imageUrl={imageUrl} />
    case 'interview':
      return <InterviewLayout post={post} imageUrl={imageUrl} />
    case 'marketing':
      return <MarketingLayout post={post} imageUrl={imageUrl} />
    case 'style':
      return <StyleLayout post={post} imageUrl={imageUrl} />
    case 'brand_history':
      return <BrandHistoryLayout post={post} imageUrl={imageUrl} />
    case 'sacoleira':
      return <SacoleiraLayout post={post} imageUrl={imageUrl} />
    default:
      return (
        <div className="p-8 text-center text-muted-foreground">
          Pré-visualização não disponível para este formato.
        </div>
      )
  }
}

function SocialCardLayout({
  post,
  imageUrl,
  format,
}: {
  post: Partial<MagazinePost>
  imageUrl?: string | null
  format: string
}) {
  const bgImage = imageUrl || 'https://img.usecurling.com/p/800/800?q=fashion%20editorial'

  return (
    <div className="relative w-full h-full flex flex-col justify-end p-6 md:p-8 text-white overflow-hidden group min-h-full">
      <img
        src={bgImage}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        alt="Background"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      <div className="absolute top-6 left-0 w-full flex justify-center pointer-events-none drop-shadow-md opacity-90">
        <span className="font-serif tracking-[0.3em] text-[12px] uppercase font-bold text-white">
          Revista Moda Atual
        </span>
      </div>

      <div className="relative z-10 animate-fade-in-up mt-auto">
        <span className="inline-block px-3 py-1 mb-4 text-[10px] font-bold uppercase tracking-widest bg-brand-forest text-white">
          {post.type === 'social'
            ? 'Holofote'
            : post.type === 'trends'
              ? 'Tendências'
              : post.type === 'interview'
                ? 'Entrevista'
                : post.type === 'marketing'
                  ? 'Marketing'
                  : post.type === 'style'
                    ? 'Estilo'
                    : post.type === 'brand_history'
                      ? 'Marca'
                      : 'Sacoleira'}
        </span>
        <h1
          className={cn(
            'font-serif font-bold leading-tight mb-3 text-shadow-md',
            format === 'linkedin' ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl',
          )}
        >
          {post.title || 'Título da Coluna'}
        </h1>
        {format !== 'ig_square' && format !== 'linkedin' && (
          <p className="text-sm md:text-base text-gray-200 line-clamp-3 mb-4 font-serif italic text-shadow-sm">
            {post.subtitle}
          </p>
        )}
        <div className="flex items-center mt-4 border-t border-white/30 pt-4">
          <span className="text-[10px] font-bold tracking-widest uppercase text-white/90">
            Por {post.author || 'Redação'}
          </span>
        </div>
      </div>
    </div>
  )
}

function SocialLayout({
  post,
  imageUrl,
}: {
  post: Partial<MagazinePost>
  imageUrl?: string | null
}) {
  return (
    <div className="bg-white text-black p-6 md:p-10 font-sans w-full max-w-3xl mx-auto border shadow-sm my-0 md:my-8 min-h-full">
      <div className="border-b-4 border-black pb-4 mb-6">
        <h2 className="font-serif text-xs md:text-sm uppercase tracking-widest text-gray-500 mb-2">
          Holofote
        </h2>
        <h1 className="font-serif text-3xl md:text-5xl font-bold leading-tight mb-3">
          {post.title || 'Título da Coluna'}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 italic font-serif">{post.subtitle}</p>
      </div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
          <img
            src="https://img.usecurling.com/p/100/100?q=woman%20face"
            alt={post.author}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="font-bold text-sm uppercase tracking-wider">
            {post.author || 'Fábia Mendonça'}
          </p>
          <p className="text-xs text-gray-500">Coluna Social</p>
        </div>
      </div>

      <div className="mb-6 w-full aspect-video bg-gray-100 overflow-hidden rounded-md shadow-sm">
        <img
          src={imageUrl || 'https://img.usecurling.com/p/800/400?q=party%20glamour'}
          className="w-full h-full object-cover"
          alt="Social"
        />
      </div>

      <div
        className="prose prose-sm md:prose-base font-serif text-gray-800 leading-relaxed max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content || '<p>Conteúdo da coluna social...</p>' }}
      />
    </div>
  )
}

function TrendsLayout({
  post,
  imageUrl,
}: {
  post: Partial<MagazinePost>
  imageUrl?: string | null
}) {
  return (
    <div className="flex flex-col md:flex-row bg-gray-50 w-full min-h-full shadow-xl">
      <div className="w-full md:w-1/2 p-8 md:p-12 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col justify-center bg-black text-white relative">
        <div className="absolute top-8 left-8">
          <span className="text-[10px] uppercase tracking-widest text-gray-400">Tendências</span>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight mt-8">
          {post.title || 'Tendência'}
        </h1>
        <p className="text-lg text-gray-300 mb-8 font-serif italic">{post.subtitle}</p>
        <p className="text-xs text-gray-400 uppercase tracking-widest mt-auto">Por {post.author}</p>
      </div>
      <div className="w-full md:w-1/2 p-8 md:p-12 relative flex flex-col">
        <div className="w-full aspect-[4/5] overflow-hidden relative mb-8 bg-gray-200 shadow-md">
          <img
            src={imageUrl || 'https://img.usecurling.com/p/600/800?q=runway%20fashion'}
            className="w-full h-full object-cover"
            alt="Trend"
          />
        </div>
        <div
          className="prose prose-sm md:prose-base text-gray-800 font-serif leading-relaxed max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content || '<p>Análise da tendência...</p>' }}
        />
      </div>
    </div>
  )
}

function InterviewLayout({
  post,
  imageUrl,
}: {
  post: Partial<MagazinePost>
  imageUrl?: string | null
}) {
  return (
    <div className="bg-white w-full max-w-3xl mx-auto my-0 md:my-8 p-8 md:p-12 shadow-lg border border-gray-100 min-h-full">
      <div className="text-center mb-10 md:mb-16">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-600 mb-4 block">
          Entrevista da Semana
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
        <p className="text-lg md:text-xl font-serif italic text-gray-600">{post.subtitle}</p>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3">
          <img
            src={imageUrl || 'https://img.usecurling.com/p/300/400?q=portrait'}
            className="w-full h-auto rounded-none grayscale"
            alt="Interviewee"
          />
          <div className="mt-4 border-t pt-3">
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">
              Por {post.author}
            </p>
          </div>
        </div>
        <div className="w-full md:w-2/3">
          <div className="text-xl md:text-2xl font-serif text-gray-900 border-l-4 border-red-600 pl-6 mb-8 italic leading-relaxed">
            "A moda é a armadura para sobreviver à realidade do dia a dia."
          </div>
          <div
            className="prose prose-sm md:prose-base prose-gray prose-p:font-serif prose-p:leading-loose max-w-none"
            dangerouslySetInnerHTML={{
              __html:
                post.content ||
                '<p><strong>P:</strong> Como você começou?<br/><strong>R:</strong> Com muita paixão.</p>',
            }}
          />
        </div>
      </div>
    </div>
  )
}

function MarketingLayout({
  post,
  imageUrl,
}: {
  post: Partial<MagazinePost>
  imageUrl?: string | null
}) {
  return (
    <div className="bg-[#fcfbf9] w-full max-w-3xl mx-auto my-0 md:my-8 p-8 md:p-12 border border-gray-200 font-sans shadow-sm min-h-full">
      <header className="border-b-2 border-brand-forest pb-6 mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-brand-forest font-bold tracking-widest uppercase text-xs mb-3">
            Marketing de Moda
          </h2>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 leading-tight">
            {post.title}
          </h1>
        </div>
        <div className="md:text-right shrink-0">
          <p className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Autor</p>
          <p className="text-sm font-semibold">{post.author || 'Valter Mendonça'}</p>
        </div>
      </header>
      <div className="mb-8">
        <p className="text-lg text-gray-600 leading-relaxed font-serif">{post.subtitle}</p>
      </div>
      {imageUrl && (
        <div className="mb-8 w-full aspect-video overflow-hidden rounded-sm shadow-sm">
          <img
            src={imageUrl}
            className="w-full h-full object-cover grayscale opacity-90 mix-blend-multiply"
            alt="Marketing"
          />
        </div>
      )}
      <div
        className="md:columns-2 gap-8 text-gray-800 prose prose-sm md:prose-base text-justify max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content || '<p>Análise de marketing...</p>' }}
      />
    </div>
  )
}

function StyleLayout({
  post,
  imageUrl,
}: {
  post: Partial<MagazinePost>
  imageUrl?: string | null
}) {
  return (
    <div className="bg-white w-full max-w-4xl mx-auto my-0 md:my-8 overflow-hidden shadow-2xl relative min-h-[600px] md:min-h-[700px] flex items-center justify-center group">
      <img
        src={imageUrl || 'https://img.usecurling.com/p/800/1000?q=high%20fashion%20minimalist'}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        alt="Style"
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 text-center text-white p-8 md:p-12 max-w-2xl mix-blend-screen w-full">
        <h2 className="text-[10px] md:text-xs tracking-[0.5em] uppercase mb-6 font-light">
          Estilo
        </h2>
        <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 tracking-tight drop-shadow-lg leading-none">
          {post.title}
        </h1>
        <p className="text-lg md:text-xl font-light tracking-wide mb-8 drop-shadow-md px-4">
          {post.subtitle}
        </p>
        <div className="w-12 md:w-16 h-px bg-white mx-auto mb-8 opacity-70" />
        <div
          className="prose prose-sm md:prose-lg prose-invert mx-auto text-white/90 font-serif leading-relaxed max-w-none px-4"
          dangerouslySetInnerHTML={{
            __html: post.content || '<p>O minimalismo encontra a vanguarda...</p>',
          }}
        />
        <p className="mt-10 text-[10px] uppercase tracking-widest text-white/70 font-bold">
          Edição por {post.author}
        </p>
      </div>
    </div>
  )
}

function BrandHistoryLayout({
  post,
  imageUrl,
}: {
  post: Partial<MagazinePost>
  imageUrl?: string | null
}) {
  return (
    <div className="bg-[#FAF9F6] w-full max-w-3xl mx-auto my-0 md:my-8 p-8 md:p-12 shadow-md min-h-full">
      <div className="text-center mb-10">
        <h2 className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-amber-700 mb-4 font-bold">
          Marca de Moda • História
        </h2>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {post.title}
        </h1>
        <p className="text-gray-500 italic font-serif text-base md:text-lg">{post.subtitle}</p>
        <p className="text-[10px] uppercase mt-6 text-gray-400 tracking-wider font-bold">
          Por {post.author}
        </p>
      </div>
      <div className="relative border-l border-amber-200 ml-4 md:ml-6 pl-6 md:pl-8 py-4 mb-8">
        <div className="absolute w-2 md:w-3 h-2 md:h-3 bg-amber-500 rounded-full -left-[4.5px] md:-left-[6.5px] top-0" />
        <div className="absolute w-2 md:w-3 h-2 md:h-3 bg-amber-500 rounded-full -left-[4.5px] md:-left-[6.5px] bottom-0" />
        <img
          src={imageUrl || 'https://img.usecurling.com/p/600/300?q=vintage%20boutique'}
          className="w-full h-40 md:h-56 object-cover mb-6 sepia opacity-80 rounded-sm shadow-sm"
          alt="History"
        />
        <div
          className="prose prose-sm md:prose-base prose-amber font-serif text-gray-700 leading-loose max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content || '<p>A história da marca...</p>' }}
        />
      </div>
    </div>
  )
}

function SacoleiraLayout({
  post,
  imageUrl,
}: {
  post: Partial<MagazinePost>
  imageUrl?: string | null
}) {
  return (
    <div className="bg-white w-full max-w-2xl mx-auto my-0 md:my-8 shadow-lg border-t-8 border-pink-500 overflow-hidden min-h-full">
      <div className="bg-pink-50 p-8 md:p-10 text-center">
        <span className="inline-block bg-pink-500 text-white text-[10px] md:text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-5">
          Do Sonho à Vitrine
        </span>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {post.title}
        </h1>
        <p className="text-gray-600 text-sm md:text-base">{post.subtitle}</p>
        <p className="text-[10px] uppercase mt-6 text-pink-600 font-bold tracking-wider">
          Relato por {post.author}
        </p>
      </div>
      <div className="p-8 md:p-10">
        <div className="float-none md:float-left w-full md:w-32 h-48 md:h-32 mr-0 md:mr-6 mb-6 md:mb-4 rounded-lg overflow-hidden shadow-md">
          <img
            src={imageUrl || 'https://img.usecurling.com/p/300/300?q=small%20business%20owner'}
            className="w-full h-full object-cover"
            alt="Sacoleira"
          />
        </div>
        <div
          className="prose prose-sm md:prose-base text-gray-700 leading-relaxed font-serif max-w-none"
          dangerouslySetInnerHTML={{
            __html: post.content || '<p>A jornada começou com poucas peças...</p>',
          }}
        />
      </div>
    </div>
  )
}
