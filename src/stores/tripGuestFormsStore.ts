import { create } from 'zustand'
import { gql, type GraphQLClient } from 'graphql-request'
import { useClientStore } from './clientStore'
import { gqlErrorMessage } from '@/lib/gql-error'
import type { GuestForm, TripGuestForm } from '@/lib/guestForms'

/**
 * The guest forms attached to the itinerary open in the builder, plus the
 * library to pick from. Shared by the Overview tab's card and the Confirm
 * Trip modal, so both always show the same list.
 *
 * Mutations return an error message, or null on success.
 */

type LibraryForm = Pick<GuestForm, 'id' | 'name' | 'perGuest' | 'questionCount' | 'archivedAt'>

const FORM_SUMMARY = `id name perGuest questionCount archivedAt`
const ATTACHMENT = `id position guestForm { ${FORM_SUMMARY} }`

const TRIP_GUEST_FORMS = gql`
  query TripGuestForms($id: ID!) {
    itinerary(id: $id) { id guestForms { ${ATTACHMENT} } }
    guestForms { ${FORM_SUMMARY} }
  }
`

const ATTACH = gql`
  mutation AttachGuestForm($itineraryId: ID!, $guestFormId: ID!) {
    attachGuestForm(itineraryId: $itineraryId, guestFormId: $guestFormId) { ${ATTACHMENT} }
  }
`

const DETACH = gql`
  mutation DetachGuestForm($itineraryId: ID!, $guestFormId: ID!) {
    detachGuestForm(itineraryId: $itineraryId, guestFormId: $guestFormId) { ${ATTACHMENT} }
  }
`

const REORDER = gql`
  mutation ReorderItineraryGuestForms($itineraryId: ID!, $guestFormIds: [ID!]!) {
    reorderItineraryGuestForms(itineraryId: $itineraryId, guestFormIds: $guestFormIds) { ${ATTACHMENT} }
  }
`

interface TripGuestFormsState {
  itineraryId: string | null
  attached: TripGuestForm[]
  /** Live (not archived) library forms. */
  library: LibraryForm[]
  loading: boolean
  saving: boolean
  error: string | null

  load: (itineraryId: string) => Promise<void>
  attach: (guestFormId: string) => Promise<string | null>
  detach: (guestFormId: string) => Promise<string | null>
  move: (guestFormId: string, direction: -1 | 1) => Promise<string | null>
  /**
   * Makes the attached set exactly `guestFormIds`: attaches what is missing
   * (appended, in the given order) and detaches the rest. Used by Confirm Trip.
   */
  syncSelection: (guestFormIds: string[]) => Promise<string | null>
}

export const useTripGuestFormsStore = create<TripGuestFormsState>((set, get) => {
  /** Runs one attachment mutation and adopts the list it returns. */
  async function change(
    run: (client: GraphQLClient, itineraryId: string) => Promise<TripGuestForm[]>,
    fallback: string,
  ): Promise<string | null> {
    const client = useClientStore.getState().client
    const { itineraryId } = get()
    if (!client || !itineraryId) return 'Not connected.'
    set({ saving: true })
    try {
      const attached = await run(client, itineraryId)
      set({ attached, saving: false })
      return null
    } catch (err) {
      set({ saving: false })
      return gqlErrorMessage(err, fallback)
    }
  }

  const attachOne = (guestFormId: string) =>
    change(
      async (client, itineraryId) =>
        (
          await client.request<{ attachGuestForm: TripGuestForm[] }>(ATTACH, { itineraryId, guestFormId })
        ).attachGuestForm,
      'Could not add this form.',
    )

  const detachOne = (guestFormId: string) =>
    change(
      async (client, itineraryId) =>
        (
          await client.request<{ detachGuestForm: TripGuestForm[] }>(DETACH, { itineraryId, guestFormId })
        ).detachGuestForm,
      'Could not remove this form.',
    )

  return {
    itineraryId: null,
    attached: [],
    library: [],
    loading: false,
    saving: false,
    error: null,

    load: async (itineraryId) => {
      const client = useClientStore.getState().client
      if (!client) return
      // A different trip: never show the previous one's forms while loading.
      if (get().itineraryId !== itineraryId) set({ itineraryId, attached: [], library: [] })
      set({ loading: true, error: null })
      try {
        const data = await client.request<{
          itinerary: { guestForms: TripGuestForm[] } | null
          guestForms: LibraryForm[]
        }>(TRIP_GUEST_FORMS, { id: itineraryId })
        if (get().itineraryId !== itineraryId) return
        set({ attached: data.itinerary?.guestForms ?? [], library: data.guestForms, loading: false })
      } catch (err) {
        set({ loading: false, error: gqlErrorMessage(err, 'Could not load guest forms.') })
      }
    },

    attach: attachOne,
    detach: detachOne,

    move: (guestFormId, direction) => {
      const ids = get().attached.map((a) => a.guestForm.id)
      const from = ids.indexOf(guestFormId)
      const to = from + direction
      if (from < 0 || to < 0 || to >= ids.length) return Promise.resolve(null)
      ;[ids[from], ids[to]] = [ids[to], ids[from]]
      return change(
        async (client, itineraryId) =>
          (
            await client.request<{ reorderItineraryGuestForms: TripGuestForm[] }>(REORDER, {
              itineraryId,
              guestFormIds: ids,
            })
          ).reorderItineraryGuestForms,
        'Could not reorder the forms.',
      )
    },

    syncSelection: async (guestFormIds) => {
      const wanted = new Set(guestFormIds)
      const current = get().attached.map((a) => a.guestForm.id)
      for (const id of current.filter((id) => !wanted.has(id))) {
        const err = await detachOne(id)
        if (err) return err
      }
      for (const id of guestFormIds.filter((id) => !current.includes(id))) {
        const err = await attachOne(id)
        if (err) return err
      }
      return null
    },
  }
})
