import { create } from 'zustand'
import { gql, type GraphQLClient } from 'graphql-request'
import { useClientStore } from './clientStore'
import { gqlErrorMessage } from '@/lib/gql-error'
import type { GuestForm, GuestFormInput, GuestFormStarter } from '@/lib/guestForms'

/**
 * Guest forms — the operator's library of reusable forms.
 *
 * Attaching forms to trips lives with the itinerary (phase 3). Mutations
 * return a Result (or an error message, null on success) rather than
 * throwing, so pages can show the API's own validation message.
 */

const FIELD_FIELDS = `id type label helpText required options`

const FORM_FIELDS = `
  id
  name
  description
  perGuest
  fields { ${FIELD_FIELDS} }
  questionCount
  archivedAt
  usageCount
  updatedAt
`

const GUEST_FORMS = gql`
  query GuestForms($includeArchived: Boolean) {
    guestForms(includeArchived: $includeArchived) { ${FORM_FIELDS} }
  }
`

const GUEST_FORM = gql`
  query GuestForm($id: ID!) {
    guestForm(id: $id) { ${FORM_FIELDS} }
  }
`

const GUEST_FORM_STARTERS = gql`
  query GuestFormStarters {
    guestFormStarters { key name description perGuest fields { ${FIELD_FIELDS} } }
  }
`

const CREATE_GUEST_FORM = gql`
  mutation CreateGuestForm($input: GuestFormInput!) {
    createGuestForm(input: $input) { ${FORM_FIELDS} }
  }
`

const UPDATE_GUEST_FORM = gql`
  mutation UpdateGuestForm($id: ID!, $input: GuestFormInput!) {
    updateGuestForm(id: $id, input: $input) { ${FORM_FIELDS} }
  }
`

const SET_GUEST_FORM_ARCHIVED = gql`
  mutation SetGuestFormArchived($id: ID!, $archived: Boolean!) {
    setGuestFormArchived(id: $id, archived: $archived) { id }
  }
`

const DELETE_GUEST_FORM = gql`
  mutation DeleteGuestForm($id: ID!) {
    deleteGuestForm(id: $id)
  }
`

export type Result<T> = { ok: true; value: T } | { ok: false; error: string }

interface GuestFormState {
  forms: GuestForm[]
  includeArchived: boolean
  loading: boolean
  saving: boolean
  error: string | null

  setIncludeArchived: (includeArchived: boolean) => void
  fetchForms: () => Promise<void>
  fetchForm: (id: string) => Promise<Result<GuestForm>>
  fetchStarters: () => Promise<GuestFormStarter[]>
  createForm: (input: GuestFormInput) => Promise<Result<GuestForm>>
  updateForm: (id: string, input: GuestFormInput) => Promise<Result<GuestForm>>
  setArchived: (id: string, archived: boolean) => Promise<string | null>
  deleteForm: (id: string) => Promise<string | null>
}

export const useGuestFormStore = create<GuestFormState>((set, get) => {
  /** Runs a mutation with the saving flag set; returns its value or the error. */
  async function save<T>(
    run: (client: GraphQLClient) => Promise<T>,
    fallback: string,
  ): Promise<Result<T>> {
    const client = useClientStore.getState().client
    if (!client) return { ok: false, error: 'Not connected.' }
    set({ saving: true })
    try {
      const value = await run(client)
      set({ saving: false })
      return { ok: true, value }
    } catch (err) {
      set({ saving: false })
      return { ok: false, error: gqlErrorMessage(err, fallback) }
    }
  }

  /** A list-changing mutation: on success, reloads the list. */
  async function mutateList(run: (client: GraphQLClient) => Promise<unknown>, fallback: string) {
    const result = await save(run, fallback)
    if (!result.ok) return result.error
    await get().fetchForms()
    return null
  }

  return {
    forms: [],
    includeArchived: false,
    loading: false,
    saving: false,
    error: null,

    setIncludeArchived: (includeArchived) => set({ includeArchived }),

    fetchForms: async () => {
      const client = useClientStore.getState().client
      if (!client) return
      set({ loading: true, error: null })
      try {
        const data = await client.request<{ guestForms: GuestForm[] }>(GUEST_FORMS, {
          includeArchived: get().includeArchived,
        })
        set({ forms: data.guestForms, loading: false })
      } catch (err) {
        set({ loading: false, error: gqlErrorMessage(err, 'Could not load guest forms.') })
      }
    },

    fetchForm: async (id) => {
      const client = useClientStore.getState().client
      if (!client) return { ok: false, error: 'Not connected.' }
      try {
        const data = await client.request<{ guestForm: GuestForm | null }>(GUEST_FORM, { id })
        return data.guestForm
          ? { ok: true, value: data.guestForm }
          : { ok: false, error: 'That form does not exist.' }
      } catch (err) {
        return { ok: false, error: gqlErrorMessage(err, 'Could not load this form.') }
      }
    },

    fetchStarters: async () => {
      const client = useClientStore.getState().client
      if (!client) return []
      try {
        const data = await client.request<{ guestFormStarters: GuestFormStarter[] }>(GUEST_FORM_STARTERS)
        return data.guestFormStarters
      } catch (err) {
        gqlErrorMessage(err, 'Could not load starter forms.')
        return []
      }
    },

    createForm: (input) =>
      save(
        async (client) =>
          (await client.request<{ createGuestForm: GuestForm }>(CREATE_GUEST_FORM, { input })).createGuestForm,
        'Could not create this form.',
      ),

    updateForm: (id, input) =>
      save(
        async (client) =>
          (await client.request<{ updateGuestForm: GuestForm }>(UPDATE_GUEST_FORM, { id, input })).updateGuestForm,
        'Could not save this form.',
      ),

    setArchived: (id, archived) =>
      mutateList(
        (client) => client.request(SET_GUEST_FORM_ARCHIVED, { id, archived }),
        archived ? 'Could not archive this form.' : 'Could not restore this form.',
      ),

    deleteForm: (id) =>
      mutateList((client) => client.request(DELETE_GUEST_FORM, { id }), 'Could not delete this form.'),
  }
})
