'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useBuilderStore, ItineraryRow, ItineraryCosts } from '@/stores/builderStore'
import { useClientStore } from '@/stores/clientStore'
import { T } from '@/lib/theme'
import { STATUS_META } from '../constants'
import * as S from './page.styled'

// ── Helpers ────────────────────────────────────────────────────

type BuilderTab = 'overview' | 'rows' | 'costs'

const TABS: { key: BuilderTab; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'rows', label: 'Day-by-Day' },
  { key: 'costs', label: 'Costs' },
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// ── Overview tab ───────────────────────────────────────────────

function OverviewTab() {
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

  return (
    <S.OverviewGrid>
      <S.Card>
        <S.CardTitle>Trip Details</S.CardTitle>
        <S.FieldGroup>
          <S.Field>
            <S.FieldLabel>Proposal Title *</S.FieldLabel>
            <S.FieldInput
              value={form.proposalTitle}
              onChange={(e) => set('proposalTitle', e.target.value)}
              placeholder="e.g. Kenya Safari — 7 Days"
            />
          </S.Field>
          <S.Field>
            <S.FieldLabel>Prepared For</S.FieldLabel>
            <S.FieldInput
              value={form.preparedFor}
              onChange={(e) => set('preparedFor', e.target.value)}
              placeholder="e.g. James & Sarah Wilson"
            />
          </S.Field>
          <S.Field>
            <S.FieldLabel>Travel Dates</S.FieldLabel>
            <S.FieldInput
              value={form.travelDates}
              onChange={(e) => set('travelDates', e.target.value)}
              placeholder="e.g. September 2026"
            />
          </S.Field>
          <S.Field>
            <S.CheckboxRow>
              <input
                type="checkbox"
                checked={form.whiteLabel}
                onChange={(e) => set('whiteLabel', e.target.checked)}
              />
              White-label (hide Veldt branding on share link)
            </S.CheckboxRow>
          </S.Field>
        </S.FieldGroup>

        {dirty && (
          <S.ActionButton
            $variant="primary"
            onClick={handleSave}
            $disabled={saving || !form.proposalTitle.trim()}
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </S.ActionButton>
        )}
      </S.Card>

      <S.Card>
        <S.CardTitle>Internal Notes</S.CardTitle>
        <S.FieldGroup>
          <S.Field>
            <S.FieldLabel>Notes (not visible to client)</S.FieldLabel>
            <S.FieldTextarea
              value={form.internalNotes}
              onChange={(e) => set('internalNotes', e.target.value)}
              placeholder="Supplier contacts, commission details, special requests…"
              rows={6}
            />
          </S.Field>
        </S.FieldGroup>

        {dirty && (
          <S.ActionButton
            $variant="primary"
            onClick={handleSave}
            $disabled={saving || !form.proposalTitle.trim()}
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </S.ActionButton>
        )}
      </S.Card>

      {/* Share link info */}
      <S.Card style={{ gridColumn: '1 / -1' }}>
        <S.CardTitle>Share Link</S.CardTitle>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <S.FieldInput
            readOnly
            value={
              itinerary?.status === 'DRAFT'
                ? 'Publish this itinerary to generate a share link'
                : `${typeof window !== 'undefined' ? window.location.origin : ''}/view/${itinerary?.slug}`
            }
            style={{ color: T.muted, flex: 1 }}
          />
          {itinerary?.status !== 'DRAFT' && (
            <S.ActionButton
              onClick={() => {
                if (itinerary)
                  navigator.clipboard.writeText(
                    `${window.location.origin}/view/${itinerary.slug}`,
                  )
              }}
            >
              Copy
            </S.ActionButton>
          )}
        </div>
        {itinerary && (
          <div style={{ marginTop: 8, fontSize: 11, color: T.muted }}>
            {itinerary.viewCount} view{itinerary.viewCount !== 1 ? 's' : ''} · Created{' '}
            {formatDate(itinerary.createdAt)} · Last updated {formatDate(itinerary.updatedAt)}
          </div>
        )}
      </S.Card>
    </S.OverviewGrid>
  )
}

// ── Row edit form ──────────────────────────────────────────────

function RowForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<ItineraryRow>
  onSave: (data: {
    dateLabel?: string
    numNights?: number
    transfersText?: string
  }) => void
  onCancel: () => void
}) {
  const [dateLabel, setDateLabel] = useState(initial?.dateLabel ?? '')
  const [numNights, setNumNights] = useState(
    initial?.numNights != null ? String(initial.numNights) : '',
  )
  const [transfersText, setTransfersText] = useState(initial?.transfersText ?? '')

  return (
    <S.RowEditForm>
      <S.RowFormGrid>
        <S.Field>
          <S.FieldLabel>Day / Date Label</S.FieldLabel>
          <S.FieldInput
            value={dateLabel}
            onChange={(e) => setDateLabel(e.target.value)}
            placeholder="e.g. Day 1 · May 15"
          />
        </S.Field>
        <S.Field>
          <S.FieldLabel>Nights</S.FieldLabel>
          <S.FieldInput
            type="number"
            min={0}
            value={numNights}
            onChange={(e) => setNumNights(e.target.value)}
            placeholder="e.g. 2"
          />
        </S.Field>
        <S.Field>
          <S.FieldLabel>Transfers / Movement</S.FieldLabel>
          <S.FieldInput
            value={transfersText}
            onChange={(e) => setTransfersText(e.target.value)}
            placeholder="e.g. Fly Nairobi → Maasai Mara"
          />
        </S.Field>
      </S.RowFormGrid>
      <S.RowFormActions>
        <S.SmallButton onClick={onCancel}>Cancel</S.SmallButton>
        <S.SmallButton
          $primary
          onClick={() =>
            onSave({
              dateLabel: dateLabel || undefined,
              numNights: numNights ? parseInt(numNights) : undefined,
              transfersText: transfersText || undefined,
            })
          }
        >
          {initial?.id ? 'Save Row' : 'Add Row'}
        </S.SmallButton>
      </S.RowFormActions>
    </S.RowEditForm>
  )
}

// ── Rows tab ───────────────────────────────────────────────────

function RowsTab() {
  const { itinerary, addRow, updateRow, deleteRow, reorderRows } = useBuilderStore()
  const [addingNew, setAddingNew] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const rows = itinerary?.rows ?? []

  async function handleAdd(data: Parameters<typeof addRow>[1]) {
    if (!itinerary) return
    await addRow(itinerary.id, data)
    setAddingNew(false)
  }

  async function handleUpdate(id: string, data: Parameters<typeof updateRow>[1]) {
    await updateRow(id, data)
    setEditingId(null)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this row?')) return
    await deleteRow(id)
  }

  function moveRow(index: number, dir: -1 | 1) {
    if (!itinerary) return
    const newRows = [...rows]
    const [moved] = newRows.splice(index, 1)
    newRows.splice(index + dir, 0, moved)
    reorderRows(itinerary.id, newRows.map((r) => r.id))
  }

  return (
    <div>
      <S.RowList>
        {rows.length === 0 && !addingNew && (
          <S.CenteredState>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={T.muted} strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/>
              <line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
            <div>No rows yet</div>
            <div style={{ fontSize: 12 }}>Add your first day to start building the itinerary</div>
          </S.CenteredState>
        )}

        {rows.map((row, i) => (
          <div key={row.id}>
            {editingId === row.id ? (
              <RowForm
                initial={row}
                onSave={(data) => handleUpdate(row.id, data)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <S.RowCard>
                <S.RowDragHandle title="Move row">⠿</S.RowDragHandle>
                <S.RowContent>
                  <S.RowMeta>
                    {row.dateLabel && <S.RowDayLabel>{row.dateLabel}</S.RowDayLabel>}
                    {row.numNights != null && (
                      <span style={{ fontSize: 11, color: T.muted }}>
                        {row.numNights} night{row.numNights !== 1 ? 's' : ''}
                      </span>
                    )}
                  </S.RowMeta>
                  {row.transfersText && (
                    <S.RowSubtext>✈ {row.transfersText}</S.RowSubtext>
                  )}
                  <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap' as const }}>
                    {row.accommodations.map((acc) => (
                      <S.AccommodationChip key={acc.id}>
                        🏕 {acc.contentPage.title}
                        {acc.room && <span style={{ color: T.muted }}> · {acc.room.name}</span>}
                      </S.AccommodationChip>
                    ))}
                  </div>
                </S.RowContent>
                <S.RowActions>
                  <S.IconButton
                    title="Move up"
                    onClick={() => moveRow(i, -1)}
                    $color={i === 0 ? T.muted : T.sub}
                    disabled={i === 0}
                  >
                    ↑
                  </S.IconButton>
                  <S.IconButton
                    title="Move down"
                    onClick={() => moveRow(i, 1)}
                    $color={i === rows.length - 1 ? T.muted : T.sub}
                    disabled={i === rows.length - 1}
                  >
                    ↓
                  </S.IconButton>
                  <S.IconButton title="Edit" onClick={() => setEditingId(row.id)}>
                    ✎
                  </S.IconButton>
                  <S.IconButton title="Delete" $color="#DC2626" onClick={() => handleDelete(row.id)}>
                    ✕
                  </S.IconButton>
                </S.RowActions>
              </S.RowCard>
            )}
          </div>
        ))}

        {addingNew ? (
          <RowForm onSave={handleAdd} onCancel={() => setAddingNew(false)} />
        ) : (
          <S.AddRowButton onClick={() => setAddingNew(true)}>
            + Add Day / Row
          </S.AddRowButton>
        )}
      </S.RowList>
    </div>
  )
}

// ── Costs tab ──────────────────────────────────────────────────

function CostsTab() {
  const { itinerary, upsertCosts, saving } = useBuilderStore()
  const existing = itinerary?.costs

  const [form, setForm] = useState({
    pricePerPerson: existing?.pricePerPerson != null ? String(existing.pricePerPerson) : '',
    numGuests: existing?.numGuests != null ? String(existing.numGuests) : '2',
    accommodationType: existing?.accommodationType ?? '',
    currency: existing?.currency ?? 'USD',
    costsToBeDetetermined: existing?.costsToBeDetetermined ?? false,
    costIncludes: existing?.costIncludes ?? '',
    costExcludes: existing?.costExcludes ?? '',
    costNotes: existing?.costNotes ?? '',
    notesVisible: existing?.notesVisible ?? false,
    miscText: existing?.miscText ?? '',
    miscVisible: existing?.miscVisible ?? false,
    priceVisible: existing?.priceVisible ?? true,
    accuracyConfirmed: existing?.accuracyConfirmed ?? false,
  })
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    if (existing) {
      setForm({
        pricePerPerson: existing.pricePerPerson != null ? String(existing.pricePerPerson) : '',
        numGuests: String(existing.numGuests),
        accommodationType: existing.accommodationType ?? '',
        currency: existing.currency,
        costsToBeDetetermined: existing.costsToBeDetetermined,
        costIncludes: existing.costIncludes ?? '',
        costExcludes: existing.costExcludes ?? '',
        costNotes: existing.costNotes ?? '',
        notesVisible: existing.notesVisible,
        miscText: existing.miscText ?? '',
        miscVisible: existing.miscVisible,
        priceVisible: existing.priceVisible,
        accuracyConfirmed: existing.accuracyConfirmed,
      })
      setDirty(false)
    }
  }, [itinerary?.id])

  function setF(key: keyof typeof form, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }))
    setDirty(true)
  }

  async function handleSave() {
    if (!itinerary) return
    await upsertCosts(itinerary.id, {
      pricePerPerson: form.pricePerPerson ? parseFloat(form.pricePerPerson) : undefined,
      numGuests: parseInt(form.numGuests) || 2,
      accommodationType: form.accommodationType || undefined,
      currency: form.currency || 'USD',
      costsToBeDetetermined: form.costsToBeDetetermined,
      costIncludes: form.costIncludes || undefined,
      costExcludes: form.costExcludes || undefined,
      costNotes: form.costNotes || undefined,
      notesVisible: form.notesVisible,
      miscText: form.miscText || undefined,
      miscVisible: form.miscVisible,
      priceVisible: form.priceVisible,
      accuracyConfirmed: form.accuracyConfirmed,
    } as any)
    setDirty(false)
  }

  const CURRENCIES = ['USD', 'EUR', 'GBP', 'AUD', 'ZAR', 'KES', 'TZS']

  return (
    <div>
      <S.Card>
        <S.CardTitle>Pricing</S.CardTitle>
        <S.CostsGrid>
          <S.Field>
            <S.FieldLabel>Price Per Person</S.FieldLabel>
            <S.FieldInput
              type="number"
              min={0}
              value={form.pricePerPerson}
              onChange={(e) => setF('pricePerPerson', e.target.value)}
              placeholder="e.g. 4500"
              disabled={form.costsToBeDetetermined}
            />
          </S.Field>
          <S.Field>
            <S.FieldLabel>Currency</S.FieldLabel>
            <S.FieldSelect value={form.currency} onChange={(e) => setF('currency', e.target.value)}>
              {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
            </S.FieldSelect>
          </S.Field>
          <S.Field>
            <S.FieldLabel>Number of Guests</S.FieldLabel>
            <S.FieldInput
              type="number"
              min={1}
              value={form.numGuests}
              onChange={(e) => setF('numGuests', e.target.value)}
            />
          </S.Field>
          <S.Field>
            <S.FieldLabel>Accommodation Type</S.FieldLabel>
            <S.FieldInput
              value={form.accommodationType}
              onChange={(e) => setF('accommodationType', e.target.value)}
              placeholder="e.g. Luxury tented camps"
            />
          </S.Field>
          <S.CostsFullRow>
            <S.CheckboxRow>
              <input
                type="checkbox"
                checked={form.costsToBeDetetermined}
                onChange={(e) => setF('costsToBeDetetermined', e.target.checked)}
              />
              Costs to be determined (hides price on share link)
            </S.CheckboxRow>
          </S.CostsFullRow>
          <S.CostsFullRow>
            <S.CheckboxRow>
              <input
                type="checkbox"
                checked={form.priceVisible}
                onChange={(e) => setF('priceVisible', e.target.checked)}
              />
              Show price on client share link
            </S.CheckboxRow>
          </S.CostsFullRow>
        </S.CostsGrid>
      </S.Card>

      <S.Card>
        <S.CardTitle>Includes &amp; Excludes</S.CardTitle>
        <S.CostsGrid>
          <S.Field>
            <S.FieldLabel>Cost Includes</S.FieldLabel>
            <S.FieldTextarea
              value={form.costIncludes}
              onChange={(e) => setF('costIncludes', e.target.value)}
              placeholder="All accommodation, internal flights, activities…"
              rows={4}
            />
          </S.Field>
          <S.Field>
            <S.FieldLabel>Cost Excludes</S.FieldLabel>
            <S.FieldTextarea
              value={form.costExcludes}
              onChange={(e) => setF('costExcludes', e.target.value)}
              placeholder="International airfare, travel insurance, visas…"
              rows={4}
            />
          </S.Field>
          <S.CostsFullRow>
            <S.FieldLabel>Cost Notes</S.FieldLabel>
            <S.FieldTextarea
              value={form.costNotes}
              onChange={(e) => setF('costNotes', e.target.value)}
              placeholder="Validity period, payment schedule, cancellation policy…"
              rows={3}
            />
            <S.CheckboxRow style={{ marginTop: 6 }}>
              <input
                type="checkbox"
                checked={form.notesVisible}
                onChange={(e) => setF('notesVisible', e.target.checked)}
              />
              Show notes on client share link
            </S.CheckboxRow>
          </S.CostsFullRow>
          <S.CostsFullRow>
            <S.FieldLabel>Miscellaneous Text</S.FieldLabel>
            <S.FieldTextarea
              value={form.miscText}
              onChange={(e) => setF('miscText', e.target.value)}
              placeholder="Any additional pricing information…"
              rows={2}
            />
            <S.CheckboxRow style={{ marginTop: 6 }}>
              <input
                type="checkbox"
                checked={form.miscVisible}
                onChange={(e) => setF('miscVisible', e.target.checked)}
              />
              Show miscellaneous text on client share link
            </S.CheckboxRow>
          </S.CostsFullRow>
        </S.CostsGrid>
      </S.Card>

      <S.Card>
        <S.CardTitle>Accuracy Confirmation</S.CardTitle>
        <S.ConfirmRow
          $checked={form.accuracyConfirmed}
          onClick={() => setF('accuracyConfirmed', !form.accuracyConfirmed)}
        >
          <S.ConfirmCheckbox
            type="checkbox"
            checked={form.accuracyConfirmed}
            onChange={() => {}}
          />
          I confirm that all pricing and cost information is accurate and up to date.
          {form.accuracyConfirmed && (
            <span style={{ marginLeft: 'auto', fontSize: 11, color: T.sage, fontWeight: 600 }}>
              ✓ Confirmed
            </span>
          )}
        </S.ConfirmRow>
        <div style={{ fontSize: 11.5, color: T.muted, marginTop: 8 }}>
          Accuracy must be confirmed before publishing. It resets when a cost template is applied.
        </div>
      </S.Card>

      {dirty && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <S.ActionButton $variant="primary" onClick={handleSave} $disabled={saving}>
            {saving ? 'Saving…' : 'Save Costs'}
          </S.ActionButton>
        </div>
      )}
    </div>
  )
}

// ── Publish confirmation modal ─────────────────────────────────

function PublishModal({
  onConfirm,
  onCancel,
  loading,
}: {
  onConfirm: () => void
  onCancel: () => void
  loading: boolean
}) {
  return (
    <S.ModalOverlay onClick={onCancel}>
      <S.ModalCard onClick={(e) => e.stopPropagation()}>
        <S.ModalTitle>Publish Itinerary?</S.ModalTitle>
        <S.ModalBody>
          Publishing will make this itinerary accessible via its share link. Clients will be able
          to view it, and view count tracking will begin.
          <br />
          <br />
          Make sure all costs are confirmed and content is finalised before publishing.
        </S.ModalBody>
        <S.ModalActions>
          <S.ActionButton onClick={onCancel}>Cancel</S.ActionButton>
          <S.ActionButton $variant="primary" onClick={onConfirm} $disabled={loading}>
            {loading ? 'Publishing…' : 'Publish Now'}
          </S.ActionButton>
        </S.ModalActions>
      </S.ModalCard>
    </S.ModalOverlay>
  )
}

// ── Page ───────────────────────────────────────────────────────

export default function ItineraryBuilderPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const client = useClientStore((s) => s.client)
  const { itinerary, loading, error, saving, fetchItinerary, publishItinerary } = useBuilderStore()

  const [activeTab, setActiveTab] = useState<BuilderTab>('overview')
  const [showPublish, setShowPublish] = useState(false)
  const [publishError, setPublishError] = useState<string | null>(null)
  const [publishing, setPublishing] = useState(false)

  useEffect(() => {
    if (client && id) fetchItinerary(id)
  }, [client, id])

  async function handlePublish() {
    if (!itinerary) return
    setPublishing(true)
    const err = await publishItinerary(itinerary.id)
    setPublishing(false)
    if (err) {
      setPublishError(err.replace('VALIDATION: ', ''))
      setShowPublish(false)
    } else {
      setShowPublish(false)
      setPublishError(null)
    }
  }

  const statusMeta = STATUS_META[itinerary?.status ?? ''] ?? { color: T.muted, bg: T.dim }
  const isDraft = itinerary?.status === 'DRAFT'

  if (loading) {
    return (
      <S.CenteredState>
        <div>Loading itinerary…</div>
      </S.CenteredState>
    )
  }

  if (error || (!loading && !itinerary)) {
    return (
      <S.CenteredState>
        <div>{error ?? 'Itinerary not found'}</div>
        <S.ActionButton onClick={() => router.push('/itineraries')}>
          ← Back to Itineraries
        </S.ActionButton>
      </S.CenteredState>
    )
  }

  return (
    <S.PageRoot>
      {/* ── Header ─────────────────────────────────────────── */}
      <S.Header>
        <S.HeaderLeft>
          <S.BackLink onClick={() => router.push('/itineraries')}>
            ← Itineraries
          </S.BackLink>
          <S.TitleRow>
            <S.PageTitle>{itinerary?.proposalTitle}</S.PageTitle>
            {itinerary?.status && (
              <S.StatusBadge $bg={statusMeta.bg} $color={statusMeta.color}>
                {itinerary.status.charAt(0) + itinerary.status.slice(1).toLowerCase()}
              </S.StatusBadge>
            )}
          </S.TitleRow>
          <S.HeaderMeta>
            {itinerary?.preparedFor && <span>For {itinerary.preparedFor}</span>}
            {itinerary?.preparedFor && itinerary?.travelDates && <S.MetaDot />}
            {itinerary?.travelDates && <span>{itinerary.travelDates}</span>}
            {itinerary && <S.MetaDot />}
            <span>{itinerary?.rows.length ?? 0} days · {itinerary?.viewCount ?? 0} views</span>
          </S.HeaderMeta>
        </S.HeaderLeft>

        <S.HeaderActions>
          {saving && <S.SaveIndicator>Saving…</S.SaveIndicator>}

          {itinerary?.status !== 'DRAFT' && (
            <S.ActionButton
              onClick={() =>
                navigator.clipboard.writeText(
                  `${window.location.origin}/view/${itinerary?.slug}`,
                )
              }
            >
              Copy Share Link
            </S.ActionButton>
          )}

          {isDraft && (
            <S.ActionButton $variant="primary" onClick={() => setShowPublish(true)}>
              Publish
            </S.ActionButton>
          )}

          {itinerary?.status === 'PUBLISHED' && (
            <S.ActionButton
              $variant="primary"
              onClick={() => itinerary && publishItinerary(itinerary.id)}
            >
              Mark Confirmed
            </S.ActionButton>
          )}
        </S.HeaderActions>
      </S.Header>

      {/* ── Publish error ───────────────────────────────────── */}
      {publishError && (
        <S.ErrorBanner>
          {publishError}{' '}
          <button
            style={{ marginLeft: 8, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626' }}
            onClick={() => setPublishError(null)}
          >
            Dismiss
          </button>
        </S.ErrorBanner>
      )}

      {/* ── Tabs ────────────────────────────────────────────── */}
      <S.TabBar>
        {TABS.map(({ key, label }) => (
          <S.Tab key={key} $active={activeTab === key} onClick={() => setActiveTab(key)}>
            {label}
          </S.Tab>
        ))}
      </S.TabBar>

      {/* ── Tab panels ──────────────────────────────────────── */}
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'rows' && <RowsTab />}
      {activeTab === 'costs' && <CostsTab />}

      {/* ── Publish modal ────────────────────────────────────── */}
      {showPublish && (
        <PublishModal
          onConfirm={handlePublish}
          onCancel={() => setShowPublish(false)}
          loading={publishing}
        />
      )}
    </S.PageRoot>
  )
}
