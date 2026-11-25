import { create } from 'zustand'
import { GraphQLClient, gql } from 'graphql-request'
import { gqlErrorMessage } from '@/lib/gql-error'
import type { ClientInvoiceIssuer, ClientInvoiceStageState, ClientInvoiceStatus } from '@/lib/invoices'

/**
 * The client's invoice page, /invoice/[token]. Unauthenticated — the client
 * has no account — so it uses its own client, like the pay pages.
 */

export interface PublicClientInvoice {
  number: string
  status: ClientInvoiceStatus
  currency: string
  tripTitle: string
  issuer: ClientInvoiceIssuer
  billToName: string
  billToAddress: string | null
  issuedAt: string
  lines: { description: string; quantity: number; unitPrice: number; taxRate: number; lineTotal: number }[]
  taxes: { rate: number; taxable: number; tax: number }[]
  subtotal: number
  taxTotal: number
  total: number
  amountPaid: number
  amountDue: number
  overdue: boolean
  stages: { label: string; dueDate: string; amount: number; state: ClientInvoiceStageState; payToken: string | null }[]
  notes: string | null
  terms: string | null
  payableOnline: boolean
}

const PUBLIC_INVOICE = gql`
  query PublicClientInvoice($token: String!) {
    publicClientInvoice(token: $token) {
      number status currency tripTitle
      issuer { name address taxId bankDetails logoUrl email phone }
      billToName billToAddress issuedAt
      lines { description quantity unitPrice taxRate lineTotal }
      taxes { rate taxable tax }
      subtotal taxTotal total amountPaid amountDue overdue
      stages { label dueDate amount state payToken }
      notes terms payableOnline
    }
  }
`

function publicClient(): GraphQLClient | null {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  return apiUrl ? new GraphQLClient(apiUrl) : null
}

interface State {
  invoice: PublicClientInvoice | null
  loading: boolean
  /** True once a lookup finished and found nothing. */
  missing: boolean
  error: string | null
  fetch: (token: string) => Promise<void>
}

export const usePublicClientInvoiceStore = create<State>((set) => ({
  invoice: null,
  loading: true,
  missing: false,
  error: null,

  fetch: async (token) => {
    const client = publicClient()
    if (!client) {
      set({ loading: false, error: 'This page isn’t configured yet.' })
      return
    }
    set({ loading: true, error: null, missing: false })
    try {
      const data = await client.request<{ publicClientInvoice: PublicClientInvoice | null }>(PUBLIC_INVOICE, { token })
      set({ invoice: data.publicClientInvoice, missing: !data.publicClientInvoice, loading: false })
    } catch (err) {
      set({ loading: false, error: gqlErrorMessage(err, 'We couldn’t load this invoice. Please try again shortly.') })
    }
  },
}))
