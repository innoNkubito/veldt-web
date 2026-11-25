"use client";

import { formatDay, formatMoney } from "@/lib/invoices";
import { COPY, STAGE_STATE } from "./InvoiceDocument.constants";
import type { InvoiceDocumentData } from "./InvoiceDocument.types";
import * as S from "./InvoiceDocument.styled";

/**
 * The invoice as the client sees it. Used for the builder's live preview and
 * the client's /invoice page, so both always match.
 */
export default function InvoiceDocument({
  invoice,
}: {
  invoice: InvoiceDocumentData;
}) {
  const money = (n: number) => formatMoney(n, invoice.currency);
  const { issuer } = invoice;
  const contact = [issuer.email, issuer.phone].filter(Boolean).join(" · ");

  return (
    <S.Paper
      aria-label={
        invoice.number ? `Invoice ${invoice.number}` : "Invoice preview"
      }
    >
      {invoice.status === "PAID" && (
        <S.Stamp $tone="paid">{COPY.stampPaid}</S.Stamp>
      )}
      {invoice.status === "VOID" && (
        <S.Stamp $tone="void">{COPY.stampVoid}</S.Stamp>
      )}

      <S.Head>
        <div>
          {issuer.logoUrl && <S.Logo src={issuer.logoUrl} alt="" />}
          <S.IssuerName>{issuer.name}</S.IssuerName>
          {issuer.address && <S.Small>{issuer.address}</S.Small>}
          {contact && <S.Small>{contact}</S.Small>}
          {issuer.taxId && (
            <S.Small>
              {COPY.taxId}: {issuer.taxId}
            </S.Small>
          )}
        </div>
        <S.TitleBlock>
          <S.Title>{COPY.invoice}</S.Title>
          <S.InvoiceNumber>{invoice.number ?? COPY.draft}</S.InvoiceNumber>
        </S.TitleBlock>
      </S.Head>

      <S.Meta>
        <div>
          <S.MetaLabel>{COPY.billTo}</S.MetaLabel>
          <div>{invoice.billToName || "—"}</div>
          {invoice.billToAddress && <S.Small>{invoice.billToAddress}</S.Small>}
          {invoice.billToEmail && <S.Small>{invoice.billToEmail}</S.Small>}
        </div>
        <S.MetaRight>
          {invoice.issuedAt && (
            <div>
              <S.MetaLabel>{COPY.issued}</S.MetaLabel>
              <div>{formatDay(invoice.issuedAt)}</div>
            </div>
          )}
          {invoice.tripTitle && (
            <div>
              <S.MetaLabel>{COPY.trip}</S.MetaLabel>
              <div>{invoice.tripTitle}</div>
            </div>
          )}
        </S.MetaRight>
      </S.Meta>

      {invoice.lines.length === 0 ? (
        <S.Empty>{COPY.noLines}</S.Empty>
      ) : (
        <S.Table>
          <thead>
            <tr>
              <th>{COPY.description}</th>
              <th className="num">{COPY.qty}</th>
              <th className="num">{COPY.price}</th>
              <th className="num">{COPY.tax}</th>
              <th className="num">{COPY.amount}</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lines.map((line, i) => (
              <tr key={i}>
                <td>{line.description}</td>
                <td className="num">{line.quantity}</td>
                <td className="num">{money(line.unitPrice)}</td>
                <td className="num">
                  {line.taxRate ? `${line.taxRate}%` : "—"}
                </td>
                <td className="num">{money(line.lineTotal)}</td>
              </tr>
            ))}
          </tbody>
        </S.Table>
      )}

      <S.Totals>
        <S.TotalRow>
          <span>{COPY.subtotal}</span>
          <span>{money(invoice.subtotal)}</span>
        </S.TotalRow>
        {invoice.taxes.map((t) => (
          <S.TotalRow key={t.rate}>
            <span>{COPY.taxAt(t.rate)}</span>
            <span>{money(t.tax)}</span>
          </S.TotalRow>
        ))}
        <S.TotalRow $strong>
          <span>{COPY.total}</span>
          <span>{money(invoice.total)}</span>
        </S.TotalRow>
        {invoice.amountPaid > 0 && (
          <>
            <S.TotalRow>
              <span>{COPY.paid}</span>
              <span>−{money(invoice.amountPaid)}</span>
            </S.TotalRow>
            <S.TotalRow $strong>
              <span>{COPY.due}</span>
              <span>{money(invoice.amountDue)}</span>
            </S.TotalRow>
          </>
        )}
      </S.Totals>

      {invoice.stages.length > 0 && (
        <S.Block>
          <S.BlockTitle>{COPY.schedule}</S.BlockTitle>
          <S.Table>
            <tbody>
              {invoice.stages.map((stage, i) => {
                const state = STAGE_STATE[stage.state];
                return (
                  <tr key={i}>
                    <td>{stage.label}</td>
                    <td>{formatDay(stage.dueDate)}</td>
                    <td className="num">{money(stage.amount)}</td>
                    <td className="num">
                      {invoice.status !== "DRAFT" &&
                        invoice.status !== "VOID" && (
                          <S.StageState $color={state.color}>
                            {state.label}
                          </S.StageState>
                        )}
                      {stage.payHref && (
                        <S.PayLink href={stage.payHref}>{COPY.pay}</S.PayLink>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </S.Table>
        </S.Block>
      )}

      {invoice.showBankDetails && issuer.bankDetails && (
        <S.Block>
          <S.BlockTitle>{COPY.bank}</S.BlockTitle>
          <S.Small>{issuer.bankDetails}</S.Small>
        </S.Block>
      )}

      {invoice.notes && (
        <S.Block>
          <S.BlockTitle>{COPY.notes}</S.BlockTitle>
          <S.Rich dangerouslySetInnerHTML={{ __html: invoice.notes }} />
        </S.Block>
      )}
      {invoice.terms && (
        <S.Block>
          <S.BlockTitle>{COPY.terms}</S.BlockTitle>
          <S.Rich dangerouslySetInnerHTML={{ __html: invoice.terms }} />
        </S.Block>
      )}
    </S.Paper>
  );
}
