export const COPY = {
  submitted: 'Submitted',
  reviewed: (by: string | null, when: string) => `Reviewed${by ? ` by ${by}` : ''} · ${when}`,
  edited: (by: string | null, when: string) => `Answers edited${by ? ` by ${by}` : ''} · ${when}`,
  email: 'Email',
  blank: '—',
  copy: 'Copy as text',
  copied: 'Copied',
  edit: 'Edit answers',
  markReviewed: 'Mark reviewed',
  markNew: 'Mark as new',
  close: 'Close',
  save: 'Save answers',
  saving: 'Saving…',
  cancel: 'Cancel',
  editNote: 'Correct what the guest sent. The questions stay as they were asked, and the change is recorded.',
  deleteNote: 'Responses are deleted when the trip is marked complete. Copy anything you still need before then.',
  yes: 'Yes',
  no: 'No',
} as const

export const COPIED_MS = 2000
export const ID_PREFIX = { identity: 'resp-id', fields: 'resp' } as const
