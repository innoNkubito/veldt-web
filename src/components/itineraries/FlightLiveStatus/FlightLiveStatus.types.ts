export type FlightLiveStatusValue =
  | 'SCHEDULED'
  | 'DELAYED'
  | 'DEPARTED'
  | 'LANDED'
  | 'CANCELLED'
  | 'DIVERTED'
  | 'UNKNOWN'

/** The live fields of a flight, as both the operator and the share link receive them. */
export interface LiveFlightFields {
  liveStatus: FlightLiveStatusValue | null
  estDepartsLocal: string | null
  estArrivesLocal: string | null
  departureDelayMinutes: number | null
  liveCheckedAt: string | null
  trackable: boolean
  departsZone: string | null
  arrivesZone: string | null
}

/** The operator also sees why a flight isn't tracked and when it was last checked. */
export type LiveStatusAudience = 'operator' | 'traveller'

export type LiveStatusTone = 'success' | 'warning' | 'danger' | 'info' | 'muted'

export interface LiveStatusView {
  tone: LiveStatusTone
  label: string
  detail: string | null
}

export interface FlightLiveStatusProps {
  flight: LiveFlightFields
  audience: LiveStatusAudience
}
