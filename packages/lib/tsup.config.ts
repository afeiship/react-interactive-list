import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/main.tsx'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  cjsInterop: true,

  // react
  minify: true,
  sourcemap: true,
  splitting: true,
  target: 'es6',
  bundle: true,
  // external: [
  //   'react',
  //   'react-dom',
  //   'classnames',
  //   '@jswork/react-list',
  //   '@jswork/harmony-events',
  //   '@jswork/event-mitt',
  //   'fast-deep-equal',
  // ],
  loader: {
    '.svg': 'dataurl',
  },
  outExtension({ format }) {
    return {
      js: `.${format}.js`,
    };
  },
});
