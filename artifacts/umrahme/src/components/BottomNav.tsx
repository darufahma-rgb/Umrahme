import { NavLink } from 'react-router-dom';
import { IconBeranda, IconPanduan, IconIbadah, IconDoa, IconProfil } from './icons';

const slots = [
  { to: '/beranda', label: 'Beranda', Icon: IconBeranda, center: false },
  { to: '/panduan', label: 'Panduan', Icon: IconPanduan, center: false },
  { to: '/ibadah',  label: 'Ibadah',  Icon: IconIbadah,  center: true  },
  { to: '/doa',     label: 'Doa',     Icon: IconDoa,     center: false },
  { to: '/profil',  label: 'Profil',  Icon: IconProfil,  center: false },
];

export default function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-app px-4"
      style={{ paddingBottom: 'max(0.875rem, env(safe-area-inset-bottom))' }}
      aria-label="Navigasi utama"
    >
      <ul
        className="relative flex items-end justify-around rounded-[28px] overflow-visible px-2 pt-3 pb-2.5"
        style={{
          background: 'rgba(252, 250, 247, 0.92)',
          WebkitBackdropFilter: 'blur(32px) saturate(1.8)',
          backdropFilter: 'blur(32px) saturate(1.8)',
          border: '1px solid rgba(32,32,32,0.07)',
          boxShadow:
            '0 -1px 0 0 rgba(255,255,255,0.6) inset, 0 20px 48px -8px rgba(0,0,0,0.14), 0 4px 12px rgba(0,0,0,0.05)',
        }}
      >
        {slots.map(({ to, label, Icon, center }) =>
          center ? (
            /* ── FAB "Ibadah" ── */
            <li key={to}>
              <NavLink to={to} aria-label={label} className="flex flex-col items-center">
                {({ isActive }) => (
                  <span
                    className="flex h-[58px] w-[58px] items-center justify-center rounded-full transition-all duration-200 active:scale-90"
                    style={{
                      marginTop: '-32px',
                      background: isActive
                        ? 'linear-gradient(145deg, #0ea5e9 0%, #0284c7 100%)'
                        : 'linear-gradient(145deg, #38bdf8 0%, #0ea5e9 100%)',
                      boxShadow: isActive
                        ? '0 0 0 3px rgba(14,165,233,0.18), 0 8px 22px rgba(14,165,233,0.40), 0 2px 6px rgba(0,0,0,0.22)'
                        : '0 0 0 3px rgba(14,165,233,0.10), 0 6px 16px rgba(14,165,233,0.28), 0 2px 6px rgba(0,0,0,0.16)',
                    }}
                  >
                    <Icon className="h-[22px] w-[22px]" style={{ color: '#ffffff' }} />
                  </span>
                )}
              </NavLink>
            </li>
          ) : (
            /* ── Regular icon-only item ── */
            <li key={to} className="flex">
              <NavLink
                to={to}
                aria-label={label}
                className="group flex flex-col items-center justify-center gap-1.5 px-4 pb-0.5"
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`h-[22px] w-[22px] transition-colors duration-200 ${
                        isActive ? 'text-primary' : 'text-ash group-hover:text-charcoal'
                      }`}
                    />
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
