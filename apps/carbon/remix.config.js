const path = require("node:path");
const { flatRoutes } = require("remix-flat-routes");

/** @type {import('@remix-run/dev').AppConfig} */

module.exports = {
  future: {
    v2_dev: false,
    v2_errorBoundary: false,
    v2_headers: false,
    v2_meta: false,
    v2_normalizeFormMethod: false,
    v2_routeConvention: true,
  },
  ignoredRouteFiles: ["**/.*"],
  serverModuleFormat: "cjs",

  // appDirectory: "app",`
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
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
