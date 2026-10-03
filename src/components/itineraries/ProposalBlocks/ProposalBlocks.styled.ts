import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const AccomPhoto = styled.div<{ $url: string }>`
  background: ${({ $url }) => `url(${$url}) center/cover no-repeat`};
  height: 100%;
`

export const AccomPhotoGrid = styled.div<{ $count: number }>`
  display: grid;
  grid-template-columns: ${({ $count }) => `repeat(${$count}, 1fr)`};
  gap: 8px;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 16/7;
`

export const AccomRoomBlock = styled.div`
  margin-bottom: 28px;
  padding-bottom: 28px;
  border-bottom: 1px solid ${T.border};
  &:last-child { border-bottom: none; padding-bottom: 0; margin-bottom: 0; }
`

export const AccomRoomDescription = styled.div`
  font-size: 13px;
  line-height: 1.7;
  color: ${T.sub};
  margin-bottom: 12px;
`

export const AccomRoomHeading = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: ${T.text};
  margin-bottom: 6px;
`

export const ContentRichText = styled.div`
  font-size: 14px;
  line-height: 1.8;
  color: ${T.sub};
  margin-bottom: 14px;

  p { margin: 0 0 12px; }
  p:last-child { margin-bottom: 0; }
  strong { font-weight: 600; color: ${T.text}; }
  em { font-style: italic; }
  ul, ol { padding-left: 20px; margin: 0 0 12px; }
  li { margin-bottom: 4px; }
  a { color: ${T.terra}; text-decoration: underline; }
  blockquote {
    border-left: 3px solid ${T.border};
    margin: 0 0 12px;
    padding-left: 14px;
    color: ${T.sub};
    font-style: italic;
  }
`

export const ContentSection = styled.div`
  margin-bottom: 44px;
  scroll-margin-top: 80px;
`

export const ContentSectionTitle = styled.div`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 22px;
  font-style: italic;
  color: ${T.text};
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${T.border};
`

export const DayRichText = styled.div`
  font-size: 14px;
  line-height: 1.8;
  color: ${T.sub};

  p { margin: 0 0 10px; }
  p:last-child { margin-bottom: 0; }
  p:empty::after { content: ''; display: inline-block; }
  strong { font-weight: 600; color: ${T.text}; }
  em { font-style: italic; }
  s { text-decoration: line-through; }
  ul, ol { padding-left: 20px; margin: 0 0 10px; }
  li { margin-bottom: 4px; }
  code {
    background: ${T.dim};
    border-radius: 3px;
    padding: 1px 5px;
    font-size: 12px;
    font-family: monospace;
  }
  blockquote {
    border-left: 3px solid ${T.border};
    margin: 0 0 10px;
    padding-left: 12px;
    color: ${T.sub};
  }

  .mention {
    display: inline-flex;
    align-items: center;
    background: ${T.terraLt};
    color: ${T.terra};
    border-radius: 4px;
    padding: 1px 7px;
    font-size: 12px;
    font-weight: 600;
    cursor: default;
    white-space: nowrap;
  }
`

export const EmptyContent = styled.div`
  font-size: 13px;
  color: ${T.muted};
  font-style: italic;
  padding: 8px 0;
`

export const FastFactGroup = styled.div`
  background: ${T.bg};
  border: 1px solid ${T.border};
  border-radius: 8px;
  padding: 14px 16px;
`

export const FastFactGroupHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 8px;
`

export const FastFactGroupIcon = styled.span`
  color: ${T.terra};
  display: flex;
  align-items: center;
  flex-shrink: 0;
`

export const FastFactGroupLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${T.text};
`

export const FastFactItem = styled.li`
  font-size: 12px;
  color: ${T.sub};
  padding: 3px 0;
  border-bottom: 1px dashed ${T.border};
  line-height: 1.45;
  &:last-child { border-bottom: none; }
`

export const FastFactItems = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

export const FastFactsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
`

export const SliderArrow = styled.button<{ $side: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  ${({ $side }) => $side}: 12px;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.4);
  color: ${T.onBrand};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  transition: background 0.15s;
  &:hover { background: rgba(0, 0, 0, 0.65); }
`

export const SliderDot = styled.button<{ $active: boolean }>`
  width: ${({ $active }) => ($active ? 20 : 6)}px;
  height: 6px;
  border-radius: 3px;
  background: ${({ $active }) => ($active ? T.card : 'rgba(255,255,255,0.5)')};
  border: none;
  cursor: pointer;
  padding: 0;
  transition: all 0.25s;
`

export const SliderDots = styled.div`
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
`

export const SliderSlide = styled.div<{ $url: string }>`
  flex: 0 0 100%;
  height: 100%;
  background: ${({ $url }) => `url(${$url}) center/cover no-repeat`};
`

export const SliderTrack = styled.div<{ $index: number }>`
  display: flex;
  height: 100%;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(${({ $index }) => -$index * 100}%);
`

export const SliderWrap = styled.div`
  position: relative;
  margin: 18px 0;
  border-radius: 10px;
  overflow: hidden;
  background: ${T.dim};
  aspect-ratio: 16/9;
`
