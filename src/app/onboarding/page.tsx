'use client'

import { useEffect, useState } from 'react'
import {
  useOnboardingStore,
  type BillingInterval,
  type SubscriptionTier,
} from '@/stores/onboardingStore'
import * as S from './page.styled'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function OnboardingRequestPage() {
  const {
    plans, intervals, loading, submitting, error, submittedEmail,
    fetchOptions, submit, setError,
  } = useOnboardingStore()

  const [form, setForm] = useState({
    companyName: '',
    country: '',
    website: '',
    contactFirstName: '',
    contactLastName: '',
    contactEmail: '',
    contactPhone: '',
    notes: '',
  })
  const [tier, setTier] = useState<SubscriptionTier | null>(null)
  const [interval, setIntervalChoice] = useState<BillingInterval | null>(null)

  useEffect(() => {
    fetchOptions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Default to the mid tier and monthly once options arrive
  useEffect(() => {
    if (!tier && plans.length > 0) setTier(plans[1]?.tier ?? plans[0].tier)
    if (!interval && intervals.length > 0) setIntervalChoice(intervals[0].interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plans, intervals])

  function setField(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  const complete =
    form.companyName.trim().length > 0 &&
    form.contactFirstName.trim().length > 0 &&
    form.contactLastName.trim().length > 0 &&
    EMAIL_PATTERN.test(form.contactEmail.trim()) &&
    tier != null &&
    interval != null

  async function handleSubmit() {
    if (!complete || submitting || !tier || !interval) return
    await submit({
      companyName: form.companyName.trim(),
      country: form.country.trim() || undefined,
      website: form.website.trim() || undefined,
      contactFirstName: form.contactFirstName.trim(),
      contactLastName: form.contactLastName.trim(),
      contactEmail: form.contactEmail.trim(),
      contactPhone: form.contactPhone.trim() || undefined,
      requestedTier: tier,
      requestedInterval: interval,
      notes: form.notes.trim() || undefined,
    })
  }

  // ── Confirmation ──────────────────────────────────────────────
  if (submittedEmail) {
    return (
      <S.Root>
        <S.Shell>
          <S.Card style={{ paddingTop: 36, paddingBottom: 36 }}>
            <S.SuccessMark>✓</S.SuccessMark>
            <S.CenteredTitle>Request received</S.CenteredTitle>
            <S.CenteredBody>
              Thanks — we&apos;ve sent a confirmation to{' '}
              <strong>{submittedEmail}</strong>.
            </S.CenteredBody>
            <S.StepList>
              <li>Our team reviews your request and confirms the details with you.</li>
              <li>We email your first invoice with a secure payment link.</li>
              <li>
                Once payment clears we set up your workspace and send an invitation to
                sign in.
              </li>
            </S.StepList>
          </S.Card>
        </S.Shell>
      </S.Root>
    )
  }

  // ── Form ──────────────────────────────────────────────────────
  return (
    <S.Root>
      <S.Shell>
        <S.Logo>Veldt</S.Logo>
        <S.Title>Request access</S.Title>
        <S.Intro>
          Veldt is set up for your team by our staff. Tell us about your operation and
          we&apos;ll be in touch to confirm the details and get you started.
        </S.Intro>

        {error && <S.ErrorBanner onClick={() => setError(null)}>{error}</S.ErrorBanner>}

        <S.Card>
          <S.SectionTitle>Your operation</S.SectionTitle>
          <S.Grid>
            <S.FullRow>
              <S.Field>
                <S.Label>Company name</S.Label>
                <S.Input
                  value={form.companyName}
                  onChange={(e) => setField('companyName', e.target.value)}
                  placeholder="Wild About Africa"
                />
              </S.Field>
            </S.FullRow>
            <S.Field>
              <S.Label>Country</S.Label>
              <S.Input
                value={form.country}
                onChange={(e) => setField('country', e.target.value)}
                placeholder="Kenya"
              />
            </S.Field>
            <S.Field>
              <S.Label>Website</S.Label>
              <S.Input
                value={form.website}
                onChange={(e) => setField('website', e.target.value)}
                placeholder="wildaboutafrica.com"
              />
            </S.Field>
          </S.Grid>
        </S.Card>

        <S.Card>
          <S.SectionTitle>Your details</S.SectionTitle>
          <S.Grid>
            <S.Field>
              <S.Label>First name</S.Label>
              <S.Input
                value={form.contactFirstName}
                onChange={(e) => setField('contactFirstName', e.target.value)}
              />
            </S.Field>
            <S.Field>
              <S.Label>Last name</S.Label>
              <S.Input
                value={form.contactLastName}
                onChange={(e) => setField('contactLastName', e.target.value)}
              />
            </S.Field>
            <S.Field>
              <S.Label>Email</S.Label>
              <S.Input
                type="email"
                value={form.contactEmail}
                onChange={(e) => setField('contactEmail', e.target.value)}
                placeholder="you@company.com"
              />
            </S.Field>
            <S.Field>
              <S.Label>Phone (optional)</S.Label>
              <S.Input
                value={form.contactPhone}
                onChange={(e) => setField('contactPhone', e.target.value)}
              />
            </S.Field>
          </S.Grid>
        </S.Card>

        <S.Card>
          <S.SectionTitle>Plan</S.SectionTitle>
          {loading ? (
            <S.FinePrint>Loading plans…</S.FinePrint>
          ) : (
            <S.PlanGrid>
              {plans.map((plan) => (
                <S.PlanCard
                  key={plan.tier}
                  type="button"
                  $active={tier === plan.tier}
                  onClick={() => setTier(plan.tier)}
                >
                  <S.PlanName $active={tier === plan.tier}>{plan.label}</S.PlanName>
                  <S.PlanSeats>
                    {plan.seatLimit == null
                      ? 'Unlimited seats'
                      : `${plan.seatLimit} ${plan.seatLimit === 1 ? 'seat' : 'seats'}`}
                  </S.PlanSeats>
                  <S.PlanDesc>{plan.description}</S.PlanDesc>
                </S.PlanCard>
              ))}
            </S.PlanGrid>
          )}

          <div style={{ height: 22 }} />
          <S.SectionTitle>Billing</S.SectionTitle>
          <S.IntervalRow>
            {intervals.map((option) => (
              <S.IntervalChip
                key={option.interval}
                type="button"
                $active={interval === option.interval}
                onClick={() => setIntervalChoice(option.interval)}
              >
                {option.label}
              </S.IntervalChip>
            ))}
          </S.IntervalRow>
          <S.FinePrint style={{ marginTop: 14 }}>
            We&apos;ll confirm pricing with you before invoicing — nothing is charged now.
          </S.FinePrint>
        </S.Card>

        <S.Card>
          <S.SectionTitle>Anything else?</S.SectionTitle>
          <S.Field>
            <S.Textarea
              value={form.notes}
              onChange={(e) => setField('notes', e.target.value)}
              placeholder="Team size, how many itineraries you produce, anything you'd like us to know…"
            />
          </S.Field>
        </S.Card>

        <S.Actions>
          <S.SubmitButton
            $disabled={!complete || submitting}
            onClick={handleSubmit}
          >
            {submitting ? 'Sending…' : 'Submit request'}
          </S.SubmitButton>
          <S.FinePrint>
            No account is created yet and no payment is taken.
          </S.FinePrint>
        </S.Actions>
      </S.Shell>
    </S.Root>
  )
}
