import type { BoxProps } from "@chakra-ui/react";
import { Box, VStack } from "@chakra-ui/react";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { Toolbar } from "./Toolbar";

export type EditorProps = Omit<BoxProps, "onChange"> & {
  content?: string;
  onChange?: (text: string) => void;
  output?: "html" | "json" | "text";
};

export const Editor = ({
  content,
  onChange,
  output = "html",
  ...props
}: EditorProps) => {
  const editor = useEditor({
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

  useEffect(() => {
    if (editor && onChange && typeof onChange === "function") {
      editor.on("update", () => {
        switch (output) {
          case "html":
            onChange(editor.getHTML());
            break;
          case "json":
            onChange(JSON.stringify(editor.getJSON()));
            break;
          case "text":
            onChange(editor.getText());
            break;
          default:
            onChange(editor.getHTML());
            break;
        }
      });
    }

    return () => {
      if (editor && onChange && typeof onChange === "function") {
        editor.off("update");
      }
    };
  }, [editor, onChange, output]);

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
