import { create } from 'zustand'
import { GraphQLClient, gql } from 'graphql-request'
import { gqlErrorMessage } from '@/lib/gql-error'

/**
 * Public onboarding request store.
 *
 * Unauthenticated by design — this is the front door for prospective
 * operators, before any Clerk account exists.
 */

export type SubscriptionTier = 'SOLO' | 'STUDIO' | 'AGENCY' | 'ENTERPRISE'
export type BillingInterval = 'MONTHLY' | 'QUARTERLY' | 'SEMIANNUAL' | 'ANNUAL'

export interface PlanOption {
  tier: SubscriptionTier
  label: string
  seatLimit: number | null
  description: string
}

export interface IntervalOption {
  interval: BillingInterval
  label: string
  months: number
}

export interface OnboardingRequestInput {
  companyName: string
  country?: string
  website?: string
  contactFirstName: string
  contactLastName: string
  contactEmail: string
  contactPhone?: string
  requestedTier: SubscriptionTier
  requestedInterval: BillingInterval
  notes?: string
}

const GET_OPTIONS = gql`
  query OnboardingOptions {
    planOptions { tier label seatLimit description }
    intervalOptions { interval label months }
  }
`

const SUBMIT_REQUEST = gql`
  mutation SubmitOnboardingRequest($input: OnboardingRequestInput!) {
    submitOnboardingRequest(input: $input) {
      received
      companyName
      contactEmail
    }
  }
`

function publicClient(): GraphQLClient | null {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  return apiUrl ? new GraphQLClient(apiUrl) : null
}

interface OnboardingState {
  plans: PlanOption[]
  intervals: IntervalOption[]
  loading: boolean
  submitting: boolean
  error: string | null
  submittedEmail: string | null

  fetchOptions: () => Promise<void>
  submit: (input: OnboardingRequestInput) => Promise<boolean>
  setError: (error: string | null) => void
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  plans: [],
  intervals: [],
  loading: false,
  submitting: false,
  error: null,
  submittedEmail: null,

  fetchOptions: async () => {
    const client = publicClient()
    if (!client) return
    set({ loading: true, error: null })
    try {
      const data = await client.request<{
        planOptions: PlanOption[]
        intervalOptions: IntervalOption[]
      }>(GET_OPTIONS)
      set({ plans: data.planOptions, intervals: data.intervalOptions, loading: false })
    } catch (err) {
      set({ loading: false, error: gqlErrorMessage(err, 'Could not load plan options') })
    }
  },

  submit: async (input) => {
    const client = publicClient()
    if (!client) return false
    set({ submitting: true, error: null })
    try {
      const data = await client.request<{
        submitOnboardingRequest: { received: boolean; contactEmail: string }
      }>(SUBMIT_REQUEST, { input })
      set({
        submitting: false,
        submittedEmail: data.submitOnboardingRequest.contactEmail,
      })
      return true
    } catch (err) {
      set({ submitting: false, error: gqlErrorMessage(err, 'Could not submit your request') })
      return false
    }
  },

  setError: (error) => set({ error }),
}))
