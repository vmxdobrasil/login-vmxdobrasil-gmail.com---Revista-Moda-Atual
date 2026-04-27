import pb from '@/lib/pocketbase/client'

export interface MagazinePost {
  id: string
  title: string
  subtitle: string
  author: string
  content: string
  type: 'social' | 'trends' | 'interview' | 'marketing' | 'style' | 'brand_history' | 'sacoleira'
  main_image: string
  is_published: boolean
  created: string
  updated: string
}

export const getPosts = () =>
  pb.collection('magazine_posts').getFullList<MagazinePost>({ sort: '-created' })
export const getPost = (id: string) => pb.collection('magazine_posts').getOne<MagazinePost>(id)
export const createPost = (data: Partial<MagazinePost> | FormData) =>
  pb.collection('magazine_posts').create<MagazinePost>(data)
export const updatePost = (id: string, data: Partial<MagazinePost> | FormData) =>
  pb.collection('magazine_posts').update<MagazinePost>(id, data)
export const deletePost = (id: string) => pb.collection('magazine_posts').delete(id)
