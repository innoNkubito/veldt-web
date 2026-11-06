'use client'

import { formatTimestamp } from '@/lib/dates'
import { COPY, responsePath } from './NewGuestFormsPanel.constants'
import { useNewGuestFormsPanel } from './useNewGuestFormsPanel'
import * as S from './NewGuestFormsPanel.styled'

/** Dashboard: guest forms nobody has reviewed yet. Renders nothing when there are none. */
export default function NewGuestFormsPanel() {
  const { recent, more } = useNewGuestFormsPanel()
  if (recent.length === 0) return null

  return (
    <S.Card aria-labelledby="new-guest-forms-title">
      <S.Title id="new-guest-forms-title">{COPY.title}</S.Title>
      <S.List>
        {recent.map((r) => (
          <S.Item key={r.id}>
            <S.ItemLink href={responsePath(r.itinerary.id)}>
              <S.What>
                <strong>{r.guestName}</strong> · {r.guestForm.name} · {r.itinerary.proposalTitle}
              </S.What>
              <S.When>{formatTimestamp(r.submittedAt)}</S.When>
            </S.ItemLink>
          </S.Item>
        ))}
      </S.List>
      {more > 0 && <S.More>{COPY.more(more)}</S.More>}
    </S.Card>
  )
}
