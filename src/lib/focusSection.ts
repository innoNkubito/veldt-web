import { T } from '@/lib/theme'

const WAIT_MS = 3000
const FLASH_MS = 1800
const FOCUSABLE = 'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])'

/**
 * Scrolls to a section, flashes a ring around it and focuses its first field.
 *
 * The section may not exist yet — the caller has usually just switched tabs,
 * and some tabs load their data first — so this waits for it (up to 3 s).
 */
export function focusSection(id: string): void {
  const started = performance.now()

  function attempt() {
    const el = document.getElementById(id)
    if (!el) {
      if (performance.now() - started < WAIT_MS) requestAnimationFrame(attempt)
      return
    }
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    el.animate(
      [
        { boxShadow: `0 0 0 3px ${T.gold}` },
        { boxShadow: `0 0 0 3px ${T.gold}`, offset: 0.6 },
        { boxShadow: '0 0 0 3px transparent' },
      ],
      { duration: FLASH_MS, easing: 'ease-out' },
    )
    el.querySelector<HTMLElement>(FOCUSABLE)?.focus({ preventScroll: true })
  }

  requestAnimationFrame(attempt)
}
