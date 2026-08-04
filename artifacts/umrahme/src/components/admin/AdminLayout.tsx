import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

function GearIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { signOut, email } = useAdminAuth();
  const location = useLocation();

  return (
    <div className="admin-panel min-h-screen" style={{ background: '#f5f5f5', fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <header
        className="border-b"
        style={{
          background: '#131313',
          borderColor: '#2b2b2b',
          boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
        }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3 sm:gap-6">
          <Link
            to="/admin"
            className="flex min-w-0 items-center gap-2 transition-all duration-150 hover:opacity-75"
            style={{ color: '#a3e635' }}
          >
            <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg" style={{ background: '#a3e635', color: '#14532d' }}><GearIcon /></span>
            <span className="truncate font-bold text-[14px]" style={{ color: '#fff' }}>
              Umrahme Admin
            </span>
          </Link>

          <div className="hidden h-5 w-px sm:block" style={{ background: 'rgba(255,255,255,0.16)' }} />

          <nav className="hidden items-center gap-1 sm:flex">
            <Link
              to="/admin"
              className="rounded-md px-3 py-1.5 text-[13px] font-semibold transition-all duration-150"
              style={
                location.pathname === '/admin'
                  ? { color: '#a3e635', background: 'rgba(163,230,53,0.13)' }
                  : { color: 'rgba(255,255,255,0.68)' }
              }
            >
              Travel
            </Link>
          </nav>
        </div>

        <div className="flex flex-none items-center gap-2 sm:gap-3">
          {email && (
            <span
              className="font-mono text-[11px] hidden sm:block px-2 py-1 rounded-md"
              style={{ color: 'rgba(255,255,255,0.58)', background: 'rgba(255,255,255,0.08)', letterSpacing: '0.01em' }}
            >
              {email}
            </span>
          )}
          <button
            onClick={signOut}
            className="h-9 rounded-lg border px-3 text-[12px] font-semibold transition-all duration-150"
            style={{
              borderColor: 'rgba(255,255,255,0.20)',
              color: 'rgba(255,255,255,0.82)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)';
              (e.currentTarget as HTMLButtonElement).style.color = '#ffffff';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.82)';
            }}
          >
            Keluar
          </button>
        </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-9">
        {children}
      </main>
    </div>
  );
}
