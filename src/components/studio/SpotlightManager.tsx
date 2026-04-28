import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import {
  FashionEvent,
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from '@/services/fashion_events'
import { useRealtime } from '@/hooks/use-realtime'
import pb from '@/lib/pocketbase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Plus,
  Save,
  Trash2,
  Edit,
  X,
  ImageIcon,
  UploadCloud,
  Calendar as CalendarIcon,
} from 'lucide-react'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { ScrollArea } from '@/components/ui/scroll-area'

const CATEGORIES = ['Desfile', 'Festa', 'Tapete Vermelho', 'Outros']

const formatPTDate = (dateStr: string) => {
  if (!dateStr) return ''
  const isoStr = dateStr.length === 10 ? `${dateStr}T12:00:00Z` : dateStr
  const d = new Date(isoStr)
  if (isNaN(d.getTime())) return ''
  const day = String(d.getUTCDate()).padStart(2, '0')
  const months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ]
  const month = months[d.getUTCMonth()]
  const year = d.getUTCFullYear()
  return `${day} de ${month} de ${year}`
}

type GalleryItem = {
  title: string
  description: string
  imageUrl?: string
  imageFile?: File
  id: string
}

export function SpotlightManager() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [events, setEvents] = useState<FashionEvent[]>([])
  const [editing, setEditing] = useState<Partial<FashionEvent> | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [saving, setSaving] = useState(false)

  const [mainImageFile, setMainImageFile] = useState<File | null>(null)
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null)
  const [gallery, setGallery] = useState<GalleryItem[]>([])

  const loadEvents = async () => {
    try {
      const data = await getEvents()
      setEvents(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])
  useRealtime('fashion_events', loadEvents)

  const handleEdit = (ev: FashionEvent) => {
    setEditing(ev)
    setIsCreating(false)
    setMainImageFile(null)
    setMainImagePreview(ev.image ? pb.files.getURL(ev, ev.image) : null)

    const gd = (ev.gallery_data as any[]) || []
    setGallery(
      gd.map((g, i) => ({
        id: Math.random().toString(),
        title: g.title || '',
        description: g.description || '',
        imageUrl: g.imageUrl || '',
      })),
    )
  }

  const handleNew = () => {
    setEditing({
      title: '',
      description: '',
      category: 'Outros',
      is_spotlight: false,
      date: new Date().toISOString().split('T')[0],
    })
    setIsCreating(true)
    setMainImageFile(null)
    setMainImagePreview(null)
    setGallery([])
  }

  const handleSave = async () => {
    if (!editing?.title || !editing?.date) {
      return toast({
        title: 'Atenção',
        description: 'Título e data são obrigatórios',
        variant: 'destructive',
      })
    }
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('title', editing.title)
      fd.append('description', editing.description || '')
      fd.append('date', editing.date)
      fd.append('category', editing.category || 'Outros')
      fd.append('is_spotlight', String(editing.is_spotlight || false))

      if (mainImageFile) fd.append('image', mainImageFile)

      // Upload gallery files first if any
      const finalGalleryData = []
      for (const item of gallery) {
        let finalUrl = item.imageUrl
        if (item.imageFile) {
          const mediaFd = new FormData()
          mediaFd.append('file', item.imageFile)
          mediaFd.append('title', `Gallery: ${item.title}`)
          const asset = await pb.collection('media_assets').create(mediaFd)
          finalUrl = pb.files.getURL(asset, asset.file)
        }
        finalGalleryData.push({
          title: item.title,
          description: item.description,
          imageUrl: finalUrl,
        })
      }

      fd.append('gallery_data', JSON.stringify(finalGalleryData))

      if (editing.is_spotlight) {
        // Unset others
        const currentSpotlights = events.filter((e) => e.is_spotlight && e.id !== editing.id)
        for (const cs of currentSpotlights) {
          await updateEvent(cs.id, { is_spotlight: false })
        }
      }

      if (isCreating) {
        await createEvent(fd)
        toast({ title: 'Sucesso', description: 'Cobertura criada.' })
      } else if (editing.id) {
        await updateEvent(editing.id, fd)
        toast({ title: 'Sucesso', description: 'Cobertura atualizada.' })
      }

      setEditing(null)
    } catch (err) {
      toast({ title: 'Erro', description: 'Falha ao salvar.', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir cobertura?')) return
    await deleteEvent(id)
    if (editing?.id === id) setEditing(null)
  }

  if (editing) {
    return (
      <div className="flex flex-col h-full bg-muted/10 overflow-hidden">
        <div className="p-4 border-b bg-card flex justify-between items-center shrink-0">
          <h2 className="font-serif font-bold text-xl">
            {isCreating ? 'Nova Cobertura' : 'Editar Cobertura'}
          </h2>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving} className="bg-brand-forest text-white">
              <Save className="w-4 h-4 mr-2" /> Salvar
            </Button>
          </div>
        </div>
        <ScrollArea className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-serif">Informações Principais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Título do Evento</Label>
                    <Input
                      value={editing.title}
                      onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <select
                      className="w-full border rounded-md p-2 text-sm bg-transparent"
                      value={editing.category}
                      onChange={(e) => setEditing({ ...editing, category: e.target.value as any })}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Textarea
                    value={editing.description}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div className="space-y-2 flex flex-col mt-[2px]">
                    <Label>Data do Evento</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !editing.date && 'text-muted-foreground',
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {editing.date ? (
                            formatPTDate(editing.date)
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={
                            editing.date
                              ? new Date(
                                  editing.date.length === 10
                                    ? editing.date + 'T12:00:00Z'
                                    : editing.date,
                                )
                              : undefined
                          }
                          onSelect={(d: Date | undefined) =>
                            setEditing({ ...editing, date: d ? d.toISOString() : '' })
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex items-center gap-3 pt-4">
                    <Switch
                      checked={editing.is_spotlight}
                      onCheckedChange={(c) => setEditing({ ...editing, is_spotlight: c })}
                    />
                    <Label>Destaque Principal (Holofote)</Label>
                  </div>
                </div>
                <div className="space-y-2 pt-2">
                  <Label>Foto Principal (Capa)</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-32 border rounded-md bg-muted flex items-center justify-center overflow-hidden">
                      {mainImagePreview ? (
                        <img src={mainImagePreview} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
                      )}
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setMainImageFile(e.target.files[0])
                          setMainImagePreview(URL.createObjectURL(e.target.files[0]))
                        }
                      }}
                      className="max-w-xs"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-serif">Galeria de Fotos (Secundárias)</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setGallery([
                      ...gallery,
                      { id: Math.random().toString(), title: '', description: '' },
                    ])
                  }
                >
                  <Plus className="w-4 h-4 mr-2" /> Adicionar Foto
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {gallery.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 border rounded-lg bg-muted/5 relative"
                  >
                    <div className="w-24 h-32 shrink-0 border rounded-md bg-muted overflow-hidden flex items-center justify-center relative group">
                      {item.imageFile || item.imageUrl ? (
                        <img
                          src={item.imageFile ? URL.createObjectURL(item.imageFile) : item.imageUrl}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-muted-foreground/30" />
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <UploadCloud className="w-6 h-6 text-white" />
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            const newG = [...gallery]
                            newG[index].imageFile = e.target.files[0]
                            setGallery(newG)
                          }
                        }}
                      />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Pessoas na Foto (Nomes)</Label>
                        <Input
                          value={item.title}
                          onChange={(e) => {
                            const newG = [...gallery]
                            newG[index].title = e.target.value
                            setGallery(newG)
                          }}
                          placeholder="Ex: Gisele & Paulo"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Descrição / Contexto</Label>
                        <Input
                          value={item.description}
                          onChange={(e) => {
                            const newG = [...gallery]
                            newG[index].description = e.target.value
                            setGallery(newG)
                          }}
                          placeholder="Looks, marcas..."
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 text-red-500"
                      onClick={() => setGallery(gallery.filter((g) => g.id !== item.id))}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {gallery.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhuma foto adicionada à galeria.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-muted/10">
      <div className="p-6 border-b bg-card flex justify-between items-center shrink-0">
        <div>
          <h2 className="font-serif text-2xl font-bold">Acervo Holofote</h2>
          <p className="text-sm text-muted-foreground">Gerencie as coberturas de eventos.</p>
        </div>
        <Button onClick={handleNew} className="bg-brand-forest text-white">
          <Plus className="w-4 h-4 mr-2" /> Nova Cobertura
        </Button>
      </div>
      <div className="p-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {events.map((ev) => (
            <Card
              key={ev.id}
              className={`overflow-hidden hover:shadow-md transition-all ${ev.is_spotlight ? 'ring-2 ring-brand-forest' : ''}`}
            >
              <div className="aspect-video bg-muted relative">
                {ev.image ? (
                  <img src={pb.files.getURL(ev, ev.image)} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-10 h-10 m-auto mt-10 text-muted-foreground/30" />
                )}
                {ev.is_spotlight && (
                  <span className="absolute top-2 left-2 bg-brand-forest text-white text-xs font-bold px-2 py-1 uppercase rounded-sm">
                    Destaque Atual
                  </span>
                )}
                <span className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 uppercase tracking-wider rounded-sm backdrop-blur-sm">
                  {ev.category}
                </span>
              </div>
              <CardContent className="p-4">
                <h3 className="font-serif font-bold text-lg leading-tight line-clamp-2">
                  {ev.title}
                </h3>
                <div className="flex items-center text-xs text-muted-foreground mt-2 uppercase tracking-wider">
                  <CalendarIcon className="w-3 h-3 mr-1" /> {formatPTDate(ev.date)}
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(ev)}
                  >
                    <Edit className="w-4 h-4 mr-2" /> Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:bg-red-50"
                    onClick={() => handleDelete(ev.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {events.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground py-10">
              Nenhuma cobertura encontrada.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
