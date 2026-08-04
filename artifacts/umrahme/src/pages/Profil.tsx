import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PhaseIndicator from '../components/PhaseIndicator';
import { IconCheck, IconSertifikat, IconChevron, IconJurnal } from '../components/icons';

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
    <div className="mx-auto max-w-5xl px-5 pb-8 pt-8 lg:px-10 lg:pb-12 lg:pt-10">
      <header className="mb-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">Akun Jamaah</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-[-1px] text-ink lg:text-4xl">Profil</h1>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
        <section className="rounded-xl p-5 text-white lg:p-6" style={{ background: 'var(--color-primary-deep)' }}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3.5">
              <div className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-white/15 text-lg font-extrabold text-white ring-1 ring-white/20">
                {inisial}
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-[20px] font-extrabold leading-tight">{jamaah.nama}</h2>
                <p className="mt-1 text-[11px] font-medium tracking-[0.12em] text-white/65">{jamaah.nomorJamaah}</p>
              </div>
            </div>
            <span className="flex-none rounded-full bg-white/15 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white">
              Aktif
            </span>
          </div>
          <div className="mt-6 border-t border-white/20 pt-3">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/55">Travel Anda</p>
            <p className="mt-1 text-[14px] font-semibold text-white">{tenant?.nama_travel ?? jamaah.travel}</p>
          </div>
        </section>

        <section className="border border-hairline bg-surface-card px-5 py-5 lg:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-mute">Perjalanan Anda</p>
              <p className="mt-1 text-[16px] font-bold text-ink">{faseLabel}</p>
            </div>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary">Fase aktif</span>
          </div>
          <div className="mt-5">
            <PhaseIndicator fase={jamaah.fase} />
          </div>
          <p className="mt-4 border-t border-hairline pt-3 text-[12px] leading-relaxed text-charcoal">
            Status perjalanan diperbarui mengikuti jadwal dari travel.
          </p>
        </section>
      </div>

      <section className="mt-7">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-mute">Ruang Pribadi</p>
            <h2 className="mt-1 text-[18px] font-bold text-ink">Perjalanan Anda</h2>
          </div>
        </div>
        <div className="grid border-y border-hairline sm:grid-cols-3 sm:divide-x sm:divide-hairline">
          {menuItems.map(({ to, Icon, label, desc }, index) => (
            <Link
              key={to}
              to={to}
              className={`group flex min-h-[112px] items-start gap-3 border-b border-hairline py-4 transition-colors hover:bg-surface-bone/60 sm:border-b-0 sm:px-4 sm:first:pl-0 sm:last:pr-0 ${index === 2 ? 'border-b-0' : ''}`}
            >
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-bold text-ink">{label}</span>
                <span className="mt-1 block text-[12px] leading-relaxed text-charcoal">{desc}</span>
              </span>
              <IconChevron className="mt-1 h-4 w-4 flex-none text-ash transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </section>

      <button
        type="button"
        onClick={() => { logout(); navigate('/login', { replace: true }); }}
        className="mt-8 min-h-[44px] text-[13px] font-semibold text-mute transition-colors hover:text-ink"
      >
        Keluar dari akun
      </button>
    </div>
  );
}
