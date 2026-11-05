'use client'

import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const Root = styled.div`
  min-height: 100vh;
  background: ${T.bg};
  display: flex;
  flex-direction: column;
`

/* ── Capability tiles ────────────────────────────────────── */

export const TileGrid = styled.div`
  margin-top: 36px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`

export const Tile = styled.div`
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 12px;
  padding: 26px 24px;
`

export const TileIcon = styled.div<{ $tint: string; $fg: string }>`
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: ${(p) => p.$tint};
  color: ${(p) => p.$fg};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`

export const TileTitle = styled.h3`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 18px;
  font-weight: 500;
  color: ${T.text};
  margin: 0 0 8px;
`

export const TileBody = styled.p`
  font-size: 13px;
  line-height: 1.65;
  color: ${T.sub};
  margin: 0;
`
