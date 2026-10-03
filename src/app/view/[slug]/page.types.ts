/** The public share-link query's response shape. */

import type {
  EmergencyContact,
  OperatorContact,
  TripContact,
  TripFlight,
} from '@/components/itineraries/TravelDashboard'

export interface Room {
  id: string
  roomType: string
  description: string | null
  photos: string[]
}

export interface FullContentPage {
  id: string
  name: string
  type: string
  coverImageUrl: string | null
  pageContent: unknown
  rooms: Room[]
}

export interface InfoPageSlot {
  id: string
  slot: string
  position: number
  contentPage: FullContentPage
}

export interface PublicRow {
  id: string
  position: number
  dateLabel: string | null
  startDate: string | null
  numNights: number | null
  transfersText: string | null
  activitiesRichText: Record<string, unknown> | null
  accommodationsRichText: Record<string, unknown> | null
  areaPage: { id: string; name: string } | null
  activities: {
    id: string
    position: number
    contentPage: FullContentPage
  }[]
  accommodations: {
    id: string
    position: number
    contentPage: FullContentPage
    room: { id: string; roomType: string } | null
    areaPage: { id: string; name: string } | null
  }[]
}

export interface PublicItinerary {
  id: string
  proposalTitle: string
  preparedFor: string | null
  travelDates: string | null
  whiteLabel: boolean
  slug: string
  status: string
  startDate: string | null // YYYY-MM-DD
  endDate: string | null // YYYY-MM-DD
  /** Confirmed flights; empty until the trip is under way. */
  flights: TripFlight[]
  /** Null until the trip is under way. */
  tripContact: TripContact | null
  /** The operator's own contact details; null until the trip is under way or when none are set. */
  operatorContact: OperatorContact | null
  /** Property emergency contacts; empty until the trip is under way. */
  emergencyContacts: EmergencyContact[]
  infoPageSlots: InfoPageSlot[]
  rows: PublicRow[]
  costs: {
    pricePerPerson: number | null
    numGuests: number
    accommodationType: string | null
    currency: string
    costsToBeDetetermined: boolean
    costIncludes: string | null
    costExcludes: string | null
    costNotes: string | null
    notesVisible: boolean
    miscText: string | null
    miscVisible: boolean
    priceVisible: boolean
  } | null
}
