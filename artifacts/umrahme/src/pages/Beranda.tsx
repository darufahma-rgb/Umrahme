import { useState, useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import heroBg from '@assets/image_1782030121542.png';
import GlobalSearch from '../components/GlobalSearch';
import { TripIdentityCard, PinnedAnnouncementCard, EmergencyGuideCard } from '../components/dashboard/TravelCompanionFlow';
import { supabase, type AgendaItemRow } from '../lib/supabase';
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

function formatTanggalHari(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long',
  });
}

// ── Live Itinerary Card ──────────────────────────────────────────

type ItineraryState = 'menunggu' | 'live' | 'kosong' | 'selesai';

function KartuLiveItinerary({
  fase,
  hariMenuju,
  namaTravel,
  agendaHariIni,
  tanggalKeberangkatan,
}: {
  fase: Fase;
  hariMenuju: number | null;
  namaTravel: string;
  agendaHariIni: AgendaItemRow[];
  tanggalKeberangkatan: string | null;
}) {
  // Tentukan state
  let state: ItineraryState;
  if (fase === 'selesai') {
    state = 'selesai';
  } else if (fase === 'tanah-suci' || (hariMenuju !== null && hariMenuju <= 0)) {
    state = agendaHariIni.length > 0 ? 'live' : 'kosong';
  } else {
    state = 'menunggu';
  }

  const hariIniLabel = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  // ── State: Menunggu keberangkatan ────────────────────────────
  if (state === 'menunggu') {
    return (
      <div className="relative overflow-hidden rounded-2xl"
        style={{ background: 'linear-gradient(135deg, #0c2340 0%, #0a3d62 60%, #0ea5e9 100%)' }}>
        <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/[0.05]" />
        <div className="pointer-events-none absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-sky-300/[0.04]" />
        <div className="relative px-5 pt-5 pb-4">
          <p className="font-mono text-[8px] uppercase tracking-[0.28em] text-white/40 mb-1">Keberangkatan</p>
          {hariMenuju !== null && hariMenuju >= 1 ? (
            <div className="flex items-end gap-3 mb-4">
              <p className="font-display font-bold text-white" style={{ fontSize: '60px', letterSpacing: '-3px', lineHeight: 1 }}>
                H<span className="text-white/30">-</span>{hariMenuju}
              </p>
              <div className="pb-2">
                <p className="text-[13px] font-semibold text-white/80 leading-snug">
                  Menuju keberangkatan<br />bersama {namaTravel}
                </p>
                {tanggalKeberangkatan && (
                  <p className="mt-1 font-mono text-[10px] text-white/35 tracking-wider">
                    {formatTanggalHari(tanggalKeberangkatan)}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-[18px] font-bold text-white mb-4 leading-snug">
              Perjalanan bersama {namaTravel} dimulai!
            </p>
          )}

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.10)' }} className="mb-4" />

          <p className="text-[11px] text-white/50 mb-3">Sambil menunggu, persiapkan perjalananmu:</p>
          <div className="flex flex-wrap gap-2">
            <Link to="/profil/persiapan"
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[11.5px] font-semibold text-white active:scale-[0.97] transition-all"
              style={{ background: 'rgba(255,255,255,0.16)', border: '1px solid rgba(255,255,255,0.22)' }}>
              <IconCheck className="h-3 w-3" /> Cek Persiapan
            </Link>
            <Link to="/panduan/tata-cara"
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[11.5px] font-semibold text-white active:scale-[0.97] transition-all"
              style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.14)' }}>
              <IconPanduan className="h-3 w-3" /> Pelajari Tata Cara
            </Link>
            <Link to="/doa"
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[11.5px] font-semibold text-white active:scale-[0.97] transition-all"
              style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.14)' }}>
              <IconDoa className="h-3 w-3" /> Kumpulan Doa
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── State: Selesai ───────────────────────────────────────────
  if (state === 'selesai') {
    return (
      <div className="overflow-hidden rounded-2xl bg-white" style={{ border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <div className="px-5 py-5 text-center">
          <p className="text-2xl mb-2">✨</p>
          <p className="font-mono text-[8px] uppercase tracking-[0.28em] text-mute mb-1">Perjalanan Selesai</p>
          <p className="text-[15px] font-bold text-ink leading-snug mb-1">Semoga ibadahmu diterima Allah SWT</p>
          <p className="text-[12px] text-charcoal mb-4">Jazakumullahu khairan atas kepercayaan kepada {namaTravel}.</p>
          <div className="flex justify-center gap-2">
            <Link to="/profil/jurnal"
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)' }}>
              <IconJurnal className="h-3.5 w-3.5" /> Jurnal Perjalanan
            </Link>
            <Link to="/profil/sertifikat"
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-semibold"
              style={{ background: 'rgba(0,0,0,0.05)', color: '#374151', border: '1px solid rgba(0,0,0,0.07)' }}>
              <IconSertifikat className="h-3.5 w-3.5" /> Sertifikat
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── State: Tidak ada agenda hari ini ─────────────────────────
  if (state === 'kosong') {
    return (
      <div className="overflow-hidden rounded-2xl bg-white" style={{ border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-hairline">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-mute">Agenda Hari Ini</p>
            </div>
            <p className="text-[13px] font-bold text-ink">{hariIniLabel}</p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: 'rgba(16,185,129,0.08)' }}>
            <IconKalender className="h-3.5 w-3.5 text-emerald-500" />
          </div>
        </div>
        <div className="px-4 py-5 text-center">
          <p className="text-[13px] font-semibold text-ink mb-1">Tidak ada kegiatan terjadwal hari ini</p>
          <p className="text-[12px] text-charcoal mb-3">Manfaatkan waktu untuk istirahat dan ibadah mandiri.</p>
          <Link to="/profil/agenda"
            className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-primary">
            Lihat Agenda Lengkap <IconChevron className="h-3 w-3" />
          </Link>
        </div>
      </div>
    );
  }

  // ── State: Live — ada agenda hari ini ────────────────────────
  const tampil = agendaHariIni.slice(0, 5);
  const lebih  = agendaHariIni.length - tampil.length;

  return (
    <div className="overflow-hidden rounded-2xl bg-white" style={{ border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
      {/* Header live */}
      <div className="flex items-center justify-between px-4 py-3" style={{ background: 'rgba(14,165,233,0.04)', borderBottom: '1px solid rgba(14,165,233,0.10)' }}>
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-primary">Live · Agenda Hari Ini</p>
          </div>
          <p className="text-[13px] font-bold text-ink">{hariIniLabel}</p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: 'rgba(14,165,233,0.10)' }}>
          <IconKalender className="h-3.5 w-3.5 text-primary" />
        </div>
      </div>

      {/* Daftar agenda */}
      <div className="divide-y divide-hairline">
        {tampil.map((item) => {
          // Tandai kegiatan yang sedang berlangsung / sudah lewat
          const jamNow = new Date().getHours() * 60 + new Date().getMinutes();
          const [h, m] = (item.jam_mulai ?? '').split(':').map(Number);
          const jamItem = !isNaN(h) ? h * 60 + (m ?? 0) : null;
          const sudahLewat = jamItem !== null && jamItem < jamNow;
          const sedangBerjalan = jamItem !== null && jamItem <= jamNow && jamItem + 90 >= jamNow;

          return (
            <div key={item.id} className="flex items-start gap-3 px-4 py-3.5"
              style={{ opacity: sudahLewat && !sedangBerjalan ? 0.45 : 1 }}>
              {/* Jam */}
              <div className="flex-none w-10 pt-0.5">
                <p className="font-mono text-[11px] font-bold" style={{ color: sedangBerjalan ? 'var(--color-primary)' : '#374151' }}>
                  {item.jam_mulai ? item.jam_mulai.slice(0, 5) : '—:—'}
                </p>
              </div>
              {/* Garis waktu */}
              <div className="flex-none flex flex-col items-center mt-1.5">
                <div className="h-2 w-2 rounded-full border-2 flex-none"
                  style={{
                    borderColor: sedangBerjalan ? 'var(--color-primary)' : sudahLewat ? '#d1d5db' : '#9ca3af',
                    background:  sedangBerjalan ? 'var(--color-primary)' : 'transparent',
                  }} />
              </div>
              {/* Konten */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-[13px] font-semibold text-ink leading-tight">{item.judul}</p>
                  {sedangBerjalan && (
                    <span className="rounded-full px-1.5 py-0.5 font-mono text-[7px] font-bold uppercase tracking-wider text-white"
                      style={{ background: 'var(--color-primary)' }}>
                      Sekarang
                    </span>
                  )}
                </div>
                {item.lokasi && (
                  <p className="mt-0.5 text-[11px] text-charcoal">{item.lokasi}</p>
                )}
                {item.deskripsi && (
                  <p className="mt-0.5 text-[11px] text-ash leading-relaxed">{item.deskripsi}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-hairline px-4 py-2.5" style={{ background: 'rgba(0,0,0,0.015)' }}>
        {lebih > 0 && <p className="text-[11px] text-charcoal">+{lebih} agenda lainnya</p>}
        <Link to="/profil/agenda"
          className="ml-auto inline-flex items-center gap-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-primary">
          Lihat Semua <IconChevron className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

// ── Quick Actions ─────────────────────────────────────────────

function QuickAction({ to, label, icon, accent = false }: {
  to: string; label: string; icon: ReactNode; accent?: boolean;
}) {
  return (
    <Link to={to} className="flex flex-col items-center gap-2 active:scale-[0.93] transition-transform">
      <div
        className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl"
        style={accent
          ? { background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', boxShadow: '0 4px 12px rgba(14,165,233,0.30)' }
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
    { to: '/ibadah/jadwal-sholat', label: 'Sholat',         icon: <IconMoon       className="h-5 w-5" /> },
    { to: '/profil/agenda',        label: 'Agenda',         icon: <IconKalender   className="h-5 w-5" /> },
    { to: '/peta',                 label: 'Peta',           icon: <IconPeta       className="h-5 w-5" /> },
    { to: '/panduan/manasik-interaktif', label: 'Manasik', icon: <IconIbadah className="h-5 w-5" /> },
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

const moreFeatures = [
  { to: '/panduan/manasik-interaktif', label: 'Manasik Interaktif',  icon: <IconIbadah   className="h-4 w-4" /> },
  { to: '/profil/jurnal',              label: 'Jurnal Perjalanan',   icon: <IconJurnal   className="h-4 w-4" /> },
  { to: '/profil/agenda',              label: 'Agenda Perjalanan',   icon: <IconKalender className="h-4 w-4" /> },
  { to: '/profil/sertifikat',          label: 'Sertifikat Digital',  icon: <IconSertifikat className="h-4 w-4" /> },
];

const faseBadge: Record<string, string> = {
  persiapan:    'Fase Persiapan',
  'tanah-suci': '🕌 Di Tanah Suci',
  selesai:      '✨ Ibadah Selesai',
};

// ── Beranda ───────────────────────────────────────────────────

export default function Beranda() {
  const { jamaah, tenant } = useAuth();

  const [agendaHariIni, setAgendaHariIni] = useState<AgendaItemRow[]>([]);
  useEffect(() => {
    if (!tenant?.id) return;
    const today = new Date().toISOString().split('T')[0];
    supabase
      .from('agenda_items').select('*').eq('tenant_id', tenant.id).eq('tanggal', today)
      .order('jam_mulai', { ascending: true })
      .then(({ data }) => { setAgendaHariIni((data as AgendaItemRow[]) ?? []); });
  }, [tenant?.id]);

  if (!jamaah) return null;

  const firstName   = jamaah.nama.split(' ')[0];
  const namaTravel  = tenant?.nama_travel ?? jamaah.travel;
  const hariMenuju  = tenant?.tanggal_keberangkatan ? hitungHariMenuju(tenant.tanggal_keberangkatan) : null;
  const phaseActions = getPhaseActions(jamaah.fase);

  return (
    <>
      {/* ==================== MOBILE ==================== */}
      <div className="lg:hidden min-h-screen bg-canvas overflow-x-hidden">

        {/* ── HERO HEADER ─────────────────────────────── */}
        <div className="relative overflow-hidden" style={{ height: 'clamp(220px, 52vw, 300px)' }}>
          <img src={heroBg} alt="" aria-hidden
            className="absolute inset-0 h-full w-full object-cover animate-ken-burns"
            style={{ objectPosition: 'center 38%' }} />
          <div className="pointer-events-none absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(5,10,20,0.55) 0%, transparent 45%)' }} />
          <div className="pointer-events-none absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(5,10,20,0.92) 0%, rgba(5,10,20,0.40) 40%, transparent 70%)' }} />

          {/* Logo travel */}
          <div className="absolute right-4 flex items-center" style={{ top: 'max(1rem, env(safe-area-inset-top))' }}>
            <img src={tenant?.logo_url || undefined} alt={namaTravel}
              className="h-5 w-auto max-w-[80px] object-contain"
              style={{ filter: 'brightness(0) invert(1) opacity(0.55)' }}
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
          </div>

          {/* Greeting */}
          <div className="absolute inset-x-0 bottom-0 px-5 pb-12">
            <p className="font-mono text-[9.5px] uppercase tracking-[0.30em] text-white/40 mb-0.5">
              Assalamu'alaikum
            </p>
            <h1 className="font-display font-bold text-white" style={{ fontSize: 'clamp(26px,8vw,38px)', letterSpacing: '-1px', lineHeight: 1.05 }}>
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
        <div className="relative z-10 -mt-6 rounded-t-[28px] bg-canvas px-4 pt-4 pb-32 space-y-4">

          {/* Search */}
          <GlobalSearch />

          {/* ★ LIVE ITINERARY — hero card ★ */}
          <KartuLiveItinerary
            fase={jamaah.fase}
            hariMenuju={hariMenuju}
            namaTravel={namaTravel}
            agendaHariIni={agendaHariIni}
            tanggalKeberangkatan={tenant?.tanggal_keberangkatan ?? null}
          />

          {/* Pengumuman dari travel */}
          <PinnedAnnouncementCard />

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

          {/* Kartu identitas jamaah */}
          <TripIdentityCard />

          {/* Kontak darurat */}
          <EmergencyGuideCard />

          {/* Fitur lainnya */}
          <div>
            <p className="mb-2.5 font-mono text-[8.5px] uppercase tracking-[0.28em] text-stone">Fitur Lainnya</p>
            <div className="rounded-2xl bg-white overflow-hidden divide-y divide-hairline"
              style={{ border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              {moreFeatures.map(({ to, label, icon }) => (
                <Link key={to} to={to} className="flex items-center gap-3 px-4 py-3.5 active:bg-surface-bone transition-colors">
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-xl bg-surface-bone text-charcoal">{icon}</span>
                  <span className="flex-1 text-[13px] font-semibold text-ink">{label}</span>
                  <IconChevron className="h-3.5 w-3.5 text-ash" />
                </Link>
              ))}
            </div>
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

          {/* Live Itinerary desktop */}
          <KartuLiveItinerary
            fase={jamaah.fase}
            hariMenuju={hariMenuju}
            namaTravel={namaTravel}
            agendaHariIni={agendaHariIni}
            tanggalKeberangkatan={tenant?.tanggal_keberangkatan ?? null}
          />

          <PinnedAnnouncementCard />

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

          <TripIdentityCard />
          <EmergencyGuideCard />
        </div>

        {/* Kolom kanan */}
        <div className="flex flex-col">
          <div className="relative flex-none" style={{ height: '220px' }}>
            <img src={heroBg} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: 'center 30%' }} />
            <div className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(5,10,20,0.4) 0%, rgba(5,10,20,0.82) 100%)' }} />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/40">Jamaah</p>
              <p className="mt-0.5 font-display text-[24px] font-bold text-white leading-tight">{jamaah.nama}</p>
              <p className="mt-0.5 font-mono text-[10px] tracking-widest text-sky-200/50">{jamaah.kodeAktivasi}</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <p className="font-mono text-[8.5px] uppercase tracking-[0.28em] text-stone">Fitur Lainnya</p>
            <div className="rounded-2xl bg-white overflow-hidden divide-y divide-hairline"
              style={{ border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              {moreFeatures.map(({ to, label, icon }) => (
                <Link key={to} to={to} className="flex items-center gap-3 px-4 py-3.5 hover:bg-surface-bone transition-colors">
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-xl bg-surface-bone text-charcoal">{icon}</span>
                  <span className="flex-1 text-[13px] font-semibold text-ink">{label}</span>
                  <IconChevron className="h-3.5 w-3.5 text-ash" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
