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
