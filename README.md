# marked-html-renderer

Marked extension to renderer html elements instead of a string.

# Usage

```js
import {marked} from "marked";
import markedHtmlRenderer from "marked-html-renderer";

// or UMD script
// <script src="https://cdn.jsdelivr.net/npm/marked/lib/marked.umd.js"></script>
// <script src="https://cdn.jsdelivr.net/npm/marked-html-renderer/lib/index.umd.js"></script>

marked.use(markedHtmlRenderer());

const htmlElements = marked.parse("# example html"); // returns a DocumentFragment
document.body.append(htmlElements);
```
