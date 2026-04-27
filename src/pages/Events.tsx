import { useState, useEffect } from 'react'
import { getEvents, createEvent, deleteEvent, FashionEvent } from '@/services/fashion_events'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Calendar, MapPin, Plus, Trash2 } from 'lucide-react'
import pb from '@/lib/pocketbase/client'
import { useToast } from '@/hooks/use-toast'

export default function EventsPage() {
  const [events, setEvents] = useState<FashionEvent[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const loadEvents = async () => {
    try {
      const data = await getEvents()
      setEvents(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  useRealtime('fashion_events', loadEvents)

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) return
    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      await createEvent(formData)
      toast({ title: 'Sucesso', description: 'Evento criado' })
      setIsDialogOpen(false)
      form.reset()
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o evento',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir este evento?')) return
    try {
      await deleteEvent(id)
      toast({ title: 'Sucesso', description: 'Evento excluído' })
    } catch (error) {
      toast({ title: 'Erro', description: 'Não foi possível excluir', variant: 'destructive' })
    }
  }

  return (
    <div className="flex-1 flex flex-col p-6 h-full overflow-y-auto bg-background w-full">
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex justify-between items-center mb-8 shrink-0">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Calendário de Eventos</h1>
            <p className="text-muted-foreground mt-1">
              Acompanhe os próximos desfiles e lançamentos da moda
            </p>
          </div>
          {user && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-brand-forest hover:bg-brand-forest/90">
                  <Plus className="w-4 h-4 mr-2" /> Novo Evento
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Evento</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Título do Evento</Label>
                    <Input name="title" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Data e Hora</Label>
                    <Input type="datetime-local" name="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Local</Label>
                    <Input name="location" placeholder="Ex: SPFW, Online..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Textarea name="description" rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label>Imagem de Capa (Opcional)</Label>
                    <Input type="file" name="image" accept="image/*" />
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button type="submit">Salvar Evento</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex flex-col sm:flex-row bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {event.image && (
                <div className="sm:w-48 h-48 sm:h-auto shrink-0">
                  <img
                    src={pb.files.getURL(event, event.image)}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-serif text-xl font-bold">{event.title}</h3>
                  {user && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 h-8 w-8 -mt-2 -mr-2"
                      onClick={() => handleDelete(event.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="flex items-center text-sm text-muted-foreground mb-4 space-x-4">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />{' '}
                    {new Date(event.date).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {event.location && (
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" /> {event.location}
                    </span>
                  )}
                </div>
                <p className="text-foreground/80 text-sm leading-relaxed">{event.description}</p>
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <div className="text-center py-12 text-muted-foreground border border-dashed rounded-xl bg-card/50">
              Nenhum evento programado no momento.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
