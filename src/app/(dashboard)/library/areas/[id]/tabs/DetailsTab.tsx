'use client'

import { useEffect, useState } from 'react'
import { useAreaStore, type AreaFull, type UpdateAreaInput } from '@/stores/areaStore'
import * as S from '../page.styled'

interface Props {
  area: AreaFull
}

export default function AreaDetailsTab({ area }: Props) {
  const { saving, updateArea } = useAreaStore()

  const [form, setForm] = useState({
    name: area.name,
    country: area.country ?? '',
    locationName: area.locationName ?? '',
    tags: area.tags,
  })
  const [tagInput, setTagInput] = useState('')
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    setForm({
      name: area.name,
      country: area.country ?? '',
      locationName: area.locationName ?? '',
      tags: area.tags,
    })
    setDirty(false)
  }, [area.id])

  function setF<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    setDirty(true)
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

  async function handleSave() {
    const input: UpdateAreaInput = {
      name: form.name || undefined,
      country: form.country || null,
      locationName: form.locationName || null,
      tags: form.tags,
    }
    await updateArea(area.id, input)
    setDirty(false)
  }

  return (
    <div>
      <S.Card>
        <S.CardTitle>Basic Info</S.CardTitle>
        <S.Grid>
          <S.FullRow>
            <S.FieldGroup>
              <S.FieldLabel>Area Name</S.FieldLabel>
              <S.FieldInput
                value={form.name}
                onChange={(e) => setF('name', e.target.value)}
                placeholder="e.g. Masai Mara"
              />
            </S.FieldGroup>
          </S.FullRow>

          <S.FieldGroup>
            <S.FieldLabel>Country</S.FieldLabel>
            <S.FieldInput
              value={form.country}
              onChange={(e) => setF('country', e.target.value)}
              placeholder="e.g. Kenya"
            />
          </S.FieldGroup>

          <S.FieldGroup>
            <S.FieldLabel>Location Name</S.FieldLabel>
            <S.FieldInput
              value={form.locationName}
              onChange={(e) => setF('locationName', e.target.value)}
              placeholder="e.g. Masai Mara National Reserve"
            />
          </S.FieldGroup>
        </S.Grid>
      </S.Card>

      <S.Card>
        <S.CardTitle>Tags</S.CardTitle>
        <S.TagsRow onClick={() => document.getElementById('area-tag-input')?.focus()}>
          {form.tags.map((tag) => (
            <S.TagBadge key={tag}>
              {tag}
              <S.TagRemove type="button" onClick={() => removeTag(tag)}>✕</S.TagRemove>
            </S.TagBadge>
          ))}
          <S.TagInput
            id="area-tag-input"
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
