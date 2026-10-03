import { useMemo, useState } from 'react'
import {
  daysUntil,
  formatTripRange,
  localToday,
  nextFlight,
  tonightStay,
  tripPhase,
} from './TravelDashboard.utils'
import type { TravelDashboardItinerary } from './TravelDashboard.types'

/**
 * Where the traveller is in their trip, by their own device's date and clock:
 * the phase, tonight's stay and the next flight. A completed trip is always
 * shown as over, whatever the dates say.
 */
export function useTravelDashboard(itinerary: TravelDashboardItinerary) {
  // Read once per visit; the page is opened, not left running for days.
  const [now] = useState(() => new Date())

  return useMemo(() => {
    const today = localToday(now)
    const { startDate, endDate } = itinerary
    const completed = itinerary.status === 'COMPLETED'
    const phase = completed ? 'after' : tripPhase(today, startDate, endDate)

    return {
      phase,
      completed,
      dateRange: startDate && endDate ? formatTripRange(startDate, endDate) : null,
      daysToGo: phase === 'before' && startDate ? daysUntil(today, startDate) : null,
      tonight: phase === 'during' && startDate ? tonightStay(itinerary.rows, startDate, today) : null,
      next: completed ? null : nextFlight(itinerary.flights, now.getTime()),
    }
  }, [itinerary, now])
}
