/** Every date in the app reads the same way: "3 Oct 2026". */
export const DATE_LOCALE = 'en-GB'

export type DateInput = string | number | Date | null | undefined

/** short "3 Oct 2026" · long "3 October 2026" · full "Saturday, 3 October 2026" · day "Sat 3 Oct" */
export type DateStyle = 'short' | 'long' | 'full' | 'day'

const STYLES: Record<DateStyle, Intl.DateTimeFormatOptions> = {
  short: { day: 'numeric', month: 'short', year: 'numeric' },
  long: { day: 'numeric', month: 'long', year: 'numeric' },
  full: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
  day: { weekday: 'short', day: 'numeric', month: 'short' },
}

function toDate(value: DateInput): Date | null {
  if (value == null || value === '') return null
  const d = value instanceof Date ? value : new Date(value)
  return isNaN(d.getTime()) ? null : d
}

/**
 * Calendar dates — trip and row dates, installment and task due dates. They are
 * stored at UTC midnight, so they are formatted in UTC; formatting in the
 * viewer's zone shows the previous day anywhere west of UTC.
 */
export function formatDate(value: DateInput, style: DateStyle = 'short', fallback = '—'): string {
  const d = toDate(value)
  return d ? d.toLocaleDateString(DATE_LOCALE, { ...STYLES[style], timeZone: 'UTC' }) : fallback
}

/** Moments in time — createdAt, paidAt, invoice periods — shown in the viewer's zone. */
export function formatTimestamp(value: DateInput, style: DateStyle = 'short', fallback = '—'): string {
  const d = toDate(value)
  return d ? d.toLocaleDateString(DATE_LOCALE, STYLES[style]) : fallback
}
