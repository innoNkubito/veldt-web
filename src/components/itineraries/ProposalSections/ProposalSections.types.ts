import type { ProposalRoom } from '@/components/itineraries/ProposalBlocks'

/**
 * Structural shapes both the public share page and the builder's Preview tab
 * satisfy. Content-page fields are optional because the builder's row tags
 * carry less than the public query returns.
 */
export interface ProposalContentPage {
  id: string
  name: string
  type?: string
  coverImageUrl?: string | null
  pageContent?: unknown
  rooms?: ProposalRoom[]
}

export interface ProposalSlot {
  id: string
  slot: string
  position: number
  contentPage: ProposalContentPage
}

export interface ProposalRow {
  id: string
  position: number
  dateLabel: string | null
  startDate: string | null
  activitiesRichText: Record<string, unknown> | null
  accommodationsRichText: Record<string, unknown> | null
  areaPage: { id: string; name: string } | null
  activities: { id: string; position: number; contentPage: ProposalContentPage }[]
  accommodations: {
    id: string
    position: number
    contentPage: ProposalContentPage
    room: { id: string; roomType: string } | null
  }[]
}

export interface ProposalCostsData {
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
}

export interface ProposalItinerary {
  proposalTitle: string
  preparedFor: string | null
  travelDates: string | null
  infoPageSlots: ProposalSlot[]
  rows: ProposalRow[]
  costs: ProposalCostsData | null
}

export type SlotKey = 'AFTER_COVER' | 'BEFORE_DAY_BY_DAY' | 'END'

/** A row-tagged content page with its optional fields filled in. */
export interface TaggedPage {
  id: string
  name: string
  type: string
  coverImageUrl: string | null
  pageContent: unknown
  rooms: ProposalRoom[]
}

/** What the sticky cover panel shows for the section in view. */
export interface CoverInfo {
  url: string | null
  label: string
  title: string
}

export interface TripGlance {
  destinations: string[]
  stays: string[]
  experiences: string[]
}

export interface ProposalCoverPageProps {
  itinerary: Pick<ProposalItinerary, 'proposalTitle' | 'preparedFor' | 'travelDates'>
  dayCount: number
  glance: TripGlance
}

export interface ContentPageBlockProps {
  page: ProposalContentPage
  /** DOM id of the block — also the cover-panel sentinel. */
  blockId: string
  /** Prefix for section anchors inside the page. */
  pageId: string
}

export interface DayByDayProps {
  rows: ProposalRow[]
  /** Shown in place of the days when there are none; omit to show nothing. */
  emptyMessage?: string
}

export interface ProposalCostsProps {
  costs: ProposalCostsData
}
