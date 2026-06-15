import { create } from 'zustand'
import { gql } from 'graphql-request'
import { useClientStore } from './clientStore'

// ── Types ──────────────────────────────────────────────────────

export interface AboutUsListItem {
  id: string
  name: string
  tags: string[]
  coverImageUrl: string | null
  createdAt: string
}

export interface AboutUsFull {
  id: string
  name: string
  tags: string[]
  coverImageUrl: string | null
  pageContent: unknown
  createdAt: string
  updatedAt: string
}

export interface UpdateAboutUsInput {
  name?: string
  tags?: string[]
  coverImageUrl?: string | null
  pageContent?: unknown
}

// ── GQL ────────────────────────────────────────────────────────

const LIST_ABOUT_US = gql`
  query ListAboutUs {
    contentPages(type: ABOUT_US) {
      id
      name
      tags
      coverImageUrl
      createdAt
    }
  }
`

const GET_ABOUT_US = gql`
  query GetAboutUs($id: ID!) {
    contentPage(id: $id) {
      id
      name
      tags
      coverImageUrl
      pageContent
      createdAt
      updatedAt
    }
  }
`

const CREATE_ABOUT_US = gql`
  mutation CreateAboutUs($input: CreateContentPageInput!) {
    createContentPage(input: $input) {
      id
      name
      tags
      coverImageUrl
      createdAt
    }
  }
`

const UPDATE_ABOUT_US = gql`
  mutation UpdateAboutUs($id: ID!, $input: UpdateContentPageInput!) {
    updateContentPage(id: $id, input: $input) {
      id
      name
      tags
      coverImageUrl
      pageContent
      updatedAt
    }
  }
`

const DELETE_ABOUT_US = gql`
  mutation DeleteAboutUs($id: ID!) {
    deleteContentPage(id: $id)
  }
`

// ── Store ──────────────────────────────────────────────────────

interface AboutUsState {
  aboutUsList: AboutUsListItem[]
  aboutUs: AboutUsFull | null
  loading: boolean
  aboutUsLoading: boolean
  saving: boolean
  error: string | null

  fetchAboutUsList: () => Promise<void>
  fetchAboutUs: (id: string) => Promise<void>
  createAboutUs: (name: string) => Promise<AboutUsListItem | null>
  updateAboutUs: (id: string, input: UpdateAboutUsInput) => Promise<void>
  deleteAboutUs: (id: string) => Promise<void>
}

export const useAboutUsStore = create<AboutUsState>((set) => ({
  aboutUsList: [],
  aboutUs: null,
  loading: false,
  aboutUsLoading: false,
  saving: false,
  error: null,

  fetchAboutUsList: async () => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ loading: true, error: null })
    try {
      const data = await client.request<{ contentPages: AboutUsListItem[] }>(LIST_ABOUT_US)
      set({ aboutUsList: data.contentPages, loading: false })
    } catch (e: any) {
      set({ loading: false, error: e.message ?? 'Failed to load about us pages' })
    }
  },

  fetchAboutUs: async (id: string) => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ aboutUsLoading: true, error: null })
    try {
      const data = await client.request<{ contentPage: AboutUsFull }>(GET_ABOUT_US, { id })
      set({ aboutUs: data.contentPage, aboutUsLoading: false })
    } catch (e: any) {
      set({ aboutUsLoading: false, error: e.message ?? 'Failed to load about us page' })
    }
  },

  createAboutUs: async (name: string) => {
    const client = useClientStore.getState().client
    if (!client) return null
    set({ saving: true })
    try {
      const data = await client.request<{ createContentPage: AboutUsListItem }>(CREATE_ABOUT_US, {
        input: { type: 'ABOUT_US', name },
      })
      const created = data.createContentPage
      set((s) => ({ aboutUsList: [created, ...s.aboutUsList], saving: false }))
      return created
    } catch (e: any) {
      set({ saving: false, error: e.message ?? 'Failed to create about us page' })
      return null
    }
  },

  updateAboutUs: async (id: string, input: UpdateAboutUsInput) => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ saving: true })
    try {
      const data = await client.request<{ updateContentPage: AboutUsFull }>(UPDATE_ABOUT_US, { id, input })
      const updated = data.updateContentPage
      set((s) => ({
        saving: false,
        aboutUs: s.aboutUs?.id === id ? { ...s.aboutUs, ...updated } : s.aboutUs,
        aboutUsList: s.aboutUsList.map((a) => (a.id === id ? { ...a, ...updated } : a)),
      }))
    } catch (e: any) {
      set({ saving: false, error: e.message ?? 'Failed to update about us page' })
    }
  },

  deleteAboutUs: async (id: string) => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ saving: true })
    try {
      await client.request(DELETE_ABOUT_US, { id })
      set((s) => ({
        saving: false,
        aboutUsList: s.aboutUsList.filter((a) => a.id !== id),
        aboutUs: s.aboutUs?.id === id ? null : s.aboutUs,
      }))
    } catch (e: any) {
      set({ saving: false, error: e.message ?? 'Failed to delete about us page' })
    }
  },
}))
