import styled from '@emotion/styled'
import { T } from '@/lib/theme'

/** A light pill so dark and light logos both read over a photo. */
const pill = `
  display: inline-flex;
  align-items: center;
  background: color-mix(in srgb, ${T.card} 88%, transparent);
  border-radius: 999px;
`

export const Cover = styled.div`
  position: absolute;
  top: 24px;
  left: 32px;
  z-index: 2;
  ${pill}
  gap: 10px;
  padding: 6px 14px 6px 8px;
  max-width: calc(100% - 64px);
  pointer-events: none;

  @media (max-width: 900px) {
    top: 16px;
    left: 16px;
    max-width: calc(100% - 32px);
  }
`

export const Inline = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
`

export const Photo = styled.div`
  position: absolute;
  /* Top corner: slider dots sit at the bottom */
  top: 10px;
  right: 10px;
  z-index: 2;
  ${pill}
  gap: 6px;
  padding: 3px 9px 3px 5px;
  opacity: 0.9;
  pointer-events: none;
  user-select: none;
`

export const Label = styled.span`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${T.muted};
  white-space: nowrap;
`

export const Name = styled.span<{ $small?: boolean }>`
  font-size: ${(p) => (p.$small ? '10.5px' : '13px')};
  font-weight: 600;
  color: ${T.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const Logo = styled.img<{ $height: number }>`
  height: ${(p) => p.$height}px;
  max-width: ${(p) => p.$height * 4}px;
  object-fit: contain;
  display: block;
`
