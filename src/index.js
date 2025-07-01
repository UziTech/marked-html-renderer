import { Parser } from './parser.js';
import { renderer } from './renderer.js';
import { blockHtml, inlineHtml } from './extensions.js';

export default function() {
  return {
    hooks: {
      provideParser() {
        return this.block ? Parser.parse : Parser.parseInline;
      },
    },
    renderer,
    extensions: [
      blockHtml,
      inlineHtml,
    ],
  };
}
