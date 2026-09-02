'use client'

import { useEffect, useMemo, useState } from 'react'
import { useClientStore } from '@/stores/clientStore'
import { confirmDialog } from '@/stores/confirmStore'
import {
  useAdminStore,
  useBillingAdminStore,
  SUBSCRIPTION_STATUS_CONFIG,
  INVOICE_STATUS_CONFIG,
  type Subscription,
  type SubscriptionInvoice,
  type SubscriptionStatus,
} from '@/stores/adminStore'
import type { BillingInterval, SubscriptionTier } from '@/stores/onboardingStore'
import * as S from '../requests/page.styled'

const TIERS: SubscriptionTier[] = ['SOLO', 'STUDIO', 'AGENCY', 'ENTERPRISE']
const INTERVALS: BillingInterval[] = ['MONTHLY', 'QUARTERLY', 'SEMIANNUAL', 'ANNUAL']
const STATUSES: SubscriptionStatus[] = [
  'TRIALING',
  'ACTIVE',
  'PAST_DUE',
  'SUSPENDED',
  'CANCELLED',
]

function money(amount: number, currency: string): string {
  return `${currency} ${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function dateLabel(iso: string | null): string {
  return iso ? new Date(iso).toLocaleDateString() : '—'
}

// ── Drawer ──────────────────────────────────────────────────────

function SubscriptionDrawer({
  subscription,
  onClose,
}: {
  subscription: Subscription
  onClose: () => void
}) {
  const {
    updateSubscription, createInvoice, sendInvoice, voidInvoice, markInvoicePaid,
    savingBilling,
  } = useBillingAdminStore()

  const [tier, setTier] = useState<SubscriptionTier>(subscription.tier)
  const [interval, setIntervalChoice] = useState<BillingInterval>(subscription.billingInterval)
  const [status, setStatus] = useState<SubscriptionStatus>(subscription.status)
  const [amount, setAmount] = useState(String(subscription.amountPerPeriod))
  const [trialEndsAt, setTrialEndsAt] = useState(
    subscription.trialEndsAt ? subscription.trialEndsAt.slice(0, 10) : '',
  )
  const [notes, setNotes] = useState(subscription.notes ?? '')

  const meta = SUBSCRIPTION_STATUS_CONFIG[subscription.status]
  const overSeats =
    subscription.seatLimit != null && subscription.seatsUsed > subscription.seatLimit

  async function handleSave() {
    const parsed = parseFloat(amount)
    await updateSubscription(subscription.operatorId, {
      tier,
      billingInterval: interval,
      status,
      amountPerPeriod: Number.isNaN(parsed) ? undefined : parsed,
      trialEndsAt: trialEndsAt || null,
      notes,
    })
  }

  async function handleToggleAutoRenew() {
    const next = !subscription.autoRenew
    if (!next) {
      const ok = await confirmDialog({
        title: 'Turn off auto-renewal?',
        message:
          'No further invoices will be raised for this operator. Use this when someone ' +
          'has stopped paying, so the queue does not fill with invoices nobody will settle.',
        confirmLabel: 'Turn off',
        danger: true,
      })
      if (!ok) return
    }
    await updateSubscription(subscription.operatorId, { autoRenew: next })
  }

  async function handleCreateInvoice() {
    const ok = await confirmDialog({
      title: 'Raise a draft invoice?',
      message: `A draft invoice for ${money(
        subscription.amountPerPeriod,
        subscription.currency,
      )} will be created. Nothing is emailed until you send it.`,
      confirmLabel: 'Create draft',
    })
    if (ok) await createInvoice(subscription.id)
  }

  async function handleSend(invoice: SubscriptionInvoice) {
    const ok = await confirmDialog({
      title: 'Send this invoice?',
      message: `Invoice ${invoice.number} will be emailed with a payment link.`,
      confirmLabel: 'Send',
    })
    if (ok) await sendInvoice(invoice.id)
  }

  async function handleMarkPaid(invoice: SubscriptionInvoice) {
    const ok = await confirmDialog({
      title: 'Record payment received?',
      message:
        `Mark ${invoice.number} (${money(invoice.amountDue, invoice.currency)}) as paid ` +
        'outside Veldt — a bank transfer, say. This extends the subscription period and ' +
        'lifts any suspension.',
      confirmLabel: 'Mark as paid',
    })
    if (ok) await markInvoicePaid(invoice.id)
  }

  async function handleVoid(invoice: SubscriptionInvoice) {
    const ok = await confirmDialog({
      title: 'Void this invoice?',
      message: `${invoice.number} will be cancelled and its payment link stops working.`,
      confirmLabel: 'Void',
      danger: true,
    })
    if (ok) await voidInvoice(invoice.id)
  }

  return (
    <S.Overlay onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <S.Drawer>
        <S.DrawerHeader>
          <div>
            <S.DrawerTitle>{subscription.operatorName}</S.DrawerTitle>
            <S.DrawerMeta>
              {subscription.operatorSlug} · since {dateLabel(subscription.createdAt)}
            </S.DrawerMeta>
          </div>
          <S.DrawerClose onClick={onClose}>✕</S.DrawerClose>
        </S.DrawerHeader>

        <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <S.StatusChip $color={meta.color} $bg={meta.bg}>{meta.label}</S.StatusChip>
          {!subscription.autoRenew && (
            <S.StatusChip $color="#8a6d1d" $bg="#f7edd8">Auto-renew off</S.StatusChip>
          )}
        </div>

        <S.Section>
          <S.SectionTitle>Current state</S.SectionTitle>
          <S.DetailRow>
            <div>Seats</div>
            <S.DetailValue>
              {subscription.seatsUsed} of{' '}
              {subscription.seatLimit == null ? 'unlimited' : subscription.seatLimit}
            </S.DetailValue>
          </S.DetailRow>
          <S.DetailRow>
            <div>Period ends</div>
            <S.DetailValue>{dateLabel(subscription.currentPeriodEnd)}</S.DetailValue>
          </S.DetailRow>
          {subscription.trialEndsAt && (
            <S.DetailRow>
              <div>Trial until</div>
              <S.DetailValue>{dateLabel(subscription.trialEndsAt)}</S.DetailValue>
            </S.DetailRow>
          )}
          {subscription.gracePeriodEndsAt && (
            <S.DetailRow>
              <div>Grace ends</div>
              <S.DetailValue>{dateLabel(subscription.gracePeriodEndsAt)}</S.DetailValue>
            </S.DetailRow>
          )}
        </S.Section>

        {overSeats && (
          <S.Section>
            <S.Callout style={{ background: '#fbe9e9', borderColor: '#f3c6c6', color: '#b91c1c' }}>
              This operator has more members than their plan allows. They cannot add anyone
              new, but existing members keep working.
            </S.Callout>
          </S.Section>
        )}

        <S.Section>
          <S.SectionTitle>Plan</S.SectionTitle>
          <S.FieldGrid>
            <S.Field>
              <S.Label>Tier</S.Label>
              <S.Select value={tier} onChange={(e) => setTier(e.target.value as SubscriptionTier)}>
                {TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
              </S.Select>
            </S.Field>
            <S.Field>
              <S.Label>Interval</S.Label>
              <S.Select
                value={interval}
                onChange={(e) => setIntervalChoice(e.target.value as BillingInterval)}
              >
                {INTERVALS.map((i) => <option key={i} value={i}>{i}</option>)}
              </S.Select>
            </S.Field>
            <S.Field>
              <S.Label>Amount per period</S.Label>
              <S.Input
                type="number"
                min={0}
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </S.Field>
            <S.Field>
              <S.Label>Status</S.Label>
              <S.Select
                value={status}
                onChange={(e) => setStatus(e.target.value as SubscriptionStatus)}
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </S.Select>
            </S.Field>
            <S.FullRow>
              <S.Field>
                <S.Label>Trial until (blank for none)</S.Label>
                <S.Input
                  type="date"
                  value={trialEndsAt}
                  onChange={(e) => setTrialEndsAt(e.target.value)}
                />
              </S.Field>
            </S.FullRow>
            <S.FullRow>
              <S.Field>
                <S.Label>Internal notes</S.Label>
                <S.Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
              </S.Field>
            </S.FullRow>
          </S.FieldGrid>
          <S.Actions>
            <S.PrimaryButton $disabled={savingBilling} onClick={handleSave}>
              {savingBilling ? 'Saving…' : 'Save changes'}
            </S.PrimaryButton>
            <S.LinkAction onClick={handleToggleAutoRenew}>
              {subscription.autoRenew ? 'Turn off auto-renew' : 'Turn on auto-renew'}
            </S.LinkAction>
          </S.Actions>
        </S.Section>

        <S.Section>
          <S.SectionTitle>Invoices</S.SectionTitle>
          {subscription.invoices.length === 0 ? (
            <S.Hint>No invoices raised yet.</S.Hint>
          ) : (
            subscription.invoices.map((invoice) => {
              const invoiceMeta = INVOICE_STATUS_CONFIG[invoice.status]
              const settled = invoice.status === 'PAID' || invoice.status === 'VOID'
              return (
                <S.InvoiceRow key={invoice.id}>
                  <S.InvoiceMain>
                    <S.InvoiceNumber>{invoice.number}</S.InvoiceNumber>
                    <S.InvoiceMeta>
                      {dateLabel(invoice.periodStart)} – {dateLabel(invoice.periodEnd)} · due{' '}
                      {dateLabel(invoice.dueDate)}
                      {invoice.paidAt && ` · paid ${dateLabel(invoice.paidAt)}`}
                      {invoice.paymentMethod && ` (${invoice.paymentMethod.toLowerCase()})`}
                    </S.InvoiceMeta>
                  </S.InvoiceMain>
                  <S.InvoiceAmount>
                    {money(invoice.amountDue, invoice.currency)}
                  </S.InvoiceAmount>
                  <S.InvoiceActions>
                    <S.StatusChip $color={invoiceMeta.color} $bg={invoiceMeta.bg}>
                      {invoiceMeta.label}
                    </S.StatusChip>
                    {!settled && (
                      <>
                        {invoice.status === 'DRAFT' && (
                          <S.LinkAction onClick={() => handleSend(invoice)}>Send</S.LinkAction>
                        )}
                        <S.LinkAction onClick={() => handleMarkPaid(invoice)}>
                          Mark paid
                        </S.LinkAction>
                        <S.LinkAction $danger onClick={() => handleVoid(invoice)}>
                          Void
                        </S.LinkAction>
                      </>
                    )}
                  </S.InvoiceActions>
                </S.InvoiceRow>
              )
            })
          )}
          <S.Actions>
            <S.PrimaryButton $disabled={savingBilling} onClick={handleCreateInvoice}>
              Raise draft invoice
            </S.PrimaryButton>
          </S.Actions>
        </S.Section>
      </S.Drawer>
    </S.Overlay>
  )
}

// ── Page ────────────────────────────────────────────────────────

export default function AdminOperatorsPage() {
  const client = useClientStore((s) => s.client)
  const isAdmin = useAdminStore((s) => s.isAdmin)
  const checkAdmin = useAdminStore((s) => s.checkAdmin)
  const {
    subscriptions, loadingSubs, billingError,
    fetchSubscriptions, setBillingError,
  } = useBillingAdminStore()

  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    if (client) checkAdmin()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client])

  useEffect(() => {
    if (isAdmin) fetchSubscriptions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin])

  const stats = useMemo(() => {
    const active = subscriptions.filter((s) => s.status === 'ACTIVE').length
    const attention = subscriptions.filter(
      (s) => s.status === 'PAST_DUE' || s.status === 'SUSPENDED',
    ).length
    return { active, attention }
  }, [subscriptions])

  const selected = subscriptions.find((s) => s.id === selectedId) ?? null

  if (isAdmin === false) {
    return (
      <S.PageRoot>
        <S.PageTitle>Operators</S.PageTitle>
        <S.DeniedState>This area is for Veldt staff only.</S.DeniedState>
      </S.PageRoot>
    )
  }

  return (
    <S.PageRoot>
      <S.PageHeaderRow>
        <div>
          <S.PageTitle>
            Operators
            <S.StaffBadge>Veldt staff</S.StaffBadge>
          </S.PageTitle>
          <S.PageSubtitle>
            {subscriptions.length} total · {stats.active} active · {stats.attention} need attention
          </S.PageSubtitle>
        </div>
      </S.PageHeaderRow>

      {billingError && (
        <S.ErrorBanner onClick={() => setBillingError(null)}>{billingError}</S.ErrorBanner>
      )}

      {isAdmin == null || loadingSubs ? (
        <S.LoadingMessage>Loading operators...</S.LoadingMessage>
      ) : subscriptions.length === 0 ? (
        <S.EmptyState>
          No operators yet. They appear here once an onboarding request is provisioned.
        </S.EmptyState>
      ) : (
        <S.TableWrapper>
          <S.Table>
            <thead>
              <tr>
                <S.Th>Operator</S.Th>
                <S.Th>Plan</S.Th>
                <S.Th>Status</S.Th>
                <S.Th>Seats</S.Th>
                <S.Th $right>Period ends</S.Th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((subscription) => {
                const meta = SUBSCRIPTION_STATUS_CONFIG[subscription.status]
                return (
                  <S.Tr key={subscription.id} onClick={() => setSelectedId(subscription.id)}>
                    <S.Td>
                      <S.CompanyName>{subscription.operatorName}</S.CompanyName>
                      <S.ContactLine>{subscription.operatorSlug}</S.ContactLine>
                    </S.Td>
                    <S.Td $muted>
                      {subscription.tier} ·{' '}
                      {money(subscription.amountPerPeriod, subscription.currency)}/
                      {subscription.billingInterval.toLowerCase()}
                    </S.Td>
                    <S.Td>
                      <S.StatusChip $color={meta.color} $bg={meta.bg}>
                        {meta.label}
                      </S.StatusChip>
                    </S.Td>
                    <S.Td $muted>
                      {subscription.seatsUsed}/
                      {subscription.seatLimit == null ? '∞' : subscription.seatLimit}
                    </S.Td>
                    <S.Td $right $muted>
                      {dateLabel(subscription.currentPeriodEnd)}
                    </S.Td>
                  </S.Tr>
                )
              })}
            </tbody>
          </S.Table>
        </S.TableWrapper>
      )}

      {selected && (
        <SubscriptionDrawer subscription={selected} onClose={() => setSelectedId(null)} />
      )}
    </S.PageRoot>
  )
}
