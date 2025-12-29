import type { TokenizerAndRendererExtension } from 'marked';
import type { MarkedHTMLRendererOptions } from './index.ts';

const blockHtmlRegex = /^<([a-z]\w*)[^>]*>(\n(?:[^]*?\n)?)<\/\1>\n/i;
const inlineHtmlRegex = /^<([a-z]\w*)[^>\n]*>([^]*?)<\/\1>/i;

export const blockHtml = (libOptions?: MarkedHTMLRendererOptions): TokenizerAndRendererExtension<DocumentFragment, Node | string> => ({
  name: 'blockHtml',
  level: 'block',
  tokenizer(src) {
    const cap = blockHtmlRegex.exec(src);
    if (cap) {
      return {
        type: 'blockHtml',
        raw: cap[0],
        text: cap[2],
      };
    }
  },
  renderer({ raw }) {
    const template = (libOptions?.document ?? document).createElement('template');
    template.innerHTML = raw;
    return template.content;
  },
});

export const inlineHtml = (libOptions?: MarkedHTMLRendererOptions): TokenizerAndRendererExtension<DocumentFragment, Node | string> => ({
  name: 'inlineHtml',
  level: 'inline',
  // don't need start since HTML is already a blocker to inline text
  // start(src) {}
  tokenizer(src) {
    const cap = inlineHtmlRegex.exec(src);
    if (cap) {
      return {
        type: 'inlineHtml',
        raw: cap[0],
        text: cap[2],
        tokens: this.lexer.inline(cap[2]),
      };
    }
  },
  renderer({ raw, tokens }) {
    const template = (libOptions?.document ?? document).createElement('template');
    template.innerHTML = raw;
    const out = template.content.firstChild as HTMLElement;
    out.innerHTML = '';
    out.append(this.parser.parseInline(tokens!));
    return out;
  },
});
