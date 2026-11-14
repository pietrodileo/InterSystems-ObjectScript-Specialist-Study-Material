import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';

test('viewer explanation toggles, follows the selected image, and resets on close', async () => {
  const nodes = new Map();
  const node = key => {
    if (!nodes.has(key)) nodes.set(key, {
      hidden: false, children: [], attributes: {}, events: {}, style: { removeProperty() {} },
      addEventListener(type, callback) { this.events[type] = callback; },
      setAttribute(name, value) { this.attributes[name] = value; },
      getAttribute(name) { return this.attributes[name]; },
      removeAttribute(name) { delete this.attributes[name]; },
      replaceChildren(...children) { this.children = children; },
      querySelector: selector => node(selector), scrollTo() {},
    });
    return nodes.get(key);
  };
  const context = vm.createContext({
    document: { querySelector: node, createElement: tag => ({ tag }) },
    ResizeObserver: class { observe() {} },
  });
  vm.runInContext(await readFile(new URL('./image-viewer.mjs', import.meta.url), 'utf8'), context);
  node('#image-viewer').open = true;
  const link = (name, withExplanation = true) => ({
    href: name, querySelector: () => ({ alt: name }),
    closest: () => ({ querySelector: () => ({ content: {
      querySelector: selector => selector === '[data-diagram-caption]' || (selector === '[data-diagram-explanation]' && withExplanation)
        ? { cloneNode: () => ({ name, selector }) } : null,
    } }) }),
  });
  context.first = link('first');
  context.second = link('second');
  context.missing = link('missing', false);
  vm.runInContext('showImage(first)', context);
  const panel = node('#image-explanation');
  const toggle = node('#image-explanation-toggle');
  assert.equal(panel.hidden, true);
  assert.equal(node('#image-viewer-caption').children[1].selector, '[data-diagram-caption]');
  toggle.events.click();
  assert.equal(panel.hidden, false);
  assert.equal(toggle.getAttribute('aria-expanded'), 'true');
  assert.equal(toggle.getAttribute('aria-label'), 'Hide diagram explanation');
  vm.runInContext('showImage(second)', context);
  assert.equal(panel.hidden, false);
  assert.equal(node('#image-explanation-body').children[0].name, 'second');
  assert.ok(node('#image-viewer-caption').children.includes(panel));
  vm.runInContext('showImage(missing)', context);
  assert.equal(panel.hidden, true);
  assert.equal(toggle.disabled, true);
  assert.equal(node('#image-explanation-body').children.length, 0);
  vm.runInContext('showImage(first)', context);
  toggle.events.click();
  node('#image-viewer').open = false;
  node('#image-viewer').events.close();
  assert.equal(panel.hidden, true);
  assert.equal(toggle.getAttribute('aria-expanded'), 'false');
});
