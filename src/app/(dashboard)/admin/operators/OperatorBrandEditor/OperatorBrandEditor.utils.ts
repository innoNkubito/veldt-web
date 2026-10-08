import type { OperatorBrand } from '@/stores/brandStore'
import type { BrandDraft } from './OperatorBrandEditor.types'

export function toDraft(brand: OperatorBrand): BrandDraft {
  return { name: brand.name, logoUrl: brand.logoUrl }
}

export function isChanged(draft: BrandDraft, saved: BrandDraft): boolean {
  return draft.name.trim() !== saved.name || draft.logoUrl !== saved.logoUrl
}
