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
