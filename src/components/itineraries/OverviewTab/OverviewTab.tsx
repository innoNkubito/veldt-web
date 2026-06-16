'use client'

import { useEffect, useState } from 'react'
import { T } from '@/lib/theme'
import { useBuilderStore } from '@/stores/builderStore'
import { ActionButton } from '@/components/itineraries/shared/ActionButton'
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldInput,
  FieldTextarea,
  CheckboxRow,
} from '@/components/itineraries/shared/FieldPrimitives'
import * as S from './OverviewTab.styled'
import InfoPagesCard from '@/components/itineraries/InfoPagesCard'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function OverviewTab() {
  const { itinerary, updateItinerary, saving } = useBuilderStore()
  const [form, setForm] = useState({
    proposalTitle: itinerary?.proposalTitle ?? '',
    preparedFor: itinerary?.preparedFor ?? '',
    travelDates: itinerary?.travelDates ?? '',
    internalNotes: itinerary?.internalNotes ?? '',
    whiteLabel: itinerary?.whiteLabel ?? false,
  })
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    if (itinerary) {
      setForm({
        proposalTitle: itinerary.proposalTitle,
        preparedFor: itinerary.preparedFor ?? '',
        travelDates: itinerary.travelDates ?? '',
        internalNotes: itinerary.internalNotes ?? '',
        whiteLabel: itinerary.whiteLabel,
      })
      setDirty(false)
    }
  }, [itinerary?.id])

  function set(key: keyof typeof form, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }))
    setDirty(true)
  }

  async function handleSave() {
    if (!itinerary) return
    await updateItinerary(itinerary.id, {
      proposalTitle: form.proposalTitle,
      preparedFor: form.preparedFor || undefined,
      travelDates: form.travelDates || undefined,
      internalNotes: form.internalNotes || undefined,
      whiteLabel: form.whiteLabel,
    })
    setDirty(false)
  }

  const saveButton = dirty ? (
    <ActionButton
      $variant="primary"
      onClick={handleSave}
      $disabled={saving || !form.proposalTitle.trim()}
    >
      {saving ? 'Saving…' : 'Save Changes'}
    </ActionButton>
  ) : null

  return (
    <S.Grid>
      <S.Card>
        <S.CardTitle>Trip Details</S.CardTitle>
        <FieldGroup>
          <Field>
            <FieldLabel>Proposal Title *</FieldLabel>
            <FieldInput
              value={form.proposalTitle}
              onChange={(e) => set('proposalTitle', e.target.value)}
              placeholder="e.g. Kenya Safari — 7 Days"
            />
          </Field>
          <Field>
            <FieldLabel>Prepared For</FieldLabel>
            <FieldInput
              value={form.preparedFor}
              onChange={(e) => set('preparedFor', e.target.value)}
              placeholder="e.g. James & Sarah Wilson"
            />
          </Field>
          <Field>
            <FieldLabel>Travel Dates</FieldLabel>
            <FieldInput
              value={form.travelDates}
              onChange={(e) => set('travelDates', e.target.value)}
              placeholder="e.g. September 2026"
            />
          </Field>
          <Field>
            <CheckboxRow>
              <input
                type="checkbox"
                checked={form.whiteLabel}
                onChange={(e) => set('whiteLabel', e.target.checked)}
              />
              White-label (hide Veldt branding on share link)
            </CheckboxRow>
          </Field>
        </FieldGroup>
        {saveButton}
      </S.Card>

      <S.Card>
        <S.CardTitle>Internal Notes</S.CardTitle>
        <FieldGroup>
          <Field>
            <FieldLabel>Notes (not visible to client)</FieldLabel>
            <FieldTextarea
              value={form.internalNotes}
              onChange={(e) => set('internalNotes', e.target.value)}
              placeholder="Supplier contacts, commission details, special requests…"
              rows={6}
            />
          </Field>
        </FieldGroup>
        {saveButton}
      </S.Card>

      {/* Information pages — full width */}
      <InfoPagesCard />

      {/* Share link — full width */}
      <S.Card style={{ gridColumn: '1 / -1' }}>
        <S.CardTitle>Share Link</S.CardTitle>
        <S.ShareInputRow>
          <FieldInput
            readOnly
            value={
              itinerary?.status === 'DRAFT'
                ? 'Publish this itinerary to generate a share link'
                : `${typeof window !== 'undefined' ? window.location.origin : ''}/view/${itinerary?.slug}`
            }
            style={{ color: T.muted, flex: 1 }}
          />
          {itinerary?.status !== 'DRAFT' && (
            <ActionButton
              onClick={() => {
                if (itinerary)
                  navigator.clipboard.writeText(`${window.location.origin}/view/${itinerary.slug}`)
              }}
            >
              Copy
            </ActionButton>
          )}
        </S.ShareInputRow>
        {itinerary && (
          <S.ShareMeta>
            {itinerary.viewCount} view{itinerary.viewCount !== 1 ? 's' : ''} · Created{' '}
            {formatDate(itinerary.createdAt)} · Last updated {formatDate(itinerary.updatedAt)}
          </S.ShareMeta>
        )}
      </S.Card>
    </S.Grid>
  )
}
