import { create } from 'zustand'
import { gql } from 'graphql-request'
import { useClientStore } from './clientStore'
import { gqlErrorMessage } from '@/lib/gql-error'
import type {
  ClientInvoice,
  ClientInvoiceDraftInput,
  ClientInvoicePaymentInput,
  ClientInvoiceSource,
} from '@/lib/invoices'

/** A trip's client invoices (Financials → Invoices), plus its bookings for the source picker. */

const FIELDS = `
  id itineraryId bookingId bookingReference number status currency
  billToName billToEmail billToAddress notes terms
  issuer { name address taxId bankDetails logoUrl email phone }
  lines { id description quantity unitPrice taxRate lineTotal taxAmount }
  taxes { rate taxable tax }
  stages { id label dueDate amount state installmentId }
  payments { id amount paidAt method reference fromBooking }
  subtotal taxTotal total amountPaid amountDue overdue nextDueDate nextDueAmount
  sendIssues issuedAt sentAt sentTo voidedAt voidReason
  replacesInvoiceId replacesNumber replacedById replacedByNumber
  publicToken acceptsManualPayments createdAt updatedAt
`

const LIST = gql`
  query ClientInvoices($itineraryId: ID!) {
    clientInvoices(itineraryId: $itineraryId) { ${FIELDS} }
    bookings(itineraryId: $itineraryId) { id reference clientName status total currency }
  }
`

const op = (name: string, signature: string, call: string) => gql`
  mutation ${name}(${signature}) { result: ${call} { ${FIELDS} } }
`

const CREATE = op(
  'CreateClientInvoice',
  '$itineraryId: ID!, $source: ClientInvoiceSource!, $bookingId: ID',
  'createClientInvoice(itineraryId: $itineraryId, source: $source, bookingId: $bookingId)',
)
const UPDATE = op('UpdateClientInvoice', '$id: ID!, $input: ClientInvoiceDraftInput!', 'updateClientInvoice(id: $id, input: $input)')
const SEND = op(
  'SendClientInvoice',
  '$id: ID!, $to: String!, $copyToMe: Boolean',
  'sendClientInvoice(id: $id, to: $to, copyToMe: $copyToMe)',
)
const RESEND = op(
  'ResendClientInvoice',
  '$id: ID!, $to: String!, $copyToMe: Boolean',
  'resendClientInvoice(id: $id, to: $to, copyToMe: $copyToMe)',
)
const VOID = op('VoidClientInvoice', '$id: ID!, $reason: String!', 'voidClientInvoice(id: $id, reason: $reason)')
const REISSUE = op('ReissueClientInvoice', '$id: ID!', 'reissueClientInvoice(id: $id)')
const RECORD_PAYMENT = op(
  'RecordClientInvoicePayment',
  '$invoiceId: ID!, $input: ClientInvoicePaymentInput!',
  'recordClientInvoicePayment(invoiceId: $invoiceId, input: $input)',
)
const DELETE_PAYMENT = op('DeleteClientInvoicePayment', '$id: ID!', 'deleteClientInvoicePayment(id: $id)')
const DELETE = gql`
  mutation DeleteClientInvoice($id: ID!) {
    deleteClientInvoice(id: $id)
  }
`

export interface InvoiceableBooking {
  id: string
  reference: string
  clientName: string
  status: string
  total: number
  currency: string
}

/** Every write resolves to the saved invoice, or an error to show. */
export type InvoiceResult = { invoice: ClientInvoice; error: null } | { invoice: null; error: string }

interface ClientInvoiceState {
  itineraryId: string | null
  invoices: ClientInvoice[]
  bookings: InvoiceableBooking[]
  loading: boolean
  /** The id of the invoice a write is in flight for, or 'new'. */
  busy: string | null
  error: string | null
  fetch: (itineraryId: string) => Promise<void>
  create: (source: ClientInvoiceSource, bookingId?: string | null) => Promise<InvoiceResult>
  update: (id: string, input: ClientInvoiceDraftInput) => Promise<InvoiceResult>
  send: (id: string, to: string, copyToMe: boolean) => Promise<InvoiceResult>
  resend: (id: string, to: string, copyToMe: boolean) => Promise<InvoiceResult>
  voidInvoice: (id: string, reason: string) => Promise<InvoiceResult>
  reissue: (id: string) => Promise<InvoiceResult>
  recordPayment: (id: string, input: ClientInvoicePaymentInput) => Promise<InvoiceResult>
  deletePayment: (invoiceId: string, paymentId: string) => Promise<InvoiceResult>
  remove: (id: string) => Promise<string | null>
}

/** Newest first, as the API lists them. */
function upsert(list: ClientInvoice[], invoice: ClientInvoice): ClientInvoice[] {
  const rest = list.filter((i) => i.id !== invoice.id)
  return [invoice, ...rest].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export const useClientInvoiceStore = create<ClientInvoiceState>((set, get) => {
  /** Runs a mutation returning an invoice, and merges it into the list. */
  async function write(
    busy: string,
    document: string,
    variables: Record<string, unknown>,
    fallback: string,
  ): Promise<InvoiceResult> {
    const client = useClientStore.getState().client
    if (!client) return { invoice: null, error: 'Not connected.' }
    set({ busy })
    try {
      const data = await client.request<{ result: ClientInvoice }>(document, variables)
      set((s) => ({ invoices: upsert(s.invoices, data.result), busy: null }))
      return { invoice: data.result, error: null }
    } catch (err) {
      set({ busy: null })
      return { invoice: null, error: gqlErrorMessage(err, fallback) }
    }
  }

  return {
    itineraryId: null,
    invoices: [],
    bookings: [],
    loading: false,
    busy: null,
    error: null,

    fetch: async (itineraryId) => {
      const client = useClientStore.getState().client
      if (!client) return
      const switching = get().itineraryId !== itineraryId
      set({ itineraryId, loading: true, error: null, ...(switching ? { invoices: [], bookings: [] } : {}) })
      try {
        const data = await client.request<{ clientInvoices: ClientInvoice[]; bookings: InvoiceableBooking[] }>(LIST, {
          itineraryId,
        })
        if (get().itineraryId !== itineraryId) return
        set({ invoices: data.clientInvoices, bookings: data.bookings, loading: false })
      } catch (err) {
        set({ loading: false, error: gqlErrorMessage(err, 'Could not load the invoices.') })
      }
    },

    create: (source, bookingId) => {
      const itineraryId = get().itineraryId
      if (!itineraryId) return Promise.resolve({ invoice: null, error: 'No trip is open.' })
      return write('new', CREATE, { itineraryId, source, bookingId: bookingId ?? null }, 'Could not create the invoice.')
    },
    update: (id, input) => write(id, UPDATE, { id, input }, 'Could not save the invoice.'),
    send: (id, to, copyToMe) => write(id, SEND, { id, to, copyToMe }, 'Could not send the invoice.'),
    resend: (id, to, copyToMe) => write(id, RESEND, { id, to, copyToMe }, 'Could not send the invoice.'),
    voidInvoice: (id, reason) => write(id, VOID, { id, reason }, 'Could not void the invoice.'),
    reissue: (id) => write(id, REISSUE, { id }, 'Could not reissue the invoice.'),
    recordPayment: (id, input) => write(id, RECORD_PAYMENT, { invoiceId: id, input }, 'Could not record the payment.'),
    deletePayment: (invoiceId, paymentId) =>
      write(invoiceId, DELETE_PAYMENT, { id: paymentId }, 'Could not remove the payment.'),

    remove: async (id) => {
      const client = useClientStore.getState().client
      if (!client) return 'Not connected.'
      set({ busy: id })
      try {
        await client.request(DELETE, { id })
        set((s) => ({ invoices: s.invoices.filter((i) => i.id !== id), busy: null }))
        return null
      } catch (err) {
        set({ busy: null })
        return gqlErrorMessage(err, 'Could not delete the invoice.')
      }
    },
  }
})
