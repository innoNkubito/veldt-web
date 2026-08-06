import { create } from 'zustand'
import { gql } from 'graphql-request'
import { useClientStore } from './clientStore'
import type { ProcessorConnection } from './integrationsStore'
import { gqlErrorMessage } from '@/lib/gql-error'

// ── Types ───────────────────────────────────────────────────────

export type BookingMode = 'OFF' | 'VELDT' | 'EXTERNAL'
export type BookingFlowType = 'INSTANT' | 'REQUEST'
export type SurchargePayer = 'CLIENT' | 'OPERATOR'
export type ScheduleAmountType = 'FIXED' | 'PERCENT_OF_TOTAL' | 'REMAINING_BALANCE'

export interface BookingPackage {
  id: string
  name: string
  description: string | null
  price: number
  totalAvailable: number
  peopleIncluded: number
  position: number
}

export interface BookingAddon {
  id: string
  name: string
  description: string | null
  perPersonPrice: number
  limitCount: number | null
  position: number
}

export interface PaymentScheduleItem {
  id: string
  description: string
  dueAtBooking: boolean
  dueDate: string | null
  amountType: ScheduleAmountType
  amountValue: number | null
  position: number
}

export interface BookingConfig {
  id: string
  itineraryId: string
  bookingMode: BookingMode
  externalUrl: string | null
  externalContact: string | null
  flowType: BookingFlowType
  currency: string
  processorConnectionId: string | null
  processorConnection: ProcessorConnection | null
  companyInfo: string | null
  invoiceNotes: string | null
  termsAndConditions: string | null
  allowCardPayments: boolean
  surchargePayer: SurchargePayer | null
  surchargePercent: number | null
  achEnabled: boolean
  reminderDaysBefore: number[]
  packages: BookingPackage[]
  addons: BookingAddon[]
  scheduleItems: PaymentScheduleItem[]
  updatedAt: string
}

export interface BookingConfigInput {
  bookingMode?: BookingMode
  externalUrl?: string | null
  externalContact?: string | null
  flowType?: BookingFlowType
  currency?: string
  processorConnectionId?: string | null
  companyInfo?: string | null
  invoiceNotes?: string | null
  termsAndConditions?: string | null
  allowCardPayments?: boolean
  surchargePayer?: SurchargePayer | null
  surchargePercent?: number | null
  achEnabled?: boolean
  reminderDaysBefore?: number[]
}

export interface PackageInput {
  name: string
  description?: string | null
  price: number
  totalAvailable: number
  peopleIncluded: number
  position?: number
}

export interface AddonInput {
  name: string
  description?: string | null
  perPersonPrice: number
  limitCount?: number | null
  position?: number
}

export interface ScheduleItemInput {
  description: string
  dueAtBooking: boolean
  dueDate?: string | null
  amountType: ScheduleAmountType
  amountValue?: number | null
}

// ── Display metadata ────────────────────────────────────────────

export const BOOKING_MODE_LABELS: Record<BookingMode, string> = {
  OFF: 'Not bookable',
  VELDT: 'Book through Veldt',
  EXTERNAL: 'External link / contact',
}

export const AMOUNT_TYPE_LABELS: Record<ScheduleAmountType, string> = {
  FIXED: 'Fixed amount',
  PERCENT_OF_TOTAL: 'Percentage of total',
  REMAINING_BALANCE: 'Remaining balance',
}

export const BOOKING_CURRENCIES = ['USD', 'EUR', 'GBP', 'AUD', 'ZAR', 'KES', 'TZS']

// ── GQL ─────────────────────────────────────────────────────────

const CONFIG_FIELDS = `
  id itineraryId bookingMode externalUrl externalContact
  flowType currency processorConnectionId
  processorConnection { id type label status supportsCards supportsAch createdAt updatedAt }
  companyInfo invoiceNotes termsAndConditions
  allowCardPayments surchargePayer surchargePercent achEnabled
  reminderDaysBefore
  packages { id name description price totalAvailable peopleIncluded position }
  addons { id name description perPersonPrice limitCount position }
  scheduleItems { id description dueAtBooking dueDate amountType amountValue position }
  updatedAt
`

const GET_BOOKING_CONFIG = gql`
  query GetBookingConfig($itineraryId: ID!) {
    bookingConfig(itineraryId: $itineraryId) { ${CONFIG_FIELDS} }
  }
`

const UPSERT_BOOKING_CONFIG = gql`
  mutation UpsertBookingConfig($itineraryId: ID!, $input: BookingConfigInput!) {
    upsertBookingConfig(itineraryId: $itineraryId, input: $input) { ${CONFIG_FIELDS} }
  }
`

const PACKAGE_FIELDS = `id name description price totalAvailable peopleIncluded position`
const ADDON_FIELDS = `id name description perPersonPrice limitCount position`
const SCHEDULE_FIELDS = `id description dueAtBooking dueDate amountType amountValue position`

const CREATE_PACKAGE = gql`
  mutation CreateBookingPackage($bookingConfigId: ID!, $input: BookingPackageInput!) {
    createBookingPackage(bookingConfigId: $bookingConfigId, input: $input) { ${PACKAGE_FIELDS} }
  }
`
const UPDATE_PACKAGE = gql`
  mutation UpdateBookingPackage($id: ID!, $input: BookingPackageInput!) {
    updateBookingPackage(id: $id, input: $input) { ${PACKAGE_FIELDS} }
  }
`
const DELETE_PACKAGE = gql`
  mutation DeleteBookingPackage($id: ID!) { deleteBookingPackage(id: $id) }
`

const CREATE_ADDON = gql`
  mutation CreateBookingAddon($bookingConfigId: ID!, $input: BookingAddonInput!) {
    createBookingAddon(bookingConfigId: $bookingConfigId, input: $input) { ${ADDON_FIELDS} }
  }
`
const UPDATE_ADDON = gql`
  mutation UpdateBookingAddon($id: ID!, $input: BookingAddonInput!) {
    updateBookingAddon(id: $id, input: $input) { ${ADDON_FIELDS} }
  }
`
const DELETE_ADDON = gql`
  mutation DeleteBookingAddon($id: ID!) { deleteBookingAddon(id: $id) }
`

const SET_SCHEDULE = gql`
  mutation SetPaymentSchedule($bookingConfigId: ID!, $items: [PaymentScheduleItemInput!]!) {
    setPaymentSchedule(bookingConfigId: $bookingConfigId, items: $items) { ${SCHEDULE_FIELDS} }
  }
`


// ── Store ───────────────────────────────────────────────────────

interface BookingState {
  config: BookingConfig | null
  loading: boolean
  saving: boolean
  error: string | null

  fetchConfig: (itineraryId: string) => Promise<void>
  saveConfig: (itineraryId: string, input: BookingConfigInput) => Promise<string | null>

  addPackage: (input: PackageInput) => Promise<string | null>
  editPackage: (id: string, input: PackageInput) => Promise<string | null>
  removePackage: (id: string) => Promise<void>

  addAddon: (input: AddonInput) => Promise<string | null>
  editAddon: (id: string, input: AddonInput) => Promise<string | null>
  removeAddon: (id: string) => Promise<void>

  saveSchedule: (items: ScheduleItemInput[]) => Promise<string | null>

  setError: (error: string | null) => void
  reset: () => void
}

export const useBookingStore = create<BookingState>((set, get) => ({
  config: null,
  loading: false,
  saving: false,
  error: null,

  fetchConfig: async (itineraryId) => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ loading: true, error: null })
    try {
      const data = await client.request<{ bookingConfig: BookingConfig | null }>(
        GET_BOOKING_CONFIG,
        { itineraryId },
      )
      set({ config: data.bookingConfig, loading: false })
    } catch (err) {
      set({ error: gqlErrorMessage(err, 'Failed to load booking settings'), loading: false })
    }
  },

  saveConfig: async (itineraryId, input) => {
    const client = useClientStore.getState().client
    if (!client) return 'Not connected'
    set({ saving: true, error: null })
    try {
      const data = await client.request<{ upsertBookingConfig: BookingConfig }>(
        UPSERT_BOOKING_CONFIG,
        { itineraryId, input },
      )
      set({ config: data.upsertBookingConfig, saving: false })
      return null
    } catch (err) {
      const message = gqlErrorMessage(err, 'Failed to save booking settings')
      set({ error: message, saving: false })
      return message
    }
  },

  addPackage: async (input) => {
    const client = useClientStore.getState().client
    const config = get().config
    if (!client || !config) return 'Save your booking settings first'
    set({ saving: true, error: null })
    try {
      const data = await client.request<{ createBookingPackage: BookingPackage }>(CREATE_PACKAGE, {
        bookingConfigId: config.id,
        input,
      })
      set((s) => ({
        saving: false,
        config: s.config
          ? { ...s.config, packages: [...s.config.packages, data.createBookingPackage] }
          : s.config,
      }))
      return null
    } catch (err) {
      const message = gqlErrorMessage(err, 'Failed to add package')
      set({ error: message, saving: false })
      return message
    }
  },

  editPackage: async (id, input) => {
    const client = useClientStore.getState().client
    if (!client) return 'Not connected'
    set({ saving: true, error: null })
    try {
      const data = await client.request<{ updateBookingPackage: BookingPackage }>(UPDATE_PACKAGE, {
        id,
        input,
      })
      set((s) => ({
        saving: false,
        config: s.config
          ? {
              ...s.config,
              packages: s.config.packages.map((p) =>
                p.id === id ? data.updateBookingPackage : p,
              ),
            }
          : s.config,
      }))
      return null
    } catch (err) {
      const message = gqlErrorMessage(err, 'Failed to update package')
      set({ error: message, saving: false })
      return message
    }
  },

  removePackage: async (id) => {
    const client = useClientStore.getState().client
    if (!client) return
    try {
      await client.request(DELETE_PACKAGE, { id })
      set((s) => ({
        config: s.config
          ? { ...s.config, packages: s.config.packages.filter((p) => p.id !== id) }
          : s.config,
      }))
    } catch (err) {
      set({ error: gqlErrorMessage(err, 'Failed to remove package') })
    }
  },

  addAddon: async (input) => {
    const client = useClientStore.getState().client
    const config = get().config
    if (!client || !config) return 'Save your booking settings first'
    set({ saving: true, error: null })
    try {
      const data = await client.request<{ createBookingAddon: BookingAddon }>(CREATE_ADDON, {
        bookingConfigId: config.id,
        input,
      })
      set((s) => ({
        saving: false,
        config: s.config
          ? { ...s.config, addons: [...s.config.addons, data.createBookingAddon] }
          : s.config,
      }))
      return null
    } catch (err) {
      const message = gqlErrorMessage(err, 'Failed to add addon')
      set({ error: message, saving: false })
      return message
    }
  },

  editAddon: async (id, input) => {
    const client = useClientStore.getState().client
    if (!client) return 'Not connected'
    set({ saving: true, error: null })
    try {
      const data = await client.request<{ updateBookingAddon: BookingAddon }>(UPDATE_ADDON, {
        id,
        input,
      })
      set((s) => ({
        saving: false,
        config: s.config
          ? {
              ...s.config,
              addons: s.config.addons.map((a) => (a.id === id ? data.updateBookingAddon : a)),
            }
          : s.config,
      }))
      return null
    } catch (err) {
      const message = gqlErrorMessage(err, 'Failed to update addon')
      set({ error: message, saving: false })
      return message
    }
  },

  removeAddon: async (id) => {
    const client = useClientStore.getState().client
    if (!client) return
    try {
      await client.request(DELETE_ADDON, { id })
      set((s) => ({
        config: s.config
          ? { ...s.config, addons: s.config.addons.filter((a) => a.id !== id) }
          : s.config,
      }))
    } catch (err) {
      set({ error: gqlErrorMessage(err, 'Failed to remove addon') })
    }
  },

  saveSchedule: async (items) => {
    const client = useClientStore.getState().client
    const config = get().config
    if (!client || !config) return 'Save your booking settings first'
    set({ saving: true, error: null })
    try {
      const data = await client.request<{ setPaymentSchedule: PaymentScheduleItem[] }>(
        SET_SCHEDULE,
        { bookingConfigId: config.id, items },
      )
      set((s) => ({
        saving: false,
        config: s.config ? { ...s.config, scheduleItems: data.setPaymentSchedule } : s.config,
      }))
      return null
    } catch (err) {
      const message = gqlErrorMessage(err, 'Failed to save payment schedule')
      set({ error: message, saving: false })
      return message
    }
  },

  setError: (error) => set({ error }),
  reset: () => set({ config: null, loading: false, saving: false, error: null }),
}))
