# marked-html-renderer

Marked extension to renderer html elements instead of a string.

# Usage

```js
import {Marked} from "marked";
import markedHtmlRenderer from "marked-html-renderer";

// or UMD script
// <script src="https://cdn.jsdelivr.net/npm/marked/lib/marked.umd.js"></script>
// <script src="https://cdn.jsdelivr.net/npm/marked-html-renderer/lib/index.umd.js"></script>

const marked = new Marked();
marked.use(markedHtmlRenderer());

const htmlElements = marked.parse("# example html"); // returns a DocumentFragment
document.body.append(htmlElements);
```

For typescript use `Marked<DocumentFragment, Node | string>` to tell marked that it should return a DocumentFragment instead of a string.

```ts
import {Marked} from "marked";
import markedHtmlRenderer from "marked-html-renderer";

const marked = new Marked<DocumentFragment, Node | string>();
marked.use(markedHtmlRenderer());

const htmlElements: DocumentFragment = marked.parse('# example html', { async: false });
document.body.append(htmlElements);
```
