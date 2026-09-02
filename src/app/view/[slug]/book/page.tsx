'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  usePublicBookingStore,
  estimateTotal,
  previewInstallments,
  type CartLine,
  type PublicBookingResult,
} from '@/stores/publicBookingStore'
import * as S from './page.styled'
import { routeParam } from '@/lib/guards'

type Step = 'packages' | 'addons' | 'details' | 'review'

const STEPS: { key: Step; label: string }[] = [
  { key: 'packages', label: 'Choose your package' },
  { key: 'addons', label: 'Optional extras' },
  { key: 'details', label: 'Your details' },
  { key: 'review', label: 'Review & confirm' },
]

function money(amount: number, currency: string): string {
  return `${currency} ${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

// ── Confirmation ────────────────────────────────────────────────

function Confirmation({
  result,
  currency,
  onViewItinerary,
}: {
  result: PublicBookingResult
  currency: string
  onViewItinerary: () => void
}) {
  const isRequest = result.flowType === 'REQUEST'

  return (
    <S.Card>
      <S.SuccessMark>✓</S.SuccessMark>
      <S.ConfirmTitle>
        {isRequest ? 'Request received' : 'Booking confirmed'}
      </S.ConfirmTitle>
      <S.ConfirmBody>
        {isRequest ? (
          <>
            Thank you — your travel advisor will review your request and be in touch
            shortly with confirmation and payment details.
          </>
        ) : (
          <>
            Thank you — your booking is reserved. We&apos;ve emailed your confirmation and
            payment schedule.
          </>
        )}
      </S.ConfirmBody>

      <div style={{ textAlign: 'center', marginBottom: 26 }}>
        <S.ReferenceChip>{result.reference}</S.ReferenceChip>
      </div>

      <S.CardTitle>Payment schedule</S.CardTitle>
      <div style={{ marginTop: 12 }}>
        {result.installments.map((installment) => (
          <S.ScheduleRow key={installment.sequence}>
            <div>
              {installment.description}
              <S.ScheduleDue>
                {new Date(installment.dueDate).toLocaleDateString()}
              </S.ScheduleDue>
            </div>
            <div style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
              {money(installment.amountDue, currency)}
            </div>
          </S.ScheduleRow>
        ))}
        <S.SummaryRow $strong>
          <div>Total</div>
          <div>{money(result.total, currency)}</div>
        </S.SummaryRow>
      </div>

      {result.firstPayToken && (
        <S.Actions>
          <S.PrimaryButton
            onClick={() => {
              window.location.href = `/pay/${result.firstPayToken}`
            }}
          >
            Pay first installment →
          </S.PrimaryButton>
        </S.Actions>
      )}
      {!result.firstPayToken && (
        <S.Actions>
          <S.SecondaryButton onClick={onViewItinerary}>Back to itinerary</S.SecondaryButton>
        </S.Actions>
      )}
    </S.Card>
  )
}

// ── Page ────────────────────────────────────────────────────────

export default function BookingCheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const slug = routeParam(params?.slug)

  const { options, loading, submitting, error, result, fetchOptions, submitBooking, setError } =
    usePublicBookingStore()

  const [step, setStep] = useState<Step>('packages')
  const [cart, setCart] = useState<CartLine[]>([])
  const [addonIds, setAddonIds] = useState<string[]>([])
  const [details, setDetails] = useState({ name: '', email: '', phone: '', note: '' })
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  useEffect(() => {
    if (slug) fetchOptions(slug)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  const { guestCount, subtotal } = useMemo(
    () =>
      options
        ? estimateTotal(cart, addonIds, options.packages, options.addons)
        : { guestCount: 0, subtotal: 0 },
    [cart, addonIds, options],
  )

  const schedule = useMemo(
    () => (options ? previewInstallments(options.schedulePreview, subtotal) : []),
    [options, subtotal],
  )

  // ── Cart ──────────────────────────────────────────────────────

  function quantityFor(packageId: string): number {
    return cart.find((line) => line.packageId === packageId)?.quantity ?? 0
  }

  function adjust(packageId: string, delta: number, max: number) {
    setCart((prev) => {
      const current = prev.find((line) => line.packageId === packageId)?.quantity ?? 0
      const next = Math.max(0, Math.min(max, current + delta))
      if (next === 0) return prev.filter((line) => line.packageId !== packageId)
      if (current === 0) return [...prev, { packageId, quantity: next }]
      return prev.map((line) => (line.packageId === packageId ? { ...line, quantity: next } : line))
    })
  }

  // ── Submit ────────────────────────────────────────────────────

  async function handleSubmit() {
    if (!options) return
    const booking = await submitBooking(slug, {
      packages: cart,
      addonIds,
      clientName: details.name.trim(),
      clientEmail: details.email.trim(),
      clientPhone: details.phone.trim() || undefined,
      clientNote: details.note.trim() || undefined,
      acceptedTerms,
    })
    // INSTANT bookings go straight to payment
    if (booking?.firstPayToken) {
      router.push(`/pay/${booking.firstPayToken}`)
    }
  }

  // ── Guards ────────────────────────────────────────────────────

  if (loading) {
    return (
      <S.PageRoot>
        <S.CenteredState>Loading booking options…</S.CenteredState>
      </S.PageRoot>
    )
  }

  if (!options || options.bookingMode !== 'VELDT') {
    return (
      <S.PageRoot>
        <S.CenteredState>
          <div>This itinerary isn&apos;t available for online booking.</div>
          <S.SecondaryButton onClick={() => router.push(`/view/${slug}`)}>
            Back to itinerary
          </S.SecondaryButton>
        </S.CenteredState>
      </S.PageRoot>
    )
  }

  if (result) {
    return (
      <S.PageRoot>
        <S.Shell>
          <Confirmation
            result={result}
            currency={options.currency}
            onViewItinerary={() => router.push(`/view/${slug}`)}
          />
        </S.Shell>
      </S.PageRoot>
    )
  }

  const stepIndex = STEPS.findIndex((s) => s.key === step)
  const canContinue =
    step === 'packages'
      ? cart.length > 0
      : step === 'details'
        ? details.name.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim())
        : true
  const canSubmit = !options.termsAndConditions || acceptedTerms

  return (
    <S.PageRoot>
      <S.Shell>
        <S.BackLink
          onClick={() =>
            stepIndex === 0
              ? router.push(`/view/${slug}`)
              : setStep(STEPS[stepIndex - 1].key)
          }
        >
          ← {stepIndex === 0 ? 'Back to itinerary' : STEPS[stepIndex - 1].label}
        </S.BackLink>

        <S.Title>{options.proposalTitle}</S.Title>
        <S.Subtitle>
          {options.flowType === 'REQUEST'
            ? 'Submit a booking request — your advisor will confirm availability.'
            : 'Reserve your place and pay the first installment.'}
        </S.Subtitle>

        <S.StepBar>
          {STEPS.map((s, index) => (
            <S.StepPip
              key={s.key}
              $state={index < stepIndex ? 'done' : index === stepIndex ? 'active' : 'todo'}
            />
          ))}
        </S.StepBar>
        <S.StepLabel>
          Step {stepIndex + 1} of {STEPS.length} · {STEPS[stepIndex].label}
        </S.StepLabel>

        {error && <S.ErrorBanner onClick={() => setError(null)}>{error}</S.ErrorBanner>}

        {/* ── Packages ──────────────────────────────────────── */}
        {step === 'packages' && (
          <S.Card>
            <S.CardTitle>Choose your package</S.CardTitle>
            <S.CardHint>
              You can combine packages — the number of guests is worked out from what you select.
            </S.CardHint>

            {options.packages.length === 0 && (
              <S.CardHint>No packages are currently available for this itinerary.</S.CardHint>
            )}

            {options.packages.map((pkg) => {
              const quantity = quantityFor(pkg.id)
              const soldOut = pkg.remaining <= 0
              return (
                <S.OptionRow key={pkg.id} $selected={quantity > 0} $disabled={soldOut}>
                  <S.OptionMain>
                    <S.OptionName>
                      {pkg.name}
                      {soldOut && <S.SoldOutTag>Sold out</S.SoldOutTag>}
                    </S.OptionName>
                    {pkg.description && <S.OptionDesc>{pkg.description}</S.OptionDesc>}
                    <S.OptionMeta>
                      {pkg.peopleIncluded} {pkg.peopleIncluded === 1 ? 'guest' : 'guests'}
                      {!soldOut && ` · ${pkg.remaining} available`}
                    </S.OptionMeta>
                  </S.OptionMain>

                  <S.OptionPrice>
                    <S.PriceAmount>{money(pkg.price, options.currency)}</S.PriceAmount>
                    <S.PriceUnit>per package</S.PriceUnit>
                  </S.OptionPrice>

                  <S.Stepper>
                    <S.StepperButton
                      $disabled={quantity === 0}
                      disabled={quantity === 0}
                      onClick={() => adjust(pkg.id, -1, pkg.remaining)}
                    >
                      −
                    </S.StepperButton>
                    <S.StepperValue>{quantity}</S.StepperValue>
                    <S.StepperButton
                      $disabled={soldOut || quantity >= pkg.remaining}
                      disabled={soldOut || quantity >= pkg.remaining}
                      onClick={() => adjust(pkg.id, 1, pkg.remaining)}
                    >
                      +
                    </S.StepperButton>
                  </S.Stepper>
                </S.OptionRow>
              )
            })}

            {guestCount > 0 && (
              <S.SummaryRow $strong>
                <div>
                  {guestCount} {guestCount === 1 ? 'guest' : 'guests'}
                </div>
                <div>{money(subtotal, options.currency)}</div>
              </S.SummaryRow>
            )}

            <S.Actions>
              <S.PrimaryButton
                $disabled={!canContinue}
                onClick={() =>
                  canContinue && setStep(options.addons.length > 0 ? 'addons' : 'details')
                }
              >
                Continue
              </S.PrimaryButton>
            </S.Actions>
          </S.Card>
        )}

        {/* ── Add-ons ───────────────────────────────────────── */}
        {step === 'addons' && (
          <S.Card>
            <S.CardTitle>Optional extras</S.CardTitle>
            <S.CardHint>
              Priced per guest and applied to all {guestCount}{' '}
              {guestCount === 1 ? 'guest' : 'guests'} in your party.
            </S.CardHint>

            {options.addons.map((addon) => {
              const selected = addonIds.includes(addon.id)
              const covered =
                addon.limitCount != null ? Math.min(guestCount, addon.limitCount) : guestCount
              return (
                <S.OptionRow key={addon.id} $selected={selected}>
                  <S.Checkbox
                    type="checkbox"
                    checked={selected}
                    onChange={(e) =>
                      setAddonIds((prev) =>
                        e.target.checked
                          ? [...prev, addon.id]
                          : prev.filter((id) => id !== addon.id),
                      )
                    }
                  />
                  <S.OptionMain>
                    <S.OptionName>{addon.name}</S.OptionName>
                    {addon.description && <S.OptionDesc>{addon.description}</S.OptionDesc>}
                    {addon.limitCount != null && addon.limitCount < guestCount && (
                      <S.OptionMeta>
                        Limited to {addon.limitCount} of your {guestCount} guests
                      </S.OptionMeta>
                    )}
                  </S.OptionMain>
                  <S.OptionPrice>
                    <S.PriceAmount>
                      {money(addon.perPersonPrice * covered, options.currency)}
                    </S.PriceAmount>
                    <S.PriceUnit>
                      {money(addon.perPersonPrice, options.currency)} × {covered}
                    </S.PriceUnit>
                  </S.OptionPrice>
                </S.OptionRow>
              )
            })}

            <S.SummaryRow $strong>
              <div>Subtotal</div>
              <div>{money(subtotal, options.currency)}</div>
            </S.SummaryRow>

            <S.Actions>
              <S.SecondaryButton onClick={() => setStep('packages')}>Back</S.SecondaryButton>
              <S.PrimaryButton onClick={() => setStep('details')}>Continue</S.PrimaryButton>
            </S.Actions>
          </S.Card>
        )}

        {/* ── Details ───────────────────────────────────────── */}
        {step === 'details' && (
          <S.Card>
            <S.CardTitle>Your details</S.CardTitle>
            <S.CardHint>We&apos;ll use these to confirm your booking.</S.CardHint>

            <S.FieldGrid>
              <S.Field>
                <S.FieldLabel>Full name</S.FieldLabel>
                <S.Input
                  value={details.name}
                  onChange={(e) => setDetails((d) => ({ ...d, name: e.target.value }))}
                  placeholder="Jane Wilson"
                />
              </S.Field>
              <S.Field>
                <S.FieldLabel>Email</S.FieldLabel>
                <S.Input
                  type="email"
                  value={details.email}
                  onChange={(e) => setDetails((d) => ({ ...d, email: e.target.value }))}
                  placeholder="jane@example.com"
                />
              </S.Field>
              <S.Field>
                <S.FieldLabel>Phone (optional)</S.FieldLabel>
                <S.Input
                  value={details.phone}
                  onChange={(e) => setDetails((d) => ({ ...d, phone: e.target.value }))}
                  placeholder="+1 555 000 0000"
                />
              </S.Field>
              <S.FullRow>
                <S.Field>
                  <S.FieldLabel>Anything we should know? (optional)</S.FieldLabel>
                  <S.Textarea
                    value={details.note}
                    onChange={(e) => setDetails((d) => ({ ...d, note: e.target.value }))}
                    placeholder="Dietary requirements, arrival times, special occasions…"
                  />
                </S.Field>
              </S.FullRow>
            </S.FieldGrid>

            <S.Actions>
              <S.SecondaryButton
                onClick={() => setStep(options.addons.length > 0 ? 'addons' : 'packages')}
              >
                Back
              </S.SecondaryButton>
              <S.PrimaryButton
                $disabled={!canContinue}
                onClick={() => canContinue && setStep('review')}
              >
                Continue
              </S.PrimaryButton>
            </S.Actions>
          </S.Card>
        )}

        {/* ── Review ────────────────────────────────────────── */}
        {step === 'review' && (
          <>
            <S.Card>
              <S.CardTitle>Your booking</S.CardTitle>
              <div style={{ marginTop: 14 }}>
                {cart.map((line) => {
                  const pkg = options.packages.find((p) => p.id === line.packageId)
                  if (!pkg) return null
                  return (
                    <S.SummaryRow key={line.packageId}>
                      <div>
                        {pkg.name} × {line.quantity}
                      </div>
                      <div>{money(pkg.price * line.quantity, options.currency)}</div>
                    </S.SummaryRow>
                  )
                })}
                {addonIds.map((addonId) => {
                  const addon = options.addons.find((a) => a.id === addonId)
                  if (!addon) return null
                  const covered =
                    addon.limitCount != null ? Math.min(guestCount, addon.limitCount) : guestCount
                  return (
                    <S.SummaryRow key={addonId}>
                      <div>
                        {addon.name} × {covered}
                      </div>
                      <div>{money(addon.perPersonPrice * covered, options.currency)}</div>
                    </S.SummaryRow>
                  )
                })}
                <S.SummaryRow $strong>
                  <div>
                    Total · {guestCount} {guestCount === 1 ? 'guest' : 'guests'}
                  </div>
                  <div>{money(subtotal, options.currency)}</div>
                </S.SummaryRow>
              </div>
            </S.Card>

            <S.Card>
              <S.CardTitle>Payment schedule</S.CardTitle>
              <S.CardHint>
                {options.flowType === 'REQUEST'
                  ? 'Payment is arranged once your advisor confirms the booking.'
                  : 'The first payment is taken now; later payments are due on the dates below.'}
              </S.CardHint>
              {schedule.map((installment, index) => (
                <S.ScheduleRow key={index}>
                  <div>
                    {installment.description}
                    <S.ScheduleDue>{installment.dueLabel}</S.ScheduleDue>
                  </div>
                  <div style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {money(installment.amount, options.currency)}
                  </div>
                </S.ScheduleRow>
              ))}
              {options.surchargePercent ? (
                <S.CardHint style={{ marginTop: 14, marginBottom: 0 }}>
                  A {options.surchargePercent}% surcharge applies to card payments and will be
                  shown before you pay.
                </S.CardHint>
              ) : null}
            </S.Card>

            {options.termsAndConditions && (
              <S.Card>
                <S.CardTitle>Terms &amp; conditions</S.CardTitle>
                <div style={{ height: 12 }} />
                <S.TermsBox
                  dangerouslySetInnerHTML={{ __html: options.termsAndConditions }}
                />
                <S.AcceptRow>
                  <S.Checkbox
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                  />
                  <span>I have read and accept the terms and conditions.</span>
                </S.AcceptRow>
              </S.Card>
            )}

            <S.Actions>
              <S.SecondaryButton onClick={() => setStep('details')}>Back</S.SecondaryButton>
              <S.PrimaryButton
                $disabled={submitting || !canSubmit}
                onClick={() => !submitting && canSubmit && handleSubmit()}
              >
                {submitting
                  ? 'Submitting…'
                  : options.flowType === 'REQUEST'
                    ? 'Submit request'
                    : 'Confirm & pay'}
              </S.PrimaryButton>
            </S.Actions>
          </>
        )}
      </S.Shell>
    </S.PageRoot>
  )
}
