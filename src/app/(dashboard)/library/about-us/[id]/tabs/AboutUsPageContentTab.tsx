'use client'

import { useRef, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useAboutUsStore, type AboutUsFull } from '@/stores/aboutUsStore'
import { uploadFile } from '@/lib/upload'
import type { TextImageSection } from '../../../properties/[id]/tabs/pageContent.types'
import AboutUsRichContentTab from './AboutUsRichContentTab'
import * as S from '../page.styled'

interface Props {
  aboutUs: AboutUsFull
}

function parseOverview(raw: unknown): TextImageSection | null {
  if (raw && typeof raw === 'object' && 'sections' in raw) {
    const sections: unknown = raw.sections
    if (Array.isArray(sections) && sections[0]?.type === 'overview') {
      const s = sections[0] as TextImageSection
      if (s.text1 || s.text2 || s.images.length > 0) return s
    }
  }
  return null
}

function PhotoSlider({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0)
  if (images.length === 0) return null

  if (images.length === 1) {
    return (
      <S.SliderWrap>
        <S.SliderTrack $index={0}><S.SliderSlide $url={images[0]} /></S.SliderTrack>
      </S.SliderWrap>
    )
  }

  return (
    <S.SliderWrap>
      <S.SliderTrack $index={index}>
        {images.map((url, i) => <S.SliderSlide key={i} $url={url} />)}
      </S.SliderTrack>
      <S.SliderArrow $side="left" onClick={() => setIndex((i) => (i === 0 ? images.length - 1 : i - 1))}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
      </S.SliderArrow>
      <S.SliderArrow $side="right" onClick={() => setIndex((i) => (i === images.length - 1 ? 0 : i + 1))}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
      </S.SliderArrow>
      <S.SliderDots>
        {images.map((_, i) => <S.SliderDot key={i} $active={i === index} onClick={() => setIndex(i)} />)}
      </S.SliderDots>
    </S.SliderWrap>
  )
}

function RichText({ html }: { html: string }) {
  if (!html) return null
  if (html.trimStart().startsWith('<')) {
    return <S.ContentRichText dangerouslySetInnerHTML={{ __html: html }} />
  }
  return (
    <S.ContentRichText>
      {html.split('\n').filter(Boolean).map((line, i) => <p key={i}>{line}</p>)}
    </S.ContentRichText>
  )
}

function OverviewView({ section }: { section: TextImageSection }) {
  return (
    <S.ContentSection id="section-overview">
      <S.ContentSectionTitle>About Us</S.ContentSectionTitle>
      {section.text1 && <RichText html={section.text1} />}
      {section.images.length > 0 && <PhotoSlider images={section.images} />}
      {section.text2 && <RichText html={section.text2} />}
    </S.ContentSection>
  )
}

function PreviewModal({
  aboutUs,
  overview,
  onClose,
}: {
  aboutUs: AboutUsFull
  overview: TextImageSection | null
  onClose: () => void
}) {
  return (
    <S.PreviewOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <S.PreviewBar>
        <S.PreviewBarTitle>
          <S.PreviewBadge>Preview</S.PreviewBadge>
          {aboutUs.name} — as seen by client
        </S.PreviewBarTitle>
        <S.PreviewCloseBtn onClick={onClose}>✕</S.PreviewCloseBtn>
      </S.PreviewBar>
      <S.PreviewBody>
        <S.PreviewCover $url={aboutUs.coverImageUrl ?? undefined}>
          <S.PreviewCoverContent>
            <S.PreviewCoverTitle>{aboutUs.name}</S.PreviewCoverTitle>
          </S.PreviewCoverContent>
        </S.PreviewCover>
        <S.PreviewSections>
          {!overview ? (
            <S.EmptyContent>No content added yet.</S.EmptyContent>
          ) : (
            <OverviewView section={overview} />
          )}
        </S.PreviewSections>
      </S.PreviewBody>
    </S.PreviewOverlay>
  )
}

export default function AboutUsPageContentTab({ aboutUs }: Props) {
  const overview = parseOverview(aboutUs.pageContent)
  const [editing, setEditing] = useState(() => !overview)
  const [showPreview, setShowPreview] = useState(false)

  const { getToken } = useAuth()
  const { updateAboutUs } = useAboutUsStore()
  const coverInputRef = useRef<HTMLInputElement>(null)
  const [coverUploading, setCoverUploading] = useState(false)

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverUploading(true)
    try {
      const url = await uploadFile(file, getToken)
      await updateAboutUs(aboutUs.id, { coverImageUrl: url })
    } catch { /* TODO: toast */ } finally {
      setCoverUploading(false)
      if (coverInputRef.current) coverInputRef.current.value = ''
    }
  }

  return (
    <>
      <S.AreaPageViewLayout>
        {/* ── Col 1: Cover ─────────────── */}
        <S.PageViewCover $url={aboutUs.coverImageUrl ?? undefined}>
          <S.CoverUploadBtn htmlFor="aboutus-cover-upload" title="Change cover photo">
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
            id="aboutus-cover-upload"
            ref={coverInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleCoverUpload}
          />
          <S.PageViewCoverContent>
            <S.PageViewCoverTitle>{aboutUs.name}</S.PageViewCoverTitle>
          </S.PageViewCoverContent>
        </S.PageViewCover>

        {/* ── Col 2: Content ──────────── */}
        <S.PageViewSections>
          <S.PageViewSectionsHeader>
            <S.PreviewBtn onClick={() => setShowPreview(true)}>Preview</S.PreviewBtn>
            {editing ? (
              overview && (
                <S.EditContentBtn onClick={() => setEditing(false)}>← View page</S.EditContentBtn>
              )
            ) : (
              <S.EditContentBtn onClick={() => setEditing(true)}>Edit</S.EditContentBtn>
            )}
          </S.PageViewSectionsHeader>

          {editing ? (
            <AboutUsRichContentTab aboutUs={aboutUs} onSaved={() => setEditing(false)} />
          ) : (
            overview ? (
              <OverviewView section={overview} />
            ) : (
              <S.EmptyContent>
                No content yet.{' '}
                <button
                  style={{ background: 'none', border: 'none', color: 'var(--terra)', cursor: 'pointer', fontSize: 13, textDecoration: 'underline' }}
                  onClick={() => setEditing(true)}
                >
                  Add content
                </button>
              </S.EmptyContent>
            )
          )}
        </S.PageViewSections>
      </S.AreaPageViewLayout>

      {showPreview && (
        <PreviewModal aboutUs={aboutUs} overview={overview} onClose={() => setShowPreview(false)} />
      )}
    </>
  )
}
