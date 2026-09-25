'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import { ActionButton } from '@/components/itineraries/shared/ActionButton'
import type { ItineraryFull, TripDetailsInput } from '@/stores/builderStore'
import * as S from './ConfirmTripModal.styled'

interface Props {
  itinerary: ItineraryFull
  /** Resolves to an error message, or null once the trip is confirmed. */
  onSubmit: (trip: TripDetailsInput) => Promise<string | null>
  onCancel: () => void
}

/**
 * Records the customer's yes. Confirming needs the traveller's email and the
 * trip dates, so they are collected here and saved in the same step.
 */
export default function ConfirmTripModal({ itinerary, onSubmit, onCancel }: Props) {
  const suggested = datesFromRows(itinerary)
  const [clientEmail, setClientEmail] = useState(itinerary.clientEmail ?? '')
  const [clientPhone, setClientPhone] = useState(itinerary.clientPhone ?? '')
  const [startDate, setStartDate] = useState(itinerary.startDate ?? suggested.startDate)
  const [endDate, setEndDate] = useState(itinerary.endDate ?? suggested.endDate)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const prefilledFromRows = !itinerary.startDate && suggested.startDate !== ''

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!clientEmail.trim()) return setError("Add the traveller's email address.")
    if (!startDate || !endDate) return setError('Add the trip start and end dates.')
    if (endDate < startDate) return setError('The trip cannot end before it starts.')

    setError(null)
    setSubmitting(true)
    const err = await onSubmit({ clientEmail, clientPhone, startDate, endDate })
    setSubmitting(false)
    if (err) setError(err)
  }

  return (
    <S.Overlay onClick={onCancel}>
      <S.Card onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} noValidate>
        <S.Title>Confirm this trip</S.Title>
        <S.Sub>
          Record that {itinerary.preparedFor ?? 'the customer'} has said yes. The traveller&apos;s
          email is where trip updates will go.
        </S.Sub>

        <S.FieldGroup>
          <S.FieldLabel htmlFor="confirm-email">Traveller email</S.FieldLabel>
          <S.FieldInput
            id="confirm-email"
            type="email"
            autoFocus
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
          />
        </S.FieldGroup>

        <S.FieldGroup>
          <S.FieldLabel htmlFor="confirm-phone">Traveller phone (optional)</S.FieldLabel>
          <S.FieldInput
            id="confirm-phone"
            type="tel"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
          />
        </S.FieldGroup>

        <S.FieldGroup>
          <S.FieldRow>
            <div>
              <S.FieldLabel htmlFor="confirm-start">Trip starts</S.FieldLabel>
              <S.FieldInput
                id="confirm-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <S.FieldLabel htmlFor="confirm-end">Trip ends</S.FieldLabel>
              <S.FieldInput
                id="confirm-end"
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </S.FieldRow>
          {prefilledFromRows && <S.Hint>Suggested from the day-by-day dates.</S.Hint>}
        </S.FieldGroup>

        {error && <S.ErrorText>{error}</S.ErrorText>}

        <S.Actions>
          <ActionButton type="button" onClick={onCancel}>
            Cancel
          </ActionButton>
          <ActionButton type="submit" $variant="primary" $disabled={submitting} disabled={submitting}>
            {submitting ? 'Confirming…' : 'Confirm Trip'}
          </ActionButton>
        </S.Actions>
      </S.Card>
    </S.Overlay>
  )
}

/**
 * Earliest row start and latest row end (or start), as YYYY-MM-DD. Row dates
 * are stored at UTC midnight, so the ISO date part is the calendar date.
 */
function datesFromRows(itinerary: ItineraryFull): { startDate: string; endDate: string } {
  const starts: string[] = []
  const ends: string[] = []
  for (const row of itinerary.rows) {
    if (row.startDate) starts.push(toDay(row.startDate))
    const end = row.endDate ?? row.startDate
    if (end) ends.push(toDay(end))
  }
  starts.sort()
  ends.sort()
  return { startDate: starts[0] ?? '', endDate: ends[ends.length - 1] ?? '' }
}

function toDay(value: string): string {
  const date = new Date(value)
  return isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10)
}
