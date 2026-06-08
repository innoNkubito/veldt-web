'use client'

import { useEffect, useRef, useState } from 'react'
import { useContentLibraryStore, type PropertyFull, type UpdatePropertyInput } from '@/stores/contentLibraryStore'
import { uploadFile } from '@/lib/upload'
import * as S from '../page.styled'

interface Props {
  property: PropertyFull
  getToken: () => Promise<string | null>
}

export default function DetailsTab({ property, getToken }: Props) {
  const { areas, saving, fetchAreas, updateProperty } = useContentLibraryStore()

  const [form, setForm] = useState({
    name: property.name,
    country: property.country ?? '',
    locationName: property.locationName ?? '',
    areaId: property.area?.id ?? '',
    areaName: property.area?.name ?? '',
    tags: property.tags,
    coverImageUrl: property.coverImageUrl ?? '',
  })
  const [tagInput, setTagInput] = useState('')
  const [areaQuery, setAreaQuery] = useState(property.area?.name ?? '')
  const [areaOpen, setAreaOpen] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchAreas()
  }, [])

  // Reset when navigating to a different property
  useEffect(() => {
    setForm({
      name: property.name,
      country: property.country ?? '',
      locationName: property.locationName ?? '',
      areaId: property.area?.id ?? '',
      areaName: property.area?.name ?? '',
      tags: property.tags,
      coverImageUrl: property.coverImageUrl ?? '',
    })
    setAreaQuery(property.area?.name ?? '')
    setDirty(false)
  }, [property.id])

  function setF<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    setDirty(true)
  }

  const filteredAreas = areas.filter((a) =>
    a.name.toLowerCase().includes(areaQuery.toLowerCase()),
  )

  function selectArea(id: string, name: string) {
    setF('areaId', id)
    setF('areaName', name)
    setAreaQuery(name)
    setAreaOpen(false)
  }

  function clearArea() {
    setF('areaId', '')
    setF('areaName', '')
    setAreaQuery('')
  }

  function addTag() {
    const t = tagInput.trim()
    if (!t || form.tags.includes(t)) { setTagInput(''); return }
    setF('tags', [...form.tags, t])
    setTagInput('')
  }

  function removeTag(tag: string) {
    setF('tags', form.tags.filter((t) => t !== tag))
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadFile(file, getToken)
      setF('coverImageUrl', url)
    } catch {
      // TODO: show error toast
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function handleSave() {
    const input: UpdatePropertyInput = {
      name: form.name || undefined,
      country: form.country || null,
      locationName: form.locationName || null,
      areaId: form.areaId || null,
      tags: form.tags,
      coverImageUrl: form.coverImageUrl || null,
    }
    await updateProperty(property.id, input)
    setDirty(false)
  }

  return (
    <div>
      <S.Card>
        <S.CardTitle>Basic Info</S.CardTitle>
        <S.Grid>
          <S.FullRow>
            <S.FieldGroup>
              <S.FieldLabel>Property Name</S.FieldLabel>
              <S.FieldInput
                value={form.name}
                onChange={(e) => setF('name', e.target.value)}
                placeholder="e.g. Singita Grumeti"
              />
            </S.FieldGroup>
          </S.FullRow>

          <S.FieldGroup>
            <S.FieldLabel>Country</S.FieldLabel>
            <S.FieldInput
              value={form.country}
              onChange={(e) => setF('country', e.target.value)}
              placeholder="e.g. Tanzania"
            />
          </S.FieldGroup>

          <S.FieldGroup>
            <S.FieldLabel>Location / Camp Name</S.FieldLabel>
            <S.FieldInput
              value={form.locationName}
              onChange={(e) => setF('locationName', e.target.value)}
              placeholder="e.g. Grumeti Game Reserve"
            />
          </S.FieldGroup>

          <S.FullRow>
            <S.AreaSearch>
              <S.FieldLabel>Area</S.FieldLabel>
              <div style={{ position: 'relative' }}>
                <S.FieldInput
                  value={areaQuery}
                  onChange={(e) => {
                    setAreaQuery(e.target.value)
                    setAreaOpen(true)
                    if (!e.target.value) clearArea()
                  }}
                  onFocus={() => setAreaOpen(true)}
                  placeholder="Search areas…"
                />
                {form.areaId && (
                  <S.AreaClear
                    type="button"
                    onClick={clearArea}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    ✕
                  </S.AreaClear>
                )}
                {areaOpen && filteredAreas.length > 0 && (
                  <S.AreaDropdown>
                    {filteredAreas.map((a) => (
                      <S.AreaOption
                        key={a.id}
                        onMouseDown={(e) => { e.preventDefault(); selectArea(a.id, a.name) }}
                      >
                        {a.name}
                      </S.AreaOption>
                    ))}
                  </S.AreaDropdown>
                )}
              </div>
            </S.AreaSearch>
          </S.FullRow>
        </S.Grid>
      </S.Card>

      <S.Card>
        <S.CardTitle>Tags</S.CardTitle>
        <S.TagsRow onClick={() => document.getElementById('tag-input')?.focus()}>
          {form.tags.map((tag) => (
            <S.TagBadge key={tag}>
              {tag}
              <S.TagRemove type="button" onClick={() => removeTag(tag)}>✕</S.TagRemove>
            </S.TagBadge>
          ))}
          <S.TagInput
            id="tag-input"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag() }
              if (e.key === 'Backspace' && !tagInput && form.tags.length > 0) {
                setF('tags', form.tags.slice(0, -1))
              }
            }}
            placeholder={form.tags.length === 0 ? 'Add tags — press Enter' : ''}
          />
        </S.TagsRow>
      </S.Card>

      <S.Card>
        <S.CardTitle>Cover Image</S.CardTitle>
        <S.CoverPreview $url={form.coverImageUrl}>
          {!form.coverImageUrl && (
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>No cover image</span>
          )}
        </S.CoverPreview>
        <S.UploadButton htmlFor="cover-upload">
          {uploading ? 'Uploading…' : 'Upload image'}
        </S.UploadButton>
        <input
          id="cover-upload"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          ref={fileRef}
          onChange={handleImageUpload}
        />
        <S.UploadNote>JPG, PNG, or WebP · max 10 MB</S.UploadNote>
        {form.coverImageUrl && (
          <S.UploadNote style={{ marginTop: 6 }}>
            <button
              style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: 12, cursor: 'pointer', padding: 0 }}
              onClick={() => setF('coverImageUrl', '')}
            >
              Remove image
            </button>
          </S.UploadNote>
        )}
      </S.Card>

      {dirty && (
        <S.SaveRow>
          <S.SaveButton onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Details'}
          </S.SaveButton>
        </S.SaveRow>
      )}
    </div>
  )
}
