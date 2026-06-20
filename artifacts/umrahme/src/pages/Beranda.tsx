import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PhaseIndicator from '../components/PhaseIndicator';
import { urutanFase } from '../data/jamaah';
import { checklistItems } from '../data/checklist';
import {
  IconDoa,
  IconPanduan,
  IconIbadah,
  IconPeta,
  IconCheck,
  IconSertifikat,
  IconChevron,
} from '../components/icons';

function IconSai({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M7 16l-4-4 4-4" />
      <path d="M3 12h18" />
      <path d="M17 8l4 4-4 4" />
    </svg>
  );
}

function IconMoon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function MiniRing({ progress = 0 }: { progress?: number }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const dash = (progress / 7) * circ;
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" className="flex-none" aria-hidden>
      <circle cx="26" cy="26" r={r} fill="none" stroke="#f3f0e8" strokeWidth="5" />
      <circle
        cx="26" cy="26" r={r} fill="none"
        stroke="#ea2804"
        strokeWidth="5"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 26 26)"
      />
      <text x="26" y="26" textAnchor="middle" dy="0.35em" fill="#646464" fontSize="9" fontFamily="JetBrains Mono">
        0/7
      </text>
    </svg>
  );
}

function FeatureCard({
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
      <div className="h-full rounded-md border border-hairline bg-surface-card p-4 flex flex-col gap-3 transition-shadow hover:shadow-drop-soft">
        <div className="flex h-9 w-9 items-center justify-center rounded-md border border-hairline bg-surface-bone">
          <span className="text-primary">{icon}</span>
        </div>
        <div className="flex-1">
          <p className="text-[14px] font-semibold leading-snug text-ink">
            {label}
          </p>
          <p className="mt-0.5 text-[12px] leading-relaxed text-charcoal">{desc}</p>
        </div>
        <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-primary/70 group-hover:text-primary group-hover:gap-1.5 transition-all">
          Buka <IconChevron className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}

function SmallCard({
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
      className="group flex items-center gap-3 rounded-md border border-hairline bg-surface-card px-4 py-3.5 transition-shadow hover:shadow-drop-soft"
    >
      <span className="flex-none text-mute group-hover:text-primary transition-colors">{icon}</span>
      <span className="flex-1 text-[13px] font-medium text-ink">{label}</span>
      <IconChevron className="h-3.5 w-3.5 flex-none text-ash group-hover:text-charcoal transition-colors" />
    </Link>
  );
}

function MobileFaseCard({ fase, faseAktif, faseDesc, heroCta }: {
  fase: string;
  faseAktif?: string;
  faseDesc?: string;
  heroCta: { label: string; to: string };
}) {
  return (
    <div className="rounded-md border border-hairline bg-surface-card p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">
        Fase Perjalanan
      </p>
      <h2 className="mt-1.5 font-display text-[22px] font-bold leading-tight text-ink">
        {faseAktif ?? 'Persiapan'}
      </h2>
      <p className="mt-2 text-[13px] leading-relaxed text-charcoal">
        {faseDesc ?? 'Ikuti panduan dan doa yang telah disiapkan.'}
      </p>
      <Link
        to={heroCta.to}
        className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition active:scale-[0.99]"
      >
        {heroCta.label} <IconChevron className="h-4 w-4" />
      </Link>
    </div>
  );
}

export default function Beranda() {
  const { jamaah } = useAuth();

  const totalPersiapan = checklistItems.length;
  const [persiapanDone] = useState<number>(() => {
    try {
      const raw = localStorage.getItem('umrahme.persiapan');
      return raw ? (JSON.parse(raw) as string[]).length : 0;
    } catch {
      return 0;
    }
  });
  const persiapanPersen = totalPersiapan > 0 ? Math.round((persiapanDone / totalPersiapan) * 100) : 0;

  if (!jamaah) return null;

  const idxFase = urutanFase.findIndex((f) => f.id === jamaah.fase);
  const faseAktif = urutanFase[idxFase];

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

  const faseLabelMobile: Record<string, string> = {
    persiapan: 'Fase Persiapan',
    perjalanan: 'Dalam Perjalanan',
    'tanah-suci': 'Di Tanah Suci · Makkah',
    kepulangan: 'Dalam Kepulangan',
    selesai: 'Ibadah Selesai',
  };

  return (
    <>
      {/* ==================== MOBILE (< lg) ==================== */}
      <div className="lg:hidden">

        {/* HEADER */}
        <header
          className="px-5 pb-3 pt-8"
          style={{ paddingTop: 'max(2rem, env(safe-area-inset-top))' }}
        >
          <p className="font-arab text-xl text-gold" dir="rtl">
            السَّلَامُ عَلَيْكُمْ
          </p>
          <h1 className="mt-0.5 font-display text-3xl font-bold leading-tight text-ink">
            {jamaah.nama.split(' ')[0]}
          </h1>
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 flex-none rounded-full bg-primary" aria-hidden />
            <p className="text-[12px] text-mute">
              {faseLabelMobile[jamaah.fase] ?? jamaah.fase}
            </p>
          </div>
        </header>

        {/* AKSES CEPAT */}
        <div
          className="mt-2 flex gap-5 overflow-x-auto px-5 pb-3"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          role="navigation"
          aria-label="Akses cepat"
        >
          {[
            { to: '/doa', label: 'Doa', icon: <IconDoa className="h-6 w-6 text-primary" /> },
            { to: '/panduan/ihram', label: 'Ihram', icon: <IconPanduan className="h-6 w-6 text-primary" /> },
            { to: '/ibadah/tawaf', label: 'Tawaf', icon: <IconIbadah className="h-6 w-6 text-primary" /> },
            { to: '/ibadah/sai', label: "Sa'i", icon: <IconSai className="h-6 w-6 text-primary" /> },
            { to: '/peta', label: 'Peta', icon: <IconPeta className="h-6 w-6 text-primary" /> },
            { to: '/ibadah/jadwal-sholat', label: 'Sholat', icon: <IconMoon className="h-6 w-6 text-primary" /> },
          ].map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className="flex-none flex flex-col items-center gap-2 active:scale-95 transition-transform"
            >
              <div className="flex h-[64px] w-[64px] items-center justify-center rounded-full border border-hairline bg-surface-card shadow-drop-card">
                {icon}
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-mute">{label}</span>
            </Link>
          ))}
        </div>

        {/* KARTU FASE */}
        <section className="mt-4 px-5">
          <MobileFaseCard fase={jamaah.fase} faseAktif={faseAktif?.label} faseDesc={faseDesc[jamaah.fase]} heroCta={heroCta} />
        </section>

        {/* PROGRESS PERSIAPAN */}
        <section className="mt-3 px-5">
          <Link to="/profil/persiapan" className="block active:scale-[0.99] transition-transform">
            <div className="rounded-md border border-hairline bg-surface-card px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 flex-none items-center justify-center rounded-md border border-hairline bg-surface-bone">
                    <IconCheck className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-mute">Checklist Persiapan</p>
                    <p className="mt-0.5 text-[13px] font-semibold text-ink">
                      {persiapanDone} dari {totalPersiapan} item selesai
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <p className="font-display text-[22px] font-bold text-ink">{persiapanPersen}%</p>
                  <IconChevron className="h-4 w-4 flex-none text-ash" />
                </div>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-bone">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${persiapanPersen}%` }}
                />
              </div>
            </div>
          </Link>
        </section>

        {/* GRID FITUR */}
        <section className="mt-5 px-5 pb-6">
          <h3 className="mb-3 font-mono text-[11px] uppercase tracking-widest text-mute">
            Panduan &amp; Lainnya
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { to: '/panduan/tata-cara', label: 'Tata Cara', Icon: IconPanduan },
              { to: '/panduan/ihram', label: 'Panduan Ihram', Icon: IconPanduan },
              { to: '/peta', label: 'Peta Lokasi', Icon: IconPeta },
            ].map(({ to, label, Icon }) => (
              <Link
                key={to + label}
                to={to}
                className="flex min-h-[88px] flex-col items-center justify-center gap-2 rounded-md border border-hairline bg-surface-card px-2 py-3 text-center active:scale-[0.97] transition-transform"
              >
                <Icon className="h-5 w-5 text-primary" />
                <span className="text-[11px] font-medium leading-tight text-ink">{label}</span>
              </Link>
            ))}
          </div>

          <Link
            to="/profil/sertifikat"
            className="mt-3 flex items-center gap-3 rounded-md border border-hairline bg-surface-card px-4 py-3.5 active:scale-[0.99] transition-transform"
          >
            <IconSertifikat className="h-5 w-5 flex-none text-gold" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink">Sertifikat Digital</p>
              <p className="truncate text-xs text-charcoal">Terbit setelah ibadah selesai</p>
            </div>
            <IconChevron className="h-4 w-4 flex-none text-ash" />
          </Link>
        </section>
      </div>

      {/* ==================== DESKTOP (≥ lg) — BENTO GRID ==================== */}
      <div className="hidden lg:block px-8 py-8 max-w-content mx-auto">

        {/* Header */}
        <header className="mb-5">
          <p className="font-arab text-2xl text-gold" dir="rtl">السَّلَامُ عَلَيْكُمْ</p>
          <h1 className="mt-1 font-display text-4xl font-bold leading-[1.0] tracking-[-1px] text-ink">
            {jamaah.nama.split(' ')[0]}
          </h1>
          <p className="mt-1.5 text-sm text-charcoal">
            Selamat datang di Umrahme ·{' '}
            <span className="text-body">{jamaah.travel}</span>
          </p>
        </header>

        {/* Stats strip */}
        <div className="mb-6 grid grid-cols-4 divide-x divide-hairline overflow-hidden rounded-md border border-hairline bg-surface-card">
          {[
            { label: 'Fase Aktif', value: faseAktif?.label ?? '—', accent: false },
            { label: 'Tawaf', value: '7 Putaran', accent: false },
            { label: "Sa'i", value: '7 Lintasan', accent: false },
            { label: 'Mode Ibadah', value: 'Mode B', accent: true },
          ].map(({ label, value, accent }) => (
            <div key={label} className="px-5 py-3.5">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-mute">{label}</p>
              <p className={`mt-0.5 text-[13px] font-semibold ${accent ? 'text-primary' : 'text-ink'}`}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* BENTO GRID — 4 kolom */}
        <div className="grid grid-cols-4 gap-4">

          {/* HERO: Fase Perjalanan (col-span-2, row-span-2) */}
          <div className="col-span-2 row-span-2">
            <div className="h-full rounded-lg border border-hairline bg-surface-card p-6 flex flex-col shadow-drop-card">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">
                Fase Perjalanan
              </p>
              <h2 className="mt-1.5 font-display text-[28px] font-bold leading-tight text-ink">
                {faseAktif?.label ?? 'Persiapan'}
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-charcoal">
                {faseDesc[jamaah.fase] ?? 'Ikuti panduan dan doa yang telah disiapkan.'}
              </p>

              <div className="mt-6 flex-1">
                <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.2em] text-mute">
                  Progres Perjalanan
                </p>
                <PhaseIndicator fase={jamaah.fase} />
              </div>

              <Link
                to={heroCta.to}
                className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition active:scale-[0.99]"
              >
                {heroCta.label} <IconChevron className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* COUNTER TAWAF */}
          <div className="col-span-2">
            <Link to="/ibadah/tawaf" className="group block">
              <div className="rounded-md border border-hairline bg-surface-card p-5 transition-shadow hover:shadow-drop-soft">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-mute">
                      Mode B · Counter
                    </p>
                    <h3 className="mt-1 font-display text-[20px] font-bold text-ink">
                      Counter Tawaf
                    </h3>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-charcoal">
                      Hitung 7 putaran mengelilingi Ka'bah. Doa muncul otomatis tiap putaran.
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-primary/70 group-hover:text-primary group-hover:gap-2 transition-all">
                      Mulai Tawaf <IconChevron className="h-3 w-3" />
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1 flex-none">
                    <MiniRing />
                    <span className="font-mono text-[9px] uppercase tracking-wider text-ash">Progress</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* COUNTER SA'I */}
          <div className="col-span-2">
            <Link to="/ibadah/sai" className="group block">
              <div className="rounded-md border border-hairline bg-surface-card p-5 transition-shadow hover:shadow-drop-soft">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-mute">
                      Mode B · Counter
                    </p>
                    <h3 className="mt-1 font-display text-[20px] font-bold text-ink">
                      Counter Sa'i
                    </h3>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-charcoal">
                      Hitung 7 lintasan Shafa–Marwah. Arah & doa per lintasan tampil otomatis.
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-primary/70 group-hover:text-primary group-hover:gap-2 transition-all">
                      Mulai Sa'i <IconChevron className="h-3 w-3" />
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1 flex-none">
                    <MiniRing />
                    <span className="font-mono text-[9px] uppercase tracking-wider text-ash">Progress</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* ROW 3: Kartu fitur */}
          <FeatureCard
            to="/doa"
            label="Kumpulan Doa"
            desc="Talbiyah, tawaf, sa'i & lebih"
            icon={<IconDoa className="h-5 w-5" />}
          />
          <FeatureCard
            to="/panduan/tata-cara"
            label="Tata Cara"
            desc="Urutan 6 langkah umrah berurutan"
            icon={<IconPanduan className="h-5 w-5" />}
          />
          <FeatureCard
            to="/panduan/ihram"
            label="Panduan Ihram"
            desc="Niat, larangan & cara memakai kain"
            icon={<IconPanduan className="h-5 w-5" />}
          />

          <SmallCard
            to="/peta"
            label="Peta Lokasi"
            icon={<IconPeta className="h-5 w-5" />}
          />

          {/* ROW 4 */}
          <SmallCard
            to="/profil/persiapan"
            label="Persiapan"
            icon={<IconCheck className="h-5 w-5" />}
          />

          <div className="col-span-3">
            <Link
              to="/profil/sertifikat"
              className="group flex items-center gap-4 overflow-hidden rounded-md border border-hairline bg-surface-card px-6 py-4 transition-shadow hover:shadow-drop-soft"
            >
              <div className="flex h-10 w-10 flex-none items-center justify-center rounded-md border border-hairline bg-surface-bone">
                <IconSertifikat className="h-5 w-5 text-gold" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold text-ink">Sertifikat Digital</p>
                <p className="text-[12px] text-charcoal">Terbit setelah ibadah selesai</p>
              </div>
              <IconChevron className="h-4 w-4 flex-none text-ash group-hover:text-charcoal transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
