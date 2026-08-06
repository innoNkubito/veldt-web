import { create } from 'zustand'
import { gql } from 'graphql-request'
import { useClientStore } from './clientStore'
import { gqlErrorMessage } from '@/lib/gql-error'

// ── Types ──────────────────────────────────────────────────────

export interface AreaListItem {
  id: string
  name: string
  country: string | null
  tags: string[]
  coverImageUrl: string | null
  createdAt: string
}

export interface AreaFull {
  id: string
  name: string
  country: string | null
  tags: string[]
  coverImageUrl: string | null
  locationName: string | null
  latitude: number | null
  longitude: number | null
  pageContent: unknown
  createdAt: string
  updatedAt: string
}

export interface UpdateAreaInput {
  name?: string
  country?: string | null
  locationName?: string | null
  latitude?: number | null
  longitude?: number | null
  tags?: string[]
  coverImageUrl?: string | null
  pageContent?: unknown
}

// ── GQL ────────────────────────────────────────────────────────

const LIST_AREAS = gql`
  query ListAreas {
    contentPages(type: AREA) {
      id
      name
      country
      tags
      coverImageUrl
      createdAt
    }
  }
`

const GET_AREA = gql`
  query GetArea($id: ID!) {
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
    }
  }
`

const CREATE_AREA = gql`
  mutation CreateArea($input: CreateContentPageInput!) {
    createContentPage(input: $input) {
      id
      name
      country
      tags
      coverImageUrl
      createdAt
    }
  }
`

const UPDATE_AREA = gql`
  mutation UpdateArea($id: ID!, $input: UpdateContentPageInput!) {
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
    }
  }
`

const DELETE_AREA = gql`
  mutation DeleteArea($id: ID!) {
    deleteContentPage(id: $id)
  }
`

// ── Store ──────────────────────────────────────────────────────

interface AreaState {
  areas: AreaListItem[]
  area: AreaFull | null
  loading: boolean
  areaLoading: boolean
  saving: boolean
  error: string | null

  fetchAreas: () => Promise<void>
  fetchArea: (id: string) => Promise<void>
  createArea: (name: string) => Promise<AreaListItem | null>
  updateArea: (id: string, input: UpdateAreaInput) => Promise<void>
  deleteArea: (id: string) => Promise<void>
}

export const useAreaStore = create<AreaState>((set, get) => ({
  areas: [],
  area: null,
  loading: false,
  areaLoading: false,
  saving: false,
  error: null,

  fetchAreas: async () => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ loading: true, error: null })
    try {
      const data = await client.request<{ contentPages: AreaListItem[] }>(LIST_AREAS)
      set({ areas: data.contentPages, loading: false })
    } catch (e) {
      set({ loading: false, error: gqlErrorMessage(e, 'Failed to load areas') })
    }
  },

  fetchArea: async (id: string) => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ areaLoading: true, error: null })
    try {
      const data = await client.request<{ contentPage: AreaFull }>(GET_AREA, { id })
      set({ area: data.contentPage, areaLoading: false })
    } catch (e) {
      set({ areaLoading: false, error: gqlErrorMessage(e, 'Failed to load area') })
    }
  },

  createArea: async (name: string) => {
    const client = useClientStore.getState().client
    if (!client) return null
    set({ saving: true })
    try {
      const data = await client.request<{ createContentPage: AreaListItem }>(CREATE_AREA, {
        input: { type: 'AREA', name },
      })
      const created = data.createContentPage
      set((s) => ({ areas: [created, ...s.areas], saving: false }))
      return created
    } catch (e) {
      set({ saving: false, error: gqlErrorMessage(e, 'Failed to create area') })
      return null
    }
  },

  updateArea: async (id: string, input: UpdateAreaInput) => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ saving: true })
    try {
      const data = await client.request<{ updateContentPage: AreaFull }>(UPDATE_AREA, { id, input })
      const updated = data.updateContentPage
      set((s) => ({
        saving: false,
        area: s.area?.id === id ? { ...s.area, ...updated } : s.area,
        areas: s.areas.map((a) => (a.id === id ? { ...a, ...updated } : a)),
      }))
    } catch (e) {
      set({ saving: false, error: gqlErrorMessage(e, 'Failed to update area') })
    }
  },

  deleteArea: async (id: string) => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ saving: true })
    try {
      await client.request(DELETE_AREA, { id })
      set((s) => ({
        saving: false,
        areas: s.areas.filter((a) => a.id !== id),
        area: s.area?.id === id ? null : s.area,
      }))
    } catch (e) {
      set({ saving: false, error: gqlErrorMessage(e, 'Failed to delete area') })
    }
  },
}))
