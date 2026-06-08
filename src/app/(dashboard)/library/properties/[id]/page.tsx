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

type DetailTab = 'details' | 'content' | 'rooms'

const TABS: { key: DetailTab; label: string }[] = [
  { key: 'details', label: 'Details' },
  { key: 'content', label: 'Page Content' },
  { key: 'rooms', label: 'Rooms' },
]

export default function PropertyDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
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
    <S.PageRoot>
      <S.BackLink onClick={() => router.push('/library/properties')}>← Properties</S.BackLink>

      <S.Header>
        <div>
          <S.PageTitle>{property!.name}</S.PageTitle>
          <S.HeaderMeta>
            {[property!.area?.name, property!.country].filter(Boolean).join(' · ') || 'No location set'}
          </S.HeaderMeta>
        </div>
        <S.HeaderActions>
          {saving && <S.SaveIndicator>Saving…</S.SaveIndicator>}
          {confirmDelete ? (
            <>
              <span style={{ fontSize: 12, color: '#dc2626' }}>Are you sure?</span>
              <S.DeleteButton onClick={handleDelete}>Yes, delete</S.DeleteButton>
              <S.DeleteButton
                style={{ borderColor: 'var(--border)', color: 'inherit' }}
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </S.DeleteButton>
            </>
          ) : (
            <S.DeleteButton onClick={() => setConfirmDelete(true)}>Delete</S.DeleteButton>
          )}
        </S.HeaderActions>
      </S.Header>

      <S.TabBar>
        {TABS.map(({ key, label }) => (
          <S.Tab key={key} $active={activeTab === key} onClick={() => setActiveTab(key)}>
            {key === 'rooms' ? `${label} (${property!.rooms.length})` : label}
          </S.Tab>
        ))}
      </S.TabBar>

      {activeTab === 'details' && <DetailsTab property={property!} getToken={getToken} />}
      {activeTab === 'content' && <PageContentTab property={property!} />}
      {activeTab === 'rooms' && <RoomsTab property={property!} />}
    </S.PageRoot>
  )
}
