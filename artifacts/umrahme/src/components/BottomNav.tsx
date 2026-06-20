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
      className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-app px-3"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      aria-label="Navigasi utama"
    >
      <ul
        className="relative flex items-end justify-around rounded-[22px] border border-hairline bg-canvas/96 px-2 pt-2.5 pb-1.5 backdrop-blur-nav"
        style={{ boxShadow: '0 -1px 0 0 rgba(0,0,0,0.04), 0 20px 48px -8px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.06)' }}
      >
        {slots.map(({ to, label, Icon, center }) =>
          center ? (
            <li key={to} className="flex -translate-y-4 flex-col items-center">
              <NavLink to={to} aria-label={label} className="flex flex-col items-center gap-1">
                {({ isActive }) => (
                  <>
                    <span
                      className={`flex h-[58px] w-[58px] items-center justify-center rounded-full border-2 transition-all ${
                        isActive
                          ? 'border-primary/30 bg-primary text-on-primary shadow-glow-primary'
                          : 'border-hairline bg-surface-dark text-on-dark shadow-drop-lifted'
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                    </span>
                    <span
                      className={`font-mono text-[10px] uppercase tracking-wider transition-colors ${
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
            <li key={to} className="flex">
              <NavLink
                to={to}
                className="flex min-h-[56px] flex-col items-center justify-end gap-1 px-3 pb-1"
                aria-label={label}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`h-[22px] w-[22px] transition-colors ${
                        isActive ? 'text-primary' : 'text-ash'
                      }`}
                    />
                    <span
                      className={`font-mono text-[10px] uppercase tracking-wider transition-colors ${
                        isActive ? 'text-ink' : 'text-ash'
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
