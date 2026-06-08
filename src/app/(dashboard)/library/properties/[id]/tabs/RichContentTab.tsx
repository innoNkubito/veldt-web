'use client'

import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useContentLibraryStore, type PropertyFull } from '@/stores/contentLibraryStore'
import { uploadFile } from '@/lib/upload'
import {
  type PropertyPageContent,
  type PropertySection,
  type TextImageSection,
  type FastFactsSection,
  type SectionType,
  SECTION_TYPES,
  emptySection,
} from './pageContent.types'
import * as S from '../page.styled'

interface Props {
  property: PropertyFull
  onSaved?: () => void
}

// ── helpers ────────────────────────────────────────────────────

function sectionLabel(type: string) {
  return SECTION_TYPES.find((s) => s.value === type)?.label ?? type
}

function parseContent(raw: unknown): PropertyPageContent {
  if (raw && typeof raw === 'object' && 'sections' in raw) {
    return raw as PropertyPageContent
  }
  return { sections: [] }
}

// ── sub-editors ────────────────────────────────────────────────

interface TextImageProps {
  section: TextImageSection
  onChange: (updated: TextImageSection) => void
  getToken: () => Promise<string | null>
}

function TextImageEditor({ section, onChange, getToken }: TextImageProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadFile(file, getToken)
      onChange({ ...section, images: [...section.images, url] })
    } catch {
      // TODO: toast
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  function removeImage(idx: number) {
    onChange({ ...section, images: section.images.filter((_, i) => i !== idx) })
  }

  return (
    <>
      <S.FieldGroup>
        <S.FieldLabel>Text 1</S.FieldLabel>
        <S.FieldTextarea
          value={section.text1}
          onChange={(e) => onChange({ ...section, text1: e.target.value })}
          placeholder="Opening paragraph…"
        />
      </S.FieldGroup>

      <S.FieldGroup>
        <S.FieldLabel>Images</S.FieldLabel>
        <S.ImageRow>
          {section.images.map((url, i) => (
            <S.ImageThumb key={i} $url={url}>
              <S.ImageRemove type="button" onClick={() => removeImage(i)}>✕</S.ImageRemove>
            </S.ImageThumb>
          ))}
          <S.AddImageBtn htmlFor={`img-upload-${section.type}`}>
            {uploading ? '…' : '+'}
          </S.AddImageBtn>
          <input
            id={`img-upload-${section.type}`}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            ref={fileRef}
            onChange={handleUpload}
          />
        </S.ImageRow>
      </S.FieldGroup>

      <S.FieldGroup>
        <S.FieldLabel>Text 2</S.FieldLabel>
        <S.FieldTextarea
          value={section.text2}
          onChange={(e) => onChange({ ...section, text2: e.target.value })}
          placeholder="Continuation paragraph…"
        />
      </S.FieldGroup>
    </>
  )
}

interface FastFactsProps {
  section: FastFactsSection
  onChange: (updated: FastFactsSection) => void
}

function FastFactsEditor({ section, onChange }: FastFactsProps) {
  function updateGroup(gIdx: number, patch: Partial<(typeof section.groups)[0]>) {
    const groups = section.groups.map((g, i) => (i === gIdx ? { ...g, ...patch } : g))
    onChange({ ...section, groups })
  }

  function addGroup() {
    onChange({ ...section, groups: [...section.groups, { label: '', items: [''] }] })
  }

  function removeGroup(gIdx: number) {
    onChange({ ...section, groups: section.groups.filter((_, i) => i !== gIdx) })
  }

  function updateItem(gIdx: number, iIdx: number, value: string) {
    const items = section.groups[gIdx].items.map((it, i) => (i === iIdx ? value : it))
    updateGroup(gIdx, { items })
  }

  function addItem(gIdx: number) {
    updateGroup(gIdx, { items: [...section.groups[gIdx].items, ''] })
  }

  function removeItem(gIdx: number, iIdx: number) {
    const items = section.groups[gIdx].items.filter((_, i) => i !== iIdx)
    updateGroup(gIdx, { items: items.length ? items : [''] })
  }

  return (
    <>
      {section.groups.map((group, gIdx) => (
        <S.GroupCard key={gIdx}>
          <S.GroupHeader>
            <S.SmallInput
              value={group.label}
              onChange={(e) => updateGroup(gIdx, { label: e.target.value })}
              placeholder="Group label (e.g. Highlights)"
            />
            {section.groups.length > 1 && (
              <S.DangerIconBtn type="button" onClick={() => removeGroup(gIdx)} title="Remove group">
                ✕
              </S.DangerIconBtn>
            )}
          </S.GroupHeader>

          {group.items.map((item, iIdx) => (
            <S.ItemRow key={iIdx}>
              <S.SmallInput
                value={item}
                onChange={(e) => updateItem(gIdx, iIdx, e.target.value)}
                placeholder={`Item ${iIdx + 1}`}
              />
              <S.DangerIconBtn type="button" onClick={() => removeItem(gIdx, iIdx)} title="Remove item">
                ✕
              </S.DangerIconBtn>
            </S.ItemRow>
          ))}

          <S.IconBtn type="button" onClick={() => addItem(gIdx)} style={{ alignSelf: 'flex-start', fontSize: 13 }}>
            + Add item
          </S.IconBtn>
        </S.GroupCard>
      ))}

      <S.IconBtn type="button" onClick={addGroup} style={{ fontSize: 13 }}>
        + Add group
      </S.IconBtn>
    </>
  )
}

// ── Main component ──────────────────────────────────────────────

export default function RichContentTab({ property, onSaved }: Props) {
  const { saving, updateProperty } = useContentLibraryStore()
  const { getToken } = useAuth()

  const [content, setContent] = useState<PropertyPageContent>(() =>
    parseContent(property.pageContent),
  )
  const [dirty, setDirty] = useState(false)
  const [newSectionType, setNewSectionType] = useState<SectionType>('overview')

  // Reset when switching properties
  useEffect(() => {
    setContent(parseContent(property.pageContent))
    setDirty(false)
  }, [property.id])

  function updateSection(idx: number, updated: PropertySection) {
    setContent((c) => ({
      sections: c.sections.map((s, i) => (i === idx ? updated : s)),
    }))
    setDirty(true)
  }

  function removeSection(idx: number) {
    setContent((c) => ({ sections: c.sections.filter((_, i) => i !== idx) }))
    setDirty(true)
  }

  function moveSection(idx: number, dir: -1 | 1) {
    const next = idx + dir
    if (next < 0 || next >= content.sections.length) return
    const sections = [...content.sections]
    ;[sections[idx], sections[next]] = [sections[next], sections[idx]]
    setContent({ sections })
    setDirty(true)
  }

  function addSection() {
    setContent((c) => ({ sections: [...c.sections, emptySection(newSectionType)] }))
    setDirty(true)
  }

  async function handleSave() {
    await updateProperty(property.id, { pageContent: content })
    setDirty(false)
    onSaved?.()
  }

  return (
    <div>
      <S.SectionList>
        {content.sections.length === 0 && (
          <div style={{ fontSize: 13, color: 'var(--muted)', padding: '20px 0' }}>
            No sections yet. Add one below.
          </div>
        )}

        {content.sections.map((section, idx) => (
          <S.SectionCard key={idx}>
            <S.SectionHeader>
              <S.SectionLabel>{sectionLabel(section.type)}</S.SectionLabel>
              <S.IconBtn
                type="button"
                title="Move up"
                onClick={() => moveSection(idx, -1)}
                disabled={idx === 0}
                style={{ opacity: idx === 0 ? 0.3 : 1 }}
              >↑</S.IconBtn>
              <S.IconBtn
                type="button"
                title="Move down"
                onClick={() => moveSection(idx, 1)}
                disabled={idx === content.sections.length - 1}
                style={{ opacity: idx === content.sections.length - 1 ? 0.3 : 1 }}
              >↓</S.IconBtn>
              <S.DangerIconBtn type="button" title="Remove section" onClick={() => removeSection(idx)}>
                ✕
              </S.DangerIconBtn>
            </S.SectionHeader>

            <S.SectionBody>
              {section.type === 'fastFacts' ? (
                <FastFactsEditor
                  section={section}
                  onChange={(updated) => updateSection(idx, updated)}
                />
              ) : (
                <TextImageEditor
                  section={section as TextImageSection}
                  onChange={(updated) => updateSection(idx, updated)}
                  getToken={getToken}
                />
              )}
            </S.SectionBody>
          </S.SectionCard>
        ))}
      </S.SectionList>

      <S.AddSectionBar>
        <S.SectionTypeSelect
          value={newSectionType}
          onChange={(e) => setNewSectionType(e.target.value as SectionType)}
        >
          {SECTION_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </S.SectionTypeSelect>
        <S.AddSectionBtn type="button" onClick={addSection}>
          + Add Section
        </S.AddSectionBtn>
      </S.AddSectionBar>

      {dirty && (
        <S.SaveRow>
          <S.SaveButton onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Content'}
          </S.SaveButton>
        </S.SaveRow>
      )}
    </div>
  )
}
