import { formatDate } from '@/lib/dates'
import { perGuestLabel, type GuestForm } from '@/lib/guestForms'

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

export function cardMeta(form: GuestForm): string {
  return [
    plural(form.questionCount, 'question', 'questions'),
    perGuestLabel(form.perGuest),
    `Updated ${formatDate(form.updatedAt)}`,
  ].join(' · ')
}

export function usageLabel(form: GuestForm): string {
  return form.usageCount === 0 ? 'Not used on any trip yet' : `Used on ${plural(form.usageCount, 'trip', 'trips')}`
}
