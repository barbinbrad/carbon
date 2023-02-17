import fs from "fs";
import path from "path";

readFiles(
  path.resolve(__dirname, "../packages/carbon-database/supabase/migrations"),
  writeMarkDown,
  (err) => {
    throw new Error(err.message);
  }
);

function writeMarkDown(
  fileName: string,
  content: string,
  stream: fs.WriteStream
) {
  const heading = fileName.split("_")[1].split(".")[0];
  const markdown = `

## \`${heading}\`

\`\`\`sql
${content}
\`\`\`

`;
  stream.write(markdown);
}

function readFiles(
  dirName: string,
  onFileContent: (
    fileName: string,
    content: string,
    stream: fs.WriteStream
  ) => void,
  onError: (err: Error) => void
) {
  fs.writeFile(
    path.resolve(__dirname, "../SCHEMA.md"),
    "# Carbon Database Schema",
    function () {
      console.log("Rewriting SCHEMA.md");
    }
  );
  const stream = fs.createWriteStream("SCHEMA.md", { flags: "a" });
  stream.write(`

This file is generated from the migrations in \`packages/carbon-database/supabase/migrations\`.
  
`);
  fs.readdir(dirName, function (err, fileNames) {
    if (err) {
      onError(err);
      return;
    }
    fileNames.forEach(function (fileName) {
      let content = fs.readFileSync(dirName + "/" + fileName, "utf-8");
      onFileContent(fileName, content, stream);
    });

    stream.end();
  });
}
