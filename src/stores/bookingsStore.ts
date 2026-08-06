import { create } from 'zustand'
import { gql } from 'graphql-request'
import { useClientStore } from './clientStore'
import { gqlErrorMessage } from '@/lib/gql-error'

/**
 * Operator-facing bookings store (the /bookings dashboard).
 * Distinct from `publicBookingStore` (client checkout) and `bookingStore`
 * (per-itinerary booking configuration in the builder).
 */

// ── Types ───────────────────────────────────────────────────────

export type BookingStatus = 'PENDING_REQUEST' | 'AWAITING_PAYMENT' | 'CONFIRMED' | 'CANCELLED'
export type InstallmentStatus = 'DUE' | 'PROCESSING' | 'PAID' | 'OVERDUE' | 'VOID'
export type PaymentMethod = 'CARD' | 'ACH' | 'OFFLINE'

export interface Installment {
  id: string
  description: string
  sequence: number
  dueDate: string
  amountDue: number
  surchargeAmount: number
  status: InstallmentStatus
  paidAt: string | null
  paymentMethod: PaymentMethod | null
  payToken: string | null
}

export interface BookingPackageSelection {
  id: string
  packageName: string
  packagePrice: number
  peopleIncluded: number
  quantity: number
  lineTotal: number
}

export interface BookingAddonSelection {
  id: string
  addonName: string
  perPersonPrice: number
  quantity: number
  lineTotal: number
}

export interface Booking {
  id: string
  reference: string
  itineraryId: string
  itineraryTitle: string | null
  clientName: string
  clientEmail: string
  clientPhone: string | null
  clientNote: string | null
  guestCount: number
  currency: string
  subtotal: number
  surchargeTotal: number
  total: number
  amountPaid: number
  balanceDue: number
  flowType: 'INSTANT' | 'REQUEST'
  status: BookingStatus
  packageSelections: BookingPackageSelection[]
  addonSelections: BookingAddonSelection[]
  installments: Installment[]
  createdAt: string
  confirmedAt: string | null
  cancelledAt: string | null
}

// ── Display metadata ────────────────────────────────────────────

export const BOOKING_STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; color: string; bg: string }
> = {
  PENDING_REQUEST: { label: 'Request', color: '#8a6d1d', bg: '#f7edd8' },
  AWAITING_PAYMENT: { label: 'Awaiting payment', color: '#2f5479', bg: '#e8eef5' },
  CONFIRMED: { label: 'Confirmed', color: '#3d6b39', bg: '#e5efe4' },
  CANCELLED: { label: 'Cancelled', color: '#8A7E6D', bg: '#EFE9DD' },
}

export const INSTALLMENT_STATUS_CONFIG: Record<
  InstallmentStatus,
  { label: string; color: string; bg: string }
> = {
  DUE: { label: 'Due', color: '#6B6153', bg: '#EFE9DD' },
  PROCESSING: { label: 'Processing', color: '#2f5479', bg: '#e8eef5' },
  PAID: { label: 'Paid', color: '#3d6b39', bg: '#e5efe4' },
  OVERDUE: { label: 'Overdue', color: '#b91c1c', bg: '#fbe9e9' },
  VOID: { label: 'Void', color: '#8A7E6D', bg: '#EFE9DD' },
}

export function formatMoney(amount: number, currency: string): string {
  return `${currency} ${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

/** Next unpaid installment, used for the "next due" column. */
export function nextDueInstallment(booking: Booking): Installment | null {
  return (
    booking.installments
      .filter((i) => i.status !== 'PAID' && i.status !== 'VOID')
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0] ?? null
  )
}

// ── GQL ─────────────────────────────────────────────────────────

const BOOKING_FIELDS = `
  id reference itineraryId itineraryTitle
  clientName clientEmail clientPhone clientNote
  guestCount currency subtotal surchargeTotal total amountPaid balanceDue
  flowType status
  packageSelections { id packageName packagePrice peopleIncluded quantity lineTotal }
  addonSelections { id addonName perPersonPrice quantity lineTotal }
  installments {
    id description sequence dueDate amountDue surchargeAmount
    status paidAt paymentMethod payToken
  }
  createdAt confirmedAt cancelledAt
`

const GET_BOOKINGS = gql`
  query GetBookings {
    bookings { ${BOOKING_FIELDS} }
  }
`

const APPROVE_REQUEST = gql`
  mutation ApproveBookingRequest($id: ID!) {
    approveBookingRequest(id: $id) { ${BOOKING_FIELDS} }
  }
`

const CANCEL_BOOKING = gql`
  mutation CancelBooking($id: ID!) {
    cancelBooking(id: $id) { ${BOOKING_FIELDS} }
  }
`

const MARK_PAID = gql`
  mutation MarkInstallmentPaid($id: ID!) {
    markInstallmentPaid(id: $id) {
      id status paidAt paymentMethod
    }
  }
`


// ── Store ───────────────────────────────────────────────────────

interface BookingsState {
  bookings: Booking[]
  loading: boolean
  saving: boolean
  error: string | null

  fetchBookings: () => Promise<void>
  approveRequest: (id: string) => Promise<string | null>
  cancelBooking: (id: string) => Promise<string | null>
  markPaid: (installmentId: string) => Promise<string | null>
  setError: (error: string | null) => void
}

export const useBookingsStore = create<BookingsState>((set, get) => ({
  bookings: [],
  loading: false,
  saving: false,
  error: null,

  fetchBookings: async () => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ loading: true, error: null })
    try {
      const data = await client.request<{ bookings: Booking[] }>(GET_BOOKINGS)
      set({ bookings: data.bookings, loading: false })
    } catch (err) {
      set({ error: gqlErrorMessage(err, 'Failed to load bookings'), loading: false })
    }
  },

  approveRequest: async (id) => {
    const client = useClientStore.getState().client
    if (!client) return 'Not connected'
    set({ saving: true, error: null })
    try {
      const data = await client.request<{ approveBookingRequest: Booking }>(APPROVE_REQUEST, { id })
      set((s) => ({
        saving: false,
        bookings: s.bookings.map((b) => (b.id === id ? data.approveBookingRequest : b)),
      }))
      return null
    } catch (err) {
      const message = gqlErrorMessage(err, 'Failed to approve request')
      set({ error: message, saving: false })
      return message
    }
  },

  cancelBooking: async (id) => {
    const client = useClientStore.getState().client
    if (!client) return 'Not connected'
    set({ saving: true, error: null })
    try {
      const data = await client.request<{ cancelBooking: Booking }>(CANCEL_BOOKING, { id })
      set((s) => ({
        saving: false,
        bookings: s.bookings.map((b) => (b.id === id ? data.cancelBooking : b)),
      }))
      return null
    } catch (err) {
      const message = gqlErrorMessage(err, 'Failed to cancel booking')
      set({ error: message, saving: false })
      return message
    }
  },

  markPaid: async (installmentId) => {
    const client = useClientStore.getState().client
    if (!client) return 'Not connected'
    set({ saving: true, error: null })
    try {
      await client.request(MARK_PAID, { id: installmentId })
      // Totals and booking status are recomputed server-side — refetch
      await get().fetchBookings()
      set({ saving: false })
      return null
    } catch (err) {
      const message = gqlErrorMessage(err, 'Failed to record payment')
      set({ error: message, saving: false })
      return message
    }
  },

  setError: (error) => set({ error }),
}))
