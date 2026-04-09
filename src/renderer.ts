import type { Renderer, MarkedOptions, Parser } from 'marked';
import type { MarkedHTMLRendererOptions } from './index.ts';

export const other = {
  percentDecode: /%25/g,
  notSpaceStart: /^\S*/,
  endingNewline: /\n$/,
};

export function cleanUrl(href: string) {
  return encodeURI(href).replace(other.percentDecode, '%');
}

export const createRenderer = ({ document: dom }: Required<MarkedHTMLRendererOptions>): Renderer<DocumentFragment, Node | string> => ({
  options: null as unknown as MarkedOptions<DocumentFragment, Node | string>,
  parser: null as unknown as Parser<DocumentFragment, Node | string>,

  space() {
    return '';
  },

  code({ text, lang, escaped }) {
    const langString = (lang || '').match(other.notSpaceStart)?.[0];

    const code = text.replace(other.endingNewline, '') + '\n';

    const preEl = dom.createElement('pre');
    const codeEl = dom.createElement('code');
    preEl.appendChild(codeEl);
    if (escaped) {
      codeEl.innerHTML = code;
    } else {
      codeEl.textContent = code;
    }

    if (langString) {
      preEl.classList.add('language-' + langString);
    }

    return preEl;
  },

  blockquote({ tokens }) {
    const blockquote = dom.createElement('blockquote');
    blockquote.append(this.parser.parse(tokens));
    return blockquote;
  },

  html({ text }) {
    // HTML should be handled by the blockHtml and inlineHtml extensions in extension.js
    // Handle comments
    const comment = /^<!--([\s\S]*?)-->/.exec(text);
    if (comment) {
      return dom.createComment(comment[1]);
    }
    // If it is not just assume it is text.
    return text;
  },

  def() {
    return '';
  },

  heading({ tokens, depth }) {
    const heading = dom.createElement('h' + depth);
    heading.append(this.parser.parseInline(tokens));
    return heading;
  },

  hr() {
    return dom.createElement('hr');
  },

  list(token) {
    const ordered = token.ordered;
    const start = token.start.toString();

    const out = dom.createElement(ordered ? 'ol' : 'ul');
    for (let j = 0; j < token.items.length; j++) {
      const item = token.items[j];
      out.append(this.listitem(item));
    }

    if (ordered && start !== '1') {
      out.setAttribute('start', start);
    }

    return out;
  },

  listitem(item) {
    const out = dom.createElement('li');
    out.append(this.parser.parse(item.tokens));

    return out;
  },

  checkbox({ checked }) {
    const checkbox = dom.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = checked;
    if (checked) {
      checkbox.setAttribute('checked', '');
    }
    checkbox.disabled = true;
    return checkbox;
  },

  paragraph({ tokens }) {
    const paragraph = dom.createElement('p');
    paragraph.append(this.parser.parseInline(tokens));
    return paragraph;
  },

  table(token) {
    const table = dom.createElement('table');
    const thead = dom.createElement('thead');

    const headerCell = dom.createDocumentFragment();
    for (let j = 0; j < token.header.length; j++) {
      headerCell.append(this.tablecell(token.header[j]));
    }
    thead.append(this.tablerow({ text: headerCell }));
    table.append(thead);

    if (token.rows.length === 0) {
      return table;
    }

    const tbody = dom.createElement('tbody');
    for (let j = 0; j < token.rows.length; j++) {
      const row = token.rows[j];

      const cell = dom.createDocumentFragment();
      for (let k = 0; k < row.length; k++) {
        cell.append(this.tablecell(row[k]));
      }

      tbody.append(this.tablerow({ text: cell }));
    }

    table.append(tbody);

    return table;
  },

  tablerow({ text }) {
    const tr = dom.createElement('tr');
    tr.append(text);
    return tr;
  },

  tablecell(token) {
    const content = this.parser.parseInline(token.tokens);
    const out = dom.createElement(token.header ? 'th' : 'td');
    out.append(content);
    if (token.align) {
      out.setAttribute('align', token.align);
    }

    return out;
  },

  /**
   * span level renderer
   */
  strong({ tokens }) {
    const strong = dom.createElement('strong');
    strong.append(this.parser.parseInline(tokens));
    return strong;
  },

  em({ tokens }) {
    const em = dom.createElement('em');
    em.append(this.parser.parseInline(tokens));
    return em;
  },

  codespan({ text }) {
    const code = dom.createElement('code');
    code.textContent = text;
    return code;
  },

  br() {
    return dom.createElement('br');
  },

  del({ tokens }) {
    const del = dom.createElement('del');
    del.append(this.parser.parseInline(tokens));
    return del;
  },

  link({ href, title, tokens }) {
    const body = this.parser.parseInline(tokens);
    href = cleanUrl(href);
    const out = dom.createElement('a');
    out.href = href;
    if (title) {
      out.title = title;
    }
    out.append(body);
    return out;
  },

  image({ href, title, text, tokens }) {
    const body = this.parser.parseInline(tokens, this.parser.textRenderer);

    href = cleanUrl(href);
    const out = dom.createElement('img');
    out.src = href;
    out.alt = body.textContent || '';
    if (title) {
      out.title = title;
    }
    out.append(body);
    return out;
  },

  text(token) {
    return ('tokens' in token) && token.tokens
      ? this.parser.parseInline(token.tokens)
      : dom.createTextNode(token.text);
  },
});
