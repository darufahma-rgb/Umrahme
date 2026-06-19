import { NavLink } from 'react-router-dom';
import { IconBeranda, IconPanduan, IconIbadah, IconDoa, IconProfil } from './icons';

// =============================================================
// BottomNav — 5 slot, disusun berdasar KAPAN dipakai.
// Slot tengah "Ibadah" elevated (lebih besar) karena paling
// sering dibuka saat Mode B (di Tanah Suci).
// =============================================================

const slots = [
  { to: '/beranda', label: 'Beranda', Icon: IconBeranda, center: false },
  { to: '/panduan', label: 'Panduan', Icon: IconPanduan, center: false },
  { to: '/ibadah', label: 'Ibadah', Icon: IconIbadah, center: true },
  { to: '/doa', label: 'Doa', Icon: IconDoa, center: false },
  { to: '/profil', label: 'Profil', Icon: IconProfil, center: false },
];

export default function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-app border-t border-ink-800/80 bg-ink-950/90 backdrop-blur-md"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Navigasi utama"
    >
      <ul className="grid grid-cols-5 items-end px-2 pt-1.5">
        {slots.map(({ to, label, Icon, center }) =>
          center ? (
            <li key={to} className="flex justify-center">
              <NavLink
                to={to}
                className="group relative -mt-7 flex flex-col items-center"
                aria-label={label}
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`flex h-16 w-16 items-center justify-center rounded-full border transition-all ${
                        isActive
                          ? 'border-rose-400/60 bg-rose-600 text-parchment-100 shadow-glow'
                          : 'border-ink-800 bg-ink-900 text-rose-400 shadow-glow-soft'
                      }`}
                    >
                      <Icon className="h-7 w-7" />
                    </span>
                    <span
                      className={`mt-1 font-mono text-[10px] uppercase tracking-wider ${
                        isActive ? 'text-rose-400' : 'text-mute-500'
                      }`}
                    >
                      {label}
                    </span>
                  </>
                )}
              </NavLink>
            </li>
          ) : (
            <li key={to} className="flex justify-center">
              <NavLink
                to={to}
                className="flex min-h-[56px] flex-col items-center justify-end gap-1 px-2 py-2"
                aria-label={label}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`h-6 w-6 transition-colors ${
                        isActive ? 'text-rose-400' : 'text-mute-500'
                      }`}
                    />
                    <span
                      className={`font-mono text-[10px] uppercase tracking-wider transition-colors ${
                        isActive ? 'text-parchment-100' : 'text-mute-500'
                      }`}
                    >
                      {label}
                    </span>
                  </>
                )}
              </NavLink>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
}
