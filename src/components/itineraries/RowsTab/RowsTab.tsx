'use client'

import { useEffect, useRef, useState } from 'react'
import { T } from '@/lib/theme'
import { useBuilderStore, type ContentPageOption } from '@/stores/builderStore'
import RowForm from '@/components/itineraries/RowForm'
import AccommodationPicker from '@/components/itineraries/AccommodationPicker'
import * as S from './RowsTab.styled'

// ── Mini picker (shared by area + activity) ──────────────────────

function MiniPicker({
  options,
  placeholder,
  onSelect,
  onCancel,
}: {
  options: ContentPageOption[]
  placeholder: string
  onSelect: (opt: ContentPageOption) => void
  onCancel: () => void
}) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onCancel()
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [onCancel])

  const filtered = options
    .filter((o) => query === '' || o.name.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 8)

  return (
    <S.MiniPickerWrap ref={ref}>
      <S.MiniPickerInput
        autoFocus
        placeholder={placeholder}
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
      />
      {open && (
        <S.MiniPickerDropdown>
          {filtered.length === 0 ? (
            <S.MiniPickerEmpty>No results</S.MiniPickerEmpty>
          ) : (
            filtered.map((o) => (
              <S.MiniPickerItem
                key={o.id}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); onSelect(o) }}
              >
                {o.name}
              </S.MiniPickerItem>
            ))
          )}
        </S.MiniPickerDropdown>
      )}
      <S.MiniPickerCancel type="button" onClick={onCancel}>cancel</S.MiniPickerCancel>
    </S.MiniPickerWrap>
  )
}

// ── RowsTab ──────────────────────────────────────────────────────

export default function RowsTab() {
  const {
    itinerary,
    addRow, updateRow, deleteRow, reorderRows,
    addAccommodation, removeAccommodation,
    setRowAreaPage, addRowActivity, removeRowActivity,
    properties, propertiesLoading, fetchProperties,
    areaPages, activityPages, fetchAreaAndActivityPages,
  } = useBuilderStore()

  const [addingNew, setAddingNew] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [pickingAccomForRow, setPickingAccomForRow] = useState<string | null>(null)
  const [pickingAreaForRow, setPickingAreaForRow] = useState<string | null>(null)
  const [pickingActivityForRow, setPickingActivityForRow] = useState<string | null>(null)

  const rows = itinerary?.rows ?? []

  useEffect(() => {
    if (properties.length === 0 && !propertiesLoading) fetchProperties()
    if (areaPages.length === 0 && activityPages.length === 0) fetchAreaAndActivityPages()
  }, [])

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
    const next = [...rows]
    const [moved] = next.splice(index, 1)
    next.splice(index + dir, 0, moved)
    reorderRows(itinerary.id, next.map((r) => r.id))
  }

  return (
    <S.List>
      {rows.length === 0 && !addingNew && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
            padding: '80px 20px',
            color: T.muted,
            fontSize: 13,
            textAlign: 'center',
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={T.muted} strokeWidth="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
          <div>No rows yet</div>
          <div style={{ fontSize: 12 }}>Add your first day to start building the itinerary</div>
        </div>
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
            <S.Card>
              <S.DragHandle title="Move row">⠿</S.DragHandle>
              <S.Content>
                <S.Meta>
                  {row.dateLabel && <S.DayLabel>{row.dateLabel}</S.DayLabel>}
                  {row.numNights != null && (
                    <S.NightsText>
                      {row.numNights} night{row.numNights !== 1 ? 's' : ''}
                    </S.NightsText>
                  )}
                </S.Meta>

                {row.transfersText && <S.SubText>✈ {row.transfersText}</S.SubText>}

                {/* ── Area ──────────────────────────────── */}
                <S.RowSection>
                  {row.areaPage && (
                    <S.AreaChip>
                      📍 {row.areaPage.name}
                      <S.ChipRemove
                        onClick={() => setRowAreaPage(row.id, null)}
                        title="Remove area"
                      >✕</S.ChipRemove>
                    </S.AreaChip>
                  )}

                  {pickingAreaForRow === row.id ? (
                    <MiniPicker
                      options={areaPages}
                      placeholder="Search areas…"
                      onSelect={(opt) => {
                        setRowAreaPage(row.id, opt.id)
                        setPickingAreaForRow(null)
                      }}
                      onCancel={() => setPickingAreaForRow(null)}
                    />
                  ) : !row.areaPage ? (
                    <S.SectionAddButton onClick={() => setPickingAreaForRow(row.id)}>
                      + area
                    </S.SectionAddButton>
                  ) : null}
                </S.RowSection>

                {/* ── Accommodations ────────────────────── */}
                <S.AccomRow>
                  {row.accommodations.map((acc) => (
                    <S.Chip key={acc.id}>
                      🏕 {acc.contentPage.name}
                      {acc.room && <span style={{ color: T.muted }}> · {acc.room.roomType}</span>}
                      <S.ChipRemove
                        onClick={() => removeAccommodation(acc.id, row.id)}
                        title="Remove accommodation"
                      >✕</S.ChipRemove>
                    </S.Chip>
                  ))}
                </S.AccomRow>

                {pickingAccomForRow === row.id ? (
                  <AccommodationPicker
                    rowId={row.id}
                    properties={properties}
                    onAdd={addAccommodation}
                    onClose={() => setPickingAccomForRow(null)}
                  />
                ) : (
                  <S.AddAccomButton onClick={() => setPickingAccomForRow(row.id)}>
                    + accommodation
                  </S.AddAccomButton>
                )}

                {/* ── Activities ────────────────────────── */}
                <S.RowSection>
                  {row.activities.map((act) => (
                    <S.ActivityChip key={act.id}>
                      🎯 {act.contentPage.name}
                      <S.ChipRemove
                        onClick={() => removeRowActivity(act.id, row.id)}
                        title="Remove activity"
                      >✕</S.ChipRemove>
                    </S.ActivityChip>
                  ))}

                  {pickingActivityForRow === row.id ? (
                    <MiniPicker
                      options={activityPages}
                      placeholder="Search activities…"
                      onSelect={(opt) => {
                        addRowActivity(row.id, opt.id)
                        setPickingActivityForRow(null)
                      }}
                      onCancel={() => setPickingActivityForRow(null)}
                    />
                  ) : (
                    <S.SectionAddButton onClick={() => setPickingActivityForRow(row.id)}>
                      + activity
                    </S.SectionAddButton>
                  )}
                </S.RowSection>
              </S.Content>

              <S.Actions>
                <S.IconButton
                  title="Move up"
                  onClick={() => moveRow(i, -1)}
                  $color={i === 0 ? T.muted : T.sub}
                  disabled={i === 0}
                >↑</S.IconButton>
                <S.IconButton
                  title="Move down"
                  onClick={() => moveRow(i, 1)}
                  $color={i === rows.length - 1 ? T.muted : T.sub}
                  disabled={i === rows.length - 1}
                >↓</S.IconButton>
                <S.IconButton title="Edit" onClick={() => setEditingId(row.id)}>✎</S.IconButton>
                <S.IconButton title="Delete" $color="#DC2626" onClick={() => handleDelete(row.id)}>✕</S.IconButton>
              </S.Actions>
            </S.Card>
          )}
        </div>
      ))}

      {addingNew ? (
        <RowForm onSave={handleAdd} onCancel={() => setAddingNew(false)} />
      ) : (
        <S.AddRowButton onClick={() => setAddingNew(true)}>+ Add Day / Row</S.AddRowButton>
      )}
    </S.List>
  )
}
