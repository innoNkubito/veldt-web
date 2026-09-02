'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { usePublicBookingStore } from '@/stores/publicBookingStore'
import * as S from './page.styled'
import { routeParam } from '@/lib/guards'

function money(amount: number, currency: string): string {
  return `${currency} ${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function PayPageInner() {
  const params = useParams()
  const searchParams = useSearchParams()
  const token = routeParam(params?.token)

  const returned = searchParams.get('returned') === '1'
  const cancelled = searchParams.get('cancelled') === '1'

  const {
    installment, loading, paying, error,
    fetchInstallment, startPayment, checkPayment, setError,
  } = usePublicBookingStore()

  const [verifying, setVerifying] = useState(returned)
  const [verifyMessage, setVerifyMessage] = useState<string | null>(null)
  const verifiedRef = useRef(false)

  useEffect(() => {
    if (token) fetchInstallment(token)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  // On return from the processor, ask the server to verify. The redirect
  // itself proves nothing — the server re-checks with the provider.
  useEffect(() => {
    if (!returned || !token || verifiedRef.current) return
    verifiedRef.current = true

    async function verify() {
      setVerifying(true)
      const result = await checkPayment(token)
      setVerifying(false)

      if (!result) return
      if (result.outcome === 'PENDING') {
        setVerifyMessage(
          "We haven't received confirmation from your bank yet. This can take a few minutes — " +
            'refresh this page shortly, or check your email for the receipt.',
        )
      } else if (result.outcome === 'FAILED') {
        setVerifyMessage(result.message ?? 'That payment did not go through. You can try again.')
      } else if (result.outcome === 'AMOUNT_MISMATCH') {
        setVerifyMessage(result.message ?? 'There was a problem with the amount paid.')
      }
    }
    verify()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returned, token])

  async function handlePay() {
    setError(null)
    const redirectUrl = await startPayment(token)
    if (redirectUrl) window.location.href = redirectUrl
  }

  // ── States ────────────────────────────────────────────────────

  if (loading && !installment) {
    return <S.CenteredState>Loading your payment…</S.CenteredState>
  }

  if (!installment) {
    return (
      <S.CenteredState>
        <div style={{ fontSize: 17, fontWeight: 500 }}>Payment link not found</div>
        <div>This link may have expired, or the booking was cancelled.</div>
      </S.CenteredState>
    )
  }

  const total = installment.amountDue + installment.surchargeAmount
  const isPaid = installment.status === 'PAID'
  const isVoid = installment.status === 'VOID'

  // ── Paid ──────────────────────────────────────────────────────
  if (isPaid) {
    return (
      <S.PageRoot>
        <S.Card>
          <S.StatusMark $tone="success">✓</S.StatusMark>
          <S.Title style={{ textAlign: 'center' }}>Payment received</S.Title>
          <S.CenteredText>
            Thank you, {installment.clientName.split(' ')[0]}. We&apos;ve recorded your payment of{' '}
            <strong>{money(total, installment.currency)}</strong> for {installment.description}.
            <br />
            <br />
            Booking reference <strong>{installment.bookingReference}</strong>
          </S.CenteredText>
        </S.Card>
      </S.PageRoot>
    )
  }

  // ── Void ──────────────────────────────────────────────────────
  if (isVoid) {
    return (
      <S.PageRoot>
        <S.Card>
          <S.StatusMark $tone="neutral">—</S.StatusMark>
          <S.Title style={{ textAlign: 'center' }}>No longer due</S.Title>
          <S.CenteredText>
            This payment is no longer required. Please contact your travel advisor if you have
            any questions.
          </S.CenteredText>
        </S.Card>
      </S.PageRoot>
    )
  }

  // ── Payable ───────────────────────────────────────────────────
  return (
    <S.PageRoot>
      <S.Card>
        <S.Eyebrow>{installment.bookingReference}</S.Eyebrow>
        <S.Title>{installment.proposalTitle}</S.Title>
        <S.Subtitle>
          {installment.description} · due{' '}
          {new Date(installment.dueDate).toLocaleDateString()}
        </S.Subtitle>

        {verifying && <S.Banner $tone="info">Confirming your payment…</S.Banner>}
        {verifyMessage && <S.Banner $tone="info">{verifyMessage}</S.Banner>}
        {cancelled && !verifyMessage && (
          <S.Banner $tone="info">
            Your payment was cancelled — nothing has been charged. You can try again below.
          </S.Banner>
        )}
        {error && <S.Banner $tone="error">{error}</S.Banner>}

        <S.AmountBlock>
          <S.AmountValue>{money(total, installment.currency)}</S.AmountValue>
          <S.AmountLabel>Amount due now</S.AmountLabel>
        </S.AmountBlock>

        {installment.surchargeAmount > 0 && (
          <div>
            <S.BreakdownRow>
              <div>{installment.description}</div>
              <div>{money(installment.amountDue, installment.currency)}</div>
            </S.BreakdownRow>
            <S.BreakdownRow>
              <div>Card processing fee</div>
              <div>{money(installment.surchargeAmount, installment.currency)}</div>
            </S.BreakdownRow>
            <S.BreakdownRow $strong>
              <div>Total</div>
              <div>{money(total, installment.currency)}</div>
            </S.BreakdownRow>
          </div>
        )}

        {installment.payableOnline ? (
          <>
            <S.PayButton
              $disabled={paying || verifying}
              onClick={() => !paying && !verifying && handlePay()}
            >
              {paying ? 'Redirecting…' : 'Pay securely'}
            </S.PayButton>
            <S.SecureNote>
              You&apos;ll be taken to our payment provider to complete this payment.
              <br />
              Your card details are never stored by Veldt.
            </S.SecureNote>
          </>
        ) : (
          <S.Banner $tone="info" style={{ marginTop: 22, marginBottom: 0 }}>
            Online payment isn&apos;t available for this booking. Please contact your travel
            advisor to arrange payment.
          </S.Banner>
        )}
      </S.Card>
    </S.PageRoot>
  )
}

export default function PayPage() {
  // useSearchParams requires a Suspense boundary
  return (
    <Suspense fallback={<S.CenteredState>Loading…</S.CenteredState>}>
      <PayPageInner />
    </Suspense>
  )
}
