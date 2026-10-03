import type React from 'react'
import type {
  PageContent,
  TextImageSection,
  FastFactsSection,
  AccommodationSection,
} from '@/lib/pageContent'

/** A property room as the proposal needs it. */
export interface ProposalRoom {
  id: string
  roomType: string
  description: string | null
  photos: string[]
}

/** The row fields a day heading is built from. */
export interface DayLabelRow {
  dateLabel: string | null
  startDate: string | null
}

export interface PhotoSliderProps {
  images: string[]
}

export interface RichHtmlProps {
  html: string
}

export interface TextImageViewProps {
  section: TextImageSection
  pageId: string
  contentType?: string
}

export interface FastFactsViewProps {
  section: FastFactsSection
  pageId: string
}

export interface AccommodationViewProps {
  section: AccommodationSection
  rooms: ProposalRoom[]
  pageId: string
}

export interface ContentSectionsProps {
  content: PageContent
  rooms: ProposalRoom[]
  pageId: string
  contentType?: string
}

export interface DayRichTextProps {
  json: Record<string, unknown> | null
}

export interface CostsRichProps {
  text: string
  Comp: React.ComponentType<React.HTMLAttributes<HTMLDivElement>>
  style?: React.CSSProperties
}

/** How a room's photos are laid out. */
export interface RoomPhotoLayout {
  useSlider: boolean
  photos: string[]
}
