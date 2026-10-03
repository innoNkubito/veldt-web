import { useState } from 'react'
import { nextIndex, previousIndex } from './ProposalBlocks.utils'

/** Which slide is showing, with wrap-around navigation. */
export function usePhotoSlider(count: number) {
  const [index, setIndex] = useState(0)
  return {
    index,
    next: () => setIndex((i) => nextIndex(i, count)),
    previous: () => setIndex((i) => previousIndex(i, count)),
    goTo: setIndex,
  }
}
