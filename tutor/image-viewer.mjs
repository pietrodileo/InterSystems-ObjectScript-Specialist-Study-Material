const viewer = document.querySelector('#image-viewer');
const viewport = document.querySelector('#image-viewport');
const image = viewer.querySelector('img');
const message = document.querySelector('#image-viewer-message');
const zoomOut = document.querySelector('#image-zoom-out');
const zoomIn = document.querySelector('#image-zoom-in');
const zoomLevel = document.querySelector('#image-zoom-level');
const download = document.querySelector('#image-download');
const minZoom = 100;
const maxZoom = 400;
const zoomStep = 25;
let zoom = minZoom;

function updateZoom() {
  if (image.hidden) return;

  const view = viewport.getBoundingClientRect();
  const centerX = view.left + viewport.clientWidth / 2;
  const centerY = view.top + viewport.clientHeight / 2;
  const before = image.getBoundingClientRect();
  const anchorX = before.width ? (centerX - before.left) / before.width : .5;
  const anchorY = before.height ? (centerY - before.top) / before.height : .5;

  // Fit against the full viewport so scrollbars do not change the zoom scale.
  const fit = Math.min(1, (viewport.offsetWidth - 24) / image.naturalWidth,
    (viewport.offsetHeight - 24) / image.naturalHeight);
  image.style.width = `${Math.max(1, image.naturalWidth * fit * zoom / 100)}px`;

  const after = image.getBoundingClientRect();
  viewport.scrollBy(after.left + anchorX * after.width - centerX,
    after.top + anchorY * after.height - centerY);
  zoomOut.disabled = zoom === minZoom;
  zoomIn.disabled = zoom === maxZoom;
  if (zoomLevel.value !== `${zoom}%`) zoomLevel.value = `${zoom}%`;
}

document.querySelector('#lesson').addEventListener('click', event => {
  const link = event.target.closest('[data-image-viewer]');
  if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey ||
      event.shiftKey || event.altKey || typeof viewer.showModal !== 'function') return;

  event.preventDefault();
  link.focus({ preventScroll: true });
  const thumbnail = link.querySelector('img');
  image.hidden = true;
  image.style.removeProperty('width');
  image.alt = thumbnail.alt;
  download.href = link.href;
  zoom = minZoom;
  zoomOut.disabled = true;
  zoomIn.disabled = true;
  zoomLevel.value = `${zoom}%`;
  message.textContent = 'Loading image…';
  message.hidden = false;
  viewer.showModal();
  viewport.scrollTo(0, 0);
  image.src = link.href;
});

image.addEventListener('load', () => {
  if (!viewer.open) return;
  message.hidden = true;
  image.hidden = false;
  updateZoom();
});
image.addEventListener('error', () => {
  message.textContent = 'The image could not be loaded.';
});
zoomOut.addEventListener('click', () => {
  zoom -= zoomStep;
  updateZoom();
});
zoomIn.addEventListener('click', () => {
  zoom += zoomStep;
  updateZoom();
});
new ResizeObserver(() => {
  if (viewer.open) updateZoom();
}).observe(viewport, { box: 'border-box' });

document.querySelector('#image-close').addEventListener('click', () => viewer.close());
viewer.addEventListener('click', event => {
  if (event.target === viewer) viewer.close();
});
viewer.addEventListener('close', () => {
  if (!viewer.open) image.removeAttribute('src');
});
