'use client'

import { useState, useRef } from 'react'
import { PropertyOption } from '@/stores/builderStore'
import { SmallButton } from '@/components/itineraries/shared/FieldPrimitives'
import * as S from './AccommodationPicker.styled'

interface Props {
  rowId: string
  properties: PropertyOption[]
  onAdd: (rowId: string, input: { contentPageId: string; roomId?: string }) => Promise<void>
  onClose: () => void
}

export default function AccommodationPicker({ rowId, properties, onAdd, onClose }: Props) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<PropertyOption | null>(null)
  const [roomId, setRoomId] = useState('')
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = query.trim()
    ? properties.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 6)
    : properties.slice(0, 6)

  function pickProperty(p: PropertyOption) {
    setSelected(p)
    setQuery(p.name)
    setRoomId('')
    setOpen(false)
  }

  async function handleAdd() {
    if (!selected) return
    setSaving(true)
    await onAdd(rowId, { contentPageId: selected.id, roomId: roomId || undefined })
    setSaving(false)
    onClose()
  }

  return (
    <S.Root>
      <S.Row>
        <div style={{ flex: 1, position: 'relative' }}>
          <S.SearchInput
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelected(null)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            placeholder="Search properties…"
            autoFocus
          />
          {open && filtered.length > 0 && (
            <S.Dropdown>
              {filtered.map((p) => (
                <S.DropdownItem
                  key={p.id}
                  $active={selected?.id === p.id}
                  onMouseDown={(e) => { e.preventDefault(); pickProperty(p) }}
                >
                  {p.name}
                </S.DropdownItem>
              ))}
            </S.Dropdown>
          )}
        </div>
        <SmallButton onClick={onClose}>Cancel</SmallButton>
        <SmallButton $primary onClick={handleAdd} disabled={!selected || saving}>
          {saving ? 'Adding…' : 'Add'}
        </SmallButton>
      </S.Row>

      {selected && selected.rooms.length > 0 && (
        <S.RoomRow>
          <S.RoomSelect value={roomId} onChange={(e) => setRoomId(e.target.value)}>
            <option value="">No specific room type</option>
            {selected.rooms.map((r) => (
              <option key={r.id} value={r.id}>{r.roomType}</option>
            ))}
          </S.RoomSelect>
        </S.RoomRow>
      )}
    </S.Root>
  )
}
