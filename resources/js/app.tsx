import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import '../css/app.css';

import type { ComponentType } from 'react';

// Catch global errors and render them to the screen
window.addEventListener('error', (e) => {
  document.body.innerHTML = `<div style="padding: 2rem; color: red; background: white; z-index: 9999; position: absolute; top: 0; left: 0; width: 100vw; height: 100vh;">
    <h1>React Crash!</h1>
    <pre>${e.error?.stack || e.message}</pre>
  </div>`;
});
window.addEventListener('unhandledrejection', (e) => {
  document.body.innerHTML = `<div style="padding: 2rem; color: red; background: white; z-index: 9999; position: absolute; top: 0; left: 0; width: 100vw; height: 100vh;">
    <h1>Unhandled Promise Rejection!</h1>
    <pre>${e.reason?.stack || e.reason}</pre>
  </div>`;
});

try {
  const el = document.getElementById('lumina-app');
  if (!el || !el.dataset.page) throw new Error('Missing root element or data-page attribute');
  
  const initialPage = JSON.parse(el.dataset.page);

  createInertiaApp({
    id: 'lumina-app',
    page: initialPage,
    resolve: name => {
      const pages = import.meta.glob<{ default: ComponentType }>('./Pages/**/*.tsx', { eager: true });
      if (!pages[`./Pages/${name}.tsx`]) {
        throw new Error(`Inertia Error: Component './Pages/${name}.tsx' not found!`);
      }
      return pages[`./Pages/${name}.tsx`];
    },
    setup({ el, App, props }) {
      createRoot(el).render(<App {...props} />);
    },
  });
} catch (e: any) {
  document.body.innerHTML = `<div style="padding: 2rem; color: red; background: white;"><h1>Setup Crash!</h1><pre>${e.stack || e.message}</pre></div>`;
}
