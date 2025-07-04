import type { Renderer, MarkedOptions, Parser } from 'marked';

export const other = {
  escapeTest: /[&<>"']/,
  escapeReplace: /[&<>"']/g,
  escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
  escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,
  percentDecode: /%25/g,
  notSpaceStart: /^\S*/,
  endingNewline: /\n$/,
};

const escapeReplacements: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
} as const;
const getEscapeReplacement = (ch: string) => escapeReplacements[ch];

export function escapeText(html: string, encode?: boolean) {
  if (encode) {
    if (other.escapeTest.test(html)) {
      return html.replace(other.escapeReplace, getEscapeReplacement);
    }
  } else {
    if (other.escapeTestNoEncode.test(html)) {
      return html.replace(other.escapeReplaceNoEncode, getEscapeReplacement);
    }
  }

  return html;
}

export function cleanUrl(href: string) {
  return encodeURI(href).replace(other.percentDecode, '%');
}

export const renderer: Renderer<DocumentFragment, Node | string> = {
  options: null as unknown as MarkedOptions<DocumentFragment, Node | string>,
  parser: null as unknown as Parser<DocumentFragment, Node | string>,

  space() {
    return '';
  },

  code({ text, lang, escaped }) {
    const langString = (lang || '').match(other.notSpaceStart)?.[0];

    let code = text.replace(other.endingNewline, '') + '\n';
    code = (escaped ? code : escapeText(code, true));

    const preEl = document.createElement('pre');
    const codeEl = document.createElement('code');
    preEl.appendChild(codeEl);
    codeEl.textContent = code;

    if (langString) {
      preEl.classList.add('language-' + langString);
    }

    return preEl;
  },

  blockquote({ tokens }) {
    const blockquote = document.createElement('blockquote');
    blockquote.append(this.parser.parse(tokens));
    return blockquote;
  },

  html({ text }) {
    // HTML should be handled by the blockHtml and inlineHtml extensions in extension.js
    // Handle comments
    const comment = /^<!--([\s\S]*?)-->/.exec(text);
    if (comment) {
      return document.createComment(comment[1]);
    }
    // If it is not just assume it is text.
    return text;
  },

  heading({ tokens, depth }) {
    const heading = document.createElement('h' + depth);
    heading.append(this.parser.parseInline(tokens));
    return heading;
  },

  hr() {
    return document.createElement('hr');
  },

  list(token) {
    const ordered = token.ordered;
    const start = token.start.toString();

    const out = document.createElement(ordered ? 'ol' : 'ul');
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
    const out = document.createElement('li');
    out.append(this.parser.parse(item.tokens, !!item.loose));
    if (item.task) {
      const checkbox = this.checkbox({ checked: !!item.checked });
      if (item.loose) {
        if (item.tokens[0]?.type === 'text') {
          (out.firstChild as HTMLElement).prepend(' ');
          (out.firstChild as HTMLElement).prepend(checkbox);
        } else {
          out.prepend(' ');
          out.prepend(checkbox);
        }
      } else {
        out.prepend(' ');
        out.prepend(checkbox);
      }
    }

    return out;
  },

  checkbox({ checked }) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = checked;
    if (checked) {
      checkbox.setAttribute('checked', '');
    }
    checkbox.disabled = true;
    return checkbox;
  },

  paragraph({ tokens }) {
    const paragraph = document.createElement('p');
    paragraph.append(this.parser.parseInline(tokens));
    return paragraph;
  },

  table(token) {
    const table = document.createElement('table');
    const thead = document.createElement('thead');

    const headerCell = document.createDocumentFragment();
    for (let j = 0; j < token.header.length; j++) {
      headerCell.append(this.tablecell(token.header[j]));
    }
    thead.append(this.tablerow({ text: headerCell }));
    table.append(thead);

    if (token.rows.length === 0) {
      return table;
    }

    const tbody = document.createElement('tbody');
    for (let j = 0; j < token.rows.length; j++) {
      const row = token.rows[j];

      const cell = document.createDocumentFragment();
      for (let k = 0; k < row.length; k++) {
        cell.append(this.tablecell(row[k]));
      }

      tbody.append(this.tablerow({ text: cell }));
    }

    table.append(tbody);

    return table;
  },

  tablerow({ text }) {
    const tr = document.createElement('tr');
    tr.append(text);
    return tr;
  },

  tablecell(token) {
    const content = this.parser.parseInline(token.tokens);
    const out = document.createElement(token.header ? 'th' : 'td');
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
    const strong = document.createElement('strong');
    strong.append(this.parser.parseInline(tokens));
    return strong;
  },

  em({ tokens }) {
    const em = document.createElement('em');
    em.append(this.parser.parseInline(tokens));
    return em;
  },

  codespan({ text }) {
    const code = document.createElement('code');
    code.innerHTML = escapeText(text, true);
    return code;
  },

  br() {
    return document.createElement('br');
  },

  del({ tokens }) {
    const del = document.createElement('del');
    del.append(this.parser.parseInline(tokens));
    return del;
  },

  link({ href, title, tokens }) {
    const body = this.parser.parseInline(tokens);
    href = cleanUrl(href);
    const out = document.createElement('a');
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
    const out = document.createElement('img');
    out.src = href;
    out.alt = body.textContent ?? '';
    if (title) {
      out.title = escapeText(title);
    }
    out.append(body);
    return out;
  },

  text(token) {
    return ('tokens' in token) && token.tokens
      ? this.parser.parseInline(token.tokens)
      : document.createTextNode(token.text);
  },
};
