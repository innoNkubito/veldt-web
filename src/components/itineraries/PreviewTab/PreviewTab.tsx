'use client'

import React from 'react'
import { useBuilderStore, type ItineraryRow } from '@/stores/builderStore'
import * as S from './PreviewTab.styled'

// ── ProseMirror JSON → React renderer ────────────────────────────
// Handles the StarterKit schema + Mention extension nodes.

interface PMNode {
  type: string
  content?: PMNode[]
  text?: string
  marks?: { type: string; attrs?: Record<string, unknown> }[]
  attrs?: Record<string, unknown>
}

function renderNode(node: PMNode, key: number): React.ReactNode {
  // Text with marks
  if (node.type === 'text') {
    let el: React.ReactNode = node.text ?? ''
    const marks = node.marks ?? []
    for (const mark of marks) {
      if (mark.type === 'bold') el = <strong key={key}>{el}</strong>
      else if (mark.type === 'italic') el = <em key={key}>{el}</em>
      else if (mark.type === 'strike') el = <s key={key}>{el}</s>
      else if (mark.type === 'code') el = <code key={key}>{el}</code>
    }
    return el
  }

  // @mention node
  if (node.type === 'mention') {
    const label =
      (node.attrs?.label as string | undefined) ??
      (node.attrs?.id as string | undefined) ??
      ''
    return (
      <span key={key} className="mention">
        @{label}
      </span>
    )
  }

  // Inline break
  if (node.type === 'hardBreak') return <br key={key} />

  // Collect children
  const children = node.content?.map((child, i) => (
    <React.Fragment key={i}>{renderNode(child, i)}</React.Fragment>
  ))

  switch (node.type) {
    case 'doc':
      return <React.Fragment key={key}>{children}</React.Fragment>
    case 'paragraph':
      return <p key={key}>{children ?? <br />}</p>
    case 'bulletList':
      return <ul key={key}>{children}</ul>
    case 'orderedList':
      return <ol key={key}>{children}</ol>
    case 'listItem':
      return <li key={key}>{children}</li>
    case 'blockquote':
      return <blockquote key={key}>{children}</blockquote>
    case 'codeBlock':
      return (
        <pre key={key}>
          <code>{children}</code>
        </pre>
      )
    case 'heading': {
      const level = (node.attrs?.level as number | undefined) ?? 2
      const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
      return <Tag key={key}>{children}</Tag>
    }
    default:
      return <React.Fragment key={key}>{children}</React.Fragment>
  }
}

function RichText({ json }: { json: Record<string, unknown> | null }) {
  if (!json) return null
  const node = json as unknown as PMNode
  // A doc with no content nodes or only empty paragraphs is effectively empty
  if (!node.content?.length) return null
  const hasText = node.content.some(
    (n) =>
      n.type !== 'paragraph' ||
      (n.content && n.content.some((c) => c.type === 'text' && (c.text ?? '').length > 0)) ||
      (n.content && n.content.some((c) => c.type === 'mention'))
  )
  if (!hasText) return null
  return (
    <S.DayRichText>
      {node.content.map((child, i) => (
        <React.Fragment key={i}>{renderNode(child, i)}</React.Fragment>
      ))}
    </S.DayRichText>
  )
}

// ── Day label helper ─────────────────────────────────────────────

function dayLabel(row: ItineraryRow, index: number): string {
  if (row.dateLabel) return row.dateLabel
  if (row.startDate) {
    try {
      return new Date(row.startDate).toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      })
    } catch {
      // fall through
    }
  }
  return `Day ${index + 1}`
}

// ── Main component ───────────────────────────────────────────────

export default function PreviewTab() {
  const itinerary = useBuilderStore((s) => s.itinerary)

  if (!itinerary) return null

  const rows = [...itinerary.rows].sort((a, b) => a.position - b.position)

  return (
    <S.PreviewLayout>
      {/* ── Table of Contents ──────────────────────────────── */}
      <S.PreviewToC>
        <S.ToCTitle>Contents</S.ToCTitle>
        {rows.length === 0 ? (
          <div style={{ fontSize: 11, lineHeight: 1.5, color: 'inherit', opacity: 0.5 }}>
            No days yet.
          </div>
        ) : (
          rows.map((row, i) => (
            <S.ToCItem
              key={row.id}
              href={`#day-${row.id}`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(`day-${row.id}`)?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <S.ToCDayNum>{i + 1}</S.ToCDayNum>
              {dayLabel(row, i)}
            </S.ToCItem>
          ))
        )}
      </S.PreviewToC>

      {/* ── Itinerary content ────────────────────────────────── */}
      <S.PreviewContent>
        {/* Cover */}
        <S.PreviewCover>
          <S.PreviewCoverLabel>Itinerary</S.PreviewCoverLabel>
          <S.PreviewCoverTitle>{itinerary.proposalTitle}</S.PreviewCoverTitle>
          <S.PreviewCoverMeta>
            {itinerary.preparedFor && (
              <span>Prepared for {itinerary.preparedFor}</span>
            )}
            {itinerary.preparedFor && itinerary.travelDates && (
              <S.PreviewCoverDot />
            )}
            {itinerary.travelDates && <span>{itinerary.travelDates}</span>}
            {rows.length > 0 && (
              <>
                <S.PreviewCoverDot />
                <span>
                  {rows.length} {rows.length === 1 ? 'day' : 'days'}
                </span>
              </>
            )}
          </S.PreviewCoverMeta>
        </S.PreviewCover>

        {/* Day sections */}
        <S.DaySections>
          {rows.length === 0 ? (
            <S.EmptyState>
              No days added yet. Add days in the Day-by-Day tab.
            </S.EmptyState>
          ) : (
            rows.map((row, i) => {
              const richActivities = <RichText json={row.activitiesRichText} />
              const richAccommodations = <RichText json={row.accommodationsRichText} />
              const hasActivityTags = row.activities.length > 0
              const hasAccomTags = row.accommodations.length > 0
              const hasAnyContent =
                richActivities !== null ||
                richAccommodations !== null ||
                hasActivityTags ||
                hasAccomTags

              return (
                <S.DaySection key={row.id} id={`day-${row.id}`}>
                  <S.DayHeader>
                    <S.DayDate>{dayLabel(row, i)}</S.DayDate>
                    {row.areaPage && <S.DayArea>{row.areaPage.name}</S.DayArea>}
                  </S.DayHeader>

                  {hasAnyContent ? (
                    <S.DayColumns>
                      {/* Activities */}
                      <S.DayColumn>
                        <S.DayColumnLabel>Transfers &amp; Activities</S.DayColumnLabel>
                        {richActivities}
                        {hasActivityTags && (
                          <S.TagList>
                            {row.activities
                              .slice()
                              .sort((a, b) => a.position - b.position)
                              .map((a) => (
                                <S.Tag key={a.id}>{a.contentPage.name}</S.Tag>
                              ))}
                          </S.TagList>
                        )}
                      </S.DayColumn>

                      {/* Accommodations */}
                      <S.DayColumn>
                        <S.DayColumnLabel>Accommodations</S.DayColumnLabel>
                        {richAccommodations}
                        {hasAccomTags && (
                          <S.TagList>
                            {row.accommodations
                              .slice()
                              .sort((a, b) => a.position - b.position)
                              .map((a) => (
                                <S.Tag key={a.id}>
                                  {a.contentPage.name}
                                  {a.room ? ` — ${a.room.roomType}` : ''}
                                </S.Tag>
                              ))}
                          </S.TagList>
                        )}
                      </S.DayColumn>
                    </S.DayColumns>
                  ) : (
                    <S.EmptyDayText>No content added for this day.</S.EmptyDayText>
                  )}
                </S.DaySection>
              )
            })
          )}
        </S.DaySections>
      </S.PreviewContent>
    </S.PreviewLayout>
  )
}
