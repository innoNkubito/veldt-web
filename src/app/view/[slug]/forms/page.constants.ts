import { gql } from 'graphql-request'

export const GET_TRIP_FORMS = gql`
  query TripForms($slug: String!) {
    itineraryBySlug(slug: $slug) {
      slug
      proposalTitle
      status
      guestForms {
        id
        guestForm {
          id name description perGuest questionCount
          fields { id type label helpText required options }
        }
      }
    }
  }
`

export const SUBMIT_GUEST_FORM = gql`
  mutation SubmitGuestForm(
    $slug: String!
    $guestFormId: ID!
    $guestName: String!
    $guestEmail: String
    $answers: [GuestFormAnswerInput!]!
  ) {
    submitGuestForm(
      slug: $slug
      guestFormId: $guestFormId
      guestName: $guestName
      guestEmail: $guestEmail
      answers: $answers
    )
  }
`

export const COPY = {
  back: '← Back to your itinerary',
  loading: 'Loading…',
  loadFallback: 'We couldn’t load these forms. Please try again in a moment.',
  closedTitle: 'Forms aren’t available',
  closedBody: 'There’s nothing to fill in for this trip right now. If you were expecting a form, please contact your travel advisor.',
  title: 'A few details before you travel',
  intro: 'Your travel advisor uses these to arrange permits, meals and anything else your trip needs. Each takes a few minutes.',
  fillIn: 'Fill in',
  questions: (n: number) => `${n} ${n === 1 ? 'question' : 'questions'}`,
  perGuestNote: 'One for each guest',
  perTripNote: 'One for your group',
} as const
