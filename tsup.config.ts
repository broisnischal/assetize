import { defineConfig } from "tsup";
// import tsconfig from "./tsconfig.json" with { type: "json" };

export default defineConfig({
  dts: true,
  format: ["esm"],
  outDir: "dist",
  ignoreWatch: ["node_modules", "build", "dist"],
  minify: true,
  sourcemap: true,
  clean: true,
  target: "es2022",
});
