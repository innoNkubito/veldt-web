/**
 * DOM ids of builder sections that other places send the advisor to — the
 * Publish checklist's "Fix" links, the booking setup tracker and the
 * Financials tab's section nav. Used with `focusSection`.
 */
export const BUILDER_SECTION = {
  days: 'builder-days',
  financialsQuote: 'builder-financials-quote',
  financialsBooking: 'builder-financials-booking',
  financialsInvoices: 'builder-financials-invoices',
  bookingMode: 'builder-booking-mode',
  bookingProcessor: 'builder-booking-processor',
  bookingPackages: 'builder-booking-packages',
  bookingSchedule: 'builder-booking-schedule',
} as const

export type BuilderSectionId = (typeof BUILDER_SECTION)[keyof typeof BUILDER_SECTION]
