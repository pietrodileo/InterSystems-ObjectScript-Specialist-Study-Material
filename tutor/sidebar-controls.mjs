const themeToggle = document.querySelector('#theme-toggle');
const sidebar = document.querySelector('#course');
if (sidebar) {
  const fitSidebar = () => sidebar.style.setProperty('--sidebar-top', `${Math.max(16, sidebar.getBoundingClientRect().top)}px`);
  window.addEventListener('scroll', fitSidebar, { passive: true });
  window.addEventListener('resize', fitSidebar);
  const observer = new ResizeObserver(fitSidebar);
  observer.observe(sidebar);
  observer.observe(document.querySelector('.topbar'));
  fitSidebar();
}
const themeLabel = document.querySelector('#theme-mode-label');
const themeColor = document.querySelector('meta[name="theme-color"]');
const root = document.documentElement;
const themeStorageKey = 'objectscript-tutor-theme';

function applyTheme(theme) {
  root.dataset.theme = theme;
  const dark = theme === 'dark';
  const action = dark ? 'Switch to light mode' : 'Switch to dark mode';
  themeToggle?.setAttribute('aria-label', action);
  themeToggle?.setAttribute('title', action);
  if (themeLabel) themeLabel.textContent = dark ? 'Light' : 'Dark';
  themeColor?.setAttribute('content', dark ? '#080f20' : '#21328c');
}

let theme = 'light';
try {
  if (localStorage.getItem(themeStorageKey) === 'dark') theme = 'dark';
} catch {}
applyTheme(theme);

themeToggle?.addEventListener('click', () => {
  theme = theme === 'dark' ? 'light' : 'dark';
  applyTheme(theme);
  try {
    localStorage.setItem(themeStorageKey, theme);
  } catch {}
});

const infoDialog = document.querySelector('#info-dialog');
if (infoDialog) {
  document.querySelector('#info-button')?.addEventListener('click', () => infoDialog.showModal());
  document.querySelector('#close-info')?.addEventListener('click', () => infoDialog.close());
  infoDialog.addEventListener('click', event => {
    if (event.target === infoDialog) infoDialog.close();
  });
}
