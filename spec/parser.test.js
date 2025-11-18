import { JSDOM } from 'jsdom';
import { Parser } from '../src/parser.ts';
import { createRenderer } from '../src/renderer.ts';
import { textRenderer } from '../src/textRenderer.ts';
import { getInnerHTML } from './helpers.js';
import { suite, test } from 'node:test';

const dom = new JSDOM().window.document;

suite('Parser', () => {
  test('multiple text tokens', (t) => {
    const parser = new Parser({ document: dom });
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

    t.assert.snapshot(getInnerHTML(parser.parse(tokens), dom));
  });

  test('escaped code', (t) => {
    const parser = new Parser({ document: dom });
    const tokens = [
      {
        type: 'code',
        raw: 'code',
        text: 'code',
        escaped: true,
      },
    ];

    t.assert.snapshot(getInnerHTML(parser.parse(tokens), dom));
  });

  test('invalid block token type', (t) => {
    const parser = new Parser({ document: dom });
    const tokens = [
      {
        type: 'invalid',
      },
    ];

    t.assert.throws(() => getInnerHTML(parser.parse(tokens), dom), Error('Token with "invalid" type was not found.'));
  });

  test('invalid block token type silent', (t) => {
    const parser = new Parser({ document: dom, renderer: createRenderer({ document: dom }), silent: true });
    const tokens = [
      {
        type: 'invalid',
      },
    ];

    t.assert.snapshot(getInnerHTML(parser.parse(tokens), dom));
  });

  test('invalid inline token type', (t) => {
    const parser = new Parser({ document: dom });
    const tokens = [
      {
        type: 'invalid',
      },
    ];

    t.assert.throws(() => getInnerHTML(parser.parseInline(tokens), dom), Error('Token with "invalid" type was not found.'));
  });

  test('invalid inline token type silent', (t) => {
    const parser = new Parser({ document: dom, renderer: createRenderer({ document: dom }), silent: true });
    const tokens = [
      {
        type: 'invalid',
      },
    ];

    t.assert.snapshot(getInnerHTML(parser.parseInline(tokens), dom));
  });

  test('no renderer parse', (t) => {
    const parser = new Parser({ document: dom, renderer: createRenderer({ document: dom }), silent: true });
    const tokens = [
      {
        type: 'text',
        raw: 'text',
        text: 'text',
      },
    ];

    parser.renderer = null;
    t.assert.snapshot(getInnerHTML(parser.parse(tokens), dom));
  });

  test('no renderer parseinline', (t) => {
    const parser = new Parser({ document: dom, renderer: createRenderer({ document: dom }), silent: true });
    const tokens = [
      {
        type: 'text',
        raw: 'text',
        text: 'text',
      },
    ];

    parser.renderer = null;
    t.assert.snapshot(getInnerHTML(parser.parseInline(tokens), dom));
  });

  test('checkbox textRenderer', (t) => {
    const parser = new Parser({ document: dom, renderer: createRenderer({ document: dom }), silent: true });
    const tokens = [
      {
        type: 'checkbox',
        raw: '[ ]',
      },
    ];

    parser.renderer = null;
    t.assert.snapshot(getInnerHTML(parser.parseInline(tokens, textRenderer), dom));
  });

  test('no renderer', (t) => {
    const parser = new Parser({ document: dom, silent: true });
    const tokens = [
      {
        type: 'text',
        raw: 'text',
        text: 'text',
      },
    ];

    parser.renderer = null;
    t.assert.snapshot(getInnerHTML(parser.parse(tokens), dom));
  });
});
