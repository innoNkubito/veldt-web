'use client'

import { useSyncExternalStore } from 'react'
import { SCROLLED_THRESHOLD } from './constants'

const subscribe = (onChange: () => void) => {
  window.addEventListener('scroll', onChange, { passive: true })
  return () => window.removeEventListener('scroll', onChange)
}

const getSnapshot = () => window.scrollY > SCROLLED_THRESHOLD
const getServerSnapshot = () => false

// True once the page has scrolled under the sticky header.
export function useLandingHeader() {
  const scrolled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return { scrolled }
}
