import pb from '@/lib/pocketbase/client'

export interface MediaAsset {
  id: string
  title: string
  file: string
  alt_text: string
  created: string
  updated: string
}

export const getMediaAssets = () =>
  pb.collection('media_assets').getFullList<MediaAsset>({ sort: '-created' })
export const createMediaAsset = (data: FormData) =>
  pb.collection('media_assets').create<MediaAsset>(data)
export const deleteMediaAsset = (id: string) => pb.collection('media_assets').delete(id)
