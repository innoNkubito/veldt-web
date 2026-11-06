'use client'

import { ActionButton } from '@/components/itineraries/shared/ActionButton'
import {
  Field,
  FieldGroup,
  FieldInput,
  FieldLabel,
  FieldTextarea,
} from '@/components/itineraries/shared/FieldPrimitives'
import GuestFormPreview from '../GuestFormPreview'
import AddFieldMenu from './AddFieldMenu'
import FieldEditor from './FieldEditor'
import { COPY, FORMS_PATH } from './GuestFormBuilder.constants'
import type { GuestFormBuilderProps } from './GuestFormBuilder.types'
import { useGuestFormBuilder } from './useGuestFormBuilder'
import * as S from './GuestFormBuilder.styled'

/** Edit a form on the left, see it as a guest would on the right. */
export default function GuestFormBuilder({ formId, starterKey }: GuestFormBuilderProps) {
  const b = useGuestFormBuilder(formId, starterKey)

  if (b.load.status === 'loading') return <S.CenteredState>{COPY.loading}</S.CenteredState>
  if (b.load.status === 'error') {
    return (
      <S.PageRoot>
        <S.Back href={FORMS_PATH}>{COPY.back}</S.Back>
        <S.Banner $tone="error">{b.load.message}</S.Banner>
      </S.PageRoot>
    )
  }

  const readOnly = !b.canEdit
  const { draft, issues, form } = b

  return (
    <S.PageRoot>
      <S.Back href={FORMS_PATH}>{COPY.back}</S.Back>
      <S.Head>
        <S.Title>{form ? form.name : COPY.newTitle}</S.Title>
        {!readOnly && (
          <S.HeadActions>
            {b.dirty && <S.Status>{COPY.unsaved}</S.Status>}
            <ActionButton
              $variant="primary"
              onClick={b.save}
              disabled={b.saving || (!!form && !b.dirty)}
              $disabled={b.saving || (!!form && !b.dirty)}
            >
              {b.saving ? COPY.saving : form ? COPY.save : COPY.create}
            </ActionButton>
          </S.HeadActions>
        )}
      </S.Head>

      {readOnly && <S.Banner $tone="info">{COPY.readOnly}</S.Banner>}
      {form?.archivedAt && <S.Banner $tone="warning">{COPY.archived}</S.Banner>}
      {!readOnly && form && form.usageCount > 0 && <S.Banner $tone="info">{COPY.inUse(form.usageCount)}</S.Banner>}
      {b.message && (
        <S.Banner $tone={b.message.error ? 'error' : 'success'} role="status">
          {b.message.text}
        </S.Banner>
      )}

      <S.Columns>
        <S.Editor>
          <S.Panel aria-labelledby="form-settings-title">
            <S.PanelTitle id="form-settings-title">{COPY.settingsTitle}</S.PanelTitle>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="form-name">{COPY.nameLabel}</FieldLabel>
                <FieldInput
                  id="form-name"
                  value={draft.name}
                  disabled={readOnly}
                  placeholder={COPY.namePlaceholder}
                  aria-invalid={!!issues.name || undefined}
                  onChange={(e) => b.setName(e.target.value)}
                />
                {issues.name && <S.FieldIssue role="alert">{issues.name}</S.FieldIssue>}
              </Field>
              <Field>
                <FieldLabel htmlFor="form-description">{COPY.descriptionLabel}</FieldLabel>
                <FieldTextarea
                  id="form-description"
                  value={draft.description}
                  disabled={readOnly}
                  placeholder={COPY.descriptionPlaceholder}
                  onChange={(e) => b.setDescription(e.target.value)}
                />
                {issues.description && <S.FieldIssue role="alert">{issues.description}</S.FieldIssue>}
              </Field>
              <Field role="radiogroup" aria-labelledby="form-responses-label">
                <FieldLabel as="div" id="form-responses-label">
                  {COPY.responsesLabel}
                </FieldLabel>
                <S.ModeChoices>
                  {[
                    { value: true, name: COPY.perGuest, hint: COPY.perGuestHint },
                    { value: false, name: COPY.perTrip, hint: COPY.perTripHint },
                  ].map((mode) => (
                    <S.ModeChoice key={String(mode.value)} $checked={draft.perGuest === mode.value}>
                      <input
                        type="radio"
                        name="form-responses"
                        checked={draft.perGuest === mode.value}
                        disabled={readOnly}
                        onChange={() => b.setPerGuest(mode.value)}
                      />
                      <span>
                        <S.ModeName>{mode.name}</S.ModeName>
                        <S.ModeHint>{mode.hint}</S.ModeHint>
                      </span>
                    </S.ModeChoice>
                  ))}
                </S.ModeChoices>
              </Field>
            </FieldGroup>
          </S.Panel>

          <S.Panel aria-labelledby="form-questions-title">
            <S.PanelTitle id="form-questions-title">{COPY.questionsTitle}</S.PanelTitle>
            {issues.fields && <S.Banner $tone="error">{issues.fields}</S.Banner>}
            {draft.fields.length === 0 ? (
              <S.Empty>{COPY.noQuestions}</S.Empty>
            ) : (
              <S.FieldList>
                {draft.fields.map((field, index) => (
                  <FieldEditor
                    key={field.key}
                    field={field}
                    index={index}
                    total={draft.fields.length}
                    issue={issues[field.key]}
                    readOnly={readOnly}
                    onChange={(patch) => b.updateField(field.key, patch)}
                    onMove={(direction) => b.moveField(field.key, direction)}
                    onDuplicate={() => b.duplicateField(field.key)}
                    onRemove={() => b.removeField(field.key)}
                  />
                ))}
              </S.FieldList>
            )}
            {!readOnly && <AddFieldMenu disabled={b.saving} onAdd={b.addField} />}
          </S.Panel>
        </S.Editor>

        <S.PreviewColumn aria-label={COPY.previewTitle}>
          <S.PreviewTitle>{COPY.previewTitle}</S.PreviewTitle>
          <GuestFormPreview
            name={draft.name}
            description={draft.description}
            perGuest={draft.perGuest}
            fields={b.previewFields}
          />
        </S.PreviewColumn>
      </S.Columns>
    </S.PageRoot>
  )
}
