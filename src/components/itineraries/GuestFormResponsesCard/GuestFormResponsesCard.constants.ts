export const COPY = {
  title: 'Guest Form Responses',
  newCount: (n: number) => `${n} new`,
  loading: 'Loading responses…',
  empty: 'No responses yet. Guests fill in forms from their itinerary link.',
  noForms: 'This trip asks for no forms — add some on the Overview tab.',
  newBadge: 'New',
  deleteNote: 'Responses are deleted when the trip is marked complete.',
} as const
