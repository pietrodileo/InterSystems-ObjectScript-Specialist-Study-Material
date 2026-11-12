export function galleryDownloadItems(items, selected) {
  return selected.size ? items.filter(item => selected.has(item.file)) : items;
}

// PNGs are already compressed; ZIP's stored format needs no compression library.
export function createZip(files) {
  const encoder = new TextEncoder();
  const parts = [], directory = [];
  let offset = 0, directorySize = 0;
  if (files.length > 65535) throw new Error('Too many images for one ZIP.');
  for (const { name, data } of files) {
    const filename = encoder.encode(name);
    if (filename.length > 65535 || offset + data.length + filename.length + 30 > 0xffffffff) {
      throw new Error('The ZIP is too large. Select fewer images.');
    }
    let crc = 0xffffffff;
    for (const byte of data) {
      crc ^= byte;
      for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
    crc = (crc ^ 0xffffffff) >>> 0;
    const local = new Uint8Array(30);
    const header = new DataView(local.buffer);
    header.setUint32(0, 0x04034b50, true);
    header.setUint16(4, 20, true);
    header.setUint16(6, 0x800, true);
    header.setUint16(12, 33, true); // January 1, 1980
    header.setUint32(14, crc, true);
    header.setUint32(18, data.length, true);
    header.setUint32(22, data.length, true);
    header.setUint16(26, filename.length, true);
    parts.push(local, filename, data);
    const central = new Uint8Array(46);
    const entry = new DataView(central.buffer);
    entry.setUint32(0, 0x02014b50, true);
    entry.setUint16(4, 20, true);
    central.set(local.subarray(4, 30), 6);
    entry.setUint32(42, offset, true);
    directory.push(central, filename);
    directorySize += central.length + filename.length;
    offset += local.length + filename.length + data.length;
  }
  if (offset + directorySize + 22 > 0xffffffff) throw new Error('The ZIP is too large. Select fewer images.');
  const end = new Uint8Array(22);
  const footer = new DataView(end.buffer);
  footer.setUint32(0, 0x06054b50, true);
  footer.setUint16(8, files.length, true);
  footer.setUint16(10, files.length, true);
  footer.setUint32(12, directorySize, true);
  footer.setUint32(16, offset, true);
  return new Blob([...parts, ...directory, end], { type: 'application/zip' });
}
