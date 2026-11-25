import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const PageRoot = styled.main`
  min-height: 100vh;
  background: ${T.bg};
  padding: 32px 20px 60px;

  @media print {
    background: ${T.white};
    padding: 0;
  }
`

export const Column = styled.div`
  max-width: 820px;
  margin: 0 auto;
`

/** Status and actions above the invoice — not printed. */
export const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 10px;
  padding: 14px 18px;
  margin-bottom: 16px;

  @media print {
    display: none;
  }
`

export const BarText = styled.div`
  font-size: 13.5px;
  color: ${T.text};

  strong {
    font-weight: 700;
  }
`

export const BarSub = styled.div<{ $tone?: 'danger' | 'success' | 'muted' }>`
  font-size: 12.5px;
  margin-top: 2px;
  color: ${(p) => (p.$tone === 'danger' ? T.dangerDk : p.$tone === 'success' ? T.successDk : T.sub)};
`

export const PrintButton = styled.button`
  padding: 8px 16px;
  border-radius: 7px;
  border: 1px solid ${T.border};
  background: ${T.card};
  color: ${T.text};
  font: inherit;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: ${T.dim};
  }
`

export const Message = styled.div`
  max-width: 460px;
  margin: 80px auto 0;
  text-align: center;
  color: ${T.sub};
  font-size: 14px;
  line-height: 1.6;

  h1 {
    font-family: var(--font-playfair);
    font-weight: 500;
    font-size: 24px;
    color: ${T.text};
    margin: 0 0 8px;
  }
`

export const Footer = styled.p`
  font-size: 11.5px;
  color: ${T.muted};
  text-align: center;
  margin-top: 18px;

  @media print {
    display: none;
  }
`
