import * as S from './FlightLiveStatus.styled'
import { checkedLabel, liveStatusView } from './FlightLiveStatus.utils'
import type { FlightLiveStatusProps } from './FlightLiveStatus.types'

/** Live status badge for a flight — the Trip tab (operator) and the travel dashboard (traveller). */
export default function FlightLiveStatus({ flight, audience }: FlightLiveStatusProps) {
  const view = liveStatusView(flight, audience)
  if (!view) return null
  const checked = audience === 'operator' ? checkedLabel(flight.liveCheckedAt) : null

  return (
    <S.Root>
      <S.Badge $tone={view.tone}>{view.label}</S.Badge>
      {view.detail && <S.Detail>{view.detail}</S.Detail>}
      {checked && <S.Checked>{checked}</S.Checked>}
    </S.Root>
  )
}
