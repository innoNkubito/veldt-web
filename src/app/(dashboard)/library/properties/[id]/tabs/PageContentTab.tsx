'use client'

import { useState } from 'react'
import { type PropertyFull } from '@/stores/contentLibraryStore'
import {
  type PropertyPageContent,
  type TextImageSection,
  type FastFactsSection,
  type AccommodationSection,
  defaultTemplate,
} from './pageContent.types'
import RichContentTab from './RichContentTab'
import * as S from '../page.styled'

interface Props {
  property: PropertyFull
}

function hasContent(raw: unknown): boolean {
  if (raw && typeof raw === 'object' && 'sections' in raw) {
    const pc = raw as PropertyPageContent
    return Array.isArray(pc.sections) && pc.sections.length > 0
  }
  return false
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
    case 'accommodation': return 'Accommodation'
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

function AccommodationView({
  section,
  property,
}: {
  section: AccommodationSection
  property: PropertyFull
}) {
  return (
    <S.ContentSection>
      <S.ContentSectionTitle>{sectionTitle(section.type)}</S.ContentSectionTitle>
      {section.intro && <S.ContentText>{section.intro}</S.ContentText>}
      {property.rooms.length === 0 ? (
        <S.EmptyContent style={{ textAlign: 'left', padding: '12px 0' }}>
          No rooms added yet. Add rooms in the Rooms tab.
        </S.EmptyContent>
      ) : (
        <S.AccommodationGrid>
          {property.rooms.map((room) => (
            <S.AccommodationCard key={room.id}>
              {room.photos.length > 0 && (
                <S.AccommodationPhoto $url={room.photos[0]} />
              )}
              <S.AccommodationCardBody>
                <S.AccommodationRoomName>{room.roomType}</S.AccommodationRoomName>
                {room.description && (
                  <S.AccommodationRoomDesc>{room.description}</S.AccommodationRoomDesc>
                )}
                {room.photos.length > 1 && (
                  <S.AccommodationPhotoCount>+{room.photos.length - 1} photo{room.photos.length - 1 !== 1 ? 's' : ''}</S.AccommodationPhotoCount>
                )}
              </S.AccommodationCardBody>
            </S.AccommodationCard>
          ))}
        </S.AccommodationGrid>
      )}
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
  // If no content yet, start in edit mode with default template pre-loaded
  const [editing, setEditing] = useState(() => !hasContent(property.pageContent))
  const content = parseContent(property.pageContent)

  if (editing) {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          {content && (
            <S.EditContentBtn onClick={() => setEditing(false)}>← Back to view</S.EditContentBtn>
          )}
        </div>
        <RichContentTab property={property} onSaved={() => setEditing(false)} />
      </div>
    )
  }

  return (
    <S.PageContentWrap>
      <S.PageContentHeader>
        <S.PageContentTitle>New Page</S.PageContentTitle>
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
          content.sections.map((section, i) => {
            if (section.type === 'fastFacts') {
              return <FastFactsView key={i} section={section as FastFactsSection} />
            }
            if (section.type === 'accommodation') {
              return <AccommodationView key={i} section={section as AccommodationSection} property={property} />
            }
            return <TextImageView key={i} section={section as TextImageSection} />
          })
        )}
      </S.PageContentBody>
    </S.PageContentWrap>
  )
}
