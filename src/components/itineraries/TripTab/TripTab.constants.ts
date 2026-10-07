import type { FlightDirection } from '@/stores/builderStore'

/** Display order of the flight groups. */
export const FLIGHT_GROUPS: { direction: FlightDirection; label: string }[] = [
  { direction: 'ARRIVAL', label: 'Arrival' },
  { direction: 'INTERNAL', label: 'Internal flights' },
  { direction: 'DEPARTURE', label: 'Departure' },
]

export const COPY = {
  flights: 'Flights',
  addFlight: 'Add Flight',
  empty:
    'No flights yet. Add the international arrival and departure, and any internal or bush flights between camps.',
  noFlights: 'No flights for this trip — the traveller is making their own way',
  deleteLabel: 'Delete',
} as const
