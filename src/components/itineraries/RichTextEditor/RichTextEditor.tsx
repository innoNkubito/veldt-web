'use client'

import { useMemo, useRef, useState } from 'react'
import { EditorContent, useEditor, type JSONContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Mention from '@tiptap/extension-mention'
import Placeholder from '@tiptap/extension-placeholder'
import type { SuggestionProps, SuggestionKeyDownProps } from '@tiptap/suggestion'
import type { MentionNodeAttrs } from '@tiptap/extension-mention'
import type { ContentPageOption } from '@/stores/builderStore'
import * as S from './RichTextEditor.styled'
import { asString } from '@/lib/guards'

// ── Suggestion state ─────────────────────────────────────────────

interface SuggestionState {
  items: ContentPageOption[]
  selectedIndex: number
  command: SuggestionProps<ContentPageOption, MentionNodeAttrs>['command']
  getRect: () => DOMRect | null
}

// ── Component ─────────────────────────────────────────────────────

interface Props {
  /** Initial Tiptap JSON content. Only used on mount — editor is the source of truth. */
  content: Record<string, unknown> | null
  onChange: (json: Record<string, unknown>) => void
  /** Pages shown in the @mention suggestion dropdown. */
  mentionOptions: ContentPageOption[]
  placeholder?: string
}

export default function RichTextEditor({
  content,
  onChange,
  mentionOptions,
  placeholder = 'Type here… use @ to tag a page',
}: Props) {
  const [suggestion, setSuggestion] = useState<SuggestionState | null>(null)

  // Keep a ref so the mention callbacks always have the latest state
  const suggestionRef = useRef<SuggestionState | null>(null)
  suggestionRef.current = suggestion

  // Keep mentionOptions in a ref so the suggestion items() closure is always fresh
  const optionsRef = useRef(mentionOptions)
  optionsRef.current = mentionOptions

  const mentionExtension = useMemo(
    () =>
      Mention.configure({
        HTMLAttributes: { class: 'mention' },
        renderText: ({ node }) =>
          `@${asString(node.attrs.label) ?? asString(node.attrs.id) ?? ''}`,
        suggestion: {
          items: ({ query }: { query: string }) =>
            optionsRef.current
              .filter((o) =>
                query === '' || o.name.toLowerCase().includes(query.toLowerCase()),
              )
              .slice(0, 8),

          render: () => ({
            onStart: (props: SuggestionProps<ContentPageOption, MentionNodeAttrs>) => {
              setSuggestion({
                items: props.items,
                selectedIndex: 0,
                command: props.command,
                getRect: props.clientRect ?? (() => null),
              })
            },

            onUpdate: (props: SuggestionProps<ContentPageOption, MentionNodeAttrs>) => {
              setSuggestion((prev) =>
                prev
                  ? {
                      ...prev,
                      items: props.items,
                      command: props.command,
                      getRect: props.clientRect ?? (() => null),
                    }
                  : null,
              )
            },

            onKeyDown: ({ event }: SuggestionKeyDownProps) => {
              const s = suggestionRef.current
              if (!s) return false

              if (event.key === 'ArrowDown') {
                setSuggestion((p) =>
                  p
                    ? { ...p, selectedIndex: Math.min(p.selectedIndex + 1, p.items.length - 1) }
                    : null,
                )
                return true
              }
              if (event.key === 'ArrowUp') {
                setSuggestion((p) =>
                  p ? { ...p, selectedIndex: Math.max(p.selectedIndex - 1, 0) } : null,
                )
                return true
              }
              if (event.key === 'Enter') {
                const item = s.items[s.selectedIndex]
                if (item) s.command({ id: item.id, label: item.name })
                setSuggestion(null)
                return true
              }
              if (event.key === 'Escape') {
                setSuggestion(null)
                return true
              }
              return false
            },

            onExit: () => setSuggestion(null),
          }),
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      mentionExtension,
    ],
    content: content ?? null,
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getJSON())
    },
  })

  const rect = suggestion?.getRect()

  return (
    <S.Wrap>
      <EditorContent editor={editor} />

      {suggestion && rect && (
        <S.SuggestionDropdown
          style={{ top: rect.bottom + 4, left: rect.left }}
        >
          {suggestion.items.length === 0 ? (
            <S.SuggestionEmpty>No results</S.SuggestionEmpty>
          ) : (
            suggestion.items.map((item, i) => (
              <S.SuggestionItem
                key={item.id}
                $active={i === suggestion.selectedIndex}
                onMouseDown={(e) => {
                  e.preventDefault()
                  suggestion.command({ id: item.id, label: item.name })
                  setSuggestion(null)
                }}
              >
                {item.name}
              </S.SuggestionItem>
            ))
          )}
        </S.SuggestionDropdown>
      )}
    </S.Wrap>
  )
}
