'use client'

import { ActionButton } from '@/components/itineraries/shared/ActionButton'
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldInput,
  FieldTextarea,
  CheckboxRow,
} from '@/components/itineraries/shared/FieldPrimitives'
import InfoPagesCard from '@/components/itineraries/InfoPagesCard'
import { formatTimestamp } from '@/lib/dates'
import * as S from './OverviewTab.styled'
import { useOverviewTab } from './useOverviewTab'
import { COPY, NOTES_ROWS } from './OverviewTab.constants'
import { viewCountLabel } from './OverviewTab.utils'

export default function OverviewTab() {
  const {
    itinerary, form, set, dirty, saving, saveError, save, canSave,
    link, copyLink, newLink, shareError,
  } = useOverviewTab()

  const saveButton = dirty ? (
    <>
      {saveError && <S.SaveError>{saveError}</S.SaveError>}
      <ActionButton $variant="primary" onClick={save} $disabled={!canSave}>
        {saving ? COPY.saving : COPY.save}
      </ActionButton>
    </>
  ) : null

  return (
    <S.Grid>
      <S.Card>
        <S.CardTitle>{COPY.tripDetails}</S.CardTitle>
        <FieldGroup>
          <Field>
            <FieldLabel>{COPY.proposalTitle}</FieldLabel>
            <FieldInput
              value={form.proposalTitle}
              onChange={(e) => set('proposalTitle', e.target.value)}
              placeholder={COPY.proposalTitlePlaceholder}
            />
          </Field>
          <Field>
            <FieldLabel>{COPY.preparedFor}</FieldLabel>
            <FieldInput
              value={form.preparedFor}
              onChange={(e) => set('preparedFor', e.target.value)}
              placeholder={COPY.preparedForPlaceholder}
            />
          </Field>
          <Field>
            <FieldLabel>{COPY.travelDates}</FieldLabel>
            <FieldInput
              value={form.travelDates}
              onChange={(e) => set('travelDates', e.target.value)}
              placeholder={COPY.travelDatesPlaceholder}
            />
          </Field>
          <Field>
            <CheckboxRow>
              <input
                type="checkbox"
                checked={form.whiteLabel}
                onChange={(e) => set('whiteLabel', e.target.checked)}
              />
              {COPY.whiteLabel}
            </CheckboxRow>
          </Field>
        </FieldGroup>
        {saveButton}
      </S.Card>

      <S.Card>
        <S.CardTitle>{COPY.internalNotes}</S.CardTitle>
        <FieldGroup>
          <Field>
            <FieldLabel>{COPY.notesLabel}</FieldLabel>
            <FieldTextarea
              value={form.internalNotes}
              onChange={(e) => set('internalNotes', e.target.value)}
              placeholder={COPY.notesPlaceholder}
              rows={NOTES_ROWS}
            />
          </Field>
        </FieldGroup>
        {saveButton}
      </S.Card>

      {/* Information pages — full width */}
      <InfoPagesCard />

      <S.WideCard>
        <S.CardTitle>{COPY.shareLink}</S.CardTitle>
        <S.ShareInputRow>
          <S.ShareInput readOnly value={link ?? COPY.draftShareLink} />
          {link && <ActionButton onClick={copyLink}>{COPY.copy}</ActionButton>}
          {link && (
            <ActionButton onClick={newLink} $disabled={saving} disabled={saving}>
              {COPY.newLink}
            </ActionButton>
          )}
        </S.ShareInputRow>
        {shareError && <S.SaveError>{shareError}</S.SaveError>}
        {itinerary && (
          <S.ShareMeta>
            {viewCountLabel(itinerary.viewCount)} · {COPY.created}{' '}
            {formatTimestamp(itinerary.createdAt)} · {COPY.lastUpdated}{' '}
            {formatTimestamp(itinerary.updatedAt)}
          </S.ShareMeta>
        )}
      </S.WideCard>
    </S.Grid>
  )
}
