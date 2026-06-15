'use client'

import { useEffect, useState } from 'react'
import { useActivityStore, type ActivityFull, type UpdateActivityInput } from '@/stores/activityStore'
import { useContentLibraryStore } from '@/stores/contentLibraryStore'
import * as S from '../page.styled'

interface Props {
  activity: ActivityFull
}

export default function ActivityDetailsTab({ activity }: Props) {
  const { saving, updateActivity } = useActivityStore()
  const { areas, fetchAreas } = useContentLibraryStore()

  const [form, setForm] = useState({
    name: activity.name,
    country: activity.country ?? '',
    locationName: activity.locationName ?? '',
    areaId: activity.area?.id ?? '',
    tags: activity.tags,
  })
  const [tagInput, setTagInput] = useState('')
  const [areaQuery, setAreaQuery] = useState(activity.area?.name ?? '')
  const [areaOpen, setAreaOpen] = useState(false)
  const [dirty, setDirty] = useState(false)

  useEffect(() => { fetchAreas() }, [])

  useEffect(() => {
    setForm({
      name: activity.name,
      country: activity.country ?? '',
      locationName: activity.locationName ?? '',
      areaId: activity.area?.id ?? '',
      tags: activity.tags,
    })
    setAreaQuery(activity.area?.name ?? '')
    setDirty(false)
  }, [activity.id])

  function setF<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    setDirty(true)
  }

  const filteredAreas = areas.filter((a) =>
    a.name.toLowerCase().includes(areaQuery.toLowerCase()),
  )

  function selectArea(id: string, name: string) {
    setF('areaId', id)
    setAreaQuery(name)
    setAreaOpen(false)
    setDirty(true)
  }

  function clearArea() {
    setF('areaId', '')
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

  async function handleSave() {
    const input: UpdateActivityInput = {
      name: form.name || undefined,
      country: form.country || null,
      locationName: form.locationName || null,
      areaId: form.areaId || null,
      tags: form.tags,
    }
    await updateActivity(activity.id, input)
    setDirty(false)
  }

  return (
    <div>
      <S.Card>
        <S.CardTitle>Basic Info</S.CardTitle>
        <S.Grid>
          <S.FullRow>
            <S.FieldGroup>
              <S.FieldLabel>Activity Name</S.FieldLabel>
              <S.FieldInput
                value={form.name}
                onChange={(e) => setF('name', e.target.value)}
                placeholder="e.g. Hot Air Balloon Safari"
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
                  onBlur={() => setTimeout(() => setAreaOpen(false), 150)}
                  placeholder="Search areas…"
                />
                {form.areaId && (
                  <S.AreaClear type="button" onClick={clearArea} onMouseDown={(e) => e.preventDefault()}>✕</S.AreaClear>
                )}
                {areaOpen && filteredAreas.length > 0 && (
                  <S.AreaDropdown>
                    {filteredAreas.map((a) => (
                      <S.AreaOption key={a.id} onMouseDown={(e) => { e.preventDefault(); selectArea(a.id, a.name) }}>
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
        <S.TagsRow onClick={() => document.getElementById('activity-tag-input')?.focus()}>
          {form.tags.map((tag) => (
            <S.TagBadge key={tag}>
              {tag}
              <S.TagRemove type="button" onClick={() => removeTag(tag)}>✕</S.TagRemove>
            </S.TagBadge>
          ))}
          <S.TagInput
            id="activity-tag-input"
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
