import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const Card = styled.div<{ $archived: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 12px;
  padding: 18px 20px;
  opacity: ${({ $archived }) => ($archived ? 0.7 : 1)};
`

export const TitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
`

export const Name = styled.div`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 18px;
  font-weight: 500;
  color: ${T.text};
  line-height: 1.25;
`

export const ArchivedBadge = styled.span`
  flex-shrink: 0;
  font-size: 10.5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: ${T.sub};
  background: ${T.dim};
  border-radius: 999px;
  padding: 3px 8px;
`

export const Meta = styled.div`
  font-size: 11.5px;
  color: ${T.muted};
`

export const Description = styled.p<{ $empty: boolean }>`
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: ${({ $empty }) => ($empty ? T.muted : T.sub)};
  font-style: ${({ $empty }) => ($empty ? 'italic' : 'normal')};
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

export const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`

export const Tag = styled.span`
  font-size: 11px;
  color: ${T.teal};
  background: ${T.tealLt};
  border-radius: 999px;
  padding: 3px 9px;
`

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: auto;
  padding-top: 6px;
  border-top: 1px solid ${T.border};
`

export const LinkAction = styled.button<{ $danger?: boolean }>`
  background: none;
  border: none;
  padding: 6px 4px;
  font-size: 12px;
  font-weight: 500;
  color: ${({ $danger }) => ($danger ? T.danger : T.sub)};
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;

  &:hover:not(:disabled) {
    color: ${({ $danger }) => ($danger ? T.dangerDk : T.terra)};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`
