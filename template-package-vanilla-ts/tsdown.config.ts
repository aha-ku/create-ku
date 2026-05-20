import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  minify: true,
  dts: true,
  fixedExtension: false,
  deps: {
    onlyBundle: false as const,
  },
  outDir: "dist",
});
