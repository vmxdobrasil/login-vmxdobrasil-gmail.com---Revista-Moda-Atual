import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { FashionEvent } from '@/services/fashion_events'
import { getMediaAssets, MediaAsset } from '@/services/media_assets'
import { useRealtime } from '@/hooks/use-realtime'
import pb from '@/lib/pocketbase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ImageIcon, Save, Trash2, UploadCloud } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

type SlotData = {
  id?: string
  title: string
  description: string
  imageFile?: File
  imageUrl?: string
}

export function SpotlightManager() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [slots, setSlots] = useState<SlotData[]>(Array(5).fill({ title: '', description: '' }))
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([])
  const [saving, setSaving] = useState(false)
  const [activeSlot, setActiveSlot] = useState<number | null>(null)

  const loadSlots = async () => {
    try {
      const events = await pb.collection('fashion_events').getFullList<FashionEvent>({
        filter: 'is_spotlight = true',
        sort: 'display_order',
      })
      const newSlots = Array(5)
        .fill(null)
        .map((_, i) => {
          const ev = events.find((e) => e.display_order === i + 1)
          if (ev)
            return {
              id: ev.id,
              title: ev.title,
              description: ev.description || '',
              imageUrl: ev.image ? pb.files.getURL(ev, ev.image) : undefined,
            }
          return { title: '', description: '' }
        })
      setSlots(newSlots)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadSlots()
    getMediaAssets().then(setMediaAssets).catch(console.error)
  }, [])
  useRealtime('fashion_events', loadSlots)

  const updateSlot = (index: number, data: Partial<SlotData>) => {
    const newSlots = [...slots]
    newSlots[index] = { ...newSlots[index], ...data }
    setSlots(newSlots)
  }

  const handleSave = async () => {
    if (!user) return toast({ title: 'Acesso Negado', variant: 'destructive' })
    const valid = slots.filter((s) => s.title.trim() && (s.imageFile || s.imageUrl))
    if (valid.length > 0 && valid.length < 3)
      return toast({
        title: 'Atenção',
        description: 'Preencha pelo menos 3 slots.',
        variant: 'destructive',
      })

    setSaving(true)
    try {
      for (let i = 0; i < 5; i++) {
        const s = slots[i]
        if (s.title.trim() || s.imageFile || s.imageUrl) {
          const fd = new FormData()
          fd.append('title', s.title || `Destaque ${i + 1}`)
          fd.append('description', s.description)
          fd.append('is_spotlight', 'true')
          fd.append('display_order', String(i + 1))
          if (!s.id) fd.append('date', new Date().toISOString())
          if (s.imageFile) fd.append('image', s.imageFile)
          if (s.id) await pb.collection('fashion_events').update(s.id, fd)
          else await pb.collection('fashion_events').create(fd)
        } else if (s.id) {
          await pb
            .collection('fashion_events')
            .update(s.id, { is_spotlight: false, display_order: 0 })
        }
      }
      toast({ title: 'Sucesso', description: 'Holofote atualizado.' })
      loadSlots()
    } catch (err) {
      toast({ title: 'Erro', description: 'Falha ao salvar.', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-muted/10">
      <div className="p-6 border-b bg-card flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold">Gerenciar Holofote</h2>
          <p className="text-sm text-muted-foreground">
            Configure até 5 destaques (mínimo de 3) para exibição de alto impacto.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-brand-forest text-white">
          <Save className="w-4 h-4 mr-2" /> Salvar Alterações
        </Button>
      </div>
      <div className="p-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
          {slots.map((slot, i) => (
            <Card
              key={i}
              className="overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow bg-card"
            >
              <div className="aspect-[4/5] bg-muted relative group flex items-center justify-center border-b">
                {slot.imageFile || slot.imageUrl ? (
                  <img
                    src={slot.imageFile ? URL.createObjectURL(slot.imageFile) : slot.imageUrl}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-10 h-10 text-muted-foreground/30" />
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <Dialog open={activeSlot === i} onOpenChange={(o) => setActiveSlot(o ? i : null)}>
                    <DialogTrigger asChild>
                      <Button variant="secondary" size="sm">
                        <ImageIcon className="w-4 h-4 mr-2" /> Galeria
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Selecionar Mídia</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto p-2">
                        {mediaAssets.map((asset) => (
                          <div
                            key={asset.id}
                            className="cursor-pointer border rounded aspect-square hover:ring-2 hover:ring-brand-forest overflow-hidden"
                            onClick={async () => {
                              try {
                                const url = pb.files.getURL(asset, asset.file)
                                const res = await fetch(url)
                                const blob = await res.blob()
                                updateSlot(i, {
                                  imageFile: new File([blob], asset.file || 'image.jpg', {
                                    type: blob.type,
                                  }),
                                  imageUrl: url,
                                })
                                setActiveSlot(null)
                              } catch (e) {
                                console.error(e)
                              }
                            }}
                          >
                            <img
                              src={pb.files.getURL(asset, asset.file)}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                  <div className="relative">
                    <Button variant="secondary" size="sm">
                      <UploadCloud className="w-4 h-4 mr-2" /> Upload
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => {
                        if (e.target.files?.[0])
                          updateSlot(i, { imageFile: e.target.files[0], imageUrl: undefined })
                      }}
                    />
                  </div>
                </div>
              </div>
              <CardContent className="p-4 space-y-3 flex-1 flex flex-col">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Slot {i + 1}
                </div>
                <Input
                  placeholder="Título (Pessoa/Evento)"
                  value={slot.title}
                  onChange={(e) => updateSlot(i, { title: e.target.value })}
                  className="font-serif font-bold text-base h-9"
                />
                <Textarea
                  placeholder="Subtítulo ou Papel..."
                  value={slot.description}
                  onChange={(e) => updateSlot(i, { description: e.target.value })}
                  className="h-16 resize-none text-sm"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-auto text-red-500 hover:text-red-600 hover:bg-red-50 w-full"
                  onClick={() =>
                    updateSlot(i, {
                      title: '',
                      description: '',
                      imageFile: undefined,
                      imageUrl: undefined,
                    })
                  }
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Limpar Slot
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
