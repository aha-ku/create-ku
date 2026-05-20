import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.js"],
  format: ["esm"],
  dts: false,
  sourcemap: true,
  clean: true,
  minify: true,
  outDir: "dist",
});
