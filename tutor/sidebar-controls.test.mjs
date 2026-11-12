import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

test('sidebar follows its viewport offset on scroll, resize, and layout changes', async () => {
  let top = 110;
  let offset;
  const events = {};
  const sidebar = {
    getBoundingClientRect: () => ({ top }),
    style: { setProperty: (name, value) => { assert.equal(name, '--sidebar-top'); offset = value; } },
  };
  let onResize;
  const source = await readFile(new URL('./sidebar-controls.mjs', import.meta.url), 'utf8');
  vm.runInNewContext(source, {
    document: { querySelector: selector => selector === '#course' ? sidebar : null, documentElement: { dataset: {} } },
    window: { addEventListener: (name, handler) => { events[name] = handler; } },
    localStorage: { getItem: () => null },
    ResizeObserver: class { constructor(callback) { onResize = callback; } observe() {} },
  });
  assert.equal(offset, '110px');
  top = 16;
  events.scroll();
  assert.equal(offset, '16px');
  top = 150;
  events.resize();
  assert.equal(offset, '150px');
  top = 96;
  onResize();
  assert.equal(offset, '96px');
});
