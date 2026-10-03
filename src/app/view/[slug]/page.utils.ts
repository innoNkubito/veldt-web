import type { PublicBookingOptions } from '@/stores/publicBookingStore'

/** Cheapest package with places left, for the "Packages from" line; null if none. */
export function lowestPackagePrice(options: PublicBookingOptions | null): number | null {
  const available = (options?.packages ?? []).filter((p) => p.remaining > 0)
  return available.length > 0 ? Math.min(...available.map((p) => p.price)) : null
}

/**
 * Booking is offered on a confirmed trip (the API returns no options otherwise)
 * unless the operator has switched it off. Booking through Veldt also needs a
 * package with places left, so the block disappears once the trip is booked.
 */
export function isBookable(options: PublicBookingOptions | null): options is PublicBookingOptions {
  if (!options || options.bookingMode === 'OFF') return false
  return options.bookingMode !== 'VELDT' || lowestPackagePrice(options) != null
}

export const bookingPath = (slug: string) => `/view/${slug}/book`

/** Once the trip is under way the link leads with the travel dashboard. */
export function isTripMode(status: string): boolean {
  return status === 'TRAVELLING' || status === 'COMPLETED'
}

/** The traveller can send flight details while the trip is confirmed or travelling. */
export function acceptsFlights(status: string): boolean {
  return status === 'CONFIRMED' || status === 'TRAVELLING'
}

export const flightsPath = (slug: string) => `/view/${slug}/flights`
