const path = require("node:path");
const { flatRoutes } = require("remix-flat-routes");

/** @type {import('@remix-run/dev').AppConfig} */

module.exports = {
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
  browserNodeBuiltinsPolyfill: { modules: { events: true } },
  dev: {
    port: 3601,
  },
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
    "@carbon/documents",
    "@carbon/logger",
    "@carbon/react",
    "@carbon/remix-validated-form",
    "@carbon/utils",
    "nanoid",
    "nanostores",
    "@nanostores/react",
  ],
  watchPaths: async () => {
    return [
      "../../packages/database/src/**/*",
      "../../packages/documents/src/**/*",
      "../../packages/logger/src/**/*",
      "../../packages/react/src/**/*",
      "../../packages/utils/src/**/*",
    ];
  },
};
