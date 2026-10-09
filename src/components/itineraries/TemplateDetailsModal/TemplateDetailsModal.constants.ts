export const COPY = {
  save: {
    title: 'Save as template',
    subtitle:
      'A copy of this itinerary becomes a reusable template. The client, dates and advisor are ' +
      'left out; days, content, costs and the booking setup are kept. Payment due dates become ' +
      '"days before the trip". This itinerary is not changed.',
    submit: 'Save template',
    submitting: 'Saving…',
  },
  edit: {
    title: 'Template details',
    subtitle: 'How this template appears to your team when they start a new itinerary.',
    submit: 'Save details',
    submitting: 'Saving…',
  },
  name: 'Template name *',
  namePlaceholder: 'e.g. Gorillas & Akagera — 7 nights',
  description: 'Description',
  descriptionPlaceholder: 'Who it suits, the season, anything to check before using it',
  tags: 'Tags',
  tagsPlaceholder: 'e.g. rwanda, primates, honeymoon',
  tagsHint: 'Separate with commas. Used to filter the template list.',
  cancel: 'Cancel',
} as const
