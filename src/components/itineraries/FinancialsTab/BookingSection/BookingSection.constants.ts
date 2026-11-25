import type { BookingFlowType, BookingMode, SurchargePayer } from '@/stores/bookingStore'
import type { BookingForm, ScheduleDraft } from './BookingSection.types'

export const BOOKING_OPENS_HINT =
  'Travellers see the booking option once you confirm the trip, until it starts. Before that the link shows the proposal only.'

export const CURRENCY_HINT = 'Set with the quote above.'

export const INVOICING_SETTINGS_PATH = '/settings#invoicing'

export const FLOW_TYPES: readonly BookingFlowType[] = ['INSTANT', 'REQUEST']
export const SURCHARGE_PAYERS: readonly SurchargePayer[] = ['CLIENT', 'OPERATOR']

export const MODES: { key: BookingMode; name: string; desc: string }[] = [
  { key: 'OFF', name: 'Not bookable', desc: 'No booking button on the client view.' },
  { key: 'VELDT', name: 'Book through Veldt', desc: 'Clients book and pay through your processor.' },
  { key: 'EXTERNAL', name: 'External link', desc: 'Send clients to your own booking page or contact.' },
]

export const EMPTY_FORM: BookingForm = {
  bookingMode: 'OFF',
  externalUrl: '',
  externalContact: '',
  flowType: 'INSTANT',
  processorConnectionId: '',
  termsAndConditions: '',
  allowCardPayments: false,
  surchargePayer: 'CLIENT',
  surchargePercent: '',
  achEnabled: false,
  reminderDaysBefore: [],
}

/** The first payment: always due at booking. */
export const BLANK_FIRST: ScheduleDraft = {
  description: 'Deposit',
  dueAtBooking: true,
  dueDate: '',
  dueDays: '',
  amountType: 'PERCENT_OF_TOTAL',
  amountValue: '30',
}

export const REMINDER_DAYS = { min: 1, max: 365 } as const

export const REMOVE_PACKAGE_DIALOG = (name: string) => ({
  title: 'Remove package?',
  message: `"${name}" will no longer be bookable. Existing bookings are unaffected.`,
  confirmLabel: 'Remove',
  danger: true,
})

export const REMOVE_ADDON_DIALOG = (name: string) => ({
  title: 'Remove add-on?',
  message: `"${name}" will no longer be offered at checkout. Existing bookings are unaffected.`,
  confirmLabel: 'Remove',
  danger: true,
})
