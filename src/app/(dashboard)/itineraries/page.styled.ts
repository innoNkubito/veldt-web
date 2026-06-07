import styled from '@emotion/styled'
import { T } from '@/lib/theme'

// ── Back link ─────────────────────────────────────────────────

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
  margin-bottom: 10px;
  transition: color 0.12s;

  &:hover { color: ${T.terra}; }
`

// ── Page header ───────────────────────────────────────────────

export const PageHeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
`

export const PageTitle = styled.div`
  font-family: var(--font-playfair);
  font-size: 28px;
  font-weight: 500;
  color: ${T.text};
  line-height: 1.1;
`

export const PageSubtitle = styled.div`
  font-size: 12.5px;
  color: ${T.muted};
  margin-top: 6px;
`

export const HeaderControls = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

export const SearchWrapper = styled.div`
  position: relative;
`

export const SearchInput = styled.input`
  padding: 9px 13px 9px 34px;
  border-radius: 7px;
  border: 1px solid ${T.border};
  font-size: 13px;
  color: ${T.text};
  background: ${T.card};
  outline: none;
  width: 220px;
  font-family: 'DM Sans', sans-serif;
`

export const SearchIconWrap = styled.svg`
  position: absolute;
  left: 11px;
  top: 50%;
  transform: translateY(-50%);
`

export const CreateButton = styled.button`
  padding: 9px 18px;
  border-radius: 7px;
  border: none;
  background: ${T.terra};
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  display: flex;
  align-items: center;
  gap: 6px;
`

export const CreateButtonPlus = styled.span`
  font-size: 16px;
  line-height: 1;
  margin-top: -1px;
`

// ── Status tabs ───────────────────────────────────────────────

export const TabBar = styled.div`
  display: flex;
  border-bottom: 1px solid ${T.border};
  gap: 0;
  margin-bottom: 20px;
`

export const Tab = styled.div<{ $active: boolean }>`
  padding: 10px 18px;
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ $active }) => ($active ? T.terra : T.sub)};
  border-bottom: 2px solid ${({ $active }) => ($active ? T.terra : 'transparent')};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 7px;
  transition: color 0.12s;
  user-select: none;
`

export const TabCount = styled.span<{ $active: boolean }>`
  font-size: 10px;
  font-weight: 700;
  background: ${({ $active }) => ($active ? T.terraLt : T.dim)};
  color: ${({ $active }) => ($active ? T.terra : T.muted)};
  padding: 1px 6px;
  border-radius: 10px;
`

// ── Table ─────────────────────────────────────────────────────

const tableCols = '2.5fr 1.2fr 1fr 1fr 120px 100px'

export const TableWrapper = styled.div`
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 10px;
  overflow: hidden;
`

export const TableHead = styled.div`
  display: grid;
  grid-template-columns: ${tableCols};
  gap: 12px;
  padding: 0 24px;
  border-bottom: 1px solid ${T.border};
  background: ${T.cardAlt};
`

export const TableHeadCell = styled.div<{ $sortable?: boolean }>`
  font-size: 10px;
  font-weight: 700;
  color: ${T.muted};
  text-transform: uppercase;
  letter-spacing: 1.5px;
  padding: 11px 0 10px;
  cursor: ${({ $sortable }) => ($sortable ? 'pointer' : 'default')};
  user-select: none;
  display: flex;
  align-items: center;
  &:hover { color: ${({ $sortable }) => ($sortable ? T.sub : T.muted)}; }
`

export const SortIndicator = styled.span<{ $active: boolean }>`
  margin-left: 4px;
  color: ${({ $active }) => ($active ? T.terra : T.border)};
`

export const LoadingMessage = styled.div`
  padding: 48px;
  text-align: center;
  color: ${T.muted};
  font-size: 13px;
`

export const ErrorMessage = styled.div`
  padding: 32px;
  text-align: center;
  color: #dc2626;
  font-size: 13px;
`

export const TableRow = styled.div<{ $hovered: boolean; $last: boolean }>`
  display: grid;
  grid-template-columns: ${tableCols};
  gap: 12px;
  padding: 0 24px;
  border-bottom: ${({ $last }) => ($last ? 'none' : `1px solid ${T.border}`)};
  align-items: center;
  background: ${({ $hovered }) => ($hovered ? T.dim : 'transparent')};
  transition: background 0.12s;
  cursor: pointer;
`

export const RowNameCell = styled.div`
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const RowTitle = styled.div<{ $hovered: boolean }>`
  font-size: 13px;
  font-weight: 500;
  color: ${({ $hovered }) => ($hovered ? T.terra : T.text)};
  transition: color 0.12s;
`

export const RowSubtext = styled.div`
  font-size: 11.5px;
  color: ${T.muted};
`

export const RowCell = styled.div<{ $variant?: 'muted' }>`
  font-size: ${({ $variant }) => ($variant === 'muted' ? '12px' : '12.5px')};
  color: ${({ $variant }) => ($variant === 'muted' ? T.muted : T.sub)};
`

export const RowActionsCell = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: flex-end;
`

export const ViewCountSpan = styled.span`
  font-size: 11px;
  color: ${T.muted};
  display: flex;
  align-items: center;
  gap: 3px;
  margin-right: 4px;
`

export const OpenButton = styled.button`
  padding: 5px 13px;
  border-radius: 6px;
  border: 1px solid ${T.border};
  background: transparent;
  font-size: 12px;
  color: ${T.sub};
  cursor: pointer;
  font-weight: 500;
  font-family: 'DM Sans', sans-serif;
  white-space: nowrap;
  transition: background 0.12s, border-color 0.12s, color 0.12s;

  &:hover {
    background: ${T.terra};
    border-color: ${T.terra};
    color: #fff;
  }
`
