import type { ItineraryCosts } from '@/stores/builderStore'
import type {
  BookingConfig,
  BookingConfigInput,
  PackageInput,
  PaymentScheduleItem,
  ScheduleItemInput,
} from '@/stores/bookingStore'
import { BLANK_FIRST, EMPTY_FORM, REMINDER_DAYS } from './BookingSection.constants'
import type { BookingForm, ScheduleDraft, ScheduleSummary } from './BookingSection.types'

const DEFAULT_PACKAGE_NAME = 'Standard'

/** "4,500" or "4,500.50" — cents only when there are any. */
function formatAmount(amount: number): string {
  const digits = Number.isInteger(amount) ? 0 : 2
  return amount.toLocaleString('en-GB', { minimumFractionDigits: digits, maximumFractionDigits: 2 })
}

/**
 * One package for the whole party at the quoted price, or null when the quote
 * has no price yet. The operator can edit it afterwards — the final price may
 * differ from the quote.
 */
export function packageFromQuote(costs: ItineraryCosts | null): PackageInput | null {
  if (!costs || costs.costsToBeDetetermined || costs.pricePerPerson == null) return null
  if (costs.pricePerPerson <= 0 || costs.numGuests < 1) return null
  const guests = costs.numGuests
  return {
    name: costs.accommodationType?.trim() || DEFAULT_PACKAGE_NAME,
    description: `${guests} ${guests === 1 ? 'guest' : 'guests'} at ${costs.currency} ${formatAmount(costs.pricePerPerson)} per person`,
    price: Math.round(costs.pricePerPerson * guests * 100) / 100,
    peopleIncluded: guests,
    totalAvailable: 1,
  }
}

// ── Settings form ────────────────────────────────────────────

export function formFromConfig(config: BookingConfig | null): BookingForm {
  if (!config) return EMPTY_FORM
  return {
    bookingMode: config.bookingMode,
    externalUrl: config.externalUrl ?? '',
    externalContact: config.externalContact ?? '',
    flowType: config.flowType,
    processorConnectionId: config.processorConnectionId ?? '',
    termsAndConditions: config.termsAndConditions ?? '',
    allowCardPayments: config.allowCardPayments,
    surchargePayer: config.surchargePayer ?? 'CLIENT',
    surchargePercent: config.surchargePercent != null ? String(config.surchargePercent) : '',
    achEnabled: config.achEnabled,
    reminderDaysBefore: config.reminderDaysBefore,
  }
}

export function toConfigInput(form: BookingForm): BookingConfigInput {
  return {
    bookingMode: form.bookingMode,
    externalUrl: form.externalUrl.trim() || null,
    externalContact: form.externalContact.trim() || null,
    flowType: form.flowType,
    processorConnectionId: form.processorConnectionId || null,
    termsAndConditions: form.termsAndConditions || null,
    allowCardPayments: form.allowCardPayments,
    surchargePayer: form.allowCardPayments ? form.surchargePayer : null,
    surchargePercent:
      form.allowCardPayments && form.surchargePercent ? parseFloat(form.surchargePercent) : null,
    achEnabled: form.achEnabled,
    reminderDaysBefore: form.reminderDaysBefore,
  }
}

/** The reminder list with one more day added, newest-first; null if the draft isn't a valid new day. */
export function withReminder(list: number[], draft: string): number[] | null {
  const days = parseInt(draft, 10)
  if (!Number.isInteger(days) || days < REMINDER_DAYS.min || days > REMINDER_DAYS.max) return null
  if (list.includes(days)) return list
  return [...list, days].sort((a, b) => b - a)
}

// ── Payment schedule ─────────────────────────────────────────

export function toScheduleDraft(item: PaymentScheduleItem): ScheduleDraft {
  return {
    description: item.description,
    dueAtBooking: item.dueAtBooking,
    dueDate: item.dueDate ? item.dueDate.slice(0, 10) : '',
    dueDays: item.dueDaysBeforeStart != null ? String(item.dueDaysBeforeStart) : '',
    amountType: item.amountType,
    amountValue: item.amountValue != null ? String(item.amountValue) : '',
  }
}

/** The schedule with one more payment: the deposit first, then remaining-balance payments. */
export function withScheduleRow(rows: ScheduleDraft[]): ScheduleDraft[] {
  if (rows.length === 0) return [BLANK_FIRST]
  return [
    ...rows,
    {
      description: `Payment ${rows.length + 1}`,
      dueAtBooking: false,
      dueDate: '',
      dueDays: '',
      amountType: 'REMAINING_BALANCE',
      amountValue: '',
    },
  ]
}

/** The first payment is always the one due at booking — re-anchored after a delete. */
export function withoutScheduleRow(rows: ScheduleDraft[], index: number): ScheduleDraft[] {
  return rows
    .filter((_, i) => i !== index)
    .map((row, i) =>
      i === 0 ? { ...row, dueAtBooking: true, dueDate: '', dueDays: '' } : { ...row, dueAtBooking: false },
    )
}

/** A template's payments are due relative to the trip start; a trip's on dates. */
export function toScheduleItems(schedule: ScheduleDraft[], isTemplate: boolean): ScheduleItemInput[] {
  return schedule.map((row) => ({
    description: row.description.trim(),
    dueAtBooking: row.dueAtBooking,
    dueDate: row.dueAtBooking || isTemplate ? null : row.dueDate || null,
    dueDaysBeforeStart:
      row.dueAtBooking || !isTemplate || row.dueDays.trim() === '' ? null : Number.parseInt(row.dueDays, 10),
    amountType: row.amountType,
    amountValue: row.amountType === 'REMAINING_BALANCE' || !row.amountValue ? null : parseFloat(row.amountValue),
  }))
}

/** Live check that the schedule adds up, as a sentence. */
export function scheduleSummary(schedule: ScheduleDraft[], currency: string): ScheduleSummary {
  if (schedule.length === 0) return { valid: true, text: 'No payment schedule set yet.' }
  const sum = (type: ScheduleDraft['amountType']) =>
    schedule.filter((r) => r.amountType === type).reduce((total, r) => total + (parseFloat(r.amountValue) || 0), 0)
  const percentSum = sum('PERCENT_OF_TOTAL')
  const fixedSum = sum('FIXED')
  const hasRemainder = schedule.some((r) => r.amountType === 'REMAINING_BALANCE')

  if (percentSum > 100) {
    return { valid: false, text: `Percentages total ${percentSum}% — that's over 100%.` }
  }
  if (hasRemainder) {
    const parts = [
      percentSum > 0 ? `${percentSum}% in percentages` : null,
      fixedSum > 0 ? `${fixedSum.toLocaleString()} ${currency} fixed` : null,
    ].filter(Boolean)
    return {
      valid: true,
      text: parts.length
        ? `${parts.join(' + ')}, then the remaining balance.`
        : 'The full amount is collected as the remaining balance.',
    }
  }
  if (fixedSum === 0 && Math.abs(percentSum - 100) > 0.01) {
    return {
      valid: false,
      text: `Percentages total ${percentSum}% — they must reach 100%, or add a remaining balance payment.`,
    }
  }
  return { valid: true, text: 'Schedule adds up.' }
}
