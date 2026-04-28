import { useState, useEffect } from 'react'
import { getLeads, Lead } from '@/services/leads'
import { useRealtime } from '@/hooks/use-realtime'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Users, Megaphone, TrendingUp } from 'lucide-react'

export function LeadsDashboard() {
  const [leads, setLeads] = useState<Lead[]>([])

  const loadLeads = async () => {
    try {
      const data = await getLeads()
      setLeads(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadLeads()
  }, [])
  useRealtime('leads', loadLeads)

  const subscribers = leads.filter((l) => l.type === 'subscribe').length
  const advertisers = leads.filter((l) => l.type === 'advertise').length

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 w-full animate-fade-in">
      <div>
        <h2 className="font-serif text-3xl font-bold text-foreground">Painel de Conversão</h2>
        <p className="text-muted-foreground mt-1">
          Monitore o crescimento de assinantes e anunciantes da revista.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm border-brand-forest/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Total de Leads
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-brand-forest" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-serif">{leads.length}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-brand-forest/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Assinantes
            </CardTitle>
            <Users className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-serif">{subscribers}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-brand-forest/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Anunciantes
            </CardTitle>
            <Megaphone className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-serif">{advertisers}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Leads Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${lead.type === 'subscribe' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}
                    >
                      {lead.type === 'subscribe' ? 'Assinante' : 'Anunciante'}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(lead.created).toLocaleDateString('pt-BR')}
                  </TableCell>
                </TableRow>
              ))}
              {leads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Nenhum lead encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
