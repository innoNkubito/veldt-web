'use client'

import { T } from '@/lib/theme'
import { STATUS_META } from '@/lib/itinerary-constants'
import * as S from './ItineraryStatusBadge.styled'

interface Props {
  status: string
}

export default function ItineraryStatusBadge({ status }: Props) {
  const m = STATUS_META[status] ?? { color: T.muted, bg: T.dim }
  return (
    <S.Span $bg={m.bg} $color={m.color}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </S.Span>
  )
}
