'use client'

import { useState } from 'react'
import { REMINDER_DAYS } from '../BookingSection.constants'
import type { SettingsCardProps } from '../BookingSection.types'
import { withReminder } from '../BookingSection.utils'
import * as S from '../BookingSection.styled'

/** Days before each due date to email the client a payment link. */
export default function RemindersCard({ form, setF }: SettingsCardProps) {
  const [draft, setDraft] = useState('')

  return (
    <S.Card>
      <S.CardTitleRow>
        <S.CardTitle>Payment Reminders</S.CardTitle>
      </S.CardTitleRow>
      <S.CardHint>Email the client a payment link this many days before each due date.</S.CardHint>

      <S.ChipRow>
        {form.reminderDaysBefore.map((days) => (
          <S.Chip key={days}>
            {days} {days === 1 ? 'day' : 'days'} before
            <S.ChipRemove
              aria-label={`Remove the ${days}-day reminder`}
              onClick={() => setF('reminderDaysBefore', form.reminderDaysBefore.filter((d) => d !== days))}
            >
              ✕
            </S.ChipRemove>
          </S.Chip>
        ))}
        <S.ChipInput
          type="number"
          aria-label="Add a reminder, in days before the due date"
          min={REMINDER_DAYS.min}
          max={REMINDER_DAYS.max}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return
            e.preventDefault()
            const next = withReminder(form.reminderDaysBefore, draft)
            if (!next) return
            if (next !== form.reminderDaysBefore) setF('reminderDaysBefore', next)
            setDraft('')
          }}
          placeholder="Days + Enter"
        />
      </S.ChipRow>
    </S.Card>
  )
}
