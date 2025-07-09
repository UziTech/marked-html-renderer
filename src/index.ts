import type { MarkedExtension } from 'marked';
import { Parser } from './parser.ts';
import { renderer } from './renderer.ts';
import { blockHtml, inlineHtml } from './extensions.ts';

export default function(): MarkedExtension<DocumentFragment, Node | string> {
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
