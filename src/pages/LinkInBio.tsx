import { useState, useEffect } from 'react'
import { getPosts, MagazinePost } from '@/services/magazine_posts'
import { Button } from '@/components/ui/button'
import { Smartphone, Instagram, Linkedin, Facebook, Youtube } from 'lucide-react'
import pb from '@/lib/pocketbase/client'

export default function LinkInBio() {
  const [recentPosts, setRecentPosts] = useState<MagazinePost[]>([])

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const posts = await getPosts()
        setRecentPosts(posts.filter((p) => p.status === 'published').slice(0, 5))
      } catch (err) {
        console.error(err)
      }
    }
    loadPosts()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white selection:bg-brand-forest selection:text-white font-sans pb-12 w-full">
      <div className="max-w-md mx-auto px-4 pt-12 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-white text-black flex items-center justify-center font-serif text-3xl font-bold tracking-tighter mb-6 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
          MA
        </div>
        <h1 className="font-serif text-3xl font-bold mb-2 tracking-widest uppercase text-center">
          Moda Atual
        </h1>
        <p className="text-gray-400 text-center text-sm mb-8 px-4">
          O principal destino de cultura, tendências e lifestyle.
        </p>

        <div className="flex gap-4 mb-10">
          <a
            href="#"
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a
            href="#"
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href="#"
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
          >
            <Facebook className="w-5 h-5" />
          </a>
          <a
            href="#"
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
          >
            <Youtube className="w-5 h-5" />
          </a>
        </div>

        <div className="w-full space-y-3 mb-10">
          <h2 className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold mb-4 text-center">
            Nossos Apps
          </h2>
          <Button className="w-full h-14 bg-white text-black hover:bg-gray-200 rounded-xl font-bold text-lg flex justify-between px-6 transition-transform hover:scale-[1.02]">
            <span>Download Apple Store</span>
            <Smartphone className="w-5 h-5" />
          </Button>
          <Button className="w-full h-14 bg-white text-black hover:bg-gray-200 rounded-xl font-bold text-lg flex justify-between px-6 transition-transform hover:scale-[1.02]">
            <span>Download Google Play</span>
            <Smartphone className="w-5 h-5" />
          </Button>
        </div>

        <div className="w-full space-y-3">
          <h2 className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold mb-4 text-center mt-6">
            Últimas do Editorial
          </h2>
          {recentPosts.map((post) => (
            <a
              key={post.id}
              href={`#`}
              className="group block relative w-full h-32 rounded-xl overflow-hidden bg-gray-900 border border-white/10 hover:border-white/30 transition-all"
            >
              {post.main_image && (
                <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500">
                  <img
                    src={pb.files.getURL(post, post.main_image)}
                    alt={post.title}
                    className="w-full h-full object-cover blur-[2px] group-hover:blur-0 transition-all duration-500"
                  />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex flex-col justify-end">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold mb-1">
                  {post.type}
                </span>
                <h3 className="font-serif text-sm font-bold text-white leading-tight line-clamp-2">
                  {post.title}
                </h3>
              </div>
            </a>
          ))}
          {recentPosts.length === 0 && (
            <div className="text-center py-6 text-gray-500 text-sm italic">
              Nenhum artigo publicado recentemente.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
