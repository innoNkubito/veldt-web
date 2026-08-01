'use client'

import { useState } from 'react'
import {
  Field,
  FieldLabel,
  FieldInput,
  FieldTextarea,
} from '@/components/itineraries/shared/FieldPrimitives'
import type { BookingPackage, PackageInput } from '@/stores/bookingStore'
import * as S from './BookingTab.styled'

interface Props {
  existing: BookingPackage | null // null = create
  currency: string
  saving: boolean
  onSave: (input: PackageInput) => Promise<string | null>
  onClose: () => void
}

export default function PackageModal({ existing, currency, saving, onSave, onClose }: Props) {
  const [name, setName] = useState(existing?.name ?? '')
  const [description, setDescription] = useState(existing?.description ?? '')
  const [price, setPrice] = useState(existing != null ? String(existing.price) : '')
  const [totalAvailable, setTotalAvailable] = useState(
    existing != null ? String(existing.totalAvailable) : '1',
  )
  const [peopleIncluded, setPeopleIncluded] = useState(
    existing != null ? String(existing.peopleIncluded) : '2',
  )
  const [error, setError] = useState<string | null>(null)

  async function handleSave() {
    if (saving) return
    if (!name.trim()) return setError('Package name is required')
    const priceNum = parseFloat(price)
    if (Number.isNaN(priceNum) || priceNum < 0) return setError('Enter a valid price')
    const availableNum = parseInt(totalAvailable, 10)
    if (!Number.isInteger(availableNum) || availableNum < 1) {
      return setError('Availability must be at least 1')
    }
    const peopleNum = parseInt(peopleIncluded, 10)
    if (!Number.isInteger(peopleNum) || peopleNum < 1) {
      return setError('People included must be at least 1')
    }
    setError(null)

    const message = await onSave({
      name: name.trim(),
      description: description.trim() || null,
      price: priceNum,
      totalAvailable: availableNum,
      peopleIncluded: peopleNum,
    })
    if (message) setError(message)
    else onClose()
  }

  return (
    <S.Overlay onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <S.ModalCard>
        <S.ModalTitle>{existing ? 'Edit Package' : 'Add Package'}</S.ModalTitle>

        {error && <S.ErrorBanner>{error}</S.ErrorBanner>}

        <Field>
          <FieldLabel>Name</FieldLabel>
          <FieldInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Classic Safari — Double Occupancy"
          />
        </Field>

        <Field>
          <FieldLabel>Description</FieldLabel>
          <FieldTextarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What this package includes…"
          />
        </Field>

        <S.Grid>
          <Field>
            <FieldLabel>Price ({currency})</FieldLabel>
            <FieldInput
              type="number"
              min={0}
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 9000"
            />
          </Field>
          <Field>
            <FieldLabel>People Included</FieldLabel>
            <FieldInput
              type="number"
              min={1}
              value={peopleIncluded}
              onChange={(e) => setPeopleIncluded(e.target.value)}
            />
          </Field>
          <S.FullRow>
            <Field>
              <FieldLabel># Available</FieldLabel>
              <FieldInput
                type="number"
                min={1}
                value={totalAvailable}
                onChange={(e) => setTotalAvailable(e.target.value)}
              />
            </Field>
          </S.FullRow>
        </S.Grid>
        <S.CardHint style={{ margin: 0 }}>
          Price is for the whole package. Guest count comes from the packages a client books —
          add-ons are then priced per guest.
        </S.CardHint>

        <S.ModalActions>
          <S.CancelButton onClick={onClose}>Cancel</S.CancelButton>
          <S.SaveButton $disabled={saving} onClick={handleSave}>
            {saving ? 'Saving…' : existing ? 'Save' : 'Add Package'}
          </S.SaveButton>
        </S.ModalActions>
      </S.ModalCard>
    </S.Overlay>
  )
}
