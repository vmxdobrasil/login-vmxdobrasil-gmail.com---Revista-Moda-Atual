import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getUser, User } from '@/services/users'
import { MagazinePost } from '@/services/magazine_posts'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import pb from '@/lib/pocketbase/client'

export default function ContributorProfile() {
  const { id } = useParams<{ id: string }>()
  const [contributor, setContributor] = useState<User | null>(null)
  const [posts, setPosts] = useState<MagazinePost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      if (!id) return
      try {
        const user = await getUser(id)
        setContributor(user)

        const userPosts = await pb.collection('magazine_posts').getFullList<MagazinePost>({
          filter: `author = "${user.name.replace(/"/g, '\\"')}" && status = 'published'`,
          sort: '-created',
        })
        setPosts(userPosts)
      } catch (err) {
        console.error('Contributor not found', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id])

  if (loading)
    return <div className="flex-1 flex items-center justify-center">Carregando perfil...</div>
  if (!contributor)
    return (
      <div className="flex-1 flex items-center justify-center text-red-500 font-bold">
        Colunista não encontrado.
      </div>
    )

  return (
    <div className="flex-1 overflow-y-auto bg-muted/10 w-full h-full">
      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-16 bg-card p-8 rounded-2xl shadow-sm border">
          <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-background shadow-lg">
            <AvatarImage
              src={
                contributor.avatar
                  ? pb.files.getURL(contributor, contributor.avatar)
                  : `https://img.usecurling.com/ppl/large?seed=${contributor.id}`
              }
            />
            <AvatarFallback className="text-4xl">{contributor.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left flex-1">
            <h1 className="font-serif text-4xl font-bold mb-2">{contributor.name}</h1>
            <p className="text-brand-forest font-semibold uppercase tracking-widest text-sm mb-4">
              {contributor.role || 'Colunista'}
            </p>
            <p className="text-muted-foreground leading-relaxed max-w-2xl">
              {contributor.bio || 'Membro da equipe editorial da Revista Moda Atual.'}
            </p>
          </div>
        </div>

        <h2 className="font-serif text-2xl font-bold mb-6 border-b pb-2">Artigos Publicados</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="overflow-hidden hover:shadow-md transition-shadow bg-card group"
            >
              {post.main_image && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={pb.files.getURL(post, post.main_image)}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <CardContent className="p-6">
                <div className="text-xs uppercase tracking-wider text-brand-forest mb-2 font-bold">
                  {post.type}
                </div>
                <h3 className="font-serif text-xl font-bold mb-2 line-clamp-2 group-hover:text-brand-forest transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{post.subtitle}</p>
                <div className="mt-4 text-xs text-muted-foreground/60">
                  {new Date(post.created).toLocaleDateString('pt-BR')}
                </div>
              </CardContent>
            </Card>
          ))}
          {posts.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground italic border border-dashed rounded-xl">
              Nenhum artigo publicado por este autor.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
