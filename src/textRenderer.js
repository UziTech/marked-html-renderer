export const textRenderer = {
  // no need for block level renderers
  strong({ text }) {
    return text;
  },

  em({ text }) {
    return text;
  },

  codespan({ text }) {
    return text;
  },

  del({ text }) {
    return text;
  },

  html({ text }) {
    return text;
  },

  text({ text }) {
    return text;
  },

  link({ text }) {
    return '' + text;
  },

  image({ text }) {
    return '' + text;
  },

  br() {
    return '';
  },
};
