import assert from 'node:assert/strict';
import test from 'node:test';
import { crc32 } from 'node:zlib';
import { createZip, galleryDownloadItems } from './gallery-download.mjs';

test('ZIP download includes all images unless a subset is selected', () => {
  const items = [{ file: 'one.png' }, { file: 'two.png' }, { file: 'three.png' }];
  assert.deepEqual(galleryDownloadItems(items, new Set()), items);
  assert.deepEqual(galleryDownloadItems(items, new Set(['two.png'])), [items[1]]);
  assert.deepEqual(galleryDownloadItems(items, new Set(['three.png', 'one.png'])), [items[0], items[2]]);
});

test('ZIP preserves binary images, UTF-8 names, checksums and directory offsets', async () => {
  const files = [
    { name: 'T1.1/diagram.png', data: Uint8Array.from([137, 80, 78, 71, 0, 255]) },
    { name: 'T2.1/immaginè.png', data: new TextEncoder().encode('123456789') },
  ];
  const zip = createZip(files);
  assert.equal(zip.type, 'application/zip');
  const bytes = new Uint8Array(await zip.arrayBuffer());
  const view = new DataView(bytes.buffer);
  const footer = bytes.length - 22;
  assert.equal(view.getUint32(footer, true), 0x06054b50);
  assert.equal(view.getUint16(footer + 10, true), files.length);
  let central = view.getUint32(footer + 16, true);
  assert.equal(central + view.getUint32(footer + 12, true), footer);
  for (const file of files) {
    assert.equal(view.getUint32(central, true), 0x02014b50);
    const offset = view.getUint32(central + 42, true);
    assert.equal(view.getUint32(offset, true), 0x04034b50);
    assert.equal(view.getUint16(offset + 6, true), 0x800);
    assert.equal(view.getUint16(offset + 8, true), 0);
    assert.equal(view.getUint32(offset + 14, true), crc32(file.data));
    assert.equal(view.getUint32(central + 16, true), crc32(file.data));
    assert.equal(view.getUint32(offset + 18, true), file.data.length);
    const nameLength = view.getUint16(offset + 26, true);
    assert.equal(new TextDecoder().decode(bytes.slice(offset + 30, offset + 30 + nameLength)), file.name);
    assert.deepEqual(bytes.slice(offset + 30 + nameLength, offset + 30 + nameLength + file.data.length), file.data);
    assert.equal(new TextDecoder().decode(bytes.slice(central + 46, central + 46 + nameLength)), file.name);
    central += 46 + nameLength;
  }
  assert.equal(central, footer);
});
