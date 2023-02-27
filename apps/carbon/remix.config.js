const { flatRoutes } = require("remix-flat-routes");
const { getDependenciesToBundle } = require("@remix-run/dev");

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
      basePath: "/", // optional base path (defaults to /)
      paramPrefixChar: "$", // optional specify param prefix
      ignoredRouteFiles: [], // same as remix config
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
      "../../packages/carbon-react/src/**/*",
      "../../packages/carbon-database/src/**/*",
      "../../packages/carbon-logger/src/**/*",
      "../../packages/carbon-utils/src/**/*",
    ];
  },
};
