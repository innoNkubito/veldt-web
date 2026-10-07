import type { FlightDirection, FlightSegment } from '@/stores/builderStore'
import { COPY } from './TripTab.constants'

/** Confirmed flights for the list; traveller submissions wait in the review queue. */
export function splitFlights(flights: FlightSegment[]) {
  return {
    confirmed: flights.filter((f) => f.confirmedByOperator),
    pending: flights.filter((f) => !f.confirmedByOperator),
  }
}

export function flightsIn(flights: FlightSegment[], direction: FlightDirection): FlightSegment[] {
  return flights.filter((f) => f.direction === direction)
}

export function deleteFlightDialog(flight: FlightSegment) {
  return {
    title: `Delete ${flight.flightNumber}?`,
    message: `${flight.departureAirport} → ${flight.arrivalAirport} will be removed from this trip.`,
    confirmLabel: COPY.deleteLabel,
    danger: true,
  }
}
