import type { MarkedOptions, Token, Tokens, MarkedToken, TextRenderer, Renderer, Parser as MarkedParser } from 'marked';
import { textRenderer } from './textRenderer.ts';
import { renderer } from './renderer.ts';

export class Parser {
  options: MarkedOptions<DocumentFragment, Node | string>;
  renderer: Renderer<DocumentFragment, Node | string>;
  textRenderer: TextRenderer<Node | string>;

  constructor(options: MarkedOptions<DocumentFragment, Node | string> | undefined) {
    this.options = options ?? { renderer };
    this.textRenderer = textRenderer;
    this.renderer = this.options.renderer!;
    this.renderer.parser = this as unknown as MarkedParser<DocumentFragment, Node | string>;
  }

  /**
   * Static Parse Method
   */
  static parse(tokens: Token[], options?: MarkedOptions<DocumentFragment, Node | string>) {
    const parser = new Parser(options);
    return parser.parse(tokens);
  }

  /**
   * Static Parse Inline Method
   */
  static parseInline(tokens: Token[], options?: MarkedOptions<DocumentFragment, Node | string>) {
    const parser = new Parser(options);
    return parser.parseInline(tokens);
  }

  appendOutput(out: DocumentFragment, ret: Node | string | false | undefined) {
    if (ret) {
      out.append(ret);
    }
  }

  parse(tokens: Token[], top = true) {
    const out = document.createDocumentFragment();

    for (let i = 0; i < tokens.length; i++) {
      const anyToken = tokens[i];

      // Run any renderer extensions
      if (this.options.extensions?.renderers?.[anyToken.type]) {
        const genericToken = anyToken;
        const ret = this.options.extensions.renderers[genericToken.type].call({ parser: this as unknown as MarkedParser<DocumentFragment, Node | string> }, genericToken);
        if (ret !== false || !['space', 'hr', 'heading', 'code', 'table', 'blockquote', 'list', 'html', 'paragraph', 'text'].includes(genericToken.type)) {
          this.appendOutput(out, ret);
          continue;
        }
      }

      const token = anyToken as MarkedToken;

      switch (token.type) {
        case 'space': {
          this.appendOutput(out, this.renderer!.space(token));
          continue;
        }
        case 'hr': {
          this.appendOutput(out, this.renderer!.hr(token));
          continue;
        }
        case 'heading': {
          this.appendOutput(out, this.renderer!.heading(token));
          continue;
        }
        case 'code': {
          this.appendOutput(out, this.renderer!.code(token));
          continue;
        }
        case 'table': {
          this.appendOutput(out, this.renderer!.table(token));
          continue;
        }
        case 'blockquote': {
          this.appendOutput(out, this.renderer!.blockquote(token));
          continue;
        }
        case 'list': {
          this.appendOutput(out, this.renderer!.list(token));
          continue;
        }
        case 'html': {
          this.appendOutput(out, this.renderer!.html(token));
          continue;
        }
        case 'def': {
          this.appendOutput(out, this.renderer!.def(token));
          continue;
        }
        case 'paragraph': {
          this.appendOutput(out, this.renderer!.paragraph(token));
          continue;
        }
        case 'text': {
          let textToken = token;
          const body = document.createDocumentFragment();

          body.append(this.renderer!.text(textToken));
          while (i + 1 < tokens.length && tokens[i + 1].type === 'text') {
            textToken = tokens[++i] as Tokens.Text;
            body.append('\n', this.renderer!.text(textToken));
          }
          if (top) {
            const p = this.renderer!.paragraph({
              type: 'paragraph',
              raw: '',
              text: '',
              tokens: [],
            }) as unknown as HTMLParagraphElement;
            p.append(body);
            this.appendOutput(out, p);
          } else {
            this.appendOutput(out, body);
          }
          continue;
        }

        default: {
          const errMsg = 'Token with "' + token.type + '" type was not found.';
          if (this.options.silent) {
            console.error(errMsg);
            return document.createDocumentFragment();
          } else {
            throw new Error(errMsg);
          }
        }
      }
    }

    return out;
  }

  /**
   * Parse Inline Tokens
   */
  parseInline(tokens: Token[], renderer = this.renderer) {
    const out = document.createDocumentFragment();

    for (let i = 0; i < tokens.length; i++) {
      const anyToken = tokens[i];

      // Run any renderer extensions
      if (this.options.extensions?.renderers?.[anyToken.type]) {
        const ret = this.options.extensions.renderers[anyToken.type].call({ parser: this as unknown as MarkedParser<DocumentFragment, Node | string> }, anyToken);
        if (ret !== false || !['escape', 'html', 'link', 'image', 'strong', 'em', 'codespan', 'br', 'del', 'text'].includes(anyToken.type)) {
          this.appendOutput(out, ret);
          continue;
        }
      }

      const token = anyToken as MarkedToken;

      switch (token.type) {
        case 'escape': {
          this.appendOutput(out, renderer!.text(token));
          break;
        }
        case 'html': {
          this.appendOutput(out, renderer!.html(token));
          break;
        }
        case 'link': {
          this.appendOutput(out, renderer!.link(token));
          break;
        }
        case 'image': {
          this.appendOutput(out, renderer!.image(token));
          break;
        }
        case 'strong': {
          this.appendOutput(out, renderer!.strong(token));
          break;
        }
        case 'em': {
          this.appendOutput(out, renderer!.em(token));
          break;
        }
        case 'codespan': {
          this.appendOutput(out, renderer!.codespan(token));
          break;
        }
        case 'br': {
          this.appendOutput(out, renderer!.br(token));
          break;
        }
        case 'del': {
          this.appendOutput(out, renderer!.del(token));
          break;
        }
        case 'text': {
          this.appendOutput(out, renderer!.text(token));
          break;
        }
        default: {
          const errMsg = 'Token with "' + token.type + '" type was not found.';
          if (this.options.silent) {
            console.error(errMsg);
            return document.createDocumentFragment();
          } else {
            throw new Error(errMsg);
          }
        }
      }
    }
    return out;
  }
}
