import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Type, Image as ImageIcon, Settings2, Sparkles, RefreshCw } from 'lucide-react'
import useEditorStore from '@/stores/use-editor-store'

export function EditorPanel() {
  const { headline, subtitle, date, imageUrl, format, theme, filter, updateField } =
    useEditorStore()

  const generateRandomImage = () => {
    const randomSeed = Math.floor(Math.random() * 1000)
    updateField(
      'imageUrl',
      `https://img.usecurling.com/p/800/1200?q=high%20fashion%20model&seed=${randomSeed}`,
    )
  }

  return (
    <div className="w-full md:w-80 lg:w-96 border-l bg-card flex flex-col h-full shrink-0">
      <div className="p-4 border-b">
        <h2 className="font-serif text-lg font-semibold">Ferramentas de Edição</h2>
        <p className="text-xs text-muted-foreground">Personalize o design do seu post</p>
      </div>

      <ScrollArea className="flex-1">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-12">
            <TabsTrigger
              value="content"
              className="flex-1 h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
            >
              <Type className="w-4 h-4 mr-2" />
              Conteúdo
            </TabsTrigger>
            <TabsTrigger
              value="style"
              className="flex-1 h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
            >
              <Settings2 className="w-4 h-4 mr-2" />
              Estilo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="p-4 space-y-6 m-0 animate-fade-in">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Tamanho do Post
                </Label>
                <ToggleGroup
                  type="single"
                  value={format}
                  onValueChange={(val) => val && updateField('format', val as any)}
                  className="justify-start w-full"
                >
                  <ToggleGroupItem value="1:1" className="flex-1 border text-xs">
                    Feed (1:1)
                  </ToggleGroupItem>
                  <ToggleGroupItem value="9:16" className="flex-1 border text-xs">
                    Stories
                  </ToggleGroupItem>
                  <ToggleGroupItem value="16:9" className="flex-1 border text-xs">
                    Banner
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Manchete Principal</Label>
                  <span className="text-xs text-muted-foreground">{headline.length}/40</span>
                </div>
                <Textarea
                  value={headline}
                  onChange={(e) => updateField('headline', e.target.value)}
                  className="font-serif resize-none"
                  rows={2}
                  maxLength={40}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Subtítulo</Label>
                  <span className="text-xs text-muted-foreground">{subtitle.length}/100</span>
                </div>
                <Textarea
                  value={subtitle}
                  onChange={(e) => updateField('subtitle', e.target.value)}
                  className="resize-none text-sm"
                  rows={3}
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <Label>Edição / Data (Label superior)</Label>
                <Input
                  value={date}
                  onChange={(e) => updateField('date', e.target.value)}
                  className="text-sm uppercase"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="style" className="p-4 space-y-6 m-0 animate-fade-in">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Imagem de Fundo
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={imageUrl}
                    onChange={(e) => updateField('imageUrl', e.target.value)}
                    className="flex-1 text-xs"
                    placeholder="URL da imagem..."
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={generateRandomImage}
                    title="Gerar nova imagem"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tema de Cores da Tipografia</Label>
                <ToggleGroup
                  type="single"
                  value={theme}
                  onValueChange={(val) => val && updateField('theme', val as any)}
                  className="justify-start w-full"
                >
                  <ToggleGroupItem
                    value="light"
                    className="flex-1 border bg-white text-black hover:bg-gray-100 hover:text-black data-[state=on]:border-primary"
                  >
                    Modo Light
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="dark"
                    className="flex-1 border bg-black text-white hover:bg-gray-900 hover:text-white data-[state=on]:border-primary"
                  >
                    Modo Dark
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Filtros de Revista
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'none', label: 'Original' },
                    { id: 'grayscale', label: 'Preto e Branco' },
                    { id: 'sepia', label: 'Vintage' },
                    { id: 'contrast', label: 'Alto Contraste' },
                  ].map((f) => (
                    <Button
                      key={f.id}
                      variant={filter === f.id ? 'default' : 'outline'}
                      className="justify-start text-xs h-9"
                      onClick={() => updateField('filter', f.id as any)}
                    >
                      {f.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  )
}
