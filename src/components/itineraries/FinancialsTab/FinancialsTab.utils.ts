/** Brings a section's heading to the top of the view and moves focus to it. */
export function scrollToSection(id: string): void {
  const el = document.getElementById(id)
  if (!el) return
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  const heading = document.getElementById(`${id}-title`)
  heading?.focus({ preventScroll: true })
}
