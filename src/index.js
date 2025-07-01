import { Parser } from './parser.js';
import { renderer } from './renderer.js';

export default function() {
  return {
    hooks: {
      provideParser() {
        return this.block ? Parser.parse : Parser.parseInline;
      },
    },
    renderer,
  };
}
