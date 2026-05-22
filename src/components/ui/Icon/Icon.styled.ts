import styled from "@emotion/styled";

export const Svg = styled.svg<{ $size: number; $color: string }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  fill: none;
  stroke: ${({ $color }) => $color};
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
`;
