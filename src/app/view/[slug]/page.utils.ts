import type { PublicBookingOptions } from '@/stores/publicBookingStore'

/** Cheapest package with places left, for the "Packages from" line; null if none. */
export function lowestPackagePrice(options: PublicBookingOptions | null): number | null {
  const available = (options?.packages ?? []).filter((p) => p.remaining > 0)
  return available.length > 0 ? Math.min(...available.map((p) => p.price)) : null
}

/** Booking is offered unless the operator has switched it off. */
export function isBookable(options: PublicBookingOptions | null): options is PublicBookingOptions {
  return !!options && options.bookingMode !== 'OFF'
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
