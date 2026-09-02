'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAreaStore } from '@/stores/areaStore'
import { useClientStore } from '@/stores/clientStore'
import AreaDetailsTab from './tabs/DetailsTab'
import AreaPageContentTab from './tabs/AreaPageContentTab'
import * as S from './page.styled'
import { routeParam } from '@/lib/guards'

type AreaTab = 'details' | 'content'

const TABS: { key: AreaTab; label: string }[] = [
  { key: 'details', label: 'Details' },
  { key: 'content', label: 'New Page' },
]

export default function AreaDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = routeParam(params?.id)

  const client = useClientStore((s) => s.client)
  const { area, areaLoading, saving, fetchArea, deleteArea } = useAreaStore()

  const [activeTab, setActiveTab] = useState<AreaTab>('details')
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (client && id) fetchArea(id)
  }, [client, id])

  async function handleDelete() {
    await deleteArea(id)
    router.push('/library/areas')
  }

  if (areaLoading) {
    return <S.CenteredState>Loading area…</S.CenteredState>
  }

  if (!areaLoading && !area) {
    return <S.CenteredState>Area not found</S.CenteredState>
  }

  return (
    <S.EditorRoot>
      {/* ── Top bar ──────────────────────────────────────────── */}
      <S.EditorTopBar>
        <S.TopBarLeft>
          <S.BackBtn onClick={() => router.push('/library/areas')} title="Back to areas">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </S.BackBtn>
          <div>
            <S.TopBarTitle>{area!.name}</S.TopBarTitle>
            <S.TopBarSub>Area</S.TopBarSub>
          </div>
        </S.TopBarLeft>

        <S.TopBarTabs>
          {TABS.map(({ key, label }) => (
            <S.TopBarTab key={key} $active={activeTab === key} onClick={() => setActiveTab(key)}>
              {label}
            </S.TopBarTab>
          ))}
        </S.TopBarTabs>

        <S.TopBarRight>
          {saving && <S.SavingBadge>Saving…</S.SavingBadge>}
          {confirmDelete ? (
            <>
              <span style={{ fontSize: 12, color: '#dc2626' }}>Delete this area?</span>
              <S.TopBarBtn $danger onClick={handleDelete}>Yes, delete</S.TopBarBtn>
              <S.TopBarBtn onClick={() => setConfirmDelete(false)}>Cancel</S.TopBarBtn>
            </>
          ) : (
            <S.TopBarBtn $danger onClick={() => setConfirmDelete(true)}>Delete</S.TopBarBtn>
          )}
        </S.TopBarRight>
      </S.EditorTopBar>

      {/* ── Tab content ─────────────────────────────────────── */}
      <S.EditorBody>
        {activeTab === 'details' && (
          <S.TabBody>
            <AreaDetailsTab area={area!} />
          </S.TabBody>
        )}
        {activeTab === 'content' && (
          <AreaPageContentTab area={area!} />
        )}
      </S.EditorBody>
    </S.EditorRoot>
  )
}
