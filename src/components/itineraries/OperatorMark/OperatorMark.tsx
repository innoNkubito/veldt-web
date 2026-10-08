import * as S from './OperatorMark.styled'
import { COPY } from './OperatorMark.constants'
import { logoHeight } from './OperatorMark.utils'
import { useOperatorBrand } from './useOperatorBrand'
import type { OperatorMarkProps } from './OperatorMark.types'

/**
 * The operator's watermark — name and logo — on client-facing itineraries.
 * Always shown, white-label or not: white-label hides Veldt, never the operator.
 */
export default function OperatorMark({ brand, variant }: OperatorMarkProps) {
  const logo = brand.logoUrl ? (
    <S.Logo src={brand.logoUrl} alt={brand.name} $height={logoHeight(variant)} draggable={false} />
  ) : null

  if (variant === 'photo') {
    return (
      <S.Photo aria-hidden>
        {logo}
        <S.Name $small>{brand.name}</S.Name>
      </S.Photo>
    )
  }

  const Wrap = variant === 'cover' ? S.Cover : S.Inline
  return (
    <Wrap>
      {logo}
      <S.Label>{COPY.preparedBy}</S.Label>
      <S.Name>{brand.name}</S.Name>
    </Wrap>
  )
}

/** The corner mark for a proposal photo, from the surrounding itinerary's brand. */
export function PhotoMark() {
  const brand = useOperatorBrand()
  return brand ? <OperatorMark brand={brand} variant="photo" /> : null
}
