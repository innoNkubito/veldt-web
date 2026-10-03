import { gql } from 'graphql-request'

export const CONTENT_PAGE_FIELDS = `
  id name type coverImageUrl pageContent
  rooms { id roomType description photos }
`

export const GET_BY_SLUG = gql`
  query GetBySlug($slug: String!) {
    itineraryBySlug(slug: $slug) {
      id proposalTitle preparedFor travelDates whiteLabel slug
      infoPageSlots {
        id slot position
        contentPage { ${CONTENT_PAGE_FIELDS} }
      }
      rows {
        id position dateLabel startDate numNights transfersText
        activitiesRichText accommodationsRichText
        areaPage { id name }
        activities {
          id position
          contentPage { ${CONTENT_PAGE_FIELDS} }
        }
        accommodations {
          id position
          contentPage { ${CONTENT_PAGE_FIELDS} }
          room { id roomType }
          areaPage { id name }
        }
      }
      costs {
        pricePerPerson numGuests accommodationType currency
        costsToBeDetetermined costIncludes costExcludes
        costNotes notesVisible miscText miscVisible priceVisible
      }
    }
  }
`

export const RECORD_VIEW = gql`
  mutation RecordView($slug: String!) {
    recordView(slug: $slug)
  }
`

/** Section id of the booking block — also its cover-panel sentinel. */
export const BOOK_SECTION_ID = 'book'

export const LOADING_MESSAGE = 'Loading your itinerary…'
export const NOT_FOUND = {
  title: 'Itinerary not found',
  body: 'This link may have expired or the itinerary is no longer published.',
} as const

export const BOOKING_COPY = {
  heading: 'Ready to travel?',
  requestIntro: 'Send a booking request and your travel advisor will confirm availability.',
  instantIntro: 'Secure your place — reserve online and pay the first installment.',
  externalIntro: 'Get in touch to secure your place on this journey.',
  requestButton: 'Request to book',
  bookButton: 'Book this trip',
  fromPrice: 'Packages from',
} as const

export const FOOTER_COPY = {
  before: 'Built with',
  brand: 'Veldt',
  after: '— the safari itinerary platform',
} as const
