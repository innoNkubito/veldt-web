import { formatFlightLocal, zoneCity } from '@/lib/flight-time'
import { formatTimestamp } from '@/lib/dates'
import { COPY, DELAY_DISPLAY_MINUTES } from './FlightLiveStatus.constants'
import type { LiveFlightFields, LiveStatusAudience, LiveStatusView } from './FlightLiveStatus.types'

/** 75 → "1 h 15 min", 45 → "45 min", 120 → "2 h". */
export function describeDelay(minutes: number): string {
  const abs = Math.abs(minutes)
  const h = Math.floor(abs / 60)
  const m = abs % 60
  if (h === 0) return `${m} min`
  return m === 0 ? `${h} h` : `${h} h ${m} min`
}

/** "2026-10-04T00:50" + "Africa/Nairobi" → "4 Oct, 00:50 Nairobi time" — airport-local, never converted. */
export function localTime(local: string | null, zone: string | null): string | null {
  if (!local) return null
  return zone ? `${formatFlightLocal(local)} ${zoneCity(zone)} time` : formatFlightLocal(local)
}

/** "Checked 6 Oct 2026, 14:05" in the viewer's zone. */
export function checkedLabel(iso: string | null): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (isNaN(d.getTime())) return null
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  return `${COPY.checked} ${formatTimestamp(d)}, ${time}`
}

function withPrefix(prefix: string, value: string | null): string | null {
  return value ? `${prefix} ${value}` : null
}

/**
 * What to show for a flight's live status, or null to show nothing. The
 * traveller only sees real statuses; the operator also sees why a flight isn't
 * tracked yet, or can't be.
 */
export function liveStatusView(flight: LiveFlightFields, audience: LiveStatusAudience): LiveStatusView | null {
  const operator = audience === 'operator'
  const departs = localTime(flight.estDepartsLocal, flight.departsZone)
  const arrives = localTime(flight.estArrivesLocal, flight.arrivesZone)

  switch (flight.liveStatus) {
    case null:
      if (!operator) return null
      return flight.trackable
        ? { tone: 'muted', label: COPY.notYet, detail: COPY.notYetDetail }
        : { tone: 'muted', label: COPY.untrackable, detail: COPY.untrackableDetail }
    case 'UNKNOWN':
      return operator ? { tone: 'muted', label: COPY.unknown, detail: null } : null
    case 'CANCELLED':
      return { tone: 'danger', label: COPY.cancelled, detail: operator ? null : COPY.advisorInformed }
    case 'DIVERTED':
      return { tone: 'danger', label: COPY.diverted, detail: operator ? null : COPY.advisorInformed }
    case 'LANDED':
      return { tone: 'success', label: COPY.landed, detail: withPrefix(COPY.arrived, arrives) }
    case 'DEPARTED':
      return { tone: 'info', label: COPY.departed, detail: withPrefix(COPY.expectedArrival, arrives) }
    case 'SCHEDULED':
    case 'DELAYED': {
      const delay = flight.departureDelayMinutes ?? 0
      if (delay >= DELAY_DISPLAY_MINUTES) {
        return {
          tone: 'warning',
          label: `${COPY.delayed} ${describeDelay(delay)}`,
          detail: withPrefix(COPY.nowDeparts, departs),
        }
      }
      return { tone: 'success', label: COPY.onTime, detail: null }
    }
  }
}
