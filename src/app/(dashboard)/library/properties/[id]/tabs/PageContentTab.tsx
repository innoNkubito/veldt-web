'use client'

import { useRef, useState } from 'react'
import {
  MapPin, Binoculars, Sun, BedDouble, Plane, Thermometer,
  Users, CalendarDays, Leaf, Camera, Star, Info,
} from 'lucide-react'
import { useAuth } from '@clerk/nextjs'
import { useContentLibraryStore, type PropertyFull } from '@/stores/contentLibraryStore'
import { uploadFile } from '@/lib/upload'
import {
  type PropertyPageContent,
  type TextImageSection,
  type FastFactsSection,
  type AccommodationSection,
  type GallerySection,
} from './pageContent.types'
import RichContentTab from './RichContentTab'
import * as S from '../page.styled'

interface Props {
  property: PropertyFull
}

// ── Helpers ─────────────────────────────────────────────────────

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
    case 'gallery': return 'Gallery'
    default: return type.charAt(0).toUpperCase() + type.slice(1)
  }
}

function sectionIcon(type: string) {
  switch (type) {
    case 'overview': return '◈'
    case 'experience': return '◉'
    case 'accommodation': return '⊞'
    case 'fastFacts': return '≡'
    case 'gallery': return '▦'
    default: return '·'
  }
}

// ── Photo slider ────────────────────────────────────────────────

function PhotoSlider({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0)

  if (images.length === 0) return null

  if (images.length === 1) {
    return (
      <S.SliderWrap>
        <S.SliderTrack $index={0}>
          <S.SliderSlide $url={images[0]} />
        </S.SliderTrack>
      </S.SliderWrap>
    )
  }

  return (
    <S.SliderWrap>
      <S.SliderTrack $index={index}>
        {images.map((url, i) => (
          <S.SliderSlide key={i} $url={url} />
        ))}
      </S.SliderTrack>

      <S.SliderArrow
        $side="left"
        onClick={() => setIndex((i) => (i === 0 ? images.length - 1 : i - 1))}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </S.SliderArrow>

      <S.SliderArrow
        $side="right"
        onClick={() => setIndex((i) => (i === images.length - 1 ? 0 : i + 1))}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </S.SliderArrow>

      <S.SliderDots>
        {images.map((_, i) => (
          <S.SliderDot key={i} $active={i === index} onClick={() => setIndex(i)} />
        ))}
      </S.SliderDots>
    </S.SliderWrap>
  )
}

// ── Rich text renderer — handles HTML from Tiptap or plain text ─

function RichText({ html }: { html: string }) {
  if (!html) return null
  const isHtml = html.trimStart().startsWith('<')
  if (isHtml) {
    return (
      <S.ContentRichText
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }
  // Backward-compat: wrap plain text in paragraph tags
  return (
    <S.ContentRichText>
      {html.split('\n').filter(Boolean).map((line, i) => (
        <p key={i}>{line}</p>
      ))}
    </S.ContentRichText>
  )
}

// ── Section renderers ────────────────────────────────────────────

function TextImageView({ section }: { section: TextImageSection }) {
  return (
    <S.ContentSection id={`section-${section.type}`}>
      <S.ContentSectionTitle>{sectionTitle(section.type)}</S.ContentSectionTitle>
      {section.text1 && <RichText html={section.text1} />}
      {section.images.length > 0 && <PhotoSlider images={section.images} />}
      {section.text2 && <RichText html={section.text2} />}
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
    <S.ContentSection id="section-accommodation">
      <S.ContentSectionTitle>{sectionTitle(section.type)}</S.ContentSectionTitle>
      {section.intro && <RichText html={section.intro} />}
      {property.rooms.length === 0 ? (
        <S.EmptyContent style={{ textAlign: 'left', padding: '12px 0' }}>
          No rooms added yet. Add rooms in the Rooms tab.
        </S.EmptyContent>
      ) : (
        <>
          {property.rooms.map((room) => {
            const photos = room.photos ?? []
            // 1 photo → full-width slider; 2 photos → 2-col grid; 3+ → slider
            const useSlider = photos.length === 1 || photos.length >= 3
            const displayPhotos = useSlider ? photos : photos.slice(0, 2)

            return (
              <S.AccomRoomBlock key={room.id}>
                <S.AccomRoomHeading>{room.roomType}</S.AccomRoomHeading>
                {room.description && (
                  <S.AccomRoomDescription>{room.description}</S.AccomRoomDescription>
                )}
                {photos.length > 0 && (
                  useSlider ? (
                    <PhotoSlider images={photos} />
                  ) : (
                    <S.AccomPhotoGrid $count={displayPhotos.length}>
                      {displayPhotos.map((url, i) => (
                        <S.AccomPhoto key={i} $url={url} />
                      ))}
                    </S.AccomPhotoGrid>
                  )
                )}
              </S.AccomRoomBlock>
            )
          })}
        </>
      )}
    </S.ContentSection>
  )
}

// Maps common safari fact labels to Lucide icons
function factIcon(label: string) {
  const l = label.toLowerCase()
  if (l.includes('location') || l.includes('where'))           return <MapPin size={14} />
  if (l.includes('wildlife') || l.includes('animal') || l.includes('game')) return <Binoculars size={14} />
  if (l.includes('highlight') || l.includes('feature'))        return <Star size={14} />
  if (l.includes('activ') || l.includes('experience'))         return <Sun size={14} />
  if (l.includes('accommo') || l.includes('room') || l.includes('tent') || l.includes('suite')) return <BedDouble size={14} />
  if (l.includes('getting') || l.includes('flight') || l.includes('transfer') || l.includes('access')) return <Plane size={14} />
  if (l.includes('climate') || l.includes('weather') || l.includes('temp')) return <Thermometer size={14} />
  if (l.includes('best time') || l.includes('season') || l.includes('when')) return <CalendarDays size={14} />
  if (l.includes('family') || l.includes('child') || l.includes('guest'))    return <Users size={14} />
  if (l.includes('conservation') || l.includes('environment') || l.includes('eco')) return <Leaf size={14} />
  if (l.includes('photo') || l.includes('camera'))             return <Camera size={14} />
  if (l.includes('quick') || l.includes('fact') || l.includes('detail'))     return <Info size={14} />
  return <Star size={14} />
}

function FastFactsView({ section }: { section: FastFactsSection }) {
  const groups = section.groups.filter((g) => g.items.some(Boolean))
  if (groups.length === 0) return null

  return (
    <S.ContentSection id="section-fastFacts">
      <S.ContentSectionTitle>{sectionTitle(section.type)}</S.ContentSectionTitle>
      <S.FastFactsGrid>
        {groups.map((group, i) => (
          <S.FastFactGroup key={i}>
            <S.FastFactGroupHeader>
              <S.FastFactGroupIcon>
                {factIcon(group.label)}
              </S.FastFactGroupIcon>
              {group.label && (
                <S.FastFactGroupLabel>{group.label}</S.FastFactGroupLabel>
              )}
            </S.FastFactGroupHeader>
            <S.FastFactItems>
              {group.items.filter(Boolean).map((item, j) => (
                <S.FastFactItem key={j}>{item}</S.FastFactItem>
              ))}
            </S.FastFactItems>
          </S.FastFactGroup>
        ))}
      </S.FastFactsGrid>
    </S.ContentSection>
  )
}

// ── Gallery view ─────────────────────────────────────────────────

function GalleryView({ section }: { section: GallerySection }) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [downloading, setDownloading] = useState(false)

  if (section.images.length === 0) return null

  function toggle(url: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(url) ? next.delete(url) : next.add(url)
      return next
    })
  }

  function toggleAll() {
    if (selected.size === section.images.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(section.images))
    }
  }

  async function downloadSelected() {
    if (selected.size === 0) return
    setDownloading(true)
    try {
      for (const url of selected) {
        const res = await fetch(url)
        const blob = await res.blob()
        const objUrl = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = objUrl
        a.download = url.split('/').pop()?.split('?')[0] || 'image.jpg'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(objUrl)
      }
    } finally {
      setDownloading(false)
    }
  }

  const allSelected = selected.size === section.images.length

  return (
    <S.ContentSection id="section-gallery">
      <S.ContentSectionTitle>{sectionTitle('gallery')}</S.ContentSectionTitle>
      <S.GalleryGrid>
        {section.images.map((url, i) => {
          const isSelected = selected.has(url)
          return (
            <S.GalleryCell key={i} $selected={isSelected} onClick={() => toggle(url)}>
              <S.GalleryCellImg $url={url} />
              <S.GalleryCellCheck $selected={isSelected}>✓</S.GalleryCellCheck>
            </S.GalleryCell>
          )
        })}
      </S.GalleryGrid>
      <S.GalleryDownloadBar>
        <S.GallerySelectAllBtn onClick={toggleAll}>
          {allSelected ? 'Deselect all' : 'Select all'}
        </S.GallerySelectAllBtn>
        <S.GalleryDownloadBtn
          onClick={downloadSelected}
          disabled={selected.size === 0 || downloading}
        >
          {downloading ? 'Downloading…' : `Download${selected.size > 0 ? ` (${selected.size})` : ''}`}
        </S.GalleryDownloadBtn>
      </S.GalleryDownloadBar>
    </S.ContentSection>
  )
}

// ── Section list renderer ────────────────────────────────────────

function SectionList({
  content,
  property,
}: {
  content: PropertyPageContent
  property: PropertyFull
}) {
  return (
    <>
      {content.sections.map((section, i) => {
        if (section.type === 'fastFacts') {
          return <FastFactsView key={i} section={section as FastFactsSection} />
        }
        if (section.type === 'accommodation') {
          return (
            <AccommodationView
              key={i}
              section={section as AccommodationSection}
              property={property}
            />
          )
        }
        if (section.type === 'gallery') {
          return <GalleryView key={i} section={section as GallerySection} />
        }
        return <TextImageView key={i} section={section as TextImageSection} />
      })}
    </>
  )
}

// ── Preview modal ────────────────────────────────────────────────

function PreviewModal({
  property,
  content,
  onClose,
}: {
  property: PropertyFull
  content: PropertyPageContent | null
  onClose: () => void
}) {
  const areaName = property.area?.name ?? null
  const country = property.country ?? null

  return (
    <S.PreviewOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <S.PreviewBar>
        <S.PreviewBarTitle>
          <S.PreviewBadge>Preview</S.PreviewBadge>
          {property.name} — as seen by client
        </S.PreviewBarTitle>
        <S.PreviewCloseBtn onClick={onClose}>✕</S.PreviewCloseBtn>
      </S.PreviewBar>

      <S.PreviewBody>
        {/* Cover */}
        <S.PreviewCover $url={property.coverImageUrl ?? undefined}>
          <S.PreviewCoverContent>
            {areaName && <S.PageViewCoverBrand>{areaName}</S.PageViewCoverBrand>}
            <S.PreviewCoverTitle>{property.name}</S.PreviewCoverTitle>
            {country && <S.PreviewCoverMeta>{country}</S.PreviewCoverMeta>}
          </S.PreviewCoverContent>
        </S.PreviewCover>

        {/* Content */}
        <S.PreviewSections>
          {!content ? (
            <S.EmptyContent>No content added yet.</S.EmptyContent>
          ) : (
            <SectionList content={content} property={property} />
          )}
        </S.PreviewSections>
      </S.PreviewBody>
    </S.PreviewOverlay>
  )
}

// ── Main component ───────────────────────────────────────────────

export default function PageContentTab({ property }: Props) {
  const [editing, setEditing] = useState(() => !hasContent(property.pageContent))
  const [showPreview, setShowPreview] = useState(false)
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

  const areaName = property.area?.name ?? null
  const country = property.country ?? null
  const sectionTypes = content?.sections.map((s) => s.type) ?? []

  return (
    <>
      <S.PageViewLayout>
        {/* ── Col 1: Table of Contents ─── */}
        <S.PageToC>
          <S.ToCTitle>Contents</S.ToCTitle>
          {sectionTypes.length === 0 ? (
            <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5 }}>
              Add sections to see the table of contents.
            </div>
          ) : (
            sectionTypes.map((type, i) => (
              <S.ToCItem
                key={i}
                href={`#section-${type}`}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById(`section-${type}`)?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                <span style={{ fontSize: 11 }}>{sectionIcon(type)}</span>
                {sectionTitle(type)}
              </S.ToCItem>
            ))
          )}
        </S.PageToC>

        {/* ── Col 2: Cover ─────────────── */}
        <S.PageViewCover $url={property.coverImageUrl ?? undefined}>
          <S.CoverUploadBtn htmlFor="cover-upload-new-page" title="Change cover photo">
            {coverUploading ? '…' : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            {areaName && <S.PageViewCoverBrand>{areaName}</S.PageViewCoverBrand>}
            <S.PageViewCoverTitle>{property.name}</S.PageViewCoverTitle>
            {country && <S.PageViewCoverMeta>{country}</S.PageViewCoverMeta>}
          </S.PageViewCoverContent>
        </S.PageViewCover>

        {/* ── Col 3: Sections ──────────── */}
        <S.PageViewSections>
          <S.PageViewSectionsHeader>
            <S.PreviewBtn onClick={() => setShowPreview(true)}>Preview</S.PreviewBtn>
            {editing ? (
              content && (
                <S.EditContentBtn onClick={() => setEditing(false)}>← View page</S.EditContentBtn>
              )
            ) : (
              <S.EditContentBtn onClick={() => setEditing(true)}>Edit Sections</S.EditContentBtn>
            )}
          </S.PageViewSectionsHeader>

          {editing ? (
            <RichContentTab property={property} onSaved={() => setEditing(false)} />
          ) : (
            <>
              {!content ? (
                <S.EmptyContent>
                  No content yet.{' '}
                  <button
                    style={{
                      background: 'none', border: 'none',
                      color: 'var(--terra)', cursor: 'pointer',
                      fontSize: 13, textDecoration: 'underline',
                    }}
                    onClick={() => setEditing(true)}
                  >
                    Add sections
                  </button>
                </S.EmptyContent>
              ) : (
                <SectionList content={content} property={property} />
              )}
            </>
          )}
        </S.PageViewSections>
      </S.PageViewLayout>

      {/* Preview modal */}
      {showPreview && (
        <PreviewModal
          property={property}
          content={content}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  )
}
