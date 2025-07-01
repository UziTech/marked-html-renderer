export default [
  {
    input: 'src/index.js',
    output: {
      name: 'markedHtmlRenderer',
      file: 'lib/index.umd.js',
      format: 'umd',
      globals: {
        marked: 'marked',
      },
    },
    external: ['marked'],
  },
];
