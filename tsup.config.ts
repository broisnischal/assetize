import { defineConfig } from "tsup";
// import tsconfig from "./tsconfig.json" with { type: "json" };

export default defineConfig({
  dts: true,
  entry: ["src/**"],
  format: ["esm", "cjs"],
  outDir: "dist",
  ignoreWatch: ["node_modules", "build", "dist"],
  minify: true,
  sourcemap: true,
  clean: true,
  target: "es2022",
  splitting: false,
});
