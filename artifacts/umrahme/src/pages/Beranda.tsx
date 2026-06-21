import { useState, useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import heroBg from '@assets/image_1782030121542.png';
import PhaseIndicator from '../components/PhaseIndicator';
import { TravelCompanionFlow } from '../components/dashboard/TravelCompanionFlow';
import { urutanFase } from '../data/jamaah';
import { checklistItems } from '../data/checklist';
import { supabase, type AgendaItemRow } from '../lib/supabase';
import {
  IconDoa,
  IconPanduan,
  IconIbadah,
  IconTawaf,
  IconSai,
  IconMoon,
  IconIhram,
  IconPeta,
  IconCheck,
  IconSertifikat,
  IconChevron,
} from '../components/icons';

// ── Utilitas ──────────────────────────────────────────────────

function hitungHariMenuju(tanggalISO: string): number {
  const target = new Date(tanggalISO + 'T00:00:00');
  const sekarang = new Date();
  sekarang.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - sekarang.getTime()) / (1000 * 60 * 60 * 24));
}

function formatTanggalPendek(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

// ── Sub-komponen ──────────────────────────────────────────────

function MiniRing({ progress = 0, total = 7 }: { progress?: number; total?: number }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const dash = (progress / total) * circ;
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" className="flex-none" aria-hidden>
      <circle cx="26" cy="26" r={r} fill="none" stroke="rgba(212,162,78,0.18)" strokeWidth="5" />
      <circle cx="26" cy="26" r={r} fill="none" stroke="#d4a24e" strokeWidth="5"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" transform="rotate(-90 26 26)" />
      <text x="26" y="26" textAnchor="middle" dy="0.35em" fill="#8d8d8d" fontSize="9" fontFamily="JetBrains Mono, monospace">
        {progress}/{total}
      </text>
    </svg>
  );
}

function FeatureCard({ to, label, desc, icon }: { to: string; label: string; desc: string; icon: ReactNode }) {
  return (
    <Link to={to} className="group block">
      <div className="h-full rounded-2xl border border-hairline bg-white p-4 flex flex-col gap-3 transition-all hover:shadow-drop-lifted hover:-translate-y-0.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ background: 'linear-gradient(135deg, #fff8ee 0%, #fdf0d8 100%)', border: '1.5px solid rgba(212,162,78,0.22)' }}>
          <span className="text-gold">{icon}</span>
        </div>
        <div className="flex-1">
          <p className="text-[14px] font-semibold leading-snug text-ink">{label}</p>
          <p className="mt-0.5 text-[12px] leading-relaxed text-charcoal">{desc}</p>
        </div>
        <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-primary/60 group-hover:text-primary group-hover:gap-1.5 transition-all">
          Buka <IconChevron className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}

function SmallCard({ to, label, icon }: { to: string; label: string; icon: ReactNode }) {
  return (
    <Link to={to} className="group flex items-center gap-3 rounded-xl border border-hairline bg-white px-4 py-3.5 transition-all hover:shadow-drop-lifted hover:-translate-y-0.5">
      <span className="flex-none text-mute group-hover:text-primary transition-colors">{icon}</span>
      <span className="flex-1 text-[13px] font-medium text-ink">{label}</span>
      <IconChevron className="h-3.5 w-3.5 flex-none text-stone group-hover:text-ash transition-colors" />
    </Link>
  );
}

// Ikon kalender sederhana
function IconKalender({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2 v4 M8 2 v4 M3 10 h18" />
      <path d="M8 14 h.01 M12 14 h.01 M16 14 h.01 M8 18 h.01 M12 18 h.01" />
    </svg>
  );
}

// Ikon buku/jurnal
function IconJurnal({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M8 7 h8 M8 11 h6" />
    </svg>
  );
}

// Ikon navigator / kompas
function IconNavigator({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M16.24 7.76 L14.12 14.12 L7.76 16.24 L9.88 9.88 Z" />
    </svg>
  );
}

// ── Kartu H-{n} (Kondisi A) ───────────────────────────────────
function KartuHitung({ n, namaTravel }: { n: number; namaTravel: string }) {
  return (
    <section className="px-5">
      <div
        className="relative overflow-hidden rounded-2xl p-5 shadow-drop-lifted"
        style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-deep) 100%)' }}
      >
        {/* Decorative ring */}
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full opacity-10"
          style={{ background: '#ffffff' }}
        />
        <div
          className="pointer-events-none absolute -right-2 -top-2 h-24 w-24 rounded-full opacity-10"
          style={{ background: '#ffffff' }}
        />

        <div className="relative flex items-end gap-5">
          {/* Angka besar H-n */}
          <div className="flex-none">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/60">Keberangkatan</p>
            <p
              className="font-display font-bold leading-none text-white"
              style={{ fontSize: 'clamp(64px, 20vw, 88px)', letterSpacing: '-3px', lineHeight: 1 }}
            >
              H<span className="text-white/50">-</span>{n}
            </p>
          </div>

          {/* Teks & CTA */}
          <div className="flex-1 pb-1">
            <p className="text-[13px] font-semibold leading-snug text-white/90">
              Menuju keberangkatan bersama {namaTravel}
            </p>
            <p className="mt-1 text-[12px] text-white/60">Siapkan diri Anda sebelum berangkat.</p>
            <Link
              to="/profil/persiapan"
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12px] font-bold transition-all active:scale-[0.97]"
              style={{ color: 'var(--color-primary)' }}
            >
              Cek Persiapan <IconChevron className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Kartu Agenda Hari Ini (Kondisi B) ────────────────────────
function KartuAgendaHariIni({ items, total }: { items: AgendaItemRow[]; total: number }) {
  const today = new Date();
  const hariIni = today.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });
  const lebih = total - items.length;

  return (
    <section className="px-5">
      <div className="rounded-2xl bg-white shadow-drop-lifted border border-hairline overflow-hidden">
        {/* Header */}
        <div
          className="px-5 py-4"
          style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-deep) 100%)' }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/60">Agenda Hari Ini</p>
          <p className="mt-0.5 text-[16px] font-bold text-white">{hariIni}</p>
        </div>

        {/* Items */}
        <div className="divide-y divide-hairline">
          {items.map((item) => (
            <div key={item.id} className="flex items-start gap-3 px-5 py-3.5">
              <span
                className="flex-none font-mono text-[12px] font-bold pt-0.5"
                style={{ color: 'var(--color-primary)', minWidth: '38px' }}
              >
                {item.jam_mulai ? item.jam_mulai.slice(0, 5) : '—:—'}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-ink leading-snug">{item.judul}</p>
                {item.lokasi && (
                  <p className="mt-0.5 text-[11px] text-charcoal flex items-center gap-1">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                    {item.lokasi}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="px-5 py-3.5 border-t border-hairline bg-surface-bone flex items-center justify-between">
          {lebih > 0 && (
            <p className="text-[12px] text-charcoal">+{lebih} agenda lainnya</p>
          )}
          <Link
            to="/profil/agenda"
            className="ml-auto inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider transition-all"
            style={{ color: 'var(--color-primary)' }}
          >
            Lihat Semua <IconChevron className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Grid fitur kecil (3 per baris) ───────────────────────────
function GridItem({
  to, label, children,
}: {
  to: string; label: string; bg?: string; ic?: string; br?: string; children: ReactNode;
}) {
  return (
    <Link
      to={to}
      className="flex min-h-[84px] flex-col items-center justify-center gap-2 rounded-2xl border border-hairline bg-white px-2 py-3 text-center active:scale-[0.96] transition-all hover:shadow-drop-card"
    >
      <span className="text-charcoal">{children}</span>
      <span className="text-[11px] font-semibold leading-tight text-ink">{label}</span>
    </Link>
  );
}

// ── Halaman utama ─────────────────────────────────────────────

export default function Beranda() {
  const { jamaah, tenant } = useAuth();

  const totalPersiapan = checklistItems.length;
  const [persiapanDone] = useState<number>(() => {
    try {
      const raw = localStorage.getItem('umrahme.persiapan');
      return raw ? (JSON.parse(raw) as string[]).length : 0;
    } catch { return 0; }
  });
  const persiapanPersen = totalPersiapan > 0 ? Math.round((persiapanDone / totalPersiapan) * 100) : 0;

  // Agenda hari ini
  const [todayAgenda, setTodayAgenda] = useState<AgendaItemRow[]>([]);
  useEffect(() => {
    if (!tenant?.id) return;
    const today = new Date().toISOString().split('T')[0];
    supabase
      .from('agenda_items')
      .select('*')
      .eq('tenant_id', tenant.id)
      .eq('tanggal', today)
      .order('jam_mulai', { ascending: true })
      .then(({ data }) => { setTodayAgenda((data as AgendaItemRow[]) ?? []); });
  }, [tenant?.id]);

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
    persiapan:    'Lengkapi dokumen, vaksin, dan perlengkapan sebelum keberangkatan.',
    perjalanan:   'Perjalanan menuju Tanah Suci sedang berlangsung. Tetap tenang dan berdoa.',
    'tanah-suci': 'Anda sedang berada di Tanah Suci. Gunakan counter & panduan doa.',
    kepulangan:   'Ibadah telah dilaksanakan. Jaga amal dan kenangan perjalanan ini.',
    selesai:      'Rangkaian umrah telah selesai, insya Allah mabrur.',
  };

  const faseLabelMobile: Record<string, string> = {
    persiapan:    'Fase Persiapan',
    perjalanan:   'Dalam Perjalanan',
    'tanah-suci': 'Di Tanah Suci · Makkah',
    kepulangan:   'Dalam Kepulangan',
    selesai:      'Ibadah Selesai',
  };

  const firstName = jamaah.nama.split(' ')[0];

  // ── Logika Kartu Fokus ──
  const hariMenuju = tenant?.tanggal_keberangkatan
    ? hitungHariMenuju(tenant.tanggal_keberangkatan)
    : null;

  const showHitung = hariMenuju !== null && hariMenuju >= 1 && hariMenuju <= 30;
  const showAgenda = !showHitung && jamaah.fase === 'tanah-suci' && todayAgenda.length > 0;

  // Semua item grid fitur (unified)
  const allFeatures: { to: string; label: string; icon: ReactNode }[] = [
    { to: '/panduan/tata-cara',          label: 'Tata Cara',  icon: <IconPanduan   className="h-5 w-5" /> },
    { to: '/panduan/ihram',              label: 'Ihram',      icon: <IconIhram     className="h-5 w-5" /> },
    { to: '/panduan/manasik-interaktif', label: 'Manasik',    icon: <IconPanduan   className="h-5 w-5" /> },
    { to: '/ibadah/navigator',           label: 'Navigator',  icon: <IconNavigator className="h-5 w-5" /> },
    { to: '/ibadah/tahallul',            label: 'Tahallul',   icon: <IconTawaf     className="h-5 w-5" /> },
    { to: '/profil/jurnal',              label: 'Jurnal',     icon: <IconJurnal    className="h-5 w-5" /> },
    { to: '/peta',                       label: 'Peta',       icon: <IconPeta      className="h-5 w-5" /> },
    { to: '/profil/agenda',              label: 'Agenda',     icon: <IconKalender  className="h-5 w-5" /> },
    { to: '/doa',                        label: 'Doa',        icon: <IconDoa       className="h-5 w-5" /> },
  ];

  return (
    <>
      {/* ==================== MOBILE (< lg) ==================== */}
      <div className="lg:hidden">

        {/* HEADER — full-bleed mosque photo */}
        <header className="relative overflow-hidden" style={{ height: 'clamp(300px, 64vw, 380px)' }}>
          <img src={heroBg} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover animate-ken-burns" style={{ objectPosition: 'center 38%' }} />
          <div className="pointer-events-none absolute inset-x-0 top-0" style={{ height: '90px', background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 100%)' }} />
          <div className="pointer-events-none absolute inset-x-0 bottom-0" style={{ height: '70%', background: 'linear-gradient(to top, rgba(4,3,2,0.82) 0%, rgba(4,3,2,0.50) 45%, transparent 100%)' }} />

          <div className="absolute inset-x-0 bottom-0 px-5" style={{ paddingBottom: '64px' }}>
            <p className="font-display text-[11px] uppercase tracking-[0.2em] text-white/55 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              Assalamu'alaikum
            </p>
            <h1 className="mt-1 font-display text-[40px] font-bold leading-none tracking-[-1.5px] text-white animate-fade-up" style={{ animationDelay: '0.22s' }}>
              {firstName}
            </h1>
          </div>

          <div className="absolute right-5 flex flex-col items-end gap-1" style={{ top: 'max(1.2rem, env(safe-area-inset-top))' }}>
            <img
              src={tenant?.logo_url ?? ''}
              alt={tenant?.nama_travel ?? ''}
              className="h-6 w-auto"
              style={{ filter: 'brightness(0) invert(1)' }}
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
            <p className="font-arab text-[15px] leading-none text-white/40" dir="rtl">السَّلَامُ عَلَيْكُمْ</p>
          </div>
        </header>

        {/* ── SHEET PUTIH ─────────────────────────────────────── */}
        <div className="relative z-10 -mt-12 rounded-t-[28px] bg-canvas animate-slide-up-sheet" style={{ animationDelay: '0.35s' }}>

          {/* ── 1. KARTU FOKUS UTAMA ─────────── */}
          <div className="pt-5 pb-4">

            {/* Kondisi A: H-{n} countdown */}
            {showHitung && (
              <KartuHitung n={hariMenuju!} namaTravel={tenant?.nama_travel ?? 'Travel Anda'} />
            )}

            {/* Kondisi B: Agenda hari ini */}
            {showAgenda && (
              <KartuAgendaHariIni items={todayAgenda.slice(0, 3)} total={todayAgenda.length} />
            )}

          </div>

          {/* ── 2. TRAVEL COMPANION FLOW ──────────── */}
          <TravelCompanionFlow />

          {/* ── 2. CHIP AKSES CEPAT ──────────── */}
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar px-5 pt-1 pb-4" role="navigation" aria-label="Akses cepat">
            {[
              { to: '/doa',                  label: 'Doa',    icon: <IconDoa   className="h-4 w-4" />, aktif: true  },
              { to: '/panduan/ihram',        label: 'Ihram',  icon: <IconIhram className="h-4 w-4" />, aktif: false },
              { to: '/ibadah/tawaf',         label: 'Tawaf',  icon: <IconTawaf className="h-4 w-4" />, aktif: false },
              { to: '/ibadah/sai',           label: "Sa'i",   icon: <IconSai   className="h-4 w-4" />, aktif: false },
              { to: '/peta',                 label: 'Peta',   icon: <IconPeta  className="h-4 w-4" />, aktif: false },
              { to: '/ibadah/jadwal-sholat', label: 'Sholat', icon: <IconMoon  className="h-4 w-4" />, aktif: false },
            ].map(({ to, label, icon, aktif }) => (
              <Link key={to} to={to}
                className={`flex-none inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold transition-all active:scale-[0.96] ${aktif ? 'bg-primary text-on-primary' : 'bg-white border border-hairline text-charcoal shadow-drop-lifted'}`}
              >
                {icon}{label}
              </Link>
            ))}
          </div>

          {/* ── 3. PROGRESS PERSIAPAN ────────── */}
          <div className="px-5 pb-3">
            <Link to="/profil/persiapan" className="block active:scale-[0.99] transition-transform">
              <div className="rounded-2xl border border-hairline bg-white px-4 py-4 shadow-drop-card">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl"
                      style={{ background: 'linear-gradient(135deg, #fff0ee 0%, #ffe6e2 100%)', border: '1.5px solid rgba(14,165,233,0.18)' }}>
                      <IconCheck className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-mute">Checklist</p>
                      <p className="mt-0.5 text-[13px] font-semibold text-ink">{persiapanDone} dari {totalPersiapan} selesai</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-display text-[26px] font-bold text-ink">{persiapanPersen}%</p>
                    <IconChevron className="h-3.5 w-3.5 flex-none text-stone" />
                  </div>
                </div>
                <div className="mt-3.5 h-2 overflow-hidden rounded-full bg-surface-bone">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${persiapanPersen}%`, background: 'linear-gradient(90deg, #0ea5e9 0%, #38bdf8 100%)', boxShadow: '0 0 8px rgba(14,165,233,0.35)' }} />
                </div>
              </div>
            </Link>
          </div>

          {/* ── 4. GRID SEMUA FITUR (unified) ── */}
          <section className="px-5 pb-4">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-mute">
              Jelajahi Semua Fitur
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              {allFeatures.map(({ to, label, icon }) => (
                <GridItem key={to} to={to} label={label}>
                  {icon}
                </GridItem>
              ))}
            </div>
          </section>

          {/* ── 5. SERTIFIKAT ────────────────── */}
          <section className="px-5 pb-8">
            <Link
              to="/profil/sertifikat"
              className="flex items-center gap-3 rounded-2xl border bg-white px-4 py-3.5 active:scale-[0.99] transition-all shadow-drop-card hover:shadow-drop-lifted"
              style={{ borderColor: 'rgba(212,162,78,0.22)' }}
            >
              <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl"
                style={{ background: 'linear-gradient(135deg, #fffcf0 0%, #fdf5e0 100%)', border: '1.5px solid rgba(212,162,78,0.28)' }}>
                <IconSertifikat className="h-4 w-4 text-gold" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-ink">Sertifikat Digital</p>
                <p className="truncate text-[11px] text-mute">Terbit setelah ibadah selesai</p>
              </div>
              <IconChevron className="h-3.5 w-3.5 flex-none text-stone" />
            </Link>
          </section>

        </div>{/* end sheet */}
      </div>

      {/* ==================== DESKTOP (≥ lg) — BENTO GRID ==================== */}
      <div className="hidden lg:block px-8 py-8">

        {/* Header */}
        <header className="mb-6">
          <div className="flex items-baseline justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <p className="font-mono text-[11px] uppercase tracking-widest text-primary">Assalamu'alaikum</p>
            </div>
            <p className="font-arab text-[20px] leading-none text-gold flex-none" dir="rtl">السَّلَامُ عَلَيْكُمْ</p>
          </div>
          <h1 className="mt-2 font-display text-[42px] font-bold leading-none tracking-[-2px] text-ink">{firstName}</h1>
          <div className="mt-2.5 flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5"
              style={{ background: 'rgba(212,162,78,0.10)', border: '1px solid rgba(212,162,78,0.25)' }}>
              <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-gold/80">{faseLabelMobile[jamaah.fase] ?? jamaah.fase}</span>
            </span>
            <span className="text-[13px] text-mute">via {jamaah.travel}</span>
          </div>
        </header>

        {/* Stats strip */}
        <div className="mb-6 grid grid-cols-4 divide-x divide-hairline overflow-hidden rounded-2xl border border-hairline bg-white shadow-drop-card">
          {[
            { label: 'Fase Aktif',  value: faseAktif?.label ?? '—',  accent: false },
            { label: 'Tawaf',       value: '7 Putaran',               accent: false },
            { label: "Sa'i",        value: '7 Lintasan',              accent: false },
            { label: 'Mode Ibadah', value: 'Mode B',                  accent: true  },
          ].map(({ label, value, accent }) => (
            <div key={label} className="px-5 py-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-mute">{label}</p>
              <p className={`mt-1 text-[14px] font-semibold ${accent ? 'text-primary' : 'text-ink'}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Travel companion desktop flow */}
        <TravelCompanionFlow desktop />

        {/* BENTO GRID */}
        <div className="grid grid-cols-4 gap-4">

          {/* HERO: Fase (col-span-2, row-span-2) */}
          <div className="col-span-2 row-span-2">
            <div className="relative h-full overflow-hidden rounded-2xl shadow-drop-lifted flex flex-col"
              style={{ background: 'linear-gradient(145deg, #2d1e0a 0%, #1a1208 100%)' }}>
              <div className="pointer-events-none absolute inset-0 bg-dot-gold-dense opacity-40" />
              <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 55% at 90% 110%, rgba(212,162,78,0.22) 0%, transparent 65%)' }} />
              <div className="relative flex flex-1 flex-col p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold/70">Fase Perjalanan</p>
                <h2 className="mt-1.5 font-display text-[30px] font-bold leading-tight text-on-dark">{faseAktif?.label ?? 'Persiapan'}</h2>
                <p className="mt-2 text-[13px] leading-relaxed text-on-dark-mute">{faseDesc[jamaah.fase] ?? 'Ikuti panduan dan doa yang telah disiapkan.'}</p>
                <div className="mt-6 flex-1">
                  <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.2em] text-on-dark/40">Progres Perjalanan</p>
                  <PhaseIndicator fase={jamaah.fase} />
                </div>
                <Link to={heroCta.to} className="mt-8 inline-flex items-center gap-2 self-start rounded-full bg-primary px-5 py-2.5 text-[13px] font-bold text-on-primary shadow-glow-primary transition-all active:scale-[0.98] hover:bg-primary-deep">
                  {heroCta.label} <IconChevron className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* COUNTER TAWAF */}
          <div className="col-span-2">
            <Link to="/ibadah/tawaf" className="group block h-full">
              <div className="h-full rounded-2xl border p-5 transition-all hover:shadow-drop-lifted hover:-translate-y-0.5"
                style={{ background: '#fffef8', borderColor: 'rgba(212,162,78,0.20)' }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-mute">Mode B · Counter</p>
                    <h3 className="mt-1 font-display text-[20px] font-bold text-ink">Counter Tawaf</h3>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-charcoal">Hitung 7 putaran mengelilingi Ka'bah. Doa muncul otomatis tiap putaran.</p>
                    <span className="mt-3 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-primary/70 group-hover:text-primary group-hover:gap-2 transition-all">
                      Mulai Tawaf <IconChevron className="h-3 w-3" />
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1 flex-none"><MiniRing /><span className="font-mono text-[9px] uppercase tracking-wider text-ash">Progress</span></div>
                </div>
              </div>
            </Link>
          </div>

          {/* COUNTER SA'I */}
          <div className="col-span-2">
            <Link to="/ibadah/sai" className="group block h-full">
              <div className="h-full rounded-2xl border p-5 transition-all hover:shadow-drop-lifted hover:-translate-y-0.5"
                style={{ background: '#f8fff8', borderColor: 'rgba(30,154,86,0.20)' }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-mute">Mode B · Counter</p>
                    <h3 className="mt-1 font-display text-[20px] font-bold text-ink">Counter Sa'i</h3>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-charcoal">Hitung 7 lintasan Shafa–Marwah. Arah & doa per lintasan tampil otomatis.</p>
                    <span className="mt-3 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-primary/70 group-hover:text-primary group-hover:gap-2 transition-all">
                      Mulai Sa'i <IconChevron className="h-3 w-3" />
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1 flex-none"><MiniRing /><span className="font-mono text-[9px] uppercase tracking-wider text-ash">Progress</span></div>
                </div>
              </div>
            </Link>
          </div>

          {/* ROW 3: Kartu fitur */}
          <FeatureCard to="/doa"               label="Kumpulan Doa"  desc="Talbiyah, tawaf, sa'i & lebih"       icon={<IconDoa     className="h-5 w-5" />} />
          <FeatureCard to="/panduan/tata-cara" label="Tata Cara"     desc="Urutan 6 langkah umrah berurutan"    icon={<IconPanduan className="h-5 w-5" />} />
          <FeatureCard to="/panduan/ihram"     label="Panduan Ihram" desc="Niat, larangan & cara memakai kain"  icon={<IconIhram   className="h-5 w-5" />} />

          <SmallCard to="/peta"             label="Peta Lokasi"  icon={<IconPeta    className="h-5 w-5" />} />
          <SmallCard to="/profil/persiapan" label="Persiapan"    icon={<IconCheck   className="h-5 w-5" />} />

          {/* ROW 4: sertifikat wide */}
          <div className="col-span-3">
            <Link to="/profil/sertifikat" className="group flex items-center gap-4 overflow-hidden rounded-2xl border px-6 py-4 transition-all hover:shadow-drop-lifted hover:-translate-y-0.5 bg-white"
              style={{ borderColor: 'rgba(212,162,78,0.22)' }}>
              <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl"
                style={{ background: 'linear-gradient(135deg, #fffcf0 0%, #fdf5e0 100%)', border: '1.5px solid rgba(212,162,78,0.28)' }}>
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
