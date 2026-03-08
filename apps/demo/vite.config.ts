import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: /^animated-stepper\/style\.css$/,
        replacement: path.resolve(rootDir, "../../packages/stepper/src/style.css"),
      },
      {
        find: /^animated-stepper$/,
        replacement: path.resolve(rootDir, "../../packages/stepper/src/index.ts"),
      },
    ],
  },
});
