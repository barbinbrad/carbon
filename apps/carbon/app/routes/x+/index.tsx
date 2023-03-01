import { Editor } from "@carbon/react";

export default function AppIndexRoute() {
  return (
    <Editor
      content={`<h2>Hello, World</h2>`}
      onChange={(text) => console.log(text)}
      h={500}
    />
  );
}
