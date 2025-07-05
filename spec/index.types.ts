import { Marked } from 'marked';
import markedHtmlRenderer from 'marked-html-renderer';

const marked = new Marked<DocumentFragment, Node | string>();
marked.use(markedHtmlRenderer());

const htmlElements: DocumentFragment = marked.parse('# example html', { async: false });
document.body.append(htmlElements);
