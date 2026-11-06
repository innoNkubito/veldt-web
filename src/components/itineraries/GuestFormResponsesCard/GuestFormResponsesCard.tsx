'use client'

import GuestFormResponseModal from '@/components/guestForms/GuestFormResponseModal'
import { formatTimestamp } from '@/lib/dates'
import { COPY } from './GuestFormResponsesCard.constants'
import { useGuestFormResponsesCard } from './useGuestFormResponsesCard'
import * as S from './GuestFormResponsesCard.styled'

/** What guests have sent, grouped by form. New ones are highlighted until reviewed. */
export default function GuestFormResponsesCard() {
  const c = useGuestFormResponsesCard()

  return (
    <S.Card aria-labelledby="responses-title">
      <S.Header>
        <S.Title id="responses-title">{COPY.title}</S.Title>
        {c.unreviewed > 0 && <S.NewCount>{COPY.newCount(c.unreviewed)}</S.NewCount>}
      </S.Header>

      {c.error ? (
        <S.ErrorText role="alert">{c.error}</S.ErrorText>
      ) : c.loading ? (
        <S.Muted>{COPY.loading}</S.Muted>
      ) : !c.hasResponses ? (
        <S.Muted>{c.formsAttached === 0 ? COPY.noForms : COPY.empty}</S.Muted>
      ) : (
        <>
          {c.groups.map((group) => (
            <S.Group key={group.formId}>
              <S.GroupName>{group.formName}</S.GroupName>
              <S.List>
                {group.responses.map((r) => (
                  <li key={r.id}>
                    <S.Row type="button" $new={r.reviewedAt === null} onClick={() => c.openResponse(r.id)}>
                      <S.Guest>{r.guestName}</S.Guest>
                      <S.RowMeta>
                        {formatTimestamp(r.submittedAt)}
                        {r.reviewedAt === null && <S.Badge>{COPY.newBadge}</S.Badge>}
                      </S.RowMeta>
                    </S.Row>
                  </li>
                ))}
              </S.List>
            </S.Group>
          ))}
          <S.Note>{COPY.deleteNote}</S.Note>
        </>
      )}

      {c.open && <GuestFormResponseModal response={c.open} canEdit={c.canEdit} onClose={c.close} />}
    </S.Card>
  )
}
