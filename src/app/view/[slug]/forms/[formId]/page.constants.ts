export const COPY = {
  backToForms: '← All forms',
  notFoundTitle: 'This form isn’t available',
  notFoundBody: 'It may have been removed from your trip. Please contact your travel advisor if you still need to send these details.',
  required: 'Fields marked * are required.',
  submit: 'Send to my travel advisor',
  submitting: 'Sending…',
  submitFallback: 'We couldn’t send this form. Please check your connection and try again.',
  fixErrors: 'Please check the highlighted answers.',
  sentTitle: 'Thank you',
  sentBody: (name: string) => `We’ve sent the details for ${name} to your travel advisor.`,
  anotherGuest: 'Fill in for another guest',
  allForms: 'Back to all forms',
  backToItinerary: 'Back to your itinerary',
  privacy: 'Only your travel advisor’s team can see your answers. You won’t be able to view them here after sending.',
} as const

export const MESSAGES = {
  required: 'Please answer this question.',
  email: 'Enter a valid email address.',
  phone: 'Enter a valid phone number, including the country code.',
  number: 'Enter a number.',
  date: 'Enter a date.',
  tooLong: (max: number) => `Please keep this under ${max} characters.`,
} as const

/** Mirrors the API's answer limits (veldt-api src/lib/guestForms/answers.ts). */
export const MAX_LENGTH = { SHORT_TEXT: 500, LONG_TEXT: 2000, guestName: 120 } as const

export const ID_PREFIX = { identity: 'guest-id', fields: 'guest' } as const
