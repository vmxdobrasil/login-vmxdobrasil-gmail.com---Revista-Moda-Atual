import pb from '@/lib/pocketbase/client'

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  bio: string
  role: string
  social_links: any
  created: string
  updated: string
}

export const getUsers = () => pb.collection('users').getFullList<User>()
export const getUser = (id: string) => pb.collection('users').getOne<User>(id)
