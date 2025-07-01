import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Marked } from 'marked';
import markedHtmlRenderer from '../src/index.js';

function getInnerHTML(fragment) {
  const div = document.createElement('div');
  div.append(fragment);
  return div.innerHTML;
}

function readMarkdownFile(path) {
  return readFile(resolve(__dirname, path), 'utf8');
}

describe('marked.parse', () => {
  test('reference.md', async() => {
    const marked = new Marked();
    const markdown = await readMarkdownFile('./fixtures/reference.md');
    marked.use(markedHtmlRenderer());
    expect(getInnerHTML(marked.parse(markdown))).toMatchSnapshot();
  });
});

describe('marked.parseInline', () => {
  test('reference.md', async() => {
    const marked = new Marked();
    const markdown = '__Some__ *inline* ~~markdown~~';
    marked.use(markedHtmlRenderer());
    expect(getInnerHTML(marked.parseInline(markdown))).toMatchSnapshot();
  });
});
