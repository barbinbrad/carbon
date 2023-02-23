import { isUrl } from "@carbon/utils";
import { nanoid } from "nanoid";
import type { Editor, Point } from "slate";
import { Transforms } from "slate";
import type { ExternalLink } from "../../../types";
import { ElementType } from "../../../types";
import { deleteMarkup } from "./handleInlineShortcuts";

export default function handleExternalLink(
  editor: Editor,
  result: RegExpMatchArray,
  endOfMatchPoint: Point,
  textToInsertLength: number
): boolean {
  const [, startMark, linkText, middleMark, linkUrl, endMark] = result;

  if (!isUrl(linkUrl)) {
    return false;
  }

  const linkTextRange = deleteMarkup(editor, endOfMatchPoint, {
    startMark: startMark.length,
    text: linkText.length,
    endMark: middleMark.length + linkUrl.length + endMark.length,
    textToInsert: textToInsertLength,
  });
  const link: ExternalLink = {
    id: nanoid(),
    type: ElementType.ExternalLink,
    url: linkUrl,
    children: [],
  };
  Transforms.wrapNodes(editor, link, {
    at: linkTextRange,
    split: true,
  });

  return true;
}
