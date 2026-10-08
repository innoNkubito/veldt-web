export const COPY = {
  label: 'Your brand on itineraries',
  nameCaption: 'Your registered company name. Contact Veldt support to change it.',
  noLogo: 'No logo',
  upload: 'Upload logo',
  uploading: 'Uploading…',
  uploadHint: 'PNG, SVG or WebP, up to 1 MB. A transparent background works best.',
  locked: 'Your logo is set. Contact Veldt support to change it.',
  ownerOnly: 'Your workspace owner can add a logo.',
  hint: 'Shown on every proposal, travel dashboard and printout — including white-label ones.',
} as const

export const CONFIRM_LOGO_DIALOG = {
  title: 'Use this as your logo?',
  message:
    "It will appear on every itinerary you share. Once it's set, only Veldt support can change it.",
  confirmLabel: 'Set Logo',
} as const

export const FILE_INPUT_ID = 'operator-logo-upload'
