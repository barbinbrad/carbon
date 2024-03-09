import {
  Editor,
  FormControl,
  FormErrorMessage,
  useEditor,
} from "@carbon/react";
import { useControlField, useField } from "@carbon/remix-validated-form";
import type { ComponentProps } from "react";
import { useEffect } from "react";

type RichTextProps = Omit<ComponentProps<typeof Editor>, "editor"> & {
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
      <Editor {...props} editor={editor} />
      <input
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
