import { useState, useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import heroBg from '@assets/Temanumrah_BG_1782267839246.png';
import GlobalSearch from '../components/GlobalSearch';
import { TravelCompanionFlow } from '../components/dashboard/TravelCompanionFlow';
import { checklistItems } from '../data/checklist';
import { fetchAgenda, type AgendaItemRow } from '../lib/supabase';
import type { Fase } from '../types';
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

function IconJurnal({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /><path d="M8 7 h8 M8 11 h6" />
    </svg>
  );
}

function IconNavigator({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9" /><path d="M16.24 7.76 L14.12 14.12 L7.76 16.24 L9.88 9.88 Z" />
    </svg>
  );
}

function IconKalender({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2 v4 M8 2 v4 M3 10 h18" />
    </svg>
  );
}

function IconSertifikat({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}

function hitungHariMenuju(tanggalISO: string): number {
  const target = new Date(tanggalISO + 'T00:00:00');
  const sekarang = new Date();
  sekarang.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - sekarang.getTime()) / (1000 * 60 * 60 * 24));
}

function QuickAction({ to, label, icon, accent = false }: {
  to: string; label: string; icon: ReactNode; accent?: boolean;
}) {
  return (
    <Link to={to} className="flex flex-col items-center gap-2 active:scale-[0.93] transition-transform">
      <div
        className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl"
        style={accent
          ? { background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-deep) 100%)', boxShadow: '0 4px 12px color-mix(in srgb, var(--color-primary) 30%, transparent)' }
          : { background: '#ffffff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }
        }
      >
        <span className={accent ? 'text-white' : 'text-charcoal'}>{icon}</span>
      </div>
      <span className="text-[10px] font-semibold leading-tight text-center text-ink" style={{ maxWidth: '56px' }}>
        {label}
      </span>
    </Link>
  );
}

type QA = { to: string; label: string; icon: ReactNode; accent?: boolean };

function getPhaseActions(fase: Fase): QA[] {
  if (fase === 'tanah-suci') return [
    { to: '/ibadah/tawaf',         label: 'Counter Tawaf',  icon: <IconTawaf      className="h-5 w-5" />, accent: true },
    { to: '/ibadah/sai',           label: "Counter Sa'i",   icon: <IconSai        className="h-5 w-5" /> },
    { to: '/doa',                  label: 'Doa Tawaf',      icon: <IconDoa        className="h-5 w-5" /> },
    { to: '/panduan/tata-cara',    label: 'Panduan',        icon: <IconPanduan    className="h-5 w-5" /> },
    { to: '/ibadah/navigator',     label: 'Navigator',      icon: <IconNavigator  className="h-5 w-5" /> },
    { to: '/ibadah/jadwal-sholat', label: 'Sholat',         icon: <IconMoon       className="h-5 w-5" /> },
    { to: '/peta',                 label: 'Peta',           icon: <IconPeta       className="h-5 w-5" /> },
    { to: '/profil/agenda',        label: 'Agenda',         icon: <IconKalender   className="h-5 w-5" /> },
  ];
  if (fase === 'selesai') return [
    { to: '/profil/jurnal',     label: 'Jurnal',      icon: <IconJurnal     className="h-5 w-5" />, accent: true },
    { to: '/profil/sertifikat', label: 'Sertifikat',  icon: <IconSertifikat className="h-5 w-5" /> },
    { to: '/doa',               label: 'Doa Pulang',  icon: <IconDoa        className="h-5 w-5" /> },
    { to: '/peta',              label: 'Ziarah',      icon: <IconPeta       className="h-5 w-5" /> },
    { to: '/panduan/tata-cara', label: 'Tata Cara',   icon: <IconPanduan    className="h-5 w-5" /> },
    { to: '/ibadah/jadwal-sholat', label: 'Sholat',   icon: <IconMoon       className="h-5 w-5" /> },
    { to: '/profil/agenda',     label: 'Agenda',      icon: <IconKalender   className="h-5 w-5" /> },
    { to: '/panduan/manasik-interaktif', label: 'Manasik', icon: <IconIbadah className="h-5 w-5" /> },
  ];
  return [
    { to: '/profil/persiapan',  label: 'Cek Persiapan', icon: <IconCheck   className="h-5 w-5" />, accent: true },
    { to: '/doa',               label: 'Doa Safar',     icon: <IconDoa     className="h-5 w-5" /> },
    { to: '/panduan/ihram',     label: 'Panduan Ihram', icon: <IconIhram   className="h-5 w-5" /> },
    { to: '/profil/agenda',     label: 'Agenda',        icon: <IconKalender className="h-5 w-5" /> },
    { to: '/panduan/tata-cara', label: 'Tata Cara',     icon: <IconPanduan  className="h-5 w-5" /> },
    { to: '/ibadah/jadwal-sholat', label: 'Sholat',     icon: <IconMoon    className="h-5 w-5" /> },
    { to: '/peta',              label: 'Peta',          icon: <IconPeta    className="h-5 w-5" /> },
    { to: '/panduan/manasik-interaktif', label: 'Manasik', icon: <IconIbadah className="h-5 w-5" /> },
  ];
}

function KartuHitung({ n, namaTravel }: { n: number; namaTravel: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl px-5 py-4"
      style={{ background: 'linear-gradient(135deg, #0c2340 0%, #0a3d62 60%, #0ea5e9 100%)' }}>
      <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/[0.06]" />
      <div className="pointer-events-none absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-sky-300/[0.05]" />
      <div className="relative flex items-center gap-5">
        <div className="flex-none">
          <p className="font-mono text-[8.5px] uppercase tracking-[0.22em] text-white/45 mb-0.5">Keberangkatan</p>
          <p className="font-display font-bold text-white" style={{ fontSize: '52px', letterSpacing: '-2px', lineHeight: 1 }}>
            H<span className="text-white/35">-</span>{n}
          </p>
        </div>
        <div className="flex-1">
          <p className="text-[13px] font-semibold text-white/85 leading-snug">Menuju keberangkatan bersama {namaTravel}</p>
          <Link to="/profil/persiapan"
            className="mt-2.5 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11.5px] font-semibold text-white"
            style={{ background: 'rgba(255,255,255,0.16)', border: '1px solid rgba(255,255,255,0.20)' }}>
            Cek Persiapan <IconChevron className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function KartuAgendaHariIni({ items, total }: { items: AgendaItemRow[]; total: number }) {
  const hariIni = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });
  const lebih = total - items.length;
  return (
    <div className="overflow-hidden rounded-2xl bg-white" style={{ border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-hairline">
        <div>
          <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-mute">Agenda Hari Ini</p>
          <p className="text-[13px] font-bold text-ink mt-0.5">{hariIni}</p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: 'rgba(14,165,233,0.08)' }}>
          <IconKalender className="h-3.5 w-3.5 text-primary" />
        </div>
      </div>
      <div className="divide-y divide-hairline">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3 px-4 py-3">
            <span className="flex-none pt-0.5 font-mono text-[11px] font-bold text-primary" style={{ minWidth: '36px' }}>
              {item.jam_mulai ? item.jam_mulai.slice(0, 5) : '—:—'}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-ink">{item.judul}</p>
              {item.lokasi && <p className="mt-0.5 text-[11px] text-charcoal">{item.lokasi}</p>}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-hairline px-4 py-2.5 bg-surface-bone/60">
        {lebih > 0 && <p className="text-[11px] text-charcoal">+{lebih} agenda lainnya</p>}
        <Link to="/profil/agenda" className="ml-auto inline-flex items-center gap-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-primary">
          Lihat Semua <IconChevron className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

function KartuItinerary({ tenantId }: { tenantId: string }) {
  type SlimItem = { tanggal: string; judul: string; jam_mulai: string | null };
  const [allItems, setAllItems] = useState<SlimItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetchAgenda(tenantId).then(data => {
      setAllItems(data.map(i => ({ tanggal: i.tanggal, judul: i.judul, jam_mulai: i.jam_mulai })));
      setReady(true);
    }).catch(() => setReady(true));
  }, [tenantId]);

  if (!ready) return null;

  const tanggalUnik = [...new Set(allItems.map((i) => i.tanggal))].sort();
  const totalHari = tanggalUnik.length;
  if (totalHari === 0) return null;

  const tanggalPertama = tanggalUnik[0];
  const tanggalTerakhir = tanggalUnik[totalHari - 1];
  const todayStr = new Date().toISOString().split('T')[0];

  const hariKe = (() => {
    const start = new Date(tanggalPertama + 'T00:00:00').getTime();
    const cur   = new Date(todayStr       + 'T00:00:00').getTime();
    return Math.round((cur - start) / 86400000) + 1;
  })();

  const belumMulai = todayStr < tanggalPertama;
  const sudahSelesai = todayStr > tanggalTerakhir;

  const persen = belumMulai ? 0 : sudahSelesai ? 100 : Math.round((Math.min(hariKe, totalHari) / totalHari) * 100);

  const labelHari = belumMulai
    ? 'Belum dimulai'
    : sudahSelesai
    ? 'Perjalanan selesai'
    : `Hari ${hariKe} dari ${totalHari}`;

  // Cari item berikutnya: hari ini jam >= sekarang, atau hari berikutnya pertama
  const nowMin = new Date().getHours() * 60 + new Date().getMinutes();
  const itemBerikutnya = (() => {
    // item hari ini yang belum lewat
    const hariIniItems = allItems.filter((i) => i.tanggal === todayStr);
    const berikutHariIni = hariIniItems.find((i) => {
      if (!i.jam_mulai) return false;
      const [h, m] = i.jam_mulai.split(':').map(Number);
      return h * 60 + m >= nowMin;
    });
    if (berikutHariIni) return berikutHariIni;
    // item pertama hari berikutnya
    const hariDepan = tanggalUnik.find((t) => t > todayStr);
    if (!hariDepan) return null;
    return allItems.find((i) => i.tanggal === hariDepan) ?? null;
  })();

  const semuaSelesaiHariIni =
    !belumMulai &&
    !sudahSelesai &&
    allItems.some((i) => i.tanggal === todayStr) &&
    !itemBerikutnya;

  return (
    <Link to="/profil/agenda" className="block active:scale-[0.99] transition-transform">
      <div className="overflow-hidden rounded-2xl border border-hairline bg-white shadow-drop-card">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-hairline">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 flex-none items-center justify-center rounded-xl"
              style={{ background: 'rgba(14,165,233,0.08)' }}>
              <IconKalender className="h-3.5 w-3.5 text-primary" />
            </div>
            <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-mute">Itinerary Perjalanan</p>
          </div>
          <IconChevron className="h-3.5 w-3.5 text-ash" />
        </div>

        {/* Progress */}
        <div className="px-4 pt-3.5 pb-1">
          <p className="font-display text-[22px] font-bold leading-none text-ink">{labelHari}</p>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-surface-bone">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${persen}%`, background: 'var(--color-primary)' }}
            />
          </div>
          <p className="mt-1 font-mono text-[10px] text-mute">{persen}%</p>
        </div>

        {/* Item berikutnya */}
        <div className="px-4 pb-3.5 pt-2.5 border-t border-hairline mt-2">
          {semuaSelesaiHariIni ? (
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 flex-none">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <p className="text-[12px] font-semibold text-emerald-600">Semua agenda hari ini selesai</p>
            </div>
          ) : itemBerikutnya ? (
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-mute mb-0.5">Berikutnya</p>
              <p className="text-[13px] font-semibold text-ink leading-snug">
                {itemBerikutnya.jam_mulai ? itemBerikutnya.jam_mulai.slice(0, 5) + ' · ' : ''}
                {itemBerikutnya.judul}
              </p>
            </div>
          ) : (
            <p className="text-[12px] text-mute italic">Tidak ada agenda terjadwal</p>
          )}
        </div>
      </div>
    </Link>
  );
}


const faseBadge: Record<string, string> = {
  persiapan:    'Fase Persiapan',
  perjalanan:   'Dalam Perjalanan',
  'tanah-suci': '🕌 Di Tanah Suci',
  kepulangan:   'Dalam Kepulangan',
  selesai:      '✨ Ibadah Selesai',
};

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

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

  if (!jamaah) return null;

  const firstName   = jamaah.nama.split(' ')[0];
  const namaTravel  = tenant?.nama_travel ?? jamaah.travel;
  const hariMenuju  = tenant?.tanggal_keberangkatan ? hitungHariMenuju(tenant.tanggal_keberangkatan) : null;
  const showHitung  = hariMenuju !== null && hariMenuju >= 1 && hariMenuju <= 30;
  const phaseActions = getPhaseActions(jamaah.fase);

  const heroOverlayTop = tenant?.primary_deep_color
    ? hexToRgba(tenant.primary_deep_color, 0.60)
    : 'rgba(5,10,20,0.55)';
  const heroOverlayBottom = tenant?.primary_color
    ? hexToRgba(tenant.primary_color, 0.85)
    : 'rgba(5,10,20,0.92)';

  return (
    <>
      {/* ==================== MOBILE ==================== */}
      <div className="lg:hidden min-h-screen bg-canvas overflow-x-hidden">

        {/* ── HERO HEADER ─────────────────────────────── */}
        <div className="relative overflow-hidden" style={{ height: 'clamp(240px, 58vw, 340px)' }}>
          <img src={tenant?.hero_image_url || heroBg} alt="" aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: 'center 38%' }} />

          <div className="pointer-events-none absolute inset-0"
            style={{ background: `linear-gradient(to top, ${heroOverlayBottom} 0%, rgba(5,10,20,0.20) 40%, transparent 70%)` }} />

          {/* Greeting */}
          <div className="absolute inset-x-0 bottom-0 px-5 pb-14">
            <p className="font-mono text-[9.5px] uppercase tracking-[0.30em] text-white/40 mb-0.5">
              Assalamu'alaikum
            </p>
            <h1 className="font-display font-bold text-white" style={{ fontSize: 'clamp(28px,8vw,40px)', letterSpacing: '-1px', lineHeight: 1.05 }}>
              {firstName}
            </h1>
            <div className="mt-2 flex items-center gap-2">
              <p className="text-[11px] text-white/50">{namaTravel}</p>
              <span className="h-3 w-px bg-white/20" />
              <div className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-300 animate-pulse" />
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/65">
                  {faseBadge[jamaah.fase] ?? jamaah.fase}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── CONTENT SHEET ───────────────────────────── */}
        <div className="relative z-10 -mt-8 rounded-t-[28px] bg-canvas px-4 pt-4 pb-12 space-y-3">

          {/* Search */}
          <GlobalSearch />

          {/* Countdown */}
          {showHitung && <KartuHitung n={hariMenuju!} namaTravel={namaTravel} />}

          {/* Travel companion cards */}
          <TravelCompanionFlow />

          {/* Itinerary ringkasan */}
          {tenant?.id && <KartuItinerary tenantId={tenant.id} />}

          {/* Checklist */}
          {jamaah.fase === 'persiapan' && (
            <Link to="/profil/persiapan" className="block active:scale-[0.99] transition-transform">
              <div className="rounded-2xl bg-white p-4" style={{ border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 flex-none items-center justify-center rounded-xl"
                      style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', border: '1px solid rgba(16,185,129,0.16)' }}>
                      <IconCheck className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div>
                      <p className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-mute">Checklist Persiapan</p>
                      <p className="mt-0.5 text-[13px] font-semibold text-ink">{persiapanDone} dari {totalPersiapan} selesai</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-display text-[22px] font-bold text-ink">{persiapanPersen}%</p>
                    <IconChevron className="h-3.5 w-3.5 text-ash" />
                  </div>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-surface-bone">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${persiapanPersen}%`, background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)' }} />
                </div>
              </div>
            </Link>
          )}

          {/* Pemisah */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-hairline" />
            <p className="font-mono text-[8.5px] uppercase tracking-[0.28em] text-stone">Akses Cepat</p>
            <div className="flex-1 h-px bg-hairline" />
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-4 gap-y-4 gap-x-2">
            {phaseActions.map(({ to, label, icon, accent }) => (
              <QuickAction key={to} to={to} label={label} icon={icon} accent={accent} />
            ))}
          </div>

        </div>
      </div>

      {/* ==================== DESKTOP ==================== */}
      <div className="hidden lg:grid lg:grid-cols-[1fr_360px] min-h-screen">

        {/* Kolom kiri */}
        <div className="px-8 py-8 border-r border-hairline overflow-y-auto space-y-5">
          <header>
            <p className="font-mono text-[10px] uppercase tracking-widest text-primary">Assalamu'alaikum</p>
            <h1 className="mt-0.5 font-display text-[38px] font-bold leading-none tracking-[-2px] text-ink">{firstName}</h1>
            <div className="mt-2 flex items-center gap-2">
              <p className="text-[13px] text-charcoal">{namaTravel}</p>
              <span className="h-3 w-px bg-hairline" />
              <span className="rounded-full px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-primary"
                style={{ background: 'rgba(14,165,233,0.10)' }}>
                {faseBadge[jamaah.fase] ?? jamaah.fase}
              </span>
            </div>
          </header>

          <GlobalSearch />

          {showHitung && <KartuHitung n={hariMenuju!} namaTravel={namaTravel} />}

          <TravelCompanionFlow desktop />

          {/* Itinerary ringkasan */}
          {tenant?.id && <KartuItinerary tenantId={tenant.id} />}

          {jamaah.fase === 'persiapan' && (
            <Link to="/profil/persiapan" className="block active:scale-[0.99] transition-transform">
              <div className="rounded-2xl bg-white p-4" style={{ border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div>
                    <p className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-mute">Checklist Persiapan</p>
                    <p className="mt-0.5 text-[14px] font-semibold text-ink">{persiapanDone} dari {totalPersiapan} selesai</p>
                  </div>
                  <p className="font-display text-[26px] font-bold text-ink">{persiapanPersen}%</p>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-surface-bone">
                  <div className="h-full rounded-full" style={{ width: `${persiapanPersen}%`, background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)' }} />
                </div>
              </div>
            </Link>
          )}

          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-hairline" />
              <p className="font-mono text-[8.5px] uppercase tracking-[0.28em] text-stone">Akses Cepat</p>
              <div className="flex-1 h-px bg-hairline" />
            </div>
            <div className="grid grid-cols-8 gap-3">
              {phaseActions.map(({ to, label, icon, accent }) => (
                <QuickAction key={to} to={to} label={label} icon={icon} accent={accent} />
              ))}
            </div>
          </div>
        </div>

        {/* Kolom kanan */}
        <div className="flex flex-col">
          <div className="relative flex-none" style={{ height: '220px' }}>
            <img src={tenant?.hero_image_url || heroBg} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: 'center 30%' }} />
            <div className="pointer-events-none absolute inset-0" style={{ background: `linear-gradient(to bottom, ${heroOverlayTop} 0%, ${heroOverlayBottom} 100%)` }} />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/40">Jamaah</p>
              <p className="mt-0.5 font-display text-[24px] font-bold text-white leading-tight">{jamaah.nama}</p>
              <p className="mt-0.5 font-mono text-[10px] tracking-widest text-sky-200/50">{jamaah.kodeAktivasi}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
