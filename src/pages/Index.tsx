import { CanvasPreview } from '@/components/CanvasPreview'
import { EditorPanel } from '@/components/EditorPanel'

export default function Index() {
  return (
    <div className="flex flex-col md:flex-row h-full w-full">
      {/* Central Canvas Area */}
      <div className="flex-1 h-full overflow-hidden flex flex-col">
        <CanvasPreview />
      </div>

      {/* Right Sidebar Editor */}
      <EditorPanel />
    </div>
  )
}
