import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PhaseIndicator from '../components/PhaseIndicator';
import { IconCheck, IconSertifikat, IconChevron, IconJurnal } from '../components/icons';

const menuAccentMap: Record<number, { tile: string; icon: string }> = {
  0: { tile: 'bg-gradient-to-br from-primary/15 to-primary/5', icon: 'text-primary' },
  1: { tile: 'bg-gradient-to-br from-sky-500/15 to-sky-500/5', icon: 'text-sky-600' },
  2: { tile: 'bg-gradient-to-br from-gold/20 to-gold/5', icon: 'text-gold' },
};

export default function Profil() {
  const { jamaah, tenant, logout } = useAuth();
  const navigate = useNavigate();
  if (!jamaah) return null;

  const inisial = jamaah.nama
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  const menuItems = [
    {
      to: '/profil/persiapan',
      Icon: IconCheck,
      label: 'Persiapan',
      desc: 'Checklist sebelum berangkat',
    },
    {
      to: '/profil/jurnal',
      Icon: IconJurnal,
      label: 'Jurnal & Kenangan',
      desc: 'Catatan harian & galeri foto perjalanan',
    },
    {
      to: '/profil/sertifikat',
      Icon: IconSertifikat,
      label: 'Sertifikat Digital',
      desc: 'Kenang-kenangan umrah',
    },
  ];

  const faseLabel =
    jamaah.fase === 'persiapan'
      ? 'Persiapan Keberangkatan'
      : jamaah.fase === 'tanah-suci'
        ? 'Di Tanah Suci'
        : 'Ibadah Selesai';

  return (
    <div>
      <header
        className="px-5 pb-1 pt-8 lg:px-10 lg:pt-10"
        style={{ paddingTop: 'max(2rem, env(safe-area-inset-top))' }}
      >
        <h1 className="font-display text-3xl font-bold leading-tight text-ink lg:text-4xl">Profil</h1>
      </header>

      {/* Mobile layout */}
      <div className="lg:hidden">
        {/* Kartu identitas */}
        <section className="mt-4 px-5">
          <div className="relative overflow-hidden rounded-2xl border border-hairline bg-surface-card p-5 shadow-drop-soft">
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-primary/15 to-transparent blur-2xl" aria-hidden />
            <div className="relative flex items-center gap-4">
              <div className="flex h-16 w-16 flex-none items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-deep font-display text-xl font-bold text-white shadow-md">
                {inisial}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="truncate font-display text-xl font-bold leading-tight text-ink">{jamaah.nama}</h2>
                <p className="mt-0.5 font-mono text-[13px] tracking-wider text-gold">{jamaah.nomorJamaah}</p>
              </div>
            </div>
            <div className="relative mt-4 border-t border-hairline pt-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-mute">Travel</p>
              <p className="mt-0.5 text-[15px] font-semibold text-ink">{tenant?.nama_travel ?? jamaah.travel}</p>
            </div>
          </div>
        </section>

        {/* Fase perjalanan */}
        <section className="mt-4 px-5">
          <div className="rounded-2xl border border-hairline bg-surface-card px-5 py-4 shadow-drop-soft">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-mute">Fase Perjalanan</p>
            <PhaseIndicator fase={jamaah.fase} />
            <div className="mt-4 rounded-xl border border-hairline bg-gradient-to-br from-surface-bone to-surface-card px-3.5 py-3 text-center">
              <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-mute mb-1">Fase Aktif</p>
              <p className="text-[13px] font-semibold text-ink">{faseLabel}</p>
              <p className="text-[10px] text-mute mt-0.5">Diperbarui otomatis sesuai jadwal travel</p>
            </div>
          </div>
        </section>

        {/* Menu */}
        <section className="mt-4 px-5">
          <div className="space-y-2.5">
            {menuItems.map(({ to, Icon, label, desc }, i) => {
              const a = menuAccentMap[i] ?? menuAccentMap[0];
              return (
                <Link
                  key={to}
                  to={to}
                  className="group flex items-center gap-4 rounded-2xl border border-hairline bg-surface-card p-4 shadow-drop-soft transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99]"
                >
                  <div className={`flex h-12 w-12 flex-none items-center justify-center rounded-xl ${a.tile}`}>
                    <Icon className={`h-5 w-5 ${a.icon}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[15px] font-semibold text-ink">{label}</p>
                    <p className="text-xs text-charcoal">{desc}</p>
                  </div>
                  <IconChevron className="h-4 w-4 flex-none text-ash transition-transform group-hover:translate-x-0.5" />
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-6 px-5 pb-6">
          <button
            type="button"
            onClick={() => { logout(); navigate('/login', { replace: true }); }}
            className="min-h-[44px] w-full rounded-full border border-hairline-strong text-sm font-medium text-mute active:scale-[0.99] transition-colors hover:bg-surface-bone hover:text-ink"
          >
            Keluar
          </button>
        </section>
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6 lg:px-10 lg:py-6 lg:pb-10">
        {/* Left column */}
        <div className="space-y-4">
          {/* Kartu identitas */}
          <div className="relative overflow-hidden rounded-2xl border border-hairline bg-surface-card px-6 py-6 shadow-drop-soft">
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-primary/15 to-transparent blur-2xl" aria-hidden />
            <div className="relative flex items-center gap-5">
              <div className="flex h-16 w-16 flex-none items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-deep font-display text-2xl font-bold text-white shadow-md">
                {inisial}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="truncate font-display text-2xl font-bold leading-tight text-ink">{jamaah.nama}</h2>
                <p className="mt-0.5 font-mono text-[13px] tracking-wider text-gold">{jamaah.nomorJamaah}</p>
              </div>
            </div>
            <div className="relative mt-4 border-t border-hairline pt-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-mute">Travel</p>
              <p className="mt-0.5 text-[15px] font-semibold text-ink">{tenant?.nama_travel ?? jamaah.travel}</p>
            </div>
          </div>

          {/* Menu */}
          <div className="space-y-2.5">
            {menuItems.map(({ to, Icon, label, desc }, i) => {
              const a = menuAccentMap[i] ?? menuAccentMap[0];
              return (
                <Link
                  key={to}
                  to={to}
                  className="group flex items-center gap-4 rounded-2xl border border-hairline bg-surface-card px-5 py-4 shadow-drop-soft transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99]"
                >
                  <div className={`flex h-12 w-12 flex-none items-center justify-center rounded-xl ${a.tile}`}>
                    <Icon className={`h-5 w-5 ${a.icon}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[15px] font-semibold text-ink">{label}</p>
                    <p className="text-xs text-charcoal">{desc}</p>
                  </div>
                  <IconChevron className="h-4 w-4 flex-none text-ash transition-transform group-hover:translate-x-0.5" />
                </Link>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => { logout(); navigate('/login', { replace: true }); }}
            className="min-h-[44px] w-full rounded-full border border-hairline-strong text-sm font-medium text-mute transition-colors hover:bg-surface-bone hover:text-ink"
          >
            Keluar
          </button>
        </div>

        {/* Right column: fase */}
        <div className="rounded-2xl border border-hairline bg-surface-card px-6 py-6 shadow-drop-soft h-fit">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-mute">Fase Perjalanan</p>
          <PhaseIndicator fase={jamaah.fase} />
          <div className="mt-5 rounded-xl border border-hairline bg-gradient-to-br from-surface-bone to-surface-card px-3.5 py-3 text-center">
            <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-mute mb-1">Fase Aktif</p>
            <p className="text-[13px] font-semibold text-ink">{faseLabel}</p>
            <p className="text-[10px] text-mute mt-0.5">Diperbarui otomatis sesuai jadwal travel</p>
          </div>
        </div>
      </div>
    </div>
  );
}
