import styled from '@emotion/styled'
import { T } from '@/lib/theme'
import type { LiveStatusTone } from './FlightLiveStatus.types'

const TONES: Record<LiveStatusTone, { fg: string; bg: string }> = {
  success: { fg: T.successDk, bg: T.successLt },
  warning: { fg: T.warningDk, bg: T.warningLt },
  danger: { fg: T.dangerDk, bg: T.dangerLt },
  info: { fg: T.infoDk, bg: T.infoLt },
  muted: { fg: T.sub, bg: T.dim },
}

export const Root = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 8px;
  margin-top: 6px;
`

export const Badge = styled.span<{ $tone: LiveStatusTone }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 600;
  color: ${({ $tone }) => TONES[$tone].fg};
  background: ${({ $tone }) => TONES[$tone].bg};
`

export const Detail = styled.span`
  font-size: 12px;
  color: ${T.sub};
`

export const Checked = styled.span`
  font-size: 11px;
  color: ${T.muted};
`
