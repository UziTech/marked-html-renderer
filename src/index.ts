import type { MarkedExtension } from 'marked';
import { Parser } from './parser.ts';
import { createRenderer } from './renderer.ts';
import { blockHtml, inlineHtml } from './extensions.ts';

export type MarkedHTMLRendererOptions = {
  dom?: Document;
};

export default function(libOptions?: MarkedHTMLRendererOptions): MarkedExtension<DocumentFragment, Node | string> {
  return {
    hooks: {
      provideParser() {
        return (tokens, options) => {
          const optionsWithDom = {
            ...options,
            ...libOptions,
          };
          return this.block
            ? Parser.parse(tokens, optionsWithDom)
            : Parser.parseInline(tokens, optionsWithDom);
        };
      },
    },
    renderer: createRenderer({
      dom: libOptions?.dom ?? document,
    }),
    extensions: [
      blockHtml(libOptions),
      inlineHtml(libOptions),
    ],
  };
}
