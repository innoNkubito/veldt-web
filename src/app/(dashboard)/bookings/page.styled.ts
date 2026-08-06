import styled from '@emotion/styled'
import { T } from '@/lib/theme'

// ── Page ──────────────────────────────────────────────────────

export const PageRoot = styled.div`
  padding: 2rem;
`

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

export const SearchInput = styled.input`
  padding: 9px 13px;
  border-radius: 7px;
  border: 1px solid ${T.border};
  font-size: 13px;
  color: ${T.text};
  background: ${T.card};
  outline: none;
  width: 230px;
  font-family: 'DM Sans', sans-serif;

  &:focus { border-color: ${T.terra}; }
  &::placeholder { color: ${T.muted}; }
`

// ── Tabs ──────────────────────────────────────────────────────

export const TabBar = styled.div`
  display: flex;
  border-bottom: 1px solid ${T.border};
  margin-bottom: 18px;
  overflow-x: auto;
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
  user-select: none;
  white-space: nowrap;
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

export const TableWrapper = styled.div`
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 10px;
  overflow: hidden;
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

export const Th = styled.th<{ $sortable?: boolean; $right?: boolean }>`
  text-align: ${({ $right }) => ($right ? 'right' : 'left')};
  padding: 12px 16px;
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${T.muted};
  border-bottom: 1px solid ${T.border};
  cursor: ${({ $sortable }) => ($sortable ? 'pointer' : 'default')};
  white-space: nowrap;
  user-select: none;

  &:hover { color: ${({ $sortable }) => ($sortable ? T.text : T.muted)}; }
`

export const Tr = styled.tr`
  cursor: pointer;
  transition: background 0.12s;

  &:hover { background: ${T.bg}; }
`

export const Td = styled.td<{ $right?: boolean; $muted?: boolean }>`
  padding: 13px 16px;
  font-size: 13px;
  color: ${({ $muted }) => ($muted ? T.muted : T.text)};
  border-bottom: 1px solid ${T.border};
  text-align: ${({ $right }) => ($right ? 'right' : 'left')};
  vertical-align: middle;
`

export const ClientName = styled.div`
  font-weight: 500;
  color: ${T.text};
`

export const ClientEmail = styled.div`
  font-size: 11.5px;
  color: ${T.muted};
  margin-top: 2px;
`

export const Reference = styled.div`
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: ${T.sub};
`

export const StatusChip = styled.span<{ $color: string; $bg: string }>`
  display: inline-block;
  padding: 3px 10px;
  border-radius: 10px;
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  white-space: nowrap;
`

export const OverdueText = styled.span`
  color: #b91c1c;
  font-weight: 600;
`

// ── States ────────────────────────────────────────────────────

export const LoadingMessage = styled.div`
  padding: 48px;
  text-align: center;
  color: ${T.muted};
  font-size: 13px;
`

export const EmptyState = styled.div`
  padding: 64px 24px;
  text-align: center;
  color: ${T.muted};
  font-size: 13px;
  background: ${T.card};
  border: 1px dashed ${T.border};
  border-radius: 10px;
`

export const ErrorBanner = styled.div`
  margin-bottom: 16px;
  padding: 10px 16px;
  border-radius: 8px;
  background: #fbe9e9;
  border: 1px solid #f3c6c6;
  color: #b91c1c;
  font-size: 12.5px;
`

// ── Detail drawer ─────────────────────────────────────────────

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(42, 31, 20, 0.4);
  z-index: 100;
  display: flex;
  justify-content: flex-end;
`

export const Drawer = styled.div`
  width: 560px;
  max-width: 100%;
  height: 100%;
  background: ${T.card};
  border-left: 1px solid ${T.border};
  overflow-y: auto;
  padding: 28px 32px 40px;
  box-shadow: -8px 0 32px rgba(0, 0, 0, 0.1);
`

export const DrawerHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 4px;
`

export const DrawerTitle = styled.div`
  font-family: var(--font-playfair);
  font-size: 22px;
  font-weight: 500;
  color: ${T.text};
`

export const DrawerClose = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${T.muted};
  font-size: 18px;
  padding: 0 4px;
  line-height: 1;
  &:hover { color: ${T.text}; }
`

export const DrawerMeta = styled.div`
  font-size: 12.5px;
  color: ${T.muted};
  margin-bottom: 20px;
`

export const Section = styled.div`
  margin-bottom: 24px;
`

export const SectionTitle = styled.div`
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: ${T.muted};
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid ${T.border};
`

export const DetailRow = styled.div<{ $strong?: boolean }>`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 7px 0;
  font-size: 13px;
  color: ${({ $strong }) => ($strong ? T.text : T.sub)};
  font-weight: ${({ $strong }) => ($strong ? 600 : 400)};
`

export const NoteBox = styled.div`
  padding: 12px 14px;
  border-radius: 8px;
  background: ${T.bg};
  border: 1px solid ${T.border};
  font-size: 12.5px;
  line-height: 1.6;
  color: ${T.sub};
  white-space: pre-line;
`

// ── Installment rows ──────────────────────────────────────────

export const InstallmentRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid ${T.border};

  &:last-of-type { border-bottom: none; }
`

export const InstallmentMain = styled.div`
  flex: 1;
  min-width: 0;
`

export const InstallmentName = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: ${T.text};
`

export const InstallmentDue = styled.div`
  font-size: 11.5px;
  color: ${T.muted};
  margin-top: 3px;
`

export const InstallmentAmount = styled.div`
  font-size: 13.5px;
  font-weight: 600;
  color: ${T.text};
  white-space: nowrap;
`

export const InstallmentActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
  flex-shrink: 0;
`

export const LinkButton = styled.button<{ $danger?: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 11.5px;
  font-family: 'DM Sans', sans-serif;
  padding: 0;
  color: ${({ $danger }) => ($danger ? '#dc2626' : T.teal)};
  white-space: nowrap;
  &:hover { text-decoration: underline; }
`

// ── Drawer actions ────────────────────────────────────────────

export const DrawerActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding-top: 20px;
  border-top: 1px solid ${T.border};
`

export const PrimaryButton = styled.button<{ $disabled?: boolean }>`
  padding: 10px 20px;
  border-radius: 7px;
  border: none;
  background: ${({ $disabled }) => ($disabled ? T.muted : T.terra)};
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  font-family: 'DM Sans', sans-serif;
`

export const DangerLink = styled.button`
  margin-left: auto;
  background: none;
  border: none;
  cursor: pointer;
  color: #dc2626;
  font-size: 12.5px;
  font-family: 'DM Sans', sans-serif;
  padding: 8px 4px;
  &:hover { text-decoration: underline; }
`
