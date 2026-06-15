'use client'

import { useEffect, useState } from 'react'
import { useIntroductoryNoteStore, type IntroductoryNoteFull, type UpdateIntroductoryNoteInput } from '@/stores/introductoryNoteStore'
import * as S from '../page.styled'

interface Props {
  introductoryNote: IntroductoryNoteFull
}

export default function IntroNoteDetailsTab({ introductoryNote }: Props) {
  const { saving, updateIntroductoryNote } = useIntroductoryNoteStore()

  const [form, setForm] = useState({
    name: introductoryNote.name,
    tags: introductoryNote.tags,
  })
  const [tagInput, setTagInput] = useState('')
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    setForm({ name: introductoryNote.name, tags: introductoryNote.tags })
    setDirty(false)
  }, [introductoryNote.id])

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
    const input: UpdateIntroductoryNoteInput = {
      name: form.name || undefined,
      tags: form.tags,
    }
    await updateIntroductoryNote(introductoryNote.id, input)
    setDirty(false)
  }

  return (
    <div>
      <S.Card>
        <S.CardTitle>Basic Info</S.CardTitle>
        <S.Grid>
          <S.FullRow>
            <S.FieldGroup>
              <S.FieldLabel>Note Title</S.FieldLabel>
              <S.FieldInput
                value={form.name}
                onChange={(e) => setF('name', e.target.value)}
                placeholder="e.g. Welcome to Your Safari"
              />
            </S.FieldGroup>
          </S.FullRow>
        </S.Grid>
      </S.Card>

      <S.Card>
        <S.CardTitle>Tags</S.CardTitle>
        <S.TagsRow onClick={() => document.getElementById('intronote-tag-input')?.focus()}>
          {form.tags.map((tag) => (
            <S.TagBadge key={tag}>
              {tag}
              <S.TagRemove type="button" onClick={() => removeTag(tag)}>✕</S.TagRemove>
            </S.TagBadge>
          ))}
          <S.TagInput
            id="intronote-tag-input"
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
