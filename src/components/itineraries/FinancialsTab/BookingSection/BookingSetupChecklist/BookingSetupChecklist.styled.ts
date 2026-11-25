import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const Root = styled.div<{ $complete: boolean }>`
  border: 1px solid ${({ $complete }) => ($complete ? T.sage : T.warningBd)};
  background: ${({ $complete }) => ($complete ? T.sageLt : T.goldLt)};
  border-radius: 10px;
  padding: 18px 22px;
  margin-bottom: 16px;
`

export const Header = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 4px;
`

export const Title = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: ${T.text};
  text-transform: uppercase;
  letter-spacing: 0.06em;
`

export const Progress = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${T.sub};
`

export const Note = styled.div`
  font-size: 12px;
  line-height: 1.5;
  color: ${T.sub};
  margin-bottom: 14px;
`

export const Steps = styled.ol`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const Step = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 8px;
  padding: 10px 14px;
`

export const Marker = styled.span<{ $done: boolean }>`
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11.5px;
  font-weight: 700;
  color: ${({ $done }) => ($done ? T.card : T.sub)};
  background: ${({ $done }) => ($done ? T.sage : T.dim)};
`

export const StepText = styled.div`
  flex: 1;
  min-width: 0;
`

export const StepTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${T.text};
`

export const StepDetail = styled.div`
  font-size: 12px;
  color: ${T.muted};
  margin-top: 2px;
  line-height: 1.45;
`

export const GoButton = styled.button`
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
