export const COPY = {
  title: 'Start this trip?',
  body:
    'The share link becomes the traveller’s travel dashboard: confirmed flights, where they stay each night and who to contact.',
  notify: (email: string) => `Email ${email} that their travel dashboard is ready`,
  cancel: 'Cancel',
  confirm: 'Start Trip',
  confirming: 'Starting…',
} as const
