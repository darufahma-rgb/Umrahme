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
      className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-app px-3"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      aria-label="Navigasi utama"
    >
      <ul
        className="relative flex items-end justify-around rounded-[26px] overflow-visible px-2 pt-2.5 pb-1.5"
        style={{
          background: 'rgba(252, 250, 247, 0.88)',
          WebkitBackdropFilter: 'blur(28px) saturate(1.8)',
          backdropFilter: 'blur(28px) saturate(1.8)',
          border: '1px solid rgba(32,32,32,0.07)',
          boxShadow:
            '0 -1px 0 0 rgba(255,255,255,0.55) inset, 0 24px 48px -8px rgba(0,0,0,0.16), 0 4px 12px rgba(0,0,0,0.06)',
        }}
      >
        {slots.map(({ to, label, Icon, center }) =>
          center ? (
            /* ── FAB "Ibadah" — center elevated button ── */
            <li key={to}>
              <NavLink
                to={to}
                aria-label={label}
                className="flex flex-col items-center pb-1"
              >
                {({ isActive }) => (
                  <>
                    <span
                      className="flex h-[66px] w-[66px] items-center justify-center rounded-full transition-all duration-200 active:scale-90"
                      style={{
                        marginTop: '-38px',
                        background: isActive
                          ? 'linear-gradient(145deg, #0ea5e9 0%, #0284c7 100%)'
                          : 'linear-gradient(145deg, #38bdf8 0%, #0ea5e9 100%)',
                        boxShadow: isActive
                          ? '0 0 0 3px rgba(14,165,233,0.18), 0 8px 24px rgba(14,165,233,0.42), 0 2px 6px rgba(0,0,0,0.25)'
                          : '0 0 0 3px rgba(14,165,233,0.10), 0 6px 18px rgba(14,165,233,0.30), 0 2px 6px rgba(0,0,0,0.20)',
                      }}
                    >
                      <Icon
                        className="h-[26px] w-[26px]"
                        style={{ color: '#ffffff' }}
                      />
                    </span>
                    <span
                      className={`mt-2 font-mono text-[10px] uppercase tracking-wider transition-colors ${
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
            /* ── Regular nav item ── */
            <li key={to} className="flex">
              <NavLink
                to={to}
                className="group flex min-h-[56px] flex-col items-center justify-end gap-1 px-3 pb-1"
                aria-label={label}
              >
                {({ isActive }) => (
                  <>
                    {/* Active indicator dot */}
                    <span
                      className={`absolute top-1.5 h-1 w-1 rounded-full bg-primary transition-all duration-200 ${
                        isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                      }`}
                    />
                    {/* Icon with active pill bg */}
                    <span
                      className={`relative flex items-center justify-center rounded-full transition-all duration-200 ${
                        isActive
                          ? 'h-8 w-8 bg-primary/10'
                          : 'h-8 w-8'
                      }`}
                    >
                      <Icon
                        className={`h-[20px] w-[20px] transition-colors duration-200 ${
                          isActive ? 'text-primary' : 'text-ash group-hover:text-charcoal'
                        }`}
                      />
                    </span>
                    <span
                      className={`font-mono text-[10px] uppercase tracking-wider transition-colors duration-200 ${
                        isActive ? 'text-ink font-semibold' : 'text-ash'
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
