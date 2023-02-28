const path = require("node:path");
const { flatRoutes } = require("remix-flat-routes");
const glob = require("glob");

const packages = glob
  .sync("packages/**/package.json", {
    cwd: path.join(__dirname, "..", ".."),
    ignore: ["**/node_modules/**"],
    absolute: true,
  })
  .map((pkg) => path.dirname(pkg));

module.exports = {
  serverBuildTarget: "vercel",
  // When running locally in development mode, we use the built in remix
  // server. This does not understand the vercel lambda module format,
  // so we default back to the standard build output.
  server: process.env.NODE_ENV === "development" ? undefined : "./server.js",
  ignoredRouteFiles: ["**/*"],
  assetsBuildDirectory: "public/build",
  routes: async (defineRoutes) => {
    return flatRoutes("routes", defineRoutes, {
      appDir: path.resolve(__dirname, "app"),
    });
  },
  serverDependenciesToBundle: [
    "@carbon/database",
    "@carbon/logger",
    "@carbon/react",
    "@carbon/utils",
  ],
  watchPaths: packages,
};
