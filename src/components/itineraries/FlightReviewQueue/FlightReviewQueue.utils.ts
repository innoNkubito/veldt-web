import { formatFlightLocal, zoneCity } from '@/lib/flight-time'
import type { FlightSegment } from '@/stores/builderStore'

/** "LHR → NBO · 12 Oct, 19:15 London" — the line an operator checks against the booking. */
export function flightLine(flight: FlightSegment, timeFallback: string): string {
  const time = flight.departsLocal
    ? `${formatFlightLocal(flight.departsLocal)}${flight.departsZone ? ` ${zoneCity(flight.departsZone)}` : ''}`
    : timeFallback
  return `${flight.departureAirport} → ${flight.arrivalAirport} · ${time}`
}
