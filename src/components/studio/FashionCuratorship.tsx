import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import pb from '@/lib/pocketbase/client'
import { Loader2, Sparkles, Instagram, Save } from 'lucide-react'
import { createPost } from '@/services/magazine_posts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function FashionCuratorship() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    accessories: '',
    footwear: '',
    beauty: '',
    colors: '',
    trends: '',
    urgency: false,
  })
  const [result, setResult] = useState<{
    title: string
    hook: string
    content: string
    hashtags: string
    cta_text: string
    seo_keywords: string
  } | null>(null)
  const [saving, setSaving] = useState(false)

  const handleGenerate = async () => {
    if (!form.trends && !form.accessories && !form.footwear && !form.beauty && !form.colors) {
      toast({ title: 'Atenção', description: 'Preencha pelo menos um campo de curadoria.' })
      return
    }

    setLoading(true)
    setResult(null)
    try {
      const res = await pb.send('/backend/v1/ai/fashion-curator', {
        method: 'POST',
        body: JSON.stringify(form),
      })
      setResult(res)
      toast({ title: 'Sucesso', description: 'Conteúdo gerado com sucesso!' })
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao processar com a IA.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAsDraft = async () => {
    if (!result) return
    setSaving(true)
    try {
      await createPost({
        title: result.title,
        hook: result.hook,
        content: result.content,
        hashtags: result.hashtags,
        cta_text: result.cta_text,
        seo_keywords: result.seo_keywords,
        type: 'trends',
        content_voice: 'commercial',
        author: 'Editoria AI',
        status: 'draft',
        is_published: false,
      })
      toast({ title: 'Sucesso', description: 'Post salvo como rascunho em Redação.' })
      setResult(null)
      setForm({ accessories: '', footwear: '', beauty: '', colors: '', trends: '', urgency: false })
    } catch (err) {
      toast({ title: 'Erro', description: 'Falha ao salvar rascunho.', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-brand-forest/10 rounded-xl flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-brand-forest" />
        </div>
        <div>
          <h2 className="text-2xl font-serif font-bold text-brand-forest">
            Hub de Curadoria Fashion IA
          </h2>
          <p className="text-muted-foreground text-sm">
            Gere cópias de alta conversão otimizadas para Instagram a partir de dados brutos de
            tendências.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-brand-forest/20">
          <CardHeader className="bg-brand-forest/5 pb-4 border-b">
            <CardTitle className="text-lg font-serif">Inputs de Moda</CardTitle>
            <CardDescription>Preencha os insights e tendências coletados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-wider font-bold">Acessórios</Label>
                <Input
                  placeholder="Ex: Maxi brincos prata..."
                  value={form.accessories}
                  onChange={(e) => setForm({ ...form, accessories: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-wider font-bold">Calçados</Label>
                <Input
                  placeholder="Ex: Bota western bico fino..."
                  value={form.footwear}
                  onChange={(e) => setForm({ ...form, footwear: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-wider font-bold">Beleza</Label>
                <Input
                  placeholder="Ex: Gloss labial espelhado..."
                  value={form.beauty}
                  onChange={(e) => setForm({ ...form, beauty: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-wider font-bold">
                  Colorimetria
                </Label>
                <Input
                  placeholder="Ex: Tons terrosos quentes..."
                  value={form.colors}
                  onChange={(e) => setForm({ ...form, colors: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-wider font-bold">
                Tendência Principal / Comentários
              </Label>
              <Textarea
                placeholder="Cole dados de mercado, matérias ou descrições gerais..."
                className="min-h-[100px] resize-none"
                value={form.trends}
                onChange={(e) => setForm({ ...form, trends: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100">
              <div className="space-y-0.5">
                <Label className="text-red-700 font-bold flex items-center gap-2">
                  Furo de Reportagem (Urgency)
                </Label>
                <p className="text-xs text-red-600/80">
                  Otimiza a cópia como notícia de primeira mão.
                </p>
              </div>
              <Switch
                checked={form.urgency}
                onCheckedChange={(c) => setForm({ ...form, urgency: c })}
                className="data-[state=checked]:bg-red-600"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-brand-forest hover:bg-brand-forest/90"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Instagram className="w-4 h-4 mr-2" />
              )}
              Otimizar para Instagram
            </Button>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          {result ? (
            <Card className="flex-1 shadow-sm border-brand-forest/20 overflow-hidden flex flex-col">
              <CardHeader className="bg-brand-forest text-white">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5" /> Resultado Gerado
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6 flex-1 overflow-y-auto">
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase text-muted-foreground font-bold">
                    Manchete (Título)
                  </Label>
                  <p className="font-serif text-lg font-bold leading-tight">{result.title}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase text-muted-foreground font-bold">
                    Gancho Inicial (2s)
                  </Label>
                  <p className="italic border-l-2 border-brand-forest pl-3 text-brand-forest font-medium">
                    {result.hook}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase text-muted-foreground font-bold">
                    Legenda / Texto Corpo
                  </Label>
                  <div
                    className="text-sm text-foreground/80 leading-relaxed bg-muted/30 p-4 rounded-md font-sans border"
                    dangerouslySetInnerHTML={{ __html: result.content }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-muted-foreground font-bold">
                      CTA
                    </Label>
                    <p className="text-sm font-bold text-brand-forest">{result.cta_text}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-muted-foreground font-bold">
                      SEO Keywords
                    </Label>
                    <p className="text-xs text-muted-foreground">{result.seo_keywords}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase text-muted-foreground font-bold">
                    Hashtags
                  </Label>
                  <p className="text-sm text-blue-600 font-medium">{result.hashtags}</p>
                </div>
              </CardContent>
              <div className="p-4 border-t bg-muted/10 shrink-0 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setResult(null)}>
                  Descartar
                </Button>
                <Button
                  onClick={handleSaveAsDraft}
                  disabled={saving}
                  className="bg-black hover:bg-black/80 text-white"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Salvar em Redação
                </Button>
              </div>
            </Card>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl bg-muted/20 text-muted-foreground p-12 text-center h-full min-h-[400px]">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <Sparkles className="w-8 h-8 text-brand-forest/40" />
              </div>
              <h3 className="font-serif font-bold text-lg mb-2">Aguardando Inputs</h3>
              <p className="text-sm max-w-sm">
                Preencha as informações de moda ao lado e deixe a IA formular uma chamada
                irresistível para as redes sociais da Moda Atual.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
