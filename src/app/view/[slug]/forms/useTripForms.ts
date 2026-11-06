'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { routeParam } from '@/lib/guards'
import { gqlErrorMessage } from '@/lib/gql-error'
import { COPY, GET_TRIP_FORMS } from './page.constants'
import type { TripFormsData, TripFormsState } from './page.types'
import { publicClient, toTripFormsState } from './page.utils'

/** The trip's forms, for the list page and each form page. */
export function useTripForms() {
  const slug = routeParam(useParams()?.slug)
  const [state, setState] = useState<TripFormsState>({ phase: 'loading' })

  useEffect(() => {
    const client = publicClient()
    if (!slug || !client) return
    let live = true
    client
      .request<TripFormsData>(GET_TRIP_FORMS, { slug })
      .then((data) => live && setState(toTripFormsState(data)))
      .catch((err) => live && setState({ phase: 'closed', error: gqlErrorMessage(err, COPY.loadFallback) }))
    return () => {
      live = false
    }
  }, [slug])

  return { slug, state }
}
