import pb from '@/lib/pocketbase/client'

export interface MagazinePost {
  id: string
  title: string
  subtitle: string
  author: string
  content: string
  type: 'social' | 'trends' | 'interview' | 'marketing' | 'style' | 'brand_history' | 'sacoleira'
  para_category?: 'projects' | 'areas' | 'resources' | 'archive'
  content_voice?: 'editorial' | 'commercial' | 'conversion'
  hook?: string
  seo_keywords?: string
  hashtags?: string
  cta_text?: string
  main_image: string
  gallery?: string[]
  columnist_bio?: string
  columnist_photo?: string
  is_published: boolean
  status: 'draft' | 'review' | 'published'
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
