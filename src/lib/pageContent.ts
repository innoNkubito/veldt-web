// Canonical shape of the ContentPage.pageContent JSON column.
//
// This lived in three places — the properties tab, PreviewTab and the public
// view route — and they had drifted: the public view typed the text/image
// section's `type` as plain `string`, which collapsed the discriminated union
// and made a cast necessary at every branch. One definition, one guard.

import { isRecord, isStringArray } from './guards'

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

export interface GallerySection {
  type: 'gallery'
  images: string[]
}

export type ContentSection =
  | TextImageSection
  | FastFactsSection
  | AccommodationSection
  | GallerySection

export interface PageContent {
  sections: ContentSection[]
}

function isFastFactsGroup(value: unknown): value is FastFactsGroup {
  return (
    isRecord(value) &&
    typeof value.label === 'string' &&
    isStringArray(value.items)
  )
}

// pageContent is a Json column, so its contents are whatever was written —
// possibly by an older schema. Each section is checked against the fields the
// renderers actually dereference, so a malformed one is dropped rather than
// throwing part-way through rendering a client-facing itinerary.
export function isContentSection(value: unknown): value is ContentSection {
  if (!isRecord(value)) return false
  switch (value.type) {
    case 'fastFacts':
      return Array.isArray(value.groups) && value.groups.every(isFastFactsGroup)
    case 'accommodation':
      return typeof value.intro === 'string'
    case 'gallery':
      return isStringArray(value.images)
    case 'overview':
    case 'experience':
      return (
        typeof value.text1 === 'string' &&
        typeof value.text2 === 'string' &&
        isStringArray(value.images)
      )
    default:
      return false
  }
}

export function parsePageContent(raw: unknown): PageContent | null {
  if (!isRecord(raw) || !Array.isArray(raw.sections)) return null
  const sections = raw.sections.filter(isContentSection)
  return sections.length > 0 ? { sections } : null
}
