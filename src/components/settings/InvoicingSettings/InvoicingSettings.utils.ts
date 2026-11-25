import { DEFAULT_NUMBER_PREFIX, formatInvoiceNumber, type InvoiceSettings, type InvoiceSettingsInput } from '@/lib/invoices'
import type { InvoicingForm } from './InvoicingSettings.types'

export function formFromSettings(settings: InvoiceSettings | null): InvoicingForm {
  return {
    legalName: settings?.legalName ?? '',
    address: settings?.address ?? '',
    taxId: settings?.taxId ?? '',
    bankDetails: settings?.bankDetails ?? '',
    numberPrefix: settings?.numberPrefix ?? DEFAULT_NUMBER_PREFIX,
    defaultNotes: settings?.defaultNotes ?? '',
    defaultTerms: settings?.defaultTerms ?? '',
  }
}

const orNull = (value: string) => value.trim() || null

export function toInput(form: InvoicingForm): InvoiceSettingsInput {
  return {
    legalName: orNull(form.legalName),
    address: orNull(form.address),
    taxId: orNull(form.taxId),
    bankDetails: orNull(form.bankDetails),
    numberPrefix: form.numberPrefix.trim().toUpperCase() || DEFAULT_NUMBER_PREFIX,
    defaultNotes: orNull(form.defaultNotes),
    defaultTerms: orNull(form.defaultTerms),
  }
}

/** What the next number will look like with the prefix as typed. */
export function previewNumber(prefix: string, nextNumber: number): string {
  return formatInvoiceNumber(prefix.trim().toUpperCase() || DEFAULT_NUMBER_PREFIX, new Date().getFullYear(), nextNumber)
}
