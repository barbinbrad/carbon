import { nanoid } from "nanoid";
import type { Descendant } from "slate";
import { ElementType } from "../types";

export const getDefaultEditorValue = (): Descendant[] => [
  { id: nanoid(), type: ElementType.Paragraph, children: [{ text: "" }] },
];
