'use client'

import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { ActionButton } from '@/components/itineraries/shared/ActionButton'
import {
  Field,
  FieldLabel,
  FieldInput,
  FieldTextarea,
  FieldSelect,
} from '@/components/itineraries/shared/FieldPrimitives'
import type {
  AirportZone,
  FlightDirection,
  FlightSegmentInput,
} from '@/stores/builderStore'
import { allTimeZones, zoneCity } from '@/lib/flight-time'
import * as S from './FlightModal.styled'

interface Props {
  /** The flight being edited — saved, or still only in a form; omitted when adding. */
  flight?: FlightSegmentInput
  airportZones: AirportZone[]
  /** Resolves to an error message, or null once saved. */
  onSubmit: (input: FlightSegmentInput) => Promise<string | null>
  onCancel: () => void
}

const DIRECTIONS: { value: FlightDirection; label: string }[] = [
  { value: 'ARRIVAL', label: 'Arrival — into the destination' },
  { value: 'INTERNAL', label: 'Internal — within the trip' },
  { value: 'DEPARTURE', label: 'Departure — heading home' },
]

/**
 * Adds or edits one flight. Times are entered as printed on the ticket; each
 * end's time zone comes from the airport code when it is known, and can be
 * overridden — or must be chosen, when the code is not in the list.
 */
export default function FlightModal({ flight, airportZones, onSubmit, onCancel }: Props) {
  const zoneByCode = useMemo(
    () => new Map(airportZones.map((a) => [a.code, a.zone])),
    [airportZones],
  )
  const zones = useMemo(() => allTimeZones(), [])
  const known = (code: string) => zoneByCode.get(code.trim().toUpperCase()) ?? null

  const [form, setForm] = useState({
    direction: flight?.direction ?? 'ARRIVAL',
    airline: flight?.airline ?? '',
    flightNumber: flight?.flightNumber ?? '',
    departureAirport: flight?.departureAirport ?? '',
    arrivalAirport: flight?.arrivalAirport ?? '',
    departsLocal: flight?.departsLocal ?? '',
    arrivesLocal: flight?.arrivesLocal ?? '',
    bookingReference: flight?.bookingReference ?? '',
    travellerName: flight?.travellerName ?? '',
    notes: flight?.notes ?? '',
  })
  // '' means "use the airport's zone". A stored zone that differs from the
  // airport's was chosen by hand, so it is shown as the override.
  const [departsZone, setDepartsZone] = useState(
    initialOverride(flight?.departsZone, flight ? zoneByCode.get(flight.departureAirport) : undefined),
  )
  const [arrivesZone, setArrivesZone] = useState(
    initialOverride(flight?.arrivesZone, flight ? zoneByCode.get(flight.arrivalAirport) : undefined),
  )
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const missing = firstMissing(form)
    if (missing) return setError(`${missing} is required.`)
    for (const [local, code, choice] of [
      [form.departsLocal, form.departureAirport, departsZone],
      [form.arrivesLocal, form.arrivalAirport, arrivesZone],
    ]) {
      if (local && !choice && !known(code)) {
        return setError(`Choose the time zone for ${code.trim().toUpperCase()}.`)
      }
    }

    setError(null)
    setSubmitting(true)
    const err = await onSubmit({
      direction: form.direction,
      airline: form.airline,
      flightNumber: form.flightNumber,
      departureAirport: form.departureAirport,
      arrivalAirport: form.arrivalAirport,
      departsLocal: form.departsLocal || null,
      departsZone: departsZone || null,
      arrivesLocal: form.arrivesLocal || null,
      arrivesZone: arrivesZone || null,
      bookingReference: form.bookingReference || null,
      travellerName: form.travellerName || null,
      notes: form.notes || null,
    })
    setSubmitting(false)
    if (err) setError(err)
  }

  function zonePicker(id: string, code: string, value: string, onChange: (zone: string) => void) {
    const auto = known(code)
    return (
      <Field>
        <FieldLabel htmlFor={id}>Time zone</FieldLabel>
        <FieldSelect id={id} value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">
            {auto ? `${zoneCity(auto)} (from ${code.trim().toUpperCase()})` : 'Choose time zone…'}
          </option>
          {zones.map((zone) => (
            <option key={zone} value={zone}>
              {zone.replace(/_/g, ' ')}
            </option>
          ))}
        </FieldSelect>
      </Field>
    )
  }

  return (
    <S.Overlay onClick={onCancel}>
      <S.Card onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} noValidate>
        <S.Title>{flight ? 'Edit flight' : 'Add a flight'}</S.Title>

        <S.Row $cols={1}>
          <Field>
            <FieldLabel htmlFor="flight-direction">Leg</FieldLabel>
            <FieldSelect
              id="flight-direction"
              value={form.direction}
              onChange={(e) => {
                const match = DIRECTIONS.find((d) => d.value === e.target.value)
                if (match) setForm((f) => ({ ...f, direction: match.value }))
              }}
            >
              {DIRECTIONS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </FieldSelect>
          </Field>
        </S.Row>

        <S.Row>
          <Field>
            <FieldLabel htmlFor="flight-airline">Airline *</FieldLabel>
            <FieldInput
              id="flight-airline"
              autoFocus
              value={form.airline}
              onChange={(e) => set('airline', e.target.value)}
              placeholder="e.g. Kenya Airways"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="flight-number">Flight number *</FieldLabel>
            <FieldInput
              id="flight-number"
              value={form.flightNumber}
              onChange={(e) => set('flightNumber', e.target.value)}
              placeholder="e.g. KQ 101"
            />
          </Field>
        </S.Row>

        <S.Section>
          <S.SectionLabel>Departs</S.SectionLabel>
          <S.Row $cols={3}>
            <Field>
              <FieldLabel htmlFor="flight-from">Airport *</FieldLabel>
              <FieldInput
                id="flight-from"
                value={form.departureAirport}
                onChange={(e) => set('departureAirport', e.target.value)}
                placeholder="LHR"
                maxLength={4}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="flight-departs">Local time</FieldLabel>
              <FieldInput
                id="flight-departs"
                type="datetime-local"
                value={form.departsLocal}
                onChange={(e) => set('departsLocal', e.target.value)}
              />
            </Field>
            {zonePicker('flight-departs-zone', form.departureAirport, departsZone, setDepartsZone)}
          </S.Row>
        </S.Section>

        <S.Section>
          <S.SectionLabel>Arrives</S.SectionLabel>
          <S.Row $cols={3}>
            <Field>
              <FieldLabel htmlFor="flight-to">Airport *</FieldLabel>
              <FieldInput
                id="flight-to"
                value={form.arrivalAirport}
                onChange={(e) => set('arrivalAirport', e.target.value)}
                placeholder="NBO"
                maxLength={4}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="flight-arrives">Local time</FieldLabel>
              <FieldInput
                id="flight-arrives"
                type="datetime-local"
                value={form.arrivesLocal}
                onChange={(e) => set('arrivesLocal', e.target.value)}
              />
            </Field>
            {zonePicker('flight-arrives-zone', form.arrivalAirport, arrivesZone, setArrivesZone)}
          </S.Row>
          <S.Hint>Enter times as printed on the ticket, in each airport&apos;s local time.</S.Hint>
        </S.Section>

        <S.Section>
          <S.Row>
            <Field>
              <FieldLabel htmlFor="flight-pnr">Airline booking ref</FieldLabel>
              <FieldInput
                id="flight-pnr"
                value={form.bookingReference}
                onChange={(e) => set('bookingReference', e.target.value)}
                placeholder="e.g. X7K2QP"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="flight-traveller">Traveller(s)</FieldLabel>
              <FieldInput
                id="flight-traveller"
                value={form.travellerName}
                onChange={(e) => set('travellerName', e.target.value)}
                placeholder="Leave blank if the whole party"
              />
            </Field>
          </S.Row>
          <Field>
            <FieldLabel htmlFor="flight-notes">Notes</FieldLabel>
            <FieldTextarea
              id="flight-notes"
              rows={2}
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
            />
          </Field>
        </S.Section>

        {error && <S.ErrorText>{error}</S.ErrorText>}

        <S.Actions>
          <ActionButton type="button" onClick={onCancel}>
            Cancel
          </ActionButton>
          <ActionButton type="submit" $variant="primary" $disabled={submitting} disabled={submitting}>
            {submitting ? 'Saving…' : flight ? 'Save Flight' : 'Add Flight'}
          </ActionButton>
        </S.Actions>
      </S.Card>
    </S.Overlay>
  )
}

function initialOverride(stored: string | null | undefined, airportDefault: string | undefined): string {
  if (!stored || stored === airportDefault) return ''
  return stored
}

function firstMissing(form: {
  airline: string
  flightNumber: string
  departureAirport: string
  arrivalAirport: string
}): string | null {
  if (!form.airline.trim()) return 'Airline'
  if (!form.flightNumber.trim()) return 'Flight number'
  if (!form.departureAirport.trim()) return 'Departure airport'
  if (!form.arrivalAirport.trim()) return 'Arrival airport'
  return null
}
