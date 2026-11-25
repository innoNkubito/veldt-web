import type { ClientInvoice, ClientInvoiceDraftInput } from '@/lib/invoices'
import type { PaymentScheduleItem } from '@/stores/bookingStore'
import type { InvoiceDocumentData } from '@/components/invoices/InvoiceDocument'
import type { InvoiceDraftForm, LineDraft, LiveTotals, StageDraft } from './InvoicesSection.types'

let seq = 0
export const newKey = () => `k${Date.now().toString(36)}${(seq++).toString(36)}`

const str = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/0$/, ''))

export const blankLine = (): LineDraft => ({
  key: newKey(),
  description: '',
  quantity: '1',
  unitPrice: '',
  taxRate: '0',
})

export const todayIso = () => new Date().toISOString().slice(0, 10)

export const blankStage = (amount = ''): StageDraft => ({
  key: newKey(),
  label: '',
  dueDate: todayIso(),
  amount,
  installmentId: null,
})

export function formFromInvoice(invoice: ClientInvoice): InvoiceDraftForm {
  return {
    billToName: invoice.billToName,
    billToEmail: invoice.billToEmail ?? '',
    billToAddress: invoice.billToAddress ?? '',
    notes: invoice.notes ?? '',
    terms: invoice.terms ?? '',
    lines: invoice.lines.map((l) => ({
      key: l.id,
      description: l.description,
      quantity: str(l.quantity),
      unitPrice: l.unitPrice.toFixed(2),
      taxRate: str(l.taxRate),
    })),
    stages: invoice.stages.map((s) => ({
      key: s.id,
      label: s.label,
      dueDate: s.dueDate,
      amount: s.amount.toFixed(2),
      installmentId: s.installmentId,
    })),
  }
}

const num = (value: string) => {
  const n = Number(value.trim())
  return value.trim() === '' || !Number.isFinite(n) ? 0 : n
}
const orNull = (value: string) => value.trim() || null

export function toInput(form: InvoiceDraftForm): ClientInvoiceDraftInput {
  return {
    billToName: form.billToName.trim(),
    billToEmail: orNull(form.billToEmail),
    billToAddress: orNull(form.billToAddress),
    notes: orNull(form.notes),
    terms: orNull(form.terms),
    lines: form.lines.map((l) => ({
      description: l.description.trim(),
      quantity: num(l.quantity),
      unitPrice: num(l.unitPrice),
      taxRate: num(l.taxRate),
    })),
    stages: form.stages.map((s) => ({
      label: s.label.trim(),
      dueDate: s.dueDate,
      amount: num(s.amount),
      installmentId: s.installmentId,
    })),
  }
}

// Minor units, rounded half away from zero — the API's rule, so the preview matches.
const toMinor = (n: number) => Math.round(n * 100)
const roundAway = (v: number) => Math.sign(v) * Math.floor(Math.abs(v) + 0.5)

export function liveTotals(form: InvoiceDraftForm): LiveTotals {
  const groups = new Map<number, { taxable: number; tax: number }>()
  let subtotal = 0
  let taxTotal = 0
  const lines = form.lines.map((l) => {
    const quantity = num(l.quantity)
    const unitPrice = num(l.unitPrice)
    const taxRate = num(l.taxRate)
    const lineMinor = roundAway((Math.round(quantity * 100) * toMinor(unitPrice)) / 100)
    const taxMinor = roundAway((lineMinor * Math.round(taxRate * 100)) / 10000)
    subtotal += lineMinor
    taxTotal += taxMinor
    if (taxRate) {
      const g = groups.get(taxRate) ?? { taxable: 0, tax: 0 }
      g.taxable += lineMinor
      g.tax += taxMinor
      groups.set(taxRate, g)
    }
    return {
      description: l.description,
      quantity,
      unitPrice,
      taxRate,
      lineTotal: lineMinor / 100,
    }
  })
  const stagesSum = form.stages.reduce((sum, s) => sum + toMinor(num(s.amount)), 0)
  return {
    lines,
    taxes: [...groups.entries()]
      .sort(([a], [b]) => a - b)
      .map(([rate, g]) => ({
        rate,
        taxable: g.taxable / 100,
        tax: g.tax / 100,
      })),
    subtotal: subtotal / 100,
    taxTotal: taxTotal / 100,
    total: (subtotal + taxTotal) / 100,
    stagesSum: stagesSum / 100,
  }
}

/** Splits the total across the stages (at least two); the last absorbs the cents. */
export function splitEvenly(stages: StageDraft[], total: number): StageDraft[] {
  const list =
    stages.length >= 2 ? stages : [...stages, ...Array.from({ length: 2 - stages.length }, () => blankStage())]
  const totalMinor = toMinor(total)
  const share = Math.floor(totalMinor / list.length)
  return list.map((s, i) => ({
    ...s,
    label: s.label || (i === list.length - 1 ? 'Balance' : i === 0 ? 'Deposit' : `Payment ${i + 1}`),
    amount: ((i === list.length - 1 ? totalMinor - share * (list.length - 1) : share) / 100).toFixed(2),
  }))
}

/** Makes the last stage take up whatever the others leave of the total. */
export function matchTotal(stages: StageDraft[], total: number): StageDraft[] {
  if (stages.length === 0) return [{ ...blankStage(total.toFixed(2)), label: 'Due on receipt' }]
  const others = stages.slice(0, -1).reduce((sum, s) => sum + toMinor(num(s.amount)), 0)
  const last = stages[stages.length - 1]
  return [...stages.slice(0, -1), { ...last, amount: ((toMinor(total) - others) / 100).toFixed(2) }]
}

/** The trip's booking schedule, resolved against the total (mirrors the API's rules). */
export function stagesFromSchedule(items: PaymentScheduleItem[], total: number): StageDraft[] {
  const totalMinor = toMinor(total)
  const today = todayIso()
  if (items.length === 0) return [{ ...blankStage(total.toFixed(2)), label: 'Due on receipt' }]
  const amounts: (number | null)[] = items.map((item) =>
    item.amountType === 'FIXED'
      ? toMinor(item.amountValue ?? 0)
      : item.amountType === 'PERCENT_OF_TOTAL'
        ? Math.floor((totalMinor * (item.amountValue ?? 0)) / 100 + 0.5)
        : null,
  )
  const fixed = amounts.reduce<number>((sum, a) => sum + (a ?? 0), 0)
  const rest = amounts.findIndex((a) => a === null)
  if (rest > -1) amounts[rest] = Math.max(totalMinor - fixed, 0)
  const resolved = amounts.map((a) => a ?? 0)
  resolved[resolved.length - 1] += totalMinor - resolved.reduce((a, b) => a + b, 0)
  return items
    .map((item, i) => {
      const due = item.dueAtBooking || !item.dueDate ? today : item.dueDate.slice(0, 10)
      return {
        ...blankStage((resolved[i] / 100).toFixed(2)),
        label: item.description,
        dueDate: due < today ? today : due,
      }
    })
    .filter((s) => Number(s.amount) > 0)
}

export function moveItem<T>(list: T[], index: number, delta: -1 | 1): T[] {
  const target = index + delta
  if (target < 0 || target >= list.length) return list
  const next = [...list]
  ;[next[index], next[target]] = [next[target], next[index]]
  return next
}

/** The printed invoice for a saved one. */
export function documentFromInvoice(invoice: ClientInvoice, tripTitle: string | null): InvoiceDocumentData {
  return {
    number: invoice.number,
    status: invoice.status,
    currency: invoice.currency,
    issuer: invoice.issuer,
    tripTitle,
    billToName: invoice.billToName,
    billToEmail: invoice.billToEmail,
    billToAddress: invoice.billToAddress,
    issuedAt: invoice.issuedAt,
    lines: invoice.lines,
    taxes: invoice.taxes,
    subtotal: invoice.subtotal,
    taxTotal: invoice.taxTotal,
    total: invoice.total,
    amountPaid: invoice.amountPaid,
    amountDue: invoice.amountDue,
    stages: invoice.stages,
    notes: invoice.notes,
    terms: invoice.terms,
    showBankDetails: invoice.acceptsManualPayments,
  }
}

/** The printed invoice for a draft being edited, with live totals. */
export function documentFromDraft(
  invoice: ClientInvoice,
  form: InvoiceDraftForm,
  totals: LiveTotals,
  tripTitle: string | null,
): InvoiceDocumentData {
  return {
    ...documentFromInvoice(invoice, tripTitle),
    billToName: form.billToName,
    billToEmail: form.billToEmail || null,
    billToAddress: form.billToAddress || null,
    lines: totals.lines,
    taxes: totals.taxes,
    subtotal: totals.subtotal,
    taxTotal: totals.taxTotal,
    total: totals.total,
    amountDue: Math.max(totals.total - invoice.amountPaid, 0),
    stages: form.stages.map((s) => ({
      label: s.label,
      dueDate: s.dueDate,
      amount: num(s.amount),
      state: 'DUE' as const,
    })),
    notes: form.notes || null,
    terms: form.terms || null,
  }
}
