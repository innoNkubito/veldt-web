import { create } from 'zustand'
import { gql, type GraphQLClient } from 'graphql-request'
import { useClientStore } from './clientStore'
import { gqlErrorMessage } from '@/lib/gql-error'

/**
 * Itinerary templates — reusable trips.
 *
 * A template is an itinerary of kind TEMPLATE, edited in the ordinary builder;
 * this store covers only what happens around it: the list, saving a trip as a
 * template, starting a trip from one, and the template's name, tags and
 * archive flag. Mutations return an error message, or null on success.
 */

export interface TemplateListItem {
  id: string
  templateName: string | null
  templateDescription: string | null
  templateTags: string[]
  templateArchivedAt: string | null
  templateUsageCount: number
  durationNights: number
  canManageTemplate: boolean
  proposalTitle: string
  updatedAt: string
}

export interface TemplateDetailsInput {
  name: string
  description: string | null
  tags: string[]
}

export interface CreateFromTemplateInput {
  proposalTitle: string | null
  preparedFor: string | null
  /** YYYY-MM-DD; null leaves the days undated */
  startDate: string | null
}

export interface TemplateFilters {
  search: string
  tag: string | null
  includeArchived: boolean
}

const TEMPLATE_FIELDS = `
  id
  templateName
  templateDescription
  templateTags
  templateArchivedAt
  templateUsageCount
  durationNights
  canManageTemplate
  proposalTitle
  updatedAt
`

const ITINERARY_TEMPLATES = gql`
  query ItineraryTemplates($search: String, $tag: String, $includeArchived: Boolean) {
    itineraryTemplates(search: $search, tag: $tag, includeArchived: $includeArchived) {
      ${TEMPLATE_FIELDS}
    }
  }
`

const SAVE_AS_TEMPLATE = gql`
  mutation SaveAsTemplate($itineraryId: ID!, $input: TemplateDetailsInput!) {
    saveAsTemplate(itineraryId: $itineraryId, input: $input) { id }
  }
`

const CREATE_FROM_TEMPLATE = gql`
  mutation CreateItineraryFromTemplate($templateId: ID!, $input: CreateFromTemplateInput!) {
    createItineraryFromTemplate(templateId: $templateId, input: $input) { id }
  }
`

const UPDATE_TEMPLATE_DETAILS = gql`
  mutation UpdateTemplateDetails($id: ID!, $input: TemplateDetailsInput!) {
    updateTemplateDetails(id: $id, input: $input) { ${TEMPLATE_FIELDS} }
  }
`

const SET_TEMPLATE_ARCHIVED = gql`
  mutation SetTemplateArchived($id: ID!, $archived: Boolean!) {
    setTemplateArchived(id: $id, archived: $archived) { id }
  }
`

// Duplicating and deleting a template use the ordinary itinerary mutations.
const DUPLICATE_ITINERARY = gql`
  mutation DuplicateTemplate($id: ID!) {
    duplicateItinerary(id: $id) { id }
  }
`

const DELETE_ITINERARY = gql`
  mutation DeleteTemplate($id: ID!) {
    deleteItinerary(id: $id)
  }
`

type Result<T> = { ok: true; value: T } | { ok: false; error: string }

interface TemplateState {
  templates: TemplateListItem[]
  /** Every tag in use, from the last load without a tag or search filter. */
  allTags: string[]
  filters: TemplateFilters
  loading: boolean
  saving: boolean
  error: string | null

  setFilters: (filters: Partial<TemplateFilters>) => void
  fetchTemplates: () => Promise<void>
  /** Picker data: every live template, ignoring the page's filters. */
  fetchPickerTemplates: () => Promise<TemplateListItem[]>
  saveAsTemplate: (itineraryId: string, input: TemplateDetailsInput) => Promise<Result<string>>
  createFromTemplate: (templateId: string, input: CreateFromTemplateInput) => Promise<Result<string>>
  updateDetails: (id: string, input: TemplateDetailsInput) => Promise<string | null>
  setArchived: (id: string, archived: boolean) => Promise<string | null>
  duplicate: (id: string) => Promise<string | null>
  remove: (id: string) => Promise<string | null>
}

export const useTemplateStore = create<TemplateState>((set, get) => {
  /** Runs a list-changing mutation, then reloads the list. */
  async function mutate(
    run: (client: GraphQLClient) => Promise<unknown>,
    fallback: string,
  ): Promise<string | null> {
    const client = useClientStore.getState().client
    if (!client) return 'Not connected.'
    set({ saving: true })
    try {
      await run(client)
      set({ saving: false })
      await get().fetchTemplates()
      return null
    } catch (err) {
      set({ saving: false })
      return gqlErrorMessage(err, fallback)
    }
  }

  return {
    templates: [],
    allTags: [],
    filters: { search: '', tag: null, includeArchived: false },
    loading: false,
    saving: false,
    error: null,

    setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),

    fetchTemplates: async () => {
      const client = useClientStore.getState().client
      if (!client) return
      const { search, tag, includeArchived } = get().filters
      set({ loading: true, error: null })
      try {
        const data = await client.request<{ itineraryTemplates: TemplateListItem[] }>(
          ITINERARY_TEMPLATES,
          { search: search.trim() || null, tag, includeArchived },
        )
        const templates = data.itineraryTemplates
        // Remembered so choosing a tag does not make the other chips disappear.
        const unfiltered = !search.trim() && !tag
        set({
          templates,
          loading: false,
          ...(unfiltered && {
            allTags: [...new Set(templates.flatMap((t) => t.templateTags))].sort(),
          }),
        })
      } catch (err) {
        set({ loading: false, error: gqlErrorMessage(err, 'Could not load templates.') })
      }
    },

    fetchPickerTemplates: async () => {
      const client = useClientStore.getState().client
      if (!client) return []
      try {
        const data = await client.request<{ itineraryTemplates: TemplateListItem[] }>(
          ITINERARY_TEMPLATES,
          { includeArchived: false },
        )
        return data.itineraryTemplates
      } catch {
        return []
      }
    },

    saveAsTemplate: async (itineraryId, input) => {
      const client = useClientStore.getState().client
      if (!client) return { ok: false, error: 'Not connected.' }
      set({ saving: true })
      try {
        const data = await client.request<{ saveAsTemplate: { id: string } }>(SAVE_AS_TEMPLATE, {
          itineraryId,
          input,
        })
        set({ saving: false })
        return { ok: true, value: data.saveAsTemplate.id }
      } catch (err) {
        set({ saving: false })
        return { ok: false, error: gqlErrorMessage(err, 'Could not save the template.') }
      }
    },

    createFromTemplate: async (templateId, input) => {
      const client = useClientStore.getState().client
      if (!client) return { ok: false, error: 'Not connected.' }
      set({ saving: true })
      try {
        const data = await client.request<{ createItineraryFromTemplate: { id: string } }>(
          CREATE_FROM_TEMPLATE,
          { templateId, input },
        )
        set({ saving: false })
        return { ok: true, value: data.createItineraryFromTemplate.id }
      } catch (err) {
        set({ saving: false })
        return { ok: false, error: gqlErrorMessage(err, 'Could not create the itinerary.') }
      }
    },

    updateDetails: (id, input) =>
      mutate(
        (client) => client.request(UPDATE_TEMPLATE_DETAILS, { id, input }),
        'Could not save the template details.',
      ),

    setArchived: (id, archived) =>
      mutate(
        (client) => client.request(SET_TEMPLATE_ARCHIVED, { id, archived }),
        archived ? 'Could not archive the template.' : 'Could not restore the template.',
      ),

    duplicate: (id) =>
      mutate(
        (client) => client.request(DUPLICATE_ITINERARY, { id }),
        'Could not duplicate the template.',
      ),

    remove: (id) =>
      mutate(
        (client) => client.request(DELETE_ITINERARY, { id }),
        'Could not delete the template.',
      ),
  }
})
