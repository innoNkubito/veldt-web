// ── pageContent schema for PROPERTY ───────────────────────────
//
// The section shapes themselves are shared with the itinerary preview and the
// public view route, so they live in src/lib/pageContent.ts. What stays here
// is the property editor's own vocabulary: the pickable section list and the
// starting templates.

import type { ContentSection, PageContent } from '@/lib/pageContent'

export type {
  TextImageSection,
  FastFactsGroup,
  FastFactsSection,
  AccommodationSection,
  GallerySection,
} from '@/lib/pageContent'

export type PropertySection = ContentSection
export type PropertyPageContent = PageContent

export const SECTION_TYPES = [
  { value: 'overview', label: 'Overview' },
  { value: 'experience', label: 'Experience & Activities' },
  { value: 'accommodation', label: 'Accommodation' },
  { value: 'fastFacts', label: 'Fast Facts' },
  { value: 'gallery', label: 'Gallery' },
] as const

export type SectionType = (typeof SECTION_TYPES)[number]['value']

export function emptySection(type: SectionType): PropertySection {
  switch (type) {
    case 'fastFacts':
      return { type: 'fastFacts', groups: [{ label: '', items: [''] }] }
    case 'accommodation':
      return { type: 'accommodation', intro: '' }
    case 'gallery':
      return { type: 'gallery', images: [] }
    default:
      // 'overview' | 'experience' — narrowed by the cases above.
      return { type, text1: '', images: [], text2: '' }
  }
}

/** Default template for a new property page.
 *  Accommodation section is only included when the property already has rooms.
 *  FastFacts groups start empty — no placeholder labels. */
export function defaultTemplate(hasRooms: boolean): PropertyPageContent {
  const sections: PropertySection[] = [
    { type: 'overview', text1: '', images: [], text2: '' },
    { type: 'experience', text1: '', images: [], text2: '' },
  ]
  if (hasRooms) {
    sections.push({ type: 'accommodation', intro: '' })
  }
  sections.push({ type: 'fastFacts', groups: [{ label: '', items: [''] }] })
  return { sections }
}
