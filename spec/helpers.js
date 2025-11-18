import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export function getInnerHTML(fragment, dom) {
  const div = dom.createElement('div');
  div.append(fragment);
  return div.innerHTML;
}

export function readMarkdownFile(path) {
  return readFile(resolve(import.meta.dirname, 'fixtures', path), 'utf8');
}
