import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { urutanFase } from '../data/jamaah';
import {
  IconBeranda,
  IconPanduan,
  IconIbadah,
  IconDoa,
  IconProfil,
} from './icons';

const navItems = [
  { to: '/beranda', label: 'Beranda', Icon: IconBeranda, isIbadah: false },
  { to: '/panduan', label: 'Panduan', Icon: IconPanduan, isIbadah: false },
  { to: '/ibadah', label: 'Ibadah', Icon: IconIbadah, isIbadah: true },
  { to: '/doa', label: 'Doa', Icon: IconDoa, isIbadah: false },
  { to: '/profil', label: 'Profil', Icon: IconProfil, isIbadah: false },
];

export default function DesktopSidebar() {
  const { jamaah, logout } = useAuth();
  if (!jamaah) return null;

  const idxFase = urutanFase.findIndex((f) => f.id === jamaah.fase);

  return (
    <aside
      className="hidden lg:flex w-[270px] flex-none flex-col h-screen sticky top-0 border-r border-hairline bg-canvas overflow-y-auto z-20"
    >
      {/* Brand + jamaah info */}
      <div className="px-6 pt-8 pb-5 border-b border-hairline">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary mb-0.5">
          Pendamping Umrah
        </p>
        <h1 className="font-display text-[22px] font-semibold text-ink leading-tight">Umrahme</h1>

        <div className="mt-4 rounded-md border border-hairline bg-surface-bone px-3.5 py-3">
          <p className="text-[14px] font-semibold leading-tight text-ink">{jamaah.nama}</p>
          <p className="mt-0.5 font-mono text-[11px] text-mute">{jamaah.nomorJamaah}</p>
          <p className="mt-1.5 text-[12px] text-mute">
            via <span className="text-body">{jamaah.travel}</span>
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4" aria-label="Navigasi utama">
        <ul className="space-y-0.5">
          {navItems.map(({ to, label, Icon, isIbadah }) => (
            <li key={to}>
              {isIbadah && <div className="my-2 border-t border-hairline" aria-hidden />}

              <NavLink
                to={to}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-full px-3.5 py-2.5 transition-colors ${
                    isActive
                      ? isIbadah
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-bone text-ink'
                      : 'text-mute hover:bg-surface-bone hover:text-body'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`h-5 w-5 flex-none transition-colors ${
                        isActive
                          ? isIbadah
                            ? 'text-on-primary'
                            : 'text-primary'
                          : 'text-mute group-hover:text-body'
                      }`}
                    />
                    <span className="flex-1 text-[14px] font-medium">{label}</span>
                    {isIbadah && (
                      <span className={`font-mono text-[9px] uppercase tracking-wider ${isActive ? 'text-on-primary/70' : 'text-mute'}`}>
                        Mode B
                      </span>
                    )}
                  </>
                )}
              </NavLink>

              {isIbadah && <div className="my-2 border-t border-hairline" aria-hidden />}
            </li>
          ))}
        </ul>
      </nav>

      {/* Fase + logout */}
      <div className="px-5 py-5 border-t border-hairline">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-mute">
          Fase Perjalanan
        </p>
        <div className="space-y-2">
          {urutanFase.map((f, i) => {
            const done = i < idxFase;
            const active = i === idxFase;
            return (
              <div key={f.id} className="flex items-center gap-2.5">
                <span
                  className={`h-1.5 w-1.5 flex-none rounded-full ${
                    active ? 'bg-primary' : done ? 'bg-primary/40' : 'bg-stone'
                  }`}
                />
                <span
                  className={`font-mono text-[11px] tracking-wider ${
                    active ? 'text-ink font-semibold' : done ? 'text-mute' : 'text-stone'
                  }`}
                >
                  {f.label}
                </span>
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 flex-none rounded-full bg-primary animate-pulse" />
                )}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={logout}
          className="mt-5 w-full rounded-full border border-hairline-strong px-4 py-2.5 text-left font-mono text-[11px] uppercase tracking-wider text-mute transition-colors hover:bg-surface-bone hover:text-ink"
        >
          Keluar
        </button>
      </div>
    </aside>
  );
}
