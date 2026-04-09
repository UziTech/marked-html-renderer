import { JSDOM } from 'jsdom';
import { Parser } from '../src/parser.ts';
import { createRenderer } from '../src/renderer.ts';
import { textRenderer } from '../src/textRenderer.ts';
import { getInnerHTML } from './helpers.js';
import { suite, test } from 'node:test';

globalThis.document = new JSDOM().window.document;
const dom = new JSDOM().window.document;

suite('Parser', () => {
  test('multiple text tokens', (t) => {
    const tokens = [
      {
        type: 'text',
        raw: 'text',
        text: 'text',
      },
      {
        type: 'text',
        raw: 'text2',
        text: 'text2',
      },
    ];

    const parser = new Parser();
    const parserInjectDom = new Parser({ document: dom });

    t.assert.snapshot(getInnerHTML(parser.parse(tokens)));
    t.assert.snapshot(getInnerHTML(parserInjectDom.parse(tokens), dom));
  });

  test('escaped code', (t) => {
    const tokens = [
      {
        type: 'code',
        raw: '<h1>code</h1>',
        text: '<h1>code</h1>',
        escaped: true,
      },
    ];

    const parser = new Parser();
    const parserInjectDom = new Parser({ document: dom });

    t.assert.snapshot(getInnerHTML(parser.parse(tokens)));
    t.assert.snapshot(getInnerHTML(parserInjectDom.parse(tokens), dom));
  });

  test('non-escaped code', (t) => {
    const parser = new Parser();
    const tokens = [
      {
        type: 'code',
        raw: '<h1>code</h1>',
        text: '<h1>code</h1>',
      },
    ];

    t.assert.snapshot(getInnerHTML(parser.parse(tokens)));
  });

  test('invalid block token type', (t) => {
    const tokens = [
      {
        type: 'invalid',
      },
    ];

    const parser = new Parser();
    const parserInjectDom = new Parser({ document: dom });

    const invalidError = Error('Token with "invalid" type was not found.');
    t.assert.throws(() => getInnerHTML(parser.parse(tokens)), invalidError);
    t.assert.throws(() => getInnerHTML(parserInjectDom.parse(tokens), dom), invalidError);
  });

  test('invalid block token type silent', (t) => {
    const tokens = [
      {
        type: 'invalid',
      },
    ];

    const parser = new Parser({ renderer: createRenderer({ document }), silent: true });
    const parserInjectDom = new Parser({ document: dom, renderer: createRenderer({ document: dom }), silent: true });

    t.assert.snapshot(getInnerHTML(parser.parse(tokens)));
    t.assert.snapshot(getInnerHTML(parserInjectDom.parse(tokens), dom));
  });

  test('invalid inline token type', (t) => {
    const tokens = [
      {
        type: 'invalid',
      },
    ];

    const parser = new Parser();
    const parserInjectDom = new Parser({ document: dom });

    const invalidError = Error('Token with "invalid" type was not found.');
    t.assert.throws(() => getInnerHTML(parser.parseInline(tokens)), invalidError);
    t.assert.throws(() => getInnerHTML(parserInjectDom.parseInline(tokens), dom), invalidError);
  });

  test('invalid inline token type silent', (t) => {
    const tokens = [
      {
        type: 'invalid',
      },
    ];

    const parser = new Parser({ renderer: createRenderer({ document }), silent: true });
    const parserInjectDom = new Parser({ document: dom, renderer: createRenderer({ document: dom }), silent: true });

    t.assert.snapshot(getInnerHTML(parser.parseInline(tokens)));
    t.assert.snapshot(getInnerHTML(parserInjectDom.parseInline(tokens), dom));
  });

  test('no renderer parse', (t) => {
    const tokens = [
      {
        type: 'text',
        raw: 'text',
        text: 'text',
      },
    ];

    const parser = new Parser({ renderer: createRenderer({ document }), silent: true });
    const parserInjectDom = new Parser({ document: dom, renderer: createRenderer({ document: dom }), silent: true });

    parser.renderer = null;
    parserInjectDom.renderer = null;

    t.assert.snapshot(getInnerHTML(parser.parse(tokens)));
    t.assert.snapshot(getInnerHTML(parserInjectDom.parse(tokens), dom));
  });

  test('no renderer parseinline', (t) => {
    const tokens = [
      {
        type: 'text',
        raw: 'text',
        text: 'text',
      },
    ];
    const parser = new Parser({ renderer: createRenderer({ document }), silent: true });
    const parserInjectDom = new Parser({ document: dom, renderer: createRenderer({ document: dom }), silent: true });

    parser.renderer = null;
    parserInjectDom.renderer = null;

    t.assert.snapshot(getInnerHTML(parser.parseInline(tokens)));
    t.assert.snapshot(getInnerHTML(parserInjectDom.parseInline(tokens), dom));
  });

  test('checkbox textRenderer', (t) => {
    const tokens = [
      {
        type: 'checkbox',
        raw: '[ ]',
      },
    ];

    const parser = new Parser({ renderer: createRenderer({ document }), silent: true });
    const parserInjectDom = new Parser({ document: dom, renderer: createRenderer({ document: dom }), silent: true });

    parser.renderer = null;
    parserInjectDom.renderer = null;

    t.assert.snapshot(getInnerHTML(parser.parseInline(tokens, textRenderer)));
    t.assert.snapshot(getInnerHTML(parserInjectDom.parseInline(tokens, textRenderer), dom));
  });

  test('no renderer', (t) => {
    const tokens = [
      {
        type: 'text',
        raw: 'text',
        text: 'text',
      },
    ];

    const parser = new Parser({ silent: true });
    const parserInjectDom = new Parser({ document: dom, silent: true });

    parser.renderer = null;
    parserInjectDom.renderer = null;

    t.assert.snapshot(getInnerHTML(parser.parse(tokens)));
    t.assert.snapshot(getInnerHTML(parserInjectDom.parse(tokens), dom));
  });
});
