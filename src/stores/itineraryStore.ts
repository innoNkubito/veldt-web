import { create } from 'zustand'
import { gql } from 'graphql-request'
import { useClientStore } from './clientStore'
import { gqlErrorMessage } from '@/lib/gql-error'

export interface ItineraryListItem {
  id: string
  proposalTitle: string
  preparedFor: string | null
  travelDates: string | null
  status: string
  builderMode: string | null
  slug: string
  createdAt: string
  updatedAt: string
  assignedTo: {
    id: string
    firstName: string | null
    lastName: string | null
  } | null
  viewCount: number
}

interface ItineraryState {
  itineraries: ItineraryListItem[]
  loading: boolean
  error: string | null

  fetchItineraries: (status?: string) => Promise<void>
  createItinerary: (input: {
    proposalTitle: string
    preparedFor?: string
    travelDates?: string
  }) => Promise<ItineraryListItem | null>
  deleteItinerary: (id: string) => Promise<boolean>
  duplicateItinerary: (id: string) => Promise<ItineraryListItem | null>
}

const GET_ITINERARIES = gql`
  query GetItineraries($status: ItineraryStatus) {
    itineraries(status: $status) {
      id
      proposalTitle
      preparedFor
      travelDates
      status
      builderMode
      slug
      createdAt
      updatedAt
      viewCount
      assignedTo {
        id
        firstName
        lastName
      }
    }
  }
`

const CREATE_ITINERARY = gql`
  mutation CreateItinerary($input: CreateItineraryInput!) {
    createItinerary(input: $input) {
      id
      proposalTitle
      status
      slug
      builderMode
    }
  }
`

const DELETE_ITINERARY = gql`
  mutation DeleteItinerary($id: ID!) {
    deleteItinerary(id: $id)
  }
`

const DUPLICATE_ITINERARY = gql`
  mutation DuplicateItinerary($id: ID!) {
    duplicateItinerary(id: $id) {
      id
      proposalTitle
      status
      slug
    }
  }
`

export const useItineraryStore = create<ItineraryState>((set, get) => ({
  itineraries: [],
  loading: false,
  error: null,

  fetchItineraries: async (status) => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ loading: true, error: null })
    try {
      const data = await client.request<{ itineraries: ItineraryListItem[] }>(
        GET_ITINERARIES,
        { status: status ?? null },
      )
      set({ itineraries: data.itineraries, loading: false })
    } catch (err) {
      set({
        error: gqlErrorMessage(err, 'Failed to fetch'),
        loading: false,
      })
    }
  },

  createItinerary: async (input) => {
    const client = useClientStore.getState().client
    if (!client) return null
    try {
      const data = await client.request<{ createItinerary: ItineraryListItem }>(
        CREATE_ITINERARY,
        { input },
      )
      set((state) => ({
        itineraries: [data.createItinerary, ...state.itineraries],
      }))
      return data.createItinerary
    } catch (err) {
      set({ error: gqlErrorMessage(err, 'Failed to create') })
      return null
    }
  },

  deleteItinerary: async (id) => {
    const client = useClientStore.getState().client
    if (!client) return false
    try {
      await client.request(DELETE_ITINERARY, { id })
      set((state) => ({
        itineraries: state.itineraries.filter((i) => i.id !== id),
      }))
      return true
    } catch {
      return false
    }
  },

  duplicateItinerary: async (id) => {
    const client = useClientStore.getState().client
    if (!client) return null
    try {
      const data = await client.request<{
        duplicateItinerary: ItineraryListItem
      }>(DUPLICATE_ITINERARY, { id })
      set((state) => ({
        itineraries: [data.duplicateItinerary, ...state.itineraries],
      }))
      return data.duplicateItinerary
    } catch {
      return null
    }
  },
}))
