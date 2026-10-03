import { gql } from 'graphql-request'

export const GET_FLIGHTS_PAGE = gql`
  query FlightsPage($slug: String!) {
    itineraryBySlug(slug: $slug) { proposalTitle status }
    airportZones { code zone }
  }
`

export const SUBMIT_FLIGHT_DETAILS = gql`
  mutation SubmitFlightDetails($slug: String!, $email: String!, $flights: [FlightSegmentInput!]!) {
    submitFlightDetails(slug: $slug, email: $email, flights: $flights)
  }
`

export const COPY = {
  back: '← Back to your itinerary',
  title: 'Send your flight details',
  intro:
    'Add each flight you’ve booked — arriving, internal and going home. Your travel advisor checks them before they appear on your itinerary.',
  emailLabel: 'Your email address',
  emailHint: 'The address your travel advisor has for you.',
  addFlight: 'Add a Flight',
  addAnother: 'Add Another Flight',
  edit: 'Edit',
  remove: 'Remove',
  empty: 'No flights added yet.',
  submit: 'Send to My Advisor',
  submitting: 'Sending…',
  loading: 'Loading…',
  closedTitle: 'Flight details can’t be sent here',
  closedBody: 'This link isn’t accepting flight details right now. Please contact your travel advisor.',
  sentTitle: 'Thank you',
  sentBody: (count: number) =>
    `Your advisor has received ${count} flight${count === 1 ? '' : 's'} and will check ${count === 1 ? 'it' : 'them'} shortly.`,
  missingEmail: 'Enter your email address.',
  noFlights: 'Add at least one flight.',
  timeTbc: 'time to be confirmed',
  submitFallback: 'Could not send your flight details',
  loadFallback: 'Could not load this page',
} as const
