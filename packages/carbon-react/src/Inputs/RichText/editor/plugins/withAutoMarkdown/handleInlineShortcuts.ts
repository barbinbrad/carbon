import type { Point } from "slate";
import { Editor, Range } from "slate";
import { ElementType, Mark } from "../../../types";
import { isMark } from "../../formatting";
import { deleteText } from "../../transforms";
import handleMark from "./handleMark";
import handleExternalLink from "./handleExternalLink";
import handleTag from "./handleTag";

export const BLOCK_REFERENCE_REGEX = /(?:^|\s)(\(\()(.+)(\)\))/;
const INLINE_SHORTCUTS: Array<{
  match: RegExp;
  type: Mark | ElementType.ExternalLink | ElementType.Tag;
}> = [
  { match: /(?:^|\s)(\*\*)([^*]+)(\*\*)/, type: Mark.Bold },
  { match: /(?:^|\s)(__)([^_]+)(__)/, type: Mark.Bold },
  { match: /(?:^|\s)(\*)([^*]+)(\*)/, type: Mark.Italic },
  { match: /(?:^|\s)(_)([^_]+)(_)/, type: Mark.Italic },
  { match: /(?:^|\s)(`)([^`]+)(`)/, type: Mark.Code },
  { match: /(?:^|\s)(~~)([^~]+)(~~)/, type: Mark.Strikethrough },
  { match: /(?:^|\s)(\[)(.+)(\]\()(.+)(\))/, type: ElementType.ExternalLink },
  {
    match: /(?:^|\s)(#[^\s]+)(\s)/,
    type: ElementType.Tag,
  },
];

// Handle inline shortcuts
const handleInlineShortcuts = (editor: Editor, text: string): boolean => {
  if (!editor.selection || !Range.isCollapsed(editor.selection)) {
    return false;
  }

  for (const shortcut of INLINE_SHORTCUTS) {
    const { match, type } = shortcut;

    const selectionAnchor = editor.selection.anchor;
    const elementStart = Editor.start(editor, selectionAnchor.path);
    const elementRange = { anchor: selectionAnchor, focus: elementStart };
    const elementText = Editor.string(editor, elementRange) + text;
    const result = elementText.match(match);

    if (!result || result.index === undefined) {
      continue;
    }

    const wholeMatch = result[0];
    const endOfMatchOffset = result.index + wholeMatch.length - text.length; // Make sure to subtract text length since it's not in the editor
    const endOfMatchPoint: Point = {
      offset: endOfMatchOffset,
      path: selectionAnchor.path,
    };

    // Continue if the match does not end at the current selection
    // Ensures that we only just triggered the auto markdown with the text we inserted
    if (endOfMatchOffset !== editor.selection.anchor.offset) {
      continue;
    }

    let handled = false;
    if (isMark(type)) {
      handled = handleMark(editor, type, result, endOfMatchPoint, text.length);
    } else if (type === ElementType.ExternalLink) {
      handled = handleExternalLink(
        editor,
        result,
        endOfMatchPoint,
        text.length
      );
    } else if (type === ElementType.Tag) {
      handled = handleTag(editor, result, endOfMatchPoint, text.length);
    }

    if (handled) {
      return handled;
    }
  }

  return false;
};

type MarkupLengths = { startMark: number; text: number; endMark: number };
type MarkupLengthsWithTextToInsert = MarkupLengths & { textToInsert: number };

// Gets the markup lengths to remove, given that the textToInsertLength is the length
// of the text that has not been inserted into the editor
const getMarkupLengths = (
  markupLengths: MarkupLengthsWithTextToInsert
): MarkupLengths => {
  let currTextToInsertLength = markupLengths.textToInsert;
  let currStartMarkLength = markupLengths.startMark;
  let currTextLength = markupLengths.text;
  let currEndMarkLength = markupLengths.endMark;

  // Subtract textToInsertLength from the end mark
  if (currTextToInsertLength > 0 && currEndMarkLength > 0) {
    currEndMarkLength = Math.max(currEndMarkLength - currTextToInsertLength, 0);
    currTextToInsertLength -= markupLengths.endMark - currEndMarkLength;
  }

  // Subtract textToInsertLength from the text
  if (currTextToInsertLength > 0 && currTextLength > 0) {
    currTextLength = Math.max(currTextLength - currTextToInsertLength, 0);
    currTextToInsertLength -= markupLengths.text - currTextLength;
  }

  // Subtract textToInsertLength from the start mark
  if (currTextToInsertLength > 0 && currStartMarkLength > 0) {
    currStartMarkLength = Math.max(
      currStartMarkLength - currTextToInsertLength,
      0
    );
    currTextToInsertLength -= markupLengths.startMark - currStartMarkLength;
  }

  return {
    startMark: currStartMarkLength,
    text: currTextLength,
    endMark: currEndMarkLength,
  };
};

// Deletes beginning and ending markup and returns the range of the text in the middle
export const deleteMarkup = (
  editor: Editor,
  point: Point,
  lengths: MarkupLengthsWithTextToInsert
): Range => {
  const {
    startMark: startMarkLength,
    text: textLength,
    endMark: endMarkLength,
  } = getMarkupLengths(lengths);

  const pointPath = point.path;
  let pointOffset = point.offset;

  // Delete the ending mark
  deleteText(editor, pointPath, pointOffset, endMarkLength);
  pointOffset -= endMarkLength;

  // Delete the start mark
  deleteText(editor, pointPath, pointOffset - textLength, startMarkLength);
  pointOffset -= startMarkLength;

  // Return range of the text to format
  return {
    anchor: { path: pointPath, offset: pointOffset },
    focus: {
      path: pointPath,
      offset: pointOffset - textLength,
    },
  };
};

export default handleInlineShortcuts;
