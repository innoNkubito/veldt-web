"use client";

import styled from "@emotion/styled";
import { T } from "@/lib/theme";

export const Card = styled.div`
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 10px;
  padding: 22px 26px;
  margin-bottom: 16px;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const Intro = styled.p`
  font-size: 12.5px;
  color: ${T.sub};
  line-height: 1.55;
  margin: 0;
  max-width: 560px;

  a {
    color: ${T.terra};
    font-weight: 600;
  }
`;

export const Muted = styled.p`
  font-size: 12.5px;
  color: ${T.muted};
  margin: 12px 0 0;
`;

export const List = styled.ul`
  list-style: none;
  margin: 18px 0 0;
  padding: 0;
  border-top: 1px solid ${T.border};
`;

export const Item = styled.li`
  border-bottom: 1px solid ${T.border};
`;

export const ItemButton = styled.button`
  width: 100%;
  display: grid;
  grid-template-columns: minmax(110px, 1.1fr) minmax(120px, 1.6fr) 1fr 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 12px 6px;
  background: none;
  border: none;
  text-align: left;
  font: inherit;
  font-size: 13px;
  color: ${T.text};
  cursor: pointer;

  &:hover {
    background: ${T.dim};
  }
  &:focus-visible {
    outline: 2px solid ${T.teal};
    outline-offset: -2px;
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr auto;
  }
`;

export const Mono = styled.span`
  font-family: ui-monospace, "SF Mono", Menlo, monospace;
  font-size: 12.5px;
`;

export const Sub = styled.span`
  color: ${T.sub};
  font-size: 12.5px;

  @media (max-width: 760px) {
    display: none;
  }
`;

export const Badges = styled.span`
  display: inline-flex;
  gap: 6px;
  justify-content: flex-end;
`;

export const Badge = styled.span<{ $color: string; $bg: string }>`
  display: inline-block;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  color: ${(p) => p.$color};
  background: ${(p) => p.$bg};
  white-space: nowrap;
`;

export const Notice = styled.div<{ $error?: boolean }>`
  font-size: 12.5px;
  padding: 10px 14px;
  border-radius: 8px;
  margin-bottom: 14px;
  color: ${(p) => (p.$error ? T.dangerDk : T.successDk)};
  background: ${(p) => (p.$error ? T.dangerLt : T.successLt)};
  border: 1px solid ${(p) => (p.$error ? T.dangerBd : T.successBd)};
  cursor: pointer;
`;

// ── Open invoice ──────────────────────────────────────────────

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 14px;
`;

export const Back = styled.button`
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  color: ${T.sub};
  cursor: pointer;

  &:hover {
    color: ${T.text};
  }
`;

export const ToolbarTitle = styled.span`
  font-size: 14px;
  font-weight: 700;
  margin-right: auto;
`;

/** Form (or actions) on the left, the invoice on the right. */
export const Split = styled.div`
  display: grid;
  grid-template-columns: minmax(340px, 1fr) minmax(380px, 1.15fr);
  gap: 18px;
  align-items: start;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

export const Sticky = styled.div`
  position: sticky;
  top: 16px;

  @media (max-width: 1100px) {
    position: static;
  }
`;

export const PanelTitle = styled.h4`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${T.muted};
  margin: 0 0 12px;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const Full = styled.div`
  grid-column: 1 / -1;
`;

export const Issues = styled.ul`
  margin: 0 0 14px;
  padding: 10px 14px 10px 30px;
  border-radius: 8px;
  background: ${T.warningLt};
  border: 1px solid ${T.warningBd};
  color: ${T.warningDk};
  font-size: 12.5px;
  line-height: 1.6;
`;

export const Facts = styled.dl`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 6px 16px;
  margin: 0;
  font-size: 13px;

  dt {
    color: ${T.sub};
  }
  dd {
    margin: 0;
    text-align: right;
    font-weight: 600;
  }
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
`;

export const Payments = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const Payment = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 0;
  border-bottom: 1px solid ${T.border};
  font-size: 12.5px;

  &:last-child {
    border-bottom: none;
  }
`;

export const Grow = styled.span`
  flex: 1;
  color: ${T.sub};
`;

export const LinkText = styled.code`
  display: block;
  font-size: 11.5px;
  color: ${T.sub};
  background: ${T.dim};
  padding: 7px 10px;
  border-radius: 6px;
  word-break: break-all;
  margin-top: 10px;
`;

export const DangerLink = styled.button`
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  color: ${T.dangerDk};
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// ── Modals ────────────────────────────────────────────────────

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${T.scrim};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 16px;
`;

export const ModalCard = styled.div`
  width: 480px;
  max-width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  background: ${T.card};
  border-radius: 12px;
  border: 1px solid ${T.border};
  padding: 24px 26px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const ModalTitle = styled.h3`
  font-family: var(--font-playfair);
  font-size: 20px;
  font-weight: 500;
  margin: 0;
  color: ${T.text};
`;

export const ModalText = styled.p`
  font-size: 13px;
  color: ${T.sub};
  line-height: 1.55;
  margin: 0;
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 4px;
`;

export const ModalError = styled.p`
  font-size: 12.5px;
  color: ${T.dangerDk};
  margin: 0;
`;

export const Choice = styled.label<{ $active: boolean; $disabled?: boolean }>`
  display: block;
  padding: 12px 14px;
  border-radius: 9px;
  border: 1.5px solid ${(p) => (p.$active ? T.terra : T.border)};
  background: ${(p) => (p.$active ? T.terraLt : T.card)};
  cursor: ${(p) => (p.$disabled ? "not-allowed" : "pointer")};
  opacity: ${(p) => (p.$disabled ? 0.5 : 1)};

  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }
`;

export const ChoiceLabel = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: ${T.text};
`;

export const ChoiceHint = styled.div`
  font-size: 12px;
  color: ${T.sub};
  margin-top: 2px;
`;
