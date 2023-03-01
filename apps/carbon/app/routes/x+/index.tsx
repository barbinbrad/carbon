import { Editor } from "@carbon/react";

export default function AppIndexRoute() {
  return (
    <Editor
      content={`<h2>Hello, World</h2><p>Welcome to Carbon!</p>`}
      onChange={(text) => console.log(text)}
      h="calc(100vh - 98px)"
    />
  );
}
