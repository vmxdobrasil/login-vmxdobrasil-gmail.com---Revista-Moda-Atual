import { MagazinePost } from '@/services/magazine_posts'

export function PostPreviewLayout({ post }: { post: Partial<MagazinePost> }) {
  switch (post.type) {
    case 'social':
      return <SocialLayout post={post} />
    case 'trends':
      return <TrendsLayout post={post} />
    case 'interview':
      return <InterviewLayout post={post} />
    case 'marketing':
      return <MarketingLayout post={post} />
    case 'style':
      return <StyleLayout post={post} />
    case 'brand_history':
      return <BrandHistoryLayout post={post} />
    case 'sacoleira':
      return <SacoleiraLayout post={post} />
    default:
      return (
        <div className="p-8 text-center text-muted-foreground">
          Pré-visualização não disponível para este formato.
        </div>
      )
  }
}

function SocialLayout({ post }: { post: Partial<MagazinePost> }) {
  return (
    <div className="bg-white text-black p-8 font-sans max-w-2xl mx-auto border shadow-sm my-8">
      <div className="border-b-4 border-black pb-4 mb-6">
        <h2 className="font-serif text-sm uppercase tracking-widest text-gray-500 mb-2">
          Holofote
        </h2>
        <h1 className="font-serif text-4xl font-bold leading-tight mb-2">
          {post.title || 'Título da Coluna'}
        </h1>
        <p className="text-xl text-gray-600 italic font-serif">{post.subtitle}</p>
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

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="aspect-square bg-gray-100">
          <img
            src="https://img.usecurling.com/p/400/400?q=party%20glamour"
            className="w-full h-full object-cover mix-blend-multiply"
            alt="Social 1"
          />
        </div>
        <div className="aspect-square bg-gray-100">
          <img
            src="https://img.usecurling.com/p/400/400?q=champagne%20glasses"
            className="w-full h-full object-cover mix-blend-multiply"
            alt="Social 2"
          />
        </div>
      </div>

      <div
        className="prose prose-sm font-serif text-gray-800 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: post.content || '<p>Conteúdo da coluna social...</p>' }}
      />
    </div>
  )
}

function TrendsLayout({ post }: { post: Partial<MagazinePost> }) {
  return (
    <div className="flex bg-gray-50 max-w-4xl mx-auto shadow-xl my-8 overflow-hidden min-h-[600px]">
      <div className="w-1/2 p-8 border-r border-gray-200 flex flex-col justify-center bg-black text-white relative">
        <div className="absolute top-8 left-8">
          <span className="text-xs uppercase tracking-widest text-gray-400">Tendências</span>
        </div>
        <h1 className="font-serif text-5xl font-bold mb-4 leading-none">
          {post.title || 'Tendência'}
        </h1>
        <p className="text-lg text-gray-300 mb-8 font-serif italic">{post.subtitle}</p>
        <p className="text-sm text-gray-400 uppercase tracking-widest">Por {post.author}</p>
      </div>
      <div className="w-1/2 p-8 relative flex flex-col">
        <div className="flex-1 overflow-hidden relative mb-4 bg-gray-200">
          <img
            src="https://img.usecurling.com/p/400/600?q=runway%20fashion"
            className="w-full h-full object-cover"
            alt="Trend"
          />
        </div>
        <div
          className="prose prose-sm text-gray-800"
          dangerouslySetInnerHTML={{ __html: post.content || '<p>Análise da tendência...</p>' }}
        />
      </div>
    </div>
  )
}

function InterviewLayout({ post }: { post: Partial<MagazinePost> }) {
  return (
    <div className="bg-white max-w-3xl mx-auto my-8 p-12 shadow-lg border border-gray-100">
      <div className="text-center mb-12">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-red-600 mb-4 block">
          Entrevista da Semana
        </span>
        <h1 className="font-serif text-5xl font-bold mb-6">{post.title}</h1>
        <p className="text-xl font-serif italic text-gray-600">{post.subtitle}</p>
      </div>
      <div className="flex gap-8">
        <div className="w-1/3">
          <img
            src="https://img.usecurling.com/p/300/400?q=portrait"
            className="w-full h-auto rounded-none grayscale"
            alt="Interviewee"
          />
          <div className="mt-4 border-t pt-2">
            <p className="text-xs uppercase tracking-wider text-gray-500">Por {post.author}</p>
          </div>
        </div>
        <div className="w-2/3">
          <div className="text-2xl font-serif text-gray-900 border-l-4 border-red-600 pl-6 my-6 italic leading-relaxed">
            "A moda é a armadura para sobreviver à realidade do dia a dia."
          </div>
          <div
            className="prose prose-gray prose-p:font-serif prose-p:leading-loose"
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

function MarketingLayout({ post }: { post: Partial<MagazinePost> }) {
  return (
    <div className="bg-[#fcfbf9] max-w-3xl mx-auto my-8 p-10 border border-gray-200 font-sans shadow-sm">
      <header className="border-b-2 border-brand-forest pb-6 mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-brand-forest font-bold tracking-widest uppercase text-sm mb-2">
            Marketing de Moda
          </h2>
          <h1 className="text-3xl font-serif font-bold text-gray-900">{post.title}</h1>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold uppercase text-gray-500">Autor</p>
          <p className="text-sm font-semibold">{post.author || 'Valter Mendonça'}</p>
        </div>
      </header>
      <div className="mb-8">
        <p className="text-lg text-gray-600 leading-relaxed font-serif">{post.subtitle}</p>
      </div>
      <div
        className="columns-2 gap-8 text-gray-800 prose prose-sm text-justify"
        dangerouslySetInnerHTML={{ __html: post.content || '<p>Análise de marketing...</p>' }}
      />
    </div>
  )
}

function StyleLayout({ post }: { post: Partial<MagazinePost> }) {
  return (
    <div className="bg-white max-w-4xl mx-auto my-8 overflow-hidden shadow-2xl relative min-h-[700px] flex items-center justify-center group">
      <img
        src="https://img.usecurling.com/p/800/1000?q=high%20fashion%20minimalist"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        alt="Style"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 text-center text-white p-12 max-w-2xl mix-blend-screen">
        <h2 className="text-sm tracking-[0.5em] uppercase mb-6 font-light">Estilo</h2>
        <h1 className="font-serif text-7xl font-bold mb-6 tracking-tight drop-shadow-lg">
          {post.title}
        </h1>
        <p className="text-xl font-light tracking-wide mb-8 drop-shadow-md">{post.subtitle}</p>
        <div className="w-16 h-px bg-white mx-auto mb-8" />
        <div
          className="prose prose-invert prose-lg mx-auto text-white/90 font-serif leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: post.content || '<p>O minimalismo encontra a vanguarda...</p>',
          }}
        />
        <p className="mt-8 text-xs uppercase tracking-widest text-white/70">
          Edição por {post.author}
        </p>
      </div>
    </div>
  )
}

function BrandHistoryLayout({ post }: { post: Partial<MagazinePost> }) {
  return (
    <div className="bg-[#FAF9F6] max-w-3xl mx-auto my-8 p-12 shadow-md">
      <div className="text-center mb-10">
        <h2 className="text-xs uppercase tracking-[0.2em] text-amber-700 mb-4">
          Marca de Moda • História
        </h2>
        <h1 className="font-serif text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <p className="text-gray-500 italic font-serif text-lg">{post.subtitle}</p>
        <p className="text-xs uppercase mt-4 text-gray-400">Por {post.author}</p>
      </div>
      <div className="relative border-l border-amber-200 ml-6 pl-8 py-4 mb-8">
        <div className="absolute w-3 h-3 bg-amber-500 rounded-full -left-[6.5px] top-0" />
        <div className="absolute w-3 h-3 bg-amber-500 rounded-full -left-[6.5px] bottom-0" />
        <img
          src="https://img.usecurling.com/p/600/300?q=vintage%20boutique"
          className="w-full h-48 object-cover mb-6 sepia opacity-80"
          alt="History"
        />
        <div
          className="prose prose-amber font-serif text-gray-700 leading-loose"
          dangerouslySetInnerHTML={{ __html: post.content || '<p>A história da marca...</p>' }}
        />
      </div>
    </div>
  )
}

function SacoleiraLayout({ post }: { post: Partial<MagazinePost> }) {
  return (
    <div className="bg-white max-w-2xl mx-auto my-8 shadow-lg border-t-8 border-pink-500">
      <div className="bg-pink-50 p-8 text-center">
        <span className="inline-block bg-pink-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
          Do Sonho à Vitrine
        </span>
        <h1 className="font-serif text-3xl font-bold text-gray-900 mb-3">{post.title}</h1>
        <p className="text-gray-600">{post.subtitle}</p>
        <p className="text-xs uppercase mt-4 text-pink-600 font-semibold">
          Relato por {post.author}
        </p>
      </div>
      <div className="p-8">
        <div className="float-left w-32 h-32 mr-6 mb-4 rounded-lg overflow-hidden shadow-md">
          <img
            src="https://img.usecurling.com/p/200/200?q=small%20business%20owner"
            className="w-full h-full object-cover"
            alt="Sacoleira"
          />
        </div>
        <div
          className="prose prose-sm text-gray-700 leading-relaxed font-serif"
          dangerouslySetInnerHTML={{
            __html: post.content || '<p>A jornada começou com poucas peças...</p>',
          }}
        />
      </div>
    </div>
  )
}
