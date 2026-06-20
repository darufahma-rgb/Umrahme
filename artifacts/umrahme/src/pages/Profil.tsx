import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Fase } from '../types';
import { urutanFase } from '../data/jamaah';
import PhaseIndicator from '../components/PhaseIndicator';
import { IconCheck, IconSertifikat, IconChevron } from '../components/icons';

function IconJurnal({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
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
        <h1 className="font-display text-3xl font-semibold text-parchment-100">Profil</h1>
      </header>

      {/* Kartu jamaah */}
      <section className="mt-4 px-5">
        <div className="rounded-2xl border border-ink-800/70 bg-ink-900/50 px-5 py-5">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 flex-none items-center justify-center rounded-full border border-rose-400/40 bg-ink-950 font-display text-xl font-semibold text-rose-400">
              {inisial}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-xl font-semibold text-parchment-100">
                {jamaah.nama}
              </p>
              <p className="font-mono text-xs text-gold-400/90">{jamaah.nomorJamaah}</p>
            </div>
          </div>
          <div className="mt-4 border-t border-ink-800 pt-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-mute-500">Travel</p>
            <p className="mt-0.5 text-sm text-parchment-100">{jamaah.travel}</p>
          </div>
        </div>
      </section>

      {/* Fase + ganti fase (dummy) */}
      <section className="mt-4 px-5">
        <div className="rounded-2xl border border-ink-800/70 bg-ink-900/50 px-5 py-4">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-mute-500">
            Fase Perjalanan
          </p>
          <PhaseIndicator fase={jamaah.fase} />
          <div className="mt-4 flex gap-1.5 rounded-xl border border-ink-800 bg-ink-950 p-1">
            {urutanFase.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFase(f.id as Fase)}
                className={`min-h-[38px] flex-1 rounded-lg px-1 text-[12px] font-medium transition ${
                  jamaah.fase === f.id
                    ? 'bg-rose-600 text-parchment-100'
                    : 'text-mute-500 active:bg-ink-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-mute-500">
            Ganti fase manual untuk demo. Pada versi final, fase berubah otomatis mengikuti
            jadwal & progres ibadah.
          </p>
        </div>
      </section>

      {/* Menu */}
      <section className="mt-4 px-5">
        <div className="space-y-3">
          <Link
            to="/profil/persiapan"
            className="flex items-center gap-3 rounded-2xl border border-ink-800/70 bg-ink-900/50 px-4 py-4 active:scale-[0.99]"
          >
            <IconCheck className="h-5 w-5 flex-none text-rose-400" />
            <div className="flex-1">
              <p className="text-[15px] font-medium text-parchment-100">Persiapan</p>
              <p className="text-xs text-mute-500">Checklist sebelum berangkat</p>
            </div>
            <IconChevron className="h-4 w-4 flex-none text-mute-500" />
          </Link>
          <Link
            to="/profil/jurnal"
            className="flex items-center gap-3 rounded-2xl border border-ink-800/70 bg-ink-900/50 px-4 py-4 active:scale-[0.99]"
          >
            <IconJurnal className="h-5 w-5 flex-none text-rose-400" />
            <div className="flex-1">
              <p className="text-[15px] font-medium text-parchment-100">Jurnal & Kenangan</p>
              <p className="text-xs text-mute-500">Catatan harian & galeri foto perjalanan</p>
            </div>
            <IconChevron className="h-4 w-4 flex-none text-mute-500" />
          </Link>
          <Link
            to="/profil/sertifikat"
            className="flex items-center gap-3 rounded-2xl border border-ink-800/70 bg-ink-900/50 px-4 py-4 active:scale-[0.99]"
          >
            <IconSertifikat className="h-5 w-5 flex-none text-gold-400" />
            <div className="flex-1">
              <p className="text-[15px] font-medium text-parchment-100">Sertifikat Digital</p>
              <p className="text-xs text-mute-500">Kenang-kenangan umrah</p>
            </div>
            <IconChevron className="h-4 w-4 flex-none text-mute-500" />
          </Link>
        </div>
      </section>

      {/* Keluar */}
      <section className="mt-6 px-5">
        <button
          type="button"
          onClick={() => {
            logout();
            navigate('/login', { replace: true });
          }}
          className="min-h-[48px] w-full rounded-xl border border-ink-800 text-sm font-medium text-mute-500 active:scale-[0.99]"
        >
          Keluar
        </button>
      </section>
    </div>
  );
}
