import { T } from '@/lib/theme'
import type { ClientInvoiceSource, ClientInvoiceStatus, InvoicePaymentMethod } from '@/lib/invoices'

export const STATUS: Record<ClientInvoiceStatus, { label: string; color: string; bg: string }> = {
  DRAFT: { label: 'Draft', color: T.sub, bg: T.dim },
  SENT: { label: 'Sent', color: T.infoDk, bg: T.infoLt },
  PARTIALLY_PAID: { label: 'Part paid', color: T.warningDk, bg: T.warningLt },
  PAID: { label: 'Paid', color: T.successDk, bg: T.successLt },
  VOID: { label: 'Void', color: T.muted, bg: T.dim },
}

export const OVERDUE = { label: 'Overdue', color: T.dangerDk, bg: T.dangerLt }

export const SOURCES: {
  value: ClientInvoiceSource
  label: string
  hint: string
}[] = [
  {
    value: 'BOOKING',
    label: 'From a booking',
    hint: 'Its packages and add-ons; payments follow the booking’s installments.',
  },
  {
    value: 'PACKAGES',
    label: 'From the packages',
    hint: 'One line per package on this trip.',
  },
  {
    value: 'QUOTE',
    label: 'From the quote',
    hint: 'Price per person × guests.',
  },
  { value: 'BLANK', label: 'Blank', hint: 'Start with no lines.' },
]

export const METHODS: { value: InvoicePaymentMethod; label: string }[] = [
  { value: 'OFFLINE', label: 'Bank transfer / cash' },
  { value: 'CARD', label: 'Card' },
  { value: 'ACH', label: 'ACH' },
]

export const MAX_LINES = 100
export const MAX_STAGES = 12

export const COPY = {
  intro: 'Bill the client for this trip. Sent invoices are locked — to correct one, void it and reissue.',
  empty: 'No invoices yet.',
  loading: 'Loading invoices…',
  newInvoice: 'New invoice',
  viewerNote: 'You can view invoices; owners and advisors create and send them.',
  draft: 'Draft',
  settingsHint: 'Your company details, numbering and default notes come from',
  settingsLink: 'Settings → Invoicing',
} as const
