import pkgJson from "../package.json";

await Bun.build({
  entrypoints: ["src/main.ts"],
  outdir: "build",
  minify: false,
  target: "bun",
  external: [...Object.keys(pkgJson.dependencies), ...Object.keys(pkgJson.devDependencies)],
  sourcemap: "external"
});
