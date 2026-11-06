'use client'

import { ActionButton } from '@/components/itineraries/shared/ActionButton'
import { formatTimestamp } from '@/lib/dates'
import { guestIdentityFields } from '@/lib/guestForms'
import GuestFormFields from '../GuestFormFields'
import { COPY, ID_PREFIX } from './GuestFormResponseModal.constants'
import type { GuestFormResponseModalProps } from './GuestFormResponseModal.types'
import { displayValue, editableFields } from './GuestFormResponseModal.utils'
import { useGuestFormResponseModal } from './useGuestFormResponseModal'
import * as S from './GuestFormResponseModal.styled'

/** One guest's answers: read, copy for a guide, mark reviewed, or correct them. */
export default function GuestFormResponseModal({ response, canEdit, onClose }: GuestFormResponseModalProps) {
  const m = useGuestFormResponseModal(response, onClose)
  const editing = m.mode === 'edit'

  return (
    <S.Overlay onClick={(e) => !editing && e.target === e.currentTarget && onClose()}>
      <S.Card role="dialog" aria-modal="true" aria-labelledby="response-title">
        <S.Head>
          <S.FormName>{response.guestForm.name}</S.FormName>
          <S.Title id="response-title">{response.guestName}</S.Title>
          <S.Meta>
            <span>
              {COPY.submitted} {formatTimestamp(response.submittedAt, 'long')}
              {response.guestEmail && ` · ${response.guestEmail}`}
            </span>
            {response.reviewedAt && (
              <span>{COPY.reviewed(response.reviewedByName, formatTimestamp(response.reviewedAt))}</span>
            )}
            {response.editedAt && <span>{COPY.edited(response.editedByName, formatTimestamp(response.editedAt))}</span>}
          </S.Meta>
        </S.Head>

        <S.Body>
          {editing ? (
            <>
              <S.EditNote>{COPY.editNote}</S.EditNote>
              <GuestFormFields
                idPrefix={ID_PREFIX.identity}
                fields={guestIdentityFields(response.guestForm.perGuest)}
                values={m.values}
                onChange={m.setValue}
                disabled={m.saving}
              />
              <S.Divider />
              <GuestFormFields
                idPrefix={ID_PREFIX.fields}
                fields={editableFields(response)}
                values={m.values}
                onChange={m.setValue}
                disabled={m.saving}
              />
            </>
          ) : (
            <>
              <S.Answers>
                {response.answers.map((answer) => {
                  const text = displayValue(answer)
                  return (
                    <S.Pair key={answer.fieldId}>
                      <S.Question>{answer.label}</S.Question>
                      <S.Answer $blank={answer.values.length === 0}>{text}</S.Answer>
                    </S.Pair>
                  )
                })}
              </S.Answers>
              <S.Note>{COPY.deleteNote}</S.Note>
            </>
          )}
        </S.Body>

        {m.error && <S.ErrorText role="alert">{m.error}</S.ErrorText>}

        <S.Foot>
          {editing ? (
            <>
              <span />
              <S.FootGroup>
                <ActionButton type="button" onClick={m.cancelEdit} disabled={m.saving}>
                  {COPY.cancel}
                </ActionButton>
                <ActionButton type="button" $variant="primary" onClick={m.saveEdit} disabled={m.saving} $disabled={m.saving}>
                  {m.saving ? COPY.saving : COPY.save}
                </ActionButton>
              </S.FootGroup>
            </>
          ) : (
            <>
              <S.FootGroup>
                <ActionButton type="button" onClick={m.copy}>
                  {m.copied ? COPY.copied : COPY.copy}
                </ActionButton>
                {canEdit && (
                  <ActionButton type="button" onClick={m.startEdit}>
                    {COPY.edit}
                  </ActionButton>
                )}
              </S.FootGroup>
              <S.FootGroup>
                {canEdit && (
                  <ActionButton
                    type="button"
                    $variant={response.reviewedAt ? 'outline' : 'primary'}
                    onClick={m.toggleReviewed}
                    disabled={m.saving}
                    $disabled={m.saving}
                  >
                    {response.reviewedAt ? COPY.markNew : COPY.markReviewed}
                  </ActionButton>
                )}
                <ActionButton type="button" $variant="ghost" onClick={onClose}>
                  {COPY.close}
                </ActionButton>
              </S.FootGroup>
            </>
          )}
        </S.Foot>
      </S.Card>
    </S.Overlay>
  )
}
