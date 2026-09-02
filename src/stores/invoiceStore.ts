import { create } from 'zustand'
import { GraphQLClient, gql } from 'graphql-request'
import { gqlErrorMessage } from '@/lib/gql-error'

/**
 * Public subscription-invoice store — backs /billing/pay/[token].
 * Unauthenticated: an operator settling an invoice may well be suspended, so
 * this must work without a working session.
 */

export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'VOID'

export interface PublicInvoice {
  number: string
  status: InvoiceStatus
  operatorName: string
  amountDue: number
  currency: string
  periodStart: string
  periodEnd: string
  dueDate: string
  payableOnline: boolean
}

export interface InvoicePaymentStatus {
  status: InvoiceStatus
  outcome: string
  message: string | null
}

const GET_INVOICE = gql`
  query SubscriptionInvoiceByToken($payToken: String!) {
    subscriptionInvoiceByToken(payToken: $payToken) {
      number
      status
      operatorName
      amountDue
      currency
      periodStart
      periodEnd
      dueDate
      payableOnline
    }
  }
`

const START_PAYMENT = gql`
  mutation StartInvoicePayment($payToken: String!) {
    startInvoicePayment(payToken: $payToken) { redirectUrl status }
  }
`

const CHECK_PAYMENT = gql`
  mutation CheckInvoicePayment($payToken: String!) {
    checkInvoicePayment(payToken: $payToken) { status outcome message }
  }
`

function publicClient(): GraphQLClient | null {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  return apiUrl ? new GraphQLClient(apiUrl) : null
}

interface InvoiceState {
  invoice: PublicInvoice | null
  loading: boolean
  paying: boolean
  error: string | null

  fetchInvoice: (payToken: string) => Promise<void>
  startPayment: (payToken: string) => Promise<string | null>
  checkPayment: (payToken: string) => Promise<InvoicePaymentStatus | null>
  setError: (error: string | null) => void
}

export const useInvoiceStore = create<InvoiceState>((set) => ({
  invoice: null,
  loading: false,
  paying: false,
  error: null,

  fetchInvoice: async (payToken) => {
    const client = publicClient()
    if (!client) return
    set({ loading: true, error: null })
    try {
      const data = await client.request<{ subscriptionInvoiceByToken: PublicInvoice | null }>(
        GET_INVOICE,
        { payToken },
      )
      set({ invoice: data.subscriptionInvoiceByToken, loading: false })
    } catch (err) {
      set({ invoice: null, loading: false, error: gqlErrorMessage(err, 'Could not load this invoice') })
    }
  },

  startPayment: async (payToken) => {
    const client = publicClient()
    if (!client) return null
    set({ paying: true, error: null })
    try {
      const data = await client.request<{
        startInvoicePayment: { redirectUrl: string | null; status: InvoiceStatus }
      }>(START_PAYMENT, { payToken })
      // Leave `paying` true — the browser is about to navigate away
      return data.startInvoicePayment.redirectUrl
    } catch (err) {
      set({ paying: false, error: gqlErrorMessage(err, 'Could not start this payment') })
      return null
    }
  },

  checkPayment: async (payToken) => {
    const client = publicClient()
    if (!client) return null
    set({ loading: true })
    try {
      const data = await client.request<{ checkInvoicePayment: InvoicePaymentStatus }>(
        CHECK_PAYMENT,
        { payToken },
      )
      set((s) => ({
        loading: false,
        invoice: s.invoice ? { ...s.invoice, status: data.checkInvoicePayment.status } : s.invoice,
      }))
      return data.checkInvoicePayment
    } catch (err) {
      set({ loading: false, error: gqlErrorMessage(err, 'Could not confirm your payment') })
      return null
    }
  },

  setError: (error) => set({ error }),
}))
