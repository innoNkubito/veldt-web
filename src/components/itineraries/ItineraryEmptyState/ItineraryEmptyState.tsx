'use client'

import { T } from '@/lib/theme'
import { StatusTab } from '@/lib/itinerary-constants'
import * as S from './ItineraryEmptyState.styled'

interface Props {
  activeTab: StatusTab
  onCreateNew: () => void
}

export default function ItineraryEmptyState({ activeTab, onCreateNew }: Props) {
  return (
    <S.Root>
      <S.IconCircle>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke={T.muted}
          strokeWidth="1.8"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="18" x2="12" y2="12" />
          <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
      </S.IconCircle>
      <div>
        <S.Title>
          {activeTab === 'ALL' ? 'No itineraries yet' : `No ${activeTab.toLowerCase()} itineraries`}
        </S.Title>
        <S.Text>
          {activeTab === 'ALL'
            ? 'Create your first itinerary to get started'
            : `Itineraries with ${activeTab.toLowerCase()} status will appear here`}
        </S.Text>
      </div>
      {activeTab === 'ALL' && (
        <S.CreateButton onClick={onCreateNew}>+ Create Itinerary</S.CreateButton>
      )}
    </S.Root>
  )
}
