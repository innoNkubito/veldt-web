'use client'

import Link from 'next/link'
import { ActionButton } from '@/components/itineraries/shared/ActionButton'
import { COPY } from './InvoicesSection.constants'
import InvoiceDetail from './InvoiceDetail'
import InvoiceEditor from './InvoiceEditor'
import InvoiceList from './InvoiceList'
import SourcePicker from './SourcePicker'
import PaymentModal from './modals/PaymentModal'
import SendModal from './modals/SendModal'
import VoidModal from './modals/VoidModal'
import { useInvoicesSection } from './useInvoicesSection'
import * as S from './InvoicesSection.styled'

/** Financials → Invoices: the trip's client invoices, one open at a time. */
export default function InvoicesSection() {
  const m = useInvoicesSection()
  const { modal, store } = m

  if (m.isTemplate) return <S.Muted>Templates don’t have invoices — trips made from this template do.</S.Muted>
  if (m.loading) return <S.Muted>{COPY.loading}</S.Muted>

  return (
    <div>
      {m.notice && (
        <S.Notice $error={m.notice.error} role={m.notice.error ? 'alert' : 'status'} onClick={m.clearNotice}>
          {m.notice.text}
        </S.Notice>
      )}

      {m.open ? (
        m.open.status === 'DRAFT' && m.canEdit ? (
          <InvoiceEditor key={m.open.id} invoice={m.open} model={m} />
        ) : (
          <InvoiceDetail invoice={m.open} model={m} />
        )
      ) : (
        <S.Card>
          <S.Row>
            <S.Intro>
              {COPY.intro} {COPY.settingsHint} <Link href="/settings#invoicing">{COPY.settingsLink}</Link>.
            </S.Intro>
            {m.canEdit && (
              <ActionButton type="button" $variant="primary" onClick={() => m.setPicking(true)}>
                {COPY.newInvoice}
              </ActionButton>
            )}
          </S.Row>
          {m.loadError && <S.Muted role="alert">{m.loadError}</S.Muted>}
          {!m.canEdit && <S.Muted>{COPY.viewerNote}</S.Muted>}
          <InvoiceList invoices={m.invoices} onOpen={m.openInvoice} />
        </S.Card>
      )}

      {m.picking && (
        <SourcePicker
          bookings={m.bookings}
          busy={m.busy === 'new'}
          onCreate={m.create}
          onClose={() => m.setPicking(false)}
        />
      )}
      {modal?.kind === 'send' && (
        <SendModal
          invoice={modal.invoice}
          resend={modal.resend}
          busy={m.busy === modal.invoice.id}
          onSend={async (to, copyToMe) => {
            const result = modal.resend
              ? store.resend(modal.invoice.id, to, copyToMe)
              : store.send(modal.invoice.id, to, copyToMe)
            const { invoice, error } = await result
            if (error !== null) return error
            m.say(modal.resend ? `Emailed ${invoice.number} to ${to}.` : `Sent ${invoice.number} to ${to}.`)
            return null
          }}
          onClose={() => m.setModal(null)}
        />
      )}
      {modal?.kind === 'void' && (
        <VoidModal
          invoice={modal.invoice}
          busy={m.busy === modal.invoice.id}
          onVoid={async (reason) => {
            const { error } = await store.voidInvoice(modal.invoice.id, reason)
            if (error !== null) return error
            m.say(`${modal.invoice.number} is void. Reissue it to bill again.`)
            return null
          }}
          onClose={() => m.setModal(null)}
        />
      )}
      {modal?.kind === 'payment' && (
        <PaymentModal
          invoice={modal.invoice}
          busy={m.busy === modal.invoice.id}
          onRecord={async (input) => {
            const { error } = await store.recordPayment(modal.invoice.id, input)
            if (error !== null) return error
            m.say('Payment recorded.')
            return null
          }}
          onClose={() => m.setModal(null)}
        />
      )}
    </div>
  )
}
