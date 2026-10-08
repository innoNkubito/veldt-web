'use client'

/**
 * The building blocks of a rendered proposal, shared by the public share page
 * (/view/[slug]) and the builder's Preview tab so the two cannot drift apart.
 * View only — strings and lookup tables are in .constants, logic in .utils,
 * slider state in usePhotoSlider.
 */

import React from 'react'
import * as S from './ProposalBlocks.styled'
import { toPMNode, attrString, attrNumber, headingTag, type PMNode } from '@/lib/prosemirror'
import { usePhotoSlider } from './usePhotoSlider'
import { PhotoMark } from '@/components/itineraries/OperatorMark'
import {
  FACT_ICON_SIZE,
  NO_ROOMS_MESSAGE,
  SLIDER_ARROW_POINTS,
  SLIDER_ARROW_SIZE,
} from './ProposalBlocks.constants'
import {
  factIconFor,
  hasDayContent,
  isHtml,
  roomPhotoLayout,
  sectionTitle,
  textLines,
  visibleFactGroups,
} from './ProposalBlocks.utils'
import type {
  AccommodationViewProps,
  ContentSectionsProps,
  CostsRichProps,
  DayRichTextProps,
  FastFactsViewProps,
  PhotoSliderProps,
  RichHtmlProps,
  TextImageViewProps,
} from './ProposalBlocks.types'

function SliderArrowIcon({ side }: { side: 'left' | 'right' }) {
  return (
    <svg
      width={SLIDER_ARROW_SIZE}
      height={SLIDER_ARROW_SIZE}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points={SLIDER_ARROW_POINTS[side]} />
    </svg>
  )
}

export function PhotoSlider({ images }: PhotoSliderProps) {
  const { index, next, previous, goTo } = usePhotoSlider(images.length)

  if (images.length === 0) return null
  if (images.length === 1) {
    return (
      <S.SliderWrap>
        <S.SliderTrack $index={0}>
          <S.SliderSlide $url={images[0]} />
        </S.SliderTrack>
        <PhotoMark />
      </S.SliderWrap>
    )
  }
  return (
    <S.SliderWrap>
      <S.SliderTrack $index={index}>
        {images.map((url, i) => <S.SliderSlide key={i} $url={url} />)}
      </S.SliderTrack>
      <PhotoMark />
      <S.SliderArrow $side="left" onClick={previous}>
        <SliderArrowIcon side="left" />
      </S.SliderArrow>
      <S.SliderArrow $side="right" onClick={next}>
        <SliderArrowIcon side="right" />
      </S.SliderArrow>
      <S.SliderDots>
        {images.map((_, i) => (
          <S.SliderDot key={i} $active={i === index} onClick={() => goTo(i)} />
        ))}
      </S.SliderDots>
    </S.SliderWrap>
  )
}

/** Rich text — HTML from the editor, or plain-text lines as paragraphs. */
export function RichHtml({ html }: RichHtmlProps) {
  if (!html) return null
  if (isHtml(html)) return <S.ContentRichText dangerouslySetInnerHTML={{ __html: html }} />
  return (
    <S.ContentRichText>
      {textLines(html).map((line, i) => <p key={i}>{line}</p>)}
    </S.ContentRichText>
  )
}

export function TextImageView({ section, pageId, contentType }: TextImageViewProps) {
  return (
    <S.ContentSection id={`${pageId}-${section.type}`}>
      <S.ContentSectionTitle>{sectionTitle(section.type, contentType)}</S.ContentSectionTitle>
      {section.text1 && <RichHtml html={section.text1} />}
      {section.images.length > 0 && <PhotoSlider images={section.images} />}
      {section.text2 && <RichHtml html={section.text2} />}
    </S.ContentSection>
  )
}

export function FastFactsView({ section, pageId }: FastFactsViewProps) {
  const groups = visibleFactGroups(section)
  if (groups.length === 0) return null
  return (
    <S.ContentSection id={`${pageId}-fastFacts`}>
      <S.ContentSectionTitle>{sectionTitle('fastFacts')}</S.ContentSectionTitle>
      <S.FastFactsGrid>
        {groups.map((group, i) => {
          const Icon = factIconFor(group.label)
          return (
            <S.FastFactGroup key={i}>
              <S.FastFactGroupHeader>
                <S.FastFactGroupIcon><Icon size={FACT_ICON_SIZE} /></S.FastFactGroupIcon>
                {group.label && <S.FastFactGroupLabel>{group.label}</S.FastFactGroupLabel>}
              </S.FastFactGroupHeader>
              <S.FastFactItems>
                {group.items.filter(Boolean).map((item, j) => (
                  <S.FastFactItem key={j}>{item}</S.FastFactItem>
                ))}
              </S.FastFactItems>
            </S.FastFactGroup>
          )
        })}
      </S.FastFactsGrid>
    </S.ContentSection>
  )
}

export function AccommodationView({ section, rooms, pageId }: AccommodationViewProps) {
  return (
    <S.ContentSection id={`${pageId}-accommodation`}>
      <S.ContentSectionTitle>{sectionTitle('accommodation')}</S.ContentSectionTitle>
      {section.intro && <RichHtml html={section.intro} />}
      {rooms.length === 0 ? (
        <S.EmptyContent>{NO_ROOMS_MESSAGE}</S.EmptyContent>
      ) : (
        rooms.map((room) => {
          const { useSlider, photos } = roomPhotoLayout(room.photos)
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
                  <S.AccomPhotoGrid $count={photos.length}>
                    {photos.map((url, i) => <S.AccomPhoto key={i} $url={url} />)}
                    <PhotoMark />
                  </S.AccomPhotoGrid>
                )
              )}
            </S.AccomRoomBlock>
          )
        })
      )}
    </S.ContentSection>
  )
}

export function ContentSections({ content, rooms, pageId, contentType }: ContentSectionsProps) {
  return (
    <>
      {content.sections.map((section, i) => {
        if (section.type === 'fastFacts') {
          return <FastFactsView key={i} section={section} pageId={pageId} />
        }
        if (section.type === 'accommodation') {
          return <AccommodationView key={i} section={section} rooms={rooms} pageId={pageId} />
        }
        if (section.type === 'gallery') {
          if (section.images.length === 0) return null
          return (
            <S.ContentSection key={i} id={`${pageId}-gallery`}>
              <S.ContentSectionTitle>{sectionTitle('gallery')}</S.ContentSectionTitle>
              <PhotoSlider images={section.images} />
            </S.ContentSection>
          )
        }
        return <TextImageView key={i} section={section} pageId={pageId} contentType={contentType} />
      })}
    </>
  )
}

/** ProseMirror JSON → React, for a day's rich text. */
export function renderNode(node: PMNode, key: number): React.ReactNode {
  if (node.type === 'text') {
    let el: React.ReactNode = node.text ?? ''
    for (const mark of node.marks ?? []) {
      if (mark.type === 'bold') el = <strong key={key}>{el}</strong>
      else if (mark.type === 'italic') el = <em key={key}>{el}</em>
      else if (mark.type === 'strike') el = <s key={key}>{el}</s>
      else if (mark.type === 'code') el = <code key={key}>{el}</code>
    }
    return el
  }
  if (node.type === 'mention') {
    const label = attrString(node, 'label') ?? attrString(node, 'id') ?? ''
    return <span key={key} className="mention">@{label}</span>
  }
  if (node.type === 'hardBreak') return <br key={key} />

  const children = node.content?.map((child, i) => (
    <React.Fragment key={i}>{renderNode(child, i)}</React.Fragment>
  ))

  switch (node.type) {
    case 'doc':         return <React.Fragment key={key}>{children}</React.Fragment>
    case 'paragraph':   return <p key={key}>{children ?? <br />}</p>
    case 'bulletList':  return <ul key={key}>{children}</ul>
    case 'orderedList': return <ol key={key}>{children}</ol>
    case 'listItem':    return <li key={key}>{children}</li>
    case 'blockquote':  return <blockquote key={key}>{children}</blockquote>
    case 'codeBlock':   return <pre key={key}><code>{children}</code></pre>
    case 'heading': {
      const Tag = headingTag(attrNumber(node, 'level') ?? 2)
      return <Tag key={key}>{children}</Tag>
    }
    default: return <React.Fragment key={key}>{children}</React.Fragment>
  }
}

export function DayRichText({ json }: DayRichTextProps) {
  const node = toPMNode(json)
  if (!hasDayContent(node)) return null
  return (
    <S.DayRichText>
      {node.content.map((child, i) => (
        <React.Fragment key={i}>{renderNode(child, i)}</React.Fragment>
      ))}
    </S.DayRichText>
  )
}

/** A costs text field — rich HTML from the editor, or legacy plain text. */
export function CostsRich({ text, Comp, style }: CostsRichProps) {
  if (isHtml(text)) return <Comp style={style} dangerouslySetInnerHTML={{ __html: text }} />
  return <Comp style={style}>{text}</Comp>
}
