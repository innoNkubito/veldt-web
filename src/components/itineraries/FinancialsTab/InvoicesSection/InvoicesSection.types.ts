import type { ClientInvoice } from '@/lib/invoices'

export interface LineDraft {
  key: string
  description: string
  quantity: string
  unitPrice: string
  taxRate: string
}

export interface StageDraft {
  key: string
  label: string
  dueDate: string
  amount: string
  installmentId: string | null
}

/** The editor's form — strings for controlled inputs. */
export interface InvoiceDraftForm {
  billToName: string
  billToEmail: string
  billToAddress: string
  notes: string
  terms: string
  lines: LineDraft[]
  stages: StageDraft[]
}

/** Totals worked out in the browser while editing; the API recomputes on save. */
export interface LiveTotals {
  lines: {
    description: string
    quantity: number
    unitPrice: number
    taxRate: number
    lineTotal: number
  }[]
  taxes: { rate: number; taxable: number; tax: number }[]
  subtotal: number
  taxTotal: number
  total: number
  stagesSum: number
}

export type OpenInvoice = { id: string } | null

export type InvoiceModal =
  | { kind: 'send'; invoice: ClientInvoice; resend: boolean }
  | { kind: 'void'; invoice: ClientInvoice }
  | { kind: 'payment'; invoice: ClientInvoice }
  | null
