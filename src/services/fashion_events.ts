import pb from '@/lib/pocketbase/client'

export interface FashionEvent {
  id: string
  title: string
  description: string
  date: string
  location: string
  image: string
  created: string
  updated: string
}

export const getEvents = () =>
  pb.collection('fashion_events').getFullList<FashionEvent>({ sort: 'date' })
export const createEvent = (data: Partial<FashionEvent> | FormData) =>
  pb.collection('fashion_events').create<FashionEvent>(data)
export const updateEvent = (id: string, data: Partial<FashionEvent> | FormData) =>
  pb.collection('fashion_events').update<FashionEvent>(id, data)
export const deleteEvent = (id: string) => pb.collection('fashion_events').delete(id)
