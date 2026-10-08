import { COPY } from './PrintWatermark.constants'

/** "https://app.veldt.io/view/abc" → "app.veldt.io/view/abc" */
export function displayUrl(url: string): string {
  return url.replace(/^https?:\/\//, '')
}

/** "Wild About Africa · Ref VLD-4F2A9C · app.veldt.io/view/abc" */
export function footerLine(name: string, reference: string, shareUrl: string): string {
  return [name, `${COPY.refPrefix} ${reference}`, displayUrl(shareUrl)].filter(Boolean).join(' · ')
}
