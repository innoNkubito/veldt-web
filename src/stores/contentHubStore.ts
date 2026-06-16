import { create } from 'zustand'
import { gql } from 'graphql-request'
import { useClientStore } from './clientStore'
import type { ContentType } from '@/lib/contentTypes'

// ── Types ──────────────────────────────────────────────────────

export interface HubContentItem {
  id: string
  type: ContentType
  name: string
  tags: string[]
  coverImageUrl: string | null
  country: string | null
  area: { id: string; name: string } | null
  createdAt: string
}

// ── GQL ────────────────────────────────────────────────────────

const LIST_ALL_CONTENT = gql`
  query ListAllContent {
    contentPages {
      id
      type
      name
      tags
      coverImageUrl
      country
      createdAt
      area { id name }
    }
  }
`

const CREATE_CONTENT_PAGE = gql`
  mutation HubCreateContentPage($input: CreateContentPageInput!) {
    createContentPage(input: $input) {
      id
      type
      name
      tags
      coverImageUrl
      country
      createdAt
      area { id name }
    }
  }
`

// ── Store ──────────────────────────────────────────────────────

interface ContentHubState {
  pages: HubContentItem[]
  loading: boolean
  saving: boolean
  error: string | null

  fetchAll: () => Promise<void>
  createPage: (type: ContentType, name: string) => Promise<HubContentItem | null>
}

export const useContentHubStore = create<ContentHubState>((set) => ({
  pages: [],
  loading: false,
  saving: false,
  error: null,

  fetchAll: async () => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ loading: true, error: null })
    try {
      const data = await client.request<{ contentPages: HubContentItem[] }>(LIST_ALL_CONTENT)
      // Filter to only the types we surface in the hub
      const known = new Set(['PROPERTY', 'AREA', 'ACTIVITY', 'ABOUT_US', 'INTRODUCTORY_NOTES', 'TERMS_CONDITIONS'])
      set({
        pages: data.contentPages.filter((p) => known.has(p.type)),
        loading: false,
      })
    } catch (e: any) {
      set({ loading: false, error: e.message ?? 'Failed to load content' })
    }
  },

  createPage: async (type: ContentType, name: string) => {
    const client = useClientStore.getState().client
    if (!client) return null
    set({ saving: true })
    try {
      const data = await client.request<{ createContentPage: HubContentItem }>(CREATE_CONTENT_PAGE, {
        input: { type, name },
      })
      const created = data.createContentPage
      set((s) => ({ pages: [created, ...s.pages], saving: false }))
      return created
    } catch (e: any) {
      set({ saving: false, error: e.message ?? 'Failed to create content page' })
      return null
    }
  },
}))
