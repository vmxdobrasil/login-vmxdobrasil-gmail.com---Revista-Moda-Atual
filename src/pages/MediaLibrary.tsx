import { useState, useEffect } from 'react'
import {
  getMediaAssets,
  createMediaAsset,
  deleteMediaAsset,
  MediaAsset,
} from '@/services/media_assets'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Trash2, Upload, Image as ImageIcon } from 'lucide-react'
import pb from '@/lib/pocketbase/client'
import { useToast } from '@/hooks/use-toast'

export default function MediaLibrary() {
  const [assets, setAssets] = useState<MediaAsset[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const loadAssets = async () => {
    try {
      const data = await getMediaAssets()
      setAssets(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadAssets()
  }, [])

  useRealtime('media_assets', loadAssets)

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) return
    const form = e.currentTarget
    const formData = new FormData(form)
    if (!formData.get('file')) {
      toast({ title: 'Erro', description: 'Selecione uma imagem', variant: 'destructive' })
      return
    }

    setIsUploading(true)
    try {
      await createMediaAsset(formData)
      toast({ title: 'Sucesso', description: 'Imagem enviada para a biblioteca' })
      setIsDialogOpen(false)
      form.reset()
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar a imagem',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir esta imagem?')) return
    try {
      await deleteMediaAsset(id)
      toast({ title: 'Sucesso', description: 'Imagem excluída' })
    } catch (error) {
      toast({ title: 'Erro', description: 'Não foi possível excluir', variant: 'destructive' })
    }
  }

  return (
    <div className="flex-1 flex flex-col p-6 h-full overflow-hidden bg-background">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-serif font-bold">Biblioteca de Mídia</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie imagens para usar em suas publicações
          </p>
        </div>
        {user && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-brand-forest hover:bg-brand-forest/90">
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enviar nova imagem</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="space-y-2">
                  <Label>Título / Nome da Imagem</Label>
                  <Input name="title" required placeholder="Ex: Capa Verão 2026" />
                </div>
                <div className="space-y-2">
                  <Label>Texto Alternativo (Acessibilidade)</Label>
                  <Input name="alt_text" placeholder="Ex: Modelo sorrindo com vestido amarelo" />
                </div>
                <div className="space-y-2">
                  <Label>Arquivo</Label>
                  <Input type="file" name="file" accept="image/*" required />
                </div>
                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={isUploading}>
                    {isUploading ? 'Enviando...' : 'Enviar Imagem'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="group relative border rounded-lg overflow-hidden bg-card aspect-square"
            >
              {asset.file ? (
                <img
                  src={pb.files.getURL(asset, asset.file)}
                  alt={asset.alt_text}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-muted text-muted-foreground">
                  <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                  <span className="text-xs">Sem Imagem</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                <div className="text-white text-xs font-medium truncate">{asset.title}</div>
                {user && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="self-end h-8 w-8"
                    onClick={() => handleDelete(asset.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          {assets.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed rounded-xl">
              <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>Nenhuma mídia encontrada na biblioteca.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
