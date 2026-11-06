export const COPY = {
  back: '← Guest Forms',
  newTitle: 'New guest form',
  loading: 'Loading form…',
  save: 'Save form',
  create: 'Create form',
  saving: 'Saving…',
  saved: 'Saved.',
  unsaved: 'Unsaved changes',
  readOnly: 'View only — owners and advisors can change this form.',
  archived: 'This form is archived. It can’t be added to new trips until it’s restored.',
  inUse: (n: number) =>
    `Used on ${n} ${n === 1 ? 'trip' : 'trips'}. Saving changes what guests on ${n === 1 ? 'that trip' : 'those trips'} see from now on; answers already sent keep the questions they were given.`,
  fixIssues: 'Fix the highlighted problems, then save again.',

  settingsTitle: 'About this form',
  nameLabel: 'Form name',
  namePlaceholder: 'e.g. Passport & travel details',
  descriptionLabel: 'Introduction for guests',
  descriptionPlaceholder: 'Why you need this information and how it will be used.',
  responsesLabel: 'Responses',
  perGuest: 'One per guest',
  perGuestHint: 'Each traveller fills it in (or the lead fills it in for each). Best for passports and dietary needs.',
  perTrip: 'One per trip',
  perTripHint: 'Filled in once for the whole party. Best for arrival plans or room preferences.',

  questionsTitle: 'Questions',
  noQuestions: 'No questions yet — add one below.',
  previewTitle: 'Guest preview',
} as const

export const UNSAVED_PROMPT = 'You have unsaved changes to this form.'
export const FORMS_PATH = '/library/guest-forms'
