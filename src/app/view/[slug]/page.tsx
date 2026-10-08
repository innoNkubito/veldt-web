'use client'

import * as S from './page.styled'
import { formatPrice } from '@/components/itineraries/ProposalBlocks'
import {
  ContentPageBlock,
  DEFAULT_COVER_LABEL,
  DayByDay,
  META_LABELS,
  ProposalCosts,
  ProposalCoverPage,
  infoSlotId,
  pluralise,
  taggedId,
} from '@/components/itineraries/ProposalSections'
import TravelDashboard from '@/components/itineraries/TravelDashboard'
import OperatorMark, { OperatorBrandProvider } from '@/components/itineraries/OperatorMark'
import { useSharePage } from './useSharePage'
import {
  BOOK_SECTION_ID,
  BOOKING_COPY,
  FLIGHTS_PROMPT,
  FOOTER_COPY,
  LOADING_MESSAGE,
  NOT_FOUND,
} from './page.constants'

/** The public share link: the proposal, and the way to book it. */
export default function SharePage() {
  const {
    loading, notFound, itinerary, view, booking,
    contentRef, layerA, layerB, showA, cover,
  } = useSharePage()

  if (loading) {
    return (
      <S.PageRoot>
        <S.CenteredState><div>{LOADING_MESSAGE}</div></S.CenteredState>
      </S.PageRoot>
    )
  }

  if (notFound || !itinerary || !view) {
    return (
      <S.PageRoot>
        <S.CenteredState>
          <S.NotFoundTitle>{NOT_FOUND.title}</S.NotFoundTitle>
          <div>{NOT_FOUND.body}</div>
        </S.CenteredState>
      </S.PageRoot>
    )
  }

  return (
    <OperatorBrandProvider value={itinerary.brand}>
      <S.ViewLayout>
        <S.CoverPanel>
          <S.CoverBgLayer $url={layerA.url} $visible={showA} />
          <S.CoverBgLayer $url={layerB.url} $visible={!showA} />
          <OperatorMark brand={itinerary.brand} variant="cover" />
          <S.CoverContent>
            <S.CoverLabel>{cover.label}</S.CoverLabel>
            <S.CoverTitle>{cover.title || itinerary.proposalTitle}</S.CoverTitle>
            {cover.label === DEFAULT_COVER_LABEL && (
              <S.CoverMeta>
                {itinerary.preparedFor && (
                  <S.CoverMetaRow><span>{META_LABELS.preparedFor} {itinerary.preparedFor}</span></S.CoverMetaRow>
                )}
                {itinerary.travelDates && (
                  <S.CoverMetaRow><span>{itinerary.travelDates}</span></S.CoverMetaRow>
                )}
                {view.rows.length > 0 && (
                  <S.CoverMetaRow><span>{pluralise(view.rows.length, 'day')}</span></S.CoverMetaRow>
                )}
              </S.CoverMeta>
            )}
          </S.CoverContent>
        </S.CoverPanel>

        <S.ViewContent ref={contentRef}>
          {view.flightsLink && (
            <S.FlightsPrompt>
              <span>{FLIGHTS_PROMPT.text}</span>
              <S.FlightsPromptLink href={view.flightsLink}>{FLIGHTS_PROMPT.action}</S.FlightsPromptLink>
            </S.FlightsPrompt>
          )}
          {view.tripMode && <TravelDashboard itinerary={itinerary} />}
          <ProposalCoverPage itinerary={itinerary} dayCount={view.rows.length} glance={view.glance} />
          {[...view.afterCover, ...view.beforeDayByDay].map((slot) => (
            <ContentPageBlock key={slot.id} page={slot.contentPage} blockId={infoSlotId(slot.id)} pageId={slot.contentPage.id} />
          ))}
          <DayByDay rows={view.rows} />
          {view.taggedPages.map((cp) => (
            <ContentPageBlock key={cp.id} page={cp} blockId={taggedId(cp.id)} pageId={cp.id} />
          ))}
          {view.costs && <ProposalCosts costs={view.costs} />}
          {view.endSlots.map((slot) => (
            <ContentPageBlock key={slot.id} page={slot.contentPage} blockId={infoSlotId(slot.id)} pageId={slot.contentPage.id} />
          ))}

          {booking && (
            <S.BookBlock id={BOOK_SECTION_ID} data-cover-id={BOOK_SECTION_ID}>
              <S.BookHeading>{BOOKING_COPY.heading}</S.BookHeading>
              {booking.options.bookingMode === 'VELDT' ? (
                <>
                  <S.BookIntro>
                    {booking.options.flowType === 'REQUEST' ? BOOKING_COPY.requestIntro : BOOKING_COPY.instantIntro}
                    {booking.fromPrice != null && (
                      <> {BOOKING_COPY.fromPrice} {formatPrice(booking.fromPrice, booking.options.currency)}.</>
                    )}
                  </S.BookIntro>
                  <S.BookButton onClick={booking.open}>
                    {booking.options.flowType === 'REQUEST' ? BOOKING_COPY.requestButton : BOOKING_COPY.bookButton}
                  </S.BookButton>
                </>
              ) : (
                <>
                  <S.BookIntro>{BOOKING_COPY.externalIntro}</S.BookIntro>
                  {booking.options.externalUrl && (
                    <S.BookLink href={booking.options.externalUrl} target="_blank" rel="noopener noreferrer">
                      {BOOKING_COPY.bookButton}
                    </S.BookLink>
                  )}
                  {booking.options.externalContact && (
                    <S.BookContact>{booking.options.externalContact}</S.BookContact>
                  )}
                </>
              )}
            </S.BookBlock>
          )}

          {/* The operator's mark is always shown; white-label only hides Veldt's */}
          <S.OperatorFooter>
            <OperatorMark brand={itinerary.brand} variant="inline" />
          </S.OperatorFooter>
          {!itinerary.whiteLabel && (
            <S.Footer>
              {FOOTER_COPY.before} <S.FooterBrand>{FOOTER_COPY.brand}</S.FooterBrand> {FOOTER_COPY.after}
            </S.Footer>
          )}
        </S.ViewContent>
      </S.ViewLayout>
    </OperatorBrandProvider>
  )
}
