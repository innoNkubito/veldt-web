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

export type PropertySection = TextImageSection | FastFactsSection

export interface PropertyPageContent {
  sections: PropertySection[]
}

export const SECTION_TYPES = [
  { value: 'overview', label: 'Overview' },
  { value: 'experience', label: 'Experience' },
  { value: 'fastFacts', label: 'Fast Facts' },
] as const

export type SectionType = (typeof SECTION_TYPES)[number]['value']

export function emptySection(type: SectionType): PropertySection {
  if (type === 'fastFacts') {
    return { type: 'fastFacts', groups: [{ label: '', items: [''] }] }
  }
  return { type, text1: '', images: [], text2: '' }
}
