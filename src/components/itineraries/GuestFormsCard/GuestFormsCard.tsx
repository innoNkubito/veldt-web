'use client'

import { FieldSelect } from '@/components/itineraries/shared/FieldPrimitives'
import { COPY, LIBRARY_PATH, STATUS_NOTE } from './GuestFormsCard.constants'
import { formMeta } from './GuestFormsCard.utils'
import { useGuestFormsCard } from './useGuestFormsCard'
import * as S from './GuestFormsCard.styled'

/** Which library forms this trip asks its guests to fill in, in order. */
export default function GuestFormsCard() {
  const c = useGuestFormsCard()

  return (
    <S.Card aria-labelledby="guest-forms-title">
      <S.CardTitle id="guest-forms-title">{COPY.title}</S.CardTitle>
      <S.Description>{COPY.description}</S.Description>
      <S.LibraryLink href={LIBRARY_PATH}>{COPY.libraryLink} →</S.LibraryLink>
      {c.status && STATUS_NOTE[c.status] && <S.StatusNote>{STATUS_NOTE[c.status]}</S.StatusNote>}

      {c.loading ? (
        <S.Empty>{COPY.loading}</S.Empty>
      ) : c.attached.length === 0 ? (
        <S.Empty>{COPY.empty}</S.Empty>
      ) : (
        <S.List>
          {c.attached.map(({ guestForm: form }, index) => (
            <S.Item key={form.id}>
              <S.Position aria-hidden>{index + 1}</S.Position>
              <S.ItemBody>
                <S.ItemName>
                  {form.name}
                  {form.archivedAt && <S.Badge>{COPY.archived}</S.Badge>}
                </S.ItemName>
                <S.ItemMeta>{formMeta(form)}</S.ItemMeta>
              </S.ItemBody>
              {c.canEdit && (
                <S.Tools>
                  <S.Tool
                    type="button"
                    disabled={c.saving || index === 0}
                    aria-label={`${COPY.moveUp}: ${form.name}`}
                    onClick={() => c.move(form.id, -1)}
                  >
                    ↑
                  </S.Tool>
                  <S.Tool
                    type="button"
                    disabled={c.saving || index === c.attached.length - 1}
                    aria-label={`${COPY.moveDown}: ${form.name}`}
                    onClick={() => c.move(form.id, 1)}
                  >
                    ↓
                  </S.Tool>
                  <S.Tool type="button" $danger disabled={c.saving} onClick={() => c.detach(form.id)}>
                    {COPY.remove}
                  </S.Tool>
                </S.Tools>
              )}
            </S.Item>
          ))}
        </S.List>
      )}

      {c.canEdit &&
        !c.loading &&
        (c.libraryEmpty ? (
          <S.Muted>{COPY.noLibrary}</S.Muted>
        ) : c.available.length === 0 ? (
          <S.Muted>{COPY.noneLeft}</S.Muted>
        ) : (
          <S.AddRow>
            <S.AddLabel htmlFor="guest-form-add">{COPY.addLabel}</S.AddLabel>
            <FieldSelect
              id="guest-form-add"
              value=""
              disabled={c.saving}
              onChange={(e) => c.attach(e.target.value)}
            >
              <option value="">{COPY.addPlaceholder}</option>
              {c.available.map((form) => (
                <option key={form.id} value={form.id}>
                  {form.name}
                </option>
              ))}
            </FieldSelect>
          </S.AddRow>
        ))}

      {c.error && <S.ErrorText role="alert">{c.error}</S.ErrorText>}
    </S.Card>
  )
}
