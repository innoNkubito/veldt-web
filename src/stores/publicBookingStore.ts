import { create } from 'zustand'
import { GraphQLClient, gql } from 'graphql-request'
import { gqlErrorMessage } from '@/lib/gql-error'

/**
 * Client-facing booking store — used on /view/[slug] and /pay/[token].
 * Unauthenticated: these endpoints are public, so there's no Clerk token.
 */

// ── Types ───────────────────────────────────────────────────────

export type BookingMode = 'OFF' | 'VELDT' | 'EXTERNAL'
export type BookingFlowType = 'INSTANT' | 'REQUEST'
export type ScheduleAmountType = 'FIXED' | 'PERCENT_OF_TOTAL' | 'REMAINING_BALANCE'
export type BookingStatus = 'PENDING_REQUEST' | 'AWAITING_PAYMENT' | 'CONFIRMED' | 'CANCELLED'
export type InstallmentStatus = 'DUE' | 'PROCESSING' | 'PAID' | 'OVERDUE' | 'VOID'

export interface PublicBookingPackage {
  id: string
  name: string
  description: string | null
  price: number
  peopleIncluded: number
  remaining: number
}

export interface PublicBookingAddon {
  id: string
  name: string
  description: string | null
  perPersonPrice: number
  limitCount: number | null
}

export interface PublicSchedulePreviewItem {
  description: string
  dueAtBooking: boolean
  dueDate: string | null
  amountType: ScheduleAmountType
  amountValue: number | null
}

export interface PublicBookingOptions {
  itineraryId: string
  proposalTitle: string
  bookingMode: BookingMode
  externalUrl: string | null
  externalContact: string | null
  flowType: BookingFlowType
  currency: string
  packages: PublicBookingPackage[]
  addons: PublicBookingAddon[]
  schedulePreview: PublicSchedulePreviewItem[]
  termsAndConditions: string | null
  companyInfo: string | null
  allowCardPayments: boolean
  surchargePercent: number | null
}

export interface PublicInstallment {
  description: string
  sequence: number
  dueDate: string
  amountDue: number
  surchargeAmount: number
  status: InstallmentStatus
}

export interface PublicBookingResult {
  reference: string
  status: BookingStatus
  flowType: BookingFlowType
  currency: string
  total: number
  guestCount: number
  installments: PublicInstallment[]
  firstPayToken: string | null
}

export interface PublicInstallmentDetail {
  description: string
  dueDate: string
  amountDue: number
  surchargeAmount: number
  status: InstallmentStatus
  currency: string
  bookingReference: string
  proposalTitle: string
  clientName: string
  payableOnline: boolean
}

export interface PaymentStatusResult {
  status: InstallmentStatus
  outcome: string
  message: string | null
}

export interface CreateBookingInput {
  packages: { packageId: string; quantity: number }[]
  addonIds: string[]
  clientName: string
  clientEmail: string
  clientPhone?: string
  clientNote?: string
  acceptedTerms: boolean
}

// ── GQL ─────────────────────────────────────────────────────────

const GET_BOOKING_OPTIONS = gql`
  query BookingOptions($slug: String!) {
    bookingOptionsBySlug(slug: $slug) {
      itineraryId
      proposalTitle
      bookingMode
      externalUrl
      externalContact
      flowType
      currency
      packages { id name description price peopleIncluded remaining }
      addons { id name description perPersonPrice limitCount }
      schedulePreview { description dueAtBooking dueDate amountType amountValue }
      termsAndConditions
      companyInfo
      allowCardPayments
      surchargePercent
    }
  }
`

const CREATE_BOOKING = gql`
  mutation CreateBooking($slug: String!, $input: CreateBookingInput!) {
    createBooking(slug: $slug, input: $input) {
      reference
      status
      flowType
      currency
      total
      guestCount
      installments { description sequence dueDate amountDue surchargeAmount status }
      firstPayToken
    }
  }
`

const GET_INSTALLMENT = gql`
  query InstallmentByToken($payToken: String!) {
    installmentByToken(payToken: $payToken) {
      description
      dueDate
      amountDue
      surchargeAmount
      status
      currency
      bookingReference
      proposalTitle
      clientName
      payableOnline
    }
  }
`

const START_PAYMENT = gql`
  mutation StartInstallmentPayment($payToken: String!) {
    startInstallmentPayment(payToken: $payToken) {
      redirectUrl
      status
    }
  }
`

const CHECK_PAYMENT = gql`
  mutation CheckInstallmentPayment($payToken: String!) {
    checkInstallmentPayment(payToken: $payToken) {
      status
      outcome
      message
    }
  }
`

function publicClient(): GraphQLClient | null {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  return apiUrl ? new GraphQLClient(apiUrl) : null
}


// ── Cart helpers (shared by checkout UI) ────────────────────────

export interface CartLine {
  packageId: string
  quantity: number
}

/** Guest count derived from the cart — Σ(peopleIncluded × qty). */
export function deriveGuestCount(
  cart: CartLine[],
  packages: PublicBookingPackage[],
): number {
  const byId = new Map(packages.map((p) => [p.id, p]))
  return cart.reduce((sum, line) => {
    const pkg = byId.get(line.packageId)
    return sum + (pkg ? pkg.peopleIncluded * line.quantity : 0)
  }, 0)
}

/**
 * Mirrors the server's pricing so the client can show a live total.
 * The server always recomputes — this is display only.
 */
export function estimateTotal(
  cart: CartLine[],
  addonIds: string[],
  packages: PublicBookingPackage[],
  addons: PublicBookingAddon[],
): { guestCount: number; subtotal: number } {
  const guestCount = deriveGuestCount(cart, packages)
  const packageById = new Map(packages.map((p) => [p.id, p]))
  const addonById = new Map(addons.map((a) => [a.id, a]))

  // Cents throughout — matches the server's minor-unit arithmetic
  let subtotalMinor = 0
  for (const line of cart) {
    const pkg = packageById.get(line.packageId)
    if (pkg) subtotalMinor += Math.round(pkg.price * 100) * line.quantity
  }
  for (const addonId of addonIds) {
    const addon = addonById.get(addonId)
    if (!addon) continue
    const qty = addon.limitCount != null ? Math.min(guestCount, addon.limitCount) : guestCount
    subtotalMinor += Math.round(addon.perPersonPrice * 100) * qty
  }

  return { guestCount, subtotal: subtotalMinor / 100 }
}

/** Resolves the schedule preview into concrete amounts for display. */
export function previewInstallments(
  schedule: PublicSchedulePreviewItem[],
  total: number,
): { description: string; dueLabel: string; amount: number }[] {
  if (schedule.length === 0) {
    return [{ description: 'Full payment', dueLabel: 'At booking', amount: total }]
  }

  const totalMinor = Math.round(total * 100)
  const amounts: (number | null)[] = schedule.map((item) => {
    if (item.amountType === 'FIXED') return Math.round((item.amountValue ?? 0) * 100)
    if (item.amountType === 'PERCENT_OF_TOTAL') {
      return Math.floor((totalMinor * (item.amountValue ?? 0)) / 100 + 0.5)
    }
    return null
  })

  const known = amounts.reduce<number>((sum, a) => sum + (a ?? 0), 0)
  const remainderIndex = amounts.findIndex((a) => a === null)
  if (remainderIndex > -1) amounts[remainderIndex] = Math.max(0, totalMinor - known)

  // Only the first REMAINING_BALANCE row absorbs the balance above; a second
  // one would stay null, so fold any left over to zero rather than asserting
  // the array is all numbers.
  const resolved = amounts.map((amount) => amount ?? 0)
  const drift = totalMinor - resolved.reduce((sum, a) => sum + a, 0)
  if (drift !== 0) resolved[resolved.length - 1] += drift

  return schedule
    .map((item, index) => ({
      description: item.description,
      dueLabel: item.dueAtBooking
        ? 'At booking'
        : item.dueDate
          ? new Date(item.dueDate).toLocaleDateString()
          : 'TBD',
      amount: resolved[index] / 100,
    }))
    .filter((i) => i.amount > 0)
}

// ── Store ───────────────────────────────────────────────────────

interface PublicBookingState {
  options: PublicBookingOptions | null
  loading: boolean
  submitting: boolean
  error: string | null
  result: PublicBookingResult | null

  // Hosted payment (/pay/[token])
  installment: PublicInstallmentDetail | null
  paying: boolean

  fetchOptions: (slug: string) => Promise<void>
  submitBooking: (slug: string, input: CreateBookingInput) => Promise<PublicBookingResult | null>
  fetchInstallment: (payToken: string) => Promise<void>
  startPayment: (payToken: string) => Promise<string | null>
  checkPayment: (payToken: string) => Promise<PaymentStatusResult | null>
  setError: (error: string | null) => void
  reset: () => void
}

export const usePublicBookingStore = create<PublicBookingState>((set) => ({
  options: null,
  loading: false,
  submitting: false,
  error: null,
  result: null,
  installment: null,
  paying: false,

  fetchOptions: async (slug) => {
    const client = publicClient()
    if (!client) return
    set({ loading: true, error: null })
    try {
      const data = await client.request<{ bookingOptionsBySlug: PublicBookingOptions | null }>(
        GET_BOOKING_OPTIONS,
        { slug },
      )
      set({ options: data.bookingOptionsBySlug, loading: false })
    } catch (err) {
      // A non-bookable itinerary is a normal state, not an error to surface
      set({ options: null, loading: false, error: gqlErrorMessage(err, 'Could not load booking options') })
    }
  },

  submitBooking: async (slug, input) => {
    const client = publicClient()
    if (!client) return null
    set({ submitting: true, error: null })
    try {
      const data = await client.request<{ createBooking: PublicBookingResult }>(CREATE_BOOKING, {
        slug,
        input,
      })
      set({ result: data.createBooking, submitting: false })
      return data.createBooking
    } catch (err) {
      set({ error: gqlErrorMessage(err, 'We could not complete your booking'), submitting: false })
      return null
    }
  },

  // ── Hosted payment ────────────────────────────────────────────

  fetchInstallment: async (payToken) => {
    const client = publicClient()
    if (!client) return
    set({ loading: true, error: null })
    try {
      const data = await client.request<{ installmentByToken: PublicInstallmentDetail | null }>(
        GET_INSTALLMENT,
        { payToken },
      )
      set({ installment: data.installmentByToken, loading: false })
    } catch (err) {
      set({ installment: null, loading: false, error: gqlErrorMessage(err, 'Could not load this payment') })
    }
  },

  startPayment: async (payToken) => {
    const client = publicClient()
    if (!client) return null
    set({ paying: true, error: null })
    try {
      const data = await client.request<{
        startInstallmentPayment: { redirectUrl: string | null; status: InstallmentStatus }
      }>(START_PAYMENT, { payToken })
      // Leave `paying` true — the browser is about to navigate away
      return data.startInstallmentPayment.redirectUrl
    } catch (err) {
      set({ error: gqlErrorMessage(err, 'Could not start this payment'), paying: false })
      return null
    }
  },

  checkPayment: async (payToken) => {
    const client = publicClient()
    if (!client) return null
    set({ loading: true })
    try {
      const data = await client.request<{ checkInstallmentPayment: PaymentStatusResult }>(
        CHECK_PAYMENT,
        { payToken },
      )
      set((s) => ({
        loading: false,
        installment: s.installment
          ? { ...s.installment, status: data.checkInstallmentPayment.status }
          : s.installment,
      }))
      return data.checkInstallmentPayment
    } catch (err) {
      set({ loading: false, error: gqlErrorMessage(err, 'Could not confirm your payment') })
      return null
    }
  },

  setError: (error) => set({ error }),
  reset: () =>
    set({
      options: null,
      loading: false,
      submitting: false,
      error: null,
      result: null,
      installment: null,
      paying: false,
    }),
}))
