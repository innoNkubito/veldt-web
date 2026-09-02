'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useAuth } from '@clerk/nextjs'
import { useAboutUsStore, type AboutUsFull } from '@/stores/aboutUsStore'
import { uploadFile } from '@/lib/upload'
import { parsePageContent, type TextImageSection } from '@/lib/pageContent'
import * as S from '../page.styled'

interface Props {
  aboutUs: AboutUsFull
  onSaved?: () => void
}

function parseOverview(aboutUs: AboutUsFull): TextImageSection {
  const raw = aboutUs.pageContent
  const first = parsePageContent(raw)?.sections[0]
  if (first?.type === 'overview') return first
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
        <S.RichToolBtn type='button' $active={editor?.isActive('bold')} onClick={() => editor?.chain().focus().toggleBold().run()} title='Bold'><strong>B</strong></S.RichToolBtn>
        <S.RichToolBtn type='button' $active={editor?.isActive('italic')} onClick={() => editor?.chain().focus().toggleItalic().run()} title='Italic'><em>I</em></S.RichToolBtn>
        <S.RichToolDivider />
        <S.RichToolBtn type='button' $active={editor?.isActive('bulletList')} onClick={() => editor?.chain().focus().toggleBulletList().run()} title='Bullet list'>≡</S.RichToolBtn>
        <S.RichToolBtn type='button' $active={editor?.isActive('orderedList')} onClick={() => editor?.chain().focus().toggleOrderedList().run()} title='Numbered list'>1.</S.RichToolBtn>
      </S.RichEditorToolbar>
      <EditorContent editor={editor} />
    </S.RichEditorWrap>
  )
}

export default function AboutUsRichContentTab({ aboutUs, onSaved }: Props) {
  const { saving, updateAboutUs } = useAboutUsStore()
  const { getToken } = useAuth()
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const [section, setSection] = useState<TextImageSection>(() => parseOverview(aboutUs))
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    setSection(parseOverview(aboutUs))
    setDirty(false)
  }, [aboutUs.id])

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
    await updateAboutUs(aboutUs.id, { pageContent: { sections: [section] } })
    setDirty(false)
    onSaved?.()
  }

  return (
    <div>
      <S.SectionCard>
        <S.SectionHeader>
          <S.SectionLabel>About Us</S.SectionLabel>
        </S.SectionHeader>
        <S.SectionBody>
          <S.FieldGroup>
            <S.FieldLabel>Text 1</S.FieldLabel>
            <RichEditor value={section.text1} onChange={handleText1Change} placeholder='Opening paragraph…' />
          </S.FieldGroup>

          <S.FieldGroup>
            <S.FieldLabel>Photos</S.FieldLabel>
            {section.images.length > 0 && (
              <S.PhotoGrid>
                {section.images.map((url, i) => (
                  <S.PhotoThumb key={i} $url={url}>
                    <S.PhotoRemove type='button' onClick={() => update({ images: section.images.filter((_, j) => j !== i) })}>✕</S.PhotoRemove>
                  </S.PhotoThumb>
                ))}
              </S.PhotoGrid>
            )}
            <S.PhotoUploadZone htmlFor='aboutus-overview-upload'>
              <S.PhotoUploadBtn>{uploading ? 'Uploading…' : 'Add Photos'}</S.PhotoUploadBtn>
              <S.PhotoUploadNote>JPG, PNG, WEBP — max 5 MB each.</S.PhotoUploadNote>
            </S.PhotoUploadZone>
            <input id='aboutus-overview-upload' type='file' accept='image/*' multiple style={{ display: 'none' }} ref={fileRef} onChange={handleUpload} />
          </S.FieldGroup>

          <S.FieldGroup>
            <S.FieldLabel>Text 2</S.FieldLabel>
            <RichEditor value={section.text2} onChange={handleText2Change} placeholder='Continuation paragraph…' />
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
