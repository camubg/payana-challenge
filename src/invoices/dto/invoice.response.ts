import { InvoiceItemResponse } from './invoice-item.response';

export class InvoiceResponse {
  invoiceId: number;
  clientId: number;
  clientName: string;
  clientEmail: string;
  items: InvoiceItemResponse[];
  total: number;
  createdAt: Date;
}
