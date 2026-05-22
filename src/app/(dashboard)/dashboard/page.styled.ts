import styled from "@emotion/styled";
import { T } from "@/lib/theme";

/* ── Shared ────────────────────────────────────────────────── */

export const SectionLabel = styled.div`
  font-size: 10.5px;
  font-weight: 700;
  color: ${T.muted};
  text-transform: uppercase;
  letter-spacing: 2px;
`;

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

export const ViewAllLink = styled.span`
  font-size: 12px;
  color: ${T.terra};
  font-weight: 500;
  cursor: pointer;
`;

export const Dot = styled.span<{ $size?: number }>`
  width: ${({ $size }) => $size ?? 3}px;
  height: ${({ $size }) => $size ?? 3}px;
  border-radius: 50%;
  background: ${T.muted};
  display: inline-block;
  flex-shrink: 0;
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

/* ── Page header ───────────────────────────────────────────── */

export const PageHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;

export const Greeting = styled.div`
  font-family: var(--font-playfair);
  font-size: 34px;
  font-weight: 500;
  color: ${T.text};
  line-height: 1.1;
`;

export const SubHeader = styled.div`
  font-size: 13px;
  color: ${T.muted};
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const DepartureHighlight = styled.span`
  color: ${T.terra};
  font-weight: 500;
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
`;

/* ── Stat card ─────────────────────────────────────────────── */

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
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

export const StatIcon = styled.svg`
  opacity: 0.7;
`;

export const StatValue = styled.div`
  font-family: var(--font-playfair);
  font-size: 36px;
  font-weight: 700;
  color: ${T.text};
  line-height: 1;
`;

export const StatDelta = styled.div<{ $accent: string }>`
  font-size: 11.5px;
  color: ${({ $accent }) => $accent};
  font-weight: 500;
`;

/* ── Main grid ─────────────────────────────────────────────── */

export const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 16px;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

/* ── Departures table ──────────────────────────────────────── */

const tripCols = "2.2fr 1.2fr 0.7fr 0.7fr 100px";

export const TableHead = styled.div`
  display: grid;
  grid-template-columns: ${tripCols};
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
  grid-template-columns: ${tripCols};
  gap: 12px;
  padding: 11px 0;
  border-bottom: ${({ $last }) => ($last ? "none" : `1px solid ${T.border}`)};
  align-items: center;
  cursor: pointer;
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

export const TripName = styled.div<{ $hovered: boolean }>`
  font-size: 13px;
  font-weight: 500;
  color: ${({ $hovered }) => ($hovered ? T.terra : T.text)};
  transition: color 0.12s;
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

export const TripPax = styled.div`
  font-size: 12.5px;
  color: ${T.sub};
  font-weight: 500;
`;

/* ── Pipeline ──────────────────────────────────────────────── */

export const PipelineBar = styled.div`
  display: flex;
  height: 36px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 14px;
  gap: 2px;
`;

export const PipelineSegment = styled.div<{ $flex: number; $color: string }>`
  flex: ${({ $flex }) => $flex};
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  border-radius: 4px;
  min-width: 28px;
`;

export const Legend = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  color: ${T.sub};
`;

export const LegendSwatch = styled.span<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

export const LegendCount = styled.span`
  color: ${T.text};
  font-weight: 600;
`;

/* ── Activity feed ─────────────────────────────────────────── */

export const ActivityCard = styled(Card)`
  padding: 20px 22px;
  flex: 1;
`;

export const ActivityList = styled.div`
  margin-top: 16px;
`;

export const ActivityRow = styled.div<{ $last: boolean }>`
  display: flex;
  gap: 12px;
  padding: 10px 0;
  border-bottom: ${({ $last }) => ($last ? "none" : `1px solid ${T.border}`)};
`;

export const ActivityIcon = styled.div<{ $color: string }>`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: ${({ $color }) => `${$color}18`};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
`;

export const ActivityDot = styled.div<{ $color: string }>`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

export const ActivityText = styled.div`
  font-size: 13px;
  color: ${T.text};
  line-height: 1.4;
`;

export const ActivityMeta = styled.div`
  font-size: 11px;
  color: ${T.muted};
  margin-top: 3px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const ActivityTrip = styled.span`
  font-weight: 500;
  color: ${T.sub};
`;

export const ActivityFooter = styled.div`
  margin-top: 14px;
  padding-top: 10px;
  border-top: 1px solid ${T.border};
`;

/* ── Tasks ──────────────────────────────────────────────────── */

export const TasksCard = styled.div`
  background: ${T.cardAlt};
  border-radius: 10px;
  border: 1px solid ${T.border};
  padding: 18px 22px;
`;

export const TaskList = styled.div`
  margin-top: 14px;
`;

export const TaskRow = styled.div<{ $last: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: ${({ $last }) => ($last ? "none" : `1px solid ${T.border}`)};
`;

export const Checkbox = styled.div<{ $urgent: boolean }>`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 2px solid ${({ $urgent }) => ($urgent ? T.terra : T.border)};
  flex-shrink: 0;
`;

export const TaskName = styled.div`
  font-size: 12.5px;
  color: ${T.text};
`;

export const TaskTrip = styled.div`
  font-size: 10.5px;
  color: ${T.muted};
  margin-top: 1px;
`;

export const UrgentBadge = styled.span`
  font-size: 9.5px;
  font-weight: 700;
  color: ${T.terra};
  background: ${T.terraLt};
  padding: 2px 7px;
  border-radius: 10px;
  letter-spacing: 0.5px;
`;

export const PipelineTotal = styled.span`
  font-size: 12px;
  color: ${T.muted};
`;
