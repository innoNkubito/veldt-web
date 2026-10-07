import { useEffect, useState } from 'react'
import { useBuilderStore } from '@/stores/builderStore'
import type { FlightSegment, FlightSegmentInput } from '@/stores/builderStore'
import { confirmDialog } from '@/stores/confirmStore'
import { deleteFlightDialog, splitFlights } from './TripTab.utils'

/** Flight list actions and the add/edit modal; errors stay in the tab. */
export function useTripTab() {
  const {
    itinerary,
    saving,
    airportZones,
    fetchAirportZones,
    updateTripDetails,
    addFlight,
    updateFlight,
    deleteFlight,
  } = useBuilderStore()

  // Open with no flight = adding; with a flight = editing it
  const [modal, setModal] = useState<{ flight?: FlightSegment } | null>(null)
  const [flightError, setFlightError] = useState<string | null>(null)

  useEffect(() => {
    fetchAirportZones()
  }, [fetchAirportZones])

  async function saveFlight(input: FlightSegmentInput) {
    if (!itinerary) return null
    const err = modal?.flight
      ? await updateFlight(modal.flight.id, input)
      : await addFlight(itinerary.id, input)
    if (!err) setModal(null)
    return err
  }

  async function removeFlight(flight: FlightSegment) {
    if (!(await confirmDialog(deleteFlightDialog(flight)))) return
    setFlightError(await deleteFlight(flight.id))
  }

  async function setNoFlights(checked: boolean) {
    if (!itinerary) return
    setFlightError(await updateTripDetails(itinerary.id, { noFlights: checked }))
  }

  const { confirmed, pending } = splitFlights(itinerary?.flights ?? [])

  return {
    itinerary,
    saving,
    airportZones,
    confirmed,
    pending,
    modal,
    openAdd: () => setModal({}),
    openEdit: (flight: FlightSegment) => setModal({ flight }),
    closeModal: () => setModal(null),
    saveFlight,
    removeFlight,
    setNoFlights,
    flightError,
  }
}
