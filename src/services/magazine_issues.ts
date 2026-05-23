import pb from '@/lib/pocketbase/client'

export interface MagazineIssue {
  id: string
  collectionId: string
  collectionName: string
  title: string
  edition_number?: number
  publication_date?: string
  cover_image?: string
  pages?: string[] | string
  is_published: boolean
  created: string
  updated: string
}

export const getPublishedIssues = async () => {
  console.log('[Bug Scanner] Fetching collection: magazine_issues, filter: is_published = true')
  const records = await pb.collection('magazine_issues').getFullList<MagazineIssue>({
    filter: 'is_published = true',
    sort: '-publication_date,-created',
  })
  console.log(`[Bug Scanner] Records returned: ${records.length}`)
  return records
}

export const getIssue = async (id: string) => {
  console.log(`[Bug Scanner] Fetching collection: magazine_issues, filter: id = '${id}'`)
  const record = await pb.collection('magazine_issues').getOne<MagazineIssue>(id)
  console.log(`[Bug Scanner] Records returned: 1`)
  return record
}
