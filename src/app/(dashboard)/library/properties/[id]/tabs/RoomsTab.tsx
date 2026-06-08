'use client'

import { useRef, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import {
  useContentLibraryStore,
  type PropertyFull,
  type PropertyRoom,
  type RoomInput,
  type PropertyRoomVideo,
} from '@/stores/contentLibraryStore'
import { uploadFile } from '@/lib/upload'
import * as S from '../page.styled'

interface Props {
  property: PropertyFull
}

interface RoomFormState {
  roomType: string
  description: string
  photos: string[]
  videos: { name: string; url: string }[]
}

const EMPTY_FORM: RoomFormState = {
  roomType: '',
  description: '',
  photos: [],
  videos: [{ name: '', url: '' }],
}

function roomToForm(room: PropertyRoom): RoomFormState {
  return {
    roomType: room.roomType,
    description: room.description ?? '',
    photos: room.photos,
    videos: room.videos.length > 0 ? room.videos : [{ name: '', url: '' }],
  }
}

// ── Room modal ──────────────────────────────────────────────────

interface RoomModalProps {
  title: string
  form: RoomFormState
  saving: boolean
  onFormChange: (form: RoomFormState) => void
  onSave: () => void
  onClose: () => void
}

function RoomModal({ title, form, saving, onFormChange, onSave, onClose }: RoomModalProps) {
  const { getToken } = useAuth()
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  function setF<K extends keyof RoomFormState>(key: K, value: RoomFormState[K]) {
    onFormChange({ ...form, [key]: value })
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    try {
      const urls = await Promise.all(files.map((f) => uploadFile(f, getToken)))
      setF('photos', [...form.photos, ...urls])
    } catch {
      // TODO: toast
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  function removePhoto(idx: number) {
    setF('photos', form.photos.filter((_, i) => i !== idx))
  }

  function updateVideo(idx: number, patch: Partial<{ name: string; url: string }>) {
    setF('videos', form.videos.map((v, i) => (i === idx ? { ...v, ...patch } : v)))
  }

  function addVideo() {
    setF('videos', [...form.videos, { name: '', url: '' }])
  }

  function removeVideo(idx: number) {
    const updated = form.videos.filter((_, i) => i !== idx)
    setF('videos', updated.length ? updated : [{ name: '', url: '' }])
  }

  return (
    <S.ModalOverlay onClick={onClose}>
      <S.RoomModal onClick={(e) => e.stopPropagation()}>
        <S.ModalHeader>
          <S.ModalTitle>{title}</S.ModalTitle>
          <S.ModalCloseBtn onClick={onClose}>✕</S.ModalCloseBtn>
        </S.ModalHeader>

        <S.ModalBody>
          {/* Room type */}
          <S.FieldGroup>
            <S.FieldLabel>
              Room Type <span style={{ color: '#dc2626' }}>*</span>{' '}
              <span style={{ fontWeight: 400, color: 'var(--muted)' }}>(e.g. Standard Tent)</span>
            </S.FieldLabel>
            <S.FieldInput
              autoFocus
              value={form.roomType}
              onChange={(e) => setF('roomType', e.target.value)}
              placeholder="Room Type"
            />
          </S.FieldGroup>

          {/* Description */}
          <S.FieldTextarea
            value={form.description}
            onChange={(e) => setF('description', e.target.value)}
            placeholder="Room Description…"
            rows={4}
          />

          {/* Photos */}
          <div>
            <S.FieldLabel>Photos</S.FieldLabel>
            {form.photos.length > 0 && (
              <S.PhotoGrid>
                {form.photos.map((url, i) => (
                  <S.PhotoThumb key={i} $url={url}>
                    <S.PhotoRemove type="button" onClick={() => removePhoto(i)}>✕</S.PhotoRemove>
                  </S.PhotoThumb>
                ))}
              </S.PhotoGrid>
            )}
            <S.PhotoUploadZone htmlFor="room-photo-upload">
              <S.PhotoUploadBtn>{uploading ? 'Uploading…' : 'Add Photos'}</S.PhotoUploadBtn>
              <S.PhotoUploadNote>Click here to upload photos.</S.PhotoUploadNote>
              <S.PhotoUploadNote>File formats include JPG, PNG, WEBP. Max 5 MB each.</S.PhotoUploadNote>
            </S.PhotoUploadZone>
            <input
              id="room-photo-upload"
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              ref={fileRef}
              onChange={handlePhotoUpload}
            />
          </div>

          {/* Videos */}
          <div>
            <S.FieldLabel>
              Videos{' '}
              <span style={{ fontWeight: 400, color: 'var(--muted)' }}>
                (Enter YouTube, Vimeo or Wistia Link)
              </span>
            </S.FieldLabel>
            {form.videos.map((video, i) => (
              <S.VideoRow key={i} style={{ marginBottom: 8 }}>
                <S.FieldInput
                  value={video.name}
                  onChange={(e) => updateVideo(i, { name: e.target.value })}
                  placeholder="Video Name"
                />
                <S.FieldInput
                  value={video.url}
                  onChange={(e) => updateVideo(i, { url: e.target.value })}
                  placeholder="Enter YouTube, Vimeo or Wistia Link"
                />
                <S.DangerIconBtn
                  type="button"
                  onClick={() => removeVideo(i)}
                  title="Remove video"
                  style={{ fontSize: 18 }}
                >
                  ✕
                </S.DangerIconBtn>
              </S.VideoRow>
            ))}
            <S.AddVideoBtn type="button" onClick={addVideo}>⊕ Add another video</S.AddVideoBtn>
          </div>
        </S.ModalBody>

        <S.ModalFooter>
          <S.ModalCancelBtn onClick={onClose}>Cancel</S.ModalCancelBtn>
          <S.ModalSaveBtn onClick={onSave} disabled={saving || !form.roomType.trim()}>
            {saving ? 'Saving…' : 'Save'}
          </S.ModalSaveBtn>
        </S.ModalFooter>
      </S.RoomModal>
    </S.ModalOverlay>
  )
}

// ── Main tab ────────────────────────────────────────────────────

export default function RoomsTab({ property }: Props) {
  const { saving, addRoom, updateRoom, deleteRoom } = useContentLibraryStore()

  const [showAdd, setShowAdd] = useState(false)
  const [addForm, setAddForm] = useState<RoomFormState>(EMPTY_FORM)

  const [editId, setEditId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<RoomFormState>(EMPTY_FORM)

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  function openEdit(room: PropertyRoom) {
    setEditId(room.id)
    setEditForm(roomToForm(room))
  }

  function formToInput(form: RoomFormState, position?: number): RoomInput {
    const cleanVideos = form.videos.filter((v) => v.url.trim())
    return {
      roomType: form.roomType.trim(),
      description: form.description.trim() || undefined,
      photos: form.photos,
      videos: cleanVideos.length ? cleanVideos : undefined,
      position,
    }
  }

  async function handleAdd() {
    await addRoom(property.id, formToInput(addForm, property.rooms.length + 1))
    setShowAdd(false)
    setAddForm(EMPTY_FORM)
  }

  async function handleEdit() {
    if (!editId) return
    await updateRoom(editId, formToInput(editForm))
    setEditId(null)
    setEditForm(EMPTY_FORM)
  }

  async function handleDelete(id: string) {
    await deleteRoom(id)
    setConfirmDeleteId(null)
  }

  const sorted = [...property.rooms].sort((a, b) => a.position - b.position)

  return (
    <>
      <S.InfoBanner>
        <S.InfoIcon>i</S.InfoIcon>
        You can skip this tab altogether or only fill in the room type that is relevant to your booking.
      </S.InfoBanner>

      <S.RoomsIntro>
        <S.RoomsIntroTitle>Rooms</S.RoomsIntroTitle>
        <S.RoomsIntroDesc>
          Add rooms for this property by rate category. These should be the room types that can
          be confirmed on booking.
        </S.RoomsIntroDesc>

        {sorted.length > 0 && (
          <S.RoomsList>
            {sorted.map((room) => (
              <S.RoomCard key={room.id}>
                <S.RoomCardLeft>
                  <S.RoomType>{room.roomType}</S.RoomType>
                  <S.RoomMeta>
                    {room.photos.length > 0 && (
                      <span>{room.photos.length} photo{room.photos.length !== 1 ? 's' : ''}</span>
                    )}
                    {room.videos.length > 0 && (
                      <span>{room.videos.length} video{room.videos.length !== 1 ? 's' : ''}</span>
                    )}
                    {room.description && (
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>
                        {room.description}
                      </span>
                    )}
                  </S.RoomMeta>
                </S.RoomCardLeft>
                <S.RoomActions>
                  {confirmDeleteId === room.id ? (
                    <>
                      <span style={{ fontSize: 12, color: '#dc2626' }}>Delete?</span>
                      <S.RoomDeleteBtn onClick={() => handleDelete(room.id)}>Yes</S.RoomDeleteBtn>
                      <S.RoomActionBtn onClick={() => setConfirmDeleteId(null)}>No</S.RoomActionBtn>
                    </>
                  ) : (
                    <>
                      <S.RoomActionBtn onClick={() => openEdit(room)}>Edit</S.RoomActionBtn>
                      <S.RoomDeleteBtn onClick={() => setConfirmDeleteId(room.id)}>Delete</S.RoomDeleteBtn>
                    </>
                  )}
                </S.RoomActions>
              </S.RoomCard>
            ))}
          </S.RoomsList>
        )}

        <S.AddNewRoomBtn onClick={() => { setAddForm(EMPTY_FORM); setShowAdd(true) }}>
          Add New Room
        </S.AddNewRoomBtn>
      </S.RoomsIntro>

      {showAdd && (
        <RoomModal
          title="Add Room"
          form={addForm}
          saving={saving}
          onFormChange={setAddForm}
          onSave={handleAdd}
          onClose={() => { setShowAdd(false); setAddForm(EMPTY_FORM) }}
        />
      )}

      {editId && (
        <RoomModal
          title="Edit Room"
          form={editForm}
          saving={saving}
          onFormChange={setEditForm}
          onSave={handleEdit}
          onClose={() => { setEditId(null); setEditForm(EMPTY_FORM) }}
        />
      )}
    </>
  )
}
