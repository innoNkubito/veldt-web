'use client'

import { useState } from 'react'
import * as S from './CreateItineraryModal.styled'

export interface CreateItineraryInput {
  proposalTitle: string
  preparedFor: string
  travelDates: string
}

interface Props {
  onClose: () => void
  onCreate: (data: CreateItineraryInput) => Promise<void>
}

export default function CreateItineraryModal({ onClose, onCreate }: Props) {
  const [title, setTitle] = useState('')
  const [client, setClient] = useState('')
  const [dates, setDates] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleCreate() {
    if (!title.trim()) return
    setLoading(true)
    await onCreate({ proposalTitle: title, preparedFor: client, travelDates: dates })
    setLoading(false)
  }

  const fields = [
    {
      label: 'Proposal Title *',
      value: title,
      onChange: setTitle,
      placeholder: 'e.g. Kenya Safari — 7 Days',
    },
    {
      label: 'Prepared For',
      value: client,
      onChange: setClient,
      placeholder: 'e.g. James & Sarah Wilson',
    },
    {
      label: 'Travel Dates',
      value: dates,
      onChange: setDates,
      placeholder: 'e.g. September 2026',
    },
  ]

  return (
    <S.Overlay onClick={onClose}>
      <S.Card onClick={(e) => e.stopPropagation()}>
        <S.Header>
          <S.Title>New Itinerary</S.Title>
          <S.Subtitle>Fill in the basics — you can complete the rest in the builder</S.Subtitle>
        </S.Header>

        <S.FieldGroup>
          {fields.map(({ label, value, onChange, placeholder }) => (
            <div key={label}>
              <S.FieldLabel>{label}</S.FieldLabel>
              <S.FieldInput
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
              />
            </div>
          ))}
        </S.FieldGroup>

        <S.Actions>
          <S.CancelButton onClick={onClose}>Cancel</S.CancelButton>
          <S.PrimaryButton
            onClick={handleCreate}
            disabled={loading || !title.trim()}
            $disabled={loading || !title.trim()}
          >
            {loading ? 'Creating...' : 'Create Itinerary'}
          </S.PrimaryButton>
        </S.Actions>
      </S.Card>
    </S.Overlay>
  )
}
