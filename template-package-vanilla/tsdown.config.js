import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.js"],
  format: ["esm"],
  minify: true,
  dts: false,
  fixedExtension: false,
  deps: {
    onlyBundle: false,
  },
  outDir: "dist",
});
