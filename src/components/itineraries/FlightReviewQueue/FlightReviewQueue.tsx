'use client'

import * as S from './FlightReviewQueue.styled'
import { ActionButton } from '@/components/itineraries/shared/ActionButton'
import { useFlightReviewQueue } from './useFlightReviewQueue'
import { COPY } from './FlightReviewQueue.constants'
import { flightLine } from './FlightReviewQueue.utils'
import type { FlightReviewQueueProps } from './FlightReviewQueue.types'

/** Flights the traveller sent from the share link, waiting for the operator. */
export default function FlightReviewQueue({ flights }: FlightReviewQueueProps) {
  const { saving, error, approve, dismiss } = useFlightReviewQueue()

  return (
    <S.Card>
      <S.Title>{COPY.title} ({flights.length})</S.Title>
      <S.Intro>{COPY.intro}</S.Intro>
      {flights.map((flight) => {
        const meta = [flight.bookingReference, flight.travellerName, flight.notes].filter(Boolean)
        return (
          <S.Row key={flight.id}>
            <div>
              <S.Code>{flight.flightNumber}</S.Code>
              <S.Airline>{flight.airline}</S.Airline>
            </div>
            <div>
              <S.Line>{flightLine(flight, COPY.timeTbc)}</S.Line>
              {meta.length > 0 && <S.Meta>{meta.join(' · ')}</S.Meta>}
            </div>
            <S.Actions>
              <ActionButton $variant="primary" onClick={() => approve(flight)} $disabled={saving} disabled={saving}>
                {COPY.approve}
              </ActionButton>
              <ActionButton $variant="ghost" onClick={() => dismiss(flight)} $disabled={saving} disabled={saving}>
                {COPY.dismiss}
              </ActionButton>
            </S.Actions>
          </S.Row>
        )
      })}
      {error && <S.ErrorText>{error}</S.ErrorText>}
    </S.Card>
  )
}
