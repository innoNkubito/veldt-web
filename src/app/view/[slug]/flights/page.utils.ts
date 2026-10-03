import { formatFlightLocal, zoneCity } from '@/lib/flight-time'
import type { FlightSegmentInput } from '@/stores/builderStore'

/** The share link takes flight details while the trip is confirmed or travelling. */
export function acceptsFlights(status: string): boolean {
  return status === 'CONFIRMED' || status === 'TRAVELLING'
}

/** "KQ 101 · LHR → NBO · 12 Oct, 19:15 London" */
export function flightSummary(flight: FlightSegmentInput, timeFallback: string): string {
  const time = flight.departsLocal
    ? `${formatFlightLocal(flight.departsLocal)}${flight.departsZone ? ` ${zoneCity(flight.departsZone)}` : ''}`
    : timeFallback
  return `${flight.flightNumber.toUpperCase()} · ${flight.departureAirport.toUpperCase()} → ${flight.arrivalAirport.toUpperCase()} · ${time}`
}

/** A new list with the item at `index` replaced, or appended when index is null. */
export function upsertAt<T>(items: readonly T[], index: number | null, item: T): T[] {
  if (index == null) return [...items, item]
  return items.map((existing, i) => (i === index ? item : existing))
}

export const backPath = (slug: string) => `/view/${slug}`
