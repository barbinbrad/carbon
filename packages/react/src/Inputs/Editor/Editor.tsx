import type { BoxProps } from "@chakra-ui/react";
import { Box, VStack } from "@chakra-ui/react";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorContent, useEditor as useEditorInternal } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { reset } from "../../Theme";
import { Toolbar } from "./Toolbar";

export const useEditor = (content: string) => {
  const editor = useEditorInternal({
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle,
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
      }),
    ],
    content,
  });

  return editor;
};

export type EditorProps = Omit<BoxProps, "onChange"> & {
  editor: ReturnType<typeof useEditor>;
};

export const Editor = ({ editor, ...props }: EditorProps) => {
  if (!editor) {
    return null;
  }

  return (
    <VStack w="full" alignItems="start" spacing={0}>
      <Toolbar editor={editor} />
      <Box
        as={EditorContent}
        editor={editor}
        w="full"
        minH={300}
        bg="white"
        {...props}
        __css={{
          "& .ProseMirror": {
            p: 4,
            h: "full",
            outline: "none",
            "&:focus": {
              outline: "none",
            },
            ...reset,
          },
        }}
      />
    </VStack>
  );
};
