"use client";

import { ActionButton } from "@/components/itineraries/shared/ActionButton";
import InvoiceDocument from "@/components/invoices/InvoiceDocument";
import {
  formatDay,
  formatMoney,
  invoicePageUrl,
  type ClientInvoice,
} from "@/lib/invoices";
import { METHODS } from "./InvoicesSection.constants";
import { StatusBadges } from "./InvoiceList";
import type { InvoicesSectionModel } from "./useInvoicesSection";
import { documentFromInvoice } from "./InvoicesSection.utils";
import * as S from "./InvoicesSection.styled";

const methodLabel = (method: string) =>
  METHODS.find((m) => m.value === method)?.label ?? method;

/** A sent (or void) invoice: what's owed, its payments, and what can still be done with it. */
export default function InvoiceDetail({
  invoice,
  model,
}: {
  invoice: ClientInvoice;
  model: InvoicesSectionModel;
}) {
  const money = (n: number) => formatMoney(n, invoice.currency);
  const url = invoicePageUrl(invoice.publicToken);
  const busy = model.busy === invoice.id;
  const live = invoice.status !== "VOID";
  const canPay =
    model.canEdit &&
    live &&
    invoice.status !== "PAID" &&
    invoice.acceptsManualPayments;

  return (
    <>
      <S.Toolbar>
        <S.Back type="button" onClick={model.closeInvoice}>
          ← All invoices
        </S.Back>
        <S.ToolbarTitle>
          <S.Mono>{invoice.number}</S.Mono>
        </S.ToolbarTitle>
        <StatusBadges invoice={invoice} />
      </S.Toolbar>

      <S.Split>
        <div>
          <S.Card>
            <S.PanelTitle>Summary</S.PanelTitle>
            <S.Facts>
              <dt>Total</dt>
              <dd>{money(invoice.total)}</dd>
              <dt>Paid</dt>
              <dd>{money(invoice.amountPaid)}</dd>
              <dt>Still due</dt>
              <dd>{money(invoice.amountDue)}</dd>
              {invoice.nextDueDate && live && (
                <>
                  <dt>Next payment</dt>
                  <dd>
                    {money(invoice.nextDueAmount ?? 0)} by{" "}
                    {formatDay(invoice.nextDueDate)}
                  </dd>
                </>
              )}
              <dt>Sent</dt>
              <dd>
                {formatDay(invoice.issuedAt)}
                {invoice.sentTo ? ` to ${invoice.sentTo}` : ""}
              </dd>
              {invoice.bookingReference && (
                <>
                  <dt>Booking</dt>
                  <dd>{invoice.bookingReference}</dd>
                </>
              )}
            </S.Facts>

            {invoice.status === "VOID" && (
              <S.Muted>
                Voided{" "}
                {invoice.voidedAt
                  ? formatDay(invoice.voidedAt.slice(0, 10))
                  : ""}
                : {invoice.voidReason}
                {invoice.replacedById &&
                  ` · reissued as ${invoice.replacedByNumber ?? "a draft"}`}
              </S.Muted>
            )}
            {invoice.replacesNumber && (
              <S.Muted>Replaces {invoice.replacesNumber}.</S.Muted>
            )}

            {invoice.status === "DRAFT" ? (
              <S.Muted>This draft hasn’t been sent yet.</S.Muted>
            ) : (
              <>
                <S.LinkText>{url}</S.LinkText>
                <S.Actions>
                  <ActionButton
                    type="button"
                    onClick={() => model.copyLink(invoice, url)}
                  >
                    Copy link
                  </ActionButton>
                  <ActionButton
                    type="button"
                    onClick={() => window.open(url, "_blank", "noopener")}
                  >
                    Open client view
                  </ActionButton>
                  {model.canEdit && live && (
                    <ActionButton
                      type="button"
                      onClick={() =>
                        model.setModal({ kind: "send", invoice, resend: true })
                      }
                      disabled={busy}
                      $disabled={busy}
                    >
                      Email again
                    </ActionButton>
                  )}
                  {model.canEdit && live && (
                    <ActionButton
                      type="button"
                      onClick={() => model.setModal({ kind: "void", invoice })}
                      disabled={busy}
                      $disabled={busy}
                    >
                      Void
                    </ActionButton>
                  )}
                  {model.canEdit &&
                    invoice.status === "VOID" &&
                    !invoice.replacedById && (
                      <ActionButton
                        type="button"
                        $variant="primary"
                        onClick={() => model.reissue(invoice)}
                        disabled={busy}
                        $disabled={busy}
                      >
                        Reissue
                      </ActionButton>
                    )}
                  {invoice.replacedById && (
                    <ActionButton
                      type="button"
                      onClick={() => model.openInvoice(invoice.replacedById!)}
                    >
                      Open {invoice.replacedByNumber ?? "replacement"}
                    </ActionButton>
                  )}
                </S.Actions>
              </>
            )}
          </S.Card>

          <S.Card>
            <S.Row>
              <S.PanelTitle>Payments</S.PanelTitle>
              {canPay && (
                <ActionButton
                  type="button"
                  $variant="primary"
                  onClick={() => model.setModal({ kind: "payment", invoice })}
                  disabled={busy}
                  $disabled={busy}
                >
                  Record payment
                </ActionButton>
              )}
            </S.Row>
            {invoice.payments.length === 0 ? (
              <S.Muted>No payments yet.</S.Muted>
            ) : (
              <S.Payments>
                {invoice.payments.map((p) => (
                  <S.Payment key={p.id}>
                    <strong>{money(p.amount)}</strong>
                    <S.Grow>
                      {formatDay(p.paidAt)} ·{" "}
                      {p.fromBooking
                        ? "via the booking"
                        : methodLabel(p.method)}
                      {p.reference ? ` · ${p.reference}` : ""}
                    </S.Grow>
                    {model.canEdit && live && !p.fromBooking && (
                      <S.DangerLink
                        type="button"
                        disabled={busy}
                        onClick={() => model.deletePayment(invoice, p.id)}
                      >
                        Remove
                      </S.DangerLink>
                    )}
                  </S.Payment>
                ))}
              </S.Payments>
            )}
            {!invoice.acceptsManualPayments && live && (
              <S.Muted>
                Paid through booking {invoice.bookingReference ?? ""} — its
                installments appear here as they’re paid.
              </S.Muted>
            )}
          </S.Card>
        </div>

        <S.Sticky>
          <InvoiceDocument
            invoice={documentFromInvoice(invoice, model.tripTitle)}
          />
        </S.Sticky>
      </S.Split>
    </>
  );
}
