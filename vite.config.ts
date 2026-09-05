import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  plugins: [react(), viteSingleFile()],
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
    assetsInlineLimit: 10000000000, // Inline all assets
    cssCodeSplit: false,
    minify: "esbuild", // Faster than terser
    reportCompressedSize: false, // Skip gzip calc (saves time)
    chunkSizeWarningLimit: 1000, // Suppress warnings
    rollupOptions: {
      output: {
        manualChunks: undefined, // Single chunk = faster for small apps
      },
    },
  },
});
