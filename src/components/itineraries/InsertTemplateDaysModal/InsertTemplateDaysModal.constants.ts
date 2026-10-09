export const COPY = {
  title: 'Add days from a template',
  subtitle:
    'The template’s days are copied in with their stays, activities and notes. This itinerary ' +
    'keeps its own costs, booking setup and info pages.',
  template: 'Template *',
  choose: 'Choose a template…',
  loading: 'Loading templates…',
  none: 'No templates yet. Open an itinerary and use “Save as template” to create one.',
  position: 'Where',
  atEnd: 'At the end',
  atStart: 'At the start',
  after: 'After',
  notes:
    'If the day before is dated, the new days continue from it and later dated days move back. ' +
    'Day labels are copied as written — check the numbering. Costs will need re-confirming.',
  cancel: 'Cancel',
  insert: 'Add days',
  inserting: 'Adding…',
} as const

/** Select value for "at the end"; any other value is an index into the days. */
export const AT_END = 'end'
