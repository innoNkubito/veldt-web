'use client'

import { useEffect, useRef, useState } from 'react'
import { useBuilderStore, type ItineraryRow } from '@/stores/builderStore'
import RichTextEditor from '@/components/itineraries/RichTextEditor'
import * as S from './RowsTab.styled'

// ── Row action menu ───────────────────────────────────────────────

function RowActionMenu({
  onMoveUp,
  onMoveDown,
  onDelete,
  disableUp,
  disableDown,
}: {
  onMoveUp: () => void
  onMoveDown: () => void
  onDelete: () => void
  disableUp: boolean
  disableDown: boolean
}) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, right: 0 })
  const triggerRef = useRef<HTMLButtonElement>(null)

  function handleOpen() {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right })
    }
    setOpen((o) => !o)
  }

  return (
    <>
      <S.ActionTrigger ref={triggerRef} onClick={handleOpen} title="Row actions">
        ⋯
      </S.ActionTrigger>
      {open && (
        <>
          <S.ActionBackdrop onClick={() => setOpen(false)} />
          <S.ActionDropdown $top={pos.top} $right={pos.right}>
            <S.ActionItem
              disabled={disableUp}
              onClick={() => { onMoveUp(); setOpen(false) }}
              style={{ opacity: disableUp ? 0.4 : 1 }}
            >
              ↑ Move up
            </S.ActionItem>
            <S.ActionItem
              disabled={disableDown}
              onClick={() => { onMoveDown(); setOpen(false) }}
              style={{ opacity: disableDown ? 0.4 : 1 }}
            >
              ↓ Move down
            </S.ActionItem>
            <S.ActionItem $danger onClick={() => { onDelete(); setOpen(false) }}>
              Delete row
            </S.ActionItem>
          </S.ActionDropdown>
        </>
      )}
    </>
  )
}

// ── Inline date editor ────────────────────────────────────────────

function DateCell({
  row,
  onSave,
}: {
  row: ItineraryRow
  onSave: (dateLabel: string, numNights: number | undefined) => void
}) {
  const [editing, setEditing] = useState(false)
  const [dateLabel, setDateLabel] = useState(row.dateLabel ?? '')
  const [numNights, setNumNights] = useState(
    row.numNights != null ? String(row.numNights) : '',
  )

  function handleSave() {
    onSave(dateLabel, numNights ? parseInt(numNights, 10) : undefined)
    setEditing(false)
  }

  function handleCancel() {
    setDateLabel(row.dateLabel ?? '')
    setNumNights(row.numNights != null ? String(row.numNights) : '')
    setEditing(false)
  }

  if (editing) {
    return (
      <S.DateEditForm>
        <S.DateInput
          autoFocus
          value={dateLabel}
          onChange={(e) => setDateLabel(e.target.value)}
          placeholder="e.g. Day 1 · May 15"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave()
            if (e.key === 'Escape') handleCancel()
          }}
        />
        <S.DateInput
          type="number"
          min={0}
          value={numNights}
          onChange={(e) => setNumNights(e.target.value)}
          placeholder="Nights"
        />
        <S.DateEditActions>
          <S.DateEditSave onClick={handleSave}>Save</S.DateEditSave>
          <S.DateEditCancel onClick={handleCancel}>Cancel</S.DateEditCancel>
        </S.DateEditActions>
      </S.DateEditForm>
    )
  }

  return (
    <S.DateDisplay onClick={() => setEditing(true)}>
      {row.dateLabel ? (
        <S.DateLabel className="date-label">{row.dateLabel}</S.DateLabel>
      ) : (
        <S.DatePlaceholder>Click to set date</S.DatePlaceholder>
      )}
      {row.numNights != null && (
        <S.NightsLabel>
          {row.numNights} night{row.numNights !== 1 ? 's' : ''}
        </S.NightsLabel>
      )}
    </S.DateDisplay>
  )
}

// ── Add row form ──────────────────────────────────────────────────

function AddRowForm({
  onSave,
  onCancel,
}: {
  onSave: (dateLabel: string, numNights: number | undefined) => void
  onCancel: () => void
}) {
  const [dateLabel, setDateLabel] = useState('')
  const [numNights, setNumNights] = useState('')

  return (
    <S.AddRowForm>
      <S.AddRowFormGrid>
        <div>
          <S.AddRowFieldLabel>Day / Date Label</S.AddRowFieldLabel>
          <S.AddRowInput
            autoFocus
            value={dateLabel}
            onChange={(e) => setDateLabel(e.target.value)}
            placeholder="e.g. Day 1 · May 15"
            onKeyDown={(e) => e.key === 'Escape' && onCancel()}
          />
        </div>
        <div>
          <S.AddRowFieldLabel>Nights</S.AddRowFieldLabel>
          <S.AddRowInput
            type="number"
            min={0}
            value={numNights}
            onChange={(e) => setNumNights(e.target.value)}
            placeholder="e.g. 2"
          />
        </div>
      </S.AddRowFormGrid>
      <S.AddRowFormActions>
        <S.AddRowCancel onClick={onCancel}>Cancel</S.AddRowCancel>
        <S.AddRowSave
          onClick={() =>
            onSave(dateLabel, numNights ? parseInt(numNights, 10) : undefined)
          }
        >
          Add Row
        </S.AddRowSave>
      </S.AddRowFormActions>
    </S.AddRowForm>
  )
}

// ── RowsTab ───────────────────────────────────────────────────────

export default function RowsTab() {
  const {
    itinerary,
    addRow,
    updateRow,
    deleteRow,
    reorderRows,
    areaPages,
    activityPages,
    properties,
    propertiesLoading,
    fetchProperties,
    fetchAreaAndActivityPages,
  } = useBuilderStore()

  const [addingNew, setAddingNew] = useState(false)

  // Combined area + activity options for the activities column @mentions
  const activityMentionOptions = [...areaPages, ...activityPages]
  // Property options for the accommodations column @mentions
  const accommodationMentionOptions = properties

  // Debounced auto-save for rich text columns
  const saveTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  function debouncedSave(
    rowId: string,
    field: 'activitiesRichText' | 'accommodationsRichText',
    json: Record<string, unknown>,
  ) {
    const key = `${rowId}:${field}`
    const existing = saveTimers.current.get(key)
    if (existing) clearTimeout(existing)
    saveTimers.current.set(
      key,
      setTimeout(() => {
        updateRow(rowId, { [field]: json })
        saveTimers.current.delete(key)
      }, 800),
    )
  }

  useEffect(() => {
    if (properties.length === 0 && !propertiesLoading) fetchProperties()
    if (areaPages.length === 0 && activityPages.length === 0) fetchAreaAndActivityPages()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const rows = itinerary?.rows ?? []

  async function handleAddRow(dateLabel: string, numNights: number | undefined) {
    if (!itinerary) return
    await addRow(itinerary.id, {
      dateLabel: dateLabel || undefined,
      numNights,
    })
    setAddingNew(false)
  }

  async function handleDeleteRow(id: string) {
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

  if (rows.length === 0 && !addingNew) {
    return (
      <S.Root>
        <S.EmptyState>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
          <div>No rows yet</div>
          <div style={{ fontSize: 12 }}>Add your first day to start building the itinerary</div>
        </S.EmptyState>
        <S.AddRowButton onClick={() => setAddingNew(true)}>+ Add Day / Row</S.AddRowButton>
      </S.Root>
    )
  }

  return (
    <S.Root>
      <S.Table>
        {/* Header */}
        <S.Header>
          <S.HeaderCell />
          <S.HeaderCell>Date</S.HeaderCell>
          <S.HeaderCell>Transfers, Flights & Daily Activities</S.HeaderCell>
          <S.HeaderCell>Accommodations & Rooming</S.HeaderCell>
          <S.HeaderCell />
        </S.Header>

        {/* Rows */}
        {rows.map((row, i) => (
          <S.Row key={row.id} $last={i === rows.length - 1}>
            {/* Drag handle */}
            <S.DragCell title="Drag to reorder">⠿</S.DragCell>

            {/* Date */}
            <S.DateCell>
              <DateCell
                row={row}
                onSave={(dateLabel, numNights) =>
                  updateRow(row.id, {
                    dateLabel: dateLabel || undefined,
                    numNights,
                  })
                }
              />
            </S.DateCell>

            {/* Activities rich text */}
            <S.ContentCell>
              <RichTextEditor
                content={row.activitiesRichText}
                onChange={(json) =>
                  debouncedSave(row.id, 'activitiesRichText', json)
                }
                mentionOptions={activityMentionOptions}
                placeholder="Describe the day's activities, transfers, and flights… use @ to tag a page"
              />
            </S.ContentCell>

            {/* Accommodations rich text */}
            <S.ContentCell>
              <RichTextEditor
                content={row.accommodationsRichText}
                onChange={(json) =>
                  debouncedSave(row.id, 'accommodationsRichText', json)
                }
                mentionOptions={accommodationMentionOptions}
                placeholder="Overnight at… use @ to tag a property"
              />
            </S.ContentCell>

            {/* Actions */}
            <S.ActionsCell>
              <RowActionMenu
                disableUp={i === 0}
                disableDown={i === rows.length - 1}
                onMoveUp={() => moveRow(i, -1)}
                onMoveDown={() => moveRow(i, 1)}
                onDelete={() => handleDeleteRow(row.id)}
              />
            </S.ActionsCell>
          </S.Row>
        ))}
      </S.Table>

      {/* Add row */}
      {addingNew ? (
        <AddRowForm onSave={handleAddRow} onCancel={() => setAddingNew(false)} />
      ) : (
        <S.AddRowButton onClick={() => setAddingNew(true)}>+ Add Day / Row</S.AddRowButton>
      )}
    </S.Root>
  )
}
