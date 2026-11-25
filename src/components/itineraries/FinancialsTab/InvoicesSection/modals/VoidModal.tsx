"use client";

import { useState } from "react";
import { ActionButton } from "@/components/itineraries/shared/ActionButton";
import {
  Field,
  FieldInput,
  FieldLabel,
} from "@/components/itineraries/shared/FieldPrimitives";
import type { ClientInvoice } from "@/lib/invoices";
import * as S from "../InvoicesSection.styled";

interface Props {
  invoice: ClientInvoice;
  busy: boolean;
  onVoid: (reason: string) => Promise<string | null>;
  onClose: () => void;
}

/** Voiding needs a reason; the client still sees the invoice, stamped void. */
export default function VoidModal({ invoice, busy, onVoid, onClose }: Props) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (busy) return;
    if (!reason.trim()) return setError("Say why — the client sees it.");
    const message = await onVoid(reason.trim());
    if (message) setError(message);
    else onClose();
  }

  return (
    <S.Overlay onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <S.ModalCard
        role="dialog"
        aria-modal="true"
        aria-labelledby="invoice-void-title"
      >
        <S.ModalTitle id="invoice-void-title">
          Void {invoice.number}?
        </S.ModalTitle>
        <S.ModalText>
          It can’t be undone. The client’s link keeps working and shows the
          invoice as void. To bill again, reissue it as a new draft
          {invoice.amountPaid > 0
            ? " — payments already received carry over"
            : ""}
          .
        </S.ModalText>
        <Field>
          <FieldLabel htmlFor="invoice-void-reason">Reason</FieldLabel>
          <FieldInput
            id="invoice-void-reason"
            value={reason}
            maxLength={300}
            placeholder="e.g. Wrong number of guests"
            onChange={(e) => setReason(e.target.value)}
            autoFocus
          />
        </Field>
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
            {busy ? "Voiding…" : "Void invoice"}
          </ActionButton>
        </S.ModalActions>
      </S.ModalCard>
    </S.Overlay>
  );
}
