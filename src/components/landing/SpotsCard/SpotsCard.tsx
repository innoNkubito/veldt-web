'use client'

import { MARKETS, SPOTS } from './constants'
import * as S from './SpotsCard.styled'

export default function SpotsCard() {
  const takenPct = ((SPOTS.total - SPOTS.left) / SPOTS.total) * 100

  return (
    <S.Card aria-label="Onboarding availability">
      <S.Headline>
        <S.Count>{SPOTS.left}</S.Count>
        <span>
          of {SPOTS.total} spots left for {SPOTS.month}
        </span>
      </S.Headline>
      <S.Track aria-hidden>
        <S.Fill $pct={takenPct} />
      </S.Track>

      <S.MarketsLabel>Operators already live in</S.MarketsLabel>
      <S.Markets>
        {MARKETS.map((m) => (
          <S.MarketItem key={m.country} $live={!m.opensIn}>
            {m.opensIn ? `${m.country} · ${m.opensIn}` : m.country}
          </S.MarketItem>
        ))}
      </S.Markets>
    </S.Card>
  )
}
