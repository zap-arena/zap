import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import tsconfigPaths from "vite-tsconfig-paths";

// bundle-artifact.sh needs everything inlined into one HTML file. Deployments must not use
// that output: it defeats code splitting and re-downloads the whole app on every visit.
const singleFile = process.env.SINGLE_FILE === "1";

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    ...(singleFile ? [viteSingleFile()] : []),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
  build: {
    minify: "esbuild",
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
    ...(singleFile
      ? {
          assetsInlineLimit: 10000000000,
          cssCodeSplit: false,
          rollupOptions: { output: { manualChunks: undefined } },
        }
      : {
          rollupOptions: {
            output: {
              // Split rarely-changing vendors so app edits do not invalidate them.
              manualChunks: {
                react: ["react", "react-dom", "react-router-dom"],
                editor: ["@monaco-editor/react"],
                charts: ["recharts"],
              },
            },
          },
        }),
  },
});
