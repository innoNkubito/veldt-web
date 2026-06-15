'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useActivityStore } from '@/stores/activityStore'
import { useClientStore } from '@/stores/clientStore'
import ActivityDetailsTab from './tabs/DetailsTab'
import ActivityPageContentTab from './tabs/ActivityPageContentTab'
import * as S from './page.styled'

type ActivityTab = 'details' | 'content'

const TABS: { key: ActivityTab; label: string }[] = [
  { key: 'details', label: 'Details' },
  { key: 'content', label: 'New Page' },
]

export default function ActivityDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const client = useClientStore((s) => s.client)
  const { activity, activityLoading, saving, fetchActivity, deleteActivity } = useActivityStore()

  const [activeTab, setActiveTab] = useState<ActivityTab>('details')
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (client && id) fetchActivity(id)
  }, [client, id])

  async function handleDelete() {
    await deleteActivity(id)
    router.push('/library/activities')
  }

  if (activityLoading) return <S.CenteredState>Loading activity…</S.CenteredState>
  if (!activityLoading && !activity) return <S.CenteredState>Activity not found</S.CenteredState>

  return (
    <S.EditorRoot>
      <S.EditorTopBar>
        <S.TopBarLeft>
          <S.BackBtn onClick={() => router.push('/library/activities')} title="Back to activities">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </S.BackBtn>
          <div>
            <S.TopBarTitle>{activity!.name}</S.TopBarTitle>
            <S.TopBarSub>Activity</S.TopBarSub>
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
              <span style={{ fontSize: 12, color: '#dc2626' }}>Delete this activity?</span>
              <S.TopBarBtn $danger onClick={handleDelete}>Yes, delete</S.TopBarBtn>
              <S.TopBarBtn onClick={() => setConfirmDelete(false)}>Cancel</S.TopBarBtn>
            </>
          ) : (
            <S.TopBarBtn $danger onClick={() => setConfirmDelete(true)}>Delete</S.TopBarBtn>
          )}
        </S.TopBarRight>
      </S.EditorTopBar>

      <S.EditorBody>
        {activeTab === 'details' && (
          <S.TabBody>
            <ActivityDetailsTab activity={activity!} />
          </S.TabBody>
        )}
        {activeTab === 'content' && (
          <ActivityPageContentTab activity={activity!} />
        )}
      </S.EditorBody>
    </S.EditorRoot>
  )
}
