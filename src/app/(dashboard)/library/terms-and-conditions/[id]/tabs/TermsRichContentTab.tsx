'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useAuth } from '@clerk/nextjs'
import { useTermsAndConditionsStore, type TermsFull } from '@/stores/termsAndConditionsStore'
import { uploadFile } from '@/lib/upload'
import type { TextImageSection } from '../../../properties/[id]/tabs/pageContent.types'
import * as S from '../page.styled'

interface Props {
  terms: TermsFull
  onSaved?: () => void
}

function parseOverview(terms: TermsFull): TextImageSection {
  const raw = terms.pageContent
  if (raw && typeof raw === 'object' && 'sections' in raw) {
    const sections = (raw as any).sections
    if (Array.isArray(sections) && sections[0]?.type === 'overview') {
      return sections[0] as TextImageSection
    }
  }
  return { type: 'overview', text1: '', images: [], text2: '' }
}

function RichEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: placeholder ?? 'Write something…' }),
    ],
    content: value || '',
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
  })

  useEffect(() => {
    if (!editor) return
    if (value !== editor.getHTML()) editor.commands.setContent(value || '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <S.RichEditorWrap>
      <S.RichEditorToolbar>
        <S.RichToolBtn type="button" $active={editor?.isActive('bold')} onClick={() => editor?.chain().focus().toggleBold().run()} title="Bold"><strong>B</strong></S.RichToolBtn>
        <S.RichToolBtn type="button" $active={editor?.isActive('italic')} onClick={() => editor?.chain().focus().toggleItalic().run()} title="Italic"><em>I</em></S.RichToolBtn>
        <S.RichToolDivider />
        <S.RichToolBtn type="button" $active={editor?.isActive('bulletList')} onClick={() => editor?.chain().focus().toggleBulletList().run()} title="Bullet list">≡</S.RichToolBtn>
        <S.RichToolBtn type="button" $active={editor?.isActive('orderedList')} onClick={() => editor?.chain().focus().toggleOrderedList().run()} title="Numbered list">1.</S.RichToolBtn>
      </S.RichEditorToolbar>
      <EditorContent editor={editor} />
    </S.RichEditorWrap>
  )
}

export default function TermsRichContentTab({ terms, onSaved }: Props) {
  const { saving, updateTerms } = useTermsAndConditionsStore()
  const { getToken } = useAuth()
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const [section, setSection] = useState<TextImageSection>(() => parseOverview(terms))
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    setSection(parseOverview(terms))
    setDirty(false)
  }, [terms.id])

  function update(patch: Partial<TextImageSection>) {
    setSection((s) => ({ ...s, ...patch }))
    setDirty(true)
  }

  const handleText1Change = useCallback((html: string) => update({ text1: html }), [])
  const handleText2Change = useCallback((html: string) => update({ text2: html }), [])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    try {
      const urls = await Promise.all(files.map((f) => uploadFile(f, getToken)))
      update({ images: [...section.images, ...urls] })
    } catch { /* TODO: toast */ } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function handleSave() {
    await updateTerms(terms.id, { pageContent: { sections: [section] } })
    setDirty(false)
    onSaved?.()
  }

  return (
    <div>
      <S.SectionCard>
        <S.SectionHeader>
          <S.SectionLabel>Terms &amp; Conditions</S.SectionLabel>
        </S.SectionHeader>
        <S.SectionBody>
          <S.FieldGroup>
            <S.FieldLabel>Text 1</S.FieldLabel>
            <RichEditor value={section.text1} onChange={handleText1Change} placeholder="Opening paragraph or preamble…" />
          </S.FieldGroup>

          <S.FieldGroup>
            <S.FieldLabel>Photos (optional)</S.FieldLabel>
            {section.images.length > 0 && (
              <S.PhotoGrid>
                {section.images.map((url, i) => (
                  <S.PhotoThumb key={i} $url={url}>
                    <S.PhotoRemove type="button" onClick={() => update({ images: section.images.filter((_, j) => j !== i) })}>✕</S.PhotoRemove>
                  </S.PhotoThumb>
                ))}
              </S.PhotoGrid>
            )}
            <S.PhotoUploadZone htmlFor="terms-overview-upload">
              <S.PhotoUploadBtn>{uploading ? 'Uploading…' : 'Add Photos'}</S.PhotoUploadBtn>
              <S.PhotoUploadNote>JPG, PNG, WEBP — max 5 MB each.</S.PhotoUploadNote>
            </S.PhotoUploadZone>
            <input id="terms-overview-upload" type="file" accept="image/*" multiple style={{ display: 'none' }} ref={fileRef} onChange={handleUpload} />
          </S.FieldGroup>

          <S.FieldGroup>
            <S.FieldLabel>Text 2</S.FieldLabel>
            <RichEditor value={section.text2} onChange={handleText2Change} placeholder="Continuation…" />
          </S.FieldGroup>
        </S.SectionBody>
      </S.SectionCard>

      <S.SaveRow>
        <S.SaveButton onClick={handleSave} disabled={saving || !dirty}>
          {saving ? 'Saving…' : dirty ? 'Save Page' : 'Saved'}
        </S.SaveButton>
      </S.SaveRow>
    </div>
  )
}
