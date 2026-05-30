import styled from "@emotion/styled";
import { T } from "@/lib/theme";

/* ── Status badge ─────────────────────────────────────────── */

export const StatusBadgeSpan = styled.span<{ $bg: string; $color: string }>`
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  white-space: nowrap;
`;

/* ── Modal ────────────────────────────────────────────────── */

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(42, 31, 20, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

export const ModalCard = styled.div`
  width: 480px;
  background: ${T.card};
  border-radius: 12px;
  padding: 32px 36px;
  border: 1px solid ${T.border};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
`;

export const ModalHeader = styled.div`
  margin-bottom: 24px;
`;

export const ModalTitle = styled.div`
  font-family: var(--font-playfair);
  font-size: 22px;
  font-weight: 500;
  color: ${T.text};
  margin-bottom: 4px;
`;

export const ModalSubtitle = styled.div`
  font-size: 12.5px;
  color: ${T.muted};
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

export const FieldLabel = styled.label`
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: ${T.sub};
  margin-bottom: 5px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
`;

export const FieldInput = styled.input`
  width: 100%;
  padding: 10px 13px;
  border-radius: 7px;
  border: 1px solid ${T.border};
  font-size: 13px;
  color: ${T.text};
  background: ${T.card};
  outline: none;
  font-family: "DM Sans", sans-serif;
  box-sizing: border-box;
`;

export const ModalActions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

export const CancelButton = styled.button`
  padding: 9px 20px;
  border-radius: 7px;
  border: 1px solid ${T.border};
  background: transparent;
  font-size: 13px;
  color: ${T.sub};
  cursor: pointer;
  font-family: "DM Sans", sans-serif;
`;

export const PrimaryButton = styled.button<{ $disabled?: boolean }>`
  padding: 9px 22px;
  border-radius: 7px;
  border: none;
  background: ${({ $disabled }) => ($disabled ? T.muted : T.terra)};
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  font-family: "DM Sans", sans-serif;
`;

/* ── Row menu ─────────────────────────────────────────────── */

export const MenuWrapper = styled.div`
  position: relative;
`;

export const MenuTrigger = styled.button<{ $open: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid ${T.border};
  background: ${({ $open }) => ($open ? T.dim : "transparent")};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${T.muted};
  font-size: 16px;
`;

export const MenuBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10;
`;

export const MenuDropdown = styled.div`
  position: absolute;
  right: 0;
  top: 32px;
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  z-index: 20;
  min-width: 160px;
  overflow: hidden;
`;

export const MenuItem = styled.div<{ $color?: string }>`
  padding: 10px 16px;
  font-size: 13px;
  color: ${({ $color }) => $color ?? T.sub};
  cursor: pointer;
  transition: background 0.1s;

  &:hover {
    background: ${T.dim};
  }
`;

/* ── Empty state ──────────────────────────────────────────── */

export const EmptyRoot = styled.div`
  padding: 80px 40px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

export const EmptyIconCircle = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${T.dim};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const EmptyTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${T.text};
  margin-bottom: 6px;
`;

export const EmptyText = styled.div`
  font-size: 13px;
  color: ${T.muted};
`;

export const EmptyCreateButton = styled.button`
  margin-top: 8px;
  padding: 10px 22px;
  border-radius: 7px;
  border: none;
  background: ${T.terra};
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: "DM Sans", sans-serif;
`;

/* ── Back link ────────────────────────────────────────────── */

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
`;

/* ── Page header ──────────────────────────────────────────── */

export const PageHeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const PageTitle = styled.div`
  font-family: var(--font-playfair);
  font-size: 28px;
  font-weight: 500;
  color: ${T.text};
  line-height: 1.1;
`;

export const PageSubtitle = styled.div`
  font-size: 12.5px;
  color: ${T.muted};
  margin-top: 6px;
`;

export const HeaderControls = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const SearchWrapper = styled.div`
  position: relative;
`;

export const SearchInput = styled.input`
  padding: 9px 13px 9px 34px;
  border-radius: 7px;
  border: 1px solid ${T.border};
  font-size: 13px;
  color: ${T.text};
  background: ${T.card};
  outline: none;
  width: 220px;
  font-family: "DM Sans", sans-serif;
`;

export const SearchIconWrap = styled.svg`
  position: absolute;
  left: 11px;
  top: 50%;
  transform: translateY(-50%);
`;

export const CreateButton = styled.button`
  padding: 9px 18px;
  border-radius: 7px;
  border: none;
  background: ${T.terra};
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: "DM Sans", sans-serif;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const CreateButtonPlus = styled.span`
  font-size: 16px;
  line-height: 1;
  margin-top: -1px;
`;

/* ── Status tabs ──────────────────────────────────────────── */

export const TabBar = styled.div`
  display: flex;
  border-bottom: 1px solid ${T.border};
  gap: 0;
  margin-bottom: 20px;
`;

export const Tab = styled.div<{ $active: boolean }>`
  padding: 10px 18px;
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ $active }) => ($active ? T.terra : T.sub)};
  border-bottom: 2px solid
    ${({ $active }) => ($active ? T.terra : "transparent")};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 7px;
  transition: color 0.12s;
  user-select: none;
`;

export const TabCount = styled.span<{ $active: boolean }>`
  font-size: 10px;
  font-weight: 700;
  background: ${({ $active }) => ($active ? T.terraLt : T.dim)};
  color: ${({ $active }) => ($active ? T.terra : T.muted)};
  padding: 1px 6px;
  border-radius: 10px;
`;

/* ── Table ────────────────────────────────────────────────── */

const tableCols = "2.5fr 1.2fr 1fr 1fr 120px 100px";

export const TableWrapper = styled.div`
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 10px;
  overflow: hidden;
`;

export const TableHead = styled.div`
  display: grid;
  grid-template-columns: ${tableCols};
  gap: 12px;
  padding: 0 24px;
  border-bottom: 1px solid ${T.border};
  background: ${T.cardAlt};
`;

export const TableHeadCell = styled.div<{ $sortable?: boolean }>`
  font-size: 10px;
  font-weight: 700;
  color: ${T.muted};
  text-transform: uppercase;
  letter-spacing: 1.5px;
  padding: 11px 0 10px;
  cursor: ${({ $sortable }) => ($sortable ? "pointer" : "default")};
  user-select: none;
  display: flex;
  align-items: center;
  &:hover { color: ${({ $sortable }) => ($sortable ? T.sub : T.muted)}; }
`;

export const SortIndicator = styled.span<{ $active: boolean }>`
  margin-left: 4px;
  color: ${({ $active }) => ($active ? T.terra : T.border)};
`;

export const LoadingMessage = styled.div`
  padding: 48px;
  text-align: center;
  color: ${T.muted};
  font-size: 13px;
`;

export const ErrorMessage = styled.div`
  padding: 32px;
  text-align: center;
  color: #dc2626;
  font-size: 13px;
`;

export const TableRow = styled.div<{ $hovered: boolean; $last: boolean }>`
  display: grid;
  grid-template-columns: ${tableCols};
  gap: 12px;
  padding: 0 24px;
  border-bottom: ${({ $last }) => ($last ? "none" : `1px solid ${T.border}`)};
  align-items: center;
  background: ${({ $hovered }) => ($hovered ? T.dim : "transparent")};
  transition: background 0.12s;
  cursor: pointer;
`;

export const RowNameCell = styled.div`
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const RowTitle = styled.div<{ $hovered: boolean }>`
  font-size: 13px;
  font-weight: 500;
  color: ${({ $hovered }) => ($hovered ? T.terra : T.text)};
  transition: color 0.12s;
`;

export const RowSubtext = styled.div`
  font-size: 11.5px;
  color: ${T.muted};
`;

export const RowCell = styled.div<{ $variant?: "muted" }>`
  font-size: ${({ $variant }) => ($variant === "muted" ? "12px" : "12.5px")};
  color: ${({ $variant }) => ($variant === "muted" ? T.muted : T.sub)};
`;

export const RowActionsCell = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: flex-end;
`;

export const ViewCountSpan = styled.span`
  font-size: 11px;
  color: ${T.muted};
  display: flex;
  align-items: center;
  gap: 3px;
  margin-right: 4px;
`;

export const OpenButton = styled.button`
  padding: 5px 13px;
  border-radius: 6px;
  border: 1px solid ${T.border};
  background: transparent;
  font-size: 12px;
  color: ${T.sub};
  cursor: pointer;
  font-weight: 500;
  font-family: "DM Sans", sans-serif;
  white-space: nowrap;
  transition: background 0.12s, border-color 0.12s, color 0.12s;

  &:hover {
    background: ${T.terra};
    border-color: ${T.terra};
    color: #fff;
  }
`;
