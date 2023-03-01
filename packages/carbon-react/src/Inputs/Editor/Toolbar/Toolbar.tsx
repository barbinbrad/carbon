import Bold from "./Bold";
import CodeBlock from "./CodeBlock";
import Code from "./Code";
import Italic from "./Italic";
import Paragraph from "./Paragraph";
import BlockQuote from "./BlockQuote";
import UnorderedList from "./UnorderedList";
import OrderedList from "./OrderedList";
import HorizontalRule from "./HorizontalRule";
import { HeadingOne, HeadingThree, HeadingTwo } from "./Heading";
import Strike from "./Strike";
import type { EditorComponent } from "../types";
import { Wrap, Divider, Box } from "@chakra-ui/react";
import { useColor } from "../../../hooks";

const Toolbar: EditorComponent = ({ editor }) => {
  const borderColor = useColor("gray.200");
  return (
    <Box
      w="full"
      borderBottomColor={borderColor}
      borderBottomStyle="solid"
      borderBottomWidth={1}
      p={2}
    >
      <Wrap shouldWrapChildren>
        <Paragraph editor={editor} />
        <HeadingOne editor={editor} />
        <HeadingTwo editor={editor} />
        <HeadingThree editor={editor} />
        <Divider orientation="vertical" />

        {/* Inline styles */}
        <Bold editor={editor} />
        <Italic editor={editor} />
        <Strike editor={editor} />
        <Code editor={editor} />
        <Divider orientation="vertical" />

        {/* Block styles */}
        <UnorderedList editor={editor} />
        <OrderedList editor={editor} />
        <CodeBlock editor={editor} />
        <BlockQuote editor={editor} />
        <HorizontalRule editor={editor} />
      </Wrap>
    </Box>
  );
};

export default Toolbar;
