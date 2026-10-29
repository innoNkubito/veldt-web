import { useEffect, useState } from 'react'
import { useBuilderStore } from '@/stores/builderStore'
import type { IssuesState, PublishModalProps } from './PublishModal.types'

/** Checks what still blocks publishing each time the modal opens. */
export function usePublishModal({ itineraryId }: Pick<PublishModalProps, 'itineraryId'>) {
  const fetchPublishIssues = useBuilderStore((s) => s.fetchPublishIssues)
  const [state, setState] = useState<IssuesState>({ status: 'checking' })

  useEffect(() => {
    let live = true
    fetchPublishIssues(itineraryId).then((result) => {
      if (!live) return
      setState(
        result.ok
          ? { status: 'ready', issues: result.issues }
          : { status: 'unknown', error: result.error },
      )
    })
    return () => {
      live = false
    }
  }, [itineraryId, fetchPublishIssues])

  const issues = state.status === 'ready' ? state.issues : []
  return {
    state,
    issues,
    blocked: issues.length > 0,
    canPublish: state.status !== 'checking' && issues.length === 0,
  }
}
