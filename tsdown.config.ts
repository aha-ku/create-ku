import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  minify: true,
  target: "node20",
  dts: false,
  fixedExtension: false,
  deps: {
    onlyBundle: false as const,
  },
});
