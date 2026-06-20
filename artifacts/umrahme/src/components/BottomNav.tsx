import { NavLink } from 'react-router-dom';
import { IconBeranda, IconPanduan, IconIbadah, IconDoa, IconProfil } from './icons';

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
      className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-app border-t border-hairline bg-canvas/95 backdrop-blur-md"
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
                          ? 'border-primary/40 bg-primary text-on-primary shadow-drop-soft'
                          : 'border-hairline-strong bg-surface-dark text-on-dark'
                      }`}
                    >
                      <Icon className="h-7 w-7" />
                    </span>
                    <span
                      className={`mt-1 font-mono text-[10px] uppercase tracking-wider ${
                        isActive ? 'text-primary' : 'text-mute'
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
                        isActive ? 'text-primary' : 'text-mute'
                      }`}
                    />
                    <span
                      className={`font-mono text-[10px] uppercase tracking-wider transition-colors ${
                        isActive ? 'text-ink' : 'text-mute'
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
