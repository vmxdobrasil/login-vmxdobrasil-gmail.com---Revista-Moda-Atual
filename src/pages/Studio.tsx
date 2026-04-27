import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  MagazinePost,
} from '@/services/magazine_posts'
import { useRealtime } from '@/hooks/use-realtime'
import { extractFieldErrors } from '@/lib/pocketbase/errors'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Edit, Trash2, X, Check } from 'lucide-react'
import { PostPreviewLayout } from '@/components/studio/layouts'
import { useToast } from '@/hooks/use-toast'
import { z } from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const SECTIONS = [
  { id: 'all', label: 'Todas' },
  { id: 'social', label: 'Holofote' },
  { id: 'trends', label: 'Tendências' },
  { id: 'interview', label: 'Entrevista' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'style', label: 'Estilo' },
  { id: 'brand_history', label: 'Marca' },
  { id: 'sacoleira', label: 'Sacoleira' },
] as const

const formSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório'),
  subtitle: z.string().optional(),
  author: z.string().min(1, 'O autor é obrigatório'),
  content: z.string().min(1, 'O conteúdo é obrigatório'),
  type: z.enum([
    'social',
    'trends',
    'interview',
    'marketing',
    'style',
    'brand_history',
    'sacoleira',
  ]),
  is_published: z.boolean().default(false),
})

type FormData = z.infer<typeof formSchema>

export default function Studio() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [posts, setPosts] = useState<MagazinePost[]>([])
  const [selectedSection, setSelectedSection] = useState<string>('all')
  const [editingPost, setEditingPost] = useState<MagazinePost | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      subtitle: '',
      author: '',
      content: '',
      type: 'social',
      is_published: false,
    },
  })

  const watchType = watch('type')
  const watchAll = watch()

  const loadPosts = async () => {
    try {
      const data = await getPosts()
      setPosts(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

  useRealtime('magazine_posts', () => {
    loadPosts()
  })

  useEffect(() => {
    if (isCreating) {
      if (watchType === 'marketing') setValue('author', 'Valter Mendonça')
      else if (watchType === 'social') setValue('author', 'Fábia Mendonça')
      else if (watchType === 'sacoleira') setValue('author', 'Redação')
    }
  }, [watchType, isCreating, setValue])

  const filteredPosts =
    selectedSection === 'all' ? posts : posts.filter((p) => p.type === selectedSection)

  const handleNew = () => {
    setIsCreating(true)
    setEditingPost(null)
    const initialType = selectedSection !== 'all' ? (selectedSection as any) : 'social'
    reset({
      title: '',
      subtitle: '',
      author:
        initialType === 'marketing'
          ? 'Valter Mendonça'
          : initialType === 'social'
            ? 'Fábia Mendonça'
            : 'Redação',
      content: '<p></p>',
      type: initialType,
      is_published: false,
    })
  }

  const handleEdit = (post: MagazinePost) => {
    setIsCreating(false)
    setEditingPost(post)
    reset({
      title: post.title,
      subtitle: post.subtitle || '',
      author: post.author,
      content: post.content,
      type: post.type,
      is_published: post.is_published,
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta publicação da revista?')) return
    try {
      await deletePost(id)
      if (editingPost?.id === id) {
        setEditingPost(null)
      }
      toast({ title: 'Sucesso', description: 'Post excluído da edição.' })
    } catch (err) {
      toast({ title: 'Erro', description: 'Não foi possível excluir.', variant: 'destructive' })
    }
  }

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast({
        title: 'Acesso Negado',
        description: 'Você deve estar autenticado para salvar postagens editoriais.',
        variant: 'destructive',
      })
      return
    }

    try {
      if (editingPost) {
        await updatePost(editingPost.id, data)
        toast({ title: 'Sucesso', description: 'Post atualizado.' })
      } else {
        await createPost(data)
        toast({ title: 'Sucesso', description: 'Novo post adicionado à edição.' })
      }
      setIsCreating(false)
      setEditingPost(null)
    } catch (err) {
      const fieldErrors = extractFieldErrors(err)
      toast({
        title: 'Erro de Validação',
        description: Object.values(fieldErrors).join(' - ') || 'Erro ao salvar.',
        variant: 'destructive',
      })
    }
  }

  const showEditor = isCreating || editingPost

  return (
    <div className="flex h-full w-full overflow-hidden flex-col bg-background">
      <div className="border-b px-4 py-2 flex items-center justify-between shrink-0 bg-card">
        <Tabs
          value={selectedSection}
          onValueChange={setSelectedSection}
          className="w-full max-w-4xl"
        >
          <TabsList className="w-full flex h-10 bg-muted/50">
            {SECTIONS.map((s) => (
              <TabsTrigger
                key={s.id}
                value={s.id}
                className="flex-1 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                {s.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="ml-4 shrink-0">
          <Button
            onClick={handleNew}
            disabled={!user}
            size="sm"
            className="bg-brand-forest text-white hover:bg-brand-forest/90 shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" /> Nova Edição
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar List */}
        <div
          className={`w-80 border-r bg-muted/20 flex flex-col ${showEditor ? 'hidden lg:flex' : 'flex w-full md:w-80'}`}
        >
          <div className="p-4 border-b bg-muted/30">
            <h3 className="font-serif font-semibold text-sm tracking-widest uppercase">
              Acervo de Posts ({filteredPosts.length})
            </h3>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-3">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${editingPost?.id === post.id ? 'bg-primary/5 border-primary shadow-sm' : 'bg-card hover:bg-muted/50 hover:shadow-sm'}`}
                  onClick={() => handleEdit(post)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-serif font-bold text-base leading-tight line-clamp-2">
                      {post.title}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground flex justify-between items-center mb-3">
                    <span className="font-medium">{post.author}</span>
                    <span className="uppercase tracking-wider text-[10px] border px-2 py-0.5 rounded bg-muted/50">
                      {post.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t pt-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${post.is_published ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}
                    >
                      {post.is_published ? 'Publicado' : 'Rascunho'}
                    </span>
                    {user && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(post.id)
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {filteredPosts.length === 0 && (
                <div className="text-center p-8 text-muted-foreground text-sm font-serif italic">
                  Nenhum artigo encontrado nesta seção.
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Editor Area */}
        {showEditor ? (
          <div className="flex-1 flex overflow-hidden bg-muted/10">
            <div className="w-full xl:w-1/2 border-r bg-card flex flex-col shadow-lg z-10">
              <div className="p-4 border-b flex justify-between items-center shrink-0 bg-muted/30">
                <h2 className="font-serif font-bold text-lg">
                  {isCreating ? 'Escrever Nova Matéria' : 'Revisar Matéria'}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setIsCreating(false)
                    setEditingPost(null)
                  }}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <ScrollArea className="flex-1 p-6">
                <form
                  id="post-form"
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6 max-w-lg mx-auto"
                >
                  {!user && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4 border border-red-100">
                      Aviso: Você precisa fazer login para salvar suas edições.
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label className="uppercase tracking-wider text-xs font-bold text-muted-foreground">
                      Coluna / Seção
                    </Label>
                    <select
                      {...register('type')}
                      className="w-full border rounded-md p-3 text-sm bg-transparent outline-none focus:ring-2 focus:ring-brand-forest"
                    >
                      {SECTIONS.filter((s) => s.id !== 'all').map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label className="uppercase tracking-wider text-xs font-bold text-muted-foreground">
                      Título da Matéria
                    </Label>
                    <Input
                      {...register('title')}
                      placeholder="Escreva a manchete principal..."
                      className={`font-serif text-lg ${errors.title ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-brand-forest'}`}
                    />
                    {errors.title && (
                      <span className="text-xs text-red-500 font-medium">
                        {errors.title.message}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="uppercase tracking-wider text-xs font-bold text-muted-foreground">
                      Subtítulo (Opcional)
                    </Label>
                    <Input
                      {...register('subtitle')}
                      placeholder="Linha de apoio da matéria..."
                      className="focus-visible:ring-brand-forest"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="uppercase tracking-wider text-xs font-bold text-muted-foreground">
                      Autor / Assinatura
                    </Label>
                    <Input
                      {...register('author')}
                      placeholder="Quem assina a coluna?"
                      className={
                        errors.author
                          ? 'border-red-500 focus-visible:ring-red-500'
                          : 'focus-visible:ring-brand-forest'
                      }
                    />
                    {errors.author && (
                      <span className="text-xs text-red-500 font-medium">
                        {errors.author.message}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="uppercase tracking-wider text-xs font-bold text-muted-foreground">
                      Corpo do Texto (Suporta HTML)
                    </Label>
                    <Textarea
                      {...register('content')}
                      placeholder="<p>Escreva o texto principal aqui...</p>"
                      className={`min-h-[250px] font-mono text-sm leading-relaxed resize-none ${errors.content ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-brand-forest'}`}
                    />
                    {errors.content && (
                      <span className="text-xs text-red-500 font-medium">
                        {errors.content.message}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between border p-5 rounded-lg bg-muted/20">
                    <div>
                      <Label className="text-base font-bold">Aprovação Editorial</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Ao marcar como publicado, o post vai para a capa do site.
                      </p>
                    </div>
                    <Controller
                      control={control}
                      name="is_published"
                      render={({ field }) => (
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      )}
                    />
                  </div>
                </form>
              </ScrollArea>
              <div className="p-4 border-t shrink-0 flex justify-end gap-3 bg-card">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false)
                    setEditingPost(null)
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  form="post-form"
                  disabled={!user}
                  className="bg-brand-forest text-white hover:bg-brand-forest/90 font-bold px-8"
                >
                  <Check className="w-4 h-4 mr-2" /> Salvar Edição
                </Button>
              </div>
            </div>

            <div className="hidden xl:flex w-1/2 bg-[#EAEAEA] flex-col">
              <div className="p-3 border-b bg-card shrink-0 flex justify-center shadow-sm z-10">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Mockup da Página
                </span>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-8 pb-32">
                  <div className="animate-fade-in-up">
                    <PostPreviewLayout post={watchAll as any} />
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-muted/10 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-card shadow-sm flex items-center justify-center mb-6">
              <Edit className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-2">Sala de Redação</h2>
            <p className="text-sm">Selecione uma matéria no acervo ou inicie uma nova edição.</p>
          </div>
        )}
      </div>
    </div>
  )
}
