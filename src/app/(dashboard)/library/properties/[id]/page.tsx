'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useContentLibraryStore } from '@/stores/contentLibraryStore'
import { useClientStore } from '@/stores/clientStore'
import { useAuth } from '@clerk/nextjs'
import DetailsTab from './tabs/DetailsTab'
import PageContentTab from './tabs/PageContentTab'
import RoomsTab from './tabs/RoomsTab'
import * as S from './page.styled'
import { routeParam } from '@/lib/guards'

type DetailTab = 'details' | 'rooms' | 'content'

const TABS: { key: DetailTab; label: string }[] = [
  { key: 'details', label: 'Details' },
  { key: 'rooms', label: 'Rooms' },
  { key: 'content', label: 'New Page' },
]

export default function PropertyDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = routeParam(params?.id)
  const { getToken } = useAuth()

  const client = useClientStore((s) => s.client)
  const { property, propertyLoading, saving, fetchProperty, deleteProperty } =
    useContentLibraryStore()

  const [activeTab, setActiveTab] = useState<DetailTab>('details')
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (client && id) fetchProperty(id)
  }, [client, id])

  async function handleDelete() {
    await deleteProperty(id)
    router.push('/library/properties')
  }

  if (propertyLoading) {
    return <S.CenteredState>Loading property…</S.CenteredState>
  }

  if (!propertyLoading && !property) {
    return <S.CenteredState>Property not found</S.CenteredState>
  }

  return (
    <S.EditorRoot>
      {/* ── Top bar ──────────────────────────────────────────── */}
      <S.EditorTopBar>
        <S.TopBarLeft>
          <S.BackBtn onClick={() => router.push('/library/properties')} title="Back to properties">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </S.BackBtn>
          <div>
            <S.TopBarTitle>{property!.name}</S.TopBarTitle>
            <S.TopBarSub>Property</S.TopBarSub>
          </div>
        </S.TopBarLeft>

        <S.TopBarTabs>
          {TABS.map(({ key, label }) => (
            <S.TopBarTab
              key={key}
              $active={activeTab === key}
              onClick={() => setActiveTab(key)}
            >
              {key === 'rooms' ? `Rooms (${property!.rooms.length})` : label}
            </S.TopBarTab>
          ))}
        </S.TopBarTabs>

        <S.TopBarRight>
          {saving && <S.SavingBadge>Saving…</S.SavingBadge>}
          {confirmDelete ? (
            <>
              <span style={{ fontSize: 12, color: '#dc2626' }}>Delete this property?</span>
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
            <DetailsTab property={property!} getToken={getToken} />
          </S.TabBody>
        )}
        {activeTab === 'rooms' && (
          <S.TabBody>
            <RoomsTab property={property!} />
          </S.TabBody>
        )}
        {activeTab === 'content' && (
          <PageContentTab property={property!} />
        )}
      </S.EditorBody>
    </S.EditorRoot>
  )
}
