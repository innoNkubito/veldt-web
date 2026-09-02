import { create } from 'zustand'
import { gql } from 'graphql-request'
import { useClientStore } from './clientStore'
import { gqlErrorMessage } from '@/lib/gql-error'
import type { BillingInterval, SubscriptionTier } from './onboardingStore'

/**
 * The operator's own view of their subscription.
 *
 * Drives the status banner and any seat-limit messaging. Distinct from
 * adminStore's billing slice, which is Veldt staff looking at everyone.
 */

export type SubscriptionStatus =
  | 'TRIALING'
  | 'ACTIVE'
  | 'PAST_DUE'
  | 'SUSPENDED'
  | 'CANCELLED'

export interface OutstandingInvoice {
  id: string
  number: string
  amountDue: number
  currency: string
  dueDate: string
  payToken: string | null
}

export interface MySubscription {
  tier: SubscriptionTier
  billingInterval: BillingInterval
  status: SubscriptionStatus
  seatLimit: number | null
  seatsUsed: number
  currentPeriodEnd: string | null
  trialEndsAt: string | null
  gracePeriodEndsAt: string | null
  outstandingInvoice: OutstandingInvoice | null
}

const MY_SUBSCRIPTION = gql`
  query MySubscription {
    mySubscription {
      tier
      billingInterval
      status
      seatLimit
      seatsUsed
      currentPeriodEnd
      trialEndsAt
      gracePeriodEndsAt
      outstandingInvoice {
        id
        number
        amountDue
        currency
        dueDate
        payToken
      }
    }
  }
`

/** True when the operator can still create and edit. */
export function canWrite(subscription: MySubscription | null): boolean {
  if (!subscription) return false
  return ['TRIALING', 'ACTIVE', 'PAST_DUE'].includes(subscription.status)
}

interface SubscriptionState {
  subscription: MySubscription | null
  loading: boolean
  error: string | null
  fetchSubscription: () => Promise<void>
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  subscription: null,
  loading: false,
  error: null,

  fetchSubscription: async () => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ loading: true, error: null })
    try {
      const data = await client.request<{ mySubscription: MySubscription | null }>(
        MY_SUBSCRIPTION,
      )
      set({ subscription: data.mySubscription, loading: false })
    } catch (err) {
      set({ loading: false, error: gqlErrorMessage(err, 'Could not load subscription') })
    }
  },
}))
