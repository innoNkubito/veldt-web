import {
  MapPin, Binoculars, Star, Sun, BedDouble, Plane, Thermometer,
  CalendarDays, Users, Leaf, Camera, Info,
  type LucideIcon,
} from 'lucide-react'

/** Overview section heading, by the content page's type — mirrors each type's Page Mode. */
export const OVERVIEW_TITLES: Readonly<Record<string, string>> = {
  AREA: 'Area Overview',
  ACTIVITY: 'Activity Overview',
  ABOUT_US: 'About Us',
  INTRODUCTORY_NOTES: 'Introductory Notes',
  TERMS_CONDITIONS: 'Terms & Conditions',
}
export const DEFAULT_OVERVIEW_TITLE = 'Property Overview'

/** Heading for every other section type. Unknown types are title-cased. */
export const SECTION_TITLES: Readonly<Record<string, string>> = {
  experience: 'Experience & Activities',
  accommodation: 'Accommodation',
  fastFacts: 'Fast Facts',
  gallery: 'Gallery',
}

/** Fast-fact icons, matched in order against the group label. */
export const FACT_ICON_RULES: readonly { keywords: readonly string[]; icon: LucideIcon }[] = [
  { keywords: ['location', 'where'], icon: MapPin },
  { keywords: ['wildlife', 'animal', 'game'], icon: Binoculars },
  { keywords: ['highlight', 'feature'], icon: Star },
  { keywords: ['activ', 'experience'], icon: Sun },
  { keywords: ['accommo', 'room', 'tent'], icon: BedDouble },
  { keywords: ['getting', 'flight', 'transfer'], icon: Plane },
  { keywords: ['climate', 'weather', 'temp'], icon: Thermometer },
  { keywords: ['best time', 'season', 'when'], icon: CalendarDays },
  { keywords: ['family', 'child', 'guest'], icon: Users },
  { keywords: ['conservation', 'environment', 'eco'], icon: Leaf },
  { keywords: ['photo', 'camera'], icon: Camera },
  { keywords: ['quick', 'fact', 'detail'], icon: Info },
]
export const DEFAULT_FACT_ICON: LucideIcon = Star
export const FACT_ICON_SIZE = 14

export const SLIDER_ARROW_SIZE = 14
export const SLIDER_ARROW_POINTS = {
  left: '15 18 9 12 15 6',
  right: '9 18 15 12 9 6',
} as const

export const NO_ROOMS_MESSAGE = 'No rooms added for this property.'

/** A room with exactly two photos shows them side by side; other counts use the slider. */
export const ROOM_GRID_PHOTO_COUNT = 2

export const LOCALE = 'en-US'
