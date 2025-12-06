import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
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
      js: '/**\n * FarmLink SDK v1.0.0\n * (c) 2024 Florynx Labs\n * @license MIT\n */',
    }
  },
})
