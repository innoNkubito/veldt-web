/** Section id of the dashboard — also its cover-panel sentinel. */
export const TRIP_SECTION_ID = 'trip'

export const DAY_MS = 24 * 60 * 60 * 1000
/** A row with no night count is taken to be one night. */
export const DEFAULT_ROW_NIGHTS = 1

export const COPY = {
  pretitle: 'Your Trip',
  headings: {
    before: 'Your trip is coming up',
    during: 'Your trip is under way',
    after: 'Your trip is complete',
    undated: 'Your trip',
  },
  completedNote: 'We hope you had a wonderful time. Your itinerary stays here for reference.',
  startsIn: (days: number) => (days === 1 ? 'Starts tomorrow' : `Starts in ${days} days`),
  nextFlight: 'Next flight',
  flights: 'Your flights',
  tonight: 'Tonight',
  dayOf: (day: number) => `Day ${day}`,
  noStayTonight: 'No accommodation listed for tonight.',
  emergency: 'In an emergency',
  contact: 'Your travel advisor',
  bookingRef: 'Ref',
  timeTbc: 'Time to be confirmed',
} as const

export const DIRECTION_LABELS = {
  ARRIVAL: 'Arrival',
  INTERNAL: 'Internal',
  DEPARTURE: 'Departure',
} as const

export const RANGE_FORMAT: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
}
export const LOCALE = 'en-GB'
