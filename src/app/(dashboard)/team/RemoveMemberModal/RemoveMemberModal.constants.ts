import type { UserRole } from '@/stores/teamStore'

/** Viewers are read-only, so they cannot be handed trips. Mirrors the API. */
export const HANDOVER_ROLES: UserRole[] = ['OWNER', 'ADVISOR']

export const COPY = {
  title: 'Remove from team',
  sub:
    'They lose access straight away and their sign-in is deleted. Their seat is freed ' +
    'immediately. You can invite them again later.',
  recipientLabel: 'Hand their work to',
  recipientNote:
    'Assigned itineraries, About Us pages and open tasks move to this person. Completed ' +
    'tasks and uploaded media are kept without a name.',
  you: '(you)',
  cancel: 'Cancel',
  remove: 'Remove',
  removing: 'Removing…',
} as const
