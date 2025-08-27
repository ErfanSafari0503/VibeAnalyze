import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import packageJson from "./package.json";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    define: {
      __SENTRY_RELEASE__: JSON.stringify(packageJson.version),
    },
    plugins: [
      react(),
      tailwindcss(),
      sentryVitePlugin({
        org: env.SENTRY_ORG,
        project: env.SENTRY_PROJECT,
        authToken: env.SENTRY_AUTH_TOKEN,
      }),
    ],
    build: {
      sourcemap: true,
    },
  };
});
