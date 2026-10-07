import type { BuilderTab } from './page.types'

export const TABS: { key: BuilderTab; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'trip', label: 'Trip' },
  { key: 'rows', label: 'Day-by-Day' },
  { key: 'costs', label: 'Costs' },
  { key: 'booking', label: 'Booking' },
  { key: 'preview', label: 'Preview' },
]

export const ITINERARIES_PATH = '/itineraries'

export const COPY = {
  loading: 'Loading itinerary…',
  notFound: 'Itinerary not found',
  back: '← Back to Itineraries',
  backLink: '← Itineraries',
  forPrefix: 'For',
  saving: 'Saving…',
  copyShareLink: 'Copy Share Link',
  publish: 'Publish',
  archive: 'Archive',
  undoConfirmation: 'Undo Confirmation',
  startTrip: 'Start Trip',
  completeTrip: 'Complete Trip',
  markConfirmed: 'Mark Confirmed',
  restore: 'Restore',
  dismiss: 'Dismiss',
} as const

export const UNDO_CONFIRM_DIALOG = {
  title: 'Undo confirmation?',
  message:
    'The trip goes back to being a published proposal. The traveller details and dates are kept.',
  confirmLabel: 'Undo Confirmation',
} as const

export const ARCHIVE_DIALOG = {
  title: 'Archive this itinerary?',
  message:
    'It leaves the working list and its share link stops working. You can restore it from the Archived tab.',
  confirmLabel: 'Archive',
  danger: true,
} as const

export const COMPLETE_TRIP_DIALOG = {
  title: 'Mark this trip complete?',
  message: 'The travel dashboard stays available to the traveller, read-only.',
  confirmLabel: 'Complete Trip',
} as const
