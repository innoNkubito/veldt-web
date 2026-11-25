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
