import type { BoxProps } from "@chakra-ui/react";
import { Box, VStack } from "@chakra-ui/react";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorContent, useEditor as useEditorInternal } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
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
            "& h1": {
              fontSize: "2xl",
              fontWeight: "bold",
              letterSpacing: "tight",
            },
            "& h2": {
              fontSize: "xl",
              fontWeight: "bold",
              letterSpacing: "tight",
            },
            "& h3": {
              fontSize: "lg",
              fontWeight: "bold",
              letterSpacing: "tight",
            },
            "& ul, & ol": {
              ml: 4,
            },
            "& pre": {
              bg: "gray.100",
              p: 4,
              borderRadius: "md",
              overflow: "auto",
            },
            "& blockquote": {
              borderLeft: "4px solid",
              borderColor: "gray.200",
              pl: 4,
              ml: 4,
            },
            "& hr": {
              border: "none",
              borderBottom: "1px solid",
              borderColor: "gray.200",
              my: 4,
            },
          },
        }}
      />
    </VStack>
  );
};
