import { MagazinePost } from '@/services/magazine_posts'
import { cn } from '@/lib/utils'
import pb from '@/lib/pocketbase/client'

export function PostPreviewLayout({
  post,
  imageUrl,
  galleryUrls = [],
  columnistPhotoUrl,
  format = 'web',
}: {
  post: Partial<MagazinePost>
  imageUrl?: string | null
  galleryUrls?: string[]
  columnistPhotoUrl?: string | null
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
      return <InterviewLayout post={post} imageUrl={imageUrl} galleryUrls={galleryUrls} />
    case 'marketing':
      return (
        <MarketingLayout post={post} imageUrl={imageUrl} columnistPhotoUrl={columnistPhotoUrl} />
      )
    case 'style':
      return <StyleLayout post={post} imageUrl={imageUrl} galleryUrls={galleryUrls} />
    case 'brand_history':
      return <BrandHistoryLayout post={post} imageUrl={imageUrl} galleryUrls={galleryUrls} />
    case 'sacoleira':
      return <SacoleiraLayout post={post} imageUrl={imageUrl} galleryUrls={galleryUrls} />
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
  const dateStr = new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(post.created || Date.now()))

  return (
    <div className="bg-white text-black p-6 md:p-10 font-sans w-full max-w-3xl mx-auto border shadow-sm my-0 md:my-8 min-h-full flex flex-col">
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
        className="prose prose-sm md:prose-base font-serif text-gray-800 leading-relaxed max-w-none flex-1"
        dangerouslySetInnerHTML={{ __html: post.content || '<p>Conteúdo da coluna social...</p>' }}
      />

      <div className="mt-12 pt-6 border-t-2 border-gray-100 text-center text-sm font-serif italic text-gray-500">
        Publicado na coluna social{' '}
        <strong className="font-bold uppercase tracking-wider text-black">Holofote</strong> da
        Revista Moda Atual no dia {dateStr}
      </div>
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
  galleryUrls,
}: {
  post: Partial<MagazinePost>
  imageUrl?: string | null
  galleryUrls?: string[]
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
        <div className="w-full md:w-1/3 flex flex-col gap-6">
          <div>
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
          {galleryUrls && galleryUrls[0] && (
            <img
              src={galleryUrls[0]}
              className="w-full h-auto rounded-none shadow-sm"
              alt="Extra Photo"
            />
          )}
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
  columnistPhotoUrl,
}: {
  post: Partial<MagazinePost>
  imageUrl?: string | null
  columnistPhotoUrl?: string | null
}) {
  const colPhoto =
    columnistPhotoUrl ||
    (post.columnist_photo
      ? pb.files.getURL(post as MagazinePost, post.columnist_photo)
      : 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=valter')
  const bio = post.columnist_bio || '25 anos de experiência em Marketing e Branding'
  const author = post.author || 'Valter Mendonça'

  return (
    <div className="bg-[#fcfbf9] w-full max-w-4xl mx-auto my-0 md:my-8 p-8 md:p-12 border border-gray-200 font-sans shadow-sm min-h-full">
      <header className="border-b-2 border-brand-forest pb-8 mb-8 flex flex-col gap-6">
        <div className="flex justify-between items-center opacity-90 border-b border-gray-200 pb-4">
          <img
            src="https://img.usecurling.com/i?q=magazine+logo&shape=outline&color=black"
            className="h-8 md:h-10"
            alt="Revista Moda Atual"
          />
          <img
            src="https://img.usecurling.com/i?q=v+moda+brasil+logo&shape=outline&color=black"
            className="h-8 md:h-10"
            alt="V MODA BRASIL"
          />
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-6 bg-white p-6 rounded-sm shadow-sm border border-gray-100">
          <img
            src={colPhoto}
            className="w-20 h-20 rounded-full object-cover shadow-inner border"
            alt={author}
          />
          <div>
            <h2 className="text-brand-forest font-bold tracking-widest uppercase text-[10px] mb-1">
              Marketing de Moda
            </h2>
            <h3 className="text-xl font-bold text-gray-900 font-serif">{author}</h3>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-forest mt-1">
              Diretor de Marketing da Revista e CEO do marketplace V MODA BRASIL
            </p>
            <p className="text-sm text-gray-600 italic font-serif mt-2 border-l-2 border-brand-forest pl-3">
              "{bio}"
            </p>
          </div>
        </div>
      </header>

      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 leading-tight mb-4">
          {post.title}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-serif">
          {post.subtitle}
        </p>
      </div>

      {imageUrl && (
        <div className="mb-10 w-full aspect-[21/9] overflow-hidden rounded-sm shadow-md">
          <img
            src={imageUrl}
            className="w-full h-full object-cover mix-blend-multiply opacity-90"
            alt="Marketing Hero"
          />
        </div>
      )}
      <div
        className="md:columns-2 gap-10 text-gray-800 prose prose-sm md:prose-base text-justify max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content || '<p>Análise de marketing...</p>' }}
      />
    </div>
  )
}

function StyleLayout({
  post,
  imageUrl,
  galleryUrls,
}: {
  post: Partial<MagazinePost>
  imageUrl?: string | null
  galleryUrls?: string[]
}) {
  return (
    <div className="bg-white w-full max-w-4xl mx-auto my-0 md:my-8 shadow-2xl relative min-h-full flex flex-col">
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden group">
        <img
          src={imageUrl || 'https://img.usecurling.com/p/1200/600?q=high%20fashion%20minimalist'}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          alt="Style Hero"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center mix-blend-screen z-10">
          <h2 className="text-[10px] md:text-xs tracking-[0.5em] uppercase mb-4 font-light">
            Estilo
          </h2>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4 tracking-tight drop-shadow-lg leading-none max-w-3xl">
            {post.title}
          </h1>
          <p className="text-sm md:text-lg font-light tracking-wide max-w-2xl drop-shadow-md">
            {post.subtitle}
          </p>
        </div>
      </div>

      <div className="p-8 md:p-16 max-w-3xl mx-auto">
        <div className="w-16 h-px bg-gray-300 mx-auto mb-10" />
        <div
          className="prose prose-sm md:prose-lg mx-auto text-gray-800 font-serif leading-relaxed max-w-none text-center"
          dangerouslySetInnerHTML={{
            __html: post.content || '<p>O minimalismo encontra a vanguarda...</p>',
          }}
        />
        <p className="mt-12 text-[10px] uppercase tracking-widest text-gray-400 font-bold text-center">
          Edição por {post.author}
        </p>
      </div>

      {galleryUrls && galleryUrls.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-8 pt-0 w-full">
          {galleryUrls[0] && (
            <div className="w-full aspect-[3/4] overflow-hidden">
              <img
                src={galleryUrls[0]}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                alt="Style Look 1"
              />
            </div>
          )}
          {galleryUrls[1] && (
            <div className="w-full aspect-[3/4] overflow-hidden mt-0 sm:mt-12">
              <img
                src={galleryUrls[1]}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                alt="Style Look 2"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function BrandHistoryLayout({
  post,
  imageUrl,
  galleryUrls,
}: {
  post: Partial<MagazinePost>
  imageUrl?: string | null
  galleryUrls?: string[]
}) {
  return (
    <div className="bg-[#FAF9F6] w-full max-w-3xl mx-auto my-0 md:my-8 p-8 md:p-12 shadow-md min-h-full flex flex-col">
      <div className="text-center mb-10">
        <h2 className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-amber-700 mb-4 font-bold">
          Marca de Moda • História
        </h2>
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          {post.title}
        </h1>
        <p className="text-gray-600 italic font-serif text-base md:text-xl">{post.subtitle}</p>
        <p className="text-[10px] uppercase mt-6 text-gray-400 tracking-wider font-bold">
          Por {post.author}
        </p>
      </div>

      <div className="relative border-l-2 border-amber-200 ml-2 md:ml-4 pl-6 md:pl-10 py-4 mb-8 flex-1">
        <div className="absolute w-3 h-3 bg-amber-500 rounded-full -left-[7px] top-0 shadow-sm" />
        <div className="absolute w-3 h-3 bg-amber-500 rounded-full -left-[7px] bottom-0 shadow-sm" />

        <img
          src={imageUrl || 'https://img.usecurling.com/p/800/400?q=vintage%20boutique'}
          className="w-full h-48 md:h-64 object-cover mb-8 sepia opacity-80 rounded-sm shadow-sm"
          alt="History Hero"
        />

        <div
          className="prose prose-sm md:prose-base prose-amber font-serif text-gray-700 leading-loose max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content || '<p>A história da marca...</p>' }}
        />

        {galleryUrls && galleryUrls[0] && (
          <div className="mt-8 border-4 border-white shadow-lg rotate-1 max-w-md mx-auto">
            <img src={galleryUrls[0]} className="w-full h-auto" alt="Brand Archive" />
            <p className="p-3 text-center text-xs font-serif text-gray-500 italic bg-white">
              Arquivo Histórico
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function SacoleiraLayout({
  post,
  imageUrl,
  galleryUrls,
}: {
  post: Partial<MagazinePost>
  imageUrl?: string | null
  galleryUrls?: string[]
}) {
  return (
    <div className="bg-white w-full max-w-2xl mx-auto my-0 md:my-8 shadow-xl border-t-8 border-pink-500 overflow-hidden min-h-full flex flex-col">
      <div className="bg-pink-50 p-8 md:p-12 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100 rounded-full -mr-10 -mt-10 opacity-50" />
        <span className="relative z-10 inline-block bg-pink-500 text-white text-[10px] md:text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-6 shadow-sm">
          Do Sonho à Vitrine
        </span>
        <h1 className="relative z-10 font-serif text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          {post.title}
        </h1>
        <p className="relative z-10 text-gray-600 text-sm md:text-lg font-serif italic max-w-lg mx-auto">
          {post.subtitle}
        </p>
        <p className="relative z-10 text-[10px] uppercase mt-8 text-pink-600 font-bold tracking-wider">
          Relato por {post.author}
        </p>
      </div>
      <div className="p-8 md:p-12 flex-1">
        <div className="flex flex-col sm:flex-row gap-6 mb-8">
          <div className="w-full sm:w-1/2 aspect-square rounded-xl overflow-hidden shadow-md border-4 border-pink-50">
            <img
              src={imageUrl || 'https://img.usecurling.com/p/400/400?q=small%20business%20owner'}
              className="w-full h-full object-cover"
              alt="Sacoleira 1"
            />
          </div>
          {galleryUrls && galleryUrls[0] && (
            <div className="w-full sm:w-1/2 aspect-square rounded-xl overflow-hidden shadow-md border-4 border-pink-50 sm:mt-12">
              <img src={galleryUrls[0]} className="w-full h-full object-cover" alt="Sacoleira 2" />
            </div>
          )}
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
