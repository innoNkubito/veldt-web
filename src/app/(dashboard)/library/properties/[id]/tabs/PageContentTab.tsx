'use client'

import { useRef, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useContentLibraryStore, type PropertyFull } from '@/stores/contentLibraryStore'
import { uploadFile } from '@/lib/upload'
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

  const { getToken } = useAuth()
  const { updateProperty } = useContentLibraryStore()
  const coverInputRef = useRef<HTMLInputElement>(null)
  const [coverUploading, setCoverUploading] = useState(false)

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverUploading(true)
    try {
      const url = await uploadFile(file, getToken)
      await updateProperty(property.id, { coverImageUrl: url })
    } catch {
      // TODO: toast
    } finally {
      setCoverUploading(false)
      if (coverInputRef.current) coverInputRef.current.value = ''
    }
  }

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
    <S.PageViewLayout>
      {/* Left: sticky blurred cover with title */}
      <S.PageViewCover $url={property.coverImageUrl ?? undefined}>
        <S.CoverUploadBtn
          htmlFor="cover-upload-new-page"
          title="Change cover photo"
        >
          {coverUploading ? '…' : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
              Choose photo
            </>
          )}
        </S.CoverUploadBtn>
        <input
          id="cover-upload-new-page"
          ref={coverInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleCoverUpload}
        />
        <S.PageViewCoverContent>
          <S.PageViewCoverTitle>{property.name}</S.PageViewCoverTitle>
          {(property.area || property.country) && (
            <S.PageViewCoverMeta>
              {[property.area?.name, property.country].filter(Boolean).join(' · ')}
            </S.PageViewCoverMeta>
          )}
        </S.PageViewCoverContent>
      </S.PageViewCover>

      {/* Right: sections on white */}
      <S.PageViewSections>
        <S.PageViewSectionsHeader>
          <span />
          <S.EditContentBtn onClick={() => setEditing(true)}>Edit Sections</S.EditContentBtn>
        </S.PageViewSectionsHeader>

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
      </S.PageViewSections>
    </S.PageViewLayout>
  )
}
