import { Parser } from '../src/parser.js';
import { renderer } from '../src/renderer.js';
import { getInnerHTML } from './helpers.js';

describe('Parser', () => {
  test('multiple text tokens', () => {
    const parser = new Parser({ renderer });
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

    expect(getInnerHTML(parser.parse(tokens))).toMatchSnapshot();
  });

  test('escaped code', () => {
    const parser = new Parser({ renderer });
    const tokens = [
      {
        type: 'code',
        raw: 'code',
        text: 'code',
        escaped: true,
      },
    ];

    expect(getInnerHTML(parser.parse(tokens))).toMatchSnapshot();
  });

  test('invalid block token type', () => {
    const parser = new Parser({ renderer });
    const tokens = [
      {
        type: 'invalid',
      },
    ];

    expect(() => getInnerHTML(parser.parse(tokens))).toThrow('Token with "invalid" type was not found.');
  });

  test('invalid block token type silent', () => {
    const parser = new Parser({ renderer, silent: true });
    const tokens = [
      {
        type: 'invalid',
      },
    ];

    expect(getInnerHTML(parser.parse(tokens))).toMatchSnapshot();
  });

  test('invalid inline token type', () => {
    const parser = new Parser({ renderer });
    const tokens = [
      {
        type: 'invalid',
      },
    ];

    expect(() => getInnerHTML(parser.parseInline(tokens))).toThrow('Token with "invalid" type was not found.');
  });

  test('invalid inline token type silent', () => {
    const parser = new Parser({ renderer, silent: true });
    const tokens = [
      {
        type: 'invalid',
      },
    ];

    expect(getInnerHTML(parser.parseInline(tokens))).toMatchSnapshot();
  });
});
