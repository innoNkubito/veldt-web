import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(280px, 1fr) 1.4fr;
  gap: 24px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

export const Card = styled.div`
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 10px;
  padding: 22px 24px;
`

export const CardTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: ${T.text};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 16px;
`

export const TypeHint = styled.p`
  font-size: 11.5px;
  color: ${T.muted};
  line-height: 1.5;
  margin: 6px 0 0;
`

export const Actions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 18px;
`

export const ErrorText = styled.div`
  font-size: 12.5px;
  line-height: 1.5;
  color: ${T.dangerDk};
  margin-top: 12px;
`

export const Group = styled.div`
  & + & {
    margin-top: 20px;
  }
`

export const GroupLabel = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: ${T.muted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 8px;
`

export const Row = styled.div<{ $active: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border: 1px solid ${(p) => (p.$active ? T.terra : T.border)};
  border-radius: 8px;
  background: ${T.bg};

  & + & {
    margin-top: 8px;
  }
`

export const RowTitle = styled.div`
  font-size: 13.5px;
  font-weight: 600;
  color: ${T.text};
`

export const RowMeta = styled.div`
  font-size: 12px;
  color: ${T.sub};
  margin-top: 2px;
`

export const RowActions = styled.div`
  display: flex;
  gap: 4px;
  flex-shrink: 0;
`

export const Empty = styled.div`
  font-size: 13px;
  color: ${T.muted};
`
