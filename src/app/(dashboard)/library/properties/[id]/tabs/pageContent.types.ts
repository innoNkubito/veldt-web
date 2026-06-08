// ── pageContent schema for PROPERTY ───────────────────────────

export interface TextImageSection {
  type: 'overview' | 'experience'
  text1: string
  images: string[]
  text2: string
}

export interface FastFactsGroup {
  label: string
  items: string[]
}

export interface FastFactsSection {
  type: 'fastFacts'
  groups: FastFactsGroup[]
}

/** Rooms are rendered live from property.rooms; only intro text is stored. */
export interface AccommodationSection {
  type: 'accommodation'
  intro: string
}

export type PropertySection = TextImageSection | FastFactsSection | AccommodationSection

export interface PropertyPageContent {
  sections: PropertySection[]
}

export const SECTION_TYPES = [
  { value: 'overview', label: 'Overview' },
  { value: 'experience', label: 'Experience & Activities' },
  { value: 'accommodation', label: 'Accommodation' },
  { value: 'fastFacts', label: 'Fast Facts' },
] as const

export type SectionType = (typeof SECTION_TYPES)[number]['value']

export function emptySection(type: SectionType): PropertySection {
  if (type === 'fastFacts') {
    return { type: 'fastFacts', groups: [{ label: '', items: [''] }] }
  }
  if (type === 'accommodation') {
    return { type: 'accommodation', intro: '' }
  }
  return { type: type as 'overview' | 'experience', text1: '', images: [], text2: '' }
}

/** Default template for a new property page. Pass property.rooms to pre-fill accommodation. */
export function defaultTemplate(
  rooms: { roomType: string }[],
): PropertyPageContent {
  return {
    sections: [
      { type: 'overview', text1: '', images: [], text2: '' },
      { type: 'experience', text1: '', images: [], text2: '' },
      { type: 'accommodation', intro: rooms.length > 0 ? '' : '' },
      { type: 'fastFacts', groups: [{ label: 'Highlights', items: [''] }, { label: 'Location', items: [''] }] },
    ],
  }
}
