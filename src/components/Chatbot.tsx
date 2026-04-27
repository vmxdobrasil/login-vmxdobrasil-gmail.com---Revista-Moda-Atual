import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import pb from '@/lib/pocketbase/client'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Olá! Sou a Assistente ModaAtual. Como posso ajudar você hoje?' },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const handleSend = async () => {
    if (!input.trim()) return
    const userMsg: Message = { role: 'user', content: input.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    try {
      const history = [...messages, userMsg].map((m) => ({ role: m.role, content: m.content }))
      const res = await pb.send('/backend/v1/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ messages: history }),
      })
      if (res.message) {
        setMessages((prev) => [
          ...prev,
          { role: res.message.role || 'assistant', content: res.message.content || '' },
        ])
      }
    } catch (err) {
      console.error(err)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Desculpe, tive um problema técnico. Tente novamente mais tarde.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end">
      {isOpen ? (
        <div className="w-80 h-[450px] bg-background border rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4 animate-fade-in-up">
          <div className="bg-brand-forest text-white p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <span className="font-serif font-bold text-sm">Assistente ModaAtual</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-muted/10 space-y-4" ref={scrollRef}>
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  'max-w-[85%] p-3 rounded-2xl text-sm whitespace-pre-wrap',
                  m.role === 'user'
                    ? 'bg-brand-forest text-white ml-auto rounded-br-sm'
                    : 'bg-card border text-foreground mr-auto rounded-bl-sm',
                )}
              >
                {m.content}
              </div>
            ))}
            {isLoading && (
              <div className="bg-card border text-foreground max-w-[85%] p-3 rounded-2xl text-sm mr-auto rounded-bl-sm animate-pulse flex items-center gap-2">
                <Bot className="w-4 h-4 opacity-50" /> Digitando...
              </div>
            )}
          </div>

          <div className="p-3 border-t shrink-0 flex items-center gap-2 bg-background">
            <Input
              placeholder="Digite sua mensagem..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 h-9 text-sm"
              disabled={isLoading}
            />
            <Button
              size="icon"
              className="h-9 w-9 shrink-0 bg-brand-forest hover:bg-brand-forest/90 text-white"
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : null}

      {!isOpen && (
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-elevation bg-brand-forest hover:bg-brand-forest/90 text-white animate-fade-in hover:scale-105 transition-transform"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}
    </div>
  )
}
