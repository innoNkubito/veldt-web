import styled from '@emotion/styled'
import { T } from '@/lib/theme'

// ── Page chrome ────────────────────────────────────────────────

export const PageRoot = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding: 2rem;
`

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 24px;
  border-bottom: 1px solid ${T.border};
`

export const HeaderLeft = styled.div`
  flex: 1;
  min-width: 0;
`

export const BackLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: ${T.muted};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-family: 'DM Sans', sans-serif;
  margin-bottom: 12px;
  transition: color 0.12s;

  &:hover { color: ${T.terra}; }
`

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`

export const PageTitle = styled.h1`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 26px;
  font-weight: 500;
  color: ${T.text};
  margin: 0;
  line-height: 1.2;
`

export const HeaderMeta = styled.div`
  margin-top: 8px;
  font-size: 12px;
  color: ${T.muted};
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`

export const MetaDot = styled.span`
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: ${T.muted};
  display: inline-block;
`

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`

export const SaveIndicator = styled.span`
  font-size: 11px;
  color: ${T.muted};
`

// ── Tab bar ────────────────────────────────────────────────────

export const TabBar = styled.div`
  display: flex;
  gap: 2px;
  border-bottom: 1px solid ${T.border};
  margin-top: 24px;
  margin-bottom: 28px;
`

export const Tab = styled.button<{ $active: boolean }>`
  padding: 10px 18px;
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ $active }) => ($active ? T.text : T.muted)};
  background: none;
  border: none;
  border-bottom: 2px solid ${({ $active }) => ($active ? T.terra : 'transparent')};
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  margin-bottom: -1px;
  transition: color 0.15s;

  &:hover { color: ${T.text}; }
`

// ── Error / loading states ─────────────────────────────────────

export const CenteredState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  gap: 10px;
  color: ${T.muted};
  font-size: 13px;
  text-align: center;
`

export const ErrorBanner = styled.div`
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 13px;
  margin-bottom: 20px;
`
