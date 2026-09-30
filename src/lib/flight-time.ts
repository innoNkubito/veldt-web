/**
 * Flight times are shown exactly as printed on the ticket — the local
 * wall-clock at the airport — never converted to the viewer's zone. These
 * helpers only format the stored strings; they do no zone arithmetic.
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** "2026-10-12T19:15" → "12 Oct, 19:15". Returns the input unchanged if malformed. */
export function formatFlightLocal(local: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}:\d{2})$/.exec(local)
  if (!match) return local
  const [, , month, day, time] = match
  return `${Number(day)} ${MONTHS[Number(month) - 1] ?? month}, ${time}`
}

/** "Africa/Dar_es_Salaam" → "Dar es Salaam". */
export function zoneCity(zone: string): string {
  const city = zone.split('/').pop() ?? zone
  return city.replace(/_/g, ' ')
}

/** Every IANA zone the browser knows, for the manual zone picker. */
export function allTimeZones(): string[] {
  try {
    return Intl.supportedValuesOf('timeZone')
  } catch {
    return []
  }
}
