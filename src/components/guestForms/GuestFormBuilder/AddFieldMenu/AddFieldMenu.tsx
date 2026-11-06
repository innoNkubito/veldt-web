'use client'

import { FIELD_TYPE_CONFIG, FIELD_TYPE_ORDER } from '@/lib/guestForms'
import { COPY } from './AddFieldMenu.constants'
import type { AddFieldMenuProps } from './AddFieldMenu.types'
import * as S from './AddFieldMenu.styled'

/** Every field type, one click each. New questions are added at the end. */
export default function AddFieldMenu({ disabled, onAdd }: AddFieldMenuProps) {
  return (
    <S.Root>
      <S.Title>{COPY.title}</S.Title>
      <S.Grid>
        {FIELD_TYPE_ORDER.map((type) => (
          <S.Choice key={type} type="button" disabled={disabled} onClick={() => onAdd(type)}>
            <S.ChoiceName>{FIELD_TYPE_CONFIG[type].label}</S.ChoiceName>
            <S.ChoiceHint>{FIELD_TYPE_CONFIG[type].hint}</S.ChoiceHint>
          </S.Choice>
        ))}
      </S.Grid>
    </S.Root>
  )
}
