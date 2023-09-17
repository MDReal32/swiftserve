await Bun.build({
  entrypoints: ["src/main.ts"],
  outdir: "build",
  minify: false,
  target: "bun",
  external: ["qs", "@total-typescript/ts-reset"],
  sourcemap: "external"
});
