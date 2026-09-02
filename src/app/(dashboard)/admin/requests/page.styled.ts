import styled from '@emotion/styled'
import { T } from '@/lib/theme'

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

export const StaffBadge = styled.span`
  display: inline-block;
  padding: 3px 10px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background: #efe3f5;
  color: #6b3f86;
  border: 1px solid #ddc9e8;
  margin-left: 10px;
  vertical-align: middle;
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

export const Th = styled.th<{ $right?: boolean }>`
  text-align: ${({ $right }) => ($right ? 'right' : 'left')};
  padding: 12px 16px;
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${T.muted};
  border-bottom: 1px solid ${T.border};
  white-space: nowrap;
`

export const Tr = styled.tr`
  cursor: pointer;
  transition: background 0.12s;
  &:hover { background: ${T.bg}; }
`

export const Td = styled.td<{ $muted?: boolean; $right?: boolean }>`
  padding: 13px 16px;
  font-size: 13px;
  color: ${({ $muted }) => ($muted ? T.muted : T.text)};
  border-bottom: 1px solid ${T.border};
  text-align: ${({ $right }) => ($right ? 'right' : 'left')};
`

export const CompanyName = styled.div`
  font-weight: 500;
  color: ${T.text};
`

export const ContactLine = styled.div`
  font-size: 11.5px;
  color: ${T.muted};
  margin-top: 2px;
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

export const DeniedState = styled.div`
  padding: 64px 24px;
  text-align: center;
  color: ${T.muted};
  font-size: 13.5px;
  line-height: 1.7;
`

// ── Drawer ────────────────────────────────────────────────────

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(42, 31, 20, 0.4);
  z-index: 100;
  display: flex;
  justify-content: flex-end;
`

export const Drawer = styled.div`
  width: 580px;
  max-width: 100%;
  height: 100%;
  background: ${T.card};
  border-left: 1px solid ${T.border};
  overflow-y: auto;
  padding: 28px 32px 48px;
  box-shadow: -8px 0 32px rgba(0, 0, 0, 0.1);
`

export const DrawerHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`

export const DrawerTitle = styled.div`
  font-family: var(--font-playfair);
  font-size: 22px;
  font-weight: 500;
  color: ${T.text};
`

export const DrawerMeta = styled.div`
  font-size: 12.5px;
  color: ${T.muted};
  margin-top: 4px;
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

export const Section = styled.div`
  margin-top: 24px;
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

export const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 7px 0;
  font-size: 13px;
  color: ${T.sub};
`

export const DetailValue = styled.div`
  color: ${T.text};
  text-align: right;
  word-break: break-word;
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

// ── Pipeline ──────────────────────────────────────────────────

export const PipelineRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

export const PipelineStep = styled.button<{ $state: 'done' | 'current' | 'todo' }>`
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: ${({ $state }) => ($state === 'current' ? 600 : 400)};
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  border: 1.5px solid
    ${({ $state }) =>
      $state === 'current' ? T.terra : $state === 'done' ? T.sage : T.border};
  background: ${({ $state }) =>
    $state === 'current' ? T.terraLt : $state === 'done' ? '#e5efe4' : T.card};
  color: ${({ $state }) =>
    $state === 'current' ? T.terra : $state === 'done' ? '#3d6b39' : T.sub};
`

// ── Fields ────────────────────────────────────────────────────

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`

export const FullRow = styled.div`
  grid-column: 1 / -1;
`

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const Label = styled.label`
  font-size: 11px;
  font-weight: 600;
  color: ${T.sub};
  text-transform: uppercase;
  letter-spacing: 0.8px;
`

export const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border-radius: 7px;
  border: 1px solid ${T.border};
  font-size: 13px;
  color: ${T.text};
  background: ${T.card};
  outline: none;
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;

  &:focus { border-color: ${T.terra}; }
`

export const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border-radius: 7px;
  border: 1px solid ${T.border};
  font-size: 13px;
  color: ${T.text};
  background: ${T.card};
  outline: none;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;

  &:focus { border-color: ${T.terra}; }
`

export const Textarea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border-radius: 7px;
  border: 1px solid ${T.border};
  font-size: 13px;
  color: ${T.text};
  background: ${T.card};
  outline: none;
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
  resize: vertical;
  min-height: 70px;

  &:focus { border-color: ${T.terra}; }
`

export const Hint = styled.div`
  font-size: 11.5px;
  color: ${T.muted};
  line-height: 1.5;
  margin-top: 8px;
`

export const Callout = styled.div`
  padding: 12px 14px;
  border-radius: 8px;
  background: #e5efe4;
  border: 1px solid #c3ddc0;
  color: #3d6b39;
  font-size: 12.5px;
  line-height: 1.55;
`

// ── Actions ───────────────────────────────────────────────────

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid ${T.border};
`

export const PrimaryButton = styled.button<{ $disabled?: boolean }>`
  padding: 11px 22px;
  border-radius: 8px;
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
