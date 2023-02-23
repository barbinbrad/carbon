import { withReact } from "slate-react";
import { withHistory } from "slate-history";
import { createEditor } from "slate";
import withAutoMarkdown from "./plugins/withAutoMarkdown";
import withBlockBreakout from "./plugins/withBlockBreakout";
import withLinks from "./plugins/withLinks";
import withNormalization from "./plugins/withNormalization";
import withCustomDeleteBackward from "./plugins/withCustomDeleteBackward";
import withVoidElements from "./plugins/withVoidElements";
import withTags from "./plugins/withTags";
import withHtml from "./plugins/withHtml";

const createRichTextEditor = () =>
  withNormalization(
    withCustomDeleteBackward(
      withAutoMarkdown(
        withHtml(
          withBlockBreakout(
            withVoidElements(
              withTags(withLinks(withHistory(withReact(createEditor()))))
            )
          )
        )
      )
    )
  );

export default createRichTextEditor;
