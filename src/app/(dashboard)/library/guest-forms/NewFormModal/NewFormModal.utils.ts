import { FIELD_TYPE_CONFIG, type GuestFormStarter } from '@/lib/guestForms'
import { BUILDER_NEW_PATH } from './NewFormModal.constants'

export const starterQuestionCount = (starter: GuestFormStarter) =>
  starter.fields.filter((f) => FIELD_TYPE_CONFIG[f.type].isInput).length

export const newFormPath = (starterKey: string | null) =>
  starterKey ? `${BUILDER_NEW_PATH}?starter=${encodeURIComponent(starterKey)}` : BUILDER_NEW_PATH
