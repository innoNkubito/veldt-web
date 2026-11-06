export const COPY = {
  title: 'New guest forms',
  more: (n: number) => `+ ${n} more`,
  open: 'Open',
} as const

export const PANEL_LIMIT = 5

export const responsePath = (itineraryId: string) => `/itineraries/${itineraryId}?tab=trip`
