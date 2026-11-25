import { BUILDER_SECTION } from '@/lib/builderSections'

/** The tab's sections, in page order, for the section nav. */
export const SECTIONS = [
  { id: BUILDER_SECTION.financialsQuote, label: 'Quote', hint: 'What the proposal shows' },
  { id: BUILDER_SECTION.financialsBooking, label: 'Booking', hint: 'How the client books and pays' },
] as const
