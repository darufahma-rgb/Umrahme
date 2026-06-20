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
        className="relative flex items-end justify-around rounded-[22px] border border-hairline bg-canvas/96 px-2 pt-2.5 pb-1.5 backdrop-blur-nav overflow-visible"
        style={{ boxShadow: '0 -1px 0 0 rgba(0,0,0,0.04), 0 20px 48px -8px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.06)' }}
      >
        {slots.map(({ to, label, Icon, center }) =>
          center ? (
            /* ── FAB "Ibadah" ──
               Lingkaran ditarik ke atas dengan marginTop negatif (HANYA pada span),
               sehingga label tetap sejajar baseline dengan 4 item lain.
               ~60% lingkaran berada di atas permukaan nav bar.
            */
            <li key={to}>
              <NavLink
                to={to}
                aria-label={label}
                className="flex flex-col items-center pb-1"
              >
                {({ isActive }) => (
                  <>
                    <span
                      className="flex h-[68px] w-[68px] items-center justify-center rounded-full transition-all active:scale-95"
                      style={{
                        marginTop: '-40px',
                        background: '#C2185B',
                        boxShadow: isActive
                          ? '0 0 0 3px rgba(194,24,91,0.18), 0 0 28px rgba(233,30,140,0.55), 0 6px 20px rgba(194,24,91,0.40)'
                          : '0 0 0 3px rgba(194,24,91,0.12), 0 0 20px rgba(233,30,140,0.35), 0 4px 16px rgba(0,0,0,0.22)',
                      }}
                    >
                      <Icon
                        className="h-[26px] w-[26px]"
                        style={{ color: '#fdf8f5' }}
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
            /* ── Item nav biasa ── */
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
