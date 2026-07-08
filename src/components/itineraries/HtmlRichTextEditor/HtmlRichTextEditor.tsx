'use client'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import * as S from './HtmlRichTextEditor.styled'

interface Props {
  /** Initial HTML content. Only used on mount — editor is the source of truth. */
  content: string
  /** Called with the editor's HTML ('' when empty). */
  onChange: (html: string) => void
  placeholder?: string
}

/**
 * Rich text editor that reads/writes HTML strings — for fields stored as
 * String in the API (e.g. costs includes/excludes/notes). Plain-text legacy
 * values load fine: Tiptap wraps them in a paragraph.
 */
export default function HtmlRichTextEditor({ content, onChange, placeholder = 'Type here…' }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
    ],
    content: content || null,
    onUpdate: ({ editor: ed }) => {
      onChange(ed.isEmpty ? '' : ed.getHTML())
    },
  })

  if (!editor) return null

  return (
    <S.Wrap>
      <S.Toolbar>
        <S.ToolButton
          type="button"
          title="Bold"
          $active={editor.isActive('bold')}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run() }}
        >
          <strong>B</strong>
        </S.ToolButton>
        <S.ToolButton
          type="button"
          title="Italic"
          $active={editor.isActive('italic')}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run() }}
        >
          <em>I</em>
        </S.ToolButton>
        <S.ToolButton
          type="button"
          title="Bullet list"
          $active={editor.isActive('bulletList')}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run() }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="9" y1="6" x2="20" y2="6" /><line x1="9" y1="12" x2="20" y2="12" /><line x1="9" y1="18" x2="20" y2="18" />
            <circle cx="4.5" cy="6" r="1" fill="currentColor" /><circle cx="4.5" cy="12" r="1" fill="currentColor" /><circle cx="4.5" cy="18" r="1" fill="currentColor" />
          </svg>
        </S.ToolButton>
        <S.ToolButton
          type="button"
          title="Numbered list"
          $active={editor.isActive('orderedList')}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run() }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" />
            <path d="M4 6h1v4" strokeWidth="1.8" /><path d="M4 10h2" strokeWidth="1.8" />
          </svg>
        </S.ToolButton>
      </S.Toolbar>
      <S.EditorArea>
        <EditorContent editor={editor} />
      </S.EditorArea>
    </S.Wrap>
  )
}
