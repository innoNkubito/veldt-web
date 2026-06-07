'use client'

import { useEffect, useState } from 'react'
import { T } from '@/lib/theme'
import { useBuilderStore } from '@/stores/builderStore'
import RowForm from '@/components/itineraries/RowForm'
import AccommodationPicker from '@/components/itineraries/AccommodationPicker'
import * as S from './RowsTab.styled'

export default function RowsTab() {
  const {
    itinerary,
    addRow, updateRow, deleteRow, reorderRows,
    addAccommodation, removeAccommodation,
    properties, propertiesLoading, fetchProperties,
  } = useBuilderStore()

  const [addingNew, setAddingNew] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [pickingAccomForRow, setPickingAccomForRow] = useState<string | null>(null)

  const rows = itinerary?.rows ?? []

  useEffect(() => {
    if (properties.length === 0 && !propertiesLoading) {
      fetchProperties()
    }
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

                <S.AccomRow>
                  {row.accommodations.map((acc) => (
                    <S.Chip key={acc.id}>
                      🏕 {acc.contentPage.name}
                      {acc.room && <span style={{ color: T.muted }}> · {acc.room.roomType}</span>}
                      <S.ChipRemove
                        onClick={() => removeAccommodation(acc.id, row.id)}
                        title="Remove accommodation"
                      >
                        ✕
                      </S.ChipRemove>
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
              </S.Content>
              <S.Actions>
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
