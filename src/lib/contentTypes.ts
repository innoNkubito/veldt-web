// Shared configuration for all ContentPage types.
// Used by the hub page, individual list/detail pages, and stores.

export type ContentType =
  | 'PROPERTY'
  | 'AREA'
  | 'ACTIVITY'
  | 'ABOUT_US'
  | 'INTRODUCTORY_NOTES'
  | 'TERMS_CONDITIONS'

export interface ContentTypeConfig {
  type: ContentType
  label: string           // singular: "Property"
  pluralLabel: string     // "Properties"
  createPlaceholder: string // placeholder for the name input when creating
  listRoute: string       // "/library/properties"
  detailRoute: (id: string) => string
  category: 'Destinations' | 'Trip Materials'
  badgeColor: string      // background
  badgeText: string       // foreground
}

export const CONTENT_TYPE_CONFIG: Record<ContentType, ContentTypeConfig> = {
  PROPERTY: {
    type: 'PROPERTY',
    label: 'Property',
    pluralLabel: 'Properties',
    createPlaceholder: 'e.g. Singita Grumeti',
    listRoute: '/library/properties',
    detailRoute: (id) => `/library/properties/${id}`,
    category: 'Destinations',
    badgeColor: '#f0ebe4',
    badgeText: '#7c5a2e',
  },
  AREA: {
    type: 'AREA',
    label: 'Area',
    pluralLabel: 'Areas',
    createPlaceholder: 'e.g. Masai Mara',
    listRoute: '/library/areas',
    detailRoute: (id) => `/library/areas/${id}`,
    category: 'Destinations',
    badgeColor: '#e4f0ea',
    badgeText: '#2e7c5a',
  },
  ACTIVITY: {
    type: 'ACTIVITY',
    label: 'Activity',
    pluralLabel: 'Activities',
    createPlaceholder: 'e.g. Hot Air Balloon Safari',
    listRoute: '/library/activities',
    detailRoute: (id) => `/library/activities/${id}`,
    category: 'Destinations',
    badgeColor: '#ede4f0',
    badgeText: '#5a2e7c',
  },
  ABOUT_US: {
    type: 'ABOUT_US',
    label: 'About Us',
    pluralLabel: 'About Us',
    createPlaceholder: 'e.g. About Safari Experts',
    listRoute: '/library/about-us',
    detailRoute: (id) => `/library/about-us/${id}`,
    category: 'Trip Materials',
    badgeColor: '#e4eaf0',
    badgeText: '#2e5a7c',
  },
  INTRODUCTORY_NOTES: {
    type: 'INTRODUCTORY_NOTES',
    label: 'Intro Note',
    pluralLabel: 'Introductory Notes',
    createPlaceholder: 'e.g. Welcome to Your Safari',
    listRoute: '/library/introductory-notes',
    detailRoute: (id) => `/library/introductory-notes/${id}`,
    category: 'Trip Materials',
    badgeColor: '#f0e4ea',
    badgeText: '#7c2e5a',
  },
  TERMS_CONDITIONS: {
    type: 'TERMS_CONDITIONS',
    label: 'Terms & Conditions',
    pluralLabel: 'Terms & Conditions',
    createPlaceholder: 'e.g. Standard Booking Terms',
    listRoute: '/library/terms-and-conditions',
    detailRoute: (id) => `/library/terms-and-conditions/${id}`,
    category: 'Trip Materials',
    badgeColor: '#e8f0e4',
    badgeText: '#3a6b2e',
  },
}

export const CONTENT_CATEGORIES: {
  label: 'Destinations' | 'Trip Materials'
  description: string
  types: ContentType[]
}[] = [
  {
    label: 'Destinations',
    description: 'Lodges, regions and experiences',
    types: ['PROPERTY', 'AREA', 'ACTIVITY'],
  },
  {
    label: 'Trip Materials',
    description: 'Personalised content for client pages',
    types: ['ABOUT_US', 'INTRODUCTORY_NOTES', 'TERMS_CONDITIONS'],
  },
]

// Ordered list for the Create New type picker
export const CREATABLE_TYPES: ContentType[] = [
  'PROPERTY',
  'AREA',
  'ACTIVITY',
  'ABOUT_US',
  'INTRODUCTORY_NOTES',
  'TERMS_CONDITIONS',
]
