import styled from '@emotion/styled'
import { T } from '@/lib/theme'

/**
 * Print-only. `position: fixed` elements repeat on every printed page, so the
 * stamp and footer land on each one. Real text rather than a background image:
 * browsers drop backgrounds unless "Background graphics" is ticked.
 */
const printOnly = `
  display: none;

  @media print {
    display: block;
  }
`

export const Stamp = styled.div`
  ${printOnly}
  position: fixed;
  inset: 0;
  z-index: 9998;
  overflow: hidden;
  pointer-events: none;

  @media print {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-content: space-around;
    justify-items: center;
  }
`

export const StampText = styled.span`
  font-family: 'DM Sans', sans-serif;
  font-size: 26px;
  font-weight: 700;
  color: ${T.text};
  opacity: 0.06;
  transform: rotate(-30deg);
  white-space: nowrap;
  padding: 48px 0;
`

export const Footer = styled.div`
  ${printOnly}
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: ${T.card};
  border-top: 1px solid ${T.border};
  padding: 6px 0 0;

  @media print {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
`

export const FooterLogo = styled.img`
  height: 14px;
  max-width: 64px;
  object-fit: contain;
`

export const FooterText = styled.span`
  font-family: 'DM Sans', sans-serif;
  font-size: 9px;
  color: ${T.sub};
  letter-spacing: 0.02em;
`
