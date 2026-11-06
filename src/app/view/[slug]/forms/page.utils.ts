import { GraphQLClient } from 'graphql-request'
import type { TripFormsData, TripFormsState } from './page.types'

/** The share link's pages talk to the API without signing in. */
export function publicClient(): GraphQLClient | null {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  return apiUrl ? new GraphQLClient(apiUrl) : null
}

export const sharePath = (slug: string) => `/view/${slug}`
export const formsListPath = (slug: string) => `/view/${slug}/forms`
export const formPath = (slug: string, formId: string) => `/view/${slug}/forms/${formId}`

/** The API returns no forms unless the trip is accepting them, so "none" means closed. */
export function toTripFormsState(data: TripFormsData): TripFormsState {
  const trip = data.itineraryBySlug
  if (!trip || trip.guestForms.length === 0) return { phase: 'closed', error: null }
  return { phase: 'ready', title: trip.proposalTitle, forms: trip.guestForms.map((a) => a.guestForm) }
}
