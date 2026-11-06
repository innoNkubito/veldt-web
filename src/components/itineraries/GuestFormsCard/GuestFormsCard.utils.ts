import { perGuestLabel, type TripGuestForm } from '@/lib/guestForms'

export function formMeta(form: TripGuestForm['guestForm']): string {
  const questions = `${form.questionCount} ${form.questionCount === 1 ? 'question' : 'questions'}`
  return `${questions} · ${perGuestLabel(form.perGuest)}`
}
