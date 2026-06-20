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
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
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

function MiniRing({ progress = 0, total = 7 }: { progress?: number; total?: number }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const dash = (progress / total) * circ;
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
      <text x="26" y="26" textAnchor="middle" dy="0.35em" fill="#8d8d8d" fontSize="9" fontFamily="JetBrains Mono, monospace">
        {progress}/{total}
      </text>
    </svg>
  );
}

function QuickIcon({ to, label, icon }: { to: string; label: string; icon: ReactNode }) {
  return (
    <Link to={to} className="group flex-none flex flex-col items-center gap-2 active:scale-95 transition-transform">
      <div className="flex h-[60px] w-[60px] items-center justify-center rounded-[18px] border border-hairline bg-surface-card shadow-drop-card group-active:shadow-none transition-shadow">
        {icon}
      </div>
      <span className="font-mono text-[10px] uppercase tracking-wider text-mute">{label}</span>
    </Link>
  );
}

function FeatureCard({ to, label, desc, icon }: { to: string; label: string; desc: string; icon: ReactNode }) {
  return (
    <Link to={to} className="group block">
      <div className="h-full rounded-xl border border-hairline bg-surface-card p-4 flex flex-col gap-3 transition-shadow hover:shadow-drop-soft">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-hairline bg-surface-bone">
          <span className="text-primary">{icon}</span>
        </div>
        <div className="flex-1">
          <p className="text-[14px] font-semibold leading-snug text-ink">{label}</p>
          <p className="mt-0.5 text-[12px] leading-relaxed text-charcoal">{desc}</p>
        </div>
        <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-primary/70 group-hover:text-primary group-hover:gap-1.5 transition-all">
          Buka <IconChevron className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}

function SmallCard({ to, label, icon }: { to: string; label: string; icon: ReactNode }) {
  return (
    <Link to={to} className="group flex items-center gap-3 rounded-xl border border-hairline bg-surface-card px-4 py-3.5 transition-shadow hover:shadow-drop-soft">
      <span className="flex-none text-mute group-hover:text-primary transition-colors">{icon}</span>
      <span className="flex-1 text-[13px] font-medium text-ink">{label}</span>
      <IconChevron className="h-3.5 w-3.5 flex-none text-stone group-hover:text-ash transition-colors" />
    </Link>
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

  const firstName = jamaah.nama.split(' ')[0];

  return (
    <>
      {/* ==================== MOBILE (< lg) ==================== */}
      <div className="lg:hidden">

        {/* HEADER BAND */}
        <header
          className="relative overflow-hidden bg-surface-bone px-5 pb-6"
          style={{ paddingTop: 'max(2.25rem, env(safe-area-inset-top))' }}
        >
          {/* Faint dot pattern */}
          <div className="pointer-events-none absolute inset-0 bg-dot-gold opacity-60" />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(80% 100% at 100% 0%, transparent 40%, #f3f0e8 80%)' }}
          />

          <div className="relative">
            {/* Arabic greeting — top right */}
            <p className="font-arab text-[22px] leading-loose text-gold" dir="rtl">
              السَّلَامُ عَلَيْكُمْ
            </p>

            <h1 className="mt-0.5 font-display text-[32px] font-bold leading-none tracking-[-1px] text-ink">
              {firstName}
            </h1>

            <div className="mt-2.5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-canvas/80 px-3 py-1">
              <span className="h-1.5 w-1.5 flex-none rounded-full bg-primary animate-pulse" />
              <p className="font-mono text-[10px] uppercase tracking-wider text-charcoal">
                {faseLabelMobile[jamaah.fase] ?? jamaah.fase}
              </p>
            </div>
          </div>
        </header>

        {/* AKSES CEPAT */}
        <div
          className="mt-4 flex gap-4 overflow-x-auto px-5 pb-1 no-scrollbar"
          role="navigation"
          aria-label="Akses cepat"
        >
          <QuickIcon to="/doa" label="Doa" icon={<IconDoa className="h-6 w-6 text-primary" />} />
          <QuickIcon to="/panduan/ihram" label="Ihram" icon={<IconPanduan className="h-6 w-6 text-primary" />} />
          <QuickIcon to="/ibadah/tawaf" label="Tawaf" icon={<IconIbadah className="h-6 w-6 text-primary" />} />
          <QuickIcon to="/ibadah/sai" label="Sa'i" icon={<IconSai className="h-6 w-6 text-primary" />} />
          <QuickIcon to="/peta" label="Peta" icon={<IconPeta className="h-6 w-6 text-primary" />} />
          <QuickIcon to="/ibadah/jadwal-sholat" label="Sholat" icon={<IconMoon className="h-6 w-6 text-primary" />} />
        </div>

        {/* KARTU FASE */}
        <section className="mt-5 px-5">
          <div className="overflow-hidden rounded-xl border border-hairline bg-surface-card shadow-drop-card">
            {/* Accent strip */}
            <div className="h-[3px] w-full bg-primary" />
            <div className="p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">
                Fase Perjalanan
              </p>
              <h2 className="mt-1.5 font-display text-[24px] font-bold leading-tight text-ink">
                {faseAktif?.label ?? 'Persiapan'}
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-charcoal">
                {faseDesc[jamaah.fase] ?? 'Ikuti panduan dan doa yang telah disiapkan.'}
              </p>
              <Link
                to={heroCta.to}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-[13px] font-bold text-on-primary shadow-glow-primary transition-all active:scale-[0.98]"
              >
                {heroCta.label} <IconChevron className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* PROGRESS PERSIAPAN */}
        <section className="mt-3 px-5">
          <Link to="/profil/persiapan" className="block active:scale-[0.99] transition-transform">
            <div className="rounded-xl border border-hairline bg-surface-card px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 flex-none items-center justify-center rounded-xl border border-hairline bg-surface-bone">
                    <IconCheck className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-mute">Checklist</p>
                    <p className="mt-0.5 text-[13px] font-semibold text-ink">
                      {persiapanDone} dari {totalPersiapan} selesai
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <p className="font-display text-[24px] font-bold text-ink">{persiapanPersen}%</p>
                  <IconChevron className="h-3.5 w-3.5 flex-none text-stone" />
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-3.5 h-1.5 overflow-hidden rounded-full bg-surface-bone">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700"
                  style={{ width: `${persiapanPersen}%` }}
                />
              </div>
            </div>
          </Link>
        </section>

        {/* GRID FITUR */}
        <section className="mt-5 px-5 pb-8">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-mute">
            Panduan &amp; Lainnya
          </p>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { to: '/panduan/tata-cara', label: 'Tata Cara', Icon: IconPanduan },
              { to: '/panduan/ihram', label: 'Ihram', Icon: IconPanduan },
              { to: '/peta', label: 'Peta', Icon: IconPeta },
            ].map(({ to, label, Icon }) => (
              <Link
                key={to + label}
                to={to}
                className="flex min-h-[80px] flex-col items-center justify-center gap-2 rounded-xl border border-hairline bg-surface-card px-2 py-3 text-center active:scale-[0.97] transition-transform"
              >
                <Icon className="h-5 w-5 text-primary" />
                <span className="text-[11px] font-medium leading-tight text-ink">{label}</span>
              </Link>
            ))}
          </div>

          {/* Sertifikat */}
          <Link
            to="/profil/sertifikat"
            className="mt-2.5 flex items-center gap-3 rounded-xl border border-hairline bg-surface-card px-4 py-3.5 active:scale-[0.99] transition-transform"
          >
            <div className="flex h-9 w-9 flex-none items-center justify-center rounded-xl border border-gold/30 bg-gold/8">
              <IconSertifikat className="h-4 w-4 text-gold" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-ink">Sertifikat Digital</p>
              <p className="truncate text-[11px] text-mute">Terbit setelah ibadah selesai</p>
            </div>
            <IconChevron className="h-3.5 w-3.5 flex-none text-stone" />
          </Link>
        </section>
      </div>

      {/* ==================== DESKTOP (≥ lg) — BENTO GRID ==================== */}
      <div className="hidden lg:block px-8 py-8 max-w-content mx-auto">

        {/* Header */}
        <header className="mb-6">
          <p className="font-arab text-[26px] text-gold" dir="rtl">السَّلَامُ عَلَيْكُمْ</p>
          <h1 className="mt-0.5 font-display text-[40px] font-bold leading-none tracking-[-1.5px] text-ink">
            {firstName}
          </h1>
          <div className="mt-2.5 flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface-bone px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-charcoal">
                {faseLabelMobile[jamaah.fase] ?? jamaah.fase}
              </span>
            </span>
            <span className="text-[13px] text-mute">via {jamaah.travel}</span>
          </div>
        </header>

        {/* Stats strip */}
        <div className="mb-6 grid grid-cols-4 divide-x divide-hairline overflow-hidden rounded-xl border border-hairline bg-surface-card shadow-drop-card">
          {[
            { label: 'Fase Aktif', value: faseAktif?.label ?? '—', accent: false },
            { label: 'Tawaf', value: '7 Putaran', accent: false },
            { label: "Sa'i", value: '7 Lintasan', accent: false },
            { label: 'Mode Ibadah', value: 'Mode B', accent: true },
          ].map(({ label, value, accent }) => (
            <div key={label} className="px-5 py-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-mute">{label}</p>
              <p className={`mt-1 text-[13px] font-semibold ${accent ? 'text-primary' : 'text-ink'}`}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-4 gap-4">

          {/* HERO: Fase (col-span-2, row-span-2) */}
          <div className="col-span-2 row-span-2">
            <div className="h-full overflow-hidden rounded-xl border border-hairline bg-surface-card shadow-drop-card flex flex-col">
              {/* Accent strip */}
              <div className="h-[3px] w-full bg-primary flex-none" />
              <div className="flex flex-1 flex-col p-6">
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
                  className="mt-8 inline-flex items-center gap-2 self-start rounded-full bg-primary px-5 py-2.5 text-[13px] font-bold text-on-primary shadow-glow-primary transition-all active:scale-[0.99]"
                >
                  {heroCta.label} <IconChevron className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* COUNTER TAWAF */}
          <div className="col-span-2">
            <Link to="/ibadah/tawaf" className="group block h-full">
              <div className="h-full rounded-xl border border-hairline bg-surface-card p-5 transition-shadow hover:shadow-drop-soft">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-mute">Mode B · Counter</p>
                    <h3 className="mt-1 font-display text-[20px] font-bold text-ink">Counter Tawaf</h3>
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
            <Link to="/ibadah/sai" className="group block h-full">
              <div className="h-full rounded-xl border border-hairline bg-surface-card p-5 transition-shadow hover:shadow-drop-soft">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-mute">Mode B · Counter</p>
                    <h3 className="mt-1 font-display text-[20px] font-bold text-ink">Counter Sa'i</h3>
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
          <FeatureCard to="/doa" label="Kumpulan Doa" desc="Talbiyah, tawaf, sa'i & lebih" icon={<IconDoa className="h-5 w-5" />} />
          <FeatureCard to="/panduan/tata-cara" label="Tata Cara" desc="Urutan 6 langkah umrah berurutan" icon={<IconPanduan className="h-5 w-5" />} />
          <FeatureCard to="/panduan/ihram" label="Panduan Ihram" desc="Niat, larangan & cara memakai kain" icon={<IconPanduan className="h-5 w-5" />} />

          <SmallCard to="/peta" label="Peta Lokasi" icon={<IconPeta className="h-5 w-5" />} />

          {/* ROW 4 */}
          <SmallCard to="/profil/persiapan" label="Persiapan" icon={<IconCheck className="h-5 w-5" />} />

          <div className="col-span-3">
            <Link
              to="/profil/sertifikat"
              className="group flex items-center gap-4 overflow-hidden rounded-xl border border-hairline bg-surface-card px-6 py-4 transition-shadow hover:shadow-drop-soft"
            >
              <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl border border-gold/30 bg-gold/8">
                <IconSertifikat className="h-5 w-5 text-gold" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold text-ink">Sertifikat Digital</p>
                <p className="text-[12px] text-charcoal">Terbit setelah ibadah selesai</p>
              </div>
              <IconChevron className="h-4 w-4 flex-none text-stone group-hover:text-ash transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
