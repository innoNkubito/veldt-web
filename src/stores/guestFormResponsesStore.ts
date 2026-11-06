import { create } from 'zustand'
import { gql } from 'graphql-request'
import { useClientStore } from './clientStore'
import { gqlErrorMessage } from '@/lib/gql-error'
import type { GuestFormResponse, GuestFormResponseInput } from '@/lib/guestForms'

/**
 * Guest form responses: the open itinerary's (Trip tab) and the newest
 * unreviewed ones across every trip (dashboard). Owner-only data — the API
 * never returns these on the share link.
 */

const RESPONSE_FIELDS = `
  id
  guestForm { id name perGuest fields { id type label helpText required options } }
  itinerary { id proposalTitle }
  guestName
  guestEmail
  answers { fieldId label type values }
  submittedAt
  reviewedAt
  reviewedByName
  editedAt
  editedByName
`

const TRIP_RESPONSES = gql`
  query TripGuestFormResponses($id: ID!) {
    itinerary(id: $id) { id guestFormResponses { ${RESPONSE_FIELDS} } }
  }
`

const NEW_RESPONSES = gql`
  query NewGuestFormResponses($limit: Int) {
    newGuestFormResponses(limit: $limit) { ${RESPONSE_FIELDS} }
    unreviewedGuestFormTotal
  }
`

const SET_REVIEWED = gql`
  mutation SetGuestFormResponseReviewed($id: ID!, $reviewed: Boolean!) {
    setGuestFormResponseReviewed(id: $id, reviewed: $reviewed) { ${RESPONSE_FIELDS} }
  }
`

const UPDATE_RESPONSE = gql`
  mutation UpdateGuestFormResponse($id: ID!, $input: GuestFormResponseInput!) {
    updateGuestFormResponse(id: $id, input: $input) { ${RESPONSE_FIELDS} }
  }
`

interface GuestFormResponsesState {
  itineraryId: string | null
  responses: GuestFormResponse[]
  loading: boolean
  saving: boolean
  error: string | null

  /** Dashboard: newest unreviewed, and how many there are in total. */
  recent: GuestFormResponse[]
  unreviewedTotal: number

  load: (itineraryId: string) => Promise<void>
  fetchRecent: (limit?: number) => Promise<void>
  setReviewed: (id: string, reviewed: boolean) => Promise<string | null>
  update: (id: string, input: GuestFormResponseInput) => Promise<string | null>
}

/** Replaces one response in a list, keeping its place. */
const replace = (list: GuestFormResponse[], next: GuestFormResponse) =>
  list.map((r) => (r.id === next.id ? next : r))

export const useGuestFormResponsesStore = create<GuestFormResponsesState>((set, get) => {
  /** Saves one response and puts the returned version everywhere it is shown. */
  async function save(run: () => Promise<GuestFormResponse>, fallback: string): Promise<string | null> {
    set({ saving: true })
    try {
      const next = await run()
      const before = [...get().responses, ...get().recent].find((r) => r.id === next.id)
      const wasNew = before?.reviewedAt === null
      set((s) => ({
        saving: false,
        responses: replace(s.responses, next),
        recent: next.reviewedAt ? s.recent.filter((r) => r.id !== next.id) : replace(s.recent, next),
        unreviewedTotal: Math.max(
          0,
          s.unreviewedTotal + (wasNew && next.reviewedAt ? -1 : !wasNew && !next.reviewedAt ? 1 : 0),
        ),
      }))
      return null
    } catch (err) {
      set({ saving: false })
      return gqlErrorMessage(err, fallback)
    }
  }

  return {
    itineraryId: null,
    responses: [],
    loading: false,
    saving: false,
    error: null,
    recent: [],
    unreviewedTotal: 0,

    load: async (itineraryId) => {
      const client = useClientStore.getState().client
      if (!client) return
      if (get().itineraryId !== itineraryId) set({ itineraryId, responses: [] })
      set({ loading: true, error: null })
      try {
        const data = await client.request<{ itinerary: { guestFormResponses: GuestFormResponse[] } | null }>(
          TRIP_RESPONSES,
          { id: itineraryId },
        )
        if (get().itineraryId !== itineraryId) return
        set({ responses: data.itinerary?.guestFormResponses ?? [], loading: false })
      } catch (err) {
        set({ loading: false, error: gqlErrorMessage(err, 'Could not load guest form responses.') })
      }
    },

    fetchRecent: async (limit = 5) => {
      const client = useClientStore.getState().client
      if (!client) return
      try {
        const data = await client.request<{
          newGuestFormResponses: GuestFormResponse[]
          unreviewedGuestFormTotal: number
        }>(NEW_RESPONSES, { limit })
        set({ recent: data.newGuestFormResponses, unreviewedTotal: data.unreviewedGuestFormTotal })
      } catch (err) {
        gqlErrorMessage(err, 'Could not load new guest forms.')
      }
    },

    setReviewed: (id, reviewed) => {
      const client = useClientStore.getState().client
      if (!client) return Promise.resolve('Not connected.')
      return save(
        async () =>
          (await client.request<{ setGuestFormResponseReviewed: GuestFormResponse }>(SET_REVIEWED, { id, reviewed }))
            .setGuestFormResponseReviewed,
        'Could not update this response.',
      )
    },

    update: (id, input) => {
      const client = useClientStore.getState().client
      if (!client) return Promise.resolve('Not connected.')
      return save(
        async () =>
          (await client.request<{ updateGuestFormResponse: GuestFormResponse }>(UPDATE_RESPONSE, { id, input }))
            .updateGuestFormResponse,
        'Could not save these answers.',
      )
    },
  }
})

/** Unreviewed responses on the open itinerary — the Trip tab's count. */
export const selectUnreviewedCount = (s: GuestFormResponsesState) =>
  s.responses.filter((r) => r.reviewedAt === null).length
