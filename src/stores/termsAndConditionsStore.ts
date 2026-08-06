import { create } from 'zustand'
import { gql } from 'graphql-request'
import { useClientStore } from './clientStore'
import { gqlErrorMessage } from '@/lib/gql-error'

// ── Types ──────────────────────────────────────────────────────

export interface TermsListItem {
  id: string
  name: string
  tags: string[]
  coverImageUrl: string | null
  createdAt: string
}

export interface TermsFull {
  id: string
  name: string
  tags: string[]
  coverImageUrl: string | null
  pageContent: unknown
  createdAt: string
  updatedAt: string
}

export interface UpdateTermsInput {
  name?: string
  tags?: string[]
  coverImageUrl?: string | null
  pageContent?: unknown
}

// ── GQL ────────────────────────────────────────────────────────

const LIST_TERMS = gql`
  query ListTerms {
    contentPages(type: TERMS_CONDITIONS) {
      id name tags coverImageUrl createdAt
    }
  }
`

const GET_TERMS = gql`
  query GetTerms($id: ID!) {
    contentPage(id: $id) {
      id name tags coverImageUrl pageContent createdAt updatedAt
    }
  }
`

const CREATE_TERMS = gql`
  mutation CreateTerms($input: CreateContentPageInput!) {
    createContentPage(input: $input) {
      id name tags coverImageUrl createdAt
    }
  }
`

const UPDATE_TERMS = gql`
  mutation UpdateTerms($id: ID!, $input: UpdateContentPageInput!) {
    updateContentPage(id: $id, input: $input) {
      id name tags coverImageUrl pageContent updatedAt
    }
  }
`

const DELETE_TERMS = gql`
  mutation DeleteTerms($id: ID!) {
    deleteContentPage(id: $id)
  }
`

// ── Store ──────────────────────────────────────────────────────

interface TermsState {
  termsList: TermsListItem[]
  terms: TermsFull | null
  loading: boolean
  termsLoading: boolean
  saving: boolean
  error: string | null

  fetchTermsList: () => Promise<void>
  fetchTerms: (id: string) => Promise<void>
  createTerms: (name: string) => Promise<TermsListItem | null>
  updateTerms: (id: string, input: UpdateTermsInput) => Promise<void>
  deleteTerms: (id: string) => Promise<void>
}

export const useTermsAndConditionsStore = create<TermsState>((set) => ({
  termsList: [],
  terms: null,
  loading: false,
  termsLoading: false,
  saving: false,
  error: null,

  fetchTermsList: async () => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ loading: true, error: null })
    try {
      const data = await client.request<{ contentPages: TermsListItem[] }>(LIST_TERMS)
      set({ termsList: data.contentPages, loading: false })
    } catch (e) {
      set({ loading: false, error: gqlErrorMessage(e, 'Failed to load terms pages') })
    }
  },

  fetchTerms: async (id) => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ termsLoading: true, error: null })
    try {
      const data = await client.request<{ contentPage: TermsFull }>(GET_TERMS, { id })
      set({ terms: data.contentPage, termsLoading: false })
    } catch (e) {
      set({ termsLoading: false, error: gqlErrorMessage(e, 'Failed to load terms page') })
    }
  },

  createTerms: async (name) => {
    const client = useClientStore.getState().client
    if (!client) return null
    set({ saving: true })
    try {
      const data = await client.request<{ createContentPage: TermsListItem }>(CREATE_TERMS, {
        input: { type: 'TERMS_CONDITIONS', name },
      })
      const created = data.createContentPage
      set((s) => ({ termsList: [created, ...s.termsList], saving: false }))
      return created
    } catch (e) {
      set({ saving: false, error: gqlErrorMessage(e, 'Failed to create terms page') })
      return null
    }
  },

  updateTerms: async (id, input) => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ saving: true })
    try {
      const data = await client.request<{ updateContentPage: TermsFull }>(UPDATE_TERMS, { id, input })
      const updated = data.updateContentPage
      set((s) => ({
        saving: false,
        terms: s.terms?.id === id ? { ...s.terms, ...updated } : s.terms,
        termsList: s.termsList.map((t) => (t.id === id ? { ...t, ...updated } : t)),
      }))
    } catch (e) {
      set({ saving: false, error: gqlErrorMessage(e, 'Failed to update terms page') })
    }
  },

  deleteTerms: async (id) => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ saving: true })
    try {
      await client.request(DELETE_TERMS, { id })
      set((s) => ({
        saving: false,
        termsList: s.termsList.filter((t) => t.id !== id),
        terms: s.terms?.id === id ? null : s.terms,
      }))
    } catch (e) {
      set({ saving: false, error: gqlErrorMessage(e, 'Failed to delete terms page') })
    }
  },
}))
