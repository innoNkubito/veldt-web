'use client'

import { useEffect, useMemo, useState } from 'react'
import { useClientStore } from '@/stores/clientStore'
import { confirmDialog } from '@/stores/confirmStore'
import {
  useAdminStore,
  REQUEST_STATUS_CONFIG,
  PIPELINE,
  type OnboardingRequest,
  type OnboardingRequestStatus,
} from '@/stores/adminStore'
import type { BillingInterval, SubscriptionTier } from '@/stores/onboardingStore'
import * as S from './page.styled'
import { recordFrom, parseOption } from '@/lib/guards'

type TabKey = 'OPEN' | 'SUBMITTED' | 'PROVISIONED' | 'REJECTED' | 'ALL'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'OPEN', label: 'Open' },
  { key: 'SUBMITTED', label: 'New' },
  { key: 'PROVISIONED', label: 'Provisioned' },
  { key: 'REJECTED', label: 'Rejected' },
  { key: 'ALL', label: 'All' },
]

const TIERS: SubscriptionTier[] = ['SOLO', 'STUDIO', 'AGENCY', 'ENTERPRISE']
const INTERVALS: BillingInterval[] = ['MONTHLY', 'QUARTERLY', 'SEMIANNUAL', 'ANNUAL']

function matchesTab(request: OnboardingRequest, tab: TabKey): boolean {
  switch (tab) {
    case 'OPEN':
      return !['PROVISIONED', 'REJECTED'].includes(request.status)
    case 'SUBMITTED':
      return request.status === 'SUBMITTED'
    case 'PROVISIONED':
      return request.status === 'PROVISIONED'
    case 'REJECTED':
      return request.status === 'REJECTED'
    case 'ALL':
      return true
  }
}

// ── Detail drawer ───────────────────────────────────────────────

function RequestDrawer({
  request,
  onClose,
}: {
  request: OnboardingRequest
  onClose: () => void
}) {
  const { setStatus, reject, provision, saving } = useAdminStore()

  const [slug, setSlug] = useState(request.proposedSlug)
  const [tier, setTier] = useState<SubscriptionTier>(request.requestedTier)
  const [interval, setIntervalChoice] = useState<BillingInterval>(request.requestedInterval)
  const [amount, setAmount] = useState('')
  const [trialEndsAt, setTrialEndsAt] = useState('')
  const [internalNotes, setInternalNotes] = useState(request.internalNotes ?? '')

  const meta = REQUEST_STATUS_CONFIG[request.status]
  const isClosed = request.status === 'PROVISIONED' || request.status === 'REJECTED'
  const currentStep = PIPELINE.indexOf(request.status)

  async function handleProvision() {
    const parsedAmount = parseFloat(amount)
    if (Number.isNaN(parsedAmount) || parsedAmount < 0) return

    const ok = await confirmDialog({
      title: 'Provision this operator?',
      message:
        `This creates the workspace for ${request.companyName} and emails an owner ` +
        `invitation to ${request.contactEmail}. Only do this once the first invoice is settled.`,
      confirmLabel: 'Provision',
    })
    if (!ok) return

    const result = await provision(request.id, {
      slug: slug.trim(),
      tier,
      billingInterval: interval,
      amountPerPeriod: parsedAmount,
      trialEndsAt: trialEndsAt || undefined,
    })
    if (result) onClose()
  }

  async function handleReject() {
    const ok = await confirmDialog({
      title: 'Reject this request?',
      message: `${request.contactEmail} will be emailed to let them know. This cannot be undone.`,
      confirmLabel: 'Reject',
      danger: true,
    })
    if (!ok) return
    await reject(request.id, internalNotes.trim() || undefined)
    onClose()
  }

  return (
    <S.Overlay onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <S.Drawer>
        <S.DrawerHeader>
          <div>
            <S.DrawerTitle>{request.companyName}</S.DrawerTitle>
            <S.DrawerMeta>
              Submitted {new Date(request.createdAt).toLocaleDateString()}
              {request.reviewedByName && ` · last actioned by ${request.reviewedByName}`}
            </S.DrawerMeta>
          </div>
          <S.DrawerClose onClick={onClose}>✕</S.DrawerClose>
        </S.DrawerHeader>

        <div style={{ marginTop: 14 }}>
          <S.StatusChip $color={meta.color} $bg={meta.bg}>
            {meta.label}
          </S.StatusChip>
        </div>

        <S.Section>
          <S.SectionTitle>Contact</S.SectionTitle>
          <S.DetailRow>
            <div>Name</div>
            <S.DetailValue>
              {request.contactFirstName} {request.contactLastName}
            </S.DetailValue>
          </S.DetailRow>
          <S.DetailRow>
            <div>Email</div>
            <S.DetailValue>{request.contactEmail}</S.DetailValue>
          </S.DetailRow>
          {request.contactPhone && (
            <S.DetailRow>
              <div>Phone</div>
              <S.DetailValue>{request.contactPhone}</S.DetailValue>
            </S.DetailRow>
          )}
          {request.country && (
            <S.DetailRow>
              <div>Country</div>
              <S.DetailValue>{request.country}</S.DetailValue>
            </S.DetailRow>
          )}
          {request.website && (
            <S.DetailRow>
              <div>Website</div>
              <S.DetailValue>{request.website}</S.DetailValue>
            </S.DetailRow>
          )}
          <S.DetailRow>
            <div>Requested</div>
            <S.DetailValue>
              {request.requestedTier} · {request.requestedInterval}
            </S.DetailValue>
          </S.DetailRow>
        </S.Section>

        {request.notes && (
          <S.Section>
            <S.SectionTitle>What they told us</S.SectionTitle>
            <S.NoteBox>{request.notes}</S.NoteBox>
          </S.Section>
        )}

        {request.status === 'PROVISIONED' ? (
          <S.Section>
            <S.SectionTitle>Provisioned</S.SectionTitle>
            <S.Callout>
              Workspace created — slug <strong>{request.proposedSlug}</strong>. An owner
              invitation was sent to {request.contactEmail}.
            </S.Callout>
          </S.Section>
        ) : request.status === 'REJECTED' ? (
          <S.Section>
            <S.SectionTitle>Rejected</S.SectionTitle>
            <S.NoteBox>{request.rejectionReason || 'No reason recorded.'}</S.NoteBox>
          </S.Section>
        ) : (
          <>
            <S.Section>
              <S.SectionTitle>Progress</S.SectionTitle>
              <S.PipelineRow>
                {PIPELINE.map((step, index) => (
                  <S.PipelineStep
                    key={step}
                    $state={
                      index < currentStep ? 'done' : index === currentStep ? 'current' : 'todo'
                    }
                    onClick={() => setStatus(request.id, step, internalNotes.trim() || undefined)}
                  >
                    {REQUEST_STATUS_CONFIG[step].label}
                  </S.PipelineStep>
                ))}
              </S.PipelineRow>
              <S.Hint>
                Move the request along as you confirm details and send the invoice. Provision
                only once payment has settled.
              </S.Hint>
            </S.Section>

            <S.Section>
              <S.SectionTitle>Internal notes</S.SectionTitle>
              <S.Textarea
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Anything the team should know — call outcomes, agreed pricing…"
                onBlur={() =>
                  internalNotes !== (request.internalNotes ?? '') &&
                  setStatus(request.id, request.status, internalNotes)
                }
              />
            </S.Section>

            <S.Section>
              <S.SectionTitle>Provision workspace</S.SectionTitle>
              <S.FieldGrid>
                <S.FullRow>
                  <S.Field>
                    <S.Label>Workspace slug</S.Label>
                    <S.Input value={slug} onChange={(e) => setSlug(e.target.value)} />
                  </S.Field>
                </S.FullRow>
                <S.Field>
                  <S.Label>Tier</S.Label>
                  <S.Select
                    value={tier}
                    onChange={(e) => setTier(parseOption(TIERS, e.target.value) ?? tier)}
                  >
                    {TIERS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </S.Select>
                </S.Field>
                <S.Field>
                  <S.Label>Billing interval</S.Label>
                  <S.Select
                    value={interval}
                    onChange={(e) => setIntervalChoice(parseOption(INTERVALS, e.target.value) ?? interval)}
                  >
                    {INTERVALS.map((i) => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </S.Select>
                </S.Field>
                <S.Field>
                  <S.Label>Amount per period (USD)</S.Label>
                  <S.Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 149.00"
                  />
                </S.Field>
                <S.Field>
                  <S.Label>Trial until (optional)</S.Label>
                  <S.Input
                    type="date"
                    value={trialEndsAt}
                    onChange={(e) => setTrialEndsAt(e.target.value)}
                  />
                </S.Field>
              </S.FieldGrid>
              <S.Hint>
                Leave the trial date empty to start the subscription active from today. Setting
                it grants access now and defers the first invoice.
              </S.Hint>
            </S.Section>

            <S.Actions>
              <S.PrimaryButton
                $disabled={saving || !amount || !slug.trim()}
                onClick={handleProvision}
              >
                {saving ? 'Working…' : 'Provision & invite owner'}
              </S.PrimaryButton>
              <S.DangerLink onClick={handleReject}>Reject request</S.DangerLink>
            </S.Actions>
          </>
        )}
      </S.Drawer>
    </S.Overlay>
  )
}

// ── Page ────────────────────────────────────────────────────────

export default function AdminRequestsPage() {
  const client = useClientStore((s) => s.client)
  const { isAdmin, requests, loading, error, checkAdmin, fetchRequests, setError } =
    useAdminStore()

  const [tab, setTab] = useState<TabKey>('OPEN')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    if (client) checkAdmin()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client])

  useEffect(() => {
    if (isAdmin) fetchRequests()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin])

  const counts = useMemo(
    () =>
      recordFrom(
        TABS.map((t) => t.key),
        (key) => requests.filter((r) => matchesTab(r, key)).length,
      ),
    [requests],
  )

  const displayed = useMemo(
    () => requests.filter((r) => matchesTab(r, tab)),
    [requests, tab],
  )

  const selected = requests.find((r) => r.id === selectedId) ?? null

  if (isAdmin === false) {
    return (
      <S.PageRoot>
        <S.PageTitle>Onboarding requests</S.PageTitle>
        <S.DeniedState>
          This area is for Veldt staff only.
          <br />
          If you need access, ask an existing platform administrator to add you.
        </S.DeniedState>
      </S.PageRoot>
    )
  }

  return (
    <S.PageRoot>
      <S.PageHeaderRow>
        <div>
          <S.PageTitle>
            Onboarding requests
            <S.StaffBadge>Veldt staff</S.StaffBadge>
          </S.PageTitle>
          <S.PageSubtitle>
            {counts.OPEN} open · {counts.SUBMITTED} awaiting first review
          </S.PageSubtitle>
        </div>
      </S.PageHeaderRow>

      {error && <S.ErrorBanner onClick={() => setError(null)}>{error}</S.ErrorBanner>}

      <S.TabBar>
        {TABS.map(({ key, label }) => (
          <S.Tab key={key} $active={tab === key} onClick={() => setTab(key)}>
            {label}
            <S.TabCount $active={tab === key}>{counts[key]}</S.TabCount>
          </S.Tab>
        ))}
      </S.TabBar>

      {isAdmin == null || loading ? (
        <S.LoadingMessage>Loading requests...</S.LoadingMessage>
      ) : displayed.length === 0 ? (
        <S.EmptyState>
          {requests.length === 0
            ? 'No onboarding requests yet. They appear here when someone submits the public form.'
            : 'No requests match this filter.'}
        </S.EmptyState>
      ) : (
        <S.TableWrapper>
          <S.Table>
            <thead>
              <tr>
                <S.Th>Company</S.Th>
                <S.Th>Requested plan</S.Th>
                <S.Th>Status</S.Th>
                <S.Th $right>Submitted</S.Th>
              </tr>
            </thead>
            <tbody>
              {displayed.map((request) => {
                const meta = REQUEST_STATUS_CONFIG[request.status]
                return (
                  <S.Tr key={request.id} onClick={() => setSelectedId(request.id)}>
                    <S.Td>
                      <S.CompanyName>{request.companyName}</S.CompanyName>
                      <S.ContactLine>
                        {request.contactFirstName} {request.contactLastName} ·{' '}
                        {request.contactEmail}
                      </S.ContactLine>
                    </S.Td>
                    <S.Td $muted>
                      {request.requestedTier} · {request.requestedInterval}
                    </S.Td>
                    <S.Td>
                      <S.StatusChip $color={meta.color} $bg={meta.bg}>
                        {meta.label}
                      </S.StatusChip>
                    </S.Td>
                    <S.Td $right $muted>
                      {new Date(request.createdAt).toLocaleDateString()}
                    </S.Td>
                  </S.Tr>
                )
              })}
            </tbody>
          </S.Table>
        </S.TableWrapper>
      )}

      {selected && (
        <RequestDrawer request={selected} onClose={() => setSelectedId(null)} />
      )}
    </S.PageRoot>
  )
}
