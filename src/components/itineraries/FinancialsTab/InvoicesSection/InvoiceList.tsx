'use client'

import { formatDay, formatMoney, type ClientInvoice } from '@/lib/invoices'
import { COPY, OVERDUE, STATUS } from './InvoicesSection.constants'
import * as S from './InvoicesSection.styled'

export function StatusBadges({ invoice }: { invoice: ClientInvoice }) {
  const status = STATUS[invoice.status]
  return (
    <S.Badges>
      {invoice.overdue && (
        <S.Badge $color={OVERDUE.color} $bg={OVERDUE.bg}>
          {OVERDUE.label}
        </S.Badge>
      )}
      <S.Badge $color={status.color} $bg={status.bg}>
        {status.label}
      </S.Badge>
    </S.Badges>
  )
}

/** Number, client, total, paid / due, status. */
export default function InvoiceList({ invoices, onOpen }: { invoices: ClientInvoice[]; onOpen: (id: string) => void }) {
  if (invoices.length === 0) return <S.Muted>{COPY.empty}</S.Muted>
  return (
    <S.List>
      {invoices.map((invoice) => {
        const money = (n: number) => formatMoney(n, invoice.currency)
        const paidLine =
          invoice.status === 'DRAFT' || invoice.status === 'VOID'
            ? invoice.issuedAt
              ? `Issued ${formatDay(invoice.issuedAt)}`
              : `Created ${formatDay(invoice.createdAt)}`
            : invoice.amountDue > 0
              ? `${money(invoice.amountDue)} due`
              : 'Paid in full'
        return (
          <S.Item key={invoice.id}>
            <S.ItemButton type="button" onClick={() => onOpen(invoice.id)}>
              <S.Mono>{invoice.number ?? COPY.draft}</S.Mono>
              <S.Sub>{invoice.billToName || '—'}</S.Sub>
              <S.Sub>{money(invoice.total)}</S.Sub>
              <S.Sub>{paidLine}</S.Sub>
              <StatusBadges invoice={invoice} />
            </S.ItemButton>
          </S.Item>
        )
      })}
    </S.List>
  )
}
