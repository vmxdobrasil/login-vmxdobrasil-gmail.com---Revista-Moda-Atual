import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Format = '1:1' | '9:16' | '16:9'
export type Theme = 'light' | 'dark'
export type Filter = 'none' | 'grayscale' | 'sepia' | 'contrast'
export type TemplateId = 'minimalist' | 'editorial' | 'cover' | 'quote'

export interface EditorState {
  headline: string
  subtitle: string
  date: string
  imageUrl: string
  format: Format
  theme: Theme
  filter: Filter
  templateId: TemplateId
  isExporting: boolean
  exportProgress: number
}

interface EditorContextType extends EditorState {
  updateField: <K extends keyof EditorState>(field: K, value: EditorState[K]) => void
  simulateExport: () => void
}

const initialState: EditorState = {
  headline: 'TENDÊNCIAS DE OUTONO',
  subtitle: 'O renascimento da alfaiataria clássica nas ruas de Milão',
  date: 'EDIÇÃO 42 • MAIO 2026',
  imageUrl: 'https://img.usecurling.com/p/800/1200?q=high%20fashion%20model',
  format: '1:1',
  theme: 'light',
  filter: 'none',
  templateId: 'editorial',
  isExporting: false,
  exportProgress: 0,
}

const loadState = (): EditorState => {
  try {
    const saved = localStorage.getItem('editor-state')
    if (saved) {
      const parsed = JSON.parse(saved)
      return { ...initialState, ...parsed, isExporting: false, exportProgress: 0 }
    }
  } catch (e) {
    console.error('Failed to load state', e)
  }
  return initialState
}

const EditorContext = createContext<EditorContextType | undefined>(undefined)

export function EditorProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<EditorState>(loadState)

  useEffect(() => {
    const stateToSave = { ...state, isExporting: false, exportProgress: 0 }
    localStorage.setItem('editor-state', JSON.stringify(stateToSave))
  }, [state])

  const updateField = <K extends keyof EditorState>(field: K, value: EditorState[K]) => {
    setState((prev) => ({ ...prev, [field]: value }))
  }

  const simulateExport = () => {
    updateField('isExporting', true)
    updateField('exportProgress', 0)

    let progress = 0
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        updateField('exportProgress', 100)
        setTimeout(() => {
          updateField('isExporting', false)
          updateField('exportProgress', 0)
        }, 1500)
      } else {
        updateField('exportProgress', progress)
      }
    }, 200)
  }

  return (
    <EditorContext.Provider value={{ ...state, updateField, simulateExport }}>
      {children}
    </EditorContext.Provider>
  )
}

export default function useEditorStore() {
  const context = useContext(EditorContext)
  if (context === undefined) {
    throw new Error('useEditorStore must be used within an EditorProvider')
  }
  return context
}
