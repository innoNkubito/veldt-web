'use client'

import { COPY } from './GuestFormCard.constants'
import type { GuestFormCardProps } from './GuestFormCard.types'
import { cardMeta, usageLabel } from './GuestFormCard.utils'
import * as S from './GuestFormCard.styled'

/** One form: what it asks, where it is used, and what can be done with it. */
export default function GuestFormCard({ form, canEdit, busy, onOpen, onToggleArchived, onDelete }: GuestFormCardProps) {
  const archived = form.archivedAt !== null

  return (
    <S.Card $archived={archived}>
      <S.TitleRow>
        <S.Name type="button" onClick={onOpen}>
          {form.name}
        </S.Name>
        {archived && <S.ArchivedBadge>{COPY.archived}</S.ArchivedBadge>}
      </S.TitleRow>
      <S.Meta>{cardMeta(form)}</S.Meta>
      <S.Description $empty={!form.description}>{form.description || COPY.noDescription}</S.Description>
      <S.Usage $used={form.usageCount > 0}>{usageLabel(form)}</S.Usage>
      <S.Actions>
        <S.LinkAction onClick={onOpen}>{canEdit ? COPY.open : COPY.view}</S.LinkAction>
        {canEdit && (
          <S.LinkAction onClick={onToggleArchived} disabled={busy}>
            {archived ? COPY.restore : COPY.archive}
          </S.LinkAction>
        )}
        {/* A form that has been on a trip can only be archived — the API enforces it too. */}
        {canEdit && form.usageCount === 0 && (
          <S.LinkAction $danger onClick={onDelete} disabled={busy}>
            {COPY.delete}
          </S.LinkAction>
        )}
      </S.Actions>
    </S.Card>
  )
}
