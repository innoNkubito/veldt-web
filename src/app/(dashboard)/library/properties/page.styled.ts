import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const PageRoot = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding: 2rem;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`

export const TitleGroup = styled.div``

export const PageTitle = styled.h1`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 500;
  color: ${T.text};
  margin: 0 0 4px;
`

export const PageSubtitle = styled.div`
  font-size: 12px;
  color: ${T.muted};
`

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

export const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1px solid ${T.border};
  border-radius: 7px;
  background: ${T.card};
  color: ${T.text};
  font-size: 13px;
  font-family: 'DM Sans', sans-serif;
  width: 220px;
  outline: none;
  transition: border-color 0.15s;

  &::placeholder { color: ${T.dim}; }
  &:focus { border-color: ${T.terra}; }
`

export const CreateButton = styled.button`
  padding: 8px 16px;
  background: ${T.terra};
  color: #fff;
  border: none;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: opacity 0.15s;

  &:hover { opacity: 0.88; }
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

export const Thead = styled.thead`
  border-bottom: 1px solid ${T.border};
`

export const Th = styled.th`
  text-align: left;
  padding: 10px 12px;
  font-size: 11px;
  font-weight: 700;
  color: ${T.muted};
  text-transform: uppercase;
  letter-spacing: 0.06em;
`

export const Tbody = styled.tbody``

export const Tr = styled.tr`
  border-bottom: 1px solid ${T.border};
  cursor: pointer;
  transition: background 0.1s;

  &:hover { background: ${T.dim}; }
  &:last-child { border-bottom: none; }
`

export const Td = styled.td`
  padding: 12px;
  font-size: 13px;
  color: ${T.text};
  vertical-align: middle;
`

export const PropertyName = styled.div`
  font-weight: 600;
  color: ${T.text};
`

export const AreaSub = styled.div`
  font-size: 11px;
  color: ${T.muted};
  margin-top: 2px;
`

export const TagChip = styled.span`
  display: inline-block;
  padding: 2px 8px;
  background: ${T.tealLt};
  color: ${T.teal};
  border-radius: 20px;
  font-size: 11px;
  font-weight: 500;
  margin-right: 4px;
`

export const EmptyState = styled.div`
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

// ── Create modal ───────────────────────────────────────────────

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`

export const ModalCard = styled.div`
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 12px;
  padding: 28px 32px;
  width: 420px;
  max-width: 95vw;
`

export const ModalTitle = styled.div`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 18px;
  font-weight: 500;
  color: ${T.text};
  margin-bottom: 6px;
`

export const ModalSubtitle = styled.div`
  font-size: 12px;
  color: ${T.muted};
  margin-bottom: 20px;
`

export const ModalLabel = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: ${T.sub};
  margin-bottom: 5px;
`

export const ModalInput = styled.input`
  width: 100%;
  padding: 9px 12px;
  border: 1px solid ${T.border};
  border-radius: 7px;
  background: ${T.bg};
  color: ${T.text};
  font-size: 13px;
  font-family: 'DM Sans', sans-serif;
  outline: none;
  box-sizing: border-box;

  &:focus { border-color: ${T.terra}; }
`

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
`

export const CancelButton = styled.button`
  padding: 8px 16px;
  background: none;
  border: 1px solid ${T.border};
  border-radius: 7px;
  color: ${T.sub};
  font-size: 13px;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
`
