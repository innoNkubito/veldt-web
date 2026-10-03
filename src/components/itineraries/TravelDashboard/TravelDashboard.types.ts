/** A confirmed flight as the share link returns it. Times are airport-local. */
export interface TripFlight {
  id: string
  direction: 'ARRIVAL' | 'DEPARTURE' | 'INTERNAL'
  airline: string
  flightNumber: string
  departureAirport: string
  arrivalAirport: string
  departsLocal: string | null
  departsZone: string | null
  departsAt: string | null // UTC — ordering and "next flight" only, never displayed
  arrivesLocal: string | null
  arrivesZone: string | null
  bookingReference: string | null
  travellerName: string | null
}

/** The traveller's contact at the operator. */
export interface TripContact {
  name: string | null
  email: string | null
}

/** The day-by-day fields the dashboard needs to place tonight's stay. */
export interface TripRow {
  id: string
  position: number
  startDate: string | null
  numNights: number | null
  areaPage: { id: string; name: string } | null
  accommodations: {
    id: string
    position: number
    contentPage: { name: string }
    room: { roomType: string } | null
  }[]
}

export interface TravelDashboardItinerary {
  status: string
  startDate: string | null // YYYY-MM-DD
  endDate: string | null // YYYY-MM-DD
  rows: TripRow[]
  flights: TripFlight[]
  tripContact: TripContact | null
}

export interface TravelDashboardProps {
  itinerary: TravelDashboardItinerary
}

/** Where the viewer's today falls relative to the trip. */
export type TripPhase = 'before' | 'during' | 'after' | 'undated'

export interface TonightStay {
  dayNumber: number
  area: string | null
  stays: string[]
}
