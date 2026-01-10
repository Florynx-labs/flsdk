import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/plugins/better-auth.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  splitting: false,
  sourcemap: true,
  minify: false,
  treeshake: true,
  target: 'es2020',
  outDir: 'dist',
  external: [],
  noExternal: [],
  esbuildOptions(options) {
    options.banner = {
      js: '/**\n * FarmLink SDK v2.0.0\n * (c) 2026 Florynx Labs\n * @license MIT\n */',
    }
  },
})
