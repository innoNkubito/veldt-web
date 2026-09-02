import { create } from 'zustand'
import { gql } from 'graphql-request'
import { useClientStore } from './clientStore'
import { gqlErrorMessage } from '@/lib/gql-error'
import type { BillingInterval, SubscriptionTier } from './onboardingStore'

/**
 * Veldt staff store — onboarding request queue and operator provisioning.
 * Every query and mutation here is platform-admin gated server-side.
 */

export type OnboardingRequestStatus =
  | 'SUBMITTED'
  | 'IN_REVIEW'
  | 'INVOICED'
  | 'PAID'
  | 'PROVISIONED'
  | 'REJECTED'

export interface OnboardingRequest {
  id: string
  status: OnboardingRequestStatus
  companyName: string
  proposedSlug: string
  country: string | null
  website: string | null
  contactFirstName: string
  contactLastName: string
  contactEmail: string
  contactPhone: string | null
  requestedTier: SubscriptionTier
  requestedInterval: BillingInterval
  notes: string | null
  internalNotes: string | null
  rejectionReason: string | null
  reviewedAt: string | null
  reviewedByName: string | null
  operatorId: string | null
  createdAt: string
  updatedAt: string
}

export interface ProvisionInput {
  slug?: string
  tier?: SubscriptionTier
  billingInterval?: BillingInterval
  amountPerPeriod: number
  currency?: string
  trialEndsAt?: string
}

export const REQUEST_STATUS_CONFIG: Record<
  OnboardingRequestStatus,
  { label: string; color: string; bg: string }
> = {
  SUBMITTED: { label: 'New', color: '#8a6d1d', bg: '#f7edd8' },
  IN_REVIEW: { label: 'In review', color: '#2f5479', bg: '#e8eef5' },
  INVOICED: { label: 'Invoiced', color: '#2f5479', bg: '#e8eef5' },
  PAID: { label: 'Paid', color: '#3d6b39', bg: '#e5efe4' },
  PROVISIONED: { label: 'Provisioned', color: '#3d6b39', bg: '#e5efe4' },
  REJECTED: { label: 'Rejected', color: '#8A7E6D', bg: '#EFE9DD' },
}

/** Statuses that move a request forward, in order. */
export const PIPELINE: OnboardingRequestStatus[] = [
  'SUBMITTED',
  'IN_REVIEW',
  'INVOICED',
  'PAID',
]

const REQUEST_FIELDS = `
  id status companyName proposedSlug country website
  contactFirstName contactLastName contactEmail contactPhone
  requestedTier requestedInterval
  notes internalNotes rejectionReason
  reviewedAt reviewedByName operatorId
  createdAt updatedAt
`

const IS_ADMIN = gql`
  query IsPlatformAdmin { isPlatformAdmin }
`

const GET_REQUESTS = gql`
  query OnboardingRequests {
    onboardingRequests { ${REQUEST_FIELDS} }
  }
`

const SET_STATUS = gql`
  mutation SetOnboardingRequestStatus(
    $id: ID!
    $status: OnboardingRequestStatus!
    $internalNotes: String
  ) {
    setOnboardingRequestStatus(id: $id, status: $status, internalNotes: $internalNotes) {
      ${REQUEST_FIELDS}
    }
  }
`

const REJECT = gql`
  mutation RejectOnboardingRequest($id: ID!, $reason: String) {
    rejectOnboardingRequest(id: $id, reason: $reason) { ${REQUEST_FIELDS} }
  }
`

const PROVISION = gql`
  mutation ProvisionOperatorFromRequest($id: ID!, $input: ProvisionOperatorInput!) {
    provisionOperatorFromRequest(id: $id, input: $input) {
      operatorId
      slug
      invitationSent
      alreadyProvisioned
    }
  }
`

export interface ProvisionResult {
  operatorId: string
  slug: string
  invitationSent: boolean
  alreadyProvisioned: boolean
}

interface AdminState {
  isAdmin: boolean | null
  requests: OnboardingRequest[]
  loading: boolean
  saving: boolean
  error: string | null

  checkAdmin: () => Promise<void>
  fetchRequests: () => Promise<void>
  setStatus: (
    id: string,
    status: OnboardingRequestStatus,
    internalNotes?: string,
  ) => Promise<string | null>
  reject: (id: string, reason?: string) => Promise<string | null>
  provision: (id: string, input: ProvisionInput) => Promise<ProvisionResult | null>
  setError: (error: string | null) => void
}

export const useAdminStore = create<AdminState>((set, get) => ({
  isAdmin: null,
  requests: [],
  loading: false,
  saving: false,
  error: null,

  checkAdmin: async () => {
    const client = useClientStore.getState().client
    if (!client) return
    try {
      const data = await client.request<{ isPlatformAdmin: boolean }>(IS_ADMIN)
      set({ isAdmin: data.isPlatformAdmin })
    } catch {
      set({ isAdmin: false })
    }
  },

  fetchRequests: async () => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ loading: true, error: null })
    try {
      const data = await client.request<{ onboardingRequests: OnboardingRequest[] }>(
        GET_REQUESTS,
      )
      set({ requests: data.onboardingRequests, loading: false })
    } catch (err) {
      set({ loading: false, error: gqlErrorMessage(err, 'Failed to load requests') })
    }
  },

  setStatus: async (id, status, internalNotes) => {
    const client = useClientStore.getState().client
    if (!client) return 'Not connected'
    set({ saving: true, error: null })
    try {
      const data = await client.request<{
        setOnboardingRequestStatus: OnboardingRequest
      }>(SET_STATUS, { id, status, internalNotes })
      set((s) => ({
        saving: false,
        requests: s.requests.map((r) =>
          r.id === id ? data.setOnboardingRequestStatus : r,
        ),
      }))
      return null
    } catch (err) {
      const message = gqlErrorMessage(err, 'Failed to update request')
      set({ saving: false, error: message })
      return message
    }
  },

  reject: async (id, reason) => {
    const client = useClientStore.getState().client
    if (!client) return 'Not connected'
    set({ saving: true, error: null })
    try {
      const data = await client.request<{ rejectOnboardingRequest: OnboardingRequest }>(
        REJECT,
        { id, reason },
      )
      set((s) => ({
        saving: false,
        requests: s.requests.map((r) => (r.id === id ? data.rejectOnboardingRequest : r)),
      }))
      return null
    } catch (err) {
      const message = gqlErrorMessage(err, 'Failed to reject request')
      set({ saving: false, error: message })
      return message
    }
  },

  provision: async (id, input) => {
    const client = useClientStore.getState().client
    if (!client) return null
    set({ saving: true, error: null })
    try {
      const data = await client.request<{
        provisionOperatorFromRequest: ProvisionResult
      }>(PROVISION, { id, input })
      // Status and operatorId are set server-side — refetch for the truth
      await get().fetchRequests()
      set({ saving: false })
      return data.provisionOperatorFromRequest
    } catch (err) {
      set({ saving: false, error: gqlErrorMessage(err, 'Failed to provision operator') })
      return null
    }
  },

  setError: (error) => set({ error }),
}))

// ── Subscriptions & invoices ────────────────────────────────────

export type SubscriptionStatus =
  | 'TRIALING'
  | 'ACTIVE'
  | 'PAST_DUE'
  | 'SUSPENDED'
  | 'CANCELLED'

export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'VOID'

export interface SubscriptionInvoice {
  id: string
  number: string
  status: InvoiceStatus
  periodStart: string
  periodEnd: string
  amountDue: number
  currency: string
  issuedAt: string | null
  dueDate: string
  paidAt: string | null
  paymentMethod: string | null
  payToken: string | null
}

export interface Subscription {
  id: string
  operatorId: string
  operatorName: string
  operatorSlug: string
  tier: SubscriptionTier
  billingInterval: BillingInterval
  status: SubscriptionStatus
  seatLimit: number | null
  seatsUsed: number
  currency: string
  amountPerPeriod: number
  currentPeriodStart: string | null
  currentPeriodEnd: string | null
  trialEndsAt: string | null
  autoRenew: boolean
  gracePeriodEndsAt: string | null
  suspendedAt: string | null
  cancelledAt: string | null
  notes: string | null
  invoices: SubscriptionInvoice[]
  createdAt: string
}

export const SUBSCRIPTION_STATUS_CONFIG: Record<
  SubscriptionStatus,
  { label: string; color: string; bg: string }
> = {
  TRIALING: { label: 'Trial', color: '#8a6d1d', bg: '#f7edd8' },
  ACTIVE: { label: 'Active', color: '#3d6b39', bg: '#e5efe4' },
  PAST_DUE: { label: 'Past due', color: '#8a6d1d', bg: '#f7edd8' },
  SUSPENDED: { label: 'Suspended', color: '#b91c1c', bg: '#fbe9e9' },
  CANCELLED: { label: 'Cancelled', color: '#8A7E6D', bg: '#EFE9DD' },
}

export const INVOICE_STATUS_CONFIG: Record<
  InvoiceStatus,
  { label: string; color: string; bg: string }
> = {
  DRAFT: { label: 'Draft', color: '#6B6153', bg: '#EFE9DD' },
  SENT: { label: 'Sent', color: '#2f5479', bg: '#e8eef5' },
  PAID: { label: 'Paid', color: '#3d6b39', bg: '#e5efe4' },
  OVERDUE: { label: 'Overdue', color: '#b91c1c', bg: '#fbe9e9' },
  VOID: { label: 'Void', color: '#8A7E6D', bg: '#EFE9DD' },
}

const INVOICE_FIELDS = `
  id number status periodStart periodEnd amountDue currency
  issuedAt dueDate paidAt paymentMethod payToken
`

const SUBSCRIPTION_FIELDS = `
  id operatorId operatorName operatorSlug
  tier billingInterval status
  seatLimit seatsUsed currency amountPerPeriod
  currentPeriodStart currentPeriodEnd trialEndsAt
  autoRenew gracePeriodEndsAt suspendedAt cancelledAt notes
  invoices { ${INVOICE_FIELDS} }
  createdAt
`

const GET_SUBSCRIPTIONS = gql`
  query Subscriptions { subscriptions { ${SUBSCRIPTION_FIELDS} } }
`

const UPDATE_SUBSCRIPTION = gql`
  mutation UpdateSubscription($operatorId: ID!, $input: UpdateSubscriptionInput!) {
    updateSubscription(operatorId: $operatorId, input: $input) { ${SUBSCRIPTION_FIELDS} }
  }
`

const CREATE_INVOICE = gql`
  mutation CreateSubscriptionInvoice($subscriptionId: ID!, $input: CreateInvoiceInput) {
    createSubscriptionInvoice(subscriptionId: $subscriptionId, input: $input) {
      ${INVOICE_FIELDS}
    }
  }
`

const SEND_INVOICE = gql`
  mutation SendSubscriptionInvoice($id: ID!, $recipient: String) {
    sendSubscriptionInvoice(id: $id, recipient: $recipient) { ${INVOICE_FIELDS} }
  }
`

const VOID_INVOICE = gql`
  mutation VoidSubscriptionInvoice($id: ID!) {
    voidSubscriptionInvoice(id: $id) { ${INVOICE_FIELDS} }
  }
`

const MARK_INVOICE_PAID = gql`
  mutation MarkSubscriptionInvoicePaid($id: ID!) {
    markSubscriptionInvoicePaid(id: $id) { ${INVOICE_FIELDS} }
  }
`

export interface UpdateSubscriptionInput {
  tier?: SubscriptionTier
  billingInterval?: BillingInterval
  amountPerPeriod?: number
  status?: SubscriptionStatus
  autoRenew?: boolean
  trialEndsAt?: string | null
  notes?: string
}

interface BillingState {
  subscriptions: Subscription[]
  loadingSubs: boolean
  savingBilling: boolean
  billingError: string | null

  fetchSubscriptions: () => Promise<void>
  updateSubscription: (
    operatorId: string,
    input: UpdateSubscriptionInput,
  ) => Promise<string | null>
  createInvoice: (subscriptionId: string, amountDue?: number) => Promise<string | null>
  sendInvoice: (id: string, recipient?: string) => Promise<string | null>
  voidInvoice: (id: string) => Promise<string | null>
  markInvoicePaid: (id: string) => Promise<string | null>
  setBillingError: (error: string | null) => void
}

export const useBillingAdminStore = create<BillingState>((set, get) => ({
  subscriptions: [],
  loadingSubs: false,
  savingBilling: false,
  billingError: null,

  fetchSubscriptions: async () => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ loadingSubs: true, billingError: null })
    try {
      const data = await client.request<{ subscriptions: Subscription[] }>(GET_SUBSCRIPTIONS)
      set({ subscriptions: data.subscriptions, loadingSubs: false })
    } catch (err) {
      set({
        loadingSubs: false,
        billingError: gqlErrorMessage(err, 'Failed to load subscriptions'),
      })
    }
  },

  updateSubscription: async (operatorId, input) => {
    const client = useClientStore.getState().client
    if (!client) return 'Not connected'
    set({ savingBilling: true, billingError: null })
    try {
      const data = await client.request<{ updateSubscription: Subscription }>(
        UPDATE_SUBSCRIPTION,
        { operatorId, input },
      )
      set((s) => ({
        savingBilling: false,
        subscriptions: s.subscriptions.map((sub) =>
          sub.operatorId === operatorId ? data.updateSubscription : sub,
        ),
      }))
      return null
    } catch (err) {
      const message = gqlErrorMessage(err, 'Failed to update subscription')
      set({ savingBilling: false, billingError: message })
      return message
    }
  },

  createInvoice: async (subscriptionId, amountDue) => {
    const client = useClientStore.getState().client
    if (!client) return 'Not connected'
    set({ savingBilling: true, billingError: null })
    try {
      await client.request(CREATE_INVOICE, {
        subscriptionId,
        input: amountDue != null ? { amountDue } : null,
      })
      await get().fetchSubscriptions()
      set({ savingBilling: false })
      return null
    } catch (err) {
      const message = gqlErrorMessage(err, 'Failed to create invoice')
      set({ savingBilling: false, billingError: message })
      return message
    }
  },

  sendInvoice: async (id, recipient) => {
    const client = useClientStore.getState().client
    if (!client) return 'Not connected'
    set({ savingBilling: true, billingError: null })
    try {
      await client.request(SEND_INVOICE, { id, recipient })
      await get().fetchSubscriptions()
      set({ savingBilling: false })
      return null
    } catch (err) {
      const message = gqlErrorMessage(err, 'Failed to send invoice')
      set({ savingBilling: false, billingError: message })
      return message
    }
  },

  voidInvoice: async (id) => {
    const client = useClientStore.getState().client
    if (!client) return 'Not connected'
    set({ savingBilling: true, billingError: null })
    try {
      await client.request(VOID_INVOICE, { id })
      await get().fetchSubscriptions()
      set({ savingBilling: false })
      return null
    } catch (err) {
      const message = gqlErrorMessage(err, 'Failed to void invoice')
      set({ savingBilling: false, billingError: message })
      return message
    }
  },

  markInvoicePaid: async (id) => {
    const client = useClientStore.getState().client
    if (!client) return 'Not connected'
    set({ savingBilling: true, billingError: null })
    try {
      await client.request(MARK_INVOICE_PAID, { id })
      await get().fetchSubscriptions()
      set({ savingBilling: false })
      return null
    } catch (err) {
      const message = gqlErrorMessage(err, 'Failed to record payment')
      set({ savingBilling: false, billingError: message })
      return message
    }
  },

  setBillingError: (error) => set({ billingError: error }),
}))
