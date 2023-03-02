import { Editor, useEditor } from "@carbon/react";
import type { BoxProps } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { FormControl, FormErrorMessage } from "@chakra-ui/react";
import { useEffect } from "react";
import { useControlField, useField } from "remix-validated-form";

type RichTextProps = BoxProps & {
  name: string;
  output?: "html" | "json" | "text";
};

const RichText = ({ name, output = "html", ...props }: RichTextProps) => {
  const { getInputProps, error, defaultValue } = useField(name);
  const [value, setValue] = useControlField<string>(name);
  const editor = useEditor(defaultValue);

  useEffect(() => {
    if (!value) {
      editor?.commands.clearContent(true);
    }
  }, [value, editor]);

  useEffect(() => {
    if (editor) {
      editor.on("update", () => {
        switch (output) {
          case "html":
            setValue(editor.getHTML());
            break;
          case "json":
            setValue(JSON.stringify(editor.getJSON()));
            break;
          case "text":
            setValue(editor.getText());
            break;
          default:
            setValue(editor.getHTML());
            break;
        }
      });
    }

    return () => {
      if (editor) {
        editor.off("update");
      }
    };
  }, [editor, output, setValue]);

  return (
    <FormControl isInvalid={!!error}>
      <Editor
        editor={editor}
        // @ts-ignore
        onChange={setValue}
        {...props}
      />
      <Input
        {...getInputProps({
          // @ts-ignore
          id: name,
        })}
        value={value}
        type="hidden"
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default RichText;
