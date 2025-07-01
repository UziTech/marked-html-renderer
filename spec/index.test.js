import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { marked } from 'marked';
import markedHtmlRenderer from '../src/index.js';

function getInnerHTML(fragment) {
  const div = document.createElement('div');
  div.append(fragment);
  return div.innerHTML;
}

function readMarkdownFile(path) {
  return readFile(resolve(__dirname, path), 'utf8');
}

describe('this-extension', () => {
  beforeEach(() => {
    marked.setOptions(marked.getDefaults());
  });

  test('reference.md', async() => {
    const markdown = await readMarkdownFile('./fixtures/reference.md');
    marked.use(markedHtmlRenderer());
    expect(getInnerHTML(marked(markdown))).toMatchSnapshot();
  });
});
