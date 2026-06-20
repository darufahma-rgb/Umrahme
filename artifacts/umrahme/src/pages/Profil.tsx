import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Fase } from '../types';
import { urutanFase } from '../data/jamaah';
import PhaseIndicator from '../components/PhaseIndicator';
import { IconCheck, IconSertifikat, IconChevron } from '../components/icons';

function IconJurnal({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <line x1="9" y1="9" x2="15" y2="9" />
      <line x1="9" y1="13" x2="13" y2="13" />
    </svg>
  );
}

export default function Profil() {
  const { jamaah, logout, setFase } = useAuth();
  const navigate = useNavigate();
  if (!jamaah) return null;

  const inisial = jamaah.nama
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <div>
      <header
        className="px-5 pb-1 pt-8"
        style={{ paddingTop: 'max(2rem, env(safe-area-inset-top))' }}
      >
        <h1 className="font-display text-3xl font-bold leading-tight text-ink">Profil</h1>
      </header>

      <section className="mt-4 px-5">
        <div className="rounded-md border border-hairline bg-surface-card px-5 py-5 shadow-drop-card">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 flex-none items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-display text-xl font-bold text-primary">
              {inisial}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-xl font-bold text-ink">
                {jamaah.nama}
              </p>
              <p className="font-mono text-xs text-gold">{jamaah.nomorJamaah}</p>
            </div>
          </div>
          <div className="mt-4 border-t border-hairline pt-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-mute">Travel</p>
            <p className="mt-0.5 text-sm text-body">{jamaah.travel}</p>
          </div>
        </div>
      </section>

      <section className="mt-4 px-5">
        <div className="rounded-md border border-hairline bg-surface-card px-5 py-4 shadow-drop-card">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-mute">
            Fase Perjalanan
          </p>
          <PhaseIndicator fase={jamaah.fase} />
          <div className="mt-4 flex gap-1.5 rounded-full border border-hairline bg-surface-bone p-1">
            {urutanFase.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFase(f.id as Fase)}
                className={`min-h-[36px] flex-1 rounded-full px-1 text-[12px] font-medium transition ${
                  jamaah.fase === f.id
                    ? 'bg-primary text-on-primary'
                    : 'text-mute hover:text-body active:bg-surface-card'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-mute">
            Ganti fase manual untuk demo. Pada versi final, fase berubah otomatis mengikuti
            jadwal & progres ibadah.
          </p>
        </div>
      </section>

      <section className="mt-4 px-5">
        <div className="space-y-2">
          {[
            {
              to: '/profil/persiapan',
              icon: <IconCheck className="h-5 w-5 flex-none text-primary" />,
              label: 'Persiapan',
              desc: 'Checklist sebelum berangkat',
            },
            {
              to: '/profil/jurnal',
              icon: <IconJurnal className="h-5 w-5 flex-none text-primary" />,
              label: 'Jurnal & Kenangan',
              desc: 'Catatan harian & galeri foto perjalanan',
            },
            {
              to: '/profil/sertifikat',
              icon: <IconSertifikat className="h-5 w-5 flex-none text-gold" />,
              label: 'Sertifikat Digital',
              desc: 'Kenang-kenangan umrah',
            },
          ].map(({ to, icon, label, desc }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 rounded-md border border-hairline bg-surface-card px-4 py-4 active:scale-[0.99] transition-shadow hover:shadow-drop-soft"
            >
              {icon}
              <div className="flex-1">
                <p className="text-[15px] font-medium text-ink">{label}</p>
                <p className="text-xs text-charcoal">{desc}</p>
              </div>
              <IconChevron className="h-4 w-4 flex-none text-ash" />
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6 px-5 pb-6">
        <button
          type="button"
          onClick={() => {
            logout();
            navigate('/login', { replace: true });
          }}
          className="min-h-[44px] w-full rounded-full border border-hairline-strong text-sm font-medium text-mute active:scale-[0.99] transition-colors hover:bg-surface-bone hover:text-ink"
        >
          Keluar
        </button>
      </section>
    </div>
  );
}
