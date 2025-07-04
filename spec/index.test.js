import { JSDOM } from 'jsdom';
import { Marked } from 'marked';
import markedHtmlRenderer from '../src/index.ts';
import { getInnerHTML, readMarkdownFile } from './helpers.js';
import { suite, test } from 'node:test';

globalThis.document = new JSDOM().window.document;

suite('marked.parse', () => {
  const simpleBlockTests = {
    table: `
| a | b | c |
|:--|:-:|--:|
| 1 | 2 | 3 |
`,
    'table no rows': `
| a | b | c |
|---|---|---|
`,
    'code fence with lang string': `
\`\`\`text
a
\`\`\`
`,
    'ordered list not starting at 1': `
2. list
`,
    'task list': `
- [ ] task
`,
    'loose task list': `
- [ ] task

- [x] # loose
`,
    comments: `
<!-- comment -->

<!--
multiline comment
-->
`,
    html: '<div>',
  };
  test('reference.md', async(t) => {
    const marked = new Marked();
    const markdown = await readMarkdownFile('reference.md');
    marked.use(markedHtmlRenderer());
    t.assert.snapshot(getInnerHTML(marked.parse(markdown)));
  });

  Object.entries(simpleBlockTests).forEach(([name, markdown]) => {
    test(name, (t) => {
      const marked = new Marked();
      marked.use(markedHtmlRenderer());
      t.assert.snapshot(getInnerHTML(marked.parse(markdown)));
    });
  });
});

suite('marked.parseInline', () => {
  const simpleInlineTests = {
    strong: '__strong__',
    em: '*em*',
    codespan: '`codespan`',
    del: '~~del~~',
    escape: '\\[escaped',
    comment: 'test <!-- comment -->',
    image: '![__strong__ *em* `codespan` ~~del~~ <!-- comment --> [link](./test.html) ![image](./test.png)](./test.png)',
    'image with title': '![alt text](test.png "image title")',
    'link with title': '[link text](test.html "link title")',
  };

  Object.entries(simpleInlineTests).forEach(([name, markdown]) => {
    test(name, (t) => {
      const marked = new Marked();
      marked.use(markedHtmlRenderer());
      t.assert.snapshot(getInnerHTML(marked.parseInline(markdown)));
    });
  });

  test('br', (t) => {
    const marked = new Marked({ breaks: true });
    marked.use(markedHtmlRenderer());
    t.assert.snapshot(getInnerHTML(marked.parseInline('line1\nline2')));
  });

  test('text renderer br', (t) => {
    const marked = new Marked({ breaks: true });
    marked.use(markedHtmlRenderer());
    t.assert.snapshot(getInnerHTML(marked.parseInline('![multiline\nimage](test.png)')));
  });
});

suite('extensions', () => {
  test('fallback renderer', (t) => {
    const renderer = {
      paragraph() {
        return false;
      },
      em() {
        return false;
      },
    };
    const marked = new Marked();
    const markdown = '*test*';
    marked.use(markedHtmlRenderer(), { renderer });
    t.assert.snapshot(getInnerHTML(marked.parse(markdown)));
  });

  test('fallback extension', (t) => {
    const extensions = [
      {
        name: 'paragraph',
        level: 'block',
        renderer() {
          return false;
        },
      },
      {
        name: 'em',
        level: 'inline',
        renderer() {
          return false;
        },
      },
    ];
    const marked = new Marked();
    const markdown = '*test*';
    marked.use(markedHtmlRenderer(), { extensions });
    t.assert.snapshot(getInnerHTML(marked.parse(markdown)));
  });
});
