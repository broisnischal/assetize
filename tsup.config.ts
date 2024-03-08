import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  dts: true,
  // entry: ["src/**/*.{ts,tsx}"],
  format: ["esm"],
  sourcemap: true,
  target: "esnext",
  outDir: "dist",
  ignoreWatch: ["node_modules", "build", "dist"],
});
