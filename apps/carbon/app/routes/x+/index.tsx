import { Editor, useEditor } from "@carbon/react";

export default function AppIndexRoute() {
  const editor = useEditor(`<h2>Hello, World</h2><p>Welcome to Carbon!</p>`);
  return <Editor editor={editor} h="calc(100vh - 98px)" />;
}
