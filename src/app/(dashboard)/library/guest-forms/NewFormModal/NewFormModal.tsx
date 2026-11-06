'use client'

import { ActionButton } from '@/components/itineraries/shared/ActionButton'
import { perGuestLabel } from '@/lib/guestForms'
import { COPY } from './NewFormModal.constants'
import type { NewFormModalProps } from './NewFormModal.types'
import { starterQuestionCount } from './NewFormModal.utils'
import { useNewFormModal } from './useNewFormModal'
import * as S from './NewFormModal.styled'

/** Blank, or one of the API's starters. Choosing opens the builder; nothing is saved yet. */
export default function NewFormModal({ onClose }: NewFormModalProps) {
  const { starters, choose } = useNewFormModal(onClose)

  return (
    <S.Overlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <S.Card role="dialog" aria-modal="true" aria-labelledby="new-form-title">
        <S.Title id="new-form-title">{COPY.title}</S.Title>
        <S.Subtitle>{COPY.subtitle}</S.Subtitle>

        <S.Options>
          <S.Option type="button" onClick={() => choose(null)} autoFocus>
            <S.OptionName>{COPY.blankName}</S.OptionName>
            <S.OptionMeta>{COPY.blankDescription}</S.OptionMeta>
          </S.Option>
          {starters === null && <S.Loading>{COPY.loading}</S.Loading>}
          {starters?.map((starter) => (
            <S.Option key={starter.key} type="button" onClick={() => choose(starter.key)}>
              <S.OptionName>{starter.name}</S.OptionName>
              <S.OptionMeta>
                {starterQuestionCount(starter)} questions · {perGuestLabel(starter.perGuest)}
              </S.OptionMeta>
            </S.Option>
          ))}
        </S.Options>

        <S.Footer>
          <ActionButton type="button" onClick={onClose}>
            {COPY.cancel}
          </ActionButton>
        </S.Footer>
      </S.Card>
    </S.Overlay>
  )
}
