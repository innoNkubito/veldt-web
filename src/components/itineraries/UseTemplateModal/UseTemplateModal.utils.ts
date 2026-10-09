import type { TemplateChoice } from './UseTemplateModal.types'

export function templateLabel(template: TemplateChoice): string {
  return template.templateName || template.proposalTitle
}

/** "7 nights" — or nothing when the template has no nights set. */
export function nightsLabel(nights: number): string {
  if (nights <= 0) return ''
  return `${nights} ${nights === 1 ? 'night' : 'nights'}`
}
