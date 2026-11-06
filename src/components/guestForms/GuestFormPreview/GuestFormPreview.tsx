'use client'

import { FIELD_TYPE_CONFIG, guestIdentityFields } from '@/lib/guestForms'
import GuestFormFields from '../GuestFormFields'
import { COPY } from './GuestFormPreview.constants'
import type { GuestFormPreviewProps } from './GuestFormPreview.types'
import { useGuestFormPreview } from './useGuestFormPreview'
import * as S from './GuestFormPreview.styled'

/** The form as a guest will see it, live while the operator edits. */
export default function GuestFormPreview({ name, description, perGuest, fields }: GuestFormPreviewProps) {
  const { values, setValue, reset } = useGuestFormPreview()
  const hasQuestions = fields.some((f) => FIELD_TYPE_CONFIG[f.type].isInput)

  return (
    <S.Frame>
      <S.Bar>
        <span>
          <S.Badge>{COPY.badge}</S.Badge> · {COPY.note}
        </span>
        <S.ResetButton type="button" onClick={reset}>
          {COPY.reset}
        </S.ResetButton>
      </S.Bar>
      <S.Body>
        <S.Title>{name.trim() || COPY.untitled}</S.Title>
        {description?.trim() && <S.Intro>{description.trim()}</S.Intro>}

        <GuestFormFields
          idPrefix="preview-id"
          fields={guestIdentityFields(perGuest)}
          values={values}
          onChange={setValue}
        />
        <S.Divider />
        {hasQuestions ? (
          <GuestFormFields idPrefix="preview" fields={fields} values={values} onChange={setValue} />
        ) : (
          <S.Empty>{COPY.empty}</S.Empty>
        )}

        <S.Actions aria-hidden>
          <S.FakeButton $primary>{COPY.submit}</S.FakeButton>
          {perGuest && <S.FakeButton>{COPY.submitAnother}</S.FakeButton>}
        </S.Actions>
      </S.Body>
    </S.Frame>
  )
}
