import { create } from 'zustand'
import { gql } from 'graphql-request'
import { useClientStore } from './clientStore'

// ── Types ──────────────────────────────────────────────────────

export interface ItineraryFull {
  id: string
  proposalTitle: string
  preparedFor: string | null
  travelDates: string | null
  whiteLabel: boolean
  internalNotes: string | null
  status: string
  builderMode: string | null
  aiGenerated: boolean
  slug: string
  createdAt: string
  updatedAt: string
  assignedTo: { id: string; firstName: string | null; lastName: string | null } | null
  viewCount: number
  rows: ItineraryRow[]
  infoPageSlots: ItineraryInfoPageSlot[]
  costs: ItineraryCosts | null
}

export interface ItineraryRow {
  id: string
  position: number
  dateLabel: string | null
  startDate: string | null
  endDate: string | null
  numNights: number | null
  transfersText: string | null
  accommodations: RowAccommodation[]
}

export interface RowAccommodation {
  id: string
  position: number
  contentPage: { id: string; name: string }
  room: { id: string; roomType: string } | null
  areaPage: { id: string; name: string } | null
}

export interface ItineraryInfoPageSlot {
  id: string
  slot: string
  position: number
  contentPage: { id: string; name: string }
}

export interface ItineraryCosts {
  id: string
  pricePerPerson: number | null
  numGuests: number
  accommodationType: string | null
  currency: string
  costsToBeDetetermined: boolean
  accuracyConfirmed: boolean
  miscText: string | null
  miscVisible: boolean
  costNotes: string | null
  notesVisible: boolean
  costIncludes: string | null
  costExcludes: string | null
  priceVisible: boolean
  templateId: string | null
}

// ── GQL ────────────────────────────────────────────────────────

const GET_ITINERARY = gql`
  query GetItinerary($id: ID!) {
    itinerary(id: $id) {
      id
      proposalTitle
      preparedFor
      travelDates
      whiteLabel
      internalNotes
      status
      builderMode
      aiGenerated
      slug
      createdAt
      updatedAt
      viewCount
      assignedTo { id firstName lastName }
      rows {
        id position dateLabel startDate endDate numNights transfersText
        accommodations {
          id position
          contentPage { id name }
          room { id roomType }
          areaPage { id name }
        }
      }
      infoPageSlots {
        id slot position
        contentPage { id name }
      }
      costs {
        id pricePerPerson numGuests accommodationType currency
        costsToBeDetetermined accuracyConfirmed
        miscText miscVisible costNotes notesVisible
        costIncludes costExcludes priceVisible templateId
      }
    }
  }
`

const UPDATE_ITINERARY = gql`
  mutation UpdateItinerary($id: ID!, $input: UpdateItineraryInput!) {
    updateItinerary(id: $id, input: $input) {
      id proposalTitle preparedFor travelDates whiteLabel internalNotes status
    }
  }
`

const PUBLISH_ITINERARY = gql`
  mutation PublishItinerary($id: ID!) {
    publishItinerary(id: $id) {
      id status
    }
  }
`

const ADD_ROW = gql`
  mutation AddRow($itineraryId: ID!, $input: RowInput!) {
    addRow(itineraryId: $itineraryId, input: $input) {
      id position dateLabel startDate endDate numNights transfersText
      accommodations {
        id position
        contentPage { id name }
        room { id roomType }
        areaPage { id name }
      }
    }
  }
`

const UPDATE_ROW = gql`
  mutation UpdateRow($id: ID!, $input: RowInput!) {
    updateRow(id: $id, input: $input) {
      id position dateLabel startDate endDate numNights transfersText
      accommodations {
        id position
        contentPage { id name }
        room { id roomType }
        areaPage { id name }
      }
    }
  }
`

const DELETE_ROW = gql`
  mutation DeleteRow($id: ID!) {
    deleteRow(id: $id)
  }
`

const REORDER_ROWS = gql`
  mutation ReorderRows($itineraryId: ID!, $rowIds: [ID!]!) {
    reorderRows(itineraryId: $itineraryId, rowIds: $rowIds) {
      id position
    }
  }
`

const UPSERT_COSTS = gql`
  mutation UpsertCosts($itineraryId: ID!, $input: CostsInput!) {
    upsertCosts(itineraryId: $itineraryId, input: $input) {
      id pricePerPerson numGuests accommodationType currency
      costsToBeDetetermined accuracyConfirmed
      miscText miscVisible costNotes notesVisible
      costIncludes costExcludes priceVisible templateId
    }
  }
`

// ── Store ──────────────────────────────────────────────────────

interface BuilderState {
  itinerary: ItineraryFull | null
  loading: boolean
  saving: boolean
  error: string | null

  fetchItinerary: (id: string) => Promise<void>
  updateItinerary: (id: string, input: {
    proposalTitle?: string
    preparedFor?: string
    travelDates?: string
    whiteLabel?: boolean
    internalNotes?: string
    status?: string
    assignedToId?: string
    mobileAppChoice?: string
  }) => Promise<void>
  publishItinerary: (id: string) => Promise<string | null>

  addRow: (itineraryId: string, input: {
    dateLabel?: string
    startDate?: string
    endDate?: string
    numNights?: number
    transfersText?: string
  }) => Promise<ItineraryRow | null>
  updateRow: (id: string, input: {
    dateLabel?: string
    startDate?: string
    endDate?: string
    numNights?: number
    transfersText?: string
  }) => Promise<void>
  deleteRow: (id: string) => Promise<void>
  reorderRows: (itineraryId: string, rowIds: string[]) => Promise<void>

  upsertCosts: (itineraryId: string, input: Partial<ItineraryCosts>) => Promise<void>
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  itinerary: null,
  loading: false,
  saving: false,
  error: null,

  fetchItinerary: async (id) => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ loading: true, error: null })
    try {
      const data = await client.request<{ itinerary: ItineraryFull }>(GET_ITINERARY, { id })
      set({ itinerary: data.itinerary, loading: false })
    } catch (err: any) {
      set({ error: err?.response?.errors?.[0]?.message ?? 'Failed to load', loading: false })
    }
  },

  updateItinerary: async (id, input) => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ saving: true })
    try {
      const data = await client.request<{ updateItinerary: Partial<ItineraryFull> }>(
        UPDATE_ITINERARY, { id, input }
      )
      set((s) => ({
        itinerary: s.itinerary ? { ...s.itinerary, ...data.updateItinerary } : null,
        saving: false,
      }))
    } catch (err: any) {
      set({ error: err?.response?.errors?.[0]?.message ?? 'Failed to save', saving: false })
    }
  },

  publishItinerary: async (id) => {
    const client = useClientStore.getState().client
    if (!client) return null
    set({ saving: true })
    try {
      const data = await client.request<{ publishItinerary: { id: string; status: string } }>(
        PUBLISH_ITINERARY, { id }
      )
      set((s) => ({
        itinerary: s.itinerary ? { ...s.itinerary, status: data.publishItinerary.status } : null,
        saving: false,
      }))
      return null
    } catch (err: any) {
      const msg = err?.response?.errors?.[0]?.message ?? 'Failed to publish'
      set({ saving: false })
      return msg
    }
  },

  addRow: async (itineraryId, input) => {
    const client = useClientStore.getState().client
    if (!client) return null
    try {
      const data = await client.request<{ addRow: ItineraryRow }>(ADD_ROW, { itineraryId, input })
      set((s) => ({
        itinerary: s.itinerary
          ? { ...s.itinerary, rows: [...s.itinerary.rows, data.addRow] }
          : null,
      }))
      return data.addRow
    } catch (err: any) {
      set({ error: err?.response?.errors?.[0]?.message ?? 'Failed to add row' })
      return null
    }
  },

  updateRow: async (id, input) => {
    const client = useClientStore.getState().client
    if (!client) return
    try {
      const data = await client.request<{ updateRow: ItineraryRow }>(UPDATE_ROW, { id, input })
      set((s) => ({
        itinerary: s.itinerary
          ? {
              ...s.itinerary,
              rows: s.itinerary.rows.map((r) => (r.id === id ? data.updateRow : r)),
            }
          : null,
      }))
    } catch (err: any) {
      set({ error: err?.response?.errors?.[0]?.message ?? 'Failed to update row' })
    }
  },

  deleteRow: async (id) => {
    const client = useClientStore.getState().client
    if (!client) return
    try {
      await client.request(DELETE_ROW, { id })
      set((s) => ({
        itinerary: s.itinerary
          ? { ...s.itinerary, rows: s.itinerary.rows.filter((r) => r.id !== id) }
          : null,
      }))
    } catch (err: any) {
      set({ error: err?.response?.errors?.[0]?.message ?? 'Failed to delete row' })
    }
  },

  reorderRows: async (itineraryId, rowIds) => {
    const client = useClientStore.getState().client
    if (!client) return
    // Optimistic update
    set((s) => {
      if (!s.itinerary) return {}
      const rowMap = Object.fromEntries(s.itinerary.rows.map((r) => [r.id, r]))
      return {
        itinerary: {
          ...s.itinerary,
          rows: rowIds.map((id, i) => ({ ...rowMap[id], position: i })),
        },
      }
    })
    try {
      await client.request(REORDER_ROWS, { itineraryId, rowIds })
    } catch (err: any) {
      // Refetch on failure
      get().fetchItinerary(itineraryId)
    }
  },

  upsertCosts: async (itineraryId, input) => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ saving: true })
    try {
      const data = await client.request<{ upsertCosts: ItineraryCosts }>(UPSERT_COSTS, {
        itineraryId,
        input,
      })
      set((s) => ({
        itinerary: s.itinerary ? { ...s.itinerary, costs: data.upsertCosts } : null,
        saving: false,
      }))
    } catch (err: any) {
      set({ error: err?.response?.errors?.[0]?.message ?? 'Failed to save costs', saving: false })
    }
  },
}))
