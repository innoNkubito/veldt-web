import { T } from "@/lib/theme";
import * as S from "./Icon.styled";

interface IconProps {
  d: string;
  size?: number;
  color?: string;
}

export default function Icon({ d, size = 14, color = T.muted }: IconProps) {
  return (
    <S.Svg $size={size} $color={color} viewBox="0 0 24 24">
      <path d={d} />
    </S.Svg>
  );
}
