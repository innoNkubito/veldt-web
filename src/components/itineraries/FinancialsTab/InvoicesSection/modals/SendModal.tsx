"use client";

import { useState } from "react";
import { ActionButton } from "@/components/itineraries/shared/ActionButton";
import {
  CheckboxRow,
  Field,
  FieldInput,
  FieldLabel,
} from "@/components/itineraries/shared/FieldPrimitives";
import { formatMoney, type ClientInvoice } from "@/lib/invoices";
import * as S from "../InvoicesSection.styled";

interface Props {
  invoice: ClientInvoice;
  resend: boolean;
  busy: boolean;
  onSend: (to: string, copyToMe: boolean) => Promise<string | null>;
  onClose: () => void;
}

/** Confirms the recipient. Sending numbers and locks the invoice. */
export default function SendModal({
  invoice,
  resend,
  busy,
  onSend,
  onClose,
}: Props) {
  const [to, setTo] = useState(invoice.sentTo ?? invoice.billToEmail ?? "");
  const [copyToMe, setCopyToMe] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (busy) return;
    if (!to.trim()) return setError("Add the email address to send it to.");
    const message = await onSend(to.trim(), copyToMe);
    if (message) setError(message);
    else onClose();
  }

  return (
    <S.Overlay onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <S.ModalCard
        role="dialog"
        aria-modal="true"
        aria-labelledby="invoice-send-title"
      >
        <S.ModalTitle id="invoice-send-title">
          {resend ? `Email ${invoice.number} again` : "Send invoice"}
        </S.ModalTitle>
        <S.ModalText>
          {resend
            ? "The client gets the same link to the invoice."
            : `The invoice for ${formatMoney(invoice.total, invoice.currency)} gets its number and is locked — after this, corrections mean voiding and reissuing. The client is emailed a link to it.`}
        </S.ModalText>
        <Field>
          <FieldLabel htmlFor="invoice-send-to">Send to</FieldLabel>
          <FieldInput
            id="invoice-send-to"
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            autoFocus
          />
        </Field>
        <CheckboxRow>
          <input
            type="checkbox"
            checked={copyToMe}
            onChange={(e) => setCopyToMe(e.target.checked)}
          />
          Email me a copy
        </CheckboxRow>
        {error && <S.ModalError role="alert">{error}</S.ModalError>}
        <S.ModalActions>
          <ActionButton type="button" onClick={onClose}>
            Cancel
          </ActionButton>
          <ActionButton
            type="button"
            $variant="primary"
            $disabled={busy}
            disabled={busy}
            onClick={submit}
          >
            {busy ? "Sending…" : resend ? "Send again" : "Send invoice"}
          </ActionButton>
        </S.ModalActions>
      </S.ModalCard>
    </S.Overlay>
  );
}
