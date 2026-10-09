'use client'

import * as S from './TemplateDetailsModal.styled'
import { ActionButton } from '@/components/itineraries/shared/ActionButton'
import {
  Field,
  FieldGroup,
  FieldInput,
  FieldLabel,
  FieldTextarea,
} from '@/components/itineraries/shared/FieldPrimitives'
import { useTemplateDetailsModal } from './useTemplateDetailsModal'
import { COPY } from './TemplateDetailsModal.constants'
import type { TemplateDetailsModalProps } from './TemplateDetailsModal.types'

/** Name, description and tags — for saving a new template or editing one. */
export default function TemplateDetailsModal({
  mode,
  initial,
  onClose,
  onSubmit,
}: TemplateDetailsModalProps) {
  const form = useTemplateDetailsModal({ initial, onSubmit })
  const copy = COPY[mode]

  return (
    <S.Overlay onClick={onClose}>
      <S.Card onClick={(e) => e.stopPropagation()}>
        <S.Title>{copy.title}</S.Title>
        <S.Subtitle>{copy.subtitle}</S.Subtitle>

        {form.error && <S.Error>{form.error}</S.Error>}

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="template-name">{COPY.name}</FieldLabel>
            <FieldInput
              id="template-name"
              value={form.name}
              maxLength={120}
              placeholder={COPY.namePlaceholder}
              onChange={(e) => form.setName(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="template-description">{COPY.description}</FieldLabel>
            <FieldTextarea
              id="template-description"
              value={form.description}
              maxLength={2000}
              rows={3}
              placeholder={COPY.descriptionPlaceholder}
              onChange={(e) => form.setDescription(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="template-tags">{COPY.tags}</FieldLabel>
            <FieldInput
              id="template-tags"
              value={form.tags}
              placeholder={COPY.tagsPlaceholder}
              onChange={(e) => form.setTags(e.target.value)}
            />
            <S.Hint>{COPY.tagsHint}</S.Hint>
          </Field>
        </FieldGroup>

        <S.Actions>
          <ActionButton onClick={onClose} disabled={form.submitting}>
            {COPY.cancel}
          </ActionButton>
          <ActionButton
            $variant="primary"
            onClick={form.submit}
            disabled={!form.canSubmit}
            $disabled={!form.canSubmit}
          >
            {form.submitting ? copy.submitting : copy.submit}
          </ActionButton>
        </S.Actions>
      </S.Card>
    </S.Overlay>
  )
}
