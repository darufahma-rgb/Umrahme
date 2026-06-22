import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getTodayInstruction,
  getLatestAnnouncement,
  getOperationalInfo,
  whatsappLink,
  type TravelAnnouncement,
  type DailyInstruction,
} from '../../data/travelCompanion';
import type { Fase } from '../../types';
import { IconChevron } from '../icons';

// ── Ikon ──────────────────────────────────────────────────────

function IconBell({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function IconPhone({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.74a16 16 0 0 0 6.26 6.26l1.28-1.28a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function IconWhatsapp({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

function IconClipboard({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  );
}

// ── 1. TripIdentityCard ────────────────────────────────────────

export function TripIdentityCard() {
  const { jamaah, tenant } = useAuth();
  if (!jamaah) return null;

  const info        = getOperationalInfo(tenant ?? null);
  const firstName   = jamaah.nama.split(' ')[0];
  const namaTravel  = tenant?.nama_travel ?? jamaah.travel;
  const rombongan   = jamaah.rombongan ?? info.groupCode;
  const bus         = jamaah.nomorBus  ?? info.busNumber;
  const kamar       = jamaah.nomorKamar ?? info.roomNumber;
  const hotelMakkah  = jamaah.hotelMakkah  ?? info.hotelMakkah;
  const hotelMadinah = jamaah.hotelMadinah ?? info.hotelMadinah;

  return (
    <div className="overflow-hidden rounded-2xl border border-hairline bg-white shadow-drop-card">
      {/* Stripe warna travel */}
      <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-deep) 100%)' }} />
      <div className="p-4">
        {/* Greeting */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[8.5px] uppercase tracking-[0.28em] text-mute">
              Aplikasi Jamaah
            </p>
            <p className="mt-0.5 text-[13px] font-bold text-primary leading-tight">{namaTravel}</p>
            <h2 className="mt-0.5 font-display text-[22px] font-bold leading-tight text-ink" style={{ letterSpacing: '-0.5px' }}>
              Assalamu'alaikum, {firstName}
            </h2>
            <p className="font-mono text-[10px] text-ash mt-0.5 tracking-wider">{jamaah.nomorJamaah}</p>
          </div>
          <Link to="/profil/kartu"
            className="flex-none rounded-xl bg-surface-bone px-3 py-2 text-[10px] font-bold text-charcoal active:scale-[0.96] transition-all hover:bg-primary/10 hover:text-primary whitespace-nowrap">
            Kartu →
          </Link>
        </div>

        {/* Chips: Rombongan · Bus · Kamar */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {[rombongan, bus, `Kamar ${kamar}`].map((v) => (
            <span key={v}
              className="rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold text-charcoal"
              style={{ background: 'rgba(0,0,0,0.045)', border: '1px solid rgba(0,0,0,0.06)' }}>
              {v}
            </span>
          ))}
        </div>

        {/* Hotel Makkah + Madinah */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          {[
            { city: 'Makkah', hotel: hotelMakkah,  dot: 'var(--color-primary)' },
            { city: 'Madinah', hotel: hotelMadinah, dot: '#22c55e' },
          ].map(({ city, hotel, dot }) => (
            <div key={city} className="rounded-xl bg-surface-bone px-2.5 py-2">
              <div className="flex items-center gap-1 mb-0.5">
                <div className="h-1.5 w-1.5 rounded-full flex-none" style={{ background: dot }} />
                <p className="font-mono text-[7px] uppercase tracking-[0.15em] text-ash">{city}</p>
              </div>
              <p className="text-[11px] font-semibold leading-tight text-ink">{hotel}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 2. TripProgressCard ───────────────────────────────────────

const STEPS: { label: string; short: string }[] = [
  { label: 'Persiapan',   short: 'Persiapan' },
  { label: 'Keberangkatan', short: 'Berangkat' },
  { label: 'Tanah Suci',  short: 'Tanah Suci' },
  { label: 'Selesai',     short: 'Selesai' },
];

function faseToStep(fase: Fase): number {
  if (fase === 'tanah-suci') return 2;
  if (fase === 'selesai')    return 3;
  return 0; // persiapan
}

const FASE_LABEL: Record<string, string> = {
  persiapan:    'Fase Persiapan Keberangkatan',
  'tanah-suci': 'Sedang Berada di Tanah Suci',
  selesai:      'Perjalanan Ibadah Selesai',
};

export function TripProgressCard() {
  const { jamaah } = useAuth();
  if (!jamaah) return null;

  const activeStep = faseToStep(jamaah.fase);

  return (
    <div className="rounded-2xl border border-hairline bg-white p-4 shadow-drop-card">
      <p className="font-mono text-[8.5px] uppercase tracking-[0.28em] text-mute mb-1">Fase Perjalanan</p>
      <p className="text-[13px] font-bold text-ink mb-3">{FASE_LABEL[jamaah.fase] ?? jamaah.fase}</p>

      {/* Stepper */}
      <div className="flex items-center gap-0">
        {STEPS.map((step, i) => {
          const done   = i < activeStep;
          const active = i === activeStep;
          const isLast = i === STEPS.length - 1;
          return (
            <div key={step.label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center flex-none" style={{ minWidth: 0 }}>
                <div
                  className="flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold transition-all"
                  style={{
                    background: done ? 'var(--color-primary)' : active ? 'var(--color-primary)' : 'rgba(0,0,0,0.06)',
                    color: done || active ? '#fff' : '#9ca3af',
                    boxShadow: active ? '0 0 0 3px rgba(14,165,233,0.18)' : 'none',
                  }}
                >
                  {done ? '✓' : i + 1}
                </div>
                <p className={`mt-1 text-[9px] font-semibold text-center leading-tight ${done || active ? 'text-primary' : 'text-ash'}`}
                  style={{ maxWidth: '44px' }}>
                  {step.short}
                </p>
              </div>
              {!isLast && (
                <div className="flex-1 h-0.5 mx-1 rounded-full"
                  style={{ background: done ? 'var(--color-primary)' : 'rgba(0,0,0,0.07)' }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── 3. TodayInstructionCard ───────────────────────────────────

export function TodayInstructionCard() {
  const { tenant } = useAuth();
  const instr: DailyInstruction = getTodayInstruction(tenant?.id);

  return (
    <div className="overflow-hidden rounded-2xl border border-hairline bg-white shadow-drop-card">
      <div className="flex items-center gap-2.5 px-4 pt-3.5 pb-3">
        <div className="flex h-8 w-8 flex-none items-center justify-center rounded-xl"
          style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', border: '1px solid rgba(34,197,94,0.16)' }}>
          <IconClipboard className="h-3.5 w-3.5 text-emerald-500" />
        </div>
        <div>
          <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-mute">Arahan Hari Ini</p>
          <p className="text-[13px] font-bold text-ink leading-tight">{instr.title}</p>
        </div>
      </div>
      <div className="h-px bg-hairline mx-4" />
      <div className="px-4 py-3 space-y-2">
        {[
          { label: 'Jam Kumpul',  value: instr.meetingTime },
          { label: 'Titik Kumpul', value: instr.meetingPoint },
          { label: 'Pakaian',     value: instr.dressCode },
          { label: 'Bawa',        value: instr.bringItems.join(', ') },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-start gap-2">
            <p className="flex-none font-mono text-[9px] uppercase tracking-[0.12em] text-mute pt-0.5" style={{ minWidth: '72px' }}>{label}</p>
            <p className="flex-1 text-[12px] font-semibold text-ink leading-snug">{value}</p>
          </div>
        ))}
        {instr.note && (
          <div className="mt-1 rounded-xl px-3 py-2" style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.12)' }}>
            <p className="text-[11px] text-emerald-700 leading-relaxed">📌 {instr.note}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── 4. PinnedAnnouncementCard ─────────────────────────────────

export function PinnedAnnouncementCard() {
  const { tenant } = useAuth();
  const [announcement, setAnnouncement] = useState<TravelAnnouncement | null>(null);

  useEffect(() => {
    getLatestAnnouncement(tenant?.id ?? null).then(setAnnouncement);
  }, [tenant?.id]);

  if (!announcement) return null;

  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{
        background: announcement.important ? 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' : '#ffffff',
        border: `1.5px solid ${announcement.important ? 'rgba(212,162,78,0.28)' : 'rgba(0,0,0,0.07)'}`,
      }}
    >
      <div className="flex items-center gap-2 px-4 pt-3.5 pb-2">
        <div className="flex h-8 w-8 flex-none items-center justify-center rounded-xl"
          style={{ background: 'rgba(212,162,78,0.14)', border: '1px solid rgba(212,162,78,0.20)' }}>
          <IconBell className="h-3.5 w-3.5 text-[#a07828]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            {announcement.important && (
              <span className="rounded-full px-2 py-0.5 font-mono text-[7px] font-bold uppercase tracking-[0.15em]"
                style={{ background: 'rgba(212,162,78,0.20)', color: '#a07828' }}>
                Penting
              </span>
            )}
            <span className="font-mono text-[7.5px] uppercase tracking-[0.12em] text-mute">
              {announcement.label} · Dari Travel
            </span>
          </div>
          <p className="text-[13px] font-bold leading-snug text-ink mt-0.5">{announcement.title}</p>
        </div>
      </div>
      <div className="px-4 pb-2">
        <p className="text-[11.5px] leading-relaxed text-charcoal">{announcement.content}</p>
      </div>
      <div className="h-px mx-4" style={{ background: 'rgba(0,0,0,0.05)' }} />
      <Link to="/pengumuman"
        className="flex items-center justify-end gap-1 px-4 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#a07828] active:opacity-70 transition-opacity">
        Lihat Semua Pengumuman <IconChevron className="h-3 w-3" />
      </Link>
    </div>
  );
}

// ── 5. EmergencyGuideCard ─────────────────────────────────────

export function EmergencyGuideCard() {
  const { jamaah, tenant } = useAuth();
  if (!jamaah) return null;

  const info          = getOperationalInfo(tenant ?? null);
  const muthowwif     = jamaah.pembimbingNama     ?? info.guideName;
  const muthowwifWa   = jamaah.pembimbingWhatsapp ?? info.guideWhatsapp;
  const tourLeader    = info.tourLeaderName;
  const tourLeaderWa  = info.tourLeaderWhatsapp;

  return (
    <div className="overflow-hidden rounded-2xl border border-hairline bg-white shadow-drop-card">
      <div className="flex items-center justify-between px-4 pt-3.5 pb-3">
        <div>
          <p className="font-mono text-[8.5px] uppercase tracking-[0.22em] text-mute">Butuh Bantuan Cepat?</p>
          <p className="text-[12px] text-charcoal mt-0.5">Hubungi pembimbing jika tersesat atau butuh bantuan.</p>
        </div>
      </div>
      <div className="h-px bg-hairline mx-4" />

      {/* Muthowwif */}
      <div className="px-4 py-3 flex items-center gap-3">
        <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl"
          style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', border: '1px solid rgba(14,165,233,0.14)' }}>
          <IconPhone className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-ink leading-tight">{muthowwif}</p>
          <p className="text-[10px] text-charcoal">{info.guideRole}</p>
        </div>
        <div className="flex gap-1.5 flex-none">
          <a href={whatsappLink(muthowwifWa)} target="_blank" rel="noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white active:scale-[0.97] transition-all"
            style={{ background: '#25D366' }}>
            <IconWhatsapp className="h-4 w-4" />
          </a>
          <a href={`tel:${muthowwifWa}`}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-hairline bg-surface-bone text-ink active:scale-[0.97] transition-all">
            <IconPhone className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <div className="h-px bg-hairline mx-4" />

      {/* Tour Leader */}
      <div className="px-4 py-3 flex items-center gap-3">
        <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl"
          style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', border: '1px solid rgba(34,197,94,0.14)' }}>
          <IconPhone className="h-4 w-4 text-emerald-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-ink leading-tight">{tourLeader}</p>
          <p className="text-[10px] text-charcoal">{info.tourLeaderRole}</p>
        </div>
        <div className="flex gap-1.5 flex-none">
          <a href={whatsappLink(tourLeaderWa)} target="_blank" rel="noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white active:scale-[0.97] transition-all"
            style={{ background: '#25D366' }}>
            <IconWhatsapp className="h-4 w-4" />
          </a>
          <a href={`tel:${tourLeaderWa}`}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-hairline bg-surface-bone text-ink active:scale-[0.97] transition-all">
            <IconPhone className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

// ── TravelCompanionFlow — orkestrasi ──────────────────────────

export function TravelCompanionFlow({ desktop = false }: { desktop?: boolean }) {
  if (desktop) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <TripIdentityCard />
          <TripProgressCard />
        </div>
        <TodayInstructionCard />
        <PinnedAnnouncementCard />
        <EmergencyGuideCard />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <TripIdentityCard />
      <TripProgressCard />
      <TodayInstructionCard />
      <PinnedAnnouncementCard />
      <EmergencyGuideCard />
    </div>
  );
}
