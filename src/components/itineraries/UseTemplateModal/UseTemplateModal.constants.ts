export const COPY = {
  title: 'New itinerary from a template',
  subtitle:
    'Everything in the template is copied into a new draft: days, content, costs and the booking ' +
    'setup. Costs must be re-confirmed before you publish.',
  template: 'Template *',
  choose: 'Choose a template…',
  loading: 'Loading templates…',
  none: 'No templates yet. Open an itinerary and use “Save as template” to create one.',
  proposalTitle: 'Proposal title',
  preparedFor: 'Prepared for',
  preparedForPlaceholder: 'e.g. James & Sarah Wilson',
  startDate: 'Trip start date',
  startDateHint:
    'Days and payment due dates are dated from this. Leave it blank to set dates later.',
  cancel: 'Cancel',
  create: 'Create itinerary',
  creating: 'Creating…',
} as const

export const ITINERARY_PATH = (id: string) => `/itineraries/${id}`
