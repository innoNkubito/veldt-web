import { create } from 'zustand'

export interface ConfirmOptions {
  title: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  /** Renders the confirm button in the destructive (red) style */
  danger?: boolean
}

interface ConfirmState {
  open: boolean
  options: ConfirmOptions
  resolver: ((result: boolean) => void) | null

  /** Opens the confirm modal and resolves true/false with the user's choice. */
  confirm: (options: ConfirmOptions) => Promise<boolean>
  /** Internal — called by the modal on confirm/cancel/overlay click. */
  settle: (result: boolean) => void
}

export const useConfirmStore = create<ConfirmState>((set, get) => ({
  open: false,
  options: { title: '' },
  resolver: null,

  confirm: (options) => {
    // Settle any previous dialog defensively
    get().resolver?.(false)
    return new Promise<boolean>((resolve) => {
      set({ open: true, options, resolver: resolve })
    })
  },

  settle: (result) => {
    get().resolver?.(result)
    set({ open: false, resolver: null })
  },
}))

/** Imperative confirm — usable outside React components too. */
export function confirmDialog(options: ConfirmOptions): Promise<boolean> {
  return useConfirmStore.getState().confirm(options)
}
