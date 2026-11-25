import type {
  BookingConfig,
  BookingFlowType,
  BookingMode,
  ScheduleAmountType,
  SurchargePayer,
} from '@/stores/bookingStore'
import type { ProcessorConnection } from '@/stores/integrationsStore'

/** The booking settings as the form edits them — strings for controlled inputs. */
export interface BookingForm {
  bookingMode: BookingMode
  externalUrl: string
  externalContact: string
  flowType: BookingFlowType
  processorConnectionId: string
  companyInfo: string
  invoiceNotes: string
  termsAndConditions: string
  allowCardPayments: boolean
  surchargePayer: SurchargePayer
  surchargePercent: string
  achEnabled: boolean
  reminderDaysBefore: number[]
}

export type SetBookingField = <K extends keyof BookingForm>(key: K, value: BookingForm[K]) => void

/** One row of the schedule editor (all strings for controlled inputs). */
export interface ScheduleDraft {
  description: string
  dueAtBooking: boolean
  dueDate: string // yyyy-mm-dd — trips
  dueDays: string // days before the trip starts — templates
  amountType: ScheduleAmountType
  amountValue: string
}

export interface ScheduleSummary {
  valid: boolean
  text: string
}

/** Props every settings card shares. */
export interface SettingsCardProps {
  form: BookingForm
  setF: SetBookingField
}

export interface ProcessorProps {
  activeConnections: ProcessorConnection[]
  selectedConnection: ProcessorConnection | null
}

/** Props the package, add-on and schedule cards share. */
export interface ConfigCardProps {
  config: BookingConfig | null
  currency: string
  saving: boolean
}
