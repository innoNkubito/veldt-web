import type { AirportZone } from '@/stores/builderStore'

/** What the flights page needs to know about the trip. */
export interface FlightsPageTrip {
  proposalTitle: string
  status: string
}

export interface FlightsPageData {
  itineraryBySlug: FlightsPageTrip | null
  airportZones: AirportZone[]
}

/** loading → closed (wrong status / not found) or form → sent */
export type FlightsPagePhase = 'loading' | 'closed' | 'form' | 'sent'

/** Which flight the modal is editing: an index in the list, or a new one. */
export type FlightEditTarget = { index: number } | { index: null } | null
