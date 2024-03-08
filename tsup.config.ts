import { defineConfig } from "tsup";
// import tsconfig from "./tsconfig.json" with { type: "json" };

export default defineConfig({
  dts: true,
  entry: ["src/**"],
  format: ["esm"],
  outDir: "dist",
  tsconfig: "tsconfig.json",
  target: "es2022",
  minify: true,
  sourcemap: true,
  clean: true,
  splitting: false,
});
