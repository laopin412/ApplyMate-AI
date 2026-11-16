import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// Keep '/' for localhost. GitHub Actions supplies the project subpath.
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: loadEnv(mode, ".", "VITE_").VITE_BASE_PATH || "/",
}));
