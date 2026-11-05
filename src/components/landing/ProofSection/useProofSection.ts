'use client'

import { useEffect, useRef, useState } from 'react'
import { COUNT_UP_MS, IN_VIEW_THRESHOLD } from './constants'
import { easeOutCubic } from './utils'

// Counts the stats up once, the first time the section scrolls into view.
// One shared 0→1 progress value drives every stat. Reduced-motion users
// (and browsers without IntersectionObserver) get the final numbers.
export function useProofSection() {
  const ref = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    let frame = 0
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || typeof IntersectionObserver === 'undefined') {
      frame = requestAnimationFrame(() => setProgress(1))
      return () => cancelAnimationFrame(frame)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min((now - start) / COUNT_UP_MS, 1)
          setProgress(easeOutCubic(t))
          if (t < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: IN_VIEW_THRESHOLD },
    )
    observer.observe(node)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [])

  return { ref, progress }
}
