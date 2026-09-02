'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { useInvoiceStore } from '@/stores/invoiceStore'
import * as S from './page.styled'

function money(amount: number, currency: string): string {
  return `${currency} ${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function dateLabel(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function InvoicePayInner() {
  const params = useParams()
  const searchParams = useSearchParams()
  const token = params?.token as string

  const returned = searchParams.get('returned') === '1'
  const cancelled = searchParams.get('cancelled') === '1'

  const { invoice, loading, paying, error, fetchInvoice, startPayment, checkPayment, setError } =
    useInvoiceStore()

  const [verifying, setVerifying] = useState(returned)
  const [verifyMessage, setVerifyMessage] = useState<string | null>(null)
  const verifiedRef = useRef(false)

  useEffect(() => {
    if (token) fetchInvoice(token)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  // Returning from the processor proves nothing — ask the server to verify
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
          "We haven't had confirmation from the bank yet. This can take a few minutes — " +
            'refresh shortly, or check your email for the receipt.',
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

  if (loading && !invoice) {
    return <S.CenteredState>Loading your invoice…</S.CenteredState>
  }

  if (!invoice) {
    return (
      <S.CenteredState>
        <div style={{ fontSize: 17, fontWeight: 500 }}>Invoice not found</div>
        <div>This link may have expired, or the invoice was cancelled.</div>
      </S.CenteredState>
    )
  }

  // ── Paid ──────────────────────────────────────────────────────
  if (invoice.status === 'PAID') {
    return (
      <S.PageRoot>
        <S.Card>
          <S.StatusMark $tone="success">✓</S.StatusMark>
          <S.Title style={{ textAlign: 'center' }}>Payment received</S.Title>
          <S.CenteredText>
            Thank you — invoice <strong>{invoice.number}</strong> is settled.
            <br />
            <br />
            {invoice.operatorName} is active on Veldt until{' '}
            <strong>{dateLabel(invoice.periodEnd)}</strong>.
          </S.CenteredText>
        </S.Card>
      </S.PageRoot>
    )
  }

  if (invoice.status === 'VOID') {
    return (
      <S.PageRoot>
        <S.Card>
          <S.StatusMark $tone="neutral">—</S.StatusMark>
          <S.Title style={{ textAlign: 'center' }}>No longer payable</S.Title>
          <S.CenteredText>
            This invoice has been cancelled. Please contact Veldt if you have any questions.
          </S.CenteredText>
        </S.Card>
      </S.PageRoot>
    )
  }

  const isOverdue = invoice.status === 'OVERDUE'

  return (
    <S.PageRoot>
      <S.Card>
        <S.Eyebrow>Invoice {invoice.number}</S.Eyebrow>
        <S.Title>{invoice.operatorName}</S.Title>
        <S.Subtitle>
          Veldt subscription · {dateLabel(invoice.periodStart)} –{' '}
          {dateLabel(invoice.periodEnd)}
        </S.Subtitle>

        {verifying && <S.Banner $tone="info">Confirming your payment…</S.Banner>}
        {verifyMessage && <S.Banner $tone="info">{verifyMessage}</S.Banner>}
        {cancelled && !verifyMessage && (
          <S.Banner $tone="info">
            Your payment was cancelled — nothing has been charged. You can try again below.
          </S.Banner>
        )}
        {isOverdue && !verifyMessage && (
          <S.Banner $tone="error">
            This invoice was due on {dateLabel(invoice.dueDate)}.
          </S.Banner>
        )}
        {error && <S.Banner $tone="error">{error}</S.Banner>}

        <S.AmountBlock>
          <S.AmountValue>{money(invoice.amountDue, invoice.currency)}</S.AmountValue>
          <S.AmountLabel>
            {isOverdue ? 'Overdue' : `Due ${dateLabel(invoice.dueDate)}`}
          </S.AmountLabel>
        </S.AmountBlock>

        {invoice.payableOnline ? (
          <>
            <S.PayButton
              $disabled={paying || verifying}
              onClick={() => !paying && !verifying && handlePay()}
            >
              {paying ? 'Redirecting…' : 'Pay invoice'}
            </S.PayButton>
            <S.SecureNote>
              You&apos;ll be taken to our payment provider to complete this payment.
              <br />
              Your card details are never stored by Veldt.
            </S.SecureNote>
          </>
        ) : (
          <S.Banner $tone="info" style={{ marginTop: 22, marginBottom: 0 }}>
            Online payment isn&apos;t available at the moment. Reply to your invoice email
            and we&apos;ll arrange payment with you directly.
          </S.Banner>
        )}
      </S.Card>
    </S.PageRoot>
  )
}

export default function InvoicePayPage() {
  // useSearchParams requires a Suspense boundary
  return (
    <Suspense fallback={<S.CenteredState>Loading…</S.CenteredState>}>
      <InvoicePayInner />
    </Suspense>
  )
}
