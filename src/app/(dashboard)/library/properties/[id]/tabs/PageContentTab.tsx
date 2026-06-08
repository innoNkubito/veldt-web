'use client'

import { useState } from 'react'
import { type PropertyFull } from '@/stores/contentLibraryStore'
import {
  type PropertyPageContent,
  type TextImageSection,
  type FastFactsSection,
} from './pageContent.types'
import RichContentTab from './RichContentTab'
import * as S from '../page.styled'

interface Props {
  property: PropertyFull
}

function parseContent(raw: unknown): PropertyPageContent | null {
  if (raw && typeof raw === 'object' && 'sections' in raw) {
    const pc = raw as PropertyPageContent
    if (Array.isArray(pc.sections) && pc.sections.length > 0) return pc
  }
  return null
}

function sectionTitle(type: string) {
  switch (type) {
    case 'overview': return 'Property Overview'
    case 'experience': return 'Experience & Activities'
    case 'fastFacts': return 'Fast Facts'
    default: return type.charAt(0).toUpperCase() + type.slice(1)
  }
}

// ── Section renderers ──────────────────────────────────────────

function TextImageView({ section }: { section: TextImageSection }) {
  return (
    <S.ContentSection>
      <S.ContentSectionTitle>{sectionTitle(section.type)}</S.ContentSectionTitle>
      {section.text1 && <S.ContentText>{section.text1}</S.ContentText>}
      {section.images.length > 0 && (
        <S.ContentImageGrid>
          {section.images.map((url, i) => (
            <S.ContentImage key={i} $url={url} />
          ))}
        </S.ContentImageGrid>
      )}
      {section.text2 && <S.ContentText>{section.text2}</S.ContentText>}
    </S.ContentSection>
  )
}

function FastFactsView({ section }: { section: FastFactsSection }) {
  return (
    <S.ContentSection>
      <S.ContentSectionTitle>{sectionTitle(section.type)}</S.ContentSectionTitle>
      <S.FastFactsGrid>
        {section.groups.map((group, i) => (
          <S.FastFactGroup key={i}>
            {group.label && <S.FastFactGroupLabel>{group.label}</S.FastFactGroupLabel>}
            {group.items.filter(Boolean).map((item, j) => (
              <S.FastFactItem key={j}>{item}</S.FastFactItem>
            ))}
          </S.FastFactGroup>
        ))}
      </S.FastFactsGrid>
    </S.ContentSection>
  )
}

// ── Main component ──────────────────────────────────────────────

export default function PageContentTab({ property }: Props) {
  const [editing, setEditing] = useState(false)
  const content = parseContent(property.pageContent)

  if (editing) {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <S.EditContentBtn onClick={() => setEditing(false)}>← Back to view</S.EditContentBtn>
        </div>
        <RichContentTab property={property} onSaved={() => setEditing(false)} />
      </div>
    )
  }

  return (
    <S.PageContentWrap>
      <S.PageContentHeader>
        <S.PageContentTitle>Page Content</S.PageContentTitle>
        <S.EditContentBtn onClick={() => setEditing(true)}>Edit Sections</S.EditContentBtn>
      </S.PageContentHeader>

      <S.PageContentBody>
        {!content ? (
          <S.EmptyContent>
            No content yet.{' '}
            <button
              style={{ background: 'none', border: 'none', color: 'var(--terra)', cursor: 'pointer', fontSize: 13, textDecoration: 'underline' }}
              onClick={() => setEditing(true)}
            >
              Add sections
            </button>
          </S.EmptyContent>
        ) : (
          content.sections.map((section, i) =>
            section.type === 'fastFacts' ? (
              <FastFactsView key={i} section={section as FastFactsSection} />
            ) : (
              <TextImageView key={i} section={section as TextImageSection} />
            ),
          )
        )}
      </S.PageContentBody>
    </S.PageContentWrap>
  )
}
