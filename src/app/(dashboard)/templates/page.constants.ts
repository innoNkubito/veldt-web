export const COPY = {
  title: 'Templates',
  subtitle:
    'Proven trips your whole team can start from. Pick one, add the client and a start date, ' +
    'and the draft is ready to adapt.',
  search: 'Search templates…',
  showArchived: 'Show archived',
  newFromTemplate: 'New itinerary from template',
  allTags: 'All',
  loading: 'Loading templates…',
  emptyTitle: 'No templates yet',
  emptyBody:
    'Open any classic itinerary and choose “Save as template”. It will appear here for everyone ' +
    'on your team.',
  noMatches: 'No templates match these filters.',
} as const

export const DELETE_DIALOG = (name: string) => ({
  title: 'Delete this template?',
  message:
    `“${name}” will be removed for everyone on your team. Itineraries already created from it ` +
    'are not affected. This cannot be undone.',
  confirmLabel: 'Delete',
  danger: true,
})

export const ARCHIVE_DIALOG = (name: string) => ({
  title: 'Archive this template?',
  message: `“${name}” will be hidden from the template picker. You can restore it from “Show archived”.`,
  confirmLabel: 'Archive',
})

export const SEARCH_DEBOUNCE_MS = 250
