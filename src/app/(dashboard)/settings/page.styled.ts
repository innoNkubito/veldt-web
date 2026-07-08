import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const PageRoot = styled.div`
  max-width: 680px;
  padding: 40px 32px;
`

export const PageTitle = styled.h1`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 26px;
  font-weight: 500;
  color: ${T.text};
  margin: 0 0 32px;
`

export const Section = styled.div`
  margin-bottom: 36px;
`

export const SectionLabel = styled.div`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${T.muted};
  margin-bottom: 14px;
`

export const Card = styled.div`
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 12px;
  overflow: hidden;
`

export const CardRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid ${T.border};

  &:last-child {
    border-bottom: none;
  }
`

export const CardRowLabel = styled.div`
  font-size: 12px;
  color: ${T.muted};
  margin-bottom: 2px;
`

export const CardRowValue = styled.div`
  font-size: 13.5px;
  color: ${T.text};
  font-weight: 500;
`

export const RoleBadge = styled.span`
  font-size: 11px;
  font-weight: 600;
  background: ${T.dim};
  color: ${T.terra};
  padding: 3px 9px;
  border-radius: 5px;
  letter-spacing: 0.05em;
`

export const ClerkWrap = styled.div`
  /* Clerk's UserProfile component */
  .cl-rootBox {
    width: 100%;
  }
  .cl-card {
    border: 1px solid ${T.border} !important;
    box-shadow: none !important;
    border-radius: 12px !important;
  }
`
