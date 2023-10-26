const path = require("node:path");
const { flatRoutes } = require("remix-flat-routes");

/** @type {import('@remix-run/dev').AppConfig} */

module.exports = {
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
  future: {},
  ignoredRouteFiles: ["**/.*"],
  serverModuleFormat: "cjs",
  serverPlatform: "node",
  serverMinify: false,
  routes: async (defineRoutes) => {
    return flatRoutes("routes", defineRoutes, {
      // eslint-disable-next-line no-undef
      appDir: path.resolve(__dirname, "app"),
    });
  },
  serverDependenciesToBundle: [
    "@carbon/database",
    "@carbon/logger",
    "@carbon/react",
    "@carbon/utils",
    "nanostores",
    "@nanostores/react",
  ],
  watchPaths: async () => {
    return [
      "../../packages/react/src/**/*",
      "../../packages/database/src/**/*",
      "../../packages/logger/src/**/*",
      "../../packages/utils/src/**/*",
    ];
  },
};
