import { create } from 'zustand'
import { gql } from 'graphql-request'
import { useClientStore } from './clientStore'
import { gqlErrorMessage } from '@/lib/gql-error'

// ── Types ──────────────────────────────────────────────────────

export interface ActivityListItem {
  id: string
  name: string
  country: string | null
  tags: string[]
  coverImageUrl: string | null
  area: { id: string; name: string } | null
  createdAt: string
}

export interface ActivityFull {
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
  createdAt: string
  updatedAt: string
}

export interface UpdateActivityInput {
  name?: string
  country?: string | null
  locationName?: string | null
  areaId?: string | null
  tags?: string[]
  coverImageUrl?: string | null
  pageContent?: unknown
}

// ── GQL ────────────────────────────────────────────────────────

const LIST_ACTIVITIES = gql`
  query ListActivities {
    contentPages(type: ACTIVITY) {
      id
      name
      country
      tags
      coverImageUrl
      createdAt
      area { id name }
    }
  }
`

const GET_ACTIVITY = gql`
  query GetActivity($id: ID!) {
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
    }
  }
`

const CREATE_ACTIVITY = gql`
  mutation CreateActivity($input: CreateContentPageInput!) {
    createContentPage(input: $input) {
      id
      name
      country
      tags
      coverImageUrl
      createdAt
      area { id name }
    }
  }
`

const UPDATE_ACTIVITY = gql`
  mutation UpdateActivity($id: ID!, $input: UpdateContentPageInput!) {
    updateContentPage(id: $id, input: $input) {
      id
      name
      country
      tags
      coverImageUrl
      locationName
      pageContent
      updatedAt
      area { id name }
    }
  }
`

const DELETE_ACTIVITY = gql`
  mutation DeleteActivity($id: ID!) {
    deleteContentPage(id: $id)
  }
`

// ── Store ──────────────────────────────────────────────────────

interface ActivityState {
  activities: ActivityListItem[]
  activity: ActivityFull | null
  loading: boolean
  activityLoading: boolean
  saving: boolean
  error: string | null

  fetchActivities: () => Promise<void>
  fetchActivity: (id: string) => Promise<void>
  createActivity: (name: string) => Promise<ActivityListItem | null>
  updateActivity: (id: string, input: UpdateActivityInput) => Promise<void>
  deleteActivity: (id: string) => Promise<void>
}

export const useActivityStore = create<ActivityState>((set) => ({
  activities: [],
  activity: null,
  loading: false,
  activityLoading: false,
  saving: false,
  error: null,

  fetchActivities: async () => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ loading: true, error: null })
    try {
      const data = await client.request<{ contentPages: ActivityListItem[] }>(LIST_ACTIVITIES)
      set({ activities: data.contentPages, loading: false })
    } catch (e) {
      set({ loading: false, error: gqlErrorMessage(e, 'Failed to load activities') })
    }
  },

  fetchActivity: async (id: string) => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ activityLoading: true, error: null })
    try {
      const data = await client.request<{ contentPage: ActivityFull }>(GET_ACTIVITY, { id })
      set({ activity: data.contentPage, activityLoading: false })
    } catch (e) {
      set({ activityLoading: false, error: gqlErrorMessage(e, 'Failed to load activity') })
    }
  },

  createActivity: async (name: string) => {
    const client = useClientStore.getState().client
    if (!client) return null
    set({ saving: true })
    try {
      const data = await client.request<{ createContentPage: ActivityListItem }>(CREATE_ACTIVITY, {
        input: { type: 'ACTIVITY', name },
      })
      const created = data.createContentPage
      set((s) => ({ activities: [created, ...s.activities], saving: false }))
      return created
    } catch (e) {
      set({ saving: false, error: gqlErrorMessage(e, 'Failed to create activity') })
      return null
    }
  },

  updateActivity: async (id: string, input: UpdateActivityInput) => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ saving: true })
    try {
      const data = await client.request<{ updateContentPage: ActivityFull }>(UPDATE_ACTIVITY, { id, input })
      const updated = data.updateContentPage
      set((s) => ({
        saving: false,
        activity: s.activity?.id === id ? { ...s.activity, ...updated } : s.activity,
        activities: s.activities.map((a) => (a.id === id ? { ...a, ...updated } : a)),
      }))
    } catch (e) {
      set({ saving: false, error: gqlErrorMessage(e, 'Failed to update activity') })
    }
  },

  deleteActivity: async (id: string) => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ saving: true })
    try {
      await client.request(DELETE_ACTIVITY, { id })
      set((s) => ({
        saving: false,
        activities: s.activities.filter((a) => a.id !== id),
        activity: s.activity?.id === id ? null : s.activity,
      }))
    } catch (e) {
      set({ saving: false, error: gqlErrorMessage(e, 'Failed to delete activity') })
    }
  },
}))
