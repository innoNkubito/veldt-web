import styled from "@emotion/styled";
import { T } from "@/lib/theme";

/* ── Page shell ────────────────────────────────────────────── */

export const PageRoot = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 22px;
  min-height: 100%;
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
`;

export const Greeting = styled.div`
  font-family: var(--font-playfair);
  font-size: 30px;
  font-weight: 500;
  color: ${T.text};
  line-height: 1.1;
`;

export const SubHeader = styled.div`
  font-size: 13px;
  color: ${T.muted};
  margin-top: 6px;
`;

export const QuickActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const QuickBtn = styled.button`
  padding: 8px 14px;
  border-radius: 7px;
  border: 1px solid ${T.border};
  background: ${T.card};
  font-size: 12.5px;
  color: ${T.sub};
  cursor: pointer;
  font-weight: 500;
  font-family: 'DM Sans', sans-serif;
  transition: border-color 0.12s;
  &:hover { border-color: ${T.terra}; color: ${T.terra}; }
`;

/* ── Stats row ─────────────────────────────────────────────── */

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
`;

export const StatCardWrap = styled.div<{ $accent: string }>`
  background: ${T.card};
  border-radius: 10px;
  padding: 18px 20px;
  border: 1px solid ${T.border};
  border-top: 3px solid ${({ $accent }) => $accent};
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const StatTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const StatLabel = styled.span`
  font-size: 10.5px;
  font-weight: 700;
  color: ${T.muted};
  text-transform: uppercase;
  letter-spacing: 1.8px;
`;

export const StatValue = styled.div`
  font-family: var(--font-playfair);
  font-size: 36px;
  font-weight: 700;
  color: ${T.text};
  line-height: 1;
`;

/* ── Shared card ───────────────────────────────────────────── */

export const Card = styled.div`
  background: ${T.card};
  border-radius: 10px;
  border: 1px solid ${T.border};
  padding: 20px 24px;
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const SectionLabel = styled.div`
  font-size: 10.5px;
  font-weight: 700;
  color: ${T.muted};
  text-transform: uppercase;
  letter-spacing: 2px;
`;

export const ViewAllLink = styled.span`
  font-size: 12px;
  color: ${T.terra};
  font-weight: 500;
  cursor: pointer;
  &:hover { text-decoration: underline; }
`;

/* ── Status badge ──────────────────────────────────────────── */

export const StatusBadgeSpan = styled.span<{ $bg: string; $color: string }>`
  font-size: 11px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 20px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  white-space: nowrap;
`;

/* ── Itinerary table ───────────────────────────────────────── */

const cols = "2fr 1.2fr 1fr 100px";

export const TableHead = styled.div`
  display: grid;
  grid-template-columns: ${cols};
  gap: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid ${T.border};
  margin-bottom: 4px;
`;

export const TableHeadCell = styled.div`
  font-size: 10px;
  font-weight: 700;
  color: ${T.muted};
  text-transform: uppercase;
  letter-spacing: 1.5px;
`;

export const TripRow = styled.div<{ $last: boolean }>`
  display: grid;
  grid-template-columns: ${cols};
  gap: 12px;
  padding: 11px 4px;
  border-bottom: ${({ $last }) => ($last ? "none" : `1px solid ${T.border}`)};
  align-items: center;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.1s;
  &:hover { background: ${T.dim}; }
`;

export const TripCell = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const StatusBar = styled.div<{ $color: string }>`
  width: 3px;
  height: 32px;
  border-radius: 2px;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

export const TripName = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: ${T.text};
`;

export const TripMeta = styled.div`
  font-size: 11px;
  color: ${T.muted};
  margin-top: 2px;
`;

export const TripClient = styled.div`
  font-size: 12.5px;
  color: ${T.sub};
`;

export const TripDates = styled.div`
  font-size: 12px;
  color: ${T.muted};
`;

/* ── Empty state ───────────────────────────────────────────── */

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 48px 20px;
  color: ${T.muted};
  font-size: 13px;
  text-align: center;
`;
