import { Global } from '@emotion/react'
import * as S from './PrintWatermark.styled'
import { PRINT_PAGE_CSS, STAMP_REPEATS } from './PrintWatermark.constants'
import { footerLine } from './PrintWatermark.utils'
import type { PrintWatermarkProps } from './PrintWatermark.types'

/**
 * What a printed or saved-as-PDF proposal carries on every page: a faint
 * diagonal stamp of the operator's name and a footer naming the operator, the
 * itinerary reference and the share link — so a copy traces back to its source.
 * Renders nothing on screen.
 */
export default function PrintWatermark({ brand, reference, shareUrl }: PrintWatermarkProps) {
  return (
    <>
      <Global styles={PRINT_PAGE_CSS} />
      <S.Stamp aria-hidden>
        {Array.from({ length: STAMP_REPEATS }, (_, i) => (
          <S.StampText key={i}>{brand.name}</S.StampText>
        ))}
      </S.Stamp>
      <S.Footer aria-hidden>
        {brand.logoUrl && <S.FooterLogo src={brand.logoUrl} alt="" />}
        <S.FooterText>{footerLine(brand.name, reference, shareUrl)}</S.FooterText>
      </S.Footer>
    </>
  )
}
