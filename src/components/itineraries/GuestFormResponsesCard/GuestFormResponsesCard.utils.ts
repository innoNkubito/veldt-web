import type { GuestFormResponse } from '@/lib/guestForms'

export interface ResponseGroup {
  formId: string
  formName: string
  responses: GuestFormResponse[]
}

/** Responses grouped by form, keeping the newest-first order inside and between groups. */
export function groupByForm(responses: GuestFormResponse[]): ResponseGroup[] {
  const groups = new Map<string, ResponseGroup>()
  for (const r of responses) {
    const group = groups.get(r.guestForm.id) ?? { formId: r.guestForm.id, formName: r.guestForm.name, responses: [] }
    group.responses.push(r)
    groups.set(r.guestForm.id, group)
  }
  return [...groups.values()]
}
