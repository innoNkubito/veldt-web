import type { CoverInfo, SlotKey } from './ProposalSections.types'

// ── Section ids. Each block's id doubles as its cover-panel sentinel. ──
export const COVER_PAGE_ID = 'cover-page'
export const DAY_BY_DAY_ID = 'day-by-day'
export const COSTS_ID = 'costs'
export const INFO_SLOT_PREFIX = 'infoslot-'
export const TAGGED_PREFIX = 'tagged-'
export const DAY_PREFIX = 'day-'
/** Attribute marking a block whose cover the panel should show when it is in view. */
export const COVER_ATTRIBUTE = 'data-cover-id'

// ── Info page slots, in page order ──
export const SLOT_ORDER: readonly SlotKey[] = ['AFTER_COVER', 'BEFORE_DAY_BY_DAY', 'END']
export const PRE_DAY_SLOTS: readonly SlotKey[] = ['AFTER_COVER', 'BEFORE_DAY_BY_DAY']
export const SLOT_LABELS: Readonly<Record<SlotKey, string>> = {
  AFTER_COVER: 'After Cover',
  BEFORE_DAY_BY_DAY: 'Before Day-by-Day',
  END: 'End',
}

// ── Cover panel ──
export const DEFAULT_COVER_LABEL = 'Itinerary'
/** The section is "in view" once its top passes this fraction of the scroll container. */
export const COVER_DETECTION_RATIO = 0.25
/** Fixed covers for sections that are not content pages; null title = the proposal title. */
export const SECTION_COVERS: Readonly<Record<string, { label: string; title: string | null }>> = {
  [DAY_BY_DAY_ID]: { label: 'Day by Day', title: 'Day-by-Day Itinerary' },
  [COSTS_ID]: { label: 'Investment', title: null },
  book: { label: 'Booking', title: null },
  trip: { label: 'Your Trip', title: null },
}
export const EMPTY_COVER: CoverInfo = { url: null, label: DEFAULT_COVER_LABEL, title: '' }

// ── Cover page ──
export const PROPOSAL_PRETITLE = 'Safari Proposal'
export const COVER_INTRO =
  'Welcome to your bespoke safari proposal. Within these pages you’ll find a ' +
  'day-by-day journey crafted around the wild places, hand-picked stays and ' +
  'unforgettable experiences selected especially for you.'
export const META_LABELS = {
  preparedFor: 'Prepared for',
  travelDates: 'Travel dates',
  duration: 'Duration',
} as const
export const GLANCE_LABELS = {
  destinations: 'Destinations',
  stays: 'Stays',
  experiences: 'Experiences',
} as const
export const LIST_SEPARATOR = ' · '
/** Only tagged pages of this type count as "experiences" in the glance. */
export const EXPERIENCE_CONTENT_TYPE = 'ACTIVITY'

// ── Day by day ──
export const DAY_BY_DAY_HEADING = 'Day-by-Day Itinerary'
export const DAY_COLUMN_LABELS = {
  activities: 'Transfers & Activities',
  accommodations: 'Accommodations',
} as const

// ── Costs ──
export const COSTS_HEADING = 'Investment'
export const COSTS_TBD_MESSAGE =
  'Pricing information will be provided shortly — please contact your advisor.'
export const COSTS_LABELS = {
  perPerson: 'per person',
  included: 'Included',
  excludes: 'Excludes',
} as const
export const MISC_NOTE_STYLE = { fontStyle: 'italic' } as const

// ── Day dates ──
export const DAY_MS = 24 * 60 * 60 * 1000
/** A row with no night count is taken to be one night. */
export const DEFAULT_ROW_NIGHTS = 1
