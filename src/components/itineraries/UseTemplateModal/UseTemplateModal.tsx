'use client'

import * as S from './UseTemplateModal.styled'
import { ActionButton } from '@/components/itineraries/shared/ActionButton'
import {
  Field,
  FieldGroup,
  FieldInput,
  FieldLabel,
  FieldSelect,
} from '@/components/itineraries/shared/FieldPrimitives'
import { useUseTemplateModal } from './useUseTemplateModal'
import { COPY } from './UseTemplateModal.constants'
import { nightsLabel, templateLabel } from './UseTemplateModal.utils'
import type { UseTemplateModalProps } from './UseTemplateModal.types'

/** Starts a new itinerary from a template: client, title and start date, then the builder. */
export default function UseTemplateModal({ template, onClose }: UseTemplateModalProps) {
  const modal = useUseTemplateModal({ template })
  const noTemplates = modal.choices !== null && modal.choices.length === 0

  return (
    <S.Overlay onClick={onClose}>
      <S.Card onClick={(e) => e.stopPropagation()}>
        <S.Title>{COPY.title}</S.Title>
        <S.Subtitle>{COPY.subtitle}</S.Subtitle>

        {modal.error && <S.Error>{modal.error}</S.Error>}

        {noTemplates ? (
          <S.Empty>{COPY.none}</S.Empty>
        ) : (
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="use-template">{COPY.template}</FieldLabel>
              {modal.showPicker ? (
                <FieldSelect
                  id="use-template"
                  value={modal.templateId}
                  disabled={modal.choices === null}
                  onChange={(e) => modal.setTemplateId(e.target.value)}
                >
                  <option value="">{modal.choices === null ? COPY.loading : COPY.choose}</option>
                  {(modal.choices ?? []).map((choice) => (
                    <option key={choice.id} value={choice.id}>
                      {templateLabel(choice)}
                    </option>
                  ))}
                </FieldSelect>
              ) : (
                modal.selected && <div>{templateLabel(modal.selected)}</div>
              )}
              {modal.selected && nightsLabel(modal.selected.durationNights) && (
                <S.TemplateMeta>{nightsLabel(modal.selected.durationNights)}</S.TemplateMeta>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="use-title">{COPY.proposalTitle}</FieldLabel>
              <FieldInput
                id="use-title"
                value={modal.proposalTitle}
                placeholder={modal.selected?.proposalTitle ?? ''}
                onChange={(e) => modal.setProposalTitle(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="use-client">{COPY.preparedFor}</FieldLabel>
              <FieldInput
                id="use-client"
                value={modal.preparedFor}
                placeholder={COPY.preparedForPlaceholder}
                onChange={(e) => modal.setPreparedFor(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="use-start">{COPY.startDate}</FieldLabel>
              <FieldInput
                id="use-start"
                type="date"
                value={modal.startDate}
                onChange={(e) => modal.setStartDate(e.target.value)}
              />
              <S.Hint>{COPY.startDateHint}</S.Hint>
            </Field>
          </FieldGroup>
        )}

        <S.Actions>
          <ActionButton onClick={onClose} disabled={modal.submitting}>
            {COPY.cancel}
          </ActionButton>
          {!noTemplates && (
            <ActionButton
              $variant="primary"
              onClick={modal.submit}
              disabled={!modal.canSubmit}
              $disabled={!modal.canSubmit}
            >
              {modal.submitting ? COPY.creating : COPY.create}
            </ActionButton>
          )}
        </S.Actions>
      </S.Card>
    </S.Overlay>
  )
}
