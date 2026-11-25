'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import InvoiceDocument from '@/components/invoices/InvoiceDocument'
import { routeParam } from '@/lib/guards'
import { usePublicClientInvoiceStore } from '@/stores/publicClientInvoiceStore'
import { documentFromPublic, summary } from './page.utils'
import * as S from './page.styled'

/**
 * The client's invoice: printable (or save as PDF from the print dialog),
 * with Pay buttons on stages that can be paid online, else the bank details.
 * Works whatever the trip's status — a client may pay after the trip.
 */
export default function ClientInvoicePage() {
  const token = routeParam(useParams()?.token)
  const { invoice, loading, missing, error, fetch } = usePublicClientInvoiceStore()

  useEffect(() => {
    if (token) fetch(token)
  }, [token, fetch])

  useEffect(() => {
    if (invoice) document.title = `Invoice ${invoice.number} — ${invoice.issuer.name}`
  }, [invoice])

  if (loading) {
    return (
      <S.PageRoot>
        <S.Message>Loading your invoice…</S.Message>
      </S.PageRoot>
    )
  }
  if (error || missing || !invoice) {
    return (
      <S.PageRoot>
        <S.Message>
          <h1>Invoice not found</h1>
          {error ?? 'This link may be mistyped, or the invoice was withdrawn. Contact your travel advisor for a new link.'}
        </S.Message>
      </S.PageRoot>
    )
  }

  const top = summary(invoice)
  return (
    <S.PageRoot>
      <S.Column>
        <S.Bar>
          <S.BarText>
            <strong>{top.text}</strong>
            {top.sub && <S.BarSub $tone={top.tone}>{top.sub}</S.BarSub>}
          </S.BarText>
          <S.PrintButton type="button" onClick={() => window.print()}>
            Print or save as PDF
          </S.PrintButton>
        </S.Bar>
        <InvoiceDocument invoice={documentFromPublic(invoice)} />
        <S.Footer>Sent by Veldt on behalf of {invoice.issuer.name}.</S.Footer>
      </S.Column>
    </S.PageRoot>
  )
}
