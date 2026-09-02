'use client'

import { useEffect } from 'react'
import { useClientStore } from '@/stores/clientStore'
import {
  useSubscriptionStore,
  type MySubscription,
} from '@/stores/subscriptionStore'
import * as S from './SubscriptionBanner.styled'

/**
 * Subscription state, shown across the dashboard.
 *
 * Without this a suspended operator only discovers the problem by clicking
 * Save and getting a raw API error — the server refuses the write, but nothing
 * explains why or how to fix it. This surfaces the state and, crucially, the
 * payment link that resolves it.
 *
 * Renders nothing while ACTIVE, so the healthy case costs no screen space.
 */

function money(amount: number, currency: string): string {
  return `${currency} ${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function daysUntil(iso: string): number {
  const target = new Date(iso).getTime()
  return Math.ceil((target - Date.now()) / (24 * 60 * 60 * 1000))
}

interface BannerContent {
  tone: S.BannerTone
  message: React.ReactNode
  actionLabel?: string
  actionHref?: string
}

function bannerFor(subscription: MySubscription): BannerContent | null {
  const invoice = subscription.outstandingInvoice
  const payHref = invoice?.payToken ? `/billing/pay/${invoice.payToken}` : undefined

  switch (subscription.status) {
    case 'ACTIVE':
      return null

    case 'TRIALING': {
      if (!subscription.trialEndsAt) return null
      const days = daysUntil(subscription.trialEndsAt)
      return {
        tone: days <= 3 ? 'warn' : 'info',
        message: (
          <>
            You&apos;re on a trial —{' '}
            <S.Strong>
              {days <= 0 ? 'ending today' : `${days} day${days === 1 ? '' : 's'} left`}
            </S.Strong>
            . Your Veldt contact will be in touch about continuing.
          </>
        ),
      }
    }

    case 'PAST_DUE': {
      const graceDays = subscription.gracePeriodEndsAt
        ? daysUntil(subscription.gracePeriodEndsAt)
        : null
      return {
        tone: 'warn',
        message: (
          <>
            {invoice ? (
              <>
                Invoice <S.Strong>{invoice.number}</S.Strong> for{' '}
                <S.Strong>{money(invoice.amountDue, invoice.currency)}</S.Strong> is
                outstanding.
              </>
            ) : (
              <>Your subscription payment is outstanding.</>
            )}
            {graceDays != null && graceDays > 0 && (
              <>
                {' '}
                Your workspace stays editable for{' '}
                <S.Strong>
                  {graceDays} more day{graceDays === 1 ? '' : 's'}
                </S.Strong>
                .
              </>
            )}
          </>
        ),
        actionLabel: payHref ? 'Pay invoice' : undefined,
        actionHref: payHref,
      }
    }

    case 'SUSPENDED':
      return {
        tone: 'danger',
        message: (
          <>
            Your workspace is <S.Strong>read-only</S.Strong> while payment is outstanding.
            Published itineraries and client payment links still work — settle the invoice
            to restore editing.
          </>
        ),
        actionLabel: payHref ? 'Pay invoice' : undefined,
        actionHref: payHref,
      }

    case 'CANCELLED':
      return {
        tone: 'danger',
        message: (
          <>
            This subscription has been cancelled and your workspace is{' '}
            <S.Strong>read-only</S.Strong>. Contact Veldt to reactivate.
          </>
        ),
      }
  }
}

export default function SubscriptionBanner() {
  const client = useClientStore((s) => s.client)
  const subscription = useSubscriptionStore((s) => s.subscription)
  const fetchSubscription = useSubscriptionStore((s) => s.fetchSubscription)

  useEffect(() => {
    if (client) fetchSubscription()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client])

  if (!subscription) return null

  const content = bannerFor(subscription)
  if (!content) return null

  return (
    <S.Bar $tone={content.tone}>
      <S.Message>{content.message}</S.Message>
      {content.actionHref && content.actionLabel && (
        <S.Action href={content.actionHref} $tone={content.tone}>
          {content.actionLabel}
        </S.Action>
      )}
    </S.Bar>
  )
}
