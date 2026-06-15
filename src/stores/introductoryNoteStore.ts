import { create } from 'zustand'
import { gql } from 'graphql-request'
import { useClientStore } from './clientStore'

// ── Types ──────────────────────────────────────────────────────

export interface IntroductoryNoteListItem {
  id: string
  name: string
  tags: string[]
  coverImageUrl: string | null
  createdAt: string
}

export interface IntroductoryNoteFull {
  id: string
  name: string
  tags: string[]
  coverImageUrl: string | null
  pageContent: unknown
  createdAt: string
  updatedAt: string
}

export interface UpdateIntroductoryNoteInput {
  name?: string
  tags?: string[]
  coverImageUrl?: string | null
  pageContent?: unknown
}

// ── GQL ────────────────────────────────────────────────────────

const LIST_INTRO_NOTES = gql`
  query ListIntroductoryNotes {
    contentPages(type: INTRODUCTORY_NOTES) {
      id
      name
      tags
      coverImageUrl
      createdAt
    }
  }
`

const GET_INTRO_NOTE = gql`
  query GetIntroductoryNote($id: ID!) {
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

const CREATE_INTRO_NOTE = gql`
  mutation CreateIntroductoryNote($input: CreateContentPageInput!) {
    createContentPage(input: $input) {
      id
      name
      tags
      coverImageUrl
      createdAt
    }
  }
`

const UPDATE_INTRO_NOTE = gql`
  mutation UpdateIntroductoryNote($id: ID!, $input: UpdateContentPageInput!) {
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

const DELETE_INTRO_NOTE = gql`
  mutation DeleteIntroductoryNote($id: ID!) {
    deleteContentPage(id: $id)
  }
`

// ── Store ──────────────────────────────────────────────────────

interface IntroductoryNoteState {
  introductoryNotes: IntroductoryNoteListItem[]
  introductoryNote: IntroductoryNoteFull | null
  loading: boolean
  introductoryNoteLoading: boolean
  saving: boolean
  error: string | null

  fetchIntroductoryNotes: () => Promise<void>
  fetchIntroductoryNote: (id: string) => Promise<void>
  createIntroductoryNote: (name: string) => Promise<IntroductoryNoteListItem | null>
  updateIntroductoryNote: (id: string, input: UpdateIntroductoryNoteInput) => Promise<void>
  deleteIntroductoryNote: (id: string) => Promise<void>
}

export const useIntroductoryNoteStore = create<IntroductoryNoteState>((set) => ({
  introductoryNotes: [],
  introductoryNote: null,
  loading: false,
  introductoryNoteLoading: false,
  saving: false,
  error: null,

  fetchIntroductoryNotes: async () => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ loading: true, error: null })
    try {
      const data = await client.request<{ contentPages: IntroductoryNoteListItem[] }>(LIST_INTRO_NOTES)
      set({ introductoryNotes: data.contentPages, loading: false })
    } catch (e: any) {
      set({ loading: false, error: e.message ?? 'Failed to load introductory notes' })
    }
  },

  fetchIntroductoryNote: async (id: string) => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ introductoryNoteLoading: true, error: null })
    try {
      const data = await client.request<{ contentPage: IntroductoryNoteFull }>(GET_INTRO_NOTE, { id })
      set({ introductoryNote: data.contentPage, introductoryNoteLoading: false })
    } catch (e: any) {
      set({ introductoryNoteLoading: false, error: e.message ?? 'Failed to load introductory note' })
    }
  },

  createIntroductoryNote: async (name: string) => {
    const client = useClientStore.getState().client
    if (!client) return null
    set({ saving: true })
    try {
      const data = await client.request<{ createContentPage: IntroductoryNoteListItem }>(CREATE_INTRO_NOTE, {
        input: { type: 'INTRODUCTORY_NOTES', name },
      })
      const created = data.createContentPage
      set((s) => ({ introductoryNotes: [created, ...s.introductoryNotes], saving: false }))
      return created
    } catch (e: any) {
      set({ saving: false, error: e.message ?? 'Failed to create introductory note' })
      return null
    }
  },

  updateIntroductoryNote: async (id: string, input: UpdateIntroductoryNoteInput) => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ saving: true })
    try {
      const data = await client.request<{ updateContentPage: IntroductoryNoteFull }>(UPDATE_INTRO_NOTE, { id, input })
      const updated = data.updateContentPage
      set((s) => ({
        saving: false,
        introductoryNote: s.introductoryNote?.id === id ? { ...s.introductoryNote, ...updated } : s.introductoryNote,
        introductoryNotes: s.introductoryNotes.map((n) => (n.id === id ? { ...n, ...updated } : n)),
      }))
    } catch (e: any) {
      set({ saving: false, error: e.message ?? 'Failed to update introductory note' })
    }
  },

  deleteIntroductoryNote: async (id: string) => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ saving: true })
    try {
      await client.request(DELETE_INTRO_NOTE, { id })
      set((s) => ({
        saving: false,
        introductoryNotes: s.introductoryNotes.filter((n) => n.id !== id),
        introductoryNote: s.introductoryNote?.id === id ? null : s.introductoryNote,
      }))
    } catch (e: any) {
      set({ saving: false, error: e.message ?? 'Failed to delete introductory note' })
    }
  },
}))
