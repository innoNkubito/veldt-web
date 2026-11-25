import { T } from '@/lib/theme'
import type { ClientInvoiceStageState } from '@/lib/invoices'

export const STAGE_STATE: Record<ClientInvoiceStageState, { label: string; color: string }> = {
  PAID: { label: 'Paid', color: T.successDk },
  PARTIAL: { label: 'Part paid', color: T.infoDk },
  DUE: { label: 'Due', color: T.sub },
  OVERDUE: { label: 'Overdue', color: T.dangerDk },
}

export const COPY = {
  invoice: 'Invoice',
  draft: 'Draft',
  billTo: 'Bill to',
  issued: 'Issued',
  trip: 'Trip',
  taxId: 'Tax / VAT',
  description: 'Description',
  qty: 'Qty',
  price: 'Unit price',
  tax: 'Tax',
  amount: 'Amount',
  subtotal: 'Subtotal',
  taxAt: (rate: number) => `Tax at ${rate}%`,
  total: 'Total',
  paid: 'Paid',
  due: 'Amount due',
  schedule: 'Payment schedule',
  pay: 'Pay',
  bank: 'How to pay',
  notes: 'Notes',
  terms: 'Terms',
  noLines: 'No lines yet.',
  stampPaid: 'Paid',
  stampVoid: 'Void',
} as const
