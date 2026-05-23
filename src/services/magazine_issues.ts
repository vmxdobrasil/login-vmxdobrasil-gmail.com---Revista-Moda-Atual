import pb from '@/lib/pocketbase/client'

export interface MagazineIssue {
  id: string
  title: string
  edition_number?: number
  publication_date?: string
  cover_image?: string
  pages?: string[]
  is_published: boolean
  created: string
  updated: string
}

export const getMagazineIssues = () =>
  pb
    .collection('magazine_issues')
    .getFullList<MagazineIssue>({ sort: '-publication_date', filter: 'is_published = true' })

export const getMagazineIssue = (id: string) =>
  pb.collection('magazine_issues').getOne<MagazineIssue>(id)
