'use client'

import { useRef, useState } from 'react'
import { T } from '@/lib/theme'
import { ItineraryListItem } from '@/stores/itineraryStore'
import * as S from './ItineraryRowMenu.styled'

interface MenuItem {
  label: string
  action: () => void
  color?: string
}

interface Props {
  itinerary: ItineraryListItem
  onDuplicate: () => void
  onDelete: () => void
}

export default function ItineraryRowMenu({ itinerary, onDuplicate, onDelete }: Props) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, right: 0 })
  const triggerRef = useRef<HTMLButtonElement>(null)

  function handleOpen() {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPos({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      })
    }
    setOpen((o) => !o)
  }

  const items: MenuItem[] = [
    { label: 'Duplicate', action: onDuplicate, color: T.sub },
    {
      label: 'Share link',
      action: () => {
        navigator.clipboard.writeText(`${window.location.origin}/view/${itinerary.slug}`)
        setOpen(false)
      },
      color: T.sub,
    },
    { label: 'Delete', action: onDelete, color: '#DC2626' },
  ]

  return (
    <S.Wrapper>
      <S.Trigger ref={triggerRef} $open={open} onClick={handleOpen}>
        ⋯
      </S.Trigger>
      {open && (
        <>
          <S.Backdrop onClick={() => setOpen(false)} />
          <S.Dropdown $top={pos.top} $right={pos.right}>
            {items.map(({ label, action, color }) => (
              <S.Item
                key={label}
                $color={color}
                onClick={() => {
                  action()
                  setOpen(false)
                }}
              >
                {label}
              </S.Item>
            ))}
          </S.Dropdown>
        </>
      )}
    </S.Wrapper>
  )
}
