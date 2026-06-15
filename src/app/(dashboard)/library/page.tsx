'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useContentHubStore, type HubContentItem } from '@/stores/contentHubStore'
import { useClientStore } from '@/stores/clientStore'
import {
  CONTENT_CATEGORIES,
  CONTENT_TYPE_CONFIG,
  CREATABLE_TYPES,
  type ContentType,
} from '@/lib/contentTypes'
import * as S from './page.styled'

// ── Create New Modal ────────────────────────────────────────────

function CreateModal({
  saving,
  onCreate,
  onClose,
}: {
  saving: boolean
  onCreate: (type: ContentType, name: string) => Promise<void>
  onClose: () => void
}) {
  const [selectedType, setSelectedType] = useState<ContentType>('PROPERTY')
  const [name, setName] = useState('')
  const nameRef = useRef<HTMLInputElement>(null)
  const cfg = CONTENT_TYPE_CONFIG[selectedType]

  // Focus name when type changes
  useEffect(() => { nameRef.current?.focus() }, [selectedType])

  async function handleCreate() {
    if (!name.trim()) { nameRef.current?.focus(); return }
    await onCreate(selectedType, name.trim())
  }

  return (
    <S.Overlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <S.ModalCard onClick={(e) => e.stopPropagation()}>
        <S.ModalTitle>Create New Content Page</S.ModalTitle>

        <S.ModalLabel>Type</S.ModalLabel>
        <S.TypeGrid>
          {CREATABLE_TYPES.map((t) => (
            <S.TypeOption
              key={t}
              type="button"
              $selected={selectedType === t}
              onClick={() => setSelectedType(t)}
            >
              {CONTENT_TYPE_CONFIG[t].label}
            </S.TypeOption>
          ))}
        </S.TypeGrid>

        <S.ModalLabel>Name</S.ModalLabel>
        <S.ModalNameInput
          ref={nameRef}
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={cfg.createPlaceholder}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
        />

        <S.ModalActions>
          <S.CancelButton type="button" onClick={onClose}>Cancel</S.CancelButton>
          <S.CreateButton
            type="button"
            onClick={handleCreate}
            disabled={saving || !name.trim()}
          >
            {saving ? 'Creating…' : `Create ${cfg.label} →`}
          </S.CreateButton>
        </S.ModalActions>
      </S.ModalCard>
    </S.Overlay>
  )
}

// ── Content Row ─────────────────────────────────────────────────

function ContentRow({ item }: { item: HubContentItem }) {
  const router = useRouter()
  const cfg = CONTENT_TYPE_CONFIG[item.type]

  const metaLabel =
    item.type === 'ACTIVITY' && item.area
      ? item.area.name
      : item.country ?? null

  return (
    <S.ContentRow onClick={() => router.push(cfg.detailRoute(item.id))}>
      <S.TypeBadge $bg={cfg.badgeColor} $fg={cfg.badgeText}>{cfg.label}</S.TypeBadge>
      <S.RowName>{item.name}</S.RowName>
      <S.RowMeta>{metaLabel ?? '—'}</S.RowMeta>
      <S.RowTags>
        {item.tags.slice(0, 2).map((tag) => (
          <S.TagChip key={tag}>{tag}</S.TagChip>
        ))}
        {item.tags.length > 2 && <S.TagChip>+{item.tags.length - 2}</S.TagChip>}
      </S.RowTags>
      <S.RowArrow>›</S.RowArrow>
    </S.ContentRow>
  )
}

// ── Page ────────────────────────────────────────────────────────

export default function ContentLibraryPage() {
  const router = useRouter()
  const client = useClientStore((s) => s.client)
  const { pages, loading, saving, fetchAll, createPage } = useContentHubStore()

  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)

  useEffect(() => {
    if (client) fetchAll()
  }, [client])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    if (!q) return pages
    return pages.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.country ?? '').toLowerCase().includes(q) ||
        (p.area?.name ?? '').toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)),
    )
  }, [pages, search])

  const byType = useMemo(() => {
    const map = new Map<ContentType, HubContentItem[]>()
    for (const p of filtered) {
      const existing = map.get(p.type) ?? []
      map.set(p.type, [...existing, p])
    }
    return map
  }, [filtered])

  async function handleCreate(type: ContentType, name: string) {
    const created = await createPage(type, name)
    if (created) {
      setShowCreate(false)
      router.push(CONTENT_TYPE_CONFIG[type].detailRoute(created.id))
    }
  }

  const totalCount = pages.length

  return (
    <S.PageRoot>
      <S.Header>
        <S.TitleGroup>
          <S.PageTitle>Content Library</S.PageTitle>
          <S.PageSubtitle>
            {loading ? 'Loading…' : `${totalCount} item${totalCount === 1 ? '' : 's'}`}
          </S.PageSubtitle>
        </S.TitleGroup>
        <S.HeaderRight>
          <S.SearchInput
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <S.CreateButton onClick={() => setShowCreate(true)}>+ Create New</S.CreateButton>
        </S.HeaderRight>
      </S.Header>

      {!loading && totalCount === 0 && !search ? (
        <S.EmptyState>
          <div>Your content library is empty.</div>
          <S.CreateButton onClick={() => setShowCreate(true)}>
            Create your first page
          </S.CreateButton>
        </S.EmptyState>
      ) : (
        CONTENT_CATEGORIES.map((category) => {
          const categoryItems = category.types.flatMap(
            (t) => byType.get(t) ?? [],
          )

          return (
            <S.CategorySection key={category.label}>
              <S.CategoryHeader>
                <S.CategoryLabel>{category.label}</S.CategoryLabel>
                <S.CategoryCount>
                  {categoryItems.length} item{categoryItems.length !== 1 ? 's' : ''}
                </S.CategoryCount>
              </S.CategoryHeader>

              {categoryItems.length === 0 ? (
                <S.EmptyCategory>
                  {search
                    ? `No ${category.label.toLowerCase()} match your search.`
                    : `No ${category.label.toLowerCase()} yet — create one above.`}
                </S.EmptyCategory>
              ) : (
                categoryItems.map((item) => (
                  <ContentRow key={item.id} item={item} />
                ))
              )}
            </S.CategorySection>
          )
        })
      )}

      {showCreate && (
        <CreateModal
          saving={saving}
          onCreate={handleCreate}
          onClose={() => setShowCreate(false)}
        />
      )}
    </S.PageRoot>
  )
}
