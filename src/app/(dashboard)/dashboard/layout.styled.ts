import styled from "@emotion/styled";
import { T } from "@/lib/theme";

export const Shell = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${T.bg};
  color: ${T.text};
  font-family: "DM Sans", sans-serif;
  font-size: 13px;
  overflow: hidden;
`;

export const Body = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

export const Main = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 22px;
`;
