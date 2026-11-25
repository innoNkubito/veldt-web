import type {
  ClientInvoiceIssuer,
  ClientInvoiceStageState,
  ClientInvoiceStatus,
} from "@/lib/invoices";

/** Everything the printed invoice shows — built from a saved invoice or a draft being edited. */
export interface InvoiceDocumentData {
  number: string | null;
  status: ClientInvoiceStatus;
  currency: string;
  issuer: ClientInvoiceIssuer;
  tripTitle: string | null;
  billToName: string;
  billToEmail: string | null;
  billToAddress: string | null;
  issuedAt: string | null;
  lines: {
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate: number;
    lineTotal: number;
  }[];
  taxes: { rate: number; taxable: number; tax: number }[];
  subtotal: number;
  taxTotal: number;
  total: number;
  amountPaid: number;
  amountDue: number;
  stages: {
    label: string;
    dueDate: string;
    amount: number;
    state: ClientInvoiceStageState;
    payHref?: string | null;
  }[];
  notes: string | null;
  terms: string | null;
  /** Shown when nothing on the invoice can be paid online. */
  showBankDetails: boolean;
}
