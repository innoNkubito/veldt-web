import {
  FIELD_TYPE_CONFIG,
  GUEST_FORM_LIMITS as L,
  type GuestForm,
  type GuestFormField,
  type GuestFormFieldType,
  type GuestFormInput,
  type GuestFormStarter,
} from '@/lib/guestForms'
import type { Draft, DraftField, DraftIssues } from './GuestFormBuilder.types'

let counter = 0
export const newKey = () => `k${Date.now().toString(36)}${(counter++).toString(36)}`

const DEFAULT_OPTIONS = 'Option 1\nOption 2'

export function emptyField(type: GuestFormFieldType): DraftField {
  return {
    key: newKey(),
    id: null,
    type,
    label: '',
    helpText: '',
    required: false,
    optionsText: FIELD_TYPE_CONFIG[type].hasOptions ? DEFAULT_OPTIONS : '',
  }
}

const toDraftField = (field: GuestFormField): DraftField => ({
  key: newKey(),
  id: field.id,
  type: field.type,
  label: field.label,
  helpText: field.helpText ?? '',
  required: field.required,
  optionsText: field.options.join('\n'),
})

export function toDraft(source: GuestForm | GuestFormStarter | null): Draft {
  if (!source) return { name: '', description: '', perGuest: true, fields: [emptyField('SHORT_TEXT')] }
  return {
    name: source.name,
    description: source.description ?? '',
    perGuest: source.perGuest,
    fields: source.fields.map(toDraftField),
  }
}

/** Non-empty, trimmed, de-duplicated lines. */
export function splitOptions(text: string): string[] {
  return [...new Set(text.split('\n').map((line) => line.trim()).filter(Boolean))]
}

export function toInput(draft: Draft): GuestFormInput {
  return {
    name: draft.name.trim(),
    description: draft.description.trim() || null,
    perGuest: draft.perGuest,
    fields: draft.fields.map((f) => ({
      ...(f.id ? { id: f.id } : {}),
      type: f.type,
      label: f.label.trim(),
      helpText: f.helpText.trim() || null,
      required: FIELD_TYPE_CONFIG[f.type].isInput && f.required,
      options: FIELD_TYPE_CONFIG[f.type].hasOptions ? splitOptions(f.optionsText) : [],
    })),
  }
}

/** The draft as the guest renderer expects it; the local key stands in for the id. */
export function toPreviewFields(draft: Draft): GuestFormField[] {
  return draft.fields.map((f) => ({
    id: f.key,
    type: f.type,
    label: f.label.trim() || FIELD_TYPE_CONFIG[f.type].label,
    helpText: f.helpText.trim() || null,
    required: FIELD_TYPE_CONFIG[f.type].isInput && f.required,
    options: FIELD_TYPE_CONFIG[f.type].hasOptions ? splitOptions(f.optionsText) : [],
  }))
}

/** The API's rules, checked here so problems show next to the field. */
export function draftIssues(draft: Draft): DraftIssues {
  const issues: DraftIssues = {}
  const name = draft.name.trim()
  if (!name) issues.name = 'Give the form a name.'
  else if (name.length > L.nameMax) issues.name = `Keep the name under ${L.nameMax} characters.`
  if (draft.description.trim().length > L.descriptionMax) {
    issues.description = `Keep the introduction under ${L.descriptionMax} characters.`
  }

  for (const f of draft.fields) {
    const label = f.label.trim()
    const options = splitOptions(f.optionsText)
    if (!label) issues[f.key] = 'Add the question text.'
    else if (label.length > L.labelMax) issues[f.key] = `Keep this under ${L.labelMax} characters.`
    else if (f.helpText.trim().length > L.helpTextMax) issues[f.key] = `Keep the help text under ${L.helpTextMax} characters.`
    else if (FIELD_TYPE_CONFIG[f.type].hasOptions && options.length < L.optionsMin) {
      issues[f.key] = `Add at least ${L.optionsMin} options, one per line.`
    } else if (FIELD_TYPE_CONFIG[f.type].hasOptions && options.length > L.optionsMax) {
      issues[f.key] = `Use at most ${L.optionsMax} options.`
    } else if (options.some((o) => o.length > L.optionMax)) {
      issues[f.key] = `Keep each option under ${L.optionMax} characters.`
    }
  }

  if (!draft.fields.some((f) => FIELD_TYPE_CONFIG[f.type].isInput)) {
    issues.fields = 'Add at least one question.'
  } else if (draft.fields.length > L.fieldsMax) {
    issues.fields = `A form can have at most ${L.fieldsMax} questions and headings.`
  }
  return issues
}

/** Stable comparison of what would be saved — ignores local keys. */
export const snapshot = (draft: Draft) => JSON.stringify(toInput(draft))

export function moveItem<T>(list: T[], index: number, delta: number): T[] {
  const target = index + delta
  if (target < 0 || target >= list.length) return list
  const next = [...list]
  ;[next[index], next[target]] = [next[target], next[index]]
  return next
}
