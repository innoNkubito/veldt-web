import { create } from 'zustand'
import { gql } from 'graphql-request'
import { useClientStore } from './clientStore'

// ── Types ──────────────────────────────────────────────────────

export interface AreaOption {
  id: string
  name: string
}

export interface PropertyRoom {
  id: string
  roomType: string
  description: string | null
  photos: string[]
  position: number
}

export interface PropertyListItem {
  id: string
  name: string
  country: string | null
  tags: string[]
  area: { id: string; name: string } | null
  rooms: { id: string }[]
  coverImageUrl: string | null
  createdAt: string
}

export interface PropertyFull {
  id: string
  name: string
  country: string | null
  tags: string[]
  coverImageUrl: string | null
  locationName: string | null
  latitude: number | null
  longitude: number | null
  pageContent: unknown
  area: { id: string; name: string } | null
  rooms: PropertyRoom[]
  createdAt: string
  updatedAt: string
}

// ── GQL ────────────────────────────────────────────────────────

const LIST_PROPERTIES = gql`
  query ListProperties {
    contentPages(type: PROPERTY) {
      id
      name
      country
      tags
      coverImageUrl
      createdAt
      area { id name }
      rooms { id }
    }
  }
`

const GET_PROPERTY = gql`
  query GetProperty($id: ID!) {
    contentPage(id: $id) {
      id
      name
      country
      tags
      coverImageUrl
      locationName
      latitude
      longitude
      pageContent
      createdAt
      updatedAt
      area { id name }
      rooms {
        id
        roomType
        description
        photos
        position
      }
    }
  }
`

const CREATE_PROPERTY = gql`
  mutation CreateProperty($input: CreateContentPageInput!) {
    createContentPage(input: $input) {
      id
      name
      country
      tags
      coverImageUrl
      createdAt
      area { id name }
      rooms { id }
    }
  }
`

const UPDATE_PROPERTY = gql`
  mutation UpdateProperty($id: ID!, $input: UpdateContentPageInput!) {
    updateContentPage(id: $id, input: $input) {
      id
      name
      country
      tags
      coverImageUrl
      locationName
      latitude
      longitude
      pageContent
      updatedAt
      area { id name }
    }
  }
`

const DELETE_PROPERTY = gql`
  mutation DeleteProperty($id: ID!) {
    deleteContentPage(id: $id)
  }
`

const LIST_AREAS = gql`
  query ListAreas {
    contentPages(type: AREA) {
      id
      name
    }
  }
`

const ADD_ROOM = gql`
  mutation AddRoom($pageId: ID!, $input: PropertyRoomInput!) {
    addPropertyRoom(pageId: $pageId, input: $input) {
      id
      roomType
      description
      photos
      position
    }
  }
`

const UPDATE_ROOM = gql`
  mutation UpdateRoom($id: ID!, $input: PropertyRoomInput!) {
    updatePropertyRoom(id: $id, input: $input) {
      id
      roomType
      description
      photos
      position
    }
  }
`

const DELETE_ROOM = gql`
  mutation DeleteRoom($id: ID!) {
    deletePropertyRoom(id: $id)
  }
`

// ── Store ──────────────────────────────────────────────────────

interface ContentLibraryState {
  properties: PropertyListItem[]
  property: PropertyFull | null
  areas: AreaOption[]
  loading: boolean
  propertyLoading: boolean
  saving: boolean
  error: string | null

  fetchProperties: () => Promise<void>
  fetchProperty: (id: string) => Promise<void>
  fetchAreas: () => Promise<void>
  createProperty: (name: string) => Promise<PropertyListItem | null>
  updateProperty: (id: string, input: UpdatePropertyInput) => Promise<void>
  deleteProperty: (id: string) => Promise<void>
  addRoom: (pageId: string, input: RoomInput) => Promise<void>
  updateRoom: (id: string, input: RoomInput) => Promise<void>
  deleteRoom: (id: string) => Promise<void>
}

export interface UpdatePropertyInput {
  name?: string
  country?: string | null
  areaId?: string | null
  tags?: string[]
  coverImageUrl?: string | null
  locationName?: string | null
  latitude?: number | null
  longitude?: number | null
  pageContent?: unknown
}

export interface RoomInput {
  roomType: string
  description?: string | null
  photos?: string[]
  position?: number
}

export const useContentLibraryStore = create<ContentLibraryState>((set, get) => ({
  properties: [],
  property: null,
  areas: [],
  loading: false,
  propertyLoading: false,
  saving: false,
  error: null,

  fetchProperties: async () => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ loading: true, error: null })
    try {
      const data = await client.request<{ contentPages: PropertyListItem[] }>(LIST_PROPERTIES)
      set({ properties: data.contentPages, loading: false })
    } catch (e: any) {
      set({ loading: false, error: e.message ?? 'Failed to load properties' })
    }
  },

  fetchProperty: async (id: string) => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ propertyLoading: true, error: null })
    try {
      const data = await client.request<{ contentPage: PropertyFull }>(GET_PROPERTY, { id })
      set({ property: data.contentPage, propertyLoading: false })
    } catch (e: any) {
      set({ propertyLoading: false, error: e.message ?? 'Failed to load property' })
    }
  },

  fetchAreas: async () => {
    const client = useClientStore.getState().client
    if (!client) return
    try {
      const data = await client.request<{ contentPages: AreaOption[] }>(LIST_AREAS)
      set({ areas: data.contentPages })
    } catch {
      // non-blocking — area dropdown just stays empty
    }
  },

  createProperty: async (name: string) => {
    const client = useClientStore.getState().client
    if (!client) return null
    set({ saving: true })
    try {
      const data = await client.request<{ createContentPage: PropertyListItem }>(CREATE_PROPERTY, {
        input: { type: 'PROPERTY', name },
      })
      const created = data.createContentPage
      set((s) => ({ properties: [created, ...s.properties], saving: false }))
      return created
    } catch (e: any) {
      set({ saving: false, error: e.message ?? 'Failed to create property' })
      return null
    }
  },

  updateProperty: async (id: string, input: UpdatePropertyInput) => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ saving: true })
    try {
      const data = await client.request<{ updateContentPage: PropertyFull }>(UPDATE_PROPERTY, {
        id,
        input,
      })
      const updated = data.updateContentPage
      set((s) => ({
        saving: false,
        property: s.property?.id === id ? { ...s.property, ...updated } : s.property,
        properties: s.properties.map((p) =>
          p.id === id ? { ...p, ...updated } : p,
        ),
      }))
    } catch (e: any) {
      set({ saving: false, error: e.message ?? 'Failed to update property' })
    }
  },

  deleteProperty: async (id: string) => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ saving: true })
    try {
      await client.request(DELETE_PROPERTY, { id })
      set((s) => ({
        saving: false,
        properties: s.properties.filter((p) => p.id !== id),
        property: s.property?.id === id ? null : s.property,
      }))
    } catch (e: any) {
      set({ saving: false, error: e.message ?? 'Failed to delete property' })
    }
  },

  addRoom: async (pageId: string, input: RoomInput) => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ saving: true })
    try {
      const data = await client.request<{ addPropertyRoom: PropertyRoom }>(ADD_ROOM, {
        pageId,
        input,
      })
      const room = data.addPropertyRoom
      set((s) => ({
        saving: false,
        property: s.property
          ? { ...s.property, rooms: [...s.property.rooms, room] }
          : s.property,
      }))
    } catch (e: any) {
      set({ saving: false, error: e.message ?? 'Failed to add room' })
    }
  },

  updateRoom: async (id: string, input: RoomInput) => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ saving: true })
    try {
      const data = await client.request<{ updatePropertyRoom: PropertyRoom }>(UPDATE_ROOM, {
        id,
        input,
      })
      const updated = data.updatePropertyRoom
      set((s) => ({
        saving: false,
        property: s.property
          ? {
              ...s.property,
              rooms: s.property.rooms.map((r) => (r.id === id ? updated : r)),
            }
          : s.property,
      }))
    } catch (e: any) {
      set({ saving: false, error: e.message ?? 'Failed to update room' })
    }
  },

  deleteRoom: async (id: string) => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ saving: true })
    try {
      await client.request(DELETE_ROOM, { id })
      set((s) => ({
        saving: false,
        property: s.property
          ? { ...s.property, rooms: s.property.rooms.filter((r) => r.id !== id) }
          : s.property,
      }))
    } catch (e: any) {
      set({ saving: false, error: e.message ?? 'Failed to delete room' })
    }
  },
}))
