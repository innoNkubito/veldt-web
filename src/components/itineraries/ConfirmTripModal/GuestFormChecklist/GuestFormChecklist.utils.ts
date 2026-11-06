import { perGuestLabel, type GuestForm, type TripGuestForm } from '@/lib/guestForms'
import type { ChecklistOption } from './GuestFormChecklist.types'

type Summary = Pick<GuestForm, 'id' | 'name' | 'perGuest' | 'questionCount' | 'archivedAt'>

const toOption = (form: Summary): ChecklistOption => ({
  id: form.id,
  name: form.name,
  meta: `${form.questionCount} ${form.questionCount === 1 ? 'question' : 'questions'} · ${perGuestLabel(form.perGuest)}`,
  archived: form.archivedAt !== null,
})

/** Forms already on the trip first, in their order; then the rest of the library. */
export function checklistOptions(attached: TripGuestForm[], library: Summary[]): ChecklistOption[] {
  const onTrip = new Set(attached.map((a) => a.guestForm.id))
  return [
    ...attached.map((a) => toOption(a.guestForm)),
    ...library.filter((f) => !onTrip.has(f.id)).map(toOption),
  ]
}

/** Ticking appends (so it lands at the end); unticking removes. */
export const toggle = (selected: string[], id: string): string[] =>
  selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]
