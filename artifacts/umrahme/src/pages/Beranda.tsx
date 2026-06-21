import { useState, useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import heroBg from '@assets/image_1782030121542.png';
import GlobalSearch from '../components/GlobalSearch';
import { TravelCompanionFlow } from '../components/dashboard/TravelCompanionFlow';
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
  IconChevron,
} from '../components/icons';

// ── Ikon lokal ────────────────────────────────────────────────

function IconJurnal({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M8 7 h8 M8 11 h6" />
    </svg>
  );
}

function IconNavigator({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M16.24 7.76 L14.12 14.12 L7.76 16.24 L9.88 9.88 Z" />
    </svg>
  );
}

function IconKalender({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2 v4 M8 2 v4 M3 10 h18" />
    </svg>
  );
}

// ── Utilitas ──────────────────────────────────────────────────

function hitungHariMenuju(tanggalISO: string): number {
  const target = new Date(tanggalISO + 'T00:00:00');
  const sekarang = new Date();
  sekarang.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - sekarang.getTime()) / (1000 * 60 * 60 * 24));
}

// ── Quick action item ─────────────────────────────────────────

function QuickAction({ to, label, icon, accent = false }: {
  to: string; label: string; icon: ReactNode; accent?: boolean;
}) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center gap-2.5 active:scale-[0.94] transition-all"
    >
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-all ${accent ? 'shadow-[0_4px_16px_rgba(14,165,233,0.28)]' : 'shadow-drop-card'}`}
        style={accent
          ? { background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)' }
          : { background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)' }
        }
      >
        <span className={accent ? 'text-white' : 'text-charcoal'}>{icon}</span>
      </div>
      <span className={`text-[11px] font-semibold leading-tight text-center ${accent ? 'text-primary' : 'text-ink'}`}>
        {label}
      </span>
    </Link>
  );
}

// ── Kartu H-{n} ───────────────────────────────────────────────

function KartuHitung({ n, namaTravel }: { n: number; namaTravel: string }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-4"
      style={{ background: 'linear-gradient(135deg, #0c2340 0%, #0a3d62 60%, #0ea5e9 100%)' }}
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/[0.07]" />
      <div className="pointer-events-none absolute -bottom-8 -right-8 h-36 w-36 rounded-full bg-sky-300/[0.06]" />
      <div className="relative flex items-center gap-4">
        <div className="flex-none">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/50">Keberangkatan</p>
          <p className="font-display font-bold text-white" style={{ fontSize: '56px', letterSpacing: '-2px', lineHeight: 1 }}>
            H<span className="text-white/40">-</span>{n}
          </p>
        </div>
        <div className="flex-1">
          <p className="text-[13px] font-semibold text-white/90 leading-snug">Menuju keberangkatan bersama {namaTravel}</p>
          <Link to="/profil/persiapan" className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1.5 text-[12px] font-semibold text-white backdrop-blur-sm active:scale-[0.97] transition-all">
            Cek Persiapan <IconChevron className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Kartu Agenda Hari Ini ─────────────────────────────────────

function KartuAgendaHariIni({ items, total }: { items: AgendaItemRow[]; total: number }) {
  const hariIni = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });
  const lebih = total - items.length;

  return (
    <div className="overflow-hidden rounded-2xl border border-hairline bg-white shadow-drop-card">
      <div className="px-4 py-3" style={{ background: 'linear-gradient(135deg, #0c2340 0%, #0ea5e9 100%)' }}>
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/55">Agenda Hari Ini</p>
        <p className="mt-0.5 text-[15px] font-bold text-white">{hariIni}</p>
      </div>
      <div className="divide-y divide-hairline">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3 px-4 py-3">
            <span className="flex-none pt-0.5 font-mono text-[11px] font-bold text-primary" style={{ minWidth: '36px' }}>
              {item.jam_mulai ? item.jam_mulai.slice(0, 5) : '—:—'}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold leading-snug text-ink">{item.judul}</p>
              {item.lokasi && <p className="mt-0.5 text-[11px] text-charcoal">{item.lokasi}</p>}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-hairline bg-surface-bone px-4 py-2.5">
        {lebih > 0 && <p className="text-[11px] text-charcoal">+{lebih} agenda lainnya</p>}
        <Link to="/profil/agenda" className="ml-auto inline-flex items-center gap-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-primary">
          Lihat Semua <IconChevron className="h-3 w-3" />
        </Link>
      </div>
    </div>
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

  const firstName = jamaah.nama.split(' ')[0];

  const hariMenuju = tenant?.tanggal_keberangkatan
    ? hitungHariMenuju(tenant.tanggal_keberangkatan)
    : null;
  const showHitung = hariMenuju !== null && hariMenuju >= 1 && hariMenuju <= 30;
  const showAgenda = !showHitung && jamaah.fase === 'tanah-suci' && todayAgenda.length > 0;

  const faseBadge: Record<string, string> = {
    persiapan:    'Fase Persiapan',
    perjalanan:   'Dalam Perjalanan',
    'tanah-suci': '🕌 Di Tanah Suci',
    kepulangan:   'Dalam Kepulangan',
    selesai:      '✨ Ibadah Selesai',
  };

  const quickActions = [
    { to: '/doa',                  label: 'Doa',       icon: <IconDoa      className="h-5 w-5" />, accent: true  },
    { to: '/panduan/ihram',        label: 'Ihram',     icon: <IconIhram    className="h-5 w-5" />, accent: false },
    { to: '/ibadah/tawaf',         label: 'Tawaf',     icon: <IconTawaf    className="h-5 w-5" />, accent: false },
    { to: '/ibadah/sai',           label: "Sa'i",      icon: <IconSai      className="h-5 w-5" />, accent: false },
    { to: '/peta',                 label: 'Peta',      icon: <IconPeta     className="h-5 w-5" />, accent: false },
    { to: '/ibadah/jadwal-sholat', label: 'Sholat',    icon: <IconMoon     className="h-5 w-5" />, accent: false },
    { to: '/panduan/tata-cara',    label: 'Tata Cara', icon: <IconPanduan  className="h-5 w-5" />, accent: false },
    { to: '/ibadah/navigator',     label: 'Navigator', icon: <IconNavigator className="h-5 w-5" />, accent: false },
  ];

  const moreFeatures = [
    { to: '/panduan/manasik-interaktif', label: 'Manasik Interaktif',  icon: <IconIbadah    className="h-4 w-4" /> },
    { to: '/profil/jurnal',              label: 'Jurnal Perjalanan',    icon: <IconJurnal    className="h-4 w-4" /> },
    { to: '/profil/agenda',              label: 'Agenda',               icon: <IconKalender  className="h-4 w-4" /> },
    { to: '/profil/sertifikat',          label: 'Sertifikat Digital',   icon: <IconCheck     className="h-4 w-4" /> },
  ];

  return (
    <>
      {/* ==================== MOBILE ==================== */}
      <div className="lg:hidden min-h-screen bg-canvas overflow-x-hidden">

        {/* ── HERO ─────────────────────────────────────── */}
        <div className="relative overflow-hidden" style={{ height: 'clamp(320px, 72vw, 420px)' }}>
          <img
            src={heroBg}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover animate-ken-burns"
            style={{ objectPosition: 'center 38%' }}
          />
          {/* Gradient overlays */}
          <div className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(5,10,20,0.62) 0%, transparent 40%)' }} />
          <div className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(5,10,20,0.90) 0%, rgba(5,10,20,0.55) 35%, transparent 65%)' }} />

          {/* Logo travel */}
          <div className="absolute right-5 flex flex-col items-end gap-1" style={{ top: 'max(1.2rem, env(safe-area-inset-top))' }}>
            <img
              src={tenant?.logo_url ?? ''}
              alt={tenant?.nama_travel ?? ''}
              className="h-6 w-auto max-w-[90px] object-contain"
              style={{ filter: 'brightness(0) invert(1) opacity(0.65)' }}
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          </div>

          {/* Nama + salam */}
          <div className="absolute inset-x-0 bottom-0 px-5 pb-24">
            <p className="font-display text-[11px] uppercase tracking-[0.3em] text-white/45">
              Assalamu'alaikum
            </p>
            <h1 className="mt-1 font-display font-bold text-white" style={{ fontSize: 'clamp(34px,10vw,46px)', letterSpacing: '-1px', lineHeight: 1.05 }}>
              {firstName}
            </h1>
            <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full px-3 py-1" style={{ background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.18)' }}>
              <span className="h-1.5 w-1.5 rounded-full bg-sky-300 animate-pulse flex-none" />
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/80">
                {faseBadge[jamaah.fase] ?? jamaah.fase}
              </span>
            </div>
          </div>
        </div>

        {/* ── SHEET (melengkung ke atas) ───────────────── */}
        <div className="relative z-10 -mt-10 rounded-t-[32px] bg-canvas px-4 pt-5 pb-12 space-y-4">

          {/* Search bar di atas sheet */}
          <GlobalSearch />

          {/* Kartu kondisional */}
          {showHitung && (
            <KartuHitung n={hariMenuju!} namaTravel={tenant?.nama_travel ?? 'Travel Anda'} />
          )}
          {showAgenda && (
            <KartuAgendaHariIni items={todayAgenda.slice(0, 3)} total={todayAgenda.length} />
          )}

          {/* ── QUICK ACTIONS (4-col) ── */}
          <div>
            <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.28em] text-mute">Akses Cepat</p>
            <div className="grid grid-cols-4 gap-3">
              {quickActions.map(({ to, label, icon, accent }) => (
                <QuickAction key={to} to={to} label={label} icon={icon} accent={accent} />
              ))}
            </div>
          </div>

          {/* ── DIVIDER ── */}
          <div className="h-px bg-hairline" />

          {/* ── TRAVEL COMPANION FLOW ── */}
          <TravelCompanionFlow />

          {/* ── DIVIDER ── */}
          <div className="h-px bg-hairline" />

          {/* ── CHECKLIST PROGRESS ── */}
          <Link to="/profil/persiapan" className="block active:scale-[0.99] transition-transform">
            <div className="rounded-2xl border border-hairline bg-white p-4 shadow-drop-card">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 flex-none items-center justify-center rounded-xl"
                    style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', border: '1.5px solid rgba(16,185,129,0.2)' }}
                  >
                    <IconCheck className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-mute">Checklist Persiapan</p>
                    <p className="mt-0.5 text-[13px] font-semibold text-ink">
                      {persiapanDone} dari {totalPersiapan} selesai
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <p className="font-display text-[24px] font-bold text-ink">{persiapanPersen}%</p>
                  <IconChevron className="h-3.5 w-3.5 flex-none text-ash" />
                </div>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-bone">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${persiapanPersen}%`, background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)' }}
                />
              </div>
            </div>
          </Link>

          {/* ── FITUR LAINNYA (list) ── */}
          <div>
            <p className="mb-2.5 font-mono text-[9px] uppercase tracking-[0.28em] text-mute">Fitur Lainnya</p>
            <div className="rounded-2xl border border-hairline bg-white shadow-drop-card overflow-hidden divide-y divide-hairline">
              {moreFeatures.map(({ to, label, icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-3 px-4 py-3.5 active:bg-surface-bone transition-colors"
                >
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-surface-bone text-charcoal">
                    {icon}
                  </span>
                  <span className="flex-1 text-[13px] font-semibold text-ink">{label}</span>
                  <IconChevron className="h-3.5 w-3.5 flex-none text-ash" />
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ==================== DESKTOP (≥ lg) ==================== */}
      <div className="hidden lg:grid lg:grid-cols-[1fr_380px] lg:gap-0 min-h-screen">

        {/* Kolom kiri — konten utama */}
        <div className="px-8 py-8 border-r border-hairline overflow-y-auto">
          <header className="mb-8">
            <p className="font-mono text-[11px] uppercase tracking-widest text-primary">Assalamu'alaikum</p>
            <h1 className="mt-1 font-display text-[42px] font-bold leading-none tracking-[-2px] text-ink">{firstName}</h1>
            <div className="mt-2 flex items-center gap-2">
              <span className="rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-gold/80"
                style={{ background: 'rgba(212,162,78,0.10)', border: '1px solid rgba(212,162,78,0.22)' }}>
                {faseBadge[jamaah.fase] ?? jamaah.fase}
              </span>
              <span className="text-[12px] text-mute">{jamaah.travel}</span>
            </div>
          </header>

          {/* Search */}
          <div className="mb-6">
            <GlobalSearch />
          </div>

          {/* Quick actions */}
          <div className="mb-8 grid grid-cols-8 gap-3">
            {quickActions.map(({ to, label, icon, accent }) => (
              <QuickAction key={to} to={to} label={label} icon={icon} accent={accent} />
            ))}
          </div>

          {/* TravelCompanionFlow desktop */}
          <TravelCompanionFlow desktop />

          {/* Checklist */}
          <Link to="/profil/persiapan" className="mt-4 block active:scale-[0.99] transition-transform">
            <div className="rounded-2xl border border-hairline bg-white p-4 shadow-drop-card">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-mute">Checklist Persiapan</p>
                  <p className="mt-0.5 text-[14px] font-semibold text-ink">{persiapanDone} dari {totalPersiapan} selesai</p>
                </div>
                <p className="font-display text-[28px] font-bold text-ink">{persiapanPersen}%</p>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-surface-bone">
                <div className="h-full rounded-full" style={{ width: `${persiapanPersen}%`, background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)' }} />
              </div>
            </div>
          </Link>
        </div>

        {/* Kolom kanan — foto + info */}
        <div className="relative flex flex-col">
          <div className="relative flex-none" style={{ height: '260px' }}>
            <img src={heroBg} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: 'center 30%' }} />
            <div className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(5,10,20,0.4) 0%, rgba(5,10,20,0.8) 100%)' }} />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <p className="font-display text-[11px] uppercase tracking-[0.3em] text-white/45">via {jamaah.travel}</p>
              <p className="mt-1 font-display text-[28px] font-bold text-white leading-tight">{jamaah.nama}</p>
              <p className="mt-1 font-mono text-[11px] tracking-widest text-sky-200/60">{jamaah.kodeAktivasi}</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-mute">Fitur Lainnya</p>
            <div className="rounded-2xl border border-hairline bg-white shadow-drop-card overflow-hidden divide-y divide-hairline">
              {moreFeatures.map(({ to, label, icon }) => (
                <Link key={to} to={to} className="flex items-center gap-3 px-4 py-3.5 hover:bg-surface-bone transition-colors">
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-surface-bone text-charcoal">{icon}</span>
                  <span className="flex-1 text-[13px] font-semibold text-ink">{label}</span>
                  <IconChevron className="h-3.5 w-3.5 flex-none text-ash" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
