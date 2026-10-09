'use client'

import * as S from './InsertTemplateDaysModal.styled'
import { ActionButton } from '@/components/itineraries/shared/ActionButton'
import { Field, FieldGroup, FieldLabel, FieldSelect } from '@/components/itineraries/shared/FieldPrimitives'
import { useInsertTemplateDaysModal } from './useInsertTemplateDaysModal'
import { COPY } from './InsertTemplateDaysModal.constants'
import { templateOptionLabel } from './InsertTemplateDaysModal.utils'
import type { InsertTemplateDaysModalProps } from './InsertTemplateDaysModal.types'

/** "Build upon": drops a template's days into this itinerary at a chosen point. */
export default function InsertTemplateDaysModal(props: InsertTemplateDaysModalProps) {
  const modal = useInsertTemplateDaysModal(props)
  const noTemplates = modal.choices !== null && modal.choices.length === 0

  return (
    <S.Overlay onClick={props.onClose}>
      <S.Card onClick={(e) => e.stopPropagation()}>
        <S.Title>{COPY.title}</S.Title>
        <S.Subtitle>{COPY.subtitle}</S.Subtitle>

        {modal.error && <S.Error>{modal.error}</S.Error>}

        {noTemplates ? (
          <S.Empty>{COPY.none}</S.Empty>
        ) : (
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="insert-template">{COPY.template}</FieldLabel>
              <FieldSelect
                id="insert-template"
                value={modal.templateId}
                disabled={modal.choices === null}
                onChange={(e) => modal.setTemplateId(e.target.value)}
              >
                <option value="">{modal.choices === null ? COPY.loading : COPY.choose}</option>
                {(modal.choices ?? []).map((choice) => (
                  <option key={choice.id} value={choice.id}>
                    {templateOptionLabel(choice)}
                  </option>
                ))}
              </FieldSelect>
            </Field>
            <Field>
              <FieldLabel htmlFor="insert-position">{COPY.position}</FieldLabel>
              <FieldSelect
                id="insert-position"
                value={modal.position}
                onChange={(e) => modal.setPosition(e.target.value)}
              >
                {modal.positions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </FieldSelect>
              <S.Hint>{COPY.notes}</S.Hint>
            </Field>
          </FieldGroup>
        )}

        <S.Actions>
          <ActionButton onClick={props.onClose} disabled={modal.submitting}>
            {COPY.cancel}
          </ActionButton>
          {!noTemplates && (
            <ActionButton
              $variant="primary"
              onClick={modal.submit}
              disabled={!modal.canSubmit}
              $disabled={!modal.canSubmit}
            >
              {modal.submitting ? COPY.inserting : COPY.insert}
            </ActionButton>
          )}
        </S.Actions>
      </S.Card>
    </S.Overlay>
  )
}
