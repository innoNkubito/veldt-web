import { useState } from 'react'
import { useBuilderStore } from '@/stores/builderStore'
import type { FlightSegment } from '@/stores/builderStore'
import { confirmDialog } from '@/stores/confirmStore'
import { COPY } from './FlightReviewQueue.constants'

/** Approve or dismiss a traveller's submitted flights. */
export function useFlightReviewQueue() {
  const { saving, confirmFlight, deleteFlight } = useBuilderStore()
  const [error, setError] = useState<string | null>(null)

  async function approve(flight: FlightSegment) {
    setError(await confirmFlight(flight.id))
  }

  async function dismiss(flight: FlightSegment) {
    const ok = await confirmDialog({
      title: COPY.dismissTitle(flight.flightNumber),
      message: COPY.dismissMessage,
      confirmLabel: COPY.dismiss,
      danger: true,
    })
    if (ok) setError(await deleteFlight(flight.id))
  }

  return { saving, error, approve, dismiss }
}
