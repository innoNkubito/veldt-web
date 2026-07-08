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
  // Tiptap ProseMirror JSON for the "Transfers, Flights & Activities" column
  activitiesRichText: Record<string, unknown> | null
  // Tiptap ProseMirror JSON for the "Accommodations & Rooming" column
  accommodationsRichText: Record<string, unknown> | null
  areaPage: { id: string; name: string } | null
  accommodations: RowAccommodation[]
  activities: RowActivity[]
}

export interface RowActivity {
  id: string
  position: number
  contentPage: {
    id: string
    name: string
    type?: string
    coverImageUrl?: string | null
    pageContent?: unknown
    rooms?: InfoPageRoom[]
  }
}

export interface RowAccommodation {
  id: string
  position: number
  contentPage: {
    id: string
    name: string
    type?: string
    coverImageUrl?: string | null
    pageContent?: unknown
    rooms?: InfoPageRoom[]
  }
  room: { id: string; roomType: string } | null
  areaPage: { id: string; name: string } | null
}

export interface InfoPageRoom {
  id: string
  roomType: string
  description: string | null
  photos: string[]
}

export interface ItineraryInfoPageSlot {
  id: string
  slot: string
  position: number
  contentPage: {
    id: string
    name: string
    type: string
    coverImageUrl: string | null
    pageContent: unknown
    rooms?: InfoPageRoom[]
  }
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
        activitiesRichText accommodationsRichText
        areaPage { id name }
        accommodations {
          id position
          contentPage { id name type coverImageUrl pageContent rooms { id roomType description photos } }
          room { id roomType }
          areaPage { id name }
        }
        activities {
          id position
          contentPage { id name type coverImageUrl pageContent rooms { id roomType description photos } }
        }
      }
      infoPageSlots {
        id slot position
        contentPage {
          id name type
          coverImageUrl
          pageContent
          rooms { id roomType description photos }
        }
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

const ROW_FIELDS = `
  id position dateLabel startDate endDate numNights transfersText
  activitiesRichText accommodationsRichText
  areaPage { id name }
  accommodations {
    id position
    contentPage { id name }
    room { id roomType }
    areaPage { id name }
  }
  activities {
    id position
    contentPage { id name }
  }
`

const ADD_ROW = gql`
  mutation AddRow($itineraryId: ID!, $input: RowInput!) {
    addRow(itineraryId: $itineraryId, input: $input) { ${ROW_FIELDS} }
  }
`

const UPDATE_ROW = gql`
  mutation UpdateRow($id: ID!, $input: RowInput!) {
    updateRow(id: $id, input: $input) { ${ROW_FIELDS} }
  }
`

const SET_ROW_AREA_PAGE = gql`
  mutation SetRowAreaPage($rowId: ID!, $areaPageId: ID) {
    setRowAreaPage(rowId: $rowId, areaPageId: $areaPageId) { ${ROW_FIELDS} }
  }
`

const ADD_ROW_ACTIVITY = gql`
  mutation AddRowActivity($rowId: ID!, $contentPageId: ID!) {
    addRowActivity(rowId: $rowId, contentPageId: $contentPageId) {
      id position
      contentPage { id name type coverImageUrl pageContent }
    }
  }
`

const REMOVE_ROW_ACTIVITY = gql`
  mutation RemoveRowActivity($id: ID!) {
    removeRowActivity(id: $id)
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

const GET_CONTENT_PAGES = gql`
  query GetContentPages($type: ContentPageType) {
    contentPages(type: $type) {
      id
      name
      rooms { id roomType }
    }
  }
`

const ADD_ACCOMMODATION = gql`
  mutation AddAccommodation($rowId: ID!, $input: AccommodationInput!) {
    addAccommodation(rowId: $rowId, input: $input) {
      id position
      contentPage { id name type coverImageUrl pageContent }
      room { id roomType }
      areaPage { id name }
    }
  }
`

const REMOVE_ACCOMMODATION = gql`
  mutation RemoveAccommodation($id: ID!) {
    removeAccommodation(id: $id)
  }
`

const ADD_INFO_PAGE_SLOT = gql`
  mutation AddInfoPageSlot($itineraryId: ID!, $input: InfoPageSlotInput!) {
    addInfoPageSlot(itineraryId: $itineraryId, input: $input) {
      id slot position
      contentPage {
        id name type
        coverImageUrl
        pageContent
      }
    }
  }
`

const REMOVE_INFO_PAGE_SLOT = gql`
  mutation RemoveInfoPageSlot($id: ID!) {
    removeInfoPageSlot(id: $id)
  }
`

const REORDER_INFO_PAGE_SLOTS = gql`
  mutation ReorderInfoPageSlots($itineraryId: ID!, $slot: InfoPageSlot!, $ids: [ID!]!) {
    reorderInfoPageSlots(itineraryId: $itineraryId, slot: $slot, ids: $ids) {
      id slot position
      contentPage { id name type }
    }
  }
`

// ── Content page search types ──────────────────────────────────

export interface PropertyOption {
  id: string
  name: string
  rooms: { id: string; roomType: string }[]
}

export interface ContentPageOption {
  id: string
  name: string
}

// ── Store ──────────────────────────────────────────────────────

interface BuilderState {
  itinerary: ItineraryFull | null
  loading: boolean
  saving: boolean
  error: string | null
  properties: PropertyOption[]
  propertiesLoading: boolean
  areaPages: ContentPageOption[]
  activityPages: ContentPageOption[]
  contentPagesLoading: boolean

  fetchItinerary: (id: string) => Promise<void>
  refreshItinerary: (id: string) => Promise<void>
  fetchProperties: () => Promise<void>
  fetchAreaAndActivityPages: () => Promise<void>
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
    activitiesRichText?: Record<string, unknown>
    accommodationsRichText?: Record<string, unknown>
  }) => Promise<ItineraryRow | null>
  updateRow: (id: string, input: {
    dateLabel?: string
    startDate?: string
    endDate?: string
    numNights?: number
    transfersText?: string
    activitiesRichText?: Record<string, unknown>
    accommodationsRichText?: Record<string, unknown>
  }) => Promise<void>
  deleteRow: (id: string) => Promise<void>
  reorderRows: (itineraryId: string, rowIds: string[]) => Promise<void>

  upsertCosts: (itineraryId: string, input: Partial<ItineraryCosts>) => Promise<void>

  addAccommodation: (rowId: string, input: {
    contentPageId: string
    roomId?: string
    areaPageId?: string
    position?: number
  }) => Promise<void>
  removeAccommodation: (accommodationId: string, rowId: string) => Promise<void>

  setRowAreaPage: (rowId: string, areaPageId: string | null) => Promise<void>
  addRowActivity: (rowId: string, contentPageId: string) => Promise<void>
  removeRowActivity: (activityId: string, rowId: string) => Promise<void>

  addInfoPageSlot: (itineraryId: string, contentPageId: string, slot: string, position?: number) => Promise<void>
  removeInfoPageSlot: (slotId: string) => Promise<void>
  reorderInfoPageSlots: (itineraryId: string, slot: string, ids: string[]) => Promise<void>
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  itinerary: null,
  loading: false,
  saving: false,
  error: null,
  properties: [],
  propertiesLoading: false,
  areaPages: [],
  activityPages: [],
  contentPagesLoading: false,

  fetchProperties: async () => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ propertiesLoading: true })
    try {
      const data = await client.request<{ contentPages: PropertyOption[] }>(
        GET_CONTENT_PAGES, { type: 'PROPERTY' }
      )
      set({ properties: data.contentPages, propertiesLoading: false })
    } catch {
      set({ propertiesLoading: false })
    }
  },

  fetchAreaAndActivityPages: async () => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ contentPagesLoading: true })
    try {
      const [areaData, activityData] = await Promise.all([
        client.request<{ contentPages: ContentPageOption[] }>(GET_CONTENT_PAGES, { type: 'AREA' }),
        client.request<{ contentPages: ContentPageOption[] }>(GET_CONTENT_PAGES, { type: 'ACTIVITY' }),
      ])
      set({
        areaPages: areaData.contentPages,
        activityPages: activityData.contentPages,
        contentPagesLoading: false,
      })
    } catch {
      set({ contentPagesLoading: false })
    }
  },

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

  // Silent refetch — no loading flag, so the UI doesn't flash. Used after row
  // tagging mutations to pull complete contentPage data (rooms, pageContent).
  refreshItinerary: async (id) => {
    const client = useClientStore.getState().client
    if (!client) return
    try {
      const data = await client.request<{ itinerary: ItineraryFull }>(GET_ITINERARY, { id })
      set({ itinerary: data.itinerary })
    } catch {
      // keep current state; a later fetch will recover
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
              // ROW_FIELDS only returns contentPage { id name } for activities /
              // accommodations — keep the store's richer arrays (type, pageContent,
              // rooms) since this mutation doesn't modify them.
              rows: s.itinerary.rows.map((r) =>
                r.id === id
                  ? { ...data.updateRow, activities: r.activities, accommodations: r.accommodations }
                  : r
              ),
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

  addAccommodation: async (rowId, input) => {
    const client = useClientStore.getState().client
    if (!client) return
    try {
      const data = await client.request<{ addAccommodation: RowAccommodation }>(
        ADD_ACCOMMODATION, { rowId, input }
      )
      set((s) => {
        if (!s.itinerary) return {}
        return {
          itinerary: {
            ...s.itinerary,
            rows: s.itinerary.rows.map((r) =>
              r.id === rowId
                ? { ...r, accommodations: [...r.accommodations, data.addAccommodation] }
                : r
            ),
          },
        }
      })
      // Mutation response can't include rooms (server returns null for
      // non-property types) — silently refetch to fill in complete data.
      const itinId = get().itinerary?.id
      if (itinId) void get().refreshItinerary(itinId)
    } catch (err: any) {
      set({ error: err?.response?.errors?.[0]?.message ?? 'Failed to add accommodation' })
    }
  },

  removeAccommodation: async (accommodationId, rowId) => {
    const client = useClientStore.getState().client
    if (!client) return
    try {
      await client.request(REMOVE_ACCOMMODATION, { id: accommodationId })
      set((s) => {
        if (!s.itinerary) return {}
        return {
          itinerary: {
            ...s.itinerary,
            rows: s.itinerary.rows.map((r) =>
              r.id === rowId
                ? { ...r, accommodations: r.accommodations.filter((a) => a.id !== accommodationId) }
                : r
            ),
          },
        }
      })
    } catch (err: any) {
      set({ error: err?.response?.errors?.[0]?.message ?? 'Failed to remove accommodation' })
    }
  },

  setRowAreaPage: async (rowId, areaPageId) => {
    const client = useClientStore.getState().client
    if (!client) return
    try {
      const data = await client.request<{ setRowAreaPage: ItineraryRow }>(
        SET_ROW_AREA_PAGE, { rowId, areaPageId }
      )
      set((s) => ({
        itinerary: s.itinerary
          ? {
              ...s.itinerary,
              // Preserve rich activities/accommodations (see updateRow note)
              rows: s.itinerary.rows.map((r) =>
                r.id === rowId
                  ? { ...data.setRowAreaPage, activities: r.activities, accommodations: r.accommodations }
                  : r
              ),
            }
          : null,
      }))
    } catch (err: any) {
      set({ error: err?.response?.errors?.[0]?.message ?? 'Failed to set area page' })
    }
  },

  addRowActivity: async (rowId, contentPageId) => {
    const client = useClientStore.getState().client
    if (!client) return
    try {
      const data = await client.request<{ addRowActivity: RowActivity }>(
        ADD_ROW_ACTIVITY, { rowId, contentPageId }
      )
      set((s) => ({
        itinerary: s.itinerary
          ? {
              ...s.itinerary,
              rows: s.itinerary.rows.map((r) =>
                r.id === rowId ? { ...r, activities: [...r.activities, data.addRowActivity] } : r
              ),
            }
          : null,
      }))
      // Silently refetch for complete contentPage data (rooms, etc.)
      const itinId = get().itinerary?.id
      if (itinId) void get().refreshItinerary(itinId)
    } catch (err: any) {
      set({ error: err?.response?.errors?.[0]?.message ?? 'Failed to add activity' })
    }
  },

  removeRowActivity: async (activityId, rowId) => {
    const client = useClientStore.getState().client
    if (!client) return
    try {
      await client.request(REMOVE_ROW_ACTIVITY, { id: activityId })
      set((s) => ({
        itinerary: s.itinerary
          ? {
              ...s.itinerary,
              rows: s.itinerary.rows.map((r) =>
                r.id === rowId ? { ...r, activities: r.activities.filter((a) => a.id !== activityId) } : r
              ),
            }
          : null,
      }))
    } catch (err: any) {
      set({ error: err?.response?.errors?.[0]?.message ?? 'Failed to remove activity' })
    }
  },

  addInfoPageSlot: async (itineraryId, contentPageId, slot, position) => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ saving: true })
    try {
      const data = await client.request<{ addInfoPageSlot: ItineraryInfoPageSlot }>(
        ADD_INFO_PAGE_SLOT,
        { itineraryId, input: { contentPageId, slot, position } },
      )
      set((s) => {
        if (!s.itinerary) return { saving: false }
        return {
          saving: false,
          itinerary: {
            ...s.itinerary,
            infoPageSlots: [...s.itinerary.infoPageSlots, data.addInfoPageSlot],
          },
        }
      })
    } catch (err: any) {
      set({ saving: false, error: err?.response?.errors?.[0]?.message ?? 'Failed to add info page' })
    }
  },

  removeInfoPageSlot: async (slotId) => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ saving: true })
    try {
      await client.request(REMOVE_INFO_PAGE_SLOT, { id: slotId })
      set((s) => {
        if (!s.itinerary) return { saving: false }
        return {
          saving: false,
          itinerary: {
            ...s.itinerary,
            infoPageSlots: s.itinerary.infoPageSlots.filter((p) => p.id !== slotId),
          },
        }
      })
    } catch (err: any) {
      set({ saving: false, error: err?.response?.errors?.[0]?.message ?? 'Failed to remove info page' })
    }
  },

  reorderInfoPageSlots: async (itineraryId, slot, ids) => {
    const client = useClientStore.getState().client
    if (!client) return
    try {
      const data = await client.request<{ reorderInfoPageSlots: ItineraryInfoPageSlot[] }>(
        REORDER_INFO_PAGE_SLOTS, { itineraryId, slot, ids }
      )
      set((s) => {
        if (!s.itinerary) return {}
        const others = s.itinerary.infoPageSlots.filter((p) => p.slot !== slot)
        return {
          itinerary: {
            ...s.itinerary,
            infoPageSlots: [...others, ...data.reorderInfoPageSlots],
          },
        }
      })
    } catch (err: any) {
      set({ error: err?.response?.errors?.[0]?.message ?? 'Failed to reorder' })
    }
  },
}))
