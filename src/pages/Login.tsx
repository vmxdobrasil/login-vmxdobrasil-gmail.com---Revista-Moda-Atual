import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useNavigate } from 'react-router-dom'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'

export default function Login() {
  const { signIn, user } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('valterpmendonca@gmail.com')
  const [password, setPassword] = useState('Skip@Pass')
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) navigate('/studio')
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const { error } = await signIn(email, password)
    if (error) setError(error.message)
    else navigate('/studio')
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted/30 relative">
      <Button variant="ghost" className="absolute top-4 left-4" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
      </Button>
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-card shadow-elevation rounded-lg w-96 space-y-6 animate-fade-in-up"
      >
        <div className="text-center">
          <h1 className="font-serif text-2xl font-bold text-brand-forest">Acesso Editorial</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Faça login para editar as colunas da revista
          </p>
        </div>
        {error && (
          <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded border border-red-100">
            {error}
          </div>
        )}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </div>
          <div className="space-y-2">
            <Label>Senha</Label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full bg-brand-forest hover:bg-brand-forest/90">
          Entrar no Studio
        </Button>
      </form>
    </div>
  )
}
