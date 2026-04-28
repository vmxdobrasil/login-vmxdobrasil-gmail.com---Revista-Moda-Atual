import pb from '@/lib/pocketbase/client'

export interface Lead {
  id: string
  name: string
  email: string
  type: 'advertise' | 'subscribe'
  notes?: string
  created: string
  updated: string
}

export const getLeads = () => pb.collection('leads').getFullList<Lead>({ sort: '-created' })
