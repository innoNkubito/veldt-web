import { create } from 'zustand'
import { gql } from 'graphql-request'
import { useClientStore } from './clientStore'
import { gqlErrorMessage } from '@/lib/gql-error'
import type { InvoiceSettings, InvoiceSettingsInput } from '@/lib/invoices'

/** The workspace's invoice settings (Settings → Invoicing). Owners edit; everyone reads. */

const FIELDS = `
  legalName address taxId bankDetails numberPrefix nextNumber nextNumberPreview
  defaultNotes defaultTerms operatorName canEdit
`

const INVOICE_SETTINGS = gql`
  query InvoiceSettings {
    invoiceSettings { ${FIELDS} }
  }
`

const UPDATE_INVOICE_SETTINGS = gql`
  mutation UpdateInvoiceSettings($input: InvoiceSettingsInput!) {
    updateInvoiceSettings(input: $input) { ${FIELDS} }
  }
`

interface InvoiceSettingsState {
  settings: InvoiceSettings | null
  loading: boolean
  saving: boolean
  error: string | null
  fetch: () => Promise<void>
  /** Resolves to an error message, or null once saved. */
  save: (input: InvoiceSettingsInput) => Promise<string | null>
}

export const useInvoiceSettingsStore = create<InvoiceSettingsState>((set) => ({
  settings: null,
  loading: false,
  saving: false,
  error: null,

  fetch: async () => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ loading: true, error: null })
    try {
      const data = await client.request<{ invoiceSettings: InvoiceSettings }>(INVOICE_SETTINGS)
      set({ settings: data.invoiceSettings, loading: false })
    } catch (err) {
      set({ loading: false, error: gqlErrorMessage(err, 'Could not load the invoice settings.') })
    }
  },

  save: async (input) => {
    const client = useClientStore.getState().client
    if (!client) return 'Not connected.'
    set({ saving: true })
    try {
      const data = await client.request<{ updateInvoiceSettings: InvoiceSettings }>(UPDATE_INVOICE_SETTINGS, {
        input,
      })
      set({ settings: data.updateInvoiceSettings, saving: false })
      return null
    } catch (err) {
      set({ saving: false })
      return gqlErrorMessage(err, 'Could not save the invoice settings.')
    }
  },
}))
