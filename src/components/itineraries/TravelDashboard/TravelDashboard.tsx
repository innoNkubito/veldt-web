'use client'

import * as S from './TravelDashboard.styled'
import { useTravelDashboard } from './useTravelDashboard'
import { COPY, DIRECTION_LABELS, TRIP_SECTION_ID } from './TravelDashboard.constants'
import {
  contactName,
  emergencyContactLabel,
  flightTime,
  telHref,
  whatsappHref,
} from './TravelDashboard.utils'
import type { TravelDashboardProps, TripFlight } from './TravelDashboard.types'

function FlightSummary({ flight }: { flight: TripFlight }) {
  return (
    <>
      <S.CardTitle>
        {flight.flightNumber} · {flight.departureAirport} → {flight.arrivalAirport}
      </S.CardTitle>
      <S.CardText>
        {flight.airline}
        <br />
        {flightTime(flight.departsLocal, flight.departsZone, COPY.timeTbc)}
        {' → '}
        {flightTime(flight.arrivesLocal, flight.arrivesZone, COPY.timeTbc)}
        {flight.bookingReference && <><br />{COPY.bookingRef} {flight.bookingReference}</>}
      </S.CardText>
    </>
  )
}

/**
 * The travel dashboard, shown above the proposal on the share link once the
 * trip is under way: where things stand, tonight's stay, the next flight and
 * who to contact. Read-only once the trip is complete.
 */
export default function TravelDashboard({ itinerary }: TravelDashboardProps) {
  const { phase, completed, dateRange, daysToGo, tonight, tonightContacts, next } =
    useTravelDashboard(itinerary)
  const contact = itinerary.tripContact
  const contactLabel = contact ? contactName(contact.name, contact.email) : null
  const operator = itinerary.operatorContact

  return (
    <S.Block id={TRIP_SECTION_ID} data-cover-id={TRIP_SECTION_ID}>
      <S.Pretitle>{COPY.pretitle}</S.Pretitle>
      <S.Heading>{COPY.headings[phase]}</S.Heading>
      {(dateRange || daysToGo != null) && (
        <S.Subline>
          {dateRange}
          {dateRange && daysToGo != null && ' · '}
          {daysToGo != null && COPY.startsIn(daysToGo)}
        </S.Subline>
      )}
      {completed && <S.Note>{COPY.completedNote}</S.Note>}

      <S.Grid>
        {tonight && (
          <S.Card $highlight>
            <S.CardLabel>{COPY.tonight} · {COPY.dayOf(tonight.dayNumber)}</S.CardLabel>
            {tonight.stays.length > 0 ? (
              tonight.stays.map((stay) => <S.CardTitle key={stay}>{stay}</S.CardTitle>)
            ) : (
              <S.CardText>{COPY.noStayTonight}</S.CardText>
            )}
            {tonight.area && <S.CardText>{tonight.area}</S.CardText>}
            {tonightContacts.length > 0 && (
              <S.Emergency>
                <S.CardLabel>{COPY.emergency}</S.CardLabel>
                {tonightContacts.map((contact) => (
                  <S.EmergencyLine key={contact.id}>
                    {emergencyContactLabel(contact)}
                    {contact.phone && (
                      <> · <S.CardLink href={telHref(contact.phone)}>{contact.phone}</S.CardLink></>
                    )}
                    {contact.email && (
                      <> · <S.CardLink href={`mailto:${contact.email}`}>{contact.email}</S.CardLink></>
                    )}
                  </S.EmergencyLine>
                ))}
              </S.Emergency>
            )}
          </S.Card>
        )}
        {next && (
          <S.Card $highlight={!tonight}>
            <S.CardLabel>{COPY.nextFlight}</S.CardLabel>
            <FlightSummary flight={next} />
          </S.Card>
        )}
        {contactLabel && (
          <S.Card>
            <S.CardLabel>{COPY.contact}</S.CardLabel>
            <S.CardTitle>{contactLabel}</S.CardTitle>
            {contact?.email && (
              <S.CardLink href={`mailto:${contact.email}`}>{contact.email}</S.CardLink>
            )}
          </S.Card>
        )}
        {operator && (
          <S.Card>
            <S.CardLabel>{COPY.operatorContact}</S.CardLabel>
            <S.CardTitle>{operator.name}</S.CardTitle>
            {operator.phone && (
              <S.CardText>
                {COPY.phone}: <S.CardLink href={telHref(operator.phone)}>{operator.phone}</S.CardLink>
              </S.CardText>
            )}
            {operator.whatsapp && (
              <S.CardText>
                {COPY.whatsapp}:{' '}
                <S.CardLink href={whatsappHref(operator.whatsapp)} target="_blank" rel="noopener noreferrer">
                  {operator.whatsapp}
                </S.CardLink>
              </S.CardText>
            )}
            {operator.email && (
              <S.CardLink href={`mailto:${operator.email}`}>{operator.email}</S.CardLink>
            )}
          </S.Card>
        )}
      </S.Grid>

      {itinerary.flights.length > 0 && (
        <>
          <S.SectionLabel>{COPY.flights}</S.SectionLabel>
          <S.FlightList>
            {itinerary.flights.map((flight) => (
              <S.FlightRow key={flight.id}>
                <S.FlightDirection>{DIRECTION_LABELS[flight.direction]}</S.FlightDirection>
                <S.FlightCode>{flight.flightNumber}</S.FlightCode>
                <S.CardText>
                  {flight.departureAirport} → {flight.arrivalAirport} ·{' '}
                  {flightTime(flight.departsLocal, flight.departsZone, COPY.timeTbc)}
                  {flight.travellerName && ` · ${flight.travellerName}`}
                </S.CardText>
              </S.FlightRow>
            ))}
          </S.FlightList>
        </>
      )}
    </S.Block>
  )
}
