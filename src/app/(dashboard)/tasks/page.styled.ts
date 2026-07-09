import styled from '@emotion/styled'
import { T } from '@/lib/theme'

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

export const HeaderControls = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

export const MoreOptionsButton = styled.button`
  padding: 9px 18px;
  border-radius: 20px;
  border: 1px solid ${T.border};
  background: ${T.card};
  font-size: 13px;
  color: ${T.text};
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  display: flex;
  align-items: center;
  gap: 8px;
`

export const CreateButton = styled.button`
  padding: 9px 18px;
  border-radius: 20px;
  border: none;
  background: #1a7a3a;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover { background: #166531; }
`

export const CreateButtonPlus = styled.span`
  font-size: 16px;
  line-height: 1;
  margin-top: -1px;
`

// ── Filter tabs ───────────────────────────────────────────────

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
  color: ${({ $active }) => ($active ? T.text : T.sub)};
  border-bottom: 2px solid ${({ $active }) => ($active ? T.text : 'transparent')};
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
  background: ${({ $active }) => ($active ? T.dim : T.dim)};
  color: ${T.muted};
  padding: 1px 6px;
  border-radius: 4px;
  border: 1px solid ${T.border};
`

// ── Table ─────────────────────────────────────────────────────

const tableCols = '24px 2fr 1.6fr 1fr 1.2fr 1fr 1fr 110px'

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
  align-items: center;
`

export const TableHeadCell = styled.div<{ $sortable?: boolean; $align?: 'right' }>`
  font-size: 11px;
  font-weight: 500;
  color: ${T.sub};
  padding: 13px 0 12px;
  cursor: ${({ $sortable }) => ($sortable ? 'pointer' : 'default')};
  user-select: none;
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: ${({ $align }) => ($align === 'right' ? 'flex-end' : 'flex-start')};
  &:hover { color: ${({ $sortable }) => ($sortable ? T.text : T.sub)}; }
`

export const SortIndicator = styled.span<{ $active: boolean }>`
  color: ${({ $active }) => ($active ? T.terra : T.muted)};
  font-size: 11px;
`

export const TableRow = styled.div<{ $hovered: boolean; $last: boolean; $completed?: boolean }>`
  display: grid;
  grid-template-columns: ${tableCols};
  gap: 12px;
  padding: 0 24px;
  border-bottom: ${({ $last }) => ($last ? 'none' : `1px solid ${T.border}`)};
  align-items: center;
  background: ${({ $hovered }) => ($hovered ? T.dim : 'transparent')};
  transition: background 0.12s;
  opacity: ${({ $completed }) => ($completed ? 0.55 : 1)};
`

export const RowCheckbox = styled.input`
  width: 15px;
  height: 15px;
  accent-color: #1a7a3a;
  cursor: pointer;
`

export const RowNameCell = styled.div`
  padding: 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`

export const RowTitle = styled.div<{ $completed?: boolean }>`
  font-size: 13px;
  font-weight: 500;
  color: ${T.text};
  text-decoration: ${({ $completed }) => ($completed ? 'line-through' : 'none')};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const NoteIcon = styled.span`
  color: #1a7a3a;
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  cursor: default;
`

export const RowCell = styled.div<{ $variant?: 'muted' }>`
  font-size: ${({ $variant }) => ($variant === 'muted' ? '12px' : '12.5px')};
  color: ${({ $variant }) => ($variant === 'muted' ? T.muted : T.sub)};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const TypeBadge = styled.span<{ $bg: string; $fg: string; $border: string }>`
  display: inline-flex;
  align-items: center;
  padding: 3px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  background: ${({ $bg }) => $bg};
  color: ${({ $fg }) => $fg};
  border: 1px solid ${({ $border }) => $border};
  white-space: nowrap;
`

export const TagChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`

export const TagChip = styled.span`
  display: inline-flex;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 10.5px;
  font-weight: 500;
  background: ${T.dim};
  color: ${T.sub};
  border: 1px solid ${T.border};
`

export const RowActionsCell = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-end;
`

export const EditButton = styled.button`
  padding: 5px 14px;
  border-radius: 14px;
  border: 1px solid ${T.border};
  background: transparent;
  font-size: 12px;
  color: ${T.text};
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

export const DeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${T.sub};
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: 5px;
  transition: color 0.12s, background 0.12s;

  &:hover {
    color: #dc2626;
    background: #fbe9e9;
  }
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

export const EmptyMessage = styled.div`
  padding: 48px;
  text-align: center;
  color: ${T.muted};
  font-size: 13px;
  font-style: italic;
`

// ── Pagination footer ─────────────────────────────────────────

export const FooterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  border-top: 1px solid ${T.border};
  font-size: 12.5px;
  color: ${T.sub};
`

export const PageSizeSelect = styled.select`
  padding: 5px 8px;
  border-radius: 6px;
  border: 1px solid ${T.border};
  font-size: 12px;
  color: ${T.text};
  background: ${T.card};
  font-family: 'DM Sans', sans-serif;
  outline: none;
  cursor: pointer;
`
