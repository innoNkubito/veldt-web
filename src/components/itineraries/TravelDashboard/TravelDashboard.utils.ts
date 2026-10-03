import { formatFlightLocal, zoneCity } from '@/lib/flight-time'
import { DAY_MS, DEFAULT_ROW_NIGHTS } from './TravelDashboard.constants'
import { formatDate } from '@/lib/dates'
import type {
  EmergencyContact,
  TonightStay,
  TripFlight,
  TripPhase,
  TripRow,
} from './TravelDashboard.types'

/** "YYYY-MM-DD" (or a full ISO string) → that calendar date at UTC midnight, in ms. */
export function dayValue(date: string): number {
  return Date.parse(`${date.slice(0, 10)}T00:00:00.000Z`)
}

/** The viewer's own calendar date, as a UTC-midnight value comparable with `dayValue`. */
export function localToday(now: Date): number {
  return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
}

export function tripPhase(today: number, start: string | null, end: string | null): TripPhase {
  if (!start || !end) return 'undated'
  if (today < dayValue(start)) return 'before'
  if (today > dayValue(end)) return 'after'
  return 'during'
}

export function daysUntil(today: number, start: string): number {
  return Math.round((dayValue(start) - today) / DAY_MS)
}

/**
 * Where tonight is spent. Each row covers `numNights` nights from its own
 * start date, or — when it has none — from where the previous row ended
 * (the first row starts on the trip's start date).
 */
export function tonightStay(rows: TripRow[], tripStart: string, today: number): TonightStay | null {
  let cursor = dayValue(tripStart)
  for (const row of [...rows].sort((a, b) => a.position - b.position)) {
    const start = row.startDate ? dayValue(row.startDate) : cursor
    const end = start + (row.numNights ?? DEFAULT_ROW_NIGHTS) * DAY_MS
    if (today >= start && today < end) {
      const accommodations = [...row.accommodations].sort((a, b) => a.position - b.position)
      return {
        dayNumber: Math.round((today - dayValue(tripStart)) / DAY_MS) + 1,
        area: row.areaPage?.name ?? null,
        stays: accommodations.map((a) =>
          a.room ? `${a.contentPage.name} — ${a.room.roomType}` : a.contentPage.name,
        ),
        pageIds: [...new Set(accommodations.map((a) => a.contentPage.id))],
      }
    }
    cursor = end
  }
  return null
}

/** The first flight that has not yet departed; flights arrive sorted by departure. */
export function nextFlight(flights: TripFlight[], now: number): TripFlight | null {
  return flights.find((f) => f.departsAt && Date.parse(f.departsAt) > now) ?? null
}

/** "19:15, 12 Oct · London" — as printed on the ticket. */
export function flightTime(local: string | null, zone: string | null, fallback: string): string {
  if (!local) return fallback
  return zone ? `${formatFlightLocal(local)} · ${zoneCity(zone)}` : formatFlightLocal(local)
}

export function formatTripRange(start: string, end: string): string {
  const format = (d: string) => formatDate(dayValue(d))
  return `${format(start)} – ${format(end)}`
}

export function contactName(name: string | null, email: string | null): string | null {
  return name ?? email
}

/** Emergency contacts for the properties stayed at tonight. */
export function contactsFor(contacts: EmergencyContact[], pageIds: string[]): EmergencyContact[] {
  return contacts.filter((c) => pageIds.includes(c.pageId))
}

/** "Jane · Camp Manager" — whichever parts exist. */
export function emergencyContactLabel(contact: EmergencyContact): string {
  return [contact.name, contact.role].filter(Boolean).join(' · ')
}

/** A dialable tel: link — spaces, dashes and brackets removed. */
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`

/** A WhatsApp chat link — wa.me takes the number as digits only, no "+". */
export const whatsappHref = (number: string) => `https://wa.me/${number.replace(/\D/g, '')}`
