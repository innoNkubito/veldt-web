import { formatFlightLocal, zoneCity } from '@/lib/flight-time'
import type { FlightSegment } from '@/stores/builderStore'
import { COPY } from './FlightItem.constants'

/** "12 Oct, 19:15 Nairobi time" — airport-local, as on the ticket. */
export function endpoint(local: string | null, zone: string | null, fallback: string): string {
  if (!local) return fallback
  return zone ? `${formatFlightLocal(local)} ${zoneCity(zone)} time` : formatFlightLocal(local)
}

/** "Ref ABC123 · Ann · window seat" — the optional details that are set. */
export function flightMeta(flight: FlightSegment): string | null {
  const parts = [
    flight.bookingReference && `${COPY.refPrefix} ${flight.bookingReference}`,
    flight.travellerName,
    flight.notes,
  ].filter(Boolean)
  return parts.length > 0 ? parts.join(' · ') : null
}
