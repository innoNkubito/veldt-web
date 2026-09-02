'use client'

import { useEffect, useRef, useState } from 'react'
import { useBuilderStore, type ItineraryInfoPageSlot } from '@/stores/builderStore'
import { useContentHubStore, type HubContentItem } from '@/stores/contentHubStore'
import { useClientStore } from '@/stores/clientStore'
import { contentTypeConfig, type ContentType } from '@/lib/contentTypes'
import * as S from './InfoPagesCard.styled'

// ── Config ──────────────────────────────────────────────────────

const SLOTS: {
  key: 'AFTER_COVER' | 'BEFORE_DAY_BY_DAY' | 'END'
  label: string
  hint: string
}[] = [
  { key: 'AFTER_COVER',       label: 'After the Cover Page',          hint: 'e.g. About Us page' },
  { key: 'BEFORE_DAY_BY_DAY', label: 'Before the Day-by-Day Itinerary', hint: 'e.g. Introductory Note page' },
  { key: 'END',               label: 'End of Itinerary',              hint: 'e.g. Terms & Conditions page' },
]

// Types available for info page slots (Properties and Areas go via the Day-by-Day tab)
const ALLOWED_TYPES: ContentType[] = ['ABOUT_US', 'INTRODUCTORY_NOTES', 'TERMS_CONDITIONS']

// ── Slot picker ─────────────────────────────────────────────────

function SlotPicker({
  slotKey,
  label,
  hint,
  selected,
  available,
  onAdd,
  onRemove,
  onMove,
}: {
  slotKey: string
  label: string
  hint: string
  selected: ItineraryInfoPageSlot[]
  available: HubContentItem[]
  onAdd: (page: HubContentItem) => void
  onRemove: (slotId: string) => void
  onMove: (index: number, dir: -1 | 1) => void
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target instanceof Node ? e.target : null)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const selectedIds = new Set(selected.map((s) => s.contentPage.id))

  const filtered = available.filter(
    (p) =>
      !selectedIds.has(p.id) &&
      (search === '' || p.name.toLowerCase().includes(search.toLowerCase())),
  )

  return (
    <S.SlotSection>
      <S.SlotHeader>
        <S.SlotLabel>{label}</S.SlotLabel>
        <S.SlotHint>({hint})</S.SlotHint>
      </S.SlotHeader>

      {selected.length > 0 && (
        <S.SelectedPages>
          {selected.map((s, i) => {
            const cfg = contentTypeConfig(s.contentPage.type)
            return (
              <S.PagePill key={s.id}>
                <S.PillMoveBtn type="button" onClick={() => onMove(i, -1)} disabled={i === 0} title="Move up">▲</S.PillMoveBtn>
                <S.PillMoveBtn type="button" onClick={() => onMove(i, 1)} disabled={i === selected.length - 1} title="Move down">▼</S.PillMoveBtn>
                {cfg && <S.PillType>{cfg.label}</S.PillType>}
                {s.contentPage.name}
                <S.PillRemove
                  type="button"
                  onClick={() => onRemove(s.id)}
                  title="Remove"
                >
                  ✕
                </S.PillRemove>
              </S.PagePill>
            )
          })}
        </S.SelectedPages>
      )}

      <S.AddRow ref={ref}>
        <S.AddButton type="button" onClick={() => setOpen((o) => !o)}>
          + Add page
        </S.AddButton>

        {open && (
          <S.Dropdown>
            <S.DropdownSearch
              autoFocus
              placeholder="Search pages…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <S.DropdownList>
              {filtered.length === 0 ? (
                <S.DropdownEmpty>
                  {search ? 'No pages match your search.' : 'No more pages available.'}
                </S.DropdownEmpty>
              ) : (
                filtered.map((page) => {
                  const cfg = contentTypeConfig(page.type)
                  return (
                    <S.DropdownItem
                      key={page.id}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault()
                        onAdd(page)
                        setOpen(false)
                        setSearch('')
                      }}
                    >
                      <S.DropdownItemThumb $url={page.coverImageUrl ?? ''} />
                      <S.DropdownItemInfo>
                        <S.DropdownItemName>{page.name}</S.DropdownItemName>
                        {cfg && <S.DropdownItemType>{cfg.label}</S.DropdownItemType>}
                      </S.DropdownItemInfo>
                    </S.DropdownItem>
                  )
                })
              )}
            </S.DropdownList>
          </S.Dropdown>
        )}
      </S.AddRow>
    </S.SlotSection>
  )
}

// ── Card ────────────────────────────────────────────────────────

export default function InfoPagesCard() {
  const client = useClientStore((s) => s.client)
  const { itinerary, addInfoPageSlot, removeInfoPageSlot, reorderInfoPageSlots } = useBuilderStore()
  const { pages, fetchAll } = useContentHubStore()

  useEffect(() => {
    if (client) fetchAll()
  }, [client])

  if (!itinerary) return null

  // Pages available for info slots — exclude Property and Area
  const available = pages.filter((p) => ALLOWED_TYPES.some((t) => t === p.type))

  async function handleAdd(slotKey: string, page: HubContentItem) {
    const existing = itinerary!.infoPageSlots.filter((s) => s.slot === slotKey)
    await addInfoPageSlot(itinerary!.id, page.id, slotKey, existing.length)
  }

  async function handleRemove(slotId: string) {
    await removeInfoPageSlot(slotId)
  }

  function handleMove(slotKey: string, index: number, dir: -1 | 1) {
    const slotItems = itinerary!.infoPageSlots
      .filter((s) => s.slot === slotKey)
      .slice()
      .sort((a, b) => a.position - b.position)
    const next = [...slotItems]
    const [moved] = next.splice(index, 1)
    next.splice(index + dir, 0, moved)
    reorderInfoPageSlots(itinerary!.id, slotKey, next.map((s) => s.id))
  }

  return (
    <S.Card>
      <S.CardTitle>Include Information Pages</S.CardTitle>
      <S.CardDescription>
        Select pages from your content library to include at key points in the document.
        Property and Area pages are added from the Day-by-Day tab.
      </S.CardDescription>

      {SLOTS.map(({ key, label, hint }) => (
        <SlotPicker
          key={key}
          slotKey={key}
          label={label}
          hint={hint}
          selected={itinerary.infoPageSlots
            .filter((s) => s.slot === key)
            .slice()
            .sort((a, b) => a.position - b.position)}
          available={available}
          onAdd={(page) => handleAdd(key, page)}
          onRemove={handleRemove}
          onMove={(index, dir) => handleMove(key, index, dir)}
        />
      ))}
    </S.Card>
  )
}
