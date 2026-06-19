import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PhaseIndicator from '../components/PhaseIndicator';
import { urutanFase } from '../data/jamaah';
import {
  IconDoa,
  IconPanduan,
  IconIbadah,
  IconPeta,
  IconCheck,
  IconSertifikat,
  IconChevron,
} from '../components/icons';

// -----------------------------------------------------------------------
// Ikon Sa'i inline (panah bolak-balik)
// -----------------------------------------------------------------------
function IconSai({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M7 16l-4-4 4-4" />
      <path d="M3 12h18" />
      <path d="M17 8l4 4-4 4" />
    </svg>
  );
}

// -----------------------------------------------------------------------
// Mini ring SVG — preview 0/7 progress di kartu counter desktop
// -----------------------------------------------------------------------
function MiniRing({ variant = 'tawaf' }: { variant?: 'tawaf' | 'sai' }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" className="flex-none opacity-60" aria-hidden>
      <circle cx="26" cy="26" r={r} fill="none" stroke="#261019" strokeWidth="5" />
      <circle
        cx="26" cy="26" r={r} fill="none"
        stroke={variant === 'tawaf' ? '#C2185B' : '#D4A24E'}
        strokeWidth="5"
        strokeDasharray={`0 ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 26 26)"
      />
      <text x="26" y="26" textAnchor="middle" dy="0.35em" fill="#F5EDE4" fontSize="9" fontFamily="IBM Plex Mono" opacity="0.7">
        0/7
      </text>
    </svg>
  );
}

// -----------------------------------------------------------------------
// BentoMihrabCard — versi gradient dari MihrabCard untuk bento desktop
// -----------------------------------------------------------------------
function BentoMihrabCard({
  children,
  className = '',
  bodyClassName = 'px-5 pb-5',
  glow = false,
}: {
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  glow?: boolean;
}) {
  const bodyBg = glow
    ? 'radial-gradient(ellipse at 80% 0%, rgba(194,24,91,0.09) 0%, transparent 55%), linear-gradient(160deg, #18090F 0%, #0D0509 100%)'
    : 'linear-gradient(160deg, #18090F 0%, #0D0509 100%)';

  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 100 22" preserveAspectRatio="none" className="block w-full h-[26px]" aria-hidden>
        <path
          d="M0,22 L0,13 C0,5 24,0.6 50,0.6 C76,0.6 100,5 100,13 L100,22"
          fill="#18090F"
          stroke="#D4A24E"
          strokeWidth="1"
          strokeOpacity="0.65"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className={`-mt-px rounded-b-2xl ${bodyClassName}`} style={{ background: bodyBg }}>
        {children}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------
// Kartu medium (1 kolom) — Kumpulan Doa, Tata Cara, Panduan Ihram
// -----------------------------------------------------------------------
function BentoMediumCard({
  to,
  label,
  desc,
  icon,
}: {
  to: string;
  label: string;
  desc: string;
  icon: ReactNode;
}) {
  return (
    <Link to={to} className="group block">
      <BentoMihrabCard bodyClassName="px-4 pb-5 flex flex-col gap-3 h-full">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-ink-800/80"
          style={{ background: 'linear-gradient(135deg, #261019 0%, #18090F 100%)' }}
        >
          <span className="text-rose-400">{icon}</span>
        </div>
        <div className="flex-1">
          <p className="text-[14px] font-semibold leading-snug text-parchment-100 group-hover:text-parchment-100 transition-colors">
            {label}
          </p>
          <p className="mt-0.5 text-[12px] leading-relaxed text-mute-500">{desc}</p>
        </div>
        <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-rose-400/70 group-hover:text-rose-400 group-hover:gap-1.5 transition-all">
          Buka <IconChevron className="h-3 w-3" />
        </span>
      </BentoMihrabCard>
    </Link>
  );
}

// -----------------------------------------------------------------------
// Kartu kecil (1 kolom) — Peta, Persiapan
// -----------------------------------------------------------------------
function BentoSmallCard({
  to,
  label,
  icon,
}: {
  to: string;
  label: string;
  icon: ReactNode;
}) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3 rounded-2xl border border-ink-800/60 px-4 py-4 transition-colors hover:border-ink-700"
      style={{ background: 'linear-gradient(135deg, #18090F 0%, #0D0509 100%)' }}
    >
      <span className="flex-none text-mute-500 group-hover:text-rose-400 transition-colors">{icon}</span>
      <span className="flex-1 text-[13px] font-medium text-parchment-100">{label}</span>
      <IconChevron className="h-3.5 w-3.5 flex-none text-mute-500 group-hover:text-parchment-100/50 transition-colors" />
    </Link>
  );
}

// -----------------------------------------------------------------------
// Beranda
// -----------------------------------------------------------------------
export default function Beranda() {
  const { jamaah } = useAuth();
  if (!jamaah) return null;

  const idxFase = urutanFase.findIndex((f) => f.id === jamaah.fase);
  const faseAktif = urutanFase[idxFase];

  // CTA hero berdasarkan fase
  const heroCta =
    jamaah.fase === 'tanah-suci'
      ? { label: 'Mulai Counter Tawaf', to: '/ibadah/tawaf' }
      : jamaah.fase === 'selesai'
        ? { label: 'Lihat Sertifikat', to: '/profil/sertifikat' }
        : { label: 'Buka Checklist Persiapan', to: '/profil/persiapan' };

  const faseDesc: Record<string, string> = {
    persiapan: 'Lengkapi dokumen, vaksin, dan perlengkapan sebelum keberangkatan.',
    perjalanan: 'Perjalanan menuju Tanah Suci sedang berlangsung. Tetap tenang dan berdoa.',
    'tanah-suci': 'Anda sedang berada di Tanah Suci. Gunakan counter & panduan doa.',
    kepulangan: 'Ibadah telah dilaksanakan. Jaga amal dan kenangan perjalanan ini.',
    selesai: 'Rangkaian umrah telah selesai, insya Allah mabrur.',
  };

  return (
    <>
      {/* ==================== MOBILE (< lg) — TIDAK DIUBAH ==================== */}
      <div className="lg:hidden">
        <header
          className="px-5 pb-2 pt-8"
          style={{ paddingTop: 'max(2rem, env(safe-area-inset-top))' }}
        >
          <p className="font-arab text-xl text-gold-400" dir="rtl">
            السَّلَامُ عَلَيْكُمْ
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold leading-tight text-parchment-100">
            {jamaah.nama.split(' ')[0]}
          </h1>
          <p className="mt-1 text-sm text-mute-500">
            Disediakan oleh <span className="text-parchment-100">{jamaah.travel}</span>
          </p>
        </header>

        <div className="mx-5 mt-3 rounded-xl border border-ink-800/70 bg-ink-900/50 px-4 py-3">
          <PhaseIndicator fase={jamaah.fase} />
        </div>

        <section className="mt-6 px-5">
          <MobileFeaturedCard fase={jamaah.fase} />
        </section>

        <section className="mt-7 px-5">
          <h3 className="mb-3 font-mono text-[11px] uppercase tracking-widest text-mute-500">
            Akses Cepat
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {mobileQuickAccess.map(({ to, label, Icon }) => (
              <Link
                key={to + label}
                to={to}
                className="flex min-h-[92px] flex-col items-center justify-center gap-2 rounded-2xl border border-ink-800/70 bg-ink-900/60 px-2 py-3 text-center active:scale-[0.97]"
              >
                <Icon className="h-6 w-6 text-rose-400" />
                <span className="text-[12px] font-medium leading-tight text-parchment-100">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-4 px-5">
          <Link
            to="/profil/sertifikat"
            className="flex items-center gap-3 rounded-2xl border border-ink-800/70 bg-ink-900/40 px-4 py-3.5 active:scale-[0.99]"
          >
            <IconSertifikat className="h-5 w-5 flex-none text-gold-400" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-parchment-100">Sertifikat Digital</p>
              <p className="truncate text-xs text-mute-500">Terbit setelah ibadah selesai</p>
            </div>
            <IconChevron className="h-4 w-4 flex-none text-mute-500" />
          </Link>
        </section>
      </div>

      {/* ==================== DESKTOP (≥ lg) — BENTO GRID ==================== */}
      <div className="hidden lg:block px-8 py-8 max-w-6xl mx-auto">

        {/* Header */}
        <header className="mb-5">
          <p className="font-arab text-2xl text-gold-400" dir="rtl">السَّلَامُ عَلَيْكُمْ</p>
          <h1 className="mt-1 font-display text-4xl font-semibold leading-tight text-parchment-100">
            {jamaah.nama.split(' ')[0]}
          </h1>
          <p className="mt-1.5 text-sm text-mute-500">
            Selamat datang di Umrahme ·{' '}
            <span className="text-parchment-100">{jamaah.travel}</span>
          </p>
        </header>

        {/* Stats strip */}
        <div
          className="mb-6 grid grid-cols-4 divide-x divide-ink-800/50 overflow-hidden rounded-2xl border border-ink-800/60"
          style={{ background: 'linear-gradient(135deg, #1A0A10 0%, #0D0509 100%)' }}
        >
          {[
            { label: 'Fase Aktif', value: faseAktif?.label ?? '—', accent: false },
            { label: 'Tawaf', value: '7 Putaran', accent: false },
            { label: "Sa'i", value: '7 Lintasan', accent: false },
            { label: 'Mode Ibadah', value: 'Mode B', accent: true },
          ].map(({ label, value, accent }) => (
            <div key={label} className="px-5 py-3.5">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-mute-500">{label}</p>
              <p className={`mt-0.5 text-[13px] font-semibold ${accent ? 'text-rose-400' : 'text-parchment-100'}`}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* BENTO GRID — 4 kolom */}
        <div className="grid grid-cols-4 gap-4">

          {/* ── HERO: Fase Perjalanan (col-span-2, row-span-2) ── */}
          <div className="col-span-2 row-span-2">
            <BentoMihrabCard
              glow
              className="h-full"
              bodyClassName="px-6 pb-6 flex flex-col h-[calc(100%-26px)]"
            >
              {/* Pola geometris islami — sangat halus */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.035]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36'%3E%3Cpath d='M18 0L36 18L18 36L0 18Z' fill='none' stroke='%23D4A24E' stroke-width='0.6'/%3E%3Cpath d='M18 6L30 18L18 30L6 18Z' fill='none' stroke='%23D4A24E' stroke-width='0.4'/%3E%3C/svg%3E")`,
                  backgroundSize: '36px 36px',
                }}
                aria-hidden
              />

              <div className="relative flex flex-1 flex-col">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-rose-400/80">
                  Fase Perjalanan
                </p>
                <h2 className="mt-1.5 font-display text-[28px] font-semibold leading-tight text-parchment-100">
                  {faseAktif?.label ?? 'Persiapan'}
                </h2>
                <p className="mt-2 text-[13px] leading-relaxed text-mute-500">
                  {faseDesc[jamaah.fase] ?? 'Ikuti panduan dan doa yang telah disiapkan untuk perjalanan Anda.'}
                </p>

                <div className="mt-6 flex-1">
                  <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.2em] text-mute-500">
                    Progres Perjalanan
                  </p>
                  <PhaseIndicator fase={jamaah.fase} />
                </div>

                <Link
                  to={heroCta.to}
                  className="mt-8 inline-flex items-center gap-1.5 font-medium text-sm text-rose-400 hover:gap-2.5 transition-all"
                >
                  {heroCta.label} <IconChevron className="h-4 w-4" />
                </Link>
              </div>
            </BentoMihrabCard>
          </div>

          {/* ── COUNTER TAWAF (col-span-2) ── */}
          <div className="col-span-2">
            <Link to="/ibadah/tawaf" className="group block">
              <BentoMihrabCard glow bodyClassName="px-5 pb-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-mute-500">
                      Mode B · Counter
                    </p>
                    <h3 className="mt-1 font-display text-[20px] font-semibold text-parchment-100">
                      Counter Tawaf
                    </h3>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-mute-500">
                      Hitung 7 putaran mengelilingi Ka'bah. Doa muncul otomatis tiap putaran.
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-rose-400/70 group-hover:text-rose-400 group-hover:gap-2 transition-all">
                      Mulai Tawaf <IconChevron className="h-3 w-3" />
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1 flex-none">
                    <MiniRing variant="tawaf" />
                    <span className="font-mono text-[9px] uppercase tracking-wider text-mute-500/60">Progress</span>
                  </div>
                </div>
              </BentoMihrabCard>
            </Link>
          </div>

          {/* ── COUNTER SA'I (col-span-2) ── */}
          <div className="col-span-2">
            <Link to="/ibadah/sai" className="group block">
              <BentoMihrabCard bodyClassName="px-5 pb-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-mute-500">
                      Mode B · Counter
                    </p>
                    <h3 className="mt-1 font-display text-[20px] font-semibold text-parchment-100">
                      Counter Sa'i
                    </h3>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-mute-500">
                      Hitung 7 lintasan Shafa–Marwah. Arah & doa per lintasan tampil otomatis.
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-rose-400/70 group-hover:text-rose-400 group-hover:gap-2 transition-all">
                      Mulai Sa'i <IconChevron className="h-3 w-3" />
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1 flex-none">
                    <MiniRing variant="sai" />
                    <span className="font-mono text-[9px] uppercase tracking-wider text-mute-500/60">Progress</span>
                  </div>
                </div>
              </BentoMihrabCard>
            </Link>
          </div>

          {/* ── ROW 3: Kartu medium (1 kolom masing-masing) ── */}
          <BentoMediumCard
            to="/doa"
            label="Kumpulan Doa"
            desc="Talbiyah, tawaf, sa'i & lebih"
            icon={<IconDoa className="h-5 w-5" />}
          />
          <BentoMediumCard
            to="/panduan/tata-cara"
            label="Tata Cara"
            desc="Urutan 6 langkah umrah berurutan"
            icon={<IconPanduan className="h-5 w-5" />}
          />
          <BentoMediumCard
            to="/panduan/ihram"
            label="Panduan Ihram"
            desc="Niat, larangan & cara memakai kain"
            icon={<IconPanduan className="h-5 w-5" />}
          />

          {/* ── Peta (kecil, 1 kolom) ── */}
          <BentoSmallCard
            to="/peta"
            label="Peta Lokasi"
            icon={<IconPeta className="h-5 w-5" />}
          />

          {/* ── ROW 4: Persiapan (kecil) + Sertifikat (besar) ── */}
          <BentoSmallCard
            to="/profil/persiapan"
            label="Persiapan"
            icon={<IconCheck className="h-5 w-5" />}
          />

          <div className="col-span-3">
            <Link
              to="/profil/sertifikat"
              className="group flex items-center gap-4 overflow-hidden rounded-2xl border border-ink-800/60 px-6 py-4 transition-colors hover:border-gold-400/30"
              style={{ background: 'linear-gradient(135deg, #18090F 0%, #0D0509 100%)' }}
            >
              {/* Glow gold halus di sudut kiri */}
              <div
                className="pointer-events-none absolute left-0 top-0 h-full w-32 opacity-[0.04]"
                style={{ background: 'radial-gradient(ellipse at 0% 50%, #D4A24E 0%, transparent 70%)' }}
                aria-hidden
              />
              <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl border border-gold-400/20 bg-gold-400/5">
                <IconSertifikat className="h-5 w-5 text-gold-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold text-parchment-100">Sertifikat Digital</p>
                <p className="text-[12px] text-mute-500">Terbit setelah rangkaian ibadah selesai · Kenang-kenangan digital perjalanan suci</p>
              </div>
              <IconChevron className="h-4 w-4 flex-none text-mute-500 group-hover:text-parchment-100/50 transition-colors" />
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}

// -----------------------------------------------------------------------
// Mobile-only components (tidak berubah dari sebelumnya)
// -----------------------------------------------------------------------
const mobileQuickAccess = [
  { to: '/doa', label: 'Kumpulan Doa', Icon: IconDoa },
  { to: '/panduan/tata-cara', label: 'Tata Cara', Icon: IconPanduan },
  { to: '/panduan/ihram', label: 'Panduan Ihram', Icon: IconPanduan },
  { to: '/ibadah/tawaf', label: 'Counter Tawaf', Icon: IconIbadah },
  { to: '/peta', label: 'Peta Lokasi', Icon: IconPeta },
  { to: '/profil/persiapan', label: 'Persiapan', Icon: IconCheck },
];

function MobileFeaturedCard({ fase }: { fase: string }) {
  if (fase === 'selesai') {
    return (
      <Link to="/profil/sertifikat" className="block active:scale-[0.99]">
        <div className="relative">
          <svg viewBox="0 0 100 22" preserveAspectRatio="none" className="block w-full h-[26px]" aria-hidden>
            <path d="M0,22 L0,13 C0,5 24,0.6 50,0.6 C76,0.6 100,5 100,13 L100,22" fill="#18090F" stroke="#D4A24E" strokeWidth="1" strokeOpacity="0.8" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="-mt-px rounded-b-2xl bg-ink-900 px-5 pb-5 pt-2">
            <p className="font-mono text-[11px] uppercase tracking-widest text-gold-400">Mabrur, insya Allah</p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-parchment-100">Lihat Sertifikat Umrah Anda</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-mute-500">Rangkaian ibadah telah selesai. Buka kenang-kenangan digital Anda.</p>
            <span className="mt-4 inline-flex items-center gap-1 font-medium text-rose-400">Buka Sertifikat <IconChevron className="h-4 w-4" /></span>
          </div>
        </div>
      </Link>
    );
  }
  if (fase === 'tanah-suci') {
    return (
      <Link to="/ibadah/tawaf" className="block active:scale-[0.99]">
        <div className="relative">
          <svg viewBox="0 0 100 22" preserveAspectRatio="none" className="block w-full h-[26px]" aria-hidden>
            <path d="M0,22 L0,13 C0,5 24,0.6 50,0.6 C76,0.6 100,5 100,13 L100,22" fill="#261019" stroke="#D4A24E" strokeWidth="1" strokeOpacity="0.8" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="-mt-px rounded-b-2xl px-5 pb-5 pt-2" style={{ backgroundColor: '#261019' }}>
            <p className="font-mono text-[11px] uppercase tracking-widest text-rose-400">Sedang di Tanah Suci</p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-parchment-100">Mulai Hitung Tawaf</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-mute-500">Tombol besar, satu tap tiap putaran. Doa muncul otomatis.</p>
            <span className="mt-4 inline-flex items-center gap-1 font-medium text-rose-400">Buka Counter Tawaf <IconChevron className="h-4 w-4" /></span>
          </div>
        </div>
      </Link>
    );
  }
  return (
    <Link to="/profil/persiapan" className="block active:scale-[0.99]">
      <div className="relative">
        <svg viewBox="0 0 100 22" preserveAspectRatio="none" className="block w-full h-[26px]" aria-hidden>
          <path d="M0,22 L0,13 C0,5 24,0.6 50,0.6 C76,0.6 100,5 100,13 L100,22" fill="#18090F" stroke="#D4A24E" strokeWidth="1" strokeOpacity="0.8" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="-mt-px rounded-b-2xl bg-ink-900 px-5 pb-5 pt-2">
          <p className="font-mono text-[11px] uppercase tracking-widest text-rose-400">Fase Persiapan</p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-parchment-100">Siapkan Perjalanan Anda</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-mute-500">Mulai dari dokumen perjalanan, kesehatan, hingga niat. Centang satu per satu dengan tenang.</p>
          <span className="mt-4 inline-flex items-center gap-1 font-medium text-rose-400">Buka Checklist <IconChevron className="h-4 w-4" /></span>
        </div>
      </div>
    </Link>
  );
}
