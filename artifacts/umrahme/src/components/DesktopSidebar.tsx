import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { urutanFase } from '../data/jamaah';
import { activeTenant } from '../config/tenants';
import { IconBeranda, IconPanduan, IconIbadah, IconDoa, IconProfil } from './icons';

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
    <aside className="hidden lg:flex w-[260px] flex-none flex-col h-screen sticky top-0 border-r border-hairline bg-canvas overflow-y-auto z-20">

      {/* Brand */}
      <div className="px-5 pt-7 pb-5 border-b border-hairline">
        <img
          src={activeTenant.logoPath}
          alt={activeTenant.namaTravel}
          className="h-8 w-auto mb-2"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />
        <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-primary/80 mb-1">
          Pendamping Umrah
        </p>
        <h1 className="font-display text-[20px] font-bold text-ink leading-tight tracking-[-0.5px]">
          {activeTenant.namaTravel}
        </h1>

        {/* Jamaah card */}
        <div className="mt-4 rounded-xl border border-hairline bg-surface-bone px-3.5 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-primary/10 border border-primary/20">
              <span className="font-mono text-[12px] font-bold text-primary">
                {jamaah.nama.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold leading-tight text-ink">{jamaah.nama}</p>
              <p className="font-mono text-[10px] text-mute">{jamaah.nomorJamaah}</p>
            </div>
          </div>
          <p className="mt-2 text-[11px] text-ash border-t border-hairline pt-2">
            via <span className="text-charcoal font-medium">{jamaah.travel}</span>
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3" aria-label="Navigasi utama">
        <ul className="space-y-0.5">
          {navItems.map(({ to, label, Icon, isIbadah }) => (
            <li key={to}>
              {isIbadah && <div className="my-2 border-t border-hairline" aria-hidden />}

              <NavLink
                to={to}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 transition-all ${
                    isActive
                      ? isIbadah
                        ? 'bg-primary text-on-primary shadow-glow-primary'
                        : 'bg-surface-bone text-ink'
                      : 'text-ash hover:bg-surface-bone hover:text-body'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`h-[18px] w-[18px] flex-none transition-colors ${
                        isActive
                          ? isIbadah
                            ? 'text-on-primary'
                            : 'text-primary'
                          : 'text-ash group-hover:text-charcoal'
                      }`}
                    />
                    <span className="flex-1 text-[14px] font-medium">{label}</span>
                    {isIbadah && (
                      <span
                        className={`font-mono text-[9px] uppercase tracking-wider ${
                          isActive ? 'text-on-primary/70' : 'text-mute'
                        }`}
                      >
                        Aktif
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
        <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.2em] text-mute">
          Fase Perjalanan
        </p>
        <div className="space-y-2.5">
          {urutanFase.map((f, i) => {
            const done = i < idxFase;
            const active = i === idxFase;
            return (
              <div key={f.id} className="flex items-center gap-2.5">
                <span
                  className={`h-1.5 w-1.5 flex-none rounded-full transition-colors ${
                    active ? 'bg-primary' : done ? 'bg-primary/35' : 'bg-stone'
                  }`}
                />
                <span
                  className={`flex-1 font-mono text-[11px] tracking-wide transition-colors ${
                    active ? 'font-semibold text-ink' : done ? 'text-mute' : 'text-stone'
                  }`}
                >
                  {f.label}
                </span>
                {active && (
                  <span className="h-1.5 w-1.5 flex-none rounded-full bg-primary animate-pulse" />
                )}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={logout}
          className="mt-5 w-full rounded-full border border-hairline px-4 py-2.5 text-center font-mono text-[11px] uppercase tracking-wider text-ash transition-colors hover:border-hairline-strong hover:bg-surface-bone hover:text-ink"
        >
          Keluar
        </button>
      </div>
    </aside>
  );
}
