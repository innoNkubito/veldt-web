import { formatDay, formatMoney } from '@/lib/invoices'
import type { InvoiceDocumentData } from '@/components/invoices/InvoiceDocument'
import type { PublicClientInvoice } from '@/stores/publicClientInvoiceStore'

export function documentFromPublic(invoice: PublicClientInvoice): InvoiceDocumentData {
  return {
    number: invoice.number,
    status: invoice.status,
    currency: invoice.currency,
    issuer: invoice.issuer,
    tripTitle: invoice.tripTitle,
    billToName: invoice.billToName,
    billToEmail: null,
    billToAddress: invoice.billToAddress,
    issuedAt: invoice.issuedAt,
    lines: invoice.lines,
    taxes: invoice.taxes,
    subtotal: invoice.subtotal,
    taxTotal: invoice.taxTotal,
    total: invoice.total,
    amountPaid: invoice.amountPaid,
    amountDue: invoice.amountDue,
    stages: invoice.stages.map((s) => ({ ...s, payHref: s.payToken ? `/pay/${s.payToken}` : null })),
    notes: invoice.notes,
    terms: invoice.terms,
    showBankDetails: !invoice.payableOnline && invoice.status !== 'VOID' && invoice.status !== 'PAID',
  }
}

/** The line above the invoice: what's owed now, or why nothing is. */
export function summary(invoice: PublicClientInvoice): { text: string; sub: string; tone?: 'danger' | 'success' | 'muted' } {
  const money = (n: number) => formatMoney(n, invoice.currency)
  if (invoice.status === 'VOID') {
    return { text: `Invoice ${invoice.number} is void`, sub: 'Nothing is due on it. Contact us if you have questions.', tone: 'muted' }
  }
  if (invoice.status === 'PAID') {
    return { text: `Invoice ${invoice.number} is paid`, sub: `Thank you — ${money(invoice.total)} received.`, tone: 'success' }
  }
  const next = invoice.stages.find((s) => s.state !== 'PAID')
  const due = next ? `Next payment: ${next.label}, due ${formatDay(next.dueDate)}` : ''
  return {
    text: `${money(invoice.amountDue)} due on invoice ${invoice.number}`,
    sub: invoice.overdue ? `A payment is overdue. ${due}` : due,
    tone: invoice.overdue ? 'danger' : undefined,
  }
}
