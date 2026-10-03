import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { GraphQLClient } from 'graphql-request'
import { routeParam } from '@/lib/guards'
import { gqlErrorMessage } from '@/lib/gql-error'
import type { AirportZone, FlightSegmentInput } from '@/stores/builderStore'
import { COPY, GET_FLIGHTS_PAGE, SUBMIT_FLIGHT_DETAILS } from './page.constants'
import { acceptsFlights, upsertAt } from './page.utils'
import type { FlightEditTarget, FlightsPageData, FlightsPagePhase } from './page.types'

function publicClient(): GraphQLClient | null {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  return apiUrl ? new GraphQLClient(apiUrl) : null
}

/**
 * The traveller's flight form: flights are collected locally, then sent in
 * one go with the traveller's email, which the API checks against the trip.
 */
export function useFlightsPage() {
  const slug = routeParam(useParams()?.slug)
  const [phase, setPhase] = useState<FlightsPagePhase>('loading')
  const [title, setTitle] = useState('')
  const [airportZones, setAirportZones] = useState<AirportZone[]>([])
  const [email, setEmail] = useState('')
  const [flights, setFlights] = useState<FlightSegmentInput[]>([])
  const [editing, setEditing] = useState<FlightEditTarget>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [sentCount, setSentCount] = useState(0)

  useEffect(() => {
    const client = publicClient()
    if (!slug || !client) return
    client
      .request<FlightsPageData>(GET_FLIGHTS_PAGE, { slug })
      .then((data) => {
        const trip = data.itineraryBySlug
        setAirportZones(data.airportZones)
        if (!trip || !acceptsFlights(trip.status)) return setPhase('closed')
        setTitle(trip.proposalTitle)
        setPhase('form')
      })
      .catch((err) => {
        setError(gqlErrorMessage(err, COPY.loadFallback))
        setPhase('closed')
      })
  }, [slug])

  /** Called by the flight modal; never fails — the API validates on send. */
  async function saveFlight(flight: FlightSegmentInput): Promise<string | null> {
    if (!editing) return null
    setFlights((list) => upsertAt(list, editing.index, flight))
    setEditing(null)
    return null
  }

  function removeFlight(index: number) {
    setFlights((list) => list.filter((_, i) => i !== index))
  }

  async function submit() {
    const client = publicClient()
    if (!slug || !client) return
    if (!email.trim()) return setError(COPY.missingEmail)
    if (flights.length === 0) return setError(COPY.noFlights)

    setError(null)
    setSubmitting(true)
    try {
      const data = await client.request<{ submitFlightDetails: number }>(SUBMIT_FLIGHT_DETAILS, {
        slug,
        email,
        flights,
      })
      setSentCount(data.submitFlightDetails)
      setPhase('sent')
    } catch (err) {
      setError(gqlErrorMessage(err, COPY.submitFallback))
    } finally {
      setSubmitting(false)
    }
  }

  return {
    slug,
    phase,
    title,
    airportZones,
    email,
    setEmail,
    flights,
    editing,
    editingFlight: editing && editing.index != null ? flights[editing.index] : undefined,
    startAdd: () => setEditing({ index: null }),
    startEdit: (index: number) => setEditing({ index }),
    cancelEdit: () => setEditing(null),
    saveFlight,
    removeFlight,
    submit,
    submitting,
    error,
    sentCount,
  }
}
