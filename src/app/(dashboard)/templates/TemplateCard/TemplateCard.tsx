'use client'

import * as S from './TemplateCard.styled'
import { ActionButton } from '@/components/itineraries/shared/ActionButton'
import { COPY } from './TemplateCard.constants'
import { cardMeta } from './TemplateCard.utils'
import { displayName } from '../page.utils'
import type { TemplateCardProps } from './TemplateCard.types'

/** One template: what it is, how often it is used, and what can be done with it. */
export default function TemplateCard({
  template,
  busy,
  onUse,
  onOpen,
  onEditDetails,
  onDuplicate,
  onToggleArchived,
  onDelete,
}: TemplateCardProps) {
  const archived = template.templateArchivedAt !== null
  const manage = template.canManageTemplate

  return (
    <S.Card $archived={archived}>
      <S.TitleRow>
        <S.Name>{displayName(template)}</S.Name>
        {archived && <S.ArchivedBadge>{COPY.archived}</S.ArchivedBadge>}
      </S.TitleRow>
      <S.Meta>{cardMeta(template)}</S.Meta>
      <S.Description $empty={!template.templateDescription}>
        {template.templateDescription || COPY.noDescription}
      </S.Description>
      {template.templateTags.length > 0 && (
        <S.Tags>
          {template.templateTags.map((tag) => (
            <S.Tag key={tag}>{tag}</S.Tag>
          ))}
        </S.Tags>
      )}
      <S.Actions>
        {!archived && (
          <ActionButton $variant="primary" onClick={onUse} disabled={busy}>
            {COPY.use}
          </ActionButton>
        )}
        <S.LinkAction onClick={onOpen}>{COPY.open}</S.LinkAction>
        {manage && (
          <S.LinkAction onClick={onEditDetails} disabled={busy}>
            {COPY.details}
          </S.LinkAction>
        )}
        <S.LinkAction onClick={onDuplicate} disabled={busy}>
          {COPY.duplicate}
        </S.LinkAction>
        {manage && (
          <S.LinkAction onClick={onToggleArchived} disabled={busy}>
            {archived ? COPY.restore : COPY.archive}
          </S.LinkAction>
        )}
        {manage && (
          <S.LinkAction $danger onClick={onDelete} disabled={busy}>
            {COPY.delete}
          </S.LinkAction>
        )}
      </S.Actions>
    </S.Card>
  )
}
