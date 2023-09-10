import dts from "bun-plugin-dts";

await Bun.build({
  entrypoints: ["src/index.ts"],
  outdir: "build",
  minify: true,
  target: "node",
  sourcemap: "external",
  plugins: [dts()],
});
