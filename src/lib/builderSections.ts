/**
 * DOM ids of builder sections that other places send the advisor to — the
 * Publish checklist's "Fix" links and the Booking tab's setup tracker.
 * Used with `focusSection`.
 */
export const BUILDER_SECTION = {
  days: 'builder-days',
  costsAccuracy: 'builder-costs-accuracy',
  bookingMode: 'builder-booking-mode',
  bookingProcessor: 'builder-booking-processor',
  bookingPackages: 'builder-booking-packages',
  bookingSchedule: 'builder-booking-schedule',
} as const

export type BuilderSectionId = (typeof BUILDER_SECTION)[keyof typeof BUILDER_SECTION]
