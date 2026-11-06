export const COPY = {
  title: 'Guest Forms',
  description:
    'Forms your guests fill in from their itinerary link — passport details, dietary needs, emergency ' +
    'contacts. They can fill them in once the trip is confirmed and right through the trip.',
  libraryLink: 'Manage forms in the library',
  loading: 'Loading forms…',
  empty: 'No forms on this trip yet.',
  addLabel: 'Add a form',
  addPlaceholder: 'Choose a form…',
  noneLeft: 'Every form in your library is already on this trip.',
  noLibrary: 'Your library has no guest forms yet.',
  archived: 'Archived',
  moveUp: 'Move up',
  moveDown: 'Move down',
  remove: 'Remove',
} as const

/** What the guest can do with the forms right now, by trip status. */
export const STATUS_NOTE: Record<string, string> = {
  DRAFT: 'Guests will see these forms once you confirm the trip.',
  PUBLISHED: 'Guests will see these forms once you confirm the trip.',
  CONFIRMED: 'Guests can fill these in from their itinerary link.',
  TRAVELLING: 'Guests can still fill these in during the trip.',
  COMPLETED: 'This trip is completed, so its forms can no longer change.',
  ARCHIVED: 'This trip is archived, so its forms can no longer change.',
}

export const LIBRARY_PATH = '/library/guest-forms'
