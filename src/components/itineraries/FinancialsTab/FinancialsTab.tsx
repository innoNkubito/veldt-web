'use client'

import BookingSection from './BookingSection'
import InvoicesSection from './InvoicesSection'
import QuoteSection from './QuoteSection'
import { SECTIONS } from './FinancialsTab.constants'
import { scrollToSection } from './FinancialsTab.utils'
import * as S from './FinancialsTab.styled'

const [QUOTE, BOOKING, INVOICES] = SECTIONS

/**
 * Everything about the money for a trip, on one tab: the quote the proposal
 * shows, how the client books and pays, and the invoices sent to them.
 */
export default function FinancialsTab() {
  return (
    <S.Root>
      <S.Nav aria-label="Financials sections">
        {SECTIONS.map((section) => (
          <S.NavLink key={section.id} type="button" onClick={() => scrollToSection(section.id)}>
            <S.NavLabel>{section.label}</S.NavLabel>
            <S.NavHint>{section.hint}</S.NavHint>
          </S.NavLink>
        ))}
      </S.Nav>

      <S.Section id={QUOTE.id} aria-labelledby={`${QUOTE.id}-title`}>
        <S.SectionHead>
          <S.SectionTitle id={`${QUOTE.id}-title`} tabIndex={-1}>{QUOTE.label}</S.SectionTitle>
          <S.SectionHint>{QUOTE.hint}</S.SectionHint>
        </S.SectionHead>
        <QuoteSection />
      </S.Section>

      <S.Section id={BOOKING.id} aria-labelledby={`${BOOKING.id}-title`}>
        <S.SectionHead>
          <S.SectionTitle id={`${BOOKING.id}-title`} tabIndex={-1}>{BOOKING.label}</S.SectionTitle>
          <S.SectionHint>{BOOKING.hint}</S.SectionHint>
        </S.SectionHead>
        <BookingSection />
      </S.Section>

      <S.Section id={INVOICES.id} aria-labelledby={`${INVOICES.id}-title`}>
        <S.SectionHead>
          <S.SectionTitle id={`${INVOICES.id}-title`} tabIndex={-1}>{INVOICES.label}</S.SectionTitle>
          <S.SectionHint>{INVOICES.hint}</S.SectionHint>
        </S.SectionHead>
        <InvoicesSection />
      </S.Section>
    </S.Root>
  )
}
