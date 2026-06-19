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
    <aside className="hidden lg:flex w-[270px] flex-none flex-col h-screen sticky top-0 bg-ink-900 border-r border-ink-800 overflow-y-auto z-20">
      {/* Brand + jamaah info */}
      <div className="px-6 pt-8 pb-5 border-b border-ink-800/60">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-rose-400 mb-0.5">
          Pendamping Umrah
        </p>
        <h1 className="font-display text-[22px] font-semibold text-parchment-100">Umrahme</h1>

        <div className="mt-4 rounded-xl border border-ink-800 bg-ink-950/60 px-3.5 py-3">
          <p className="text-[14px] font-semibold leading-tight text-parchment-100">{jamaah.nama}</p>
          <p className="mt-0.5 font-mono text-[11px] text-mute-500">{jamaah.nomorJamaah}</p>
          <p className="mt-1.5 text-[12px] text-mute-500">
            via <span className="text-parchment-100/80">{jamaah.travel}</span>
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4" aria-label="Navigasi utama">
        <ul className="space-y-0.5">
          {navItems.map(({ to, label, Icon, isIbadah }) => (
            <li key={to}>
              {/* Divider tipis di atas Ibadah */}
              {isIbadah && <div className="my-2 border-t border-ink-800/50" aria-hidden />}

              <NavLink
                to={to}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 transition-colors ${
                    isActive
                      ? isIbadah
                        ? 'bg-rose-600/10 border border-gold-400/20 text-parchment-100'
                        : 'bg-ink-800 text-parchment-100'
                      : 'text-mute-500 hover:bg-ink-800/50 hover:text-parchment-100/80'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`h-5 w-5 flex-none transition-colors ${
                        isActive
                          ? 'text-rose-400'
                          : 'text-mute-500 group-hover:text-parchment-100/60'
                      }`}
                    />
                    <span className="flex-1 text-[14px] font-medium">{label}</span>
                    {isIbadah && (
                      <span className="font-mono text-[9px] uppercase tracking-wider text-gold-400/60">
                        Mode B
                      </span>
                    )}
                  </>
                )}
              </NavLink>

              {/* Divider tipis di bawah Ibadah */}
              {isIbadah && <div className="my-2 border-t border-ink-800/50" aria-hidden />}
            </li>
          ))}
        </ul>
      </nav>

      {/* Fase + logout */}
      <div className="px-5 py-5 border-t border-ink-800/60">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-mute-500">
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
                    active ? 'bg-rose-400' : done ? 'bg-rose-600/50' : 'bg-ink-800'
                  }`}
                />
                <span
                  className={`font-mono text-[11px] tracking-wider ${
                    active ? 'text-parchment-100' : done ? 'text-mute-500/60' : 'text-mute-500/40'
                  }`}
                >
                  {f.label}
                </span>
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 flex-none rounded-full bg-rose-400 animate-pulse" />
                )}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={logout}
          className="mt-5 w-full rounded-xl border border-ink-800 px-4 py-2.5 text-left font-mono text-[11px] uppercase tracking-wider text-mute-500 transition-colors hover:border-ink-700 hover:text-parchment-100"
        >
          Keluar
        </button>
      </div>
    </aside>
  );
}
