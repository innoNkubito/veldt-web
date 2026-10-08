import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { GraphQLClient } from 'graphql-request'
import { usePublicBookingStore } from '@/stores/publicBookingStore'
import { routeParam } from '@/lib/guards'
import {
  collectTaggedPages,
  hasCosts,
  resolveRowDates,
  slotsFor,
  sortByPosition,
  tripGlance,
  useCoverCrossfade,
} from '@/components/itineraries/ProposalSections'
import { GET_BY_SLUG, RECORD_VIEW } from './page.constants'
import {
  acceptsFlights,
  bookingPath,
  flightsPath,
  isBookable,
  isTripMode,
  lowestPackagePrice,
  sharePath,
} from './page.utils'
import type { PublicItinerary } from './page.types'

/**
 * Loads the itinerary behind a share link, records the view, and shapes it
 * for rendering. Booking options load independently — a non-bookable
 * itinerary resolves to null and the booking block is skipped.
 */
export function useSharePage() {
  const slug = routeParam(useParams()?.slug)
  const router = useRouter()
  const [itinerary, setItinerary] = useState<PublicItinerary | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const bookingOptions = usePublicBookingStore((s) => s.options)
  const fetchBookingOptions = usePublicBookingStore((s) => s.fetchOptions)
  const crossfade = useCoverCrossfade(itinerary)

  useEffect(() => {
    if (!slug) return
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (!apiUrl) return
    const client = new GraphQLClient(apiUrl)

    async function load() {
      try {
        const data = await client.request<{ itineraryBySlug: PublicItinerary | null }>(GET_BY_SLUG, { slug })
        if (data.itineraryBySlug) {
          setItinerary(data.itineraryBySlug)
          client.request(RECORD_VIEW, { slug }).catch(() => {})
        } else {
          setNotFound(true)
        }
      } catch {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    load()
    fetchBookingOptions(slug)
  }, [slug, fetchBookingOptions])

  const view = useMemo(() => {
    if (!itinerary) return null
    // Undated rows get a date from the trip start, so headings read as real days.
    const rows = resolveRowDates(sortByPosition(itinerary.rows), itinerary.startDate)
    return {
      rows,
      tripMode: isTripMode(itinerary.status),
      flightsLink: acceptsFlights(itinerary.status) ? flightsPath(itinerary.slug) : null,
      glance: tripGlance(rows),
      taggedPages: collectTaggedPages(rows),
      costs: hasCosts(itinerary.costs) ? itinerary.costs : null,
      afterCover: slotsFor(itinerary.infoPageSlots, 'AFTER_COVER'),
      beforeDayByDay: slotsFor(itinerary.infoPageSlots, 'BEFORE_DAY_BY_DAY'),
      endSlots: slotsFor(itinerary.infoPageSlots, 'END'),
    }
  }, [itinerary])

  const booking = isBookable(bookingOptions)
    ? {
        options: bookingOptions,
        fromPrice: lowestPackagePrice(bookingOptions),
        open: () => slug && router.push(bookingPath(slug)),
      }
    : null

  // For the print footer: the link the copy came from
  const shareUrl =
    itinerary && typeof window !== 'undefined' ? `${window.location.origin}${sharePath(itinerary.slug)}` : ''

  return { loading, notFound, itinerary, view, booking, shareUrl, ...crossfade }
}
