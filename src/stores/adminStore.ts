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
