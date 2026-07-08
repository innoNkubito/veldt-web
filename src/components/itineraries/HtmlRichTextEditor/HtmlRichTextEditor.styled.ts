import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const Wrap = styled.div`
  width: 100%;
  border: 1px solid ${T.border};
  border-radius: 8px;
  background: ${T.card};
  overflow: hidden;

  &:focus-within {
    border-color: ${T.terra};
  }
`

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 4px 6px;
  border-bottom: 1px solid ${T.border};
  background: ${T.bg};
`

export const ToolButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: none;
  border-radius: 5px;
  background: ${({ $active }) => ($active ? T.terraLt : 'transparent')};
  color: ${({ $active }) => ($active ? T.terra : T.sub)};
  font-size: 12px;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: background 0.1s, color 0.1s;

  &:hover {
    background: ${T.terraLt};
    color: ${T.terra};
  }
`

export const EditorArea = styled.div`
  /* Tiptap editor reset */
  .ProseMirror {
    outline: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    line-height: 1.65;
    color: ${T.text};
    min-height: 88px;
    padding: 12px 14px;

    p {
      margin: 0 0 8px;
      &:last-child { margin-bottom: 0; }
    }

    ul, ol {
      padding-left: 20px;
      margin: 0 0 8px;
    }

    li { margin-bottom: 2px; }

    strong { font-weight: 600; }
    em { font-style: italic; }

    p.is-editor-empty:first-child::before {
      content: attr(data-placeholder);
      color: ${T.muted};
      pointer-events: none;
      float: left;
      height: 0;
    }
  }
`
