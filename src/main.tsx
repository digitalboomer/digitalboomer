import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import '@fontsource/atkinson-hyperlegible/latin-400.css';
import '@fontsource/atkinson-hyperlegible/latin-700.css';
// Letters such as ş, ğ, ı (Turkish) and č, ć, đ, ž (Croatian). Only downloaded when a page uses them.
import '@fontsource/atkinson-hyperlegible/latin-ext-400.css';
import '@fontsource/atkinson-hyperlegible/latin-ext-700.css';
import './index.css';

/*
 * The browser's own "Translate this page" (e.g. Chrome with Google Translate) wraps texts in
 * <font> elements. React then cannot find its text nodes and the page can crash with
 * "Failed to execute 'removeChild'". These guards let React carry on instead
 * (known fix from https://github.com/facebook/react/issues/11538).
 */
if (typeof Node === 'function' && Node.prototype) {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) {
      return child;
    }
    return originalRemoveChild.call(this, child) as T;
  };
  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(this: Node, newNode: T, referenceNode: Node | null): T {
    if (referenceNode && referenceNode.parentNode !== this) {
      return newNode;
    }
    return originalInsertBefore.call(this, newNode, referenceNode) as T;
  };
}

createRoot(document.getElementById('root')!).render(<App />);
