import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const purchaseInvoiceStatus = [
  'Draft', 
  'Issued',
  'Return',
  'Debit Note Issued',
  'Paid', 
  'Partially Paid', 
  'Overdue',
  'Voided'
] as const;