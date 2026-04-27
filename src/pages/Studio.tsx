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
import { Plus, Edit, Trash2, X, Check, Eye, Edit2, Image as ImageIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { getMediaAssets, MediaAsset } from '@/services/media_assets'
import { PostPreviewLayout } from '@/components/studio/layouts'
import { useToast } from '@/hooks/use-toast'
import { z } from 'zod'
import { Sparkles, Loader2 } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import pb from '@/lib/pocketbase/client'
import { cn } from '@/lib/utils'

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
  status: z.enum(['draft', 'review', 'published']).default('draft'),
})

type FormDataType = z.infer<typeof formSchema>

const PREVIEW_FORMATS = [
  { id: 'web', label: 'Web', className: 'w-full h-full' },
  { id: 'magazine', label: 'Revista (3:4)', className: 'w-[min(100%,600px)] aspect-[3/4]' },
  { id: 'ig_square', label: 'Instagram (1:1)', className: 'w-[min(100%,500px)] aspect-square' },
  { id: 'ig_portrait', label: 'Instagram (4:5)', className: 'w-[min(100%,480px)] aspect-[4/5]' },
  { id: 'stories', label: 'Stories (9:16)', className: 'h-[min(100%,800px)] aspect-[9/16]' },
  { id: 'linkedin', label: 'LinkedIn (1.91:1)', className: 'w-[min(100%,800px)] aspect-[1.91/1]' },
]

export default function Studio() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [posts, setPosts] = useState<MagazinePost[]>([])
  const [selectedSection, setSelectedSection] = useState<string>('all')
  const [editingPost, setEditingPost] = useState<MagazinePost | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [previewFormat, setPreviewFormat] = useState<string>('web')
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([])
  const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false)
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<{
    titles: string[]
    meta_description: string
    hashtags: string
  } | null>(null)

  useEffect(() => {
    getMediaAssets().then(setMediaAssets).catch(console.error)
  }, [])

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormDataType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      subtitle: '',
      author: '',
      content: '',
      type: 'social',
      is_published: false,
      status: 'draft',
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
    setImageFile(null)
    setImagePreview(null)
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
      status: 'draft',
    })
  }

  const handleEdit = (post: MagazinePost) => {
    setIsCreating(false)
    setEditingPost(post)
    setImageFile(null)
    setImagePreview(post.main_image ? pb.files.getURL(post, post.main_image) : null)
    reset({
      title: post.title,
      subtitle: post.subtitle || '',
      author: post.author,
      content: post.content,
      type: post.type,
      is_published: post.is_published,
      status: post.status || 'draft',
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

  const onSubmit = async (data: FormDataType) => {
    if (!user) {
      toast({
        title: 'Acesso Negado',
        description: 'Você deve estar autenticado para salvar postagens editoriais.',
        variant: 'destructive',
      })
      return
    }

    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('subtitle', data.subtitle || '')
    formData.append('author', data.author)
    formData.append('content', data.content)
    formData.append('type', data.type)
    formData.append('is_published', String(data.is_published))
    formData.append('status', data.status)
    if (imageFile) {
      formData.append('main_image', imageFile)
    }

    try {
      if (editingPost) {
        await updatePost(editingPost.id, formData)
        toast({ title: 'Sucesso', description: 'Post atualizado.' })
      } else {
        await createPost(formData)
        toast({ title: 'Sucesso', description: 'Novo post adicionado à edição.' })
      }
      setIsCreating(false)
      setEditingPost(null)
      setImageFile(null)
      setImagePreview(null)
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

  const handleAiAssist = async () => {
    const content = watch('content')
    if (!content || content.length < 15) {
      toast({ title: 'Atenção', description: 'Escreva mais conteúdo para a IA analisar.' })
      return
    }
    setIsAIAssistantOpen(true)
    setAiLoading(true)
    setAiSuggestions(null)
    try {
      const res = await pb.send('/backend/v1/ai/editor', {
        method: 'POST',
        body: JSON.stringify({ content }),
      })
      setAiSuggestions(res)
    } catch (err) {
      toast({ title: 'Erro', description: 'Falha ao processar com IA.', variant: 'destructive' })
      setIsAIAssistantOpen(false)
    } finally {
      setAiLoading(false)
    }
  }

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
                      className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${post.status === 'published' ? 'bg-green-100 text-green-700 border border-green-200' : post.status === 'review' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}
                    >
                      {post.status === 'published'
                        ? 'Publicado'
                        : post.status === 'review'
                          ? 'Em Revisão'
                          : 'Rascunho'}
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
          <div className="flex-1 flex overflow-hidden bg-muted/10 relative">
            <div
              className={cn(
                'w-full xl:w-1/2 border-r bg-card flex flex-col shadow-lg z-10',
                mobileTab !== 'form' && 'hidden xl:flex',
              )}
            >
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
                      Imagem Principal
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setImageFile(file)
                            setImagePreview(URL.createObjectURL(file))
                          }
                        }}
                        className="cursor-pointer file:text-brand-forest file:font-semibold flex-1"
                      />
                      <Dialog open={isMediaSelectorOpen} onOpenChange={setIsMediaSelectorOpen}>
                        <DialogTrigger asChild>
                          <Button type="button" variant="outline" className="px-3 shrink-0">
                            <ImageIcon className="w-4 h-4 mr-2" /> Galeria
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Biblioteca de Mídia</DialogTitle>
                          </DialogHeader>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto p-2">
                            {mediaAssets.map((asset) => (
                              <div
                                key={asset.id}
                                className="cursor-pointer border rounded overflow-hidden aspect-square hover:ring-2 hover:ring-brand-forest transition-all"
                                onClick={async () => {
                                  try {
                                    const url = pb.files.getURL(asset, asset.file)
                                    const response = await fetch(url)
                                    const blob = await response.blob()
                                    const file = new File([blob], asset.file || 'image.jpg', {
                                      type: blob.type,
                                    })
                                    setImageFile(file)
                                    setImagePreview(url)
                                    setIsMediaSelectorOpen(false)
                                  } catch (error) {
                                    console.error('Failed to load image from library', error)
                                  }
                                }}
                              >
                                {asset.file ? (
                                  <img
                                    src={pb.files.getURL(asset, asset.file)}
                                    alt={asset.alt_text}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-xs">
                                    Sem Imagem
                                  </div>
                                )}
                              </div>
                            ))}
                            {mediaAssets.length === 0 && (
                              <p className="col-span-full text-center text-muted-foreground text-sm">
                                Nenhuma mídia encontrada.
                              </p>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    {imagePreview && (
                      <div className="mt-2 w-32 h-32 rounded-md overflow-hidden border bg-muted/20 relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={() => {
                            setImageFile(null)
                            setImagePreview(null)
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="uppercase tracking-wider text-xs font-bold text-muted-foreground">
                        Corpo do Texto (Suporta HTML)
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs bg-brand-forest/10 text-brand-forest border-brand-forest/20 hover:bg-brand-forest hover:text-white"
                        onClick={handleAiAssist}
                      >
                        <Sparkles className="w-3 h-3 mr-2" />
                        Assistente IA
                      </Button>
                    </div>
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

                  <div className="flex flex-col gap-3 border p-5 rounded-lg bg-muted/20">
                    <div>
                      <Label className="text-base font-bold">Status Editorial</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Apenas matérias marcadas como "Publicado" aparecem no site e link na bio.
                      </p>
                    </div>
                    <select
                      {...register('status')}
                      className="w-full border rounded-md p-3 text-sm bg-background outline-none focus:ring-2 focus:ring-brand-forest"
                    >
                      <option value="draft">Rascunho</option>
                      <option value="review">Em Revisão</option>
                      <option value="published">Publicado</option>
                    </select>
                  </div>
                </form>
              </ScrollArea>
              <div className="p-4 border-t shrink-0 flex justify-end gap-3 bg-card pb-20 xl:pb-4">
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

            <div
              className={cn(
                'w-full xl:w-1/2 bg-[#EAEAEA] flex-col',
                mobileTab !== 'preview' && 'hidden xl:flex',
              )}
            >
              <div className="p-3 border-b bg-card shrink-0 flex flex-col gap-3 shadow-sm z-10">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    Visualização: {PREVIEW_FORMATS.find((f) => f.id === previewFormat)?.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {PREVIEW_FORMATS.map((f) => (
                    <Button
                      key={f.id}
                      type="button"
                      variant={previewFormat === f.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPreviewFormat(f.id)}
                      className="text-xs whitespace-nowrap h-7 rounded-full"
                    >
                      {f.label}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex-1 overflow-hidden relative flex items-center justify-center p-4">
                <div
                  className={cn(
                    'bg-white shadow-elevation overflow-y-auto transition-all duration-500 ease-in-out [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]',
                    PREVIEW_FORMATS.find((f) => f.id === previewFormat)?.className,
                  )}
                >
                  <div className="animate-fade-in min-h-full">
                    <PostPreviewLayout
                      post={watchAll as any}
                      imageUrl={imagePreview}
                      format={previewFormat}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Dialog open={isAIAssistantOpen} onOpenChange={setIsAIAssistantOpen}>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-brand-forest" />
                    Editor Estratégico IA
                  </DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  {aiLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-4">
                      <Loader2 className="w-8 h-8 animate-spin text-brand-forest" />
                      <p className="text-sm">
                        Analisando o conteúdo e gerando recomendações SEO...
                      </p>
                    </div>
                  ) : aiSuggestions ? (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label className="font-bold text-sm">Títulos Sugeridos (SEO)</Label>
                        <div className="grid gap-2">
                          {aiSuggestions.titles.map((t, i) => (
                            <div key={i} className="flex gap-2 items-center">
                              <div className="flex-1 p-3 border rounded-md text-sm bg-muted/20 font-serif">
                                {t}
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => setValue('title', t)}
                              >
                                Usar
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold text-sm">Meta-Description Sugerida</Label>
                        <div className="p-3 border rounded-md text-sm bg-muted/20 text-muted-foreground">
                          {aiSuggestions.meta_description}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold text-sm">Hashtags para Redes Sociais</Label>
                        <div className="p-3 border rounded-md text-sm bg-muted/20 text-brand-forest font-medium">
                          {aiSuggestions.hashtags}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </DialogContent>
            </Dialog>

            {/* Mobile Tab Switcher */}
            <div className="xl:hidden absolute bottom-6 right-6 z-50">
              <Button
                size="icon"
                className="h-14 w-14 rounded-full shadow-elevation bg-brand-forest hover:bg-brand-forest/90 text-white"
                onClick={() => setMobileTab(mobileTab === 'form' ? 'preview' : 'form')}
              >
                {mobileTab === 'form' ? <Eye className="w-6 h-6" /> : <Edit2 className="w-6 h-6" />}
              </Button>
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
