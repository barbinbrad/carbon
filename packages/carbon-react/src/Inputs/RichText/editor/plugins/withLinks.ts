import { isUrl } from "@carbon/utils";
import { Editor, Range, Transforms } from "slate";
import { insertExternalLink } from "../formatting";
import { ElementType } from "../../types";

const withLinks = (editor: Editor) => {
  const { insertData, insertText, isInline } = editor;

  editor.isInline = (element) => {
    return element.type === ElementType.ExternalLink ? true : isInline(element);
  };

  editor.insertText = (text) => {
    const { selection } = editor;

    if (text && isUrl(text)) {
      insertExternalLink(editor, text);
    } else if (text === " " && selection && Range.isCollapsed(selection)) {
      const { anchor } = selection;
      const start = Editor.start(editor, anchor.path);
      const range = { anchor, focus: start };
      const beforeText = Editor.string(editor, range);
      const beforeTextArr = beforeText.split(" ");
      const lastSegment = beforeTextArr[beforeTextArr.length - 1];

      // If the last text segment is a URL, convert it into a link
      if (lastSegment && isUrl(lastSegment)) {
        const lastSegmentRange = {
          anchor,
          focus: {
            path: anchor.path,
            offset: anchor.offset - lastSegment.length,
          },
        };
        Transforms.select(editor, lastSegmentRange);
        insertExternalLink(editor, lastSegment);
      }

      insertText(text);
    } else {
      insertText(text);
    }
  };

  editor.insertData = (data) => {
    const text = data.getData("text/plain");

    if (text && isUrl(text)) {
      insertExternalLink(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

export default withLinks;
