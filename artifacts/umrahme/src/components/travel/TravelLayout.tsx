import { useEffect, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTravelAuth } from '../../context/TravelAuthContext';

const NAV = [
  { to: '/travel', label: 'Jamaah Saya' },
  { to: '/travel/kontrak', label: 'Kontrak' },
];

export default function TravelLayout({ children }: { children: ReactNode }) {
  const { signOut, tenant } = useTravelAuth();
  const location = useLocation();

  // Warna panel mengikuti warna travel, sama seperti aplikasi jamaah.
  useEffect(() => {
    if (!tenant) return;
    const root = document.documentElement;
    root.style.setProperty('--color-primary', tenant.primary_color);
    root.style.setProperty('--color-primary-deep', tenant.primary_deep_color);
  }, [tenant]);

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-hairline bg-white">
        <div className="mx-auto flex min-h-[60px] max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-5 py-2">
            <Link to="/travel" className="flex min-w-0 flex-1 items-center gap-2.5 transition-opacity hover:opacity-75 sm:flex-none">
              {tenant?.logo_url ? (
                <span className="flex h-9 w-9 flex-none items-center justify-center overflow-hidden rounded-xl bg-primary p-1.5">
                  <img src={tenant.logo_url} alt="" className="h-full w-full object-contain" />
                </span>
              ) : (
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-primary text-[13px] font-bold text-white">
                  {(tenant?.nama_travel ?? 'P').charAt(0)}
                </span>
              )}
              <span className="truncate text-[13.5px] font-bold text-ink">{tenant?.nama_travel ?? 'Portal Travel'}</span>
            </Link>

            <nav className="order-last flex w-full items-center gap-1 sm:order-none sm:mr-auto sm:w-auto">
              {NAV.map((item) => {
                const active = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    aria-current={active ? 'page' : undefined}
                    className={`whitespace-nowrap rounded-full px-3.5 py-2 text-[12.5px] font-semibold transition-colors ${active ? 'text-primary' : 'text-charcoal hover:bg-surface-bone'}`}
                    style={active ? { background: 'color-mix(in srgb, var(--color-primary) 10%, transparent)' } : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

          <button
            onClick={signOut}
            className="rounded-full bg-surface-bone px-3.5 py-2 text-[12px] font-semibold text-charcoal transition-opacity hover:opacity-70"
          >
            Keluar
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-6 lg:py-8">
        {children}
      </main>
    </div>
  );
}
