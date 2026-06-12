'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useAuth } from '@clerk/nextjs'
import {
  useContentLibraryStore,
  type PropertyFull,
} from '@/stores/contentLibraryStore'
import { uploadFile } from '@/lib/upload'
import {
  type PropertyPageContent,
  type PropertySection,
  type TextImageSection,
  type FastFactsSection,
  type AccommodationSection,
  type SectionType,
  SECTION_TYPES,
  emptySection,
  defaultTemplate,
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

function parseContent(property: PropertyFull): PropertyPageContent {
  const raw = property.pageContent
  if (raw && typeof raw === 'object' && 'sections' in raw) {
    const pc = raw as PropertyPageContent
    if (Array.isArray(pc.sections) && pc.sections.length > 0) return pc
  }
  return defaultTemplate(property.rooms.length > 0)
}

// ── Rich text editor ───────────────────────────────────────────

interface RichEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

function RichEditor({ value, onChange, placeholder }: RichEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: placeholder ?? 'Write something…' }),
    ],
    content: value || '',
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML())
    },
  })

  // Sync external value changes (e.g. section reset)
  useEffect(() => {
    if (!editor) return
    const currentHtml = editor.getHTML()
    if (value !== currentHtml) {
      editor.commands.setContent(value || '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const toggleBold = () => editor?.chain().focus().toggleBold().run()
  const toggleItalic = () => editor?.chain().focus().toggleItalic().run()
  const toggleBullet = () => editor?.chain().focus().toggleBulletList().run()
  const toggleOrdered = () => editor?.chain().focus().toggleOrderedList().run()

  return (
    <S.RichEditorWrap>
      <S.RichEditorToolbar>
        <S.RichToolBtn
          type='button'
          $active={editor?.isActive('bold')}
          onClick={toggleBold}
          title='Bold'
        >
          <strong>B</strong>
        </S.RichToolBtn>
        <S.RichToolBtn
          type='button'
          $active={editor?.isActive('italic')}
          onClick={toggleItalic}
          title='Italic'
        >
          <em>I</em>
        </S.RichToolBtn>
        <S.RichToolDivider />
        <S.RichToolBtn
          type='button'
          $active={editor?.isActive('bulletList')}
          onClick={toggleBullet}
          title='Bullet list'
        >
          ≡
        </S.RichToolBtn>
        <S.RichToolBtn
          type='button'
          $active={editor?.isActive('orderedList')}
          onClick={toggleOrdered}
          title='Numbered list'
        >
          1.
        </S.RichToolBtn>
      </S.RichEditorToolbar>
      <EditorContent editor={editor} />
    </S.RichEditorWrap>
  )
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
  const inputId = `img-upload-${section.type}`

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    try {
      const urls = await Promise.all(files.map((f) => uploadFile(f, getToken)))
      onChange({ ...section, images: [...section.images, ...urls] })
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

  const handleText1Change = useCallback(
    (html: string) => onChange({ ...section, text1: html }),
    [section, onChange],
  )
  const handleText2Change = useCallback(
    (html: string) => onChange({ ...section, text2: html }),
    [section, onChange],
  )

  return (
    <>
      <S.FieldGroup>
        <S.FieldLabel>Text 1</S.FieldLabel>
        <RichEditor
          value={section.text1}
          onChange={handleText1Change}
          placeholder='Opening paragraph…'
        />
      </S.FieldGroup>

      <S.FieldGroup>
        <S.FieldLabel>Photos</S.FieldLabel>
        {section.images.length > 0 && (
          <S.PhotoGrid>
            {section.images.map((url, i) => (
              <S.PhotoThumb key={i} $url={url}>
                <S.PhotoRemove type='button' onClick={() => removeImage(i)}>
                  ✕
                </S.PhotoRemove>
              </S.PhotoThumb>
            ))}
          </S.PhotoGrid>
        )}
        <S.PhotoUploadZone htmlFor={inputId}>
          <S.PhotoUploadBtn>
            {uploading ? 'Uploading…' : 'Add Photos'}
          </S.PhotoUploadBtn>
          <S.PhotoUploadNote>Click here to upload photos.</S.PhotoUploadNote>
          <S.PhotoUploadNote>
            File formats include JPG, PNG, WEBP. Max 5 MB each.
          </S.PhotoUploadNote>
        </S.PhotoUploadZone>
        <input
          id={inputId}
          type='file'
          accept='image/*'
          multiple
          style={{ display: 'none' }}
          ref={fileRef}
          onChange={handleUpload}
        />
      </S.FieldGroup>

      <S.FieldGroup>
        <S.FieldLabel>Text 2</S.FieldLabel>
        <RichEditor
          value={section.text2}
          onChange={handleText2Change}
          placeholder='Continuation paragraph…'
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
  function updateGroup(
    gIdx: number,
    patch: Partial<(typeof section.groups)[0]>,
  ) {
    const groups = section.groups.map((g, i) =>
      i === gIdx ? { ...g, ...patch } : g,
    )
    onChange({ ...section, groups })
  }

  function addGroup() {
    onChange({
      ...section,
      groups: [...section.groups, { label: '', items: [''] }],
    })
  }

  function removeGroup(gIdx: number) {
    onChange({
      ...section,
      groups: section.groups.filter((_, i) => i !== gIdx),
    })
  }

  function updateItem(gIdx: number, iIdx: number, value: string) {
    const items = section.groups[gIdx].items.map((it, i) =>
      i === iIdx ? value : it,
    )
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
              placeholder='Group label (e.g. Highlights)'
            />
            {section.groups.length > 1 && (
              <S.DangerIconBtn
                type='button'
                onClick={() => removeGroup(gIdx)}
                title='Remove group'
              >
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
              <S.DangerIconBtn
                type='button'
                onClick={() => removeItem(gIdx, iIdx)}
                title='Remove item'
              >
                ✕
              </S.DangerIconBtn>
            </S.ItemRow>
          ))}

          <S.IconBtn
            type='button'
            onClick={() => addItem(gIdx)}
            style={{ alignSelf: 'flex-start', fontSize: 13 }}
          >
            + Add item
          </S.IconBtn>
        </S.GroupCard>
      ))}

      <S.IconBtn type='button' onClick={addGroup} style={{ fontSize: 13 }}>
        + Add group
      </S.IconBtn>
    </>
  )
}

interface AccommodationProps {
  section: AccommodationSection
  onChange: (updated: AccommodationSection) => void
  property: PropertyFull
}

function AccommodationEditor({
  section,
  onChange,
  property,
}: AccommodationProps) {
  return (
    <>
      <S.FieldGroup>
        <S.FieldLabel>Intro text (optional)</S.FieldLabel>
        <S.FieldTextarea
          value={section.intro}
          onChange={(e) => onChange({ ...section, intro: e.target.value })}
          placeholder='Brief introduction to your accommodation options…'
        />
      </S.FieldGroup>

      <S.FieldGroup>
        <S.FieldLabel>Rooms</S.FieldLabel>
        {property.rooms.length === 0 ? (
          <div
            style={{ fontSize: 13, color: 'var(--muted)', padding: '8px 0' }}
          >
            No rooms added yet. Add rooms in the Rooms tab — they&apos;ll appear
            here automatically.
          </div>
        ) : (
          <S.AccommodationRoomList>
            {property.rooms.map((room) => (
              <S.AccommodationRoomRow key={room.id}>
                {room.photos[0] && (
                  <S.AccommodationRoomThumb $url={room.photos[0]} />
                )}
                <div>
                  <S.AccommodationRoomName style={{ fontSize: 13 }}>
                    {room.roomType}
                  </S.AccommodationRoomName>
                  {room.description && (
                    <div
                      style={{
                        fontSize: 12,
                        color: 'var(--muted)',
                        marginTop: 2,
                      }}
                    >
                      {room.description.slice(0, 80)}
                      {room.description.length > 80 ? '…' : ''}
                    </div>
                  )}
                </div>
              </S.AccommodationRoomRow>
            ))}
          </S.AccommodationRoomList>
        )}
        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>
          Room details are managed in the Rooms tab.
        </div>
      </S.FieldGroup>
    </>
  )
}

// ── Main component ──────────────────────────────────────────────

export default function RichContentTab({ property, onSaved }: Props) {
  const { saving, updateProperty } = useContentLibraryStore()
  const { getToken } = useAuth()

  const [content, setContent] = useState<PropertyPageContent>(() =>
    parseContent(property),
  )

  const [dirty, setDirty] = useState(false)
  const [newSectionType, setNewSectionType] = useState<SectionType>('overview')

  useEffect(() => {
    setContent(parseContent(property))
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
    setContent((c) => ({
      sections: [...c.sections, emptySection(newSectionType)],
    }))
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
          <div
            style={{ fontSize: 13, color: 'var(--muted)', padding: '20px 0' }}
          >
            No sections yet. Add one below.
          </div>
        )}

        {content.sections.map((section, idx) => (
          <S.SectionCard key={idx}>
            <S.SectionHeader>
              <S.SectionLabel>{sectionLabel(section.type)}</S.SectionLabel>
              <S.IconBtn
                type='button'
                title='Move up'
                onClick={() => moveSection(idx, -1)}
                disabled={idx === 0}
                style={{ opacity: idx === 0 ? 0.3 : 1 }}
              >
                ↑
              </S.IconBtn>
              <S.IconBtn
                type='button'
                title='Move down'
                onClick={() => moveSection(idx, 1)}
                disabled={idx === content.sections.length - 1}
                style={{
                  opacity: idx === content.sections.length - 1 ? 0.3 : 1,
                }}
              >
                ↓
              </S.IconBtn>
              <S.DangerIconBtn
                type='button'
                title='Remove section'
                onClick={() => removeSection(idx)}
              >
                ✕
              </S.DangerIconBtn>
            </S.SectionHeader>

            <S.SectionBody>
              {section.type === 'fastFacts' ? (
                <FastFactsEditor
                  section={section}
                  onChange={(updated) => updateSection(idx, updated)}
                />
              ) : section.type === 'accommodation' ? (
                <AccommodationEditor
                  section={section}
                  onChange={(updated) => updateSection(idx, updated)}
                  property={property}
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
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </S.SectionTypeSelect>
        <S.AddSectionBtn type='button' onClick={addSection}>
          + Add Section
        </S.AddSectionBtn>
      </S.AddSectionBar>

      <S.SaveRow>
        <S.SaveButton onClick={handleSave} disabled={saving || !dirty}>
          {saving ? 'Saving…' : dirty ? 'Save Page' : 'Saved'}
        </S.SaveButton>
      </S.SaveRow>
    </div>
  )
}
