'use client'

import { COPY } from './GuestFormChecklist.constants'
import type { GuestFormChecklistProps } from './GuestFormChecklist.types'
import { toggle } from './GuestFormChecklist.utils'
import { useGuestFormChecklist } from './useGuestFormChecklist'
import * as S from './GuestFormChecklist.styled'

/** The Confirm Trip modal's forms step: tick the forms this trip should ask for. */
export default function GuestFormChecklist({ itineraryId, selected, onChange }: GuestFormChecklistProps) {
  const { ready, options } = useGuestFormChecklist(itineraryId, selected, onChange)

  return (
    <S.Fieldset>
      <S.Legend>{COPY.title}</S.Legend>
      <S.Hint>{COPY.hint}</S.Hint>
      {!ready || selected === null ? (
        <S.Muted>{COPY.loading}</S.Muted>
      ) : options.length === 0 ? (
        <S.Muted>{COPY.none}</S.Muted>
      ) : (
        <S.List>
          {options.map((option) => (
            <S.Option key={option.id} $checked={selected.includes(option.id)}>
              <input
                type="checkbox"
                checked={selected.includes(option.id)}
                onChange={() => onChange(toggle(selected, option.id))}
              />
              <span>
                <S.Name>{option.name}</S.Name>
                <S.Meta>
                  {option.meta}
                  {option.archived && ` · ${COPY.archived}`}
                </S.Meta>
              </span>
            </S.Option>
          ))}
        </S.List>
      )}
    </S.Fieldset>
  )
}
