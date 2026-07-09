'use client'

import { useEffect, useRef } from 'react'
import { useConfirmStore } from '@/stores/confirmStore'
import * as S from './ConfirmModal.styled'

/**
 * Global confirmation modal — mounted once in the dashboard layout.
 * Open it from anywhere via `confirmDialog({ title, message, ... })`,
 * which resolves true (confirm) or false (cancel / escape / overlay click).
 */
export default function ConfirmModal() {
  const { open, options, settle } = useConfirmStore()
  const confirmRef = useRef<HTMLButtonElement>(null)

  // Escape to cancel, focus the confirm button on open
  useEffect(() => {
    if (!open) return
    confirmRef.current?.focus()
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') settle(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, settle])

  if (!open) return null

  return (
    <S.Overlay onMouseDown={(e) => { if (e.target === e.currentTarget) settle(false) }}>
      <S.Card role="dialog" aria-modal="true" aria-label={options.title}>
        <S.Title>{options.title}</S.Title>
        {options.message && <S.Message>{options.message}</S.Message>}
        <S.Actions>
          <S.CancelButton onClick={() => settle(false)}>
            {options.cancelLabel ?? 'Cancel'}
          </S.CancelButton>
          <S.ConfirmButton
            ref={confirmRef}
            $danger={options.danger}
            onClick={() => settle(true)}
          >
            {options.confirmLabel ?? 'Confirm'}
          </S.ConfirmButton>
        </S.Actions>
      </S.Card>
    </S.Overlay>
  )
}
