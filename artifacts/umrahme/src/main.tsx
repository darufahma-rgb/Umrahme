import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { activeTenant } from './config/tenants';
import './index.css';

// ── Terapkan tema tenant ke CSS variables sebelum render ──
const root = document.documentElement;
root.style.setProperty('--color-primary', activeTenant.theme.primary);
root.style.setProperty('--color-primary-deep', activeTenant.theme.primaryDeep);

// ── Set title tab ──
document.title = activeTenant.pageTitle;

// ── Set favicon jika tenant punya path khusus ──
if (activeTenant.faviconPath) {
  const link =
    (document.querySelector("link[rel~='icon']") as HTMLLinkElement | null) ??
    (() => {
      const el = document.createElement('link');
      el.rel = 'icon';
      document.head.appendChild(el);
      return el;
    })();
  link.href = activeTenant.faviconPath;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
