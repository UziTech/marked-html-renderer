import { Marked } from 'marked';
import markedHtmlRenderer from '../src/index.js';
import { getInnerHTML, readMarkdownFile } from './helpers.js';

describe('marked.parse', () => {
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
  test('reference.md', async() => {
    const marked = new Marked();
    const markdown = await readMarkdownFile('reference.md');
    marked.use(markedHtmlRenderer());
    expect(getInnerHTML(marked.parse(markdown))).toMatchSnapshot();
  });

  Object.entries(simpleBlockTests).forEach(([name, markdown]) => {
    test(name, async() => {
      const marked = new Marked();
      marked.use(markedHtmlRenderer());
      expect(getInnerHTML(marked.parse(markdown))).toMatchSnapshot();
    });
  });
});

describe('marked.parseInline', () => {
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
    test(name, async() => {
      const marked = new Marked();
      marked.use(markedHtmlRenderer());
      expect(getInnerHTML(marked.parseInline(markdown))).toMatchSnapshot();
    });
  });

  test('br', async() => {
    const marked = new Marked({ breaks: true });
    marked.use(markedHtmlRenderer());
    expect(getInnerHTML(marked.parseInline('line1\nline2'))).toMatchSnapshot();
  });
});

describe('extensions', () => {
  test('fallback', async() => {
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
    expect(getInnerHTML(marked.parse(markdown))).toMatchSnapshot();
  });

  test('fallback', async() => {
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
    expect(getInnerHTML(marked.parse(markdown))).toMatchSnapshot();
  });
});
