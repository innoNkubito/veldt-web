'use client'

import { useState } from 'react'
import {
  Field,
  FieldLabel,
  FieldInput,
  FieldTextarea,
} from '@/components/itineraries/shared/FieldPrimitives'
import type { BookingAddon, AddonInput } from '@/stores/bookingStore'
import * as S from './BookingTab.styled'

interface Props {
  existing: BookingAddon | null // null = create
  currency: string
  saving: boolean
  onSave: (input: AddonInput) => Promise<string | null>
  onClose: () => void
}

export default function AddonModal({ existing, currency, saving, onSave, onClose }: Props) {
  const [name, setName] = useState(existing?.name ?? '')
  const [description, setDescription] = useState(existing?.description ?? '')
  const [perPersonPrice, setPerPersonPrice] = useState(
    existing != null ? String(existing.perPersonPrice) : '',
  )
  const [limitCount, setLimitCount] = useState(
    existing?.limitCount != null ? String(existing.limitCount) : '',
  )
  const [error, setError] = useState<string | null>(null)

  async function handleSave() {
    if (saving) return
    if (!name.trim()) return setError('Add-on name is required')
    const priceNum = parseFloat(perPersonPrice)
    if (Number.isNaN(priceNum) || priceNum < 0) return setError('Enter a valid per-person price')
    let limitNum: number | null = null
    if (limitCount.trim()) {
      limitNum = parseInt(limitCount, 10)
      if (!Number.isInteger(limitNum) || limitNum < 1) {
        return setError('Limit count must be at least 1')
      }
    }
    setError(null)

    const message = await onSave({
      name: name.trim(),
      description: description.trim() || null,
      perPersonPrice: priceNum,
      limitCount: limitNum,
    })
    if (message) setError(message)
    else onClose()
  }

  return (
    <S.Overlay onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <S.ModalCard>
        <S.ModalTitle>{existing ? 'Edit Add-on' : 'Add Add-on'}</S.ModalTitle>

        {error && <S.ErrorBanner>{error}</S.ErrorBanner>}

        <Field>
          <FieldLabel>Name</FieldLabel>
          <FieldInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Hot Air Balloon Safari"
          />
        </Field>

        <Field>
          <FieldLabel>Description</FieldLabel>
          <FieldTextarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What the add-on includes…"
          />
        </Field>

        <S.Grid>
          <Field>
            <FieldLabel>Per-Person Price ({currency})</FieldLabel>
            <FieldInput
              type="number"
              min={0}
              step="0.01"
              value={perPersonPrice}
              onChange={(e) => setPerPersonPrice(e.target.value)}
              placeholder="e.g. 450"
            />
          </Field>
          <Field>
            <FieldLabel>Limit Count (optional)</FieldLabel>
            <FieldInput
              type="number"
              min={1}
              value={limitCount}
              onChange={(e) => setLimitCount(e.target.value)}
              placeholder="No limit"
            />
          </Field>
        </S.Grid>
        <S.CardHint style={{ margin: 0 }}>
          Add-ons are charged per guest — quantity follows the booking&apos;s guest count. A limit
          count caps how many guests it can cover.
        </S.CardHint>

        <S.ModalActions>
          <S.CancelButton onClick={onClose}>Cancel</S.CancelButton>
          <S.SaveButton $disabled={saving} onClick={handleSave}>
            {saving ? 'Saving…' : existing ? 'Save' : 'Add Add-on'}
          </S.SaveButton>
        </S.ModalActions>
      </S.ModalCard>
    </S.Overlay>
  )
}
