'use client'

import { useEffect, useRef, useState } from 'react'
import { useBuilderStore, type ItineraryRow, type PropertyOption } from '@/stores/builderStore'
import { confirmDialog } from '@/stores/confirmStore'
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

// ── Activity / area tagger ────────────────────────────────────────

function ActivityTagger({ row }: { row: ItineraryRow }) {
  const { areaPages, activityPages, addRowActivity, removeRowActivity } = useBuilderStore()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const wrapRef = useRef<HTMLDivElement>(null)

  const allOptions = [...areaPages, ...activityPages]
  const sorted = [...row.activities].sort((a, b) => a.position - b.position)
  const filtered = allOptions.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  function openPicker() {
    setOpen(true)
    setSearch('')
  }

  function select(contentPageId: string) {
    addRowActivity(row.id, contentPageId)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    function handle(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  return (
    <S.TaggerWrap ref={wrapRef}>
      {sorted.length > 0 && (
        <S.TaggerChips>
          {sorted.map((a) => (
            <S.TaggerChip key={a.id}>
              <span>{a.contentPage.name}</span>
              <S.TaggerChipRemove
                onClick={() => removeRowActivity(a.id, row.id)}
                title="Remove"
              >
                ×
              </S.TaggerChipRemove>
            </S.TaggerChip>
          ))}
        </S.TaggerChips>
      )}

      <S.TaggerAddBtn onClick={openPicker}>+ Tag activity / area</S.TaggerAddBtn>

      {open && (
        <S.TaggerDropdown>
          <S.TaggerSearch
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search activities & areas…"
          />
          <S.TaggerList>
            {filtered.length === 0 ? (
              <S.TaggerEmpty>No matches found</S.TaggerEmpty>
            ) : (
              filtered.map((p) => (
                <S.TaggerListItem key={p.id} onClick={() => select(p.id)}>
                  {p.name}
                </S.TaggerListItem>
              ))
            )}
          </S.TaggerList>
        </S.TaggerDropdown>
      )}
    </S.TaggerWrap>
  )
}

// ── Property tagger (accommodations) ─────────────────────────────

function AccommodationTagger({ row }: { row: ItineraryRow }) {
  const { properties, addAccommodation, removeAccommodation } = useBuilderStore()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [step, setStep] = useState<'pick-property' | 'pick-room'>('pick-property')
  const [pending, setPending] = useState<PropertyOption | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  const sorted = [...row.accommodations].sort((a, b) => a.position - b.position)
  const filtered = properties.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  function openPicker() {
    setOpen(true)
    setStep('pick-property')
    setSearch('')
    setPending(null)
  }

  function selectProperty(prop: PropertyOption) {
    if (prop.rooms.length > 0) {
      setPending(prop)
      setStep('pick-room')
    } else {
      addAccommodation(row.id, { contentPageId: prop.id })
      setOpen(false)
    }
  }

  function selectRoom(roomId: string | null) {
    if (!pending) return
    addAccommodation(row.id, {
      contentPageId: pending.id,
      roomId: roomId ?? undefined,
    })
    setOpen(false)
  }

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handle(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  return (
    <S.TaggerWrap ref={wrapRef}>
      {/* Tagged properties */}
      {sorted.length > 0 && (
        <S.TaggerChips>
          {sorted.map((a) => (
            <S.TaggerChip key={a.id}>
              <span>{a.contentPage.name}{a.room ? ` · ${a.room.roomType}` : ''}</span>
              <S.TaggerChipRemove
                onClick={() => removeAccommodation(a.id, row.id)}
                title="Remove"
              >
                ×
              </S.TaggerChipRemove>
            </S.TaggerChip>
          ))}
        </S.TaggerChips>
      )}

      <S.TaggerAddBtn onClick={openPicker}>+ Tag property</S.TaggerAddBtn>

      {open && (
        <S.TaggerDropdown>
          {step === 'pick-property' && (
            <>
              <S.TaggerSearch
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search properties…"
              />
              <S.TaggerList>
                {filtered.length === 0 ? (
                  <S.TaggerEmpty>No properties found</S.TaggerEmpty>
                ) : (
                  filtered.map((p) => (
                    <S.TaggerListItem key={p.id} onClick={() => selectProperty(p)}>
                      <span>{p.name}</span>
                      {p.rooms.length > 0 && (
                        <S.TaggerMeta>
                          {p.rooms.length} room{p.rooms.length !== 1 ? 's' : ''}
                        </S.TaggerMeta>
                      )}
                    </S.TaggerListItem>
                  ))
                )}
              </S.TaggerList>
            </>
          )}

          {step === 'pick-room' && pending && (
            <>
              <S.TaggerBackRow>
                <S.TaggerBack onClick={() => setStep('pick-property')}>← Back</S.TaggerBack>
                <S.TaggerBackLabel>{pending.name}</S.TaggerBackLabel>
              </S.TaggerBackRow>
              <S.TaggerList>
                <S.TaggerListItem onClick={() => selectRoom(null)}>
                  <span>No specific room</span>
                </S.TaggerListItem>
                {pending.rooms.map((r) => (
                  <S.TaggerListItem key={r.id} onClick={() => selectRoom(r.id)}>
                    {r.roomType}
                  </S.TaggerListItem>
                ))}
              </S.TaggerList>
            </>
          )}
        </S.TaggerDropdown>
      )}
    </S.TaggerWrap>
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
    // Always refresh properties so newly created ones appear immediately
    fetchProperties()
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
    const ok = await confirmDialog({
      title: 'Delete this day?',
      message: 'The row and its content will be removed from the itinerary.',
      confirmLabel: 'Delete',
      danger: true,
    })
    if (!ok) return
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

            {/* Activities rich text + activity/area tagger */}
            <S.ContentCell>
              <RichTextEditor
                content={row.activitiesRichText}
                onChange={(json) =>
                  debouncedSave(row.id, 'activitiesRichText', json)
                }
                mentionOptions={activityMentionOptions}
                placeholder="Describe the day's activities, transfers, and flights… use @ to mention or tag below"
              />
              <ActivityTagger row={row} />
            </S.ContentCell>

            {/* Accommodations rich text + property tagger */}
            <S.ContentCell>
              <RichTextEditor
                content={row.accommodationsRichText}
                onChange={(json) =>
                  debouncedSave(row.id, 'accommodationsRichText', json)
                }
                mentionOptions={accommodationMentionOptions}
                placeholder="Overnight at… use @ to mention or tag a property below"
              />
              <AccommodationTagger row={row} />
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
