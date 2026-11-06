import { formatDate, formatTimestamp } from '@/lib/dates'
import {
  FIELD_TYPE_CONFIG,
  GUEST_EMAIL_FIELD_ID,
  GUEST_NAME_FIELD_ID,
  type GuestFormAnswer,
  type GuestFormField,
  type GuestFormResponse,
  type GuestFormResponseInput,
  type GuestFormValues,
} from '@/lib/guestForms'
import { COPY } from './GuestFormResponseModal.constants'

/** An answer as a person reads it. */
export function displayValue(answer: GuestFormAnswer): string {
  if (answer.values.length === 0) return COPY.blank
  switch (answer.type) {
    case 'YES_NO':
      return answer.values[0] === 'yes' ? COPY.yes : COPY.no
    case 'DATE':
      return formatDate(answer.values[0], 'long', answer.values[0])
    default:
      return answer.values.join(', ')
  }
}

/** Plain text for pasting into an email or a message to a guide. */
export function responseAsText(response: GuestFormResponse): string {
  const lines = [
    `${response.guestForm.name} — ${response.guestName}`,
    `${response.itinerary.proposalTitle} · ${COPY.submitted} ${formatTimestamp(response.submittedAt, 'long')}`,
    '',
    ...(response.guestEmail ? [`${COPY.email}: ${response.guestEmail}`] : []),
    ...response.answers.map((a) => `${a.label}: ${displayValue(a)}`),
  ]
  return lines.join('\n')
}

/**
 * The questions an edit shows: the snapshot's labels and types, with today's
 * options when the question still exists unchanged (the API applies the same
 * rule). Nothing is required on an edit.
 */
export function editableFields(response: GuestFormResponse): GuestFormField[] {
  const live = new Map(response.guestForm.fields.map((f) => [f.id, f]))
  return response.answers.map((answer) => {
    const current = live.get(answer.fieldId)
    const options = !FIELD_TYPE_CONFIG[answer.type].hasOptions
      ? []
      : current && current.type === answer.type
        ? current.options
        : answer.values
    return { id: answer.fieldId, type: answer.type, label: answer.label, helpText: null, required: false, options }
  })
}

export function toValues(response: GuestFormResponse): GuestFormValues {
  const values: GuestFormValues = {
    [GUEST_NAME_FIELD_ID]: response.guestName,
    [GUEST_EMAIL_FIELD_ID]: response.guestEmail ?? '',
  }
  for (const a of response.answers) {
    values[a.fieldId] = a.type === 'MULTI_CHOICE' ? a.values : (a.values[0] ?? '')
  }
  return values
}

const list = (value: GuestFormValues[string] | undefined): string[] =>
  (Array.isArray(value) ? value : value ? [value] : []).map((v) => v.trim()).filter(Boolean)

export function toInput(response: GuestFormResponse, values: GuestFormValues): GuestFormResponseInput {
  return {
    guestName: list(values[GUEST_NAME_FIELD_ID])[0] ?? '',
    guestEmail: list(values[GUEST_EMAIL_FIELD_ID])[0] ?? null,
    answers: response.answers.map((a) => ({ fieldId: a.fieldId, values: list(values[a.fieldId]) })),
  }
}
