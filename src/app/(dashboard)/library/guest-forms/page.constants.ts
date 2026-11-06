export const COPY = {
  title: 'Guest Forms',
  subtitle:
    'Forms your guests fill in before and during their trip — passport details, dietary needs, ' +
    'emergency contacts. Build one once and attach it to any trip.',
  showArchived: 'Show archived',
  newForm: 'New form',
  loading: 'Loading forms…',
  emptyTitle: 'No guest forms yet',
  emptyBody: 'Start from a ready-made form or a blank one. Everyone on your team can use it.',
  readOnly: 'You can view forms; owners and advisors can change them.',
} as const

export const ARCHIVE_DIALOG = (name: string) => ({
  title: 'Archive this form?',
  message:
    `“${name}” can no longer be added to trips. Trips already using it keep it. ` +
    'You can restore it from “Show archived”.',
  confirmLabel: 'Archive',
})

export const DELETE_DIALOG = (name: string) => ({
  title: 'Delete this form?',
  message: `“${name}” will be removed for everyone on your team. This cannot be undone.`,
  confirmLabel: 'Delete',
  danger: true,
})

export const FORMS_PATH = '/library/guest-forms'
