'use client'

import { ActionButton } from '@/components/itineraries/shared/ActionButton'
import { CheckboxRow } from '@/components/itineraries/shared/FieldPrimitives'
import FlightModal from '@/components/itineraries/FlightModal'
import FlightReviewQueue from '@/components/itineraries/FlightReviewQueue'
import * as S from './TripTab.styled'
import FlightItem from './FlightItem'
import TravellerCard from './TravellerCard'
import { useTripTab } from './useTripTab'
import { COPY, FLIGHT_GROUPS } from './TripTab.constants'
import { flightsIn } from './TripTab.utils'

/**
 * The confirmed trip, as the operator runs it: who is travelling, when, and on
 * which flights. Shown from CONFIRMED onwards.
 */
export default function TripTab() {
  const {
    itinerary, saving, airportZones, confirmed, pending,
    modal, openAdd, openEdit, closeModal, saveFlight, removeFlight, setNoFlights, flightError,
  } = useTripTab()

  if (!itinerary) return null

  return (
    <S.Grid>
      {/* Full width above the two cards, so it is the first thing seen. */}
      {pending.length > 0 && <FlightReviewQueue flights={pending} />}
      <TravellerCard key={itinerary.id} />

      <S.Card>
        <S.CardHeader>
          <S.CardTitle>{COPY.flights}</S.CardTitle>
          <ActionButton $variant="primary" onClick={openAdd}>
            {COPY.addFlight}
          </ActionButton>
        </S.CardHeader>

        {confirmed.length === 0 ? (
          <>
            <S.Empty>{COPY.empty}</S.Empty>
            <CheckboxRow>
              <input
                type="checkbox"
                checked={itinerary.noFlights}
                disabled={saving}
                onChange={(e) => setNoFlights(e.target.checked)}
              />
              {COPY.noFlights}
            </CheckboxRow>
          </>
        ) : (
          FLIGHT_GROUPS.map(({ direction, label }) => {
            const group = flightsIn(confirmed, direction)
            if (group.length === 0) return null
            return (
              <S.Group key={direction}>
                <S.GroupLabel>{label}</S.GroupLabel>
                {group.map((flight) => (
                  <FlightItem
                    key={flight.id}
                    flight={flight}
                    showLiveStatus={itinerary.status !== 'COMPLETED'}
                    onEdit={() => openEdit(flight)}
                    onDelete={() => removeFlight(flight)}
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
          onSubmit={saveFlight}
          onCancel={closeModal}
        />
      )}
    </S.Grid>
  )
}
