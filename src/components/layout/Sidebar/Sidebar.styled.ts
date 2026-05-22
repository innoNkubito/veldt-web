import styled from "@emotion/styled";
import { T } from "@/lib/theme";

export const Aside = styled.aside`
  width: 208px;
  background: ${T.sideBg};
  border-right: 1px solid ${T.border};
  padding: 16px 10px 24px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-shrink: 0;
  overflow-y: auto;
`;

export const Section = styled.div`
  margin-bottom: 8px;
`;

export const SectionLabel = styled.div`
  font-size: 9px;
  font-weight: 700;
  color: ${T.muted};
  letter-spacing: 2.5px;
  text-transform: uppercase;
  padding: 10px 10px 5px;
`;

export const NavItem = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 7px 10px;
  border-radius: 7px;
  cursor: pointer;
  background: ${({ $active }) => ($active ? T.terraLt : "transparent")};
  color: ${({ $active }) => ($active ? T.terra : T.sub)};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  font-size: 13px;
  transition: background 0.12s;
`;

export const Badge = styled.span`
  margin-left: auto;
  font-size: 10px;
  font-weight: 700;
  background: ${T.terra};
  color: #fff;
  border-radius: 10px;
  padding: 1px 6px;
`;

export const OrgFooter = styled.div`
  margin-top: auto;
  border-top: 1px solid ${T.border};
  padding: 14px 10px 0;
`;

export const OrgLabel = styled.div`
  font-size: 9px;
  font-weight: 700;
  color: ${T.muted};
  letter-spacing: 2.5px;
  text-transform: uppercase;
  margin-bottom: 8px;
`;

export const OrgCard = styled.div`
  background: ${T.dim};
  border-radius: 7px;
  padding: 9px 11px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

export const OrgLogo = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 6px;
  background: ${T.terra};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
`;

export const OrgName = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${T.text};
  line-height: 1.2;
`;

export const OrgCity = styled.div`
  font-size: 10px;
  color: ${T.muted};
`;

export const Chevron = styled.svg`
  margin-left: auto;
`;
