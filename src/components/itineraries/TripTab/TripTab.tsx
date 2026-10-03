'use client'

import { useEffect, useState } from 'react'
import { useBuilderStore } from '@/stores/builderStore'
import type { FlightDirection, FlightSegment, FlightSegmentInput } from '@/stores/builderStore'
import { confirmDialog } from '@/stores/confirmStore'
import { ActionButton } from '@/components/itineraries/shared/ActionButton'
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldInput,
  CheckboxRow,
} from '@/components/itineraries/shared/FieldPrimitives'
import FlightModal from '@/components/itineraries/FlightModal'
import FlightReviewQueue from '@/components/itineraries/FlightReviewQueue'
import { formatFlightLocal, zoneCity } from '@/lib/flight-time'
import * as S from './TripTab.styled'

const GROUPS: { direction: FlightDirection; label: string }[] = [
  { direction: 'ARRIVAL', label: 'Arrival' },
  { direction: 'INTERNAL', label: 'Internal flights' },
  { direction: 'DEPARTURE', label: 'Departure' },
]

/**
 * The confirmed trip, as the operator runs it: who is travelling, when, and on
 * which flights. Shown from CONFIRMED onwards.
 */
export default function TripTab() {
  const {
    itinerary,
    saving,
    airportZones,
    fetchAirportZones,
    updateTripDetails,
    addFlight,
    updateFlight,
    deleteFlight,
  } = useBuilderStore()

  const [modal, setModal] = useState<{ flight?: FlightSegment } | null>(null)
  const [flightError, setFlightError] = useState<string | null>(null)

  useEffect(() => {
    fetchAirportZones()
  }, [fetchAirportZones])

  if (!itinerary) return null

  async function handleSaveFlight(input: FlightSegmentInput) {
    if (!itinerary) return null
    const err = modal?.flight
      ? await updateFlight(modal.flight.id, input)
      : await addFlight(itinerary.id, input)
    if (!err) setModal(null)
    return err
  }

  async function handleDeleteFlight(flight: FlightSegment) {
    const ok = await confirmDialog({
      title: `Delete ${flight.flightNumber}?`,
      message: `${flight.departureAirport} → ${flight.arrivalAirport} will be removed from this trip.`,
      confirmLabel: 'Delete',
      danger: true,
    })
    if (!ok) return
    setFlightError(await deleteFlight(flight.id))
  }

  async function handleNoFlights(checked: boolean) {
    if (!itinerary) return
    setFlightError(await updateTripDetails(itinerary.id, { noFlights: checked }))
  }

  // Traveller submissions wait in the review queue until approved.
  const flights = itinerary.flights.filter((f) => f.confirmedByOperator)
  const pending = itinerary.flights.filter((f) => !f.confirmedByOperator)

  return (
    <S.Grid>
      {/* Full width above the two cards, so it is the first thing seen. */}
      {pending.length > 0 && <FlightReviewQueue flights={pending} />}
      <TravellerCard key={itinerary.id} />

      <S.Card>
        <S.CardHeader>
          <S.CardTitle>Flights</S.CardTitle>
          <ActionButton $variant="primary" onClick={() => setModal({})}>
            Add Flight
          </ActionButton>
        </S.CardHeader>

        {flights.length === 0 ? (
          <>
            <S.Empty>
              No flights yet. Add the international arrival and departure, and any internal or
              bush flights between camps.
            </S.Empty>
            <CheckboxRow>
              <input
                type="checkbox"
                checked={itinerary.noFlights}
                disabled={saving}
                onChange={(e) => handleNoFlights(e.target.checked)}
              />
              No flights for this trip — the traveller is making their own way
            </CheckboxRow>
          </>
        ) : (
          GROUPS.map(({ direction, label }) => {
            const group = flights.filter((f) => f.direction === direction)
            if (group.length === 0) return null
            return (
              <S.Group key={direction}>
                <S.GroupLabel>{label}</S.GroupLabel>
                {group.map((flight) => (
                  <FlightItem
                    key={flight.id}
                    flight={flight}
                    onEdit={() => setModal({ flight })}
                    onDelete={() => handleDeleteFlight(flight)}
                  />
                ))}
              </S.Group>
            )
          })
        )}

        {flightError && <S.ErrorText>{flightError}</S.ErrorText>}
      </S.Card>

      {modal && (
        <FlightModal
          flight={modal.flight}
          airportZones={airportZones}
          onSubmit={handleSaveFlight}
          onCancel={() => setModal(null)}
        />
      )}
    </S.Grid>
  )
}

function FlightItem({
  flight,
  onEdit,
  onDelete,
}: {
  flight: FlightSegment
  onEdit: () => void
  onDelete: () => void
}) {
  const meta = [
    flight.bookingReference && `Ref ${flight.bookingReference}`,
    flight.travellerName,
    flight.notes,
  ].filter(Boolean)

  return (
    <S.FlightRow>
      <div>
        <S.FlightCode>{flight.flightNumber}</S.FlightCode>
        <S.FlightAirline>{flight.airline}</S.FlightAirline>
      </div>
      <div>
        <S.Route>
          {flight.departureAirport} → {flight.arrivalAirport}
        </S.Route>
        <S.Times>
          {endpoint(flight.departsLocal, flight.departsZone, 'Departure time to be confirmed')}
          {' · '}
          {endpoint(flight.arrivesLocal, flight.arrivesZone, 'arrival time to be confirmed')}
        </S.Times>
        {meta.length > 0 && <S.Meta>{meta.join(' · ')}</S.Meta>}
      </div>
      <S.RowActions>
        <ActionButton $variant="ghost" onClick={onEdit}>
          Edit
        </ActionButton>
        <ActionButton $variant="ghost" onClick={onDelete}>
          Delete
        </ActionButton>
      </S.RowActions>
    </S.FlightRow>
  )
}

function endpoint(local: string | null, zone: string | null, fallback: string): string {
  if (!local) return fallback
  return zone ? `${formatFlightLocal(local)} ${zoneCity(zone)} time` : formatFlightLocal(local)
}

/**
 * Traveller contact and trip dates. Once confirmed these cannot be cleared —
 * the API refuses, and the error is shown here.
 */
function TravellerCard() {
  const { itinerary, saving, updateTripDetails } = useBuilderStore()
  const [form, setForm] = useState({
    clientEmail: itinerary?.clientEmail ?? '',
    clientPhone: itinerary?.clientPhone ?? '',
    startDate: itinerary?.startDate ?? '',
    endDate: itinerary?.endDate ?? '',
  })
  const [dirty, setDirty] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
    setDirty(true)
    setError(null)
  }

  async function handleSave() {
    if (!itinerary) return
    const err = await updateTripDetails(itinerary.id, {
      clientEmail: form.clientEmail,
      clientPhone: form.clientPhone,
      startDate: form.startDate || null,
      endDate: form.endDate || null,
    })
    setError(err)
    if (!err) setDirty(false)
  }

  return (
    <S.Card>
      <S.CardHeader>
        <S.CardTitle>Traveller</S.CardTitle>
      </S.CardHeader>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="trip-email">Email</FieldLabel>
          <FieldInput
            id="trip-email"
            type="email"
            value={form.clientEmail}
            onChange={(e) => set('clientEmail', e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="trip-phone">Phone</FieldLabel>
          <FieldInput
            id="trip-phone"
            type="tel"
            value={form.clientPhone}
            onChange={(e) => set('clientPhone', e.target.value)}
          />
        </Field>
        <S.DateRow>
          <Field>
            <FieldLabel htmlFor="trip-start">Trip starts</FieldLabel>
            <FieldInput
              id="trip-start"
              type="date"
              value={form.startDate}
              onChange={(e) => set('startDate', e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="trip-end">Trip ends</FieldLabel>
            <FieldInput
              id="trip-end"
              type="date"
              value={form.endDate}
              min={form.startDate || undefined}
              onChange={(e) => set('endDate', e.target.value)}
            />
          </Field>
        </S.DateRow>
      </FieldGroup>

      {error && <S.ErrorText>{error}</S.ErrorText>}
      {dirty && (
        <S.CardFooter>
          <ActionButton $variant="primary" onClick={handleSave} $disabled={saving} disabled={saving}>
            {saving ? 'Saving…' : 'Save Traveller'}
          </ActionButton>
        </S.CardFooter>
      )}
      <S.Hint>Where trip updates will go. Never shown on the share link.</S.Hint>
    </S.Card>
  )
}
