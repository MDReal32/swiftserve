await Bun.build({
  entrypoints: ["src/main.ts"],
  outdir: "build",
  minify: true,
  target: "bun",
  sourcemap: "external",
  plugins: []
});
