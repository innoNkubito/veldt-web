import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const Wrap = styled.div`
  position: relative;
  width: 100%;

  /* Tiptap editor reset */
  .ProseMirror {
    outline: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    line-height: 1.65;
    color: ${T.text};
    min-height: 80px;
    padding: 12px 14px;

    p {
      margin: 0 0 8px;
      &:last-child { margin-bottom: 0; }
    }

    p.is-editor-empty:first-child::before {
      content: attr(data-placeholder);
      color: ${T.muted};
      pointer-events: none;
      float: left;
      height: 0;
    }

    /* @mention chip */
    .mention {
      display: inline-flex;
      align-items: center;
      background: #dbeafe;
      color: #1d4ed8;
      border-radius: 4px;
      padding: 1px 5px;
      font-size: 12.5px;
      font-weight: 500;
      white-space: nowrap;
    }
  }
`

export const SuggestionDropdown = styled.div`
  position: fixed;
  z-index: 100;
  min-width: 220px;
  max-width: 320px;
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  max-height: 200px;
  overflow-y: auto;
`

export const SuggestionItem = styled.button<{ $active: boolean }>`
  display: block;
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: ${({ $active }) => ($active ? T.dim : 'transparent')};
  text-align: left;
  font-size: 13px;
  font-family: 'DM Sans', sans-serif;
  color: ${T.text};
  cursor: pointer;
  transition: background 0.1s;

  &:hover {
    background: ${T.dim};
  }
`

export const SuggestionEmpty = styled.div`
  padding: 10px 12px;
  font-size: 12.5px;
  color: ${T.muted};
  font-family: 'DM Sans', sans-serif;
`
