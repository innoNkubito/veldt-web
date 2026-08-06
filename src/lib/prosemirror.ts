/**
 * ProseMirror document parsing.
 *
 * Day rich text is persisted as free-form JSON, so it arrives typed only as
 * `Record<string, unknown>`. These helpers validate the shape at each level
 * rather than asserting it — malformed content yields null and renders as
 * nothing, instead of crashing the page.
 *
 * Shared by the builder Preview tab and the public client view, which render
 * the same documents.
 */

export interface PMMark {
  type: string
  attrs?: Record<string, unknown>
}

export interface PMNode {
  type: string
  content?: PMNode[]
  text?: string
  marks?: PMMark[]
  attrs?: Record<string, unknown>
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined
}

function toPMMark(value: unknown): PMMark | null {
  const record = asRecord(value)
  if (!record || typeof record.type !== 'string') return null
  return { type: record.type, attrs: asRecord(record.attrs) }
}

/** Parses stored ProseMirror JSON into a PMNode, or null if unrecognisable. */
export function toPMNode(value: unknown): PMNode | null {
  const record = asRecord(value)
  if (!record || typeof record.type !== 'string') return null

  const content = Array.isArray(record.content)
    ? record.content.flatMap((child) => {
        const parsed = toPMNode(child)
        return parsed ? [parsed] : []
      })
    : undefined

  const marks = Array.isArray(record.marks)
    ? record.marks.flatMap((mark) => {
        const parsed = toPMMark(mark)
        return parsed ? [parsed] : []
      })
    : undefined

  return {
    type: record.type,
    content,
    text: typeof record.text === 'string' ? record.text : undefined,
    marks,
    attrs: asRecord(record.attrs),
  }
}
