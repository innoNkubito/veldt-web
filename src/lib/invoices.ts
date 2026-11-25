/**
 * Client invoicing — shared types for the web app. Mirrors veldt-api
 * src/lib/invoices; the API is the authority on validation.
 */

export interface InvoiceSettings {
  legalName: string | null
  address: string | null
  taxId: string | null
  bankDetails: string | null
  numberPrefix: string
  nextNumber: number
  nextNumberPreview: string
  defaultNotes: string | null
  defaultTerms: string | null
  operatorName: string
  canEdit: boolean
}

export interface InvoiceSettingsInput {
  legalName: string | null
  address: string | null
  taxId: string | null
  bankDetails: string | null
  numberPrefix: string
  defaultNotes: string | null
  defaultTerms: string | null
}

export const DEFAULT_NUMBER_PREFIX = 'INV'

/** "WAA-2026-0007" — the same format the API assigns when an invoice is sent. */
export function formatInvoiceNumber(prefix: string, year: number, sequence: number): string {
  return `${prefix}-${year}-${String(sequence).padStart(4, '0')}`
}

// ── Client invoices ─────────────────────────────────────────────

export type ClientInvoiceStatus = 'DRAFT' | 'SENT' | 'PARTIALLY_PAID' | 'PAID' | 'VOID'
export type ClientInvoiceSource = 'BOOKING' | 'PACKAGES' | 'QUOTE' | 'BLANK'
export type ClientInvoiceStageState = 'PAID' | 'PARTIAL' | 'DUE' | 'OVERDUE'
export type InvoicePaymentMethod = 'CARD' | 'ACH' | 'OFFLINE'

export interface ClientInvoiceIssuer {
  name: string
  address: string | null
  taxId: string | null
  bankDetails: string | null
  logoUrl: string | null
  email: string | null
  phone: string | null
}

export interface ClientInvoiceLine {
  id: string
  description: string
  quantity: number
  unitPrice: number
  taxRate: number
  lineTotal: number
  taxAmount: number
}

export interface ClientInvoiceTax {
  rate: number
  taxable: number
  tax: number
}

export interface ClientInvoiceStage {
  id: string
  label: string
  dueDate: string
  amount: number
  state: ClientInvoiceStageState
  installmentId: string | null
}

export interface ClientInvoicePayment {
  id: string
  amount: number
  paidAt: string
  method: InvoicePaymentMethod
  reference: string | null
  fromBooking: boolean
}

export interface ClientInvoice {
  id: string
  itineraryId: string
  bookingId: string | null
  bookingReference: string | null
  number: string | null
  status: ClientInvoiceStatus
  currency: string
  billToName: string
  billToEmail: string | null
  billToAddress: string | null
  notes: string | null
  terms: string | null
  issuer: ClientInvoiceIssuer
  lines: ClientInvoiceLine[]
  taxes: ClientInvoiceTax[]
  stages: ClientInvoiceStage[]
  payments: ClientInvoicePayment[]
  subtotal: number
  taxTotal: number
  total: number
  amountPaid: number
  amountDue: number
  overdue: boolean
  nextDueDate: string | null
  nextDueAmount: number | null
  sendIssues: string[]
  issuedAt: string | null
  sentAt: string | null
  sentTo: string | null
  voidedAt: string | null
  voidReason: string | null
  replacesInvoiceId: string | null
  replacesNumber: string | null
  replacedById: string | null
  replacedByNumber: string | null
  publicToken: string
  acceptsManualPayments: boolean
  createdAt: string
  updatedAt: string
}

export interface ClientInvoiceDraftInput {
  billToName: string
  billToEmail: string | null
  billToAddress: string | null
  notes: string | null
  terms: string | null
  lines: { description: string; quantity: number; unitPrice: number; taxRate: number }[]
  stages: { label: string; dueDate: string; amount: number; installmentId: string | null }[]
}

export interface ClientInvoicePaymentInput {
  amount: number
  paidAt: string
  method: InvoicePaymentMethod
  reference: string | null
}

export function formatMoney(amount: number, currency: string): string {
  return `${currency} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/** "2026-12-01" → "1 Dec 2026", read as a calendar date (no timezone shift). */
export function formatDay(day: string | null): string {
  if (!day) return ''
  const date = new Date(`${day.slice(0, 10)}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return day
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
}

/** The client's invoice page. */
export function invoicePageUrl(publicToken: string): string {
  const origin = typeof window === 'undefined' ? '' : window.location.origin
  return `${origin}/invoice/${publicToken}`
}
