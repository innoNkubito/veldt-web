import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(42, 31, 20, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 100;
`

export const Card = styled.div`
  width: 100%;
  max-width: 460px;
  background: ${T.card};
  border-radius: 12px;
  padding: 32px 36px;
  border: 1px solid ${T.border};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
`

export const Title = styled.div`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 20px;
  font-weight: 500;
  color: ${T.text};
  margin-bottom: 8px;
`

export const Body = styled.div`
  font-size: 13px;
  color: ${T.sub};
  margin-bottom: 24px;
  line-height: 1.6;
`

export const Actions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`

export const IssueList = styled.ul`
  list-style: none;
  margin: -8px 0 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const Issue = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid ${T.dangerBd};
  background: ${T.dangerLt};
  border-radius: 8px;
`

export const IssueText = styled.span`
  flex: 1;
  font-size: 12.5px;
  line-height: 1.45;
  color: ${T.dangerDk};
`

export const FixButton = styled.button`
  flex-shrink: 0;
  border: none;
  background: none;
  padding: 0;
  font: inherit;
  font-size: 12.5px;
  font-weight: 600;
  color: ${T.teal};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`

export const CheckFailed = styled.div`
  font-size: 12px;
  color: ${T.muted};
  margin-bottom: 10px;
`
