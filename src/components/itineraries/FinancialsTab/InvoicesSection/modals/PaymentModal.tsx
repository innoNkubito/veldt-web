'use client'

import { useState } from 'react'
import { ActionButton } from '@/components/itineraries/shared/ActionButton'
import { Field, FieldInput, FieldLabel, FieldSelect } from '@/components/itineraries/shared/FieldPrimitives'
import {
  formatMoney,
  type ClientInvoice,
  type ClientInvoicePaymentInput,
  type InvoicePaymentMethod,
} from '@/lib/invoices'
import { METHODS } from '../InvoicesSection.constants'
import { todayIso } from '../InvoicesSection.utils'
import * as S from '../InvoicesSection.styled'

interface Props {
  invoice: ClientInvoice
  busy: boolean
  onRecord: (input: ClientInvoicePaymentInput) => Promise<string | null>
  onClose: () => void
}

/** A payment received outside Veldt — a bank transfer, cash, a card terminal. */
export default function PaymentModal({ invoice, busy, onRecord, onClose }: Props) {
  const [amount, setAmount] = useState((invoice.nextDueAmount ?? invoice.amountDue).toFixed(2))
  const [paidAt, setPaidAt] = useState(todayIso())
  const [method, setMethod] = useState<InvoicePaymentMethod>('OFFLINE')
  const [reference, setReference] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function submit() {
    if (busy) return
    const value = Number(amount)
    if (!Number.isFinite(value) || value <= 0) return setError('Enter the amount received.')
    const message = await onRecord({
      amount: value,
      paidAt,
      method,
      reference: reference.trim() || null,
    })
    if (message) setError(message)
    else onClose()
  }

  return (
    <S.Overlay onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <S.ModalCard role="dialog" aria-modal="true" aria-labelledby="invoice-payment-title">
        <S.ModalTitle id="invoice-payment-title">Record a payment</S.ModalTitle>
        <S.ModalText>
          {formatMoney(invoice.amountDue, invoice.currency)} is still due on {invoice.number}.
        </S.ModalText>
        <S.Grid>
          <Field>
            <FieldLabel htmlFor="payment-amount">Amount ({invoice.currency})</FieldLabel>
            <FieldInput
              id="payment-amount"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="payment-date">Received on</FieldLabel>
            <FieldInput id="payment-date" type="date" value={paidAt} onChange={(e) => setPaidAt(e.target.value)} />
          </Field>
          <Field>
            <FieldLabel htmlFor="payment-method">Method</FieldLabel>
            <FieldSelect
              id="payment-method"
              value={method}
              onChange={(e) => setMethod(e.target.value as InvoicePaymentMethod)}
            >
              {METHODS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </FieldSelect>
          </Field>
          <Field>
            <FieldLabel htmlFor="payment-reference">Reference</FieldLabel>
            <FieldInput
              id="payment-reference"
              value={reference}
              maxLength={120}
              placeholder="Optional"
              onChange={(e) => setReference(e.target.value)}
            />
          </Field>
        </S.Grid>
        {error && <S.ModalError role="alert">{error}</S.ModalError>}
        <S.ModalActions>
          <ActionButton type="button" onClick={onClose}>
            Cancel
          </ActionButton>
          <ActionButton type="button" $variant="primary" $disabled={busy} disabled={busy} onClick={submit}>
            {busy ? 'Saving…' : 'Record payment'}
          </ActionButton>
        </S.ModalActions>
      </S.ModalCard>
    </S.Overlay>
  )
}
