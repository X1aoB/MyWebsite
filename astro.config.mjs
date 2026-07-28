import { defineConfig } from "astro/config";

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || "https://example.com",
  output: "static",
  vite: {
    build: {
      target: "es2022"
    }
  }
});
