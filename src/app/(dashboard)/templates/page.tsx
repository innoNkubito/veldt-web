'use client'

import TemplateDetailsModal from '@/components/itineraries/TemplateDetailsModal'
import UseTemplateModal from '@/components/itineraries/UseTemplateModal'
import { ActionButton } from '@/components/itineraries/shared/ActionButton'
import TemplateCard from './TemplateCard'
import * as S from './page.styled'
import { useTemplatesPage } from './useTemplatesPage'
import { COPY } from './page.constants'
import { displayName } from './page.utils'

export default function TemplatesPage() {
  const page = useTemplatesPage()

  return (
    <S.PageRoot>
      <S.PageHead>
        <div>
          <S.PageTitle>{COPY.title}</S.PageTitle>
          <S.PageSub>{COPY.subtitle}</S.PageSub>
        </div>
        <S.Controls>
          <S.SearchInput
            value={page.search}
            placeholder={COPY.search}
            onChange={(e) => page.setSearch(e.target.value)}
          />
          <S.Toggle>
            <input
              type="checkbox"
              checked={page.includeArchived}
              onChange={(e) => page.setIncludeArchived(e.target.checked)}
            />
            {COPY.showArchived}
          </S.Toggle>
          <ActionButton $variant="primary" onClick={page.openPicker}>
            {COPY.newFromTemplate}
          </ActionButton>
        </S.Controls>
      </S.PageHead>

      {page.tags.length > 0 && (
        <S.TagBar>
          <S.TagChip $active={page.tag === null} onClick={() => page.setTag(null)}>
            {COPY.allTags}
          </S.TagChip>
          {page.tags.map((tag) => (
            <S.TagChip key={tag} $active={page.tag === tag} onClick={() => page.setTag(tag)}>
              {tag}
            </S.TagChip>
          ))}
        </S.TagBar>
      )}

      {page.error && <S.Notice $error>{page.error}</S.Notice>}
      {page.notice && <S.Notice $error={page.notice.error}>{page.notice.text}</S.Notice>}

      {page.loading && page.templates.length === 0 ? (
        <S.EmptyState>{COPY.loading}</S.EmptyState>
      ) : page.templates.length === 0 ? (
        <S.EmptyState>
          {page.hasFilters ? (
            COPY.noMatches
          ) : (
            <>
              <S.EmptyTitle>{COPY.emptyTitle}</S.EmptyTitle>
              {COPY.emptyBody}
            </>
          )}
        </S.EmptyState>
      ) : (
        <S.Grid>
          {page.templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              busy={page.saving}
              onUse={() => page.startUsing(template)}
              onOpen={() => page.open(template)}
              onEditDetails={() => page.startEditing(template)}
              onDuplicate={() => page.duplicateTemplate(template)}
              onToggleArchived={() => page.toggleArchived(template)}
              onDelete={() => page.deleteTemplate(template)}
            />
          ))}
        </S.Grid>
      )}

      {page.editing && (
        <TemplateDetailsModal
          mode="edit"
          initial={{
            name: displayName(page.editing),
            description: page.editing.templateDescription,
            tags: page.editing.templateTags,
          }}
          onClose={page.stopEditing}
          onSubmit={page.saveDetails}
        />
      )}
      {page.using && <UseTemplateModal template={page.using} onClose={page.stopUsing} />}
      {page.pickerOpen && <UseTemplateModal onClose={page.closePicker} />}
    </S.PageRoot>
  )
}
