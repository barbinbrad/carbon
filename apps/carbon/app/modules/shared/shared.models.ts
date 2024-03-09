import { z } from "zod";
import { zfd } from "zod-form-data";

export const noteValidator = z.object({
  id: zfd.text(z.string().optional()),
  documentId: z.string().min(1),
  note: z.string().min(1, { message: "Note is required" }),
});

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;
