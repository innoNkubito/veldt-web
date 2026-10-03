'use client'

import * as S from './ContactsTab.styled'
import { ActionButton } from '@/components/itineraries/shared/ActionButton'
import {
  Field,
  FieldGroup,
  FieldInput,
  FieldLabel,
  FieldSelect,
} from '@/components/itineraries/shared/FieldPrimitives'
import { useContactsTab } from './useContactsTab'
import { CONTACT_TYPES, COPY } from './ContactsTab.constants'
import { contactTitle, contactsOfType } from './ContactsTab.utils'
import type { ContactsTabProps } from './ContactsTab.types'

/** A property's contacts. Emergency ones reach travellers' dashboards. */
export default function ContactsTab(props: ContactsTabProps) {
  const tab = useContactsTab(props)
  const typeHint = CONTACT_TYPES.find((t) => t.value === tab.form.contactType)?.hint

  return (
    <S.Layout>
      <S.Card>
        <S.CardTitle>{tab.editingId ? COPY.formTitleEdit : COPY.formTitleAdd}</S.CardTitle>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="contact-type">{COPY.type}</FieldLabel>
            <FieldSelect
              id="contact-type"
              value={tab.form.contactType}
              onChange={(e) => {
                const match = CONTACT_TYPES.find((t) => t.value === e.target.value)
                if (match) tab.setType(match.value)
              }}
            >
              {CONTACT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </FieldSelect>
            {typeHint && <S.TypeHint>{typeHint}</S.TypeHint>}
          </Field>
          <Field>
            <FieldLabel htmlFor="contact-role">{COPY.role}</FieldLabel>
            <FieldInput
              id="contact-role"
              value={tab.form.role}
              placeholder={COPY.rolePlaceholder}
              onChange={(e) => tab.setField('role', e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="contact-name">{COPY.name}</FieldLabel>
            <FieldInput id="contact-name" value={tab.form.name} onChange={(e) => tab.setField('name', e.target.value)} />
          </Field>
          <Field>
            <FieldLabel htmlFor="contact-phone">{COPY.phone}</FieldLabel>
            <FieldInput id="contact-phone" type="tel" value={tab.form.phone} onChange={(e) => tab.setField('phone', e.target.value)} />
          </Field>
          <Field>
            <FieldLabel htmlFor="contact-email">{COPY.email}</FieldLabel>
            <FieldInput id="contact-email" type="email" value={tab.form.email} onChange={(e) => tab.setField('email', e.target.value)} />
          </Field>
        </FieldGroup>
        {tab.error && <S.ErrorText>{tab.error}</S.ErrorText>}
        <S.Actions>
          <ActionButton $variant="primary" onClick={tab.save} $disabled={tab.saving} disabled={tab.saving}>
            {tab.editingId ? COPY.save : COPY.add}
          </ActionButton>
          {tab.editingId && <ActionButton onClick={tab.reset}>{COPY.cancel}</ActionButton>}
        </S.Actions>
      </S.Card>

      <S.Card>
        {props.property.contacts.length === 0 && <S.Empty>{COPY.empty}</S.Empty>}
        {CONTACT_TYPES.map((type) => {
          const contacts = contactsOfType(props.property.contacts, type.value)
          if (contacts.length === 0) return null
          return (
            <S.Group key={type.value}>
              <S.GroupLabel>{type.label}</S.GroupLabel>
              {contacts.map((contact) => (
                <S.Row key={contact.id} $active={tab.editingId === contact.id}>
                  <div>
                    <S.RowTitle>{contactTitle(contact)}</S.RowTitle>
                    <S.RowMeta>{[contact.phone, contact.email].filter(Boolean).join(' · ')}</S.RowMeta>
                  </div>
                  <S.RowActions>
                    <ActionButton $variant="ghost" onClick={() => tab.startEdit(contact)}>{COPY.edit}</ActionButton>
                    <ActionButton $variant="ghost" onClick={() => tab.remove(contact)}>{COPY.delete}</ActionButton>
                  </S.RowActions>
                </S.Row>
              ))}
            </S.Group>
          )
        })}
      </S.Card>
    </S.Layout>
  )
}
