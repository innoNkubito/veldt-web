import type { AdvisorOption } from '@/stores/templateStore'
import { COPY } from './UseTemplateModal.constants'
import type { TemplateChoice } from './UseTemplateModal.types'

export function templateLabel(template: TemplateChoice): string {
  return template.templateName || template.proposalTitle
}

/** "7 nights" — or nothing when the template has no nights set. */
export function nightsLabel(nights: number): string {
  if (nights <= 0) return ''
  return `${nights} ${nights === 1 ? 'night' : 'nights'}`
}

/** "Jane Mwangi (you)" — falls back to "Unnamed" when the member has no name. */
export function advisorLabel(advisor: AdvisorOption): string {
  const name = `${advisor.firstName ?? ''} ${advisor.lastName ?? ''}`.trim() || 'Unnamed'
  return advisor.isYou ? name + COPY.you : name
}

/** You, when you can be assigned; otherwise the first owner or advisor. */
export function defaultAdvisorId(advisors: AdvisorOption[]): string {
  return (advisors.find((advisor) => advisor.isYou) ?? advisors[0])?.id ?? ''
}
