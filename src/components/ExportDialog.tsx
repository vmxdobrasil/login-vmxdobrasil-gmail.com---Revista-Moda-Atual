import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, Loader2 } from 'lucide-react'
import useEditorStore from '@/stores/use-editor-store'
import { Button } from '@/components/ui/button'

export function ExportDialog() {
  const { isExporting, exportProgress, updateField } = useEditorStore()
  const isComplete = exportProgress === 100

  return (
    <Dialog
      open={isExporting}
      onOpenChange={(open) => !open && !isExporting && updateField('isExporting', false)}
    >
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <DialogTitle className="text-center font-serif text-2xl">
            {isComplete ? 'Exportação Concluída' : 'Processando Post...'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isComplete
              ? 'Seu material foi gerado com sucesso e está pronto para uso.'
              : 'Aplicando filtros e renderizando tipografia em alta resolução.'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-8 space-y-6">
          {isComplete ? (
            <div className="animate-in zoom-in duration-500">
              <CheckCircle2
                className="w-20 h-20 text-brand-forest mx-auto mb-4"
                strokeWidth={1.5}
              />
              <p className="text-sm text-muted-foreground mb-4">
                Arquivo salvo como moda_atual_post.png
              </p>
              <Button
                onClick={() => updateField('isExporting', false)}
                className="w-full bg-brand-gold hover:bg-brand-gold/90 text-black"
              >
                Fechar
              </Button>
            </div>
          ) : (
            <div className="w-full space-y-4">
              <div className="relative w-16 h-16 mx-auto mb-6">
                <Loader2 className="w-16 h-16 animate-spin text-muted" strokeWidth={1} />
                <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                  {exportProgress}%
                </div>
              </div>
              <Progress value={exportProgress} className="h-2 w-full" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
