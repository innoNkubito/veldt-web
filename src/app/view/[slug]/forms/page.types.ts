import type { GuestFormField } from '@/lib/guestForms'

export interface PublicGuestForm {
  id: string
  name: string
  description: string | null
  perGuest: boolean
  questionCount: number
  fields: GuestFormField[]
}

export interface TripFormsData {
  itineraryBySlug: {
    slug: string
    proposalTitle: string
    status: string
    guestForms: { id: string; guestForm: PublicGuestForm }[]
  } | null
}

export type TripFormsState =
  | { phase: 'loading' }
  | { phase: 'closed'; error: string | null }
  | { phase: 'ready'; title: string; forms: PublicGuestForm[] }
