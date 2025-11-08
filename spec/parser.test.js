import { JSDOM } from 'jsdom';
import { Parser } from '../src/parser.ts';
import { renderer } from '../src/renderer.ts';
import { textRenderer } from '../src/textRenderer.ts';
import { getInnerHTML } from './helpers.js';
import { suite, test } from 'node:test';

globalThis.document = new JSDOM().window.document;

suite('Parser', () => {
  test('multiple text tokens', (t) => {
    const parser = new Parser();
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

    t.assert.snapshot(getInnerHTML(parser.parse(tokens)));
  });

  test('escaped code', (t) => {
    const parser = new Parser();
    const tokens = [
      {
        type: 'code',
        raw: 'code',
        text: 'code',
        escaped: true,
      },
    ];

    t.assert.snapshot(getInnerHTML(parser.parse(tokens)));
  });

  test('invalid block token type', (t) => {
    const parser = new Parser();
    const tokens = [
      {
        type: 'invalid',
      },
    ];

    t.assert.throws(() => getInnerHTML(parser.parse(tokens)), Error('Token with "invalid" type was not found.'));
  });

  test('invalid block token type silent', (t) => {
    const parser = new Parser({ renderer, silent: true });
    const tokens = [
      {
        type: 'invalid',
      },
    ];

    t.assert.snapshot(getInnerHTML(parser.parse(tokens)));
  });

  test('invalid inline token type', (t) => {
    const parser = new Parser();
    const tokens = [
      {
        type: 'invalid',
      },
    ];

    t.assert.throws(() => getInnerHTML(parser.parseInline(tokens)), Error('Token with "invalid" type was not found.'));
  });

  test('invalid inline token type silent', (t) => {
    const parser = new Parser({ renderer, silent: true });
    const tokens = [
      {
        type: 'invalid',
      },
    ];

    t.assert.snapshot(getInnerHTML(parser.parseInline(tokens)));
  });

  test('no renderer parse', (t) => {
    const parser = new Parser({ renderer, silent: true });
    const tokens = [
      {
        type: 'text',
        raw: 'text',
        text: 'text',
      },
    ];

    parser.renderer = null;
    t.assert.snapshot(getInnerHTML(parser.parse(tokens)));
  });

  test('no renderer parseinline', (t) => {
    const parser = new Parser({ renderer, silent: true });
    const tokens = [
      {
        type: 'text',
        raw: 'text',
        text: 'text',
      },
    ];

    parser.renderer = null;
    t.assert.snapshot(getInnerHTML(parser.parseInline(tokens)));
  });

  test('checkbox textRenderer', (t) => {
    const parser = new Parser({ renderer, silent: true });
    const tokens = [
      {
        type: 'checkbox',
        raw: '[ ]',
      },
    ];

    parser.renderer = null;
    t.assert.snapshot(getInnerHTML(parser.parseInline(tokens, textRenderer)));
  });

  test('no renderer', (t) => {
    const parser = new Parser({ silent: true });
    const tokens = [
      {
        type: 'text',
        raw: 'text',
        text: 'text',
      },
    ];

    parser.renderer = null;
    t.assert.snapshot(getInnerHTML(parser.parse(tokens)));
  });
});
