'use client'

import { useState } from 'react'
import { useContentLibraryStore, type PropertyFull, type PropertyRoom, type RoomInput } from '@/stores/contentLibraryStore'
import * as S from '../page.styled'

interface Props {
  property: PropertyFull
}

interface RoomFormState {
  roomType: string
  description: string
}

const EMPTY_FORM: RoomFormState = { roomType: '', description: '' }

export default function RoomsTab({ property }: Props) {
  const { saving, addRoom, updateRoom, deleteRoom } = useContentLibraryStore()

  const [addForm, setAddForm] = useState<RoomFormState>(EMPTY_FORM)
  const [editId, setEditId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<RoomFormState>(EMPTY_FORM)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  function startEdit(room: PropertyRoom) {
    setEditId(room.id)
    setEditForm({ roomType: room.roomType, description: room.description ?? '' })
  }

  function cancelEdit() {
    setEditId(null)
    setEditForm(EMPTY_FORM)
  }

  async function handleAdd() {
    if (!addForm.roomType.trim()) return
    const input: RoomInput = {
      roomType: addForm.roomType.trim(),
      description: addForm.description.trim() || undefined,
      position: property.rooms.length + 1,
    }
    await addRoom(property.id, input)
    setAddForm(EMPTY_FORM)
  }

  async function handleUpdate() {
    if (!editId || !editForm.roomType.trim()) return
    const input: RoomInput = {
      roomType: editForm.roomType.trim(),
      description: editForm.description.trim() || undefined,
    }
    await updateRoom(editId, input)
    cancelEdit()
  }

  async function handleDelete(id: string) {
    await deleteRoom(id)
    setConfirmDeleteId(null)
  }

  const sorted = [...property.rooms].sort((a, b) => a.position - b.position)

  return (
    <div>
      <S.RoomsList>
        {sorted.map((room) =>
          editId === room.id ? (
            <S.RoomCard key={room.id}>
              <S.AddRoomTitle>Edit room</S.AddRoomTitle>
              <S.RoomGrid>
                <S.FieldGroup>
                  <S.FieldLabel>Room Type</S.FieldLabel>
                  <S.FieldInput
                    autoFocus
                    value={editForm.roomType}
                    onChange={(e) => setEditForm((f) => ({ ...f, roomType: e.target.value }))}
                    placeholder="e.g. Luxury Tent, Villa Suite"
                  />
                </S.FieldGroup>
                <S.FieldGroup>
                  <S.FieldLabel>Description</S.FieldLabel>
                  <S.FieldInput
                    value={editForm.description}
                    onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Short description (optional)"
                  />
                </S.FieldGroup>
              </S.RoomGrid>
              <S.RoomActions style={{ marginTop: 10 }}>
                <S.RoomActionBtn onClick={cancelEdit}>Cancel</S.RoomActionBtn>
                <S.SaveButton onClick={handleUpdate} disabled={saving || !editForm.roomType.trim()}>
                  {saving ? 'Saving…' : 'Save'}
                </S.SaveButton>
              </S.RoomActions>
            </S.RoomCard>
          ) : (
            <S.RoomCard key={room.id}>
              <S.RoomHeader>
                <S.RoomType>{room.roomType}</S.RoomType>
                <S.RoomActions>
                  {confirmDeleteId === room.id ? (
                    <>
                      <span style={{ fontSize: 12, color: '#dc2626' }}>Delete?</span>
                      <S.RoomDeleteBtn onClick={() => handleDelete(room.id)}>Yes</S.RoomDeleteBtn>
                      <S.RoomActionBtn onClick={() => setConfirmDeleteId(null)}>No</S.RoomActionBtn>
                    </>
                  ) : (
                    <>
                      <S.RoomActionBtn onClick={() => startEdit(room)}>Edit</S.RoomActionBtn>
                      <S.RoomDeleteBtn onClick={() => setConfirmDeleteId(room.id)}>Delete</S.RoomDeleteBtn>
                    </>
                  )}
                </S.RoomActions>
              </S.RoomHeader>
              {room.description && <S.RoomDesc>{room.description}</S.RoomDesc>}
            </S.RoomCard>
          ),
        )}

        {/* Add new room form */}
        <S.AddRoomCard>
          <S.AddRoomTitle>Add a room type</S.AddRoomTitle>
          <S.RoomGrid>
            <S.FieldGroup>
              <S.FieldLabel>Room Type *</S.FieldLabel>
              <S.FieldInput
                value={addForm.roomType}
                onChange={(e) => setAddForm((f) => ({ ...f, roomType: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                placeholder="e.g. Luxury Tent, Bush Suite"
              />
            </S.FieldGroup>
            <S.FieldGroup>
              <S.FieldLabel>Description</S.FieldLabel>
              <S.FieldInput
                value={addForm.description}
                onChange={(e) => setAddForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Optional short description"
              />
            </S.FieldGroup>
          </S.RoomGrid>
          <div style={{ marginTop: 10 }}>
            <S.SaveButton onClick={handleAdd} disabled={saving || !addForm.roomType.trim()}>
              {saving ? 'Adding…' : '+ Add Room'}
            </S.SaveButton>
          </div>
        </S.AddRoomCard>
      </S.RoomsList>
    </div>
  )
}
