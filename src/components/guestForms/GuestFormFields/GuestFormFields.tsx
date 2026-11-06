'use client'

import { FIELD_TYPE_CONFIG } from '@/lib/guestForms'
import { AUTOCOMPLETE, INPUT_TYPE, REQUIRED_MARK, YES_NO_OPTIONS } from './GuestFormFields.constants'
import type { FieldProps, GuestFormFieldsProps } from './GuestFormFields.types'
import { asList, asText, toggleOption } from './GuestFormFields.utils'
import * as S from './GuestFormFields.styled'

/**
 * Renders a guest form's fields as the guest sees them. Controlled: the
 * caller owns the values. Used by the builder's preview and by the guest's
 * form page, so the two always look the same.
 */
export default function GuestFormFields({
  fields,
  values,
  onChange,
  errors = {},
  disabled = false,
  idPrefix = 'gf',
}: GuestFormFieldsProps) {
  return (
    <S.Root>
      {fields.map((field) => {
        if (!FIELD_TYPE_CONFIG[field.type].isInput) {
          return (
            <S.Section key={field.id}>
              <S.SectionTitle>{field.label}</S.SectionTitle>
              {field.helpText && <S.Help>{field.helpText}</S.Help>}
            </S.Section>
          )
        }

        const inputId = `${idPrefix}-${field.id}`
        const error = errors[field.id]
        const describedBy =
          [field.helpText && `${inputId}-help`, error && `${inputId}-error`].filter(Boolean).join(' ') ||
          undefined
        const props: FieldProps = {
          field,
          value: values[field.id],
          onChange: (value) => onChange(field.id, value),
          disabled,
          inputId,
          describedBy,
        }
        const isGroup = FIELD_TYPE_CONFIG[field.type].hasOptions || field.type === 'YES_NO'
        const Heading = isGroup ? S.Legend : S.Label
        const Wrapper = isGroup ? S.Fieldset : S.Question

        return (
          <Wrapper key={field.id} aria-describedby={isGroup ? describedBy : undefined}>
            <Heading {...(isGroup ? {} : { htmlFor: inputId })}>
              {field.label}
              {field.required && <S.Required aria-hidden>{REQUIRED_MARK}</S.Required>}
            </Heading>
            {field.helpText && <S.Help id={`${inputId}-help`}>{field.helpText}</S.Help>}
            <FieldInput {...props} invalid={!!error} />
            {error && (
              <S.Error id={`${inputId}-error`} role="alert">
                {error}
              </S.Error>
            )}
          </Wrapper>
        )
      })}
    </S.Root>
  )
}

function FieldInput({ field, value, onChange, disabled, inputId, describedBy, invalid }: FieldProps & { invalid: boolean }) {
  const common = {
    id: inputId,
    disabled,
    required: field.required,
    'aria-invalid': invalid || undefined,
    'aria-describedby': describedBy,
    $invalid: invalid,
  }

  switch (field.type) {
    case 'LONG_TEXT':
      return <S.Textarea {...common} value={asText(value)} onChange={(e) => onChange(e.target.value)} />

    case 'SINGLE_CHOICE':
    case 'YES_NO': {
      const options =
        field.type === 'YES_NO' ? YES_NO_OPTIONS : field.options.map((o) => ({ value: o, label: o }))
      return (
        <S.Choices $inline={field.type === 'YES_NO'} role="radiogroup">
          {options.map((option) => (
            <S.Choice key={option.value} $checked={value === option.value}>
              <input
                type="radio"
                name={inputId}
                value={option.value}
                checked={value === option.value}
                disabled={disabled}
                onChange={() => onChange(option.value)}
              />
              {option.label}
            </S.Choice>
          ))}
        </S.Choices>
      )
    }

    case 'MULTI_CHOICE': {
      const selected = asList(value)
      return (
        <S.Choices>
          {field.options.map((option) => (
            <S.Choice key={option} $checked={selected.includes(option)}>
              <input
                type="checkbox"
                checked={selected.includes(option)}
                disabled={disabled}
                onChange={() => onChange(toggleOption(selected, option, field.options))}
              />
              {option}
            </S.Choice>
          ))}
        </S.Choices>
      )
    }

    default:
      return (
        <S.Input
          {...common}
          type={INPUT_TYPE[field.type] ?? 'text'}
          inputMode={field.type === 'NUMBER' ? 'decimal' : undefined}
          autoComplete={AUTOCOMPLETE[field.type]}
          value={asText(value)}
          onChange={(e) => onChange(e.target.value)}
        />
      )
  }
}
